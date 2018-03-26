<?php
//....................................................................................................

// function db_connect()
// {
//     // Database connection data.
//     $host       = 'localhost';
//     $database   = 'zpn-verwaltung';
//     $username   = 'root';
//     $password   = 'root';
//     $charset    = 'utf8';

//     $dsn = "mysql:host=$host;dbname=$database;charset=$charset";
//     $options =
//     [
//     PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
//     PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
//     PDO::ATTR_EMULATE_PREPARES   => false,
//     ];

//     $responseData = array(
//     'success' => false,
//     'failCode' => '',
//     'pdoException' => ''
//     );

// // try/catch connection to database.
//     try {
//         // Database connection succsses.
//         $pdoConnect = new PDO($dsn, $username, $password, $options);
//         return $pdoConnect;
//     } // Database connection failed.
//     catch (PDOException $pdoException) {
//         $responseData['failCode'] = $pdoException->getCode();
//         $responseData['pdoException'] = $pdoException;
//         $pdoConnect = $responseData;
//         // mail( "adm1n.zpn.verwaltung@gmail.com", "Datenbank Fehler!", json_encode($responseData) );
//         die( json_encode($pdoConnect) );
//     }
// }

//....................................................................................................

// function getTiming($pdoConnect, $receivedData)
// {
//     $responseData = array(
//         'success' => false,
//         'successItem' => '',
//         'failItem' => '',
//         'failCode' => '',
//         'pdoException' => ''
//     );
    
//     try
//     {

//         $pdoConnect = db_connect();
        
//         $sql =
//             "
//             SELECT
//             tbl_mustereingang.probenNummer, tbl_mustereingang.sollDatum, DATE_FORMAT(tbl_mustereingang.eingangDateTime, GET_FORMAT(DATE, 'EUR') ) eingangDate, DATE_FORMAT(tbl_mustereingang.eingangDateTime, '%H:%i:%s') eingangTime,
//             tbl_gesamtberechnung.gesamtInZPN, tbl_gesamtberechnung.gesamtProbenNahme, tbl_gesamtberechnung.gesamtKlaerfall, tbl_gesamtberechnung.gesamtManaAnfrage, tbl_gesamtberechnung.gesamtManaDauer, tbl_gesamtberechnung.gesamtNickel,
//             tbl_status.mitExpress, tbl_status.mitIntern, tbl_status.mitNickel, tbl_status.mitLfgb, tbl_status.mitToys, tbl_status.mit60g, tbl_status.mitKlaerfallBack,
//             tbl_probennahme.onOffStatusProbenNahme, DATE_FORMAT(tbl_probennahme.probenNahmeBeginn, GET_FORMAT(DATE, 'EUR') ) probenNahmeBeginnDate, DATE_FORMAT(tbl_probennahme.probenNahmeBeginn, '%H:%i:%s') probenNahmeBeginnTime, DATE_FORMAT(tbl_probennahme.probenNahmeEnde, GET_FORMAT(DATE, 'EUR') ) probenNahmeEndeDate, DATE_FORMAT(tbl_probennahme.probenNahmeEnde, '%H:%i:%s') probenNahmeEndeTime, tbl_probennahme.calculateTimeDiffProbenNahme,
//             tbl_zpnwagen.onOffStatusZpnWagen, DATE_FORMAT(tbl_zpnwagen.zpnWagenDateTime, GET_FORMAT(DATE, 'EUR') ) zpnWagenDate, DATE_FORMAT(tbl_zpnwagen.zpnWagenDateTime, '%H:%i:%s') zpnWagenTime, tbl_zpnwagen.calculateTimeDiffZpnWagen,
//             tbl_kommentar.onOffStatusKommentar, tbl_kommentar.kommentarText, DATE_FORMAT(tbl_kommentar.kommentarDateTime, GET_FORMAT(DATE, 'EUR') ) kommentarDate, DATE_FORMAT(tbl_kommentar.kommentarDateTime, '%H:%i:%s') kommentarTime,
//             tbl_mana.onOffStatusManaGestellt, DATE_FORMAT(tbl_mana.maNaGestelltDateTime, GET_FORMAT(DATE, 'EUR') ) maNaGestelltDate, DATE_FORMAT(tbl_mana.maNaGestelltDateTime, '%H:%i:%s') maNaGestelltTime, tbl_mana.onOffStatusManaErhalten, DATE_FORMAT(tbl_mana.maNaErhaltenDateTime, GET_FORMAT(DATE, 'EUR') ) maNaErhaltenDate, DATE_FORMAT(tbl_mana.maNaErhaltenDateTime, '%H:%i:%s') maNaErhaltenTime,  tbl_mana.calculateTimeDiffManaAnfrage, tbl_mana.onOffStatusManaWagen, DATE_FORMAT(tbl_mana.maNaZpnWagenDateTime, GET_FORMAT(DATE, 'EUR') ) maNaZpnWagenDate, DATE_FORMAT(tbl_mana.maNaZpnWagenDateTime, '%H:%i:%s') maNaZpnWagenTime, tbl_mana.calculateTimeDiffManaGesamt,
//             tbl_nickel.onOffStatusNickelRueckgabe, DATE_FORMAT(tbl_nickel.nickelRueckgabeDateTime, GET_FORMAT(DATE, 'EUR') ) nickelRueckgabeDate, DATE_FORMAT(tbl_nickel.nickelRueckgabeDateTime, '%H:%i:%s') nickelRueckgabeTime, tbl_nickel.calculateTimeDiffNickelRueckgabe,
//             tbl_klaerfall.onOffStatusKlaerfall, DATE_FORMAT(tbl_klaerfall.klaefallBeginnDateTime, GET_FORMAT(DATE, 'EUR') ) klaefallBeginnDate, DATE_FORMAT(tbl_klaerfall.klaefallBeginnDateTime, '%H:%i:%s') klaefallBeginnTime, DATE_FORMAT(tbl_klaerfall.klaerfallEndeDateTime, GET_FORMAT(DATE, 'EUR') ) klaerfallEndeDate, DATE_FORMAT(tbl_klaerfall.klaerfallEndeDateTime, '%H:%i:%s') klaerfallEndeTime, tbl_klaerfall.calculateTimeDiffKlaerfall,
//             tbl_storno.onOffStatusStorno, DATE_FORMAT(tbl_storno.stornoDateTime, GET_FORMAT(DATE, 'EUR') ) stornoDate, DATE_FORMAT(tbl_storno.stornoDateTime, '%H:%i:%s') stornoTime

//             FROM tbl_mustereingang

//             LEFT JOIN tbl_gesamtberechnung ON tbl_mustereingang.probenNummer = tbl_gesamtberechnung.probenNummer
//             LEFT JOIN tbl_status ON tbl_mustereingang.probenNummer = tbl_status.probenNummer
//             LEFT JOIN tbl_probennahme ON tbl_mustereingang.probenNummer = tbl_probennahme.probenNummer
//             LEFT JOIN tbl_zpnwagen ON tbl_mustereingang.probenNummer = tbl_zpnwagen.probenNummer
//             LEFT JOIN tbl_kommentar ON tbl_mustereingang.probenNummer = tbl_kommentar.probenNummer
//             LEFT JOIN tbl_mana ON tbl_mustereingang.probenNummer = tbl_mana.probenNummer
//             LEFT JOIN tbl_nickel ON tbl_mustereingang.probenNummer = tbl_nickel.probenNummer
//             LEFT JOIN tbl_klaerfall ON tbl_mustereingang.probenNummer = tbl_klaerfall.probenNummer
//             LEFT JOIN tbl_storno ON tbl_mustereingang.probenNummer = tbl_storno.probenNummer
        
//             WHERE tbl_mustereingang.probenNummer = :probenNummer;
//             ";

//         $pdoStatement = $pdoConnect->prepare($sql);
//         $pdoStatement->bindParam(':probenNummer', $receivedData, PDO::PARAM_STR);
//         $pdoStatement->execute();

//         $requestedData = $pdoStatement->fetchObject();

//         if ($requestedData != false) {
//             foreach ($requestedData as $key => &$value) {
//                 $requestedData->$key = str_replace('00.00.0000', null, $value);
//                 $requestedData->$key = str_replace('00:00:00', null, $value);
//                 $requestedData->$key = str_replace('deactive', null, $value);
//             }

//             $requestedData = (object) array_filter((array) $requestedData);

//             $responseData['success'] = true;
//             $responseData['successItem'] = $requestedData;

//             die( json_encode($responseData) );
//         } else {
//             header("Content-type: application/json");
//             $responseData['failItem'] = $receivedData;
//             $responseData['failCode'] = 'no-entry';

//             die( json_encode($responseData) );
//         }

//     }
//     catch (PDOException $pdoException)
//     {
//         $responseData['failCode'] = $pdoException->errorInfo[0];
//         $responseData['pdoException'] = $pdoException;

//         die( json_encode($responseData) );
//         // mail( "adm1n.zpn.verwaltung@gmail.com", "Datenbank Fehler!", json_encode($responseData) );
//     }
    
    
    
    
//     $pdoConnect = null;
//     return;
// }

//....................................................................................................

// function db_insert()
// {
//     if (isset($_POST['insertDataSet'])) {
//         $receivedData = $_POST['insertDataSet'];

//         $responseData = array(
//         'success' => false,
//         'doubleInput' => $errorArray = array(),
//         'successInput' => $successArray = array(),
//         'failCode' => ''
//         );

//         $pdoConnect = db_connect();

//         foreach ($receivedData as $i) {
//             $yesRegEx = '/\d{2}-\d{6}-\d{2}/';
//             if (preg_match($yesRegEx, $i['probenNummer'])) {
//                 try {

//                     // Tabelle Muster Eingang
//                     $sql =
//                     "
//                         INSERT INTO tbl_mustereingang ( probenNummer, sollDatum, eingangDateTime )
//                         VALUES ( :probenNummer,:sollDatum, NOW() );
//                     ";
//                     $pdoStatement = $pdoConnect->prepare($sql);
//                     $pdoStatement->bindParam(':probenNummer', $i["probenNummer"], PDO::PARAM_STR);
//                     $pdoStatement->bindParam(':sollDatum', $i["sollDatum"], PDO::PARAM_STR);
//                     $pdoStatement->execute();

//                     // Tabelle Status
//                     $sql =
//                     "
//                         INSERT INTO tbl_status ( probenNummer,  mitExpress, mitIntern, mitNickel, mitLfgb, mitToys, mit60g, mitKlaerfallBack )
//                         VALUES ( :probenNummer, :mitExpress, :mitIntern, :mitNickel, :mitLfgb, :mitToys, :mit60g, :mitKlaerfallBack );
//                     ";

//                     $pdoStatement = $pdoConnect->prepare($sql);
//                     $pdoStatement->bindParam(':probenNummer', $i["probenNummer"], PDO::PARAM_STR);
//                     $pdoStatement->bindParam(':mitExpress', $i["mitExpress"], PDO::PARAM_STR);
//                     $pdoStatement->bindParam(':mitIntern', $i["mitIntern"], PDO::PARAM_STR);
//                     $pdoStatement->bindParam(':mitNickel', $i["mitNickel"], PDO::PARAM_STR);
//                     $pdoStatement->bindParam(':mitLfgb', $i["mitLfgb"], PDO::PARAM_STR);
//                     $pdoStatement->bindParam(':mitToys', $i["mitToys"], PDO::PARAM_STR);
//                     $pdoStatement->bindParam(':mit60g', $i["mit60g"], PDO::PARAM_STR);
//                     $pdoStatement->bindParam(':mitKlaerfallBack', $i["mitKlaerfallBack"], PDO::PARAM_STR);
//                     $pdoStatement->execute();

//                     // Tabelle Probennahme
//                     // createInsert($pdoConnect, $i["probenNummer"], 'tbl_probennahme', 'onOffStatusProbenNahme');

//                     // Tabelle ZPN Wagen
//                     // createInsert($pdoConnect, $i["probenNummer"], 'tbl_zpnwagen', 'onOffStatusZpnWagen');

//                     // Tabelle Gesamtberechnung
//                     $sql =
//                     "
//                         INSERT INTO tbl_gesamtberechnung ( probenNummer )
//                         VALUES ( :probenNummer );
//                     ";
//                     $pdoStatement = $pdoConnect->prepare($sql);
//                     $pdoStatement->bindParam(':probenNummer', $i["probenNummer"], PDO::PARAM_STR);
//                     $pdoStatement->execute();

//                     array_push($successArray, $i["probenNummer"]);
//                     $responseData['successInput'] = $successArray;
//                     $responseData['success'] = true;
//                 } catch (PDOException $pdoException) {
//                     preg_match('/\d{2}-\d{6}-\d{2}/', $pdoException->errorInfo[2], $errorItem);
//                     array_push($errorArray, $errorItem);
//                     $responseData['doubleInput'] = $errorArray;
//                     $responseData['failCode'] = $pdoException->getCode();
//                     // mail( "adm1n.zpn.verwaltung@gmail.com", "Datenbank Fehler!", json_encode($responseData) );
//                 }
               
//             }
//         }
//         echo json_encode($responseData);
//         $pdoConnect = null;
//     }
// }

//....................................................................................................

