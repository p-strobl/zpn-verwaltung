<?php

require_once 'db-connect.php';

if ( isset( $_POST['updateModalStatus'] ) ) {
    $receivedItem = $_POST['updateModalStatus'];

    $yesRegEx = '/\d{2}-\d{6}-\d{2}/';

    $responseData = array
    (
        'success' => false,
        'successItem' => '',
        'buttonStatus' => '',
        'failItem' => '',
        'failCode' => '',
        'pdoException' => ''
    );

    if (preg_match($yesRegEx, $receivedItem)) {

        try{
            $pdoConnect = db_connect();

            $pdoConnect->beginTransaction();
    
            $sql =
                "
                    UPDATE tbl_status
                    SET ". $updateItemId ." = :updateOnOffItemValue
                    WHERE probenNummer = :updatedProbenNummer;
                ";

            $pdoStatement = $pdoConnect->prepare($sql);
            $pdoStatement->bindParam(':updatedProbenNummer', $receivedItem, PDO::PARAM_STR);
            $pdoStatement->bindParam(':updateOnOffItemValue', $updateOnOffItemValue, PDO::PARAM_STR);
            $pdoStatement->execute();

            $responseData['onOffDetailsStatus'] = $updateOnOffItemValue;
    
            $pdoConnect->commit();
        }
        catch(PDOException $pdoException){
            $pdoConnect->rollBack();
        }

        
    }
}