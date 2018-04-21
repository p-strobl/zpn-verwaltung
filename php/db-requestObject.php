<?php

require_once '../../connect/db-connect.php';
require_once 'fn/fn-sqlSelectObject.php';

$yesRegEx = '/\d{2}-\d{6}-\d{2}/';
$test = key($_POST);

if (isset($_POST) && preg_match($yesRegEx, array_values($_POST)[0]) && strlen(array_values($_POST)[0]) === 12) {
    $pdoConnect = db_connect();
    $pdoObject = new StdClass;
    switch (key($_POST)) {
        case 'requestDataSetComplete':
            $sqlSelectObject = sqlSelectObjectBase($pdoConnect, array_values($_POST)[0], $pdoObject);

            if ($sqlSelectObject->base !== false) {
                $sqlSelectObject = sqlSelectObjectComplete($pdoConnect, array_values($_POST)[0], $pdoObject);
            }
            break;
        case 'requestDataSetDate':
            $sqlSelectObject = sqlSelectObjectDate($pdoConnect, array_values($_POST)[0], $pdoObject);
            break;

        default:
    }
    echo json_encode($sqlSelectObject);
    $pdoConnect = null;
}