// function db_search()
// {
//     if (isset($_POST['getStatusItems'])) {
//         $receivedData = $_POST['getStatusItems'];
//         $yesRegEx = '/\d{2}-\d{6}-\d{2}/';

//         $responseData = array(
//             'success' => false,
//             'successItem' => '',
//             'failItem' => '',
//             'failCode' => '',
//             'pdoException' => ''
//         );

//         if (preg_match($yesRegEx, $receivedData)) {
//             $pdoConnect = db_connect();
//             try {
//                 $sql =
//                     "
//                         SELECT
//                         tbl_mustereingang.probenNummer, tbl_mustereingang.sollDatum, DATE_FORMAT(tbl_mustereingang.eingangDateTime, GET_FORMAT(DATE, 'EUR') ) eingangDate, DATE_FORMAT(tbl_mustereingang.eingangDateTime, '%H:%i:%s') eingangTime,
//                         tbl_gesamtberechnung.gesamtInZPN, tbl_gesamtberechnung.gesamtProbenNahme, tbl_gesamtberechnung.gesamtKlaerfall, tbl_gesamtberechnung.gesamtManaAnfrage, tbl_gesamtberechnung.gesamtManaDauer, tbl_gesamtberechnung.gesamtNickel,
//                         tbl_status.mitExpress, tbl_status.mitIntern, tbl_status.mitNickel, tbl_status.mitLfgb, tbl_status.mitToys, tbl_status.mit60g, tbl_status.mitKlaerfallBack,
//                         tbl_probennahme.onOffStatusProbenNahme, DATE_FORMAT(tbl_probennahme.probenNahmeBeginn, GET_FORMAT(DATE, 'EUR') ) probenNahmeBeginnDate, DATE_FORMAT(tbl_probennahme.probenNahmeBeginn, '%H:%i:%s') probenNahmeBeginnTime, DATE_FORMAT(tbl_probennahme.probenNahmeEnde, GET_FORMAT(DATE, 'EUR') ) probenNahmeEndeDate, DATE_FORMAT(tbl_probennahme.probenNahmeEnde, '%H:%i:%s') probenNahmeEndeTime, tbl_probennahme.calculateTimeDiffProbenNahme,
//                         tbl_zpnwagen.onOffStatusZpnWagen, DATE_FORMAT(tbl_zpnwagen.zpnWagenDateTime, GET_FORMAT(DATE, 'EUR') ) zpnWagenDate, DATE_FORMAT(tbl_zpnwagen.zpnWagenDateTime, '%H:%i:%s') zpnWagenTime, tbl_zpnwagen.calculateTimeDiffZpnWagen,
//                         tbl_kommentar.onOffStatusKommentar, tbl_kommentar.kommentarText, DATE_FORMAT(tbl_kommentar.kommentarDateTime, GET_FORMAT(DATE, 'EUR') ) kommentarDate, DATE_FORMAT(tbl_kommentar.kommentarDateTime, '%H:%i:%s') kommentarTime,
//                         tbl_mana.onOffStatusManaGestellt, DATE_FORMAT(tbl_mana.maNaGestelltDateTime, GET_FORMAT(DATE, 'EUR') ) maNaGestelltDate, DATE_FORMAT(tbl_mana.maNaGestelltDateTime, '%H:%i:%s') maNaGestelltTime, tbl_mana.onOffStatusManaErhalten, DATE_FORMAT(tbl_mana.maNaErhaltenDateTime, GET_FORMAT(DATE, 'EUR') ) maNaErhaltenDate, DATE_FORMAT(tbl_mana.maNaErhaltenDateTime, '%H:%i:%s') maNaErhaltenTime,  tbl_mana.calculateTimeDiffManaAnfrage, tbl_mana.onOffStatusManaWagen, DATE_FORMAT(tbl_mana.maNaZpnWagenDateTime, GET_FORMAT(DATE, 'EUR') ) maNaZpnWagenDate, DATE_FORMAT(tbl_mana.maNaZpnWagenDateTime, '%H:%i:%s') maNaZpnWagenTime, tbl_mana.calculateTimeDiffManaGesamt,
//                         tbl_nickel.onOffStatusNickelRueckgabe, DATE_FORMAT(tbl_nickel.nickelRueckgabeDateTime, GET_FORMAT(DATE, 'EUR') ) nickelRueckgabeDate, DATE_FORMAT(tbl_nickel.nickelRueckgabeDateTime, '%H:%i:%s') nickelRueckgabeTime, tbl_nickel.calculateTimeDiffNickelRueckgabe,
//                         tbl_klaerfall.onOffStatusKlaerfall, DATE_FORMAT(tbl_klaerfall.klaefallBeginnDateTime, GET_FORMAT(DATE, 'EUR') ) klaefallBeginnDate, DATE_FORMAT(tbl_klaerfall.klaefallBeginnDateTime, '%H:%i:%s') klaefallBeginnTime, DATE_FORMAT(tbl_klaerfall.klaerfallEndeDateTime, GET_FORMAT(DATE, 'EUR') ) klaerfallEndeDate, DATE_FORMAT(tbl_klaerfall.klaerfallEndeDateTime, '%H:%i:%s') klaerfallEndeTime, tbl_klaerfall.calculateTimeDiffKlaerfall,
//                         tbl_storno.onOffStatusStorno, DATE_FORMAT(tbl_storno.stornoDateTime, GET_FORMAT(DATE, 'EUR') ) stornoDate, DATE_FORMAT(tbl_storno.stornoDateTime, '%H:%i:%s') stornoTime
                    
//                         FROM tbl_mustereingang
                    
//                         LEFT JOIN tbl_gesamtberechnung ON tbl_mustereingang.probenNummer = tbl_gesamtberechnung.probenNummer
//                         LEFT JOIN tbl_status ON tbl_mustereingang.probenNummer = tbl_status.probenNummer
//                         LEFT JOIN tbl_probennahme ON tbl_mustereingang.probenNummer = tbl_probennahme.probenNummer
//                         LEFT JOIN tbl_zpnwagen ON tbl_mustereingang.probenNummer = tbl_zpnwagen.probenNummer
//                         LEFT JOIN tbl_kommentar ON tbl_mustereingang.probenNummer = tbl_kommentar.probenNummer
//                         LEFT JOIN tbl_mana ON tbl_mustereingang.probenNummer = tbl_mana.probenNummer
//                         LEFT JOIN tbl_nickel ON tbl_mustereingang.probenNummer = tbl_nickel.probenNummer
//                         LEFT JOIN tbl_klaerfall ON tbl_mustereingang.probenNummer = tbl_klaerfall.probenNummer
//                         LEFT JOIN tbl_storno ON tbl_mustereingang.probenNummer = tbl_storno.probenNummer
                    
//                         WHERE tbl_mustereingang.probenNummer = :probenNummer;

//                     ";

//                 $pdoStatement = $pdoConnect->prepare($sql);
//                 $pdoStatement->bindParam(':probenNummer', $receivedData, PDO::PARAM_STR);
//                 $pdoStatement->execute();

//                 $requestedData = $pdoStatement->fetchObject();

//                 if ($requestedData != false) {
//                     foreach ($requestedData as $key => &$value) {
//                         $requestedData->$key = str_replace('00.00.0000', null, $value);
//                         $requestedData->$key = str_replace('00:00:00', null, $value);
//                         $requestedData->$key = str_replace('deactive', null, $value);
//                     }
                    
//                     $requestedData = (object) array_filter((array) $requestedData);

//                     $responseData['success'] = true;
//                     $responseData['successItem'] = $requestedData;

//                     die( json_encode($responseData) );
//                 } else {
//                     header("Content-type: application/json");
//                     $responseData['failItem'] = $receivedData;
//                     $responseData['failCode'] = 'no-entry';

//                     die( json_encode($responseData) );
//                 }
//             } catch (PDOException $pdoException) {
//                 $responseData['failCode'] = $pdoException->errorInfo[0];
//                 $responseData['pdoException'] = $pdoException;

//                 die( json_encode($responseData) );
//                 // mail( "adm1n.zpn.verwaltung@gmail.com", "Datenbank Fehler!", json_encode($responseData) );
//             }
//             $pdoConnect = null;
//         }
//     }
// }

//....................................................................................................
        
// function db_update_StatusItems()
// {
//     if (isset($_POST['updateDataSet'])) {
//         $receivedItem = $_POST['updateDataSet'];
//         $yesRegEx = '/\d{2}-\d{6}-\d{2}/';

//         $responseData = array
//         (
//             'success' => false,
//             'successItem' => '',
//             'onOffDetailsStatus' => '',
//             'onOffMainMiddleButtonStatus' => '',
//             'failItem' => '',
//             'failCode' => '',
//             'pdoException' => ''
//         );

//         if (preg_match($yesRegEx, $receivedItem['updatedProbenNummer'])) {
//             try {
//                 $updatedProbenNummer = $receivedItem['updatedProbenNummer'];
//                 $updatedProbenSoll = $receivedItem['updatedProbenSoll'];
//                 $updateItemId = $receivedItem['updateItemId'];
//                 $updateItemMainClass = $receivedItem['updateItemMainClass'];
//                 $updateItemSecondClass = $receivedItem['updateItemSecondClass'];
//                 $updateItemTblName = $receivedItem['updateItemTblName'];
//                 $updateOnOffItemValue = $receivedItem['updateOnOffItemValue'];

//                 $pdoConnect = db_connect();

//                 switch ($updateItemMainClass) {
//                     case "details-status-button":
//                         $pdoConnect = db_connect();

//                         $sql =
//                         "
//                             UPDATE tbl_status
//                             SET ". $updateItemId ." = :updateOnOffItemValue
//                             WHERE probenNummer = :updatedProbenNummer;
//                         ";

//                         $pdoStatement = $pdoConnect->prepare($sql);
//                         $pdoStatement->bindParam(':updatedProbenNummer', $updatedProbenNummer, PDO::PARAM_STR);
//                         $pdoStatement->bindParam(':updateOnOffItemValue', $updateOnOffItemValue, PDO::PARAM_STR);
//                         $pdoStatement->execute();

//                         $responseData['onOffDetailsStatus'] = $updateOnOffItemValue;

//                         break;

//                     case "main-middle-item":
//                         switch ($updateItemTblName) {
//                             case "tbl_probennahme":
//                                 switch ($receivedItem['updateOnOffItemValue']) {
//                                     case "started":
//                                         $sql =
//                                         "
//                                             UPDATE tbl_probennahme
//                                             SET onOffStatusProbenNahme = 'started', probenNahmeBeginn = NOW()
//                                             WHERE probenNummer = :probenNummer;
//                                         ";
//                                         $pdoStatement = $pdoConnect->prepare($sql);
//                                         $pdoStatement->bindParam( ':probenNummer', $updatedProbenNummer, PDO::PARAM_STR );
//                                         $pdoStatement->execute();

//                                         $responseData['onOffMainMiddleButtonStatus'] = 'started';
//                                         break;

//                                     case "done":
//                                         $sql =
//                                         "
//                                             UPDATE tbl_probennahme
//                                             SET probenNahmeEnde = NOW(), onOffStatusProbenNahme = 'done', calculateTimeDiffProbenNahme = TIMEDIFF(probenNahmeEnde, probenNahmeBeginn)
//                                             WHERE probenNummer = :probenNummer;
//                                         ";
//                                         $pdoStatement = $pdoConnect->prepare($sql);
//                                         $pdoStatement->bindParam( ':probenNummer', $updatedProbenNummer, PDO::PARAM_STR );
//                                         $pdoStatement->execute();

//                                         $sql =
//                                         "
//                                             UPDATE tbl_gesamtberechnung, tbl_probennahme
//                                             SET tbl_gesamtberechnung.gesamtProbenNahme = tbl_probennahme.calculateTimeDiffProbenNahme
//                                             WHERE tbl_probennahme.probenNummer = tbl_gesamtberechnung.probenNummer
//                                         ";
//                                         $pdoStatement = $pdoConnect->prepare($sql);
//                                         $pdoStatement->execute();

//                                         $responseData['onOffMainMiddleButtonStatus'] = 'done';
//                                         break;

//                                     case "restarted":
//                                         $responseData['onOffMainMiddleButtonStatus'] = 'restarted';
//                                         break;

//                                     default:
//                                 }

//                                 break;

//                             case "tbl_nickel":
//                                 break;

//                             case "tbl_klaerfall":
//                                 break;

//                             case "tbl_mana":
//                                 break;

//                             case "tbl_zpnwagen":
//                                 break;

//                             case "tbl_kommentar":
//                                 break;

//                             default:
//                         }
//                     default:
//                 }
                
//             getTiming($pdoConnect, $receivedItem);

//                 $responseData['success'] = true;
//             } catch (PDOException $pdoException) {
//                 $responseData['failItem'] = $receivedItem['updatedProbenNummer'];
//                 $responseData['failCode'] = $pdoException->errorInfo[0];
//                 $responseData['pdoException'] = $pdoException;
//                 // mail( "adm1n.zpn.verwaltung@gmail.com", "Datenbank Fehler!", json_encode($responseData) );
//             }
//                 echo json_encode($responseData);
//                 $pdoConnect = null;
//         }
//     }
// }

//...................................................................................................()
    // db_search();
    // db_insert();
    // db_update_StatusItems();
