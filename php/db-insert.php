<?php

$path_dbConnect = 'db-connect.php';
require_once($path_dbConnect);

$path_fnSqlSelectObject = 'fn/fn-sqlSelectObject.php';
require_once($path_fnSqlSelectObject);

if (!empty($_POST)) {

    $receivedPostData = json_decode(json_encode($_POST, JSON_FORCE_OBJECT));
    switch (true) {
        case isset($receivedPostData->beurteilungDataSet):
            $receivedPostDataObject = json_decode(json_encode($receivedPostData->beurteilungDataSet, JSON_FORCE_OBJECT));
            break;

        case isset($receivedPostData->musterEingangDataSet):
            $receivedPostDataObject = json_decode(json_encode($receivedPostData->musterEingangDataSet, JSON_FORCE_OBJECT));
            break;

        case isset($receivedPostData->lfgbTextilEingangDataPack):
            $receivedPostDataObject = json_decode(json_encode($receivedPostData->lfgbTextilEingangDataPack, JSON_FORCE_OBJECT));
            break;
        default:
    }

    $responseData = array
    (
        'success' => false,
        'objectItem' => '',
        'objectText' => '',
        'doubleInput' => $errorArray = array(),
        'successInput' => $successArray = array(),
        'failCode' => '',
        'itemCount' => ''
    );

    foreach ($receivedPostDataObject as $i) {

        $pdoConnect = db_connect();
        $pdoObject = new stdClass();
        $sqlSelectBaseObject = sqlSelectObjectBase($pdoConnect, $i->probenNummer, $pdoObject);
        $sqlSelectStatusObject = sqlSelectObjectStatus($pdoConnect, $i->probenNummer, $pdoObject);
        $sqlSelectDateObject = sqlSelectObjectDate($pdoConnect, $i->probenNummer, $pdoObject);

        $yesRegEx = '/\d{2}-\d{6}-\d{2}/';
        $minLength = 12;

        if (preg_match($yesRegEx, $i->probenNummer) && strlen($i->probenNummer) === $minLength) {

            try {
                $pdoConnect->beginTransaction();
                if ($sqlSelectBaseObject->base === false) {
                    $sql =
                        "
                            INSERT INTO 
                                tbl_baserecord( probenNummer, sollDatum )
                            VALUES 
                                ( :probenNummer, :sollDatum )
                        ";
                    $pdoStatement = $pdoConnect->prepare($sql);
                    $pdoStatement->bindParam(':probenNummer', $i->probenNummer, PDO::PARAM_STR);
                    $pdoStatement->bindParam(':sollDatum', $i->sollDatum, PDO::PARAM_STR);
                    $pdoStatement->execute();
                }

                switch (true) {
                    case isset($receivedPostData->beurteilungDataSet):
                        $sql =
                            "
                                INSERT INTO 
                                    tbl_beurteilung( probenNummer, beurteilungBereitgestelltDateTime, anAbteilung )
                                VALUES 
                                    ( :probenNummer, NOW(), :anAbteilung )
                            ";
                        $pdoStatement = $pdoConnect->prepare($sql);
                        $pdoStatement->bindParam(':probenNummer', $i->probenNummer, PDO::PARAM_STR);
                        $pdoStatement->bindParam(':anAbteilung', $i->anAbteilung, PDO::PARAM_STR);

                        $pdoStatement->execute();
                        $pdoConnect->commit();

                    break;
                    case isset($receivedPostData->musterEingangDataSet):
                        switch ('active') {
                            case $receivedPostData->musterEingangDataSet->{0}->mitNickelBack:
                                if ($receivedPostData->musterEingangDataSet->{0}->mitNickelBack === 'active' && !isset($sqlSelectDateObject->date->nickelRueckgabeDateTime)) {
                                    $sql =
                                        "
                                            INSERT INTO 
                                                tbl_nickel( probenNummer, nickelRueckgabeDateTime )
                                            VALUES 
                                                ( :probenNummer, NOW() )
                                        ";
                                    $pdoStatement = $pdoConnect->prepare($sql);
                                    $pdoStatement->bindParam(':probenNummer', $i->probenNummer, PDO::PARAM_STR);
                                    $pdoStatement->execute();

                                    $sql =
                                        "
                                            UPDATE 
                                                tbl_nickel, tbl_zpnmustereingang
                                            SET
                                                tbl_nickel.nickelBerechnung = IF( tbl_zpnmustereingang.zpnEingangDateTime IS NOT NULL AND tbl_nickel.nickelRueckgabeDateTime IS NOT NULL, TIMEDIFF( tbl_nickel.nickelRueckgabeDateTime, tbl_zpnmustereingang.zpnEingangDateTime ), NULL )
                                            WHERE
                                                tbl_nickel.probenNummer = :probenNummer
                                            AND
                                                tbl_zpnmustereingang.probenNummer = :probenNummerZpn
                                        ";
                                    $pdoStatement = $pdoConnect->prepare($sql);
                                    $pdoStatement->bindParam(':probenNummer', $i->probenNummer, PDO::PARAM_STR);
                                    $pdoStatement->bindParam(':probenNummerZpn', $i->probenNummer, PDO::PARAM_STR);
                                    $pdoStatement->execute();
                                    $pdoConnect->commit();
                                }
                            break;
                            case $receivedPostData->musterEingangDataSet->{0}->mitLfgb:
                                if ($receivedPostData->musterEingangDataSet->{0}->mitLfgb === 'active' && isset($sqlSelectDateObject->status->anAbteilung) && !isset($sqlSelectDateObject->status->mitLfgb)) {
                                    $sql =
                                        "
                                            INSERT INTO 
                                                tbl_zpnmustereingang( probenNummer, zpnEingangDateTime, ausderLfgbDateTime )
                                            VALUES 
                                                ( :probenNummer, NOW(), NOW() )
                                        ";
                                    $pdoStatement = $pdoConnect->prepare($sql);
                                    $pdoStatement->bindParam(':probenNummer', $i->probenNummer, PDO::PARAM_STR);
                                    $pdoStatement->execute();

                                    $sql =
                                        "
                                            UPDATE 
                                                tbl_zpnmustereingang, tbl_lfgbmustereingang, tbl_beurteilung
                                            SET
                                                tbl_zpnmustereingang.lfgbZpnBerechnung = IF( tbl_zpnmustereingang.zpnEingangDateTime IS NOT NULL AND tbl_lfgbmustereingang.lfgbEingangDateTime IS NOT NULL, TIMEDIFF( tbl_zpnmustereingang.zpnEingangDateTime, tbl_lfgbmustereingang.lfgbEingangDateTime ), NULL ),
                                                tbl_zpnmustereingang.beurteilungZpnBerechnung = IF( tbl_zpnmustereingang.zpnEingangDateTime IS NOT NULL AND tbl_beurteilung.beurteilungBereitgestelltDateTime  IS NOT NULL, TIMEDIFF( tbl_zpnmustereingang.zpnEingangDateTime, tbl_beurteilung.beurteilungBereitgestelltDateTime ), NULL)
                                            WHERE
                                                tbl_lfgbmustereingang.probenNummer = :probenNummer
                                            AND
                                                tbl_zpnmustereingang.probenNummer = :probenNummerZpn
                                            AND
                                                tbl_beurteilung.probenNummer = :probenNummerBeurteilung
                                        ";
                                    $pdoStatement = $pdoConnect->prepare($sql);
                                    $pdoStatement->bindParam(':probenNummer', $i->probenNummer, PDO::PARAM_STR);
                                    $pdoStatement->bindParam(':probenNummerZpn', $i->probenNummer, PDO::PARAM_STR);
                                    $pdoStatement->bindParam(':probenNummerBeurteilung', $i->probenNummer, PDO::PARAM_STR);
                                    $pdoStatement->execute();

                                    $sql =
                                    "
                                        INSERT INTO 
                                            tbl_status( probenNummer, mitExpress, mitIntern, mitNickel, mitLfgb, mitToys, mit60g, mitKlaerfallBack )
                                        VALUES 
                                            ( :probenNummer, :mitExpress, :mitIntern, :mitNickel, :mitLfgb, :mitToys, :mit60g, :mitKlaerfallBack )
                                    ";
                                    $pdoStatement = $pdoConnect->prepare($sql);
                                    $pdoStatement->bindParam(':probenNummer', $i->probenNummer, PDO::PARAM_STR);
                                    $pdoStatement->bindParam(':mitExpress', $i->mitExpress, PDO::PARAM_STR);
                                    $pdoStatement->bindParam(':mitIntern', $i->mitIntern, PDO::PARAM_STR);
                                    $pdoStatement->bindParam(':mitNickel', $i->mitNickel, PDO::PARAM_STR);
                                    $pdoStatement->bindParam(':mitLfgb', $i->mitLfgb, PDO::PARAM_STR);
                                    $pdoStatement->bindParam(':mitToys', $i->mitToys, PDO::PARAM_STR);
                                    $pdoStatement->bindParam(':mit60g', $i->mit60g, PDO::PARAM_STR);
                                    $pdoStatement->bindParam(':mitKlaerfallBack', $i->mitKlaerfallBack, PDO::PARAM_STR);
                                    $pdoStatement->execute();
                                    $pdoConnect->commit();
                                }
                            break;
                            case $receivedPostData->musterEingangDataSet->{0}->mitKlaerfallBack:

                                $sql =
                                "
                                    INSERT INTO 
                                        tbl_klaerfall( probenNummer, klaerfallEndeDateTime )
                                    VALUES 
                                        ( :probenNummer, NOW() )
                                    ON DUPLICATE KEY UPDATE
                                        tbl_klaerfall.klaerfallEndeDateTime = NOW()
                                ";
                                $pdoStatement = $pdoConnect->prepare($sql);
                                $pdoStatement->bindParam(':probenNummer', $i->probenNummer, PDO::PARAM_STR);
                                $pdoStatement->execute();

                                $sql =
                                "
                                    UPDATE 
                                        tbl_zpnmustereingang, tbl_klaerfall
                                    SET
                                        tbl_klaerfall.klaerfallBerechnung = IF( tbl_klaerfall.klaerfallBeginnDateTime IS NOT NULL AND tbl_klaerfall.klaerfallEndeDateTime IS NOT NULL, TIMEDIFF( tbl_klaerfall.klaerfallEndeDateTime, tbl_klaerfall.klaerfallBeginnDateTime ), NULL )
                                    WHERE
                                        tbl_klaerfall.probenNummer = :probenNummer
                                    AND
                                        tbl_zpnmustereingang.probenNummer = :probenNummerZpn
                                ";
                                $pdoStatement = $pdoConnect->prepare($sql);
                                $pdoStatement->bindParam(':probenNummer', $i->probenNummer, PDO::PARAM_STR);
                                $pdoStatement->bindParam(':probenNummerZpn', $i->probenNummer, PDO::PARAM_STR);
                                $pdoStatement->execute();
                                $pdoConnect->commit();
                            break;

                            default:
                                $sql =
                                    "
                                        INSERT INTO 
                                            tbl_zpnmustereingang( probenNummer, zpnEingangDateTime )
                                        VALUES 
                                            ( :probenNummer, NOW() )
                                    ";
                                $pdoStatement = $pdoConnect->prepare($sql);
                                $pdoStatement->bindParam(':probenNummer', $i->probenNummer, PDO::PARAM_STR);
                                $pdoStatement->execute();

                                $sql =
                                    "
                                        INSERT INTO 
                                            tbl_status( probenNummer, mitExpress, mitIntern, mitNickel, mitLfgb, mitToys, mit60g, mitKlaerfallBack )
                                        VALUES 
                                            ( :probenNummer, :mitExpress, :mitIntern, :mitNickel, :mitLfgb, :mitToys, :mit60g, :mitKlaerfallBack )
                                    ";
                                $pdoStatement = $pdoConnect->prepare($sql);
                                $pdoStatement->bindParam(':probenNummer', $i->probenNummer, PDO::PARAM_STR);
                                $pdoStatement->bindParam(':mitExpress', $i->mitExpress, PDO::PARAM_STR);
                                $pdoStatement->bindParam(':mitIntern', $i->mitIntern, PDO::PARAM_STR);
                                $pdoStatement->bindParam(':mitNickel', $i->mitNickel, PDO::PARAM_STR);
                                $pdoStatement->bindParam(':mitLfgb', $i->mitLfgb, PDO::PARAM_STR);
                                $pdoStatement->bindParam(':mitToys', $i->mitToys, PDO::PARAM_STR);
                                $pdoStatement->bindParam(':mit60g', $i->mit60g, PDO::PARAM_STR);
                                $pdoStatement->bindParam(':mitKlaerfallBack', $i->mitKlaerfallBack, PDO::PARAM_STR);
                                $pdoStatement->execute();

                                $sql =
                                    "
                                        UPDATE 
                                            tbl_beurteilung, tbl_zpnmustereingang
                                        SET 
                                            tbl_zpnmustereingang.beurteilungZpnBerechnung = IF( tbl_zpnmustereingang.zpnEingangDateTime IS NOT NULL AND tbl_beurteilung.beurteilungBereitgestelltDateTime IS NOT NULL, TIMEDIFF(tbl_zpnmustereingang.zpnEingangDateTime, tbl_beurteilung.beurteilungBereitgestelltDateTime), NULL )
                                        WHERE
                                            tbl_beurteilung.probenNummer = :probenNummerBeurteilung
                                        AND
                                            tbl_zpnmustereingang.probenNummer = :probenNummerZpn
                                    ";
                                $pdoStatement = $pdoConnect->prepare($sql);
                                $pdoStatement->bindParam(':probenNummerBeurteilung', $i->probenNummer, PDO::PARAM_STR);
                                $pdoStatement->bindParam(':probenNummerZpn', $i->probenNummer, PDO::PARAM_STR);
                                $pdoStatement->execute();

                                $pdoConnect->commit();
                        }
                        break;
                        case isset($receivedPostData->lfgbTextilEingangDataPack):
                            if ($sqlSelectStatusObject->status->anAbteilung === 'LFGB') {
                                $sql =
                                "
                                    INSERT INTO 
                                        tbl_lfgbmustereingang( probenNummer, lfgbEingangDateTime )
                                    VALUES 
                                        ( :probenNummer, NOW() )
                                ";
                                $pdoStatement = $pdoConnect->prepare($sql);
                                $pdoStatement->bindParam(':probenNummer', $i->probenNummer, PDO::PARAM_STR);
                                $pdoStatement->execute();
                                $sql =
                                "
                                    UPDATE 
                                        tbl_beurteilung, tbl_lfgbmustereingang
                                    SET 
                                        tbl_lfgbmustereingang.beurteilungLfgbBerechnung = IF( tbl_lfgbmustereingang.lfgbEingangDateTime IS NOT NULL AND tbl_beurteilung.beurteilungBereitgestelltDateTime IS NOT NULL, TIMEDIFF(tbl_lfgbmustereingang.lfgbEingangDateTime, tbl_beurteilung.beurteilungBereitgestelltDateTime), NULL )
                                    WHERE
                                        tbl_beurteilung.probenNummer = :probenNummerBeurteilung
                                    AND
                                        tbl_lfgbmustereingang.probenNummer = :probenNummer
                                ";
                                $pdoStatement = $pdoConnect->prepare($sql);
                                $pdoStatement->bindParam(':probenNummer', $i->probenNummer, PDO::PARAM_STR);
                                $pdoStatement->bindParam(':probenNummerBeurteilung', $i->probenNummer, PDO::PARAM_STR);
                                $pdoStatement->execute();
                            } else if ($sqlSelectStatusObject->status->anAbteilung === 'Textilphysik') {
                                $sql =
                                "
                                    INSERT INTO 
                                        tbl_textilmustereingang( probenNummer, textilEingangDateTime )
                                    VALUES 
                                        ( :probenNummer, NOW() )
                                ";
                                $pdoStatement = $pdoConnect->prepare($sql);
                                $pdoStatement->bindParam(':probenNummer', $i->probenNummer, PDO::PARAM_STR);
                                $pdoStatement->execute();
                                $sql =
                                "
                                    UPDATE 
                                        tbl_beurteilung, tbl_textilmustereingang
                                    SET 
                                        tbl_textilmustereingang.beurteilungTextilBerechnung = IF( tbl_textilmustereingang.textilEingangDateTime IS NOT NULL AND tbl_beurteilung.beurteilungBereitgestelltDateTime IS NOT NULL, TIMEDIFF(tbl_textilmustereingang.textilEingangDateTime, tbl_beurteilung.beurteilungBereitgestelltDateTime), NULL )
                                    WHERE
                                        tbl_beurteilung.probenNummer = :probenNummerBeurteilung
                                    AND
                                        tbl_textilmustereingang.probenNummer = :probenNummer
                                ";
                                $pdoStatement = $pdoConnect->prepare($sql);
                                $pdoStatement->bindParam(':probenNummer', $i->probenNummer, PDO::PARAM_STR);
                                $pdoStatement->bindParam(':probenNummerBeurteilung', $i->probenNummer, PDO::PARAM_STR);
                                $pdoStatement->execute();
                            }
                        $pdoConnect->commit();

                    break;
                    default:
                }
                array_push($successArray, $i->probenNummer);
                $responseData['successInput'] = $successArray;
                $responseData['success'] = true;
                $responseData['itemCount'] ++;
            } catch (PDOException $pdoException) {
                $pdoConnect->rollBack();
                preg_match('/\d{2}-\d{6}-\d{2}/', $pdoException->errorInfo[2], $errorItem);
                array_push($errorArray, $errorItem);
                $responseData['doubleInput'] = $errorArray;
                $responseData['failCode'] = $pdoException->getCode();
                mail( "adm1n.zpn.verwaltung@gmail.com", "Datenbank Fehler!", json_encode($responseData) );
            }
        }
    }
    echo json_encode($responseData);
    $pdoConnect = null;
}

