<?php

header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');

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
              DATE(tbl_beurteilung.beurteilungBereitgestelltDateTime) = DATE(NOW())
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
          AND
              DATE(tbl_zpnmustereingang.zpnEingangDateTime) = DATE(NOW())
      )
      -
       (
          SELECT COUNT(*)
          FROM
              tbl_zpnmustereingang, tbl_lfgbmustereingang
          WHERE
              tbl_zpnmustereingang.probenNummer = tbl_lfgbmustereingang.probenNummer
              AND
              DATE(tbl_zpnmustereingang.zpnEingangDateTime) = DATE(NOW())
      )
      +
        (
          SELECT COUNT(*)
          FROM
              tbl_zpnmustereingang, tbl_lfgbmustereingang
          WHERE
              tbl_zpnmustereingang.probenNummer = tbl_lfgbmustereingang.probenNummer
              AND
              DATE(tbl_zpnmustereingang.zpnEingangDateTime) = DATE(NOW())
          )
          AS zpnAnzahl,
        (
            SELECT COUNT(*)
            FROM
                tbl_beurteilung
            WHERE
                DATE(tbl_beurteilung.beurteilungBereitgestelltDateTime) = DATE(NOW())
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
        AND
            DATE(tbl_lfgbmustereingang.lfgbEingangDateTime) = DATE(NOW())
        )
            AS lfgbAnzahl,
        (
            SELECT COUNT(*)
            FROM
                tbl_beurteilung
            WHERE
                DATE(tbl_beurteilung.beurteilungBereitgestelltDateTime) = DATE(NOW())
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
            AND 
                DATE(tbl_textilmustereingang.textilEingangDateTime) = DATE(NOW())
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
        // $pdoFetchedObject = $pdoStatement->fetch(PDO::FETCH_OBJ);
        $pdoFetchedObject = json_encode($pdoStatement->fetch());
        $pdoConnect->commit();
    }
    catch (PDOException $pdoException) {
        $pdoConnect->rollBack();
    }
    // echo json_encode($pdoFetchedObject);
    echo "data: {$pdoFetchedObject}\n\n";
    flush();
    sleep(5);
}

getPreviewItems();