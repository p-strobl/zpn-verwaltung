<?php

function startFalse_endTrue($pdoConnect, $probenNummer, $tblName, $beginDateTime, $endDateTime, $berechnungDateTime, $checkIfEingang, $transmitResponse) {
    try {
        $pdoConnect->beginTransaction();

        $sql =
        "
            INSERT INTO
                $tblName(probenNummer, $endDateTime)
            VALUES 
                (:probenNummer, NOW())
            ON DUPLICATE KEY UPDATE
                $endDateTime = NOW()
        ";
        $pdoStatement = $pdoConnect->prepare($sql);
        $pdoStatement->bindParam(':probenNummer', $probenNummer, PDO::PARAM_STR);
        $pdoStatement->execute();

        $pdoConnect->commit();

        $responseData['success'] = true;
        $responseData['objectItem'] = $probenNummer;
        $responseData['objectTable'] = $tblName;
        $responseData['objectText'] = 'Start nicht vorhanden';

        return $responseData;
    }
    catch (PDOException $pdoException) {
        $pdoConnect->rollBack();
        return false;
    }
}