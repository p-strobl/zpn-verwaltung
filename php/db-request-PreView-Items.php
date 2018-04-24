<?php

function getPreviewItems() {
    $path_dbConnect = 'db-connect.php';
    require_once($path_dbConnect);
    
    try {
        $pdoConnect = db_connect();
        $pdoConnect->beginTransaction();

        $sql =
        '
            SELECT
            (
                SELECT COUNT(*)
                FROM tbl_beurteilung
                WHERE
                    DATE(tbl_beurteilung.beurteilungBereitgestelltDateTime) = DATE(NOW())
                AND tbl_beurteilung.anAbteilung = "ZPN"
            ) AS anZPN,
            (
                SELECT COUNT(*)
                FROM tbl_beurteilung
                WHERE
                    DATE(tbl_beurteilung.beurteilungBereitgestelltDateTime) = DATE(NOW())
                AND tbl_beurteilung.anAbteilung = "LFGB"
            ) AS anLFGB,
            (
                SELECT COUNT(*)
                FROM tbl_beurteilung
                WHERE
                    DATE(tbl_beurteilung.beurteilungBereitgestelltDateTime) = DATE(NOW())
                AND tbl_beurteilung.anAbteilung = "Textilphysik"
            ) AS anTextilphysik,
            (
                SELECT COUNT(*)
                FROM tbl_zpnmustereingang
                WHERE
                    DATE(tbl_zpnmustereingang.zpnEingangDateTime) = DATE(NOW())
            ) AS zpnMustereingang,
            (
                SELECT COUNT(*)
                FROM tbl_klaerfall
                WHERE
                    DATE(tbl_klaerfall.klaerfallBeginnDateTime) = DATE(NOW())
            ) AS zpnKlaerfaelle,
            (
                SELECT COUNT(*)
                FROM tbl_zpnwagen
                WHERE
                    DATE(tbl_zpnwagen.zpnWagenDateTime) = DATE(NOW())
            ) AS zpnWagen
        ';

        $pdoStatement = $pdoConnect->prepare($sql);
        $pdoStatement->execute();
        $pdoFetchedObject = $pdoStatement->fetch(PDO::FETCH_OBJ);
        $pdoConnect->commit();
    }
    catch(PDOException $pdoException) {
        $pdoConnect->rollBack();
    }
    echo json_encode($pdoFetchedObject);
}

getPreviewItems();




