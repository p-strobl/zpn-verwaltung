<?php

require_once 'db-connect.php';

    if ( isset( $_POST['updateDataSet'] ) )
    {
        $receivedItem = $_POST['updateDataSet'];
        $transmitResponse = [
            'itemCount' => '',
        ];

        //Durchläuft das angekommene Array
        foreach ( $receivedItem as $i )
        {
            $yesRegEx = '/\d{2}-\d{6}-\d{2}/';

            $pdoConnect = db_connect();

            $responseData = array
            (
                'success'       => '',
                'objectItem'    => '',
                'objectTable'   => '',
                'objectText'    => '',
                'berechnung'    => '',
                'failCode'      => '',
                'pdoException'  => ''
            );

            $updateObject = array
            (
                'probenNummer'      => $i['probenNummer'],
                'sollDatum'         => $i['sollDatum'],
                'zerlegungStart'    => $i['zerlegungStart'],
                'zerlegungEnde'     => $i['zerlegungEnde'],
                'einwaageBeginn'    => $i['einwaageBeginn'],
                'einwaageEnde'      => $i['einwaageEnde'],
                'klaerfallBeginn'   => $i['klaerfallBeginn'],
                'klaerfallEnde'     => $i['klaerfallEnde'],
                'manaBestellt'      => $i['manaBestellt'],
                'manaErhalten'      => $i['manaErhalten'],
                'manaEinwaage'      => $i['manaEinwaage'],
                'manaEingewogen'    => $i['manaEingewogen'],
                'zpnWagen'          => $i['zpnWagen']
            );

            if ( preg_match( $yesRegEx, $i['probenNummer'] ) )
            {
                set_include_path( 'php/' );
                include_once( 'fn/fn-checkIfEingang.php' );
                include_once( 'fn/fn-setDateTime.php' );

                $transmitResponse['itemCount']++;

                //Durchläuft das einzelene Array
                foreach ( $updateObject as $key => $value )
                {
                    if ( $value === 'active' )
                    {
                        $checkIfEingang =  checkIfEingang( $pdoConnect, $i['probenNummer'], $i["sollDatum"], $transmitResponse );

                        switch ( $key )
                        {
                            case 'zerlegungStart':
                                array_push( $transmitResponse, setDateTime( $pdoConnect, $i['probenNummer'], 'tbl_zerlegung', 'zerlegungStart', 'zerlegungEnde', 'zerlegungBerechnung', $checkIfEingang, $transmitResponse, 'start' ) );
                            break;
                            
                            case 'zerlegungEnde':
                                array_push( $transmitResponse, setDateTime( $pdoConnect, $i['probenNummer'], 'tbl_zerlegung', 'zerlegungStart', 'zerlegungEnde', 'zerlegungBerechnung', $checkIfEingang, $transmitResponse, 'ende' ) );
                            break;
                            
                            case 'einwaageBeginn':
                                array_push( $transmitResponse, setDateTime( $pdoConnect, $i['probenNummer'], 'tbl_probennahme', 'einwaageBeginn', 'einwaageEnde', 'einwaageBerechnung', $checkIfEingang, $transmitResponse, 'start' ) );
                            break;

                            case 'einwaageEnde':
                                array_push( $transmitResponse, setDateTime( $pdoConnect, $i['probenNummer'], 'tbl_probennahme', 'einwaageBeginn', 'einwaageEnde', 'einwaageBerechnung', $checkIfEingang, $transmitResponse, 'ende' ) );
                            break;

                            case 'nickelBack':
                                array_push( $transmitResponse, setDateTime( $pdoConnect, $i['probenNummer'], 'tbl_nickel', 'eingangDateTime', 'nickelRueckgabeDateTime', 'nickeBerechnung', $checkIfEingang, $transmitResponse, 'ende' ) );
                            break;

                            case 'klaerfallBeginn':
                                array_push( $transmitResponse, setDateTime( $pdoConnect, $i['probenNummer'], 'tbl_klaerfall', 'klaerfallBeginnDateTime', 'klaerfallEndeDateTime', 'klaerfallBerechnung', $checkIfEingang, $transmitResponse, 'start' ) );
                            break;

                            case 'klaerfallEnde':
                                array_push( $transmitResponse, setDateTime( $pdoConnect, $i['probenNummer'], 'tbl_klaerfall','klaerfallBeginnDateTime', 'klaerfallEndeDateTime', 'klaerfallBerechnung', $checkIfEingang, $transmitResponse, 'ende' ) );
                            break;

                            case 'manaBestellt':
                                array_push( $transmitResponse, setDateTime( $pdoConnect, $i['probenNummer'], 'tbl_mana', 'manaGestelltDateTime', 'manaErhaltenDateTime', '', $checkIfEingang, $transmitResponse, 'start' ) );
                            break;

                            case 'manaErhalten':
                                array_push( $transmitResponse, setDateTime( $pdoConnect, $i['probenNummer'], 'tbl_mana','manaGestelltDateTime', 'manaErhaltenDateTime', 'manaBerechnungDateTimeAnfrage', $checkIfEingang, $transmitResponse, 'ende' ) );
                            break;

                            case 'manaEinwaage':
                                array_push( $transmitResponse, setDateTime( $pdoConnect, $i['probenNummer'], 'tbl_mana','manaEinwaageDateTime', 'manaZpnWagenDateTime', '', $checkIfEingang, $transmitResponse, 'start' ) );
                            break;

                            case 'manaEingewogen':
                                array_push( $transmitResponse, setDateTime( $pdoConnect, $i['probenNummer'], 'tbl_mana', 'manaEinwaageDateTime', 'manaZpnWagenDateTime', 'manaBerechnungDateTimeEinwaage', $checkIfEingang, $transmitResponse, 'ende' ) );
                            break;

                            case 'zpnWagen':
                                array_push( $transmitResponse, setDateTime( $pdoConnect, $i['probenNummer'], 'tbl_zpnwagen', 'eingangDateTime', 'zpnWagenDateTime', 'berechnungDateTimeZpnwagen', $checkIfEingang, $transmitResponse, 'ende' ) );
                            break;
                            
                            default:
                        }
                    }
                }
            }
        }
        echo json_encode( $transmitResponse );
        $pdoConnect = null;
    }
