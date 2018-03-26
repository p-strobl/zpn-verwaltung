<?php

require_once 'db-connect.php';

if ( isset( $_POST['requestDataSet'] ) )
{
    set_include_path( 'php/' );
    include_once 'fn/fn-sqlSelectObject.php';

    $pdoConnect = db_connect();
    $receivedItem = $_POST['requestDataSet'];

    $sqlSelectObject = sqlSelectObject( $pdoConnect, $receivedItem );

    echo json_encode( $sqlSelectObject );
}

$pdoConnect = null;
