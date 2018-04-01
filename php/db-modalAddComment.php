<?php

require_once 'db-connect.php';
$receivedItem = (object) $_POST['updateAddKommentar'];
$yesRegEx = '/\d{2}-\d{6}-\d{2}/';
    if (preg_match($yesRegEx, $receivedItem->probenNummer)) {

        try {
            $pdoConnect = db_connect();
            $pdoConnect->beginTransaction();

            $pdoConnect->commit();

            $responseData = new StdClass;
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