<?php
    //Trät die Endzeit des jeweiligen Datensatz in die Datenbank als DateTime ein
    function setDateTime($pdoConnect, $probenNummer, $tblName, $beginDateTime, $endDateTime, $berechnungDateTime, $checkIfEingang, $transmitResponse, $pdoObject, $switch) {

        $path_fnStartTrue_endTrue = 'fn/fn-startTrue_endTrue.php';
        require_once($path_fnStartTrue_endTrue);
        $path_fnStartFalse_endTrue = 'fn/fn-startFalse_endTrue.php';
        require_once($path_fnStartFalse_endTrue);
        $path_fnStartFalse = 'fn/fn-startFalse.php';
        require_once($path_fnStartFalse);

        try {
            if ($checkIfEingang !== false) {
                // Erstellt ein Object des selektieren SQL Datensatzes
                $sqlSelectObject = sqlSelectObjectDate($pdoConnect, $probenNummer, $pdoObject);

                // Welches Ende wurde gewählt? $beginDateTime
                switch($switch) {
                    case 'start':
                        if (!isset($sqlSelectObject->date->{$beginDateTime}) && !isset($sqlSelectObject->date->{$endDateTime})) {
                            $responseData = startFalse($pdoConnect, $probenNummer, $tblName, $beginDateTime, $checkIfEingang, $transmitResponse);
                        }
                        elseif (isset($sqlSelectObject->date->{$beginDateTime})) {
                            $responseData['success'] = false;
                            $responseData['objectItem'] = $probenNummer;
                            $responseData['objectTable'] = $tblName;
                            $responseData['objectText'] = $beginDateTime . ' Start bereits vorhanden';
                        }
                        elseif (!isset($sqlSelectObject->date->{$beginDateTime}) && isset($sqlSelectObject->date->{$endDateTime})) {
                            $responseData['success'] = false;
                            $responseData['objectItem'] = $probenNummer;
                            $responseData['objectTable'] = $tblName;
                            $responseData['objectText'] = $beginDateTime . ' Ende bereits vorhanden';
                        }
                    break;

                    case 'ende':
                        if (isset($sqlSelectObject->date->{$beginDateTime}) && !isset($sqlSelectObject->date->{$endDateTime})) {
                            $responseData = startTrue_endTrue ( $pdoConnect, $probenNummer, $tblName, $beginDateTime, $endDateTime, $berechnungDateTime, $checkIfEingang, $transmitResponse );
                        }
                        elseif (!isset($sqlSelectObject->date->{$beginDateTime}) && !isset($sqlSelectObject->date->{$endDateTime})) {
                            $responseData = startFalse_endTrue ( $pdoConnect, $probenNummer, $tblName, $beginDateTime, $endDateTime, $berechnungDateTime, $checkIfEingang, $transmitResponse );
                        }
                        elseif (isset($sqlSelectObject->date->{$endDateTime})) {
                            $responseData['success'] = false;
                            $responseData['objectItem'] = $probenNummer;
                            $responseData['objectTable'] = $tblName;
                            $responseData['objectText'] = $endDateTime . ' Ende bereits vorhanden';
                        }
                    break;

                    default:
                }
            }
        }
        catch (PDOException $pdoException) {
            $pdoException = (array)$pdoException;
            $responseData['success'] = false;
            $responseData['objectItem'] = $probenNummer;
            $responseData['objectTable'] = $tblName;
            $responseData['failCode'] = $pdoException['errorInfo'][0];
            $responseData['pdoException'] = $pdoException['errorInfo'];
            mail( "adm1n.zpn.verwaltung@gmail.com", "Datenbank Fehler!", json_encode($responseData) );
        }
        return $responseData;
    }