<?php
    //Prüft ob ein Datensatz bereits vorhanden ist und wenn nicht, wird der Datensatu nachgetragen ohne Eingangs Zeitpunkt
    function checkIfEingang( $pdoConnect, $probenNummer, $sollDatum, $transmitResponse ){
        try {
            include_once 'fn-sqlSelectObject.php';

            $sqlSelectObject = sqlSelectObject( $pdoConnect, $probenNummer );

            if ($sqlSelectObject === false){
                
                $pdoConnect->beginTransaction();

                $sql =
                "
                    INSERT INTO 
                        tbl_mustereingang ( probenNummer, sollDatum, eingangDateTime )
                    VALUES 
                        ( :probenNummer, :sollDatum, NULL )
                ";
                $pdoStatement = $pdoConnect->prepare( $sql );
                $pdoStatement->bindParam( ':probenNummer', $probenNummer, PDO::PARAM_STR );
                $pdoStatement->bindParam( ':sollDatum', $sollDatum, PDO::PARAM_STR );
                $pdoStatement->execute();

                $pdoConnect->commit();

                $responseData['success'] = true;
                $responseData['objectItem'] = $probenNummer;
            } else {
                $responseData['success'] = false;
                $responseData['objectItem'] = $probenNummer;
                $responseData['objectTable'] = 'tbl_mustereingang';
                $responseData['objectText'] = 'Bereits vorhanden';
                // array_push( $transmitResponse, $responseData );
            }
        } catch (PDOException $pdoException){
            $pdoException = ( array )$pdoException;
            $responseData['success'] = false;
            $responseData['objectItem'] = $probenNummer;
            $responseData['objectTable'] = $tblName;
            $responseData['failCode'] = $pdoException['errorInfo'][0];
            $responseData['pdoException'] = $pdoException['errorInfo'];
            // array_push( $transmitResponse, $responseData );
            
            $pdoConnect->rollBack();
            return $responseData;
            // mail( "adm1n.zpn.verwaltung@gmail.com", "Datenbank Fehler!", json_encode($responseData) );
        }
        return $responseData;
        // return $transmitResponse;
    }