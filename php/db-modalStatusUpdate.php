<?php

require_once($_SERVER['DOCUMENT_ROOT'] . '/php/db-connect.php');

if ( isset( $_POST['updateModalStatus'] ) ) {

    $receivedItem = (object) $_POST['updateModalStatus'];

    $yesRegEx = '/\d{2}-\d{6}-\d{2}/';

    $responseData = new StdClass;

    if (preg_match($yesRegEx, $receivedItem->probenNummer)) {

        try{
            $pdoConnect = db_connect();

            $pdoConnect->beginTransaction();
    
            $sql =
                "
                    INSERT INTO
                        tbl_status(probenNummer, $receivedItem->statusButtonID)
                    VALUES(:probenNummer, :statusButtonValue)
                    ON DUPLICATE KEY UPDATE
                        $receivedItem->statusButtonID = :updateStatusValue
                ";

            $pdoStatement = $pdoConnect->prepare($sql);
            $pdoStatement->bindParam(':probenNummer', $receivedItem->probenNummer, PDO::PARAM_STR);
            $pdoStatement->bindParam(':statusButtonValue', $receivedItem->statusButtonValue, PDO::PARAM_STR);
            $pdoStatement->bindParam(':updateStatusValue', $receivedItem->statusButtonValue, PDO::PARAM_STR);
            $pdoStatement->execute();

            $pdoConnect->commit();

            $responseData->success = true;
            $responseData->successItem = $receivedItem->probenNummer;
            $responseData->statusButtonValue = $receivedItem->statusButtonValue;
            $responseData->statusButtonID = $receivedItem->statusButtonID;
           
        }
        catch(PDOException $pdoException){
            $pdoConnect->rollBack();

            $responseData->success = false;
            $responseData->failItem = $receivedItem->probenNummer;
            $responseData->failCode = $pdoException->getCode();
            $responseData->pdoException = $pdoException;
            // mail( "adm1n.zpn.verwaltung@gmail.com", "Datenbank Fehler!", json_encode($responseData) );
        }
        echo json_encode( $responseData );
        $pdoConnect = null;
    }
}