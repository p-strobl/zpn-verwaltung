<?php

require_once 'db-connect.php';

function getTiming( $receivedData )
{
    $pdoConnect = db_connect();

    $sql =
        "
            SELECT
            tbl_mustereingang.probenNummer, tbl_mustereingang.sollDatum, DATE_FORMAT(tbl_mustereingang.eingangDateTime, GET_FORMAT(DATE, 'EUR') ) eingangDate, DATE_FORMAT(tbl_mustereingang.eingangDateTime, '%H:%i:%s') eingangTime,
            tbl_gesamtberechnung.gesamtInZPN, tbl_gesamtberechnung.gesamtProbenNahme, tbl_gesamtberechnung.gesamtKlaerfall, tbl_gesamtberechnung.gesamtManaAnfrage, tbl_gesamtberechnung.gesamtManaDauer, tbl_gesamtberechnung.gesamtNickel,
            tbl_status.mitExpress, tbl_status.mitIntern, tbl_status.mitNickel, tbl_status.mitLfgb, tbl_status.mitToys, tbl_status.mit60g, tbl_status.mitKlaerfallBack,
            tbl_probennahme.onOffStatusProbenNahme, DATE_FORMAT(tbl_probennahme.probenNahmeBeginn, GET_FORMAT(DATE, 'EUR') ) probenNahmeBeginnDate, DATE_FORMAT(tbl_probennahme.probenNahmeBeginn, '%H:%i:%s') probenNahmeBeginnTime, DATE_FORMAT(tbl_probennahme.probenNahmeEnde, GET_FORMAT(DATE, 'EUR') ) probenNahmeEndeDate, DATE_FORMAT(tbl_probennahme.probenNahmeEnde, '%H:%i:%s') probenNahmeEndeTime, tbl_probennahme.calculateTimeDiffProbenNahme,
            tbl_zpnwagen.onOffStatusZpnWagen, DATE_FORMAT(tbl_zpnwagen.zpnWagenDateTime, GET_FORMAT(DATE, 'EUR') ) zpnWagenDate, DATE_FORMAT(tbl_zpnwagen.zpnWagenDateTime, '%H:%i:%s') zpnWagenTime, tbl_zpnwagen.calculateTimeDiffZpnWagen,
            tbl_kommentar.onOffStatusKommentar, tbl_kommentar.kommentarText, DATE_FORMAT(tbl_kommentar.kommentarDateTime, GET_FORMAT(DATE, 'EUR') ) kommentarDate, DATE_FORMAT(tbl_kommentar.kommentarDateTime, '%H:%i:%s') kommentarTime,
            tbl_mana.onOffStatusManaGestellt, DATE_FORMAT(tbl_mana.maNaGestelltDateTime, GET_FORMAT(DATE, 'EUR') ) maNaGestelltDate, DATE_FORMAT(tbl_mana.maNaGestelltDateTime, '%H:%i:%s') maNaGestelltTime, tbl_mana.onOffStatusManaErhalten, DATE_FORMAT(tbl_mana.maNaErhaltenDateTime, GET_FORMAT(DATE, 'EUR') ) maNaErhaltenDate, DATE_FORMAT(tbl_mana.maNaErhaltenDateTime, '%H:%i:%s') maNaErhaltenTime,  tbl_mana.calculateTimeDiffManaAnfrage, tbl_mana.onOffStatusManaWagen, DATE_FORMAT(tbl_mana.maNaZpnWagenDateTime, GET_FORMAT(DATE, 'EUR') ) maNaZpnWagenDate, DATE_FORMAT(tbl_mana.maNaZpnWagenDateTime, '%H:%i:%s') maNaZpnWagenTime, tbl_mana.calculateTimeDiffManaGesamt,
            tbl_nickel.onOffStatusNickelRueckgabe, DATE_FORMAT(tbl_nickel.nickelRueckgabeDateTime, GET_FORMAT(DATE, 'EUR') ) nickelRueckgabeDate, DATE_FORMAT(tbl_nickel.nickelRueckgabeDateTime, '%H:%i:%s') nickelRueckgabeTime, tbl_nickel.calculateTimeDiffNickelRueckgabe,
            tbl_klaerfall.onOffStatusKlaerfall, DATE_FORMAT(tbl_klaerfall.klaefallBeginnDateTime, GET_FORMAT(DATE, 'EUR') ) klaefallBeginnDate, DATE_FORMAT(tbl_klaerfall.klaefallBeginnDateTime, '%H:%i:%s') klaefallBeginnTime, DATE_FORMAT(tbl_klaerfall.klaerfallEndeDateTime, GET_FORMAT(DATE, 'EUR') ) klaerfallEndeDate, DATE_FORMAT(tbl_klaerfall.klaerfallEndeDateTime, '%H:%i:%s') klaerfallEndeTime, tbl_klaerfall.calculateTimeDiffKlaerfall,
            tbl_storno.onOffStatusStorno, DATE_FORMAT(tbl_storno.stornoDateTime, GET_FORMAT(DATE, 'EUR') ) stornoDate, DATE_FORMAT(tbl_storno.stornoDateTime, '%H:%i:%s') stornoTime
        
            FROM tbl_mustereingang
        
            LEFT JOIN tbl_gesamtberechnung ON tbl_mustereingang.probenNummer = tbl_gesamtberechnung.probenNummer
            LEFT JOIN tbl_status ON tbl_mustereingang.probenNummer = tbl_status.probenNummer
            LEFT JOIN tbl_probennahme ON tbl_mustereingang.probenNummer = tbl_probennahme.probenNummer
            LEFT JOIN tbl_zpnwagen ON tbl_mustereingang.probenNummer = tbl_zpnwagen.probenNummer
            LEFT JOIN tbl_kommentar ON tbl_mustereingang.probenNummer = tbl_kommentar.probenNummer
            LEFT JOIN tbl_mana ON tbl_mustereingang.probenNummer = tbl_mana.probenNummer
            LEFT JOIN tbl_nickel ON tbl_mustereingang.probenNummer = tbl_nickel.probenNummer
            LEFT JOIN tbl_klaerfall ON tbl_mustereingang.probenNummer = tbl_klaerfall.probenNummer
            LEFT JOIN tbl_storno ON tbl_mustereingang.probenNummer = tbl_storno.probenNummer
        
            WHERE tbl_mustereingang.probenNummer = :probenNummer;
        ";

    $pdoStatement = $pdoConnect->prepare($sql);
    $pdoStatement->bindParam(':probenNummer', $receivedData, PDO::PARAM_STR);
    $pdoStatement->execute();

    $requestedData = $pdoStatement->fetchObject();

    if ( $requestedData != false )
    {

        foreach ( $requestedData as $key => &$value )
        {
            $requestedData->$key = str_replace('00.00.0000', null, $value);
            $requestedData->$key = str_replace('00:00:00', null, $value);
            $requestedData->$key = str_replace('deactive', null, $value);
        }
        
        $requestedData = (object) array_filter((array) $requestedData);

        return $requestedData;

    }
    else
    {

        return $requestedData = false;

    }
}