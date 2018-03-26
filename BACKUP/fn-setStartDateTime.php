<?php
    //Trät die Startzeit der jeweiligen Array Anfrage in die Datenbank als DateTime ein
    function setStartDateTime( $pdoConnect, $probenNummer, $tblName, $beginDateTime, $checkIfEingang, $transmitResponse )
    {
        try
        {
            if( $checkIfEingang != false )
            {
                $sql =
                "
                    INSERT INTO
                        $tblName ( probenNummer, $beginDateTime )
                    VALUES 
                        ( :probenNummer, NOW() )
                ";
        
                $pdoStatement = $pdoConnect->prepare( $sql );
                $pdoStatement->bindParam( ':probenNummer', $probenNummer, PDO::PARAM_STR );
                $pdoStatement->execute();
        
                $responseData['success'] = true;
                $responseData['objectItem'] = $probenNummer;
                $responseData['objectTable'] = $tblName;
                $responseData['objectText'] = $beginDateTime . ' Start';

                array_push( $transmitResponse, $responseData );
                return $transmitResponse;
            }
            else
            {
                $responseData['success'] = false;
                $responseData['objectItem'] = $probenNummer;
                $responseData['objectTable'] = $tblName;

                array_push( $transmitResponse, $responseData );
                return $transmitResponse;
            }
        }
        catch( PDOException $pdoException )
        {
            $pdoException = ( array )$pdoException;
            $responseData['success'] = false;
            $responseData['objectItem'] = $probenNummer;
            $responseData['objectTable'] = $tblName;
            $responseData['failCode'] = $pdoException['errorInfo'][0];
            $responseData['pdoException'] = $pdoException['errorInfo'];

            array_push( $transmitResponse, $responseData );
            return $transmitResponse;
            // mail( "adm1n.zpn.verwaltung@gmail.com", "Datenbank Fehler!", json_encode($responseData) );
        }
        
    }