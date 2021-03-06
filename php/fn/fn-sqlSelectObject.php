<?php

function removeUnset($pdoObject) {

    foreach ($pdoObject as $pdoObjectkey => $pdoObjectValue) {
        if ($pdoObject->base !== false) {
            foreach ($pdoObjectValue as $itemKey => $itemValue) {
                if ($itemValue === null || $itemValue === 'deactive' || $itemValue === '00.00.0000' || $itemValue === '') {
                    unset($pdoObjectValue->{$itemKey});
                }
            }
            if (count( (array) $pdoObjectValue) === 0) {
                unset($pdoObject->{$pdoObjectkey});
            }
        }
    }
    return $pdoObject;
}

function sqlSelectObjectBase($pdoConnect, $probenNummer, $pdoObject) {
    try {
        $pdoConnect->beginTransaction();
        $sql =
        "
            SELECT
                tbl_baserecord.probenNummer,
                DATE_FORMAT(tbl_baserecord.sollDatum, '%d.%m.%Y') AS sollDatum
            FROM tbl_baserecord 
            WHERE tbl_baserecord.probenNummer = :probenNummer
        ";
        $pdoStatement = $pdoConnect->prepare( $sql );
        $pdoStatement->bindParam( ':probenNummer', $probenNummer, PDO::PARAM_STR );
        $pdoStatement->execute();
        $pdoObject->base = $pdoStatement->fetch( PDO::FETCH_OBJ );

        $pdoConnect->commit();

        $pdoObject = removeUnset($pdoObject);
        return $pdoObject;
    }
    catch (PDOException $pdoException) {
        $pdoConnect->rollBack();
    }
}

function sqlSelectObjectStatus($pdoConnect, $probenNummer, $pdoObject) {
    try {
        $pdoConnect->beginTransaction();
        $sql =
        "
            SELECT
                tbl_status.mit60g,
                tbl_status.mitExpress,
                tbl_status.mitIntern,
                tbl_status.mitKlaerfallBack,
                tbl_status.mitLfgb,
                tbl_status.mitNickel,
                tbl_status.mitToys,
                tbl_beurteilung.anAbteilung
            FROM tbl_baserecord
            LEFT OUTER JOIN tbl_einwaage
                ON tbl_baserecord.probenNummer = tbl_einwaage.probenNummer
            LEFT OUTER JOIN tbl_status
                ON tbl_baserecord.probenNummer = tbl_status.probenNummer
            LEFT OUTER JOIN tbl_beurteilung
                ON tbl_baserecord.probenNummer = tbl_beurteilung.probenNummer
            WHERE tbl_baserecord.probenNummer = :probenNummer
        ";
        $pdoStatement = $pdoConnect->prepare( $sql );
        $pdoStatement->bindParam( ':probenNummer', $probenNummer, PDO::PARAM_STR );
        $pdoStatement->execute();
        $pdoObject->status = $pdoStatement->fetch( PDO::FETCH_OBJ );

        $pdoConnect->commit();

        $pdoObject = removeUnset($pdoObject);
        return $pdoObject;
    }
    catch (PDOException $pdoException) {
        $pdoConnect->rollBack();
    }
}

function sqlSelectObjectDate($pdoConnect, $probenNummer, $pdoObject) {
    try {
        $pdoObject = sqlSelectObjectBase($pdoConnect, $probenNummer, $pdoObject);
        $pdoConnect->beginTransaction();
        $sql =
        "
            SELECT
                IF(tbl_lfgbmustereingang.lfgbEingangDateTime IS NOT NULL, DATE_FORMAT(tbl_lfgbmustereingang.lfgbEingangDateTime, '%d.%m.%Y'), '') AS anLfgbAbteilungEingangDate,
                IF(tbl_textilmustereingang.textilEingangDateTime IS NOT NULL, DATE_FORMAT(tbl_textilmustereingang.textilEingangDateTime, '%d.%m.%Y'), '')  AS anTextilAbteilungEingangDate,
                DATE_FORMAT(tbl_beurteilung.beurteilungBereitgestelltDateTime, '%d.%m.%Y') AS beurteilungBereitgestelltDateTime, 
                DATE_FORMAT(tbl_einwaage.einwaageBeginn, '%d.%m.%Y') AS einwaageBeginn, 
                DATE_FORMAT(tbl_einwaage.einwaageEnde, '%d.%m.%Y') AS einwaageEnde, 
                DATE_FORMAT(tbl_klaerfall.klaerfallBeginnDateTime, '%d.%m.%Y') AS klaerfallBeginnDateTime, 
                DATE_FORMAT(tbl_klaerfall.klaerfallEndeDateTime, '%d.%m.%Y') AS klaerfallEndeDateTime, 
                DATE_FORMAT(tbl_mana.manaGestelltDateTime, '%d.%m.%Y') AS manaGestelltDateTime, 
                DATE_FORMAT(tbl_mana.manaErhaltenDateTime, '%d.%m.%Y') AS manaErhaltenDateTime, 
                DATE_FORMAT(tbl_mana.manaEinwaageDateTime, '%d.%m.%Y') AS manaEinwaageDateTime, 
                DATE_FORMAT(tbl_mana.manaZpnWagenDateTime, '%d.%m.%Y') AS manaZpnWagenDateTime, 
                DATE_FORMAT(tbl_nickel.nickelRueckgabeDateTime, '%d.%m.%Y') AS nickelRueckgabeDateTime, 
                DATE_FORMAT(tbl_storno.stornoDateTime, '%d.%m.%Y') AS stornoDateTime, 
                DATE_FORMAT(tbl_zpnwagen.zpnWagenDateTime, '%d.%m.%Y') AS zpnWagenDateTime,
                DATE_FORMAT(tbl_zpnmustereingang.zpnEingangDateTime, '%d.%m.%Y') AS zpnEingangDateTime, 
                DATE_FORMAT(tbl_zerlegung.zerlegungStart, '%d.%m.%Y' ) AS zerlegungStart,
                DATE_FORMAT(tbl_zerlegung.zerlegungEnde, '%d.%m.%Y' ) AS zerlegungEnde
            FROM tbl_baserecord 
            LEFT OUTER JOIN tbl_lfgbmustereingang
                ON tbl_baserecord.probenNummer = tbl_lfgbmustereingang.probenNummer
            LEFT OUTER JOIN tbl_textilmustereingang
                ON tbl_baserecord.probenNummer = tbl_textilmustereingang.probenNummer
            LEFT OUTER JOIN tbl_beurteilung
                ON tbl_baserecord.probenNummer = tbl_beurteilung.probenNummer
            LEFT OUTER JOIN tbl_klaerfall
                ON tbl_baserecord.probenNummer = tbl_klaerfall.probenNummer
            LEFT OUTER JOIN tbl_mana
                ON tbl_baserecord.probenNummer = tbl_mana.probenNummer
            LEFT OUTER JOIN tbl_nickel
                ON tbl_baserecord.probenNummer = tbl_nickel.probenNummer
            LEFT OUTER JOIN tbl_einwaage
                ON tbl_baserecord.probenNummer = tbl_einwaage.probenNummer
            LEFT OUTER JOIN tbl_storno
                ON tbl_baserecord.probenNummer = tbl_storno.probenNummer
            LEFT OUTER JOIN tbl_zerlegung
                ON tbl_baserecord.probenNummer = tbl_zerlegung.probenNummer
            LEFT OUTER JOIN tbl_zpnmustereingang
                ON tbl_baserecord.probenNummer = tbl_zpnmustereingang.probenNummer
            LEFT OUTER JOIN tbl_zpnwagen
                ON tbl_baserecord.probenNummer = tbl_zpnwagen.probenNummer
            WHERE tbl_baserecord.probenNummer = :probenNummer
        ";
        $pdoStatement = $pdoConnect->prepare($sql);
        $pdoStatement->bindParam(':probenNummer', $probenNummer, PDO::PARAM_STR);
        $pdoStatement->execute();
        $pdoObject->date = $pdoStatement->fetch(PDO::FETCH_OBJ);

        $pdoConnect->commit();
        $pdoObject = removeUnset($pdoObject);
        return $pdoObject;
    }
    catch (PDOException $pdoException) {
        $pdoConnect->rollBack();
    }
}

function sqlSelectObjectComplete($pdoConnect, $probenNummer, $pdoObject) {
    try {
        $pdoConnect->beginTransaction();
        $sql =
        "
            SELECT
                IF(tbl_lfgbmustereingang.lfgbEingangDateTime IS NOT NULL, TIME(tbl_lfgbmustereingang.lfgbEingangDateTime), '') AS anLfgbAbteilungEingangTime,
                IF(tbl_textilmustereingang.textilEingangDateTime IS NOT NULL, TIME(tbl_textilmustereingang.textilEingangDateTime), '')  AS anTextilAbteilungEingangTime,
                TIME(tbl_beurteilung.beurteilungBereitgestelltDateTime) AS beurteilungBereitTime,
                TIME(tbl_klaerfall.klaerfallBeginnDateTime) AS klaerfallBeginnTime,
                TIME(tbl_klaerfall.klaerfallEndeDateTime) AS klaerfallEndeTime,
                TIME(tbl_mana.manaGestelltDateTime) AS manaGestelltTime,
                TIME(tbl_mana.manaErhaltenDateTime) AS manaErhaltenTime,
                TIME(tbl_mana.manaEinwaageDateTime) AS manaEinwaageTime,
                TIME(tbl_mana.manaZpnWagenDateTime) AS manaZpnWagenTime,
                TIME(tbl_nickel.nickelRueckgabeDateTime) AS nickelRueckgabeTime,
                TIME(tbl_einwaage.einwaageBeginn) AS einwaageBeginnTime,
                TIME(tbl_einwaage.einwaageEnde) AS einwaageEndeTime,
                TIME(tbl_storno.stornoDateTime) AS stornoTime,
                TIME(tbl_zerlegung.zerlegungStart) AS zerlegungStartTime,
                TIME(tbl_zerlegung.zerlegungEnde) AS zerlegungEndeTime,
                TIME(tbl_zpnmustereingang.zpnEingangDateTime) AS zpnMusterEingangTime,
                TIME(tbl_zpnwagen.zpnWagenDateTime) AS zpnWagenTime
            FROM tbl_baserecord
            LEFT OUTER JOIN tbl_lfgbmustereingang
                ON tbl_baserecord.probenNummer = tbl_lfgbmustereingang.probenNummer
            LEFT OUTER JOIN tbl_textilmustereingang
                ON tbl_baserecord.probenNummer = tbl_textilmustereingang.probenNummer
            LEFT OUTER JOIN tbl_beurteilung
                ON tbl_baserecord.probenNummer = tbl_beurteilung.probenNummer
            LEFT OUTER JOIN tbl_klaerfall
                ON tbl_baserecord.probenNummer = tbl_klaerfall.probenNummer
            LEFT OUTER JOIN tbl_mana
                ON tbl_baserecord.probenNummer = tbl_mana.probenNummer
            LEFT OUTER JOIN tbl_nickel
                ON tbl_baserecord.probenNummer = tbl_nickel.probenNummer
            LEFT OUTER JOIN tbl_einwaage
                ON tbl_baserecord.probenNummer = tbl_einwaage.probenNummer
            LEFT OUTER JOIN tbl_storno
                ON tbl_baserecord.probenNummer = tbl_storno.probenNummer
            LEFT OUTER JOIN tbl_zerlegung
                ON tbl_baserecord.probenNummer = tbl_zerlegung.probenNummer
            LEFT OUTER JOIN tbl_zpnmustereingang
                ON tbl_baserecord.probenNummer = tbl_zpnmustereingang.probenNummer
            LEFT OUTER JOIN tbl_zpnwagen
                ON tbl_baserecord.probenNummer = tbl_zpnwagen.probenNummer
            WHERE tbl_baserecord.probenNummer = :probenNummer
        ";
        $pdoStatement = $pdoConnect->prepare( $sql );
        $pdoStatement->bindParam( ':probenNummer', $probenNummer, PDO::PARAM_STR );
        $pdoStatement->execute();
        $pdoConnect->commit();
        $pdoObject->time = $pdoStatement->fetch( PDO::FETCH_OBJ );
        $pdoConnect->beginTransaction();
        $sql =
        "
            SELECT
                tbl_kommentar.kommentarText, DATE_Format(tbl_kommentar.kommentarDateTime, '%d.%m.%Y') AS kommentarDate, TIME(tbl_kommentar.kommentarDateTime) AS kommentarTime
            FROM
                tbl_kommentar
            WHERE
                tbl_kommentar.probennummer = :probenNummer
        ";
        $pdoStatement = $pdoConnect->prepare($sql);
        $pdoStatement->bindParam(':probenNummer', $probenNummer, PDO::PARAM_STR);
        $pdoStatement->execute();
        $pdoConnect->commit();
        $pdoObject->kommentar = (object) $pdoStatement->fetchAll();
        $pdoConnect->beginTransaction();
        $sql =
        "
            SELECT
                tbl_status.mit60g,
                tbl_status.mitExpress,
                tbl_status.mitIntern,
                tbl_status.mitKlaerfallBack,
                tbl_status.mitLfgb,
                tbl_status.mitNickel,
                tbl_status.mitToys,
                tbl_beurteilung.anAbteilung
            FROM tbl_baserecord
            LEFT OUTER JOIN tbl_einwaage
                ON tbl_baserecord.probenNummer = tbl_einwaage.probenNummer
            LEFT OUTER JOIN tbl_status
                ON tbl_baserecord.probenNummer = tbl_status.probenNummer
            LEFT OUTER JOIN tbl_beurteilung
                ON tbl_baserecord.probenNummer = tbl_beurteilung.probenNummer
            WHERE tbl_baserecord.probenNummer = :probenNummer
        ";
        $pdoStatement = $pdoConnect->prepare( $sql );
        $pdoStatement->bindParam( ':probenNummer', $probenNummer, PDO::PARAM_STR );
        $pdoStatement->execute();
        $pdoConnect->commit();
        $pdoObject->status = $pdoStatement->fetch( PDO::FETCH_OBJ );

        $pdoConnect->beginTransaction();
        $sql =
        "
            SELECT
                IF(tbl_lfgbmustereingang.beurteilungLfgbBerechnung IS NOT NULL, tbl_lfgbmustereingang.beurteilungLfgbBerechnung, '') AS anLfgbAbteilungBerechnung,
                IF(tbl_textilmustereingang.beurteilungTextilBerechnung IS NOT NULL, tbl_textilmustereingang.beurteilungTextilBerechnung, '') AS anTextilAbteilungBerechnung,
                tbl_klaerfall.klaerfallBerechnung,
                tbl_mana.manaBerechnungDateTimeAnfrage,
                tbl_mana.manaBerechnungDateTimeEinwaage,
                tbl_mana.manaBerechnungDateTimeGesamt,
                tbl_nickel.nickelBerechnung,
                tbl_einwaage.einwaageBerechnung,
                tbl_zerlegung.zerlegungBerechnung,
                tbl_zpnmustereingang.beurteilungZpnBerechnung,
                IF(tbl_zpnmustereingang.lfgbZpnBerechnung IS NOT NULL, tbl_zpnmustereingang.lfgbZpnBerechnung, '') AS beurteilungAbteilungBerechnung,
                tbl_zpnwagen.berechnungDateTimeZpnwagen
            FROM tbl_baserecord
            LEFT OUTER JOIN tbl_lfgbmustereingang
                ON tbl_baserecord.probenNummer = tbl_lfgbmustereingang.probenNummer
            LEFT OUTER JOIN tbl_textilmustereingang
                ON tbl_baserecord.probenNummer = tbl_textilmustereingang.probenNummer
            LEFT OUTER JOIN tbl_klaerfall
                ON tbl_baserecord.probenNummer = tbl_klaerfall.probenNummer
            LEFT OUTER JOIN tbl_mana
                ON tbl_baserecord.probenNummer = tbl_mana.probenNummer
            LEFT OUTER JOIN tbl_nickel
                ON tbl_baserecord.probenNummer = tbl_nickel.probenNummer
            LEFT OUTER JOIN tbl_einwaage
                ON tbl_baserecord.probenNummer = tbl_einwaage.probenNummer
            LEFT OUTER JOIN tbl_zerlegung
                ON tbl_baserecord.probenNummer = tbl_zerlegung.probenNummer
            LEFT OUTER JOIN tbl_zpnmustereingang
                ON tbl_baserecord.probenNummer = tbl_zpnmustereingang.probenNummer
            LEFT OUTER JOIN tbl_zpnwagen
                ON tbl_baserecord.probenNummer = tbl_zpnwagen.probenNummer
            WHERE tbl_baserecord.probenNummer = :probenNummer
        ";
        $pdoStatement = $pdoConnect->prepare( $sql );
        $pdoStatement->bindParam( ':probenNummer', $probenNummer, PDO::PARAM_STR );
        $pdoStatement->execute();
        $pdoConnect->commit();
        $pdoObject->berechnung = $pdoStatement->fetch( PDO::FETCH_OBJ );

        $pdoObject = sqlSelectObjectBase($pdoConnect, $probenNummer, $pdoObject);

        $pdoObject = removeUnset($pdoObject);

        $pdoObject = sqlSelectObjectDate($pdoConnect, $probenNummer, $pdoObject);

        return $pdoObject;
    }
    catch (PDOException $pdoException) {
        $pdoConnect->rollBack();
    }
}