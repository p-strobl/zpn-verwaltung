<?php

function db_connect()
{
    // Database connection data.
    $host       = 'localhost';
    $database   = 'zpn-verwaltung';
    $username   = 'root';
    $password   = 'root';
    $charset    = 'utf8';

    $dsn = "mysql:host=$host;dbname=$database;charset=$charset";
    $options =
    [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];

    $responseData = array
    (
        'success' => false,
        'failCode' => '',
        'objectText' => '',
        'pdoException' => ''
    );

    // try/catch connection to database.
    try 
    {
        $pdoConnect = new PDO( $dsn, $username, $password, $options );

        return $pdoConnect;
    }
    // Database connection failed.
    catch( PDOException $pdoException )
    {
        $responseData['failCode'] = $pdoException->getCode();
        $responseData['objectText'] = 'DB Connection failed';
        $responseData['pdoException'] = $pdoException;
        $pdoConnect = array($responseData);
        // mail( "adm1n.zpn.verwaltung@gmail.com", "Datenbank Fehler!", json_encode($responseData) );
        // $pdoConnect = null;
        die( json_encode( $pdoConnect) );
    }
}