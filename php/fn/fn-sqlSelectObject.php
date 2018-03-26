<?php

function sqlSelectObject( $pdoConnect, $probenNummer )
{
    try{
        $pdoConnect->beginTransaction();

        $sql =
        "
            SELECT 
                tbl_mustereingang.probenNummer, tbl_mustereingang.sollDatum, tbl_mustereingang.eingangDateTime,
                tbl_zerlegung.zerlegungStart, tbl_zerlegung.zerlegungEnde, tbl_zerlegung.zerlegungBerechnung,
                tbl_probennahme.einwaageBeginn, tbl_probennahme.einwaageEnde, tbl_probennahme.einwaageBerechnung,
                tbl_zpnwagen.zpnWagenDateTime, tbl_zpnwagen.berechnungDateTimeZpnwagen,
                tbl_mana.manaGestelltDateTime, tbl_mana.manaErhaltenDateTime, tbl_mana.manaEinwaageDateTime, tbl_mana.manaZpnWagenDateTime, tbl_mana.manaBerechnungDateTimeAnfrage, tbl_mana.manaBerechnungDateTimeEinwaage, tbl_mana.manaBerechnungDateTimeGesamt,
                tbl_klaerfall.klaerfallBeginnDateTime, tbl_klaerfall.klaerfallEndeDateTime, tbl_klaerfall.klaerfallBerechnung,
                tbl_status.mitExpress, tbl_status.mitIntern, tbl_status.mitNickel, tbl_status.mitLfgb, tbl_status.mitToys, tbl_status.mit60g, tbl_status.mitKlaerfallBack,
                tbl_storno.stornoDateTime,
                tbl_kommentar.kommentarText, tbl_kommentar.kommentarDateTime,
                tbl_nickel.nickelRueckgabeDateTime, tbl_nickel.nickelBerechnung
            
            FROM
                tbl_mustereingang
    
            LEFT OUTER JOIN tbl_probennahme
            ON tbl_mustereingang.probenNummer = tbl_probennahme.probenNummer
    
            LEFT OUTER JOIN tbl_zerlegung
            ON tbl_mustereingang.probenNummer = tbl_zerlegung.probenNummer
    
            LEFT OUTER JOIN tbl_zpnwagen
            ON tbl_mustereingang.probenNummer = tbl_zpnwagen.probenNummer
    
            LEFT OUTER JOIN tbl_mana
            ON tbl_mustereingang.probenNummer = tbl_mana.probenNummer
    
            LEFT OUTER JOIN tbl_klaerfall
            ON tbl_mustereingang.probenNummer = tbl_klaerfall.probenNummer
    
            LEFT OUTER JOIN tbl_status
            ON tbl_mustereingang.probenNummer = tbl_status.probenNummer
    
            LEFT OUTER JOIN tbl_storno
            ON tbl_mustereingang.probenNummer = tbl_storno.probenNummer
    
            LEFT OUTER JOIN tbl_kommentar
            ON tbl_mustereingang.probenNummer = tbl_kommentar.probenNummer
    
            LEFT OUTER JOIN tbl_nickel
            ON tbl_mustereingang.probenNummer = tbl_nickel.probenNummer
    
            WHERE tbl_mustereingang.probenNummer = :probenNummer
        ";
        $pdoStatement = $pdoConnect->prepare( $sql );
        $pdoStatement->bindParam( ':probenNummer', $probenNummer, PDO::PARAM_STR );
        $pdoStatement->execute();
        $pdoObject = $pdoStatement->fetch( PDO::FETCH_OBJ );
    
        if( $pdoObject != false )
        {
            foreach( $pdoObject as $key => $value )
            {
                if( $value === null )
                {
                    unset( $pdoObject->{$key} );
                }
            }
        }

        $pdoConnect->commit();

        return $pdoObject;
    }
    catch( PDOException $pdoException ){
        $pdoConnect->rollBack();
    }
}