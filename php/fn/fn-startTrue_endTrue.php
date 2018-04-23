<?php

function startTrue_endTrue($pdoConnect, $probenNummer, $tblName, $beginDateTime, $endDateTime, $berechnungDateTime, $checkIfEingang, $transmitResponse) {
    try {
        $pdoConnect->beginTransaction();

        $sql =
            "
                INSERT INTO
                    $tblName( probenNummer, $endDateTime )
                VALUES
                    ( :probenNummer, NOW() )
                ON DUPLICATE KEY UPDATE
                    $endDateTime = NOW()
            ";
        $pdoStatement = $pdoConnect->prepare($sql);
        $pdoStatement->bindParam(':probenNummer', $probenNummer, PDO::PARAM_STR);
        $pdoStatement->execute();

        $pdoConnect->commit();

        switch( $tblName ) {
            //Prüft ob eine Start und End-Zeit des jeweiligen Datensatz vorhanden ist und trägt dann einen Berechnungs Eintrag in die Datenbank ein.
            case 'tbl_zpnwagen':
                $pdoConnect->beginTransaction();
                $sql =
                    "
                        UPDATE 
                            $tblName, tbl_zpnmustereingang
                        SET 
                            $tblName.$berechnungDateTime = IF( tbl_zpnmustereingang.zpnEingangDateTime IS NOT NULL AND $tblName.$endDateTime IS NOT NULL, TIMEDIFF($tblName.$endDateTime, tbl_zpnmustereingang.zpnEingangDateTime), NULL )
                        WHERE
                            $tblName.probenNummer = :probenNummer
                        AND
                        tbl_zpnmustereingang.probenNummer = :probenNummerPK
                    ";
                $pdoStatement = $pdoConnect->prepare($sql);
                $pdoStatement->bindParam( ':probenNummer', $probenNummer, PDO::PARAM_STR );
                $pdoStatement->bindParam( ':probenNummerPK', $probenNummer, PDO::PARAM_STR );
                $pdoStatement->execute();

                $pdoConnect->commit();

            break;
            default:
                //Prüft ob eine Start und End-Zeit des jeweiligen Datensatz vorhanden ist und trägt dann einen Berechnungs Eintrag in die Datenbank ein.
                $pdoConnect->beginTransaction();
                $sql =
                    "
                        UPDATE 
                            $tblName
                        SET 
                            $berechnungDateTime = IF ($beginDateTime IS NOT NULL && $endDateTime IS NOT NULL, TIMEDIFF($endDateTime, $beginDateTime), NULL )
                        WHERE 
                            probenNummer = :probenNummer
                    ";
                $pdoStatement = $pdoConnect->prepare($sql);
                $pdoStatement->bindParam(':probenNummer', $probenNummer, PDO::PARAM_STR);
                $pdoStatement->execute();

                $pdoConnect->commit();

                if ($tblName === 'tbl_mana') {
                    $pdoConnect->beginTransaction();
                    $sql =
                        "
                            UPDATE 
                                $tblName
                            SET 
                                $tblName.manaBerechnungDateTimeGesamt = IF ($tblName.manaGestelltDateTime IS NOT NULL && $endDateTime IS NOT NULL, TIMEDIFF($endDateTime, $tblName.manaGestelltDateTime), NULL)
                            WHERE 
                                probenNummer = :probenNummer
                        ";
                    $pdoStatement = $pdoConnect->prepare($sql);
                    $pdoStatement->bindParam(':probenNummer', $probenNummer, PDO::PARAM_STR);
                    $pdoStatement->execute();

                    $pdoConnect->commit();
                }
        }
        $responseData['success'] = true;
        $responseData['objectItem'] = $probenNummer;
        $responseData['objectTable'] = $tblName;
        $responseData['objectText'] = $endDateTime . ' Ende eingetragen';
        return $responseData;
    }
    catch( PDOException $pdoException ) {
        $pdoConnect->rollBack();
        return false;
    }
}
