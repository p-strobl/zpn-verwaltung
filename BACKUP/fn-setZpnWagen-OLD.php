<?php

function setZpnWagen( $pdoConnect, $probenNummer, $tblName, $endDateTime, $berechnungDateTime, $checkIfEingang, $transmitResponse )
{
    $sql = 
    "
        SELECT
            probenNummer
        FROM
            $tblName
        WHERE
            probenNummer = :probenNummer
    ";
    $pdoStatement = $pdoConnect->prepare( $sql );
    $pdoStatement->bindParam( ':probenNummer', $probenNummer, PDO::PARAM_STR );
    $pdoStatement->execute();
    $pdoObject = $pdoStatement->fetch( PDO::FETCH_OBJ );

    if( $pdoObject != false )
    {
        $sql =
            "
                UPDATE 
                    $tblName, tbl_mustereingang
                SET 
                    $tblName.$berechnungDateTime = IF( tbl_mustereingang.eingangDateTime IS NOT NULL AND $tblName.$endDateTime IS NOT NULL, TIMEDIFF($tblName.$endDateTime, tbl_mustereingang.eingangDateTime), NULL )
                WHERE
                    $tblName.probenNummer = :probenNummer
                AND
                    tbl_mustereingang.probenNummer = :probenNummerPK
            ";
            $pdoStatement = $pdoConnect->prepare($sql);
            $pdoStatement->bindParam( ':probenNummer', $probenNummer, PDO::PARAM_STR );
            $pdoStatement->bindParam( ':probenNummerPK', $probenNummer, PDO::PARAM_STR );
            $pdoStatement->execute();

            $responseData['success'] = true;
            $responseData['objectItem'] = $probenNummer;
            $responseData['objectTable'] = $tblName;
            $responseData['objectText'] = $endDateTime . ' eingetragen';
            array_push( $transmitResponse, $responseData );
    }
    else 
    {
        $responseData['success'] = false;
        $responseData['objectItem'] = $probenNummer;
        $responseData['objectTable'] = $tblName;
        $responseData['objectText'] = 'ZPN Wagen bereits eingetragen';
        array_push( $transmitResponse, $responseData );
    }
    return $transmitResponse;
}