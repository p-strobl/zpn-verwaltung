<?php

require 'db-connect.php';

if (!empty($_POST)) {

    $receivedPostData = json_decode(json_encode($_POST, JSON_FORCE_OBJECT));
//    $receivedPostDataObject = json_decode(json_encode($receivedPostData[0], JSON_FORCE_OBJECT));
    switch (true) {
        case isset($receivedPostData->beurteilungDataSet):
            $receivedPostDataObject = json_decode(json_encode($receivedPostData->beurteilungDataSet, JSON_FORCE_OBJECT));
            break;

        case isset($receivedPostData->musterEingangDataSet):
            $receivedPostDataObject = json_decode(json_encode($receivedPostData->musterEingangDataSet, JSON_FORCE_OBJECT));
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
        'failCode' => ''
    );

    foreach ($receivedPostDataObject as $i) {

        $yesRegEx = '/\d{2}-\d{6}-\d{2}/';
        $minLength = 12;

        if (preg_match($yesRegEx, $i->probenNummer) && strlen($i->probenNummer) === $minLength) {

            $pdoConnect = db_connect();


            try {
                $pdoConnect->beginTransaction();
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
                        // $pdoConnect->beginTransaction();
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
                        $pdoConnect->commit();
                        break;
                    default:
                }
                array_push($successArray, $i->probenNummer);
                $responseData['successInput'] = $successArray;
                $responseData['success'] = true;
            } catch (PDOException $pdoException) {
                $pdoConnect->rollBack();
                preg_match('/\d{2}-\d{6}-\d{2}/', $pdoException->errorInfo[2], $errorItem);
                array_push($errorArray, $errorItem);
                $responseData['doubleInput'] = $errorArray;
                $responseData['failCode'] = $pdoException->getCode();
                // mail( "adm1n.zpn.verwaltung@gmail.com", "Datenbank Fehler!", json_encode($responseData) );
            }
        }
    }
    echo json_encode($responseData);
    $pdoConnect = null;
}

