<?php

require 'db-connect.php';

if (!empty($_POST)){

    $receivedPostData = json_decode(json_encode($_POST, JSON_FORCE_OBJECT));

    switch (true){
        case isset($receivedPostData->beurteilungDataSet):
        $test = $receivedPostData->beurteilungDataSet;
            $receivedPostDataObject = json_decode(json_encode($receivedPostData->beurteilungDataSet, JSON_FORCE_OBJECT));
            break;
    
        case isset($receivedPostData->musterEingangDataSet):
            $receivedPostDataObject = json_decode(json_encode($receivedPostData->musterEingangDataSet, JSON_FORCE_OBJECT));
            break;
        default:
    }

    $responseData = array
    (
        'success'       => false,
        'objectItem'    => '',
        'objectText'    => '',
        'doubleInput'   => $errorArray = array(),
        'successInput'  => $successArray = array(),
        'failCode'      => ''
    );

    foreach ($receivedPostDataObject as $i) {

        $yesRegEx = '/\d{2}-\d{6}-\d{2}/';
        $minLength = 12;

        if (preg_match($yesRegEx, $i->probenNummer) && strlen($i->probenNummer) === $minLength) {

            $pdoConnect = db_connect();

            try {
                $pdoConnect->beginTransaction();
                $sql =
                "
                    INSERT INTO 
                        tbl_baserecord( probenNummer, sollDatum )
                    VALUES 
                        ( :probenNummer,:sollDatum )
                ";
                $pdoStatement = $pdoConnect->prepare( $sql );
                $pdoStatement->bindParam( ':probenNummer', $i->probenNummer, PDO::PARAM_STR );
                $pdoStatement->bindParam( ':sollDatum', $i->sollDatum, PDO::PARAM_STR );
                $pdoStatement->execute();
                // $pdoConnect->commit();

                switch (true) {
                    case isset($receivedPostData->beurteilungDataSet):
                        $sql =
                            "
                                INSERT INTO 
                                    tbl_beurteilung( probenNummer, beurteilungBereitgestelltDateTime, anAbteilung )
                                VALUES 
                                    ( :probenNummer, NOW(), :anAbteilung )
                            ";

                        $pdoStatement = $pdoConnect->prepare( $sql );
                        $pdoStatement->bindParam( ':probenNummer', $i->probenNummer, PDO::PARAM_STR );
                        $pdoStatement->bindParam( ':anAbteilung', $i->anAbteilung, PDO::PARAM_STR );

                        $pdoStatement->execute();
                        $pdoConnect->commit();

                        break;
                    case isset($receivedPostData->musterEingangDataSet):
                        // $pdoConnect->beginTransaction();
                        $sql =
                            "
                                INSERT INTO 
                                    tbl_zpnmustereingang( probenNummer, zpnEingangDateTime )
                                VALUES 
                                    ( :probenNummer, NOW() )
                            ";
                        $pdoStatement = $pdoConnect->prepare( $sql );
                        $pdoStatement->bindParam( ':probenNummer', $i->probenNummer, PDO::PARAM_STR );
                        $pdoStatement->execute();
                        
                        $sql =
                            "
                                INSERT INTO 
                                    tbl_status( probenNummer, mitExpress, mitIntern, mitNickel, mitLfgb, mitToys, mit60g, mitKlaerfallBack )
                                VALUES 
                                    ( :probenNummer, :mitExpress, :mitIntern, :mitNickel, :mitLfgb, :mitToys, :mit60g, :mitKlaerfallBack )
                            ";
                        $pdoStatement = $pdoConnect->prepare( $sql );
                        $pdoStatement->bindParam( ':probenNummer', $i->probenNummer, PDO::PARAM_STR );
                        $pdoStatement->bindParam( ':mitExpress', $i->mitExpress, PDO::PARAM_STR );
                        $pdoStatement->bindParam( ':mitIntern', $i->mitIntern, PDO::PARAM_STR );
                        $pdoStatement->bindParam( ':mitNickel', $i->mitNickel, PDO::PARAM_STR );
                        $pdoStatement->bindParam( ':mitLfgb', $i->mitLfgb, PDO::PARAM_STR );
                        $pdoStatement->bindParam( ':mitToys', $i->mitToys, PDO::PARAM_STR );
                        $pdoStatement->bindParam( ':mit60g', $i->mit60g, PDO::PARAM_STR );
                        $pdoStatement->bindParam( ':mitKlaerfallBack', $i->mitKlaerfallBack, PDO::PARAM_STR );
                        $pdoStatement->execute();
                        $pdoConnect->commit();
                        break;
                    default:
                }
                array_push( $successArray, $i->probenNummer );
                $responseData['successInput'] = $successArray;
                $responseData['success'] = true;
            }
            catch (PDOException $pdoException) {
                $pdoConnect->rollBack();
                preg_match( '/\d{2}-\d{6}-\d{2}/', $pdoException->errorInfo[2], $errorItem );
                array_push( $errorArray, $errorItem );
                $responseData['doubleInput'] = $errorArray;
                $responseData['failCode'] = $pdoException->getCode();
                // mail( "adm1n.zpn.verwaltung@gmail.com", "Datenbank Fehler!", json_encode($responseData) );
            }
        }
    }
    echo json_encode( $responseData );
    $pdoConnect = null;
}




// if ( isset( $_POST['insertDataSet'] ) )
// {
//     $receivedPostDataObject = $_POST['insertDataSet'];

//     $responseData = array
//     (
//         'success'       => false,
//         'objectItem'    => '',
//         'objectText'    => '',
//         'doubleInput'   => $errorArray = array(),
//         'successInput'  => $successArray = array(),
//         'failCode'      => ''
//     );

//     $pdoConnect = db_connect();

//     foreach( $receivedPostDataObject as $i )
//     {
//         $yesRegEx = '/\d{2}-\d{6}-\d{2}/';

//         if ( preg_match( $yesRegEx, $i['probenNummer'] ) && $i['mitNickelBack'] == 'deactive' )
//         {
//             try
//             {
//                 // Tabelle Muster Eingang
//                 $pdoConnect->beginTransaction();
//                 $sql =
//                     "
//                         INSERT INTO 
//                             tbl_mustereingang( probenNummer, sollDatum, eingangDateTime )
//                         VALUES 
//                             ( :probenNummer, :sollDatum, NOW() )
//                     ";

//                 $pdoStatement = $pdoConnect->prepare( $sql );
//                 $pdoStatement->bindParam( ':probenNummer', $i["probenNummer"], PDO::PARAM_STR );
//                 $pdoStatement->bindParam( ':sollDatum', $i["sollDatum"], PDO::PARAM_STR );

//                 $pdoStatement->execute();

//                 $pdoConnect->commit();

//                 // Tabelle Status
//                 $pdoConnect->beginTransaction();
//                 $sql =
//                     "
//                         INSERT INTO
//                             tbl_status( probenNummer,  mitExpress, mitIntern, mitNickel, mitLfgb, mitToys, mit60g, mitKlaerfallBack )
//                         VALUES 
//                             ( :probenNummer, :mitExpress, :mitIntern, :mitNickel, :mitLfgb, :mitToys, :mit60g, :mitKlaerfallBack )
//                     ";

//                 $pdoStatement = $pdoConnect->prepare( $sql );
//                 $pdoStatement->bindParam( ':probenNummer', $i["probenNummer"], PDO::PARAM_STR );
//                 $pdoStatement->bindParam( ':mitExpress', $i["mitExpress"], PDO::PARAM_STR );
//                 $pdoStatement->bindParam( ':mitIntern', $i["mitIntern"], PDO::PARAM_STR );
//                 $pdoStatement->bindParam( ':mitNickel', $i["mitNickel"], PDO::PARAM_STR );
//                 $pdoStatement->bindParam( ':mitLfgb', $i["mitLfgb"], PDO::PARAM_STR );
//                 $pdoStatement->bindParam( ':mitToys', $i["mitToys"], PDO::PARAM_STR );
//                 $pdoStatement->bindParam( ':mit60g', $i["mit60g"], PDO::PARAM_STR );
//                 $pdoStatement->bindParam( ':mitKlaerfallBack', $i["mitKlaerfallBack"], PDO::PARAM_STR );

//                 $pdoStatement->execute();

//                 $pdoConnect->commit();

//                 array_push( $successArray, $i["probenNummer"] );
//                 $responseData['successInput'] = $successArray;
//                 $responseData['success'] = true;
//             }
//             catch ( PDOException $pdoException )
//             {
//                 $pdoConnect->rollBack();

//                 preg_match( '/\d{2}-\d{6}-\d{2}/', $pdoException->errorInfo[2], $errorItem );
//                 array_push( $errorArray, $errorItem );
//                 $responseData['doubleInput'] = $errorArray;
//                 $responseData['failCode'] = $pdoException->getCode();
//                 // mail( "adm1n.zpn.verwaltung@gmail.com", "Datenbank Fehler!", json_encode($responseData) );
//             }
//         }
//         elseif( $i['mitNickelBack'] == 'active' )
//         {
//             set_include_path( 'php/' );
//             include_once 'fn/fn-sqlSelectObject.php';

//             $sqlSelectObject = sqlSelectObject( $pdoConnect, $i['probenNummer'] );

//             try
//             {
//                 if( !isset( $sqlSelectObject->date->{'nickelRueckgabeDate'} ) && !isset( $sqlSelectObject->berechnung->{'nickelBerechnung'} ) )
//                 {
//                     $pdoConnect->beginTransaction();
//                     $sql =
//                         "
//                             INSERT INTO 
//                                 tbl_nickel( probenNummer, nickelRueckgabeDateTime )
//                             VALUES 
//                                 ( :probenNummer, NOW() )
//                             ON DUPLICATE KEY UPDATE
//                                 tbl_nickel.nickelRueckgabeDateTime = NOW()
//                         ";

//                     $pdoStatement = $pdoConnect->prepare( $sql );
//                     $pdoStatement->bindParam( ':probenNummer', $i["probenNummer"], PDO::PARAM_STR );
//                     $pdoStatement->execute();
//                     // $pdoConnect->commit();

//                     // $pdoConnect->beginTransaction();
//                     $sql =
//                     "
//                         UPDATE 
//                             tbl_nickel, tbl_status, tbl_mustereingang
//                         SET 
//                             tbl_nickel.nickelBerechnung = IF( tbl_status.mitNickel LIKE 'active' AND tbl_nickel.nickelRueckgabeDateTime IS NOT NULL, TIMEDIFF(tbl_nickel.nickelRueckgabeDateTime, tbl_mustereingang.eingangDateTime), NULL )
//                         WHERE
//                             tbl_nickel.probenNummer = :probenNummer
//                         AND 
//                             tbl_status.probenNummer = :probenNummerNickel
//                         AND
//                             tbl_mustereingang.probenNummer = :probenNummerPK
//                     ";
//                     $pdoStatement = $pdoConnect->prepare( $sql );
//                     $pdoStatement->bindParam( ':probenNummer', $i["probenNummer"], PDO::PARAM_STR );
//                     $pdoStatement->bindParam( ':probenNummerNickel', $i["probenNummer"], PDO::PARAM_STR );
//                     $pdoStatement->bindParam( ':probenNummerPK', $i["probenNummer"], PDO::PARAM_STR );
//                     $pdoStatement->execute();

//                     $pdoConnect->commit();

//                     array_push( $successArray, $i["probenNummer"] );
//                     $responseData['successInput'] = $successArray;
//                     $responseData['success'] = true;
//                     $responseData['objectText'] = 'Nickel Rückgabe erfolgreich';
//                 }
//                 elseif( isset( $sqlSelectObject->date->{'nickelRueckgabeDate'} ) || isset( $sqlSelectObject->berechnung->{'nickelBerechnung'} ) )
//                 {
//                     // throw new PDOException( $pdoException );
//                     $pdoConnect->beginTransaction();
//                     $sql =
//                     "
//                         INSERT INTO 
//                             tbl_mustereingang( probenNummer, sollDatum, eingangDateTime )
//                         VALUES 
//                             ( :probenNummer, :sollDatum, NOW() )
//                     ";

//                     $pdoStatement = $pdoConnect->prepare( $sql );
//                     $pdoStatement->bindParam( ':probenNummer', $i["probenNummer"], PDO::PARAM_STR );
//                     $pdoStatement->bindParam( ':sollDatum', $i["sollDatum"], PDO::PARAM_STR );

//                     $pdoStatement->execute();

//                     $pdoConnect->commit();
//                 }
//             }
//             catch( PDOException $pdoException )
//             {
//                 $pdoConnect->rollBack();

//                 preg_match( '/\d{2}-\d{6}-\d{2}/', $pdoException->errorInfo[2], $errorItem );
//                 array_push( $errorArray, $errorItem );
//                 $responseData['doubleInput'] = $errorArray;
//                 $responseData['failCode'] = $pdoException->getCode();
//                 // mail( "adm1n.zpn.verwaltung@gmail.com", "Datenbank Fehler!", json_encode($responseData) );
//             }
//         }
//     }
//     echo json_encode( $responseData );
//     $pdoConnect = null;
// }
