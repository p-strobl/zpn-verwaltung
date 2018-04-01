<?php

require_once 'db-connect.php';
require_once 'db-getTiming.php';

if ( isset($_POST['getStatusItems']) )
{

    $receivedData = $_POST['getStatusItems'];
    $yesRegEx = '/\d{2}-\d{6}-\d{2}/';

    $responseData = array
    (
        'success' => false,
        'successItem' => '',
        'failItem' => '',
        'failCode' => '',
        'pdoException' => ''
    );

    if ( preg_match($yesRegEx, $receivedData) )
    {

        try
        {

            $requestedData = getTiming($receivedData);

            if ( $requestedData != false )
            {

                $responseData['success'] = true;
                $responseData['successItem'] = $requestedData;

                die( json_encode($responseData) );

            } 
            else
            {

                header("Content-type: application/json");
                $responseData['failItem'] = $receivedData;
                $responseData['failCode'] = 'no-entry';

                die( json_encode($responseData) );

            }
        }
        catch ( PDOException $pdoException )
        {
            $responseData['failCode'] = $pdoException->errorInfo[0];
            $responseData['pdoException'] = $pdoException;

            die( json_encode($responseData) );
            // mail( "adm1n.zpn.verwaltung@gmail.com", "Datenbank Fehler!", json_encode($responseData) );
        }
        $pdoConnect = null;
    }
}