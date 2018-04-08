<?php
    //Trät die Startzeit der jeweiligen Array Anfrage in die Datenbank als DateTime ein
    function startFalse($pdoConnect, $probenNummer, $tblName, $beginDateTime, $checkIfEingang, $transmitResponse) {
        try {
            $pdoConnect->beginTransaction();

            $sql =
            "
                INSERT INTO
                    $tblName(probenNummer, $beginDateTime)
                VALUES 
                    (:probenNummer, NOW())
                ON DUPLICATE KEY UPDATE
                    $beginDateTime = NOW()
            ";

            $pdoStatement = $pdoConnect->prepare($sql);
            $pdoStatement->bindParam(':probenNummer', $probenNummer, PDO::PARAM_STR);
            $pdoStatement->execute();

            $pdoConnect->commit();

            $responseData['success'] = true;
            $responseData['objectItem'] = $probenNummer;
            $responseData['objectTable'] = $tblName;
            $responseData['objectText'] = $beginDateTime . ' Start';
        }
        catch (PDOException $pdoException) {
            $pdoException = (array)$pdoException;
            $responseData['success'] = false;
            $responseData['objectItem'] = $probenNummer;
            $responseData['objectTable'] = $tblName;
            $responseData['failCode'] = $pdoException['errorInfo'][0];
            $responseData['pdoException'] = $pdoException['errorInfo'];

            $pdoConnect->rollBack();
            return $responseData;
            // mail( "adm1n.zpn.verwaltung@gmail.com", "Datenbank Fehler!", json_encode($responseData) );
        }
        return $responseData;
    }