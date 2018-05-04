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
                FROM
                    tbl_beurteilung
                WHERE
                    DATE(tbl_beurteilung.beurteilungBereitgestelltDateTime) <= DATE(NOW())
                AND
                    tbl_beurteilung.anAbteilung = "ZPN"
            )
            -
            (
                SELECT COUNT(*)
                FROM
                    tbl_zpnmustereingang, tbl_beurteilung
                WHERE
                    tbl_zpnmustereingang.probenNummer = tbl_beurteilung.probenNummer
            )
            +
            (
                SELECT COUNT(*)
                FROM
                    tbl_zpnmustereingang, tbl_lfgbmustereingang
                WHERE
                    tbl_zpnmustereingang.probenNummer = tbl_lfgbmustereingang.probenNummer
            )
                AS zpnAnzahl,
            (
                SELECT COUNT(*)
                FROM
                    tbl_beurteilung
                WHERE
                    DATE(tbl_beurteilung.beurteilungBereitgestelltDateTime) <= DATE(NOW())
                AND
                    tbl_beurteilung.anAbteilung = "LFGB"
            )
            -
            (
                SELECT COUNT(*)
                FROM
                    tbl_lfgbmustereingang, tbl_beurteilung
            WHERE
                tbl_lfgbmustereingang.probenNummer = tbl_beurteilung.probenNummer
            )
                AS lfgbAnzahl,
            (
                SELECT COUNT(*)
                FROM
                    tbl_beurteilung
                WHERE
                    DATE(tbl_beurteilung.beurteilungBereitgestelltDateTime) <= DATE(NOW())
                AND
                    tbl_beurteilung.anAbteilung = "Textilphysik"
            )
            -
            (
                SELECT COUNT(*)
                FROM
                    tbl_textilmustereingang, tbl_beurteilung
                WHERE
                    tbl_textilmustereingang.probenNummer = tbl_beurteilung.probenNummer
            )
                AS textilAnzahl,
            (
                SELECT COUNT(*)
                FROM
                    tbl_zpnmustereingang
                WHERE
                    DATE(tbl_zpnmustereingang.zpnEingangDateTime) = DATE(NOW())
            )
                AS zpnMustereingang,
            (
                SELECT COUNT(*)
                FROM
                    tbl_klaerfall
                WHERE
                    DATE(tbl_klaerfall.klaerfallBeginnDateTime) = DATE(NOW())
            )
                AS zpnKlaerfaelle,
            (
                SELECT COUNT(*)
                FROM
                    tbl_zpnwagen
                WHERE
                DATE(tbl_zpnwagen.zpnWagenDateTime) = DATE(NOW())
            )
            AS zpnWagen
        ';

        $pdoStatement = $pdoConnect->prepare($sql);
        $pdoStatement->execute();
        $pdoFetchedObject = $pdoStatement->fetch(PDO::FETCH_OBJ);
        $pdoConnect->commit();
    }
    catch (PDOException $pdoException) {
        $pdoConnect->rollBack();
    }
    echo json_encode($pdoFetchedObject);
}

getPreviewItems();




