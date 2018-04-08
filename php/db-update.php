<?php

require_once 'db-connect.php';

$receivedPostData = json_decode(json_encode($_POST, JSON_FORCE_OBJECT));

if (isset($receivedPostData->updateDataSet)) {
    $receivedItem = $receivedPostData->updateDataSet;
    // $receivedItem = $_POST['updateDataSet'];
    $transmitResponse = new stdClass;
    // $transmitResponse->itemCount = 0;
    $transmitResponse = [
        'itemCount' => '',
    ];

    //Durchläuft das angekommene Array
    foreach ($receivedItem as $i) {
        $yesRegEx = '/\d{2}-\d{6}-\d{2}/';
        $pdoObject = new stdClass;
        $responseData = new stdClass;
        $updateObject = new stdClass;

        foreach ($i as $key => $value) {
            $updateObject->$key = $value;
        }

        $pdoConnect = db_connect();

        if (preg_match($yesRegEx, $updateObject->probenNummer)) {
            set_include_path( 'php/' );
            include_once( 'fn/fn-checkIfEingang.php' );
            include_once( 'fn/fn-setDateTime.php' );

            $transmitResponse['itemCount']++;

            //Durchläuft das einzelene Array
            foreach ($updateObject as $key => $value) {
                if ($value === 'active') {

                    $checkIfEingang = checkIfEingang($pdoConnect, $i->probenNummer, $i->sollDatum, $transmitResponse, $pdoObject, $responseData);

                    switch ($key) {
                        case 'zerlegungStart':
                            array_push($transmitResponse, setDateTime($pdoConnect, $i->probenNummer, 'tbl_zerlegung', 'zerlegungStart', 'zerlegungEnde', 'zerlegungBerechnung', $checkIfEingang, $transmitResponse, $pdoObject, 'start'));
                        break;
                        
                        case 'zerlegungEnde':
                            array_push( $transmitResponse, setDateTime($pdoConnect, $i->probenNummer, 'tbl_zerlegung', 'zerlegungStart', 'zerlegungEnde', 'zerlegungBerechnung', $checkIfEingang, $transmitResponse, $pdoObject, 'ende'));
                        break;
                        
                        case 'einwaageBeginn':
                            array_push( $transmitResponse, setDateTime($pdoConnect, $i->probenNummer, 'tbl_probennahme', 'einwaageBeginn', 'einwaageEnde', 'einwaageBerechnung', $checkIfEingang, $transmitResponse, $pdoObject, 'start'));
                        break;

                        case 'einwaageEnde':
                            array_push( $transmitResponse, setDateTime($pdoConnect, $i->probenNummer, 'tbl_probennahme', 'einwaageBeginn', 'einwaageEnde', 'einwaageBerechnung', $checkIfEingang, $transmitResponse, $pdoObject, 'ende'));
                        break;

                        case 'nickelBack':
                            array_push( $transmitResponse, setDateTime($pdoConnect, $i->probenNummer, 'tbl_nickel', 'eingangDateTime', 'nickelRueckgabeDateTime', 'nickeBerechnung', $checkIfEingang, $transmitResponse, $pdoObject, 'ende'));
                        break;

                        case 'klaerfallBeginn':
                            array_push($transmitResponse, setDateTime($pdoConnect, $i->probenNummer, 'tbl_klaerfall', 'klaerfallBeginnDateTime', 'klaerfallEndeDateTime', 'klaerfallBerechnung', $checkIfEingang, $transmitResponse, $pdoObject, 'start'));
                        break;

                        case 'klaerfallEnde':
                            array_push($transmitResponse, setDateTime($pdoConnect, $i->probenNummer, 'tbl_klaerfall','klaerfallBeginnDateTime', 'klaerfallEndeDateTime', 'klaerfallBerechnung', $checkIfEingang, $transmitResponse, $pdoObject, 'ende'));
                        break;

                        case 'manaBestellt':
                            array_push($transmitResponse, setDateTime($pdoConnect, $i->probenNummer, 'tbl_mana', 'manaGestelltDateTime', 'manaErhaltenDateTime', '', $checkIfEingang, $transmitResponse, $pdoObject, 'start'));
                        break;

                        case 'manaErhalten':
                            array_push($transmitResponse, setDateTime($pdoConnect, $i->probenNummer, 'tbl_mana','manaGestelltDateTime', 'manaErhaltenDateTime', 'manaBerechnungDateTimeAnfrage', $checkIfEingang, $transmitResponse, $pdoObject, 'ende'));
                        break;

                        case 'manaEinwaage':
                            array_push($transmitResponse, setDateTime($pdoConnect, $i->probenNummer, 'tbl_mana','manaEinwaageDateTime', 'manaZpnWagenDateTime', '', $checkIfEingang, $transmitResponse, $pdoObject, 'start'));
                        break;

                        case 'manaEingewogen':
                            array_push($transmitResponse, setDateTime($pdoConnect, $i->probenNummer, 'tbl_mana', 'manaEinwaageDateTime', 'manaZpnWagenDateTime', 'manaBerechnungDateTimeEinwaage', $checkIfEingang, $transmitResponse, $pdoObject, 'ende'));
                        break;

                        case 'zpnWagen':
                            array_push($transmitResponse, setDateTime($pdoConnect, $i->probenNummer, 'tbl_zpnwagen', 'zpnEingangDateTime', 'zpnWagenDateTime', 'berechnungDateTimeZpnwagen', $checkIfEingang, $transmitResponse, $pdoObject, 'ende'));
                        break;
                        
                        default:
                    }
                }
            }
        }
    }
    echo json_encode($transmitResponse);
    $pdoConnect = null;
}
