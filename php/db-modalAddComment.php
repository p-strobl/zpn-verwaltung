<?php

require_once($_SERVER['DOCUMENT_ROOT'] . '/php/db-connect.php');

$receivedItem = (object) $_POST['updateAddKommentar'];
$yesRegEx = '/\d{2}-\d{6}-\d{2}/';
$noRegEx = "/('(''|[^'])*')|(;)|(\b(ALTER|CREATE|DELETE|DROP|EXEC(UTE){0,1}|INSERT( +INTO){0,1}|MERGE|SELECT|UPDATE|UNION( +ALL){0,1})\b)/";
$responseData = new StdClass;

    if (preg_match($yesRegEx, $receivedItem->probenNummer) === 1 && preg_match($noRegEx, $receivedItem->modalKommentarText) === 0) {
        $probenNummer = $receivedItem->probenNummer;
        $kommentarText = $receivedItem->modalKommentarText;

        try {
            $pdoConnect = db_connect();
            $pdoConnect->beginTransaction();

            $sql = 
            "
                INSERT INTO
                    tbl_kommentar (probenNummer, kommentarText, kommentarDateTime)
                VALUES
                    (:probenNummer, :kommentarText, NOW())
            ";

            $pdoStatement = $pdoConnect->prepare( $sql );
            $pdoStatement->bindParam( ':probenNummer', $receivedItem->probenNummer, PDO::PARAM_STR );
            $pdoStatement->bindParam( ':kommentarText', $receivedItem->modalKommentarText, PDO::PARAM_STR );
            $pdoStatement->execute();
            
            $pdoConnect->commit();

            $responseData->success = true;
            $responseData->successItem = $receivedItem->probenNummer;
            $responseData->kommentarText = $receivedItem->modalKommentarText;
            $responseData->kommentarDate = date("d.m.Y");
            $responseData->kommentarTime = date("H:i:s");
        }
        catch (PDOException $pdoException){
            $responseData->success = false;
            $responseData->failItem = $receivedItem->probenNummer;
            $responseData->failCode = $pdoException->getCode();
            $responseData->pdoException = $pdoException;
            // mail( "adm1n.zpn.verwaltung@gmail.com", "Datenbank Fehler!", json_encode($responseData) );
        }
        echo json_encode( $responseData );
        $pdoConnect = null;
    }
    else if (preg_match($noRegEx, $receivedItem->modalKommentarText) === 1) {
        $responseData->success = false;
        $responseData->failCode = 999;
        echo json_encode( $responseData );
        $pdoConnect = null;
    }