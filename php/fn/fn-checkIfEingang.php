<?php
    //Prüft ob ein Datensatz bereits vorhanden ist und wenn nicht, wird der Datensatu nachgetragen ohne Eingangs Zeitpunkt
function checkIfEingang($pdoConnect, $probenNummer, $sollDatum, $pdoObject, $responseData) {

    try {
        $path_fnSqlSelectObject = 'fn/fn-sqlSelectObject.php';
        require_once($path_fnSqlSelectObject);

        $sqlSelectObject = sqlSelectObjectBase($pdoConnect, $probenNummer, $pdoObject);

        if ($sqlSelectObject->base === false){

            $pdoConnect->beginTransaction();

            $sql =
            "
                INSERT INTO 
                    tbl_baserecord ( probenNummer, sollDatum )
                VALUES 
                    ( :probenNummer, :sollDatum )
            ";
            $pdoStatement = $pdoConnect->prepare($sql);
            $pdoStatement->bindParam(':probenNummer', $probenNummer, PDO::PARAM_STR);
            $pdoStatement->bindParam(':sollDatum', $sollDatum, PDO::PARAM_STR);
            $pdoStatement->execute();

            $pdoConnect->commit();

            $responseData->success = true;
            $responseData->objectItem = $probenNummer;
        } else {
            $responseData->success = false;
            $responseData->objectItem = $probenNummer;
            $responseData->objectTable = 'tbl_mustereingang';
            $responseData->objectText = 'Bereits vorhanden';
        }
    } catch (PDOException $pdoException) {
        $pdoException = (array) $pdoException;
        $responseData->success = false;
        $responseData->objectItem = $probenNummer;
        $responseData->failCode = $pdoException['errorInfo'][0];
        $responseData->pdoException = $pdoException['errorInfo'];
        
        $pdoConnect->rollBack();
        return $responseData;
        // mail( "adm1n.zpn.verwaltung@gmail.com", "Datenbank Fehler!", json_encode($responseData) );
    }
    return $responseData;
}