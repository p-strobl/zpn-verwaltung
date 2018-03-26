<?php
    //Trät die Endzeit des jeweiligen Datensatz in die Datenbank als DateTime ein
    function setDateTime( $pdoConnect, $probenNummer, $tblName, $beginDateTime, $endDateTime, $berechnungDateTime, $checkIfEingang, $transmitResponse, $switch )
    {

        include_once 'fn-startTrue_endTrue.php';
        include_once 'fn-startFalse_endTrue.php';
        include_once 'fn-startFalse.php';

        try
        {
            if ( $checkIfEingang != false )
            {
                // Erstellt ein Object des selektieren SQL Datensatzes
                $sqlSelectObject = sqlSelectObject( $pdoConnect, $probenNummer );

                // Welches Ende wurde gewählt? $beginDateTime
                switch( $switch ) 
                {
                    case 'start':
                    // case $beginDateTime:
                        if( !isset( $sqlSelectObject->{$beginDateTime} ) && !isset( $sqlSelectObject->{$endDateTime} ) )
                        {
                            $responseData = startFalse( $pdoConnect, $probenNummer, $tblName, $beginDateTime, $checkIfEingang, $transmitResponse );
                            // array_push( $transmitResponse, $responseData );
                        }
                        elseif( isset( $sqlSelectObject->{$beginDateTime} ) )
                        {
                            $responseData['success'] = false;
                            $responseData['objectItem'] = $probenNummer;
                            $responseData['objectTable'] = $tblName;
                            $responseData['objectText'] = $beginDateTime . ' Start bereits vorhanden';
                            // array_push( $transmitResponse, $responseData );
                        }
                        elseif( !isset( $sqlSelectObject->{$beginDateTime} ) && isset( $sqlSelectObject->{$endDateTime} ) )
                        {
                            $responseData['success'] = false;
                            $responseData['objectItem'] = $probenNummer;
                            $responseData['objectTable'] = $tblName;
                            $responseData['objectText'] = $beginDateTime . ' Ende bereits vorhanden';
                            // array_push( $transmitResponse, $responseData );
                        }
                    break;

                    case 'ende':
                        if( isset( $sqlSelectObject->{$beginDateTime} ) && !isset( $sqlSelectObject->{$endDateTime} ) )
                        {
                            $responseData = startTrue_endTrue ( $pdoConnect, $probenNummer, $tblName, $beginDateTime, $endDateTime, $berechnungDateTime, $checkIfEingang, $transmitResponse );
                            // array_push( $transmitResponse, $responseData );
                        }
                        elseif ( !isset( $sqlSelectObject->{$beginDateTime} ) && !isset( $sqlSelectObject->{$endDateTime} ) )
                        {
                            $responseData = startFalse_endTrue ( $pdoConnect, $probenNummer, $tblName, $beginDateTime, $endDateTime, $berechnungDateTime, $checkIfEingang, $transmitResponse );
                            // array_push( $transmitResponse, $responseData );
                        }
                        elseif( isset( $sqlSelectObject->{$endDateTime} ) )
                        {
                            $responseData['success'] = false;
                            $responseData['objectItem'] = $probenNummer;
                            $responseData['objectTable'] = $tblName;
                            $responseData['objectText'] = $endDateTime . ' Ende bereits vorhanden';
                            // array_push( $transmitResponse, $responseData );
                        }
                    break;

                    default:
                }
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
            // mail( "adm1n.zpn.verwaltung@gmail.com", "Datenbank Fehler!", json_encode($responseData) );
        }
        return $responseData;
    }