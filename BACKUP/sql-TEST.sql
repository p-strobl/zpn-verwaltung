-- SELECT 
--         tbl_mustereingang.probenNummer, DATE_Format(tbl_mustereingang.sollDatum, '%d.%m.%Y') AS sollDatum, DATE_Format(tbl_mustereingang.eingangDateTime, '%d.%m.%Y') AS eingangDate, TIME(tbl_mustereingang.eingangDateTime) AS eingangTime, tbl_mustereingang.beurteilungZpnBerechnung,
--         DATE_FORMAT(tbl_zerlegung.zerlegungStart, '%d.%m.%Y' ) AS zerlegungStartDate, TIME(tbl_zerlegung.zerlegungStart) AS zerlegungStartTime, DATE_FORMAT(tbl_zerlegung.zerlegungEnde, '%d.%m.%Y') AS zerlegungEndeDate, TIME(tbl_zerlegung.zerlegungEnde) AS zerlegungEndeTime, tbl_zerlegung.zerlegungBerechnung,
--         DATE_FORMAT(tbl_probennahme.einwaageBeginn, '%d.%m.%Y') AS einwaageBeginnDate, TIME(tbl_probennahme.einwaageBeginn) AS einwaageBeginnTime, DATE_FORMAT(tbl_probennahme.einwaageEnde, '%d.%m.%Y') AS einwaageEndeDate, TIME(tbl_probennahme.einwaageEnde) AS einwaageEndeTime, tbl_probennahme.einwaageBerechnung,
--         DATE_FORMAT(tbl_zpnwagen.zpnWagenDateTime, '%d.%m.%Y') AS zpnWagenDate, TIME(tbl_zpnwagen.zpnWagenDateTime) AS zpnWagenTime, tbl_zpnwagen.berechnungDateTimeZpnwagen,
--         DATE_FORMAT(tbl_mana.manaGestelltDateTime, '%d.%m.%Y') AS manaGestelltDate, TIME(tbl_mana.manaGestelltDateTime) AS manaGestelltTime, DATE_FORMAT(tbl_mana.manaErhaltenDateTime, '%d.%m.%Y') AS manaErhaltenDate, TIME(tbl_mana.manaErhaltenDateTime) AS manaErhaltenTime, DATE_Format(tbl_mana.manaEinwaageDateTime, '%d.%m.%Y') AS manaEinwaageDate, TIME(tbl_mana.manaEinwaageDateTime) AS manaEinwaageTime, DATE_Format(tbl_mana.manaZpnWagenDateTime, '%d.%m.%Y') AS manaZpnWagenDate, TIME(tbl_mana.manaZpnWagenDateTime) AS manaZpnWagenTime, tbl_mana.manaBerechnungDateTimeAnfrage, tbl_mana.manaBerechnungDateTimeEinwaage, tbl_mana.manaBerechnungDateTimeGesamt,
--         DATE_Format(tbl_klaerfall.klaerfallBeginnDateTime, '%d.%m.%Y') AS klaerfallBeginnDate, TIME(tbl_klaerfall.klaerfallBeginnDateTime) AS klaerfallBeginnTime, DATE_Format(tbl_klaerfall.klaerfallEndeDateTime, '%d.%m.%Y') AS klaerfallEndeDate, TIME(tbl_klaerfall.klaerfallEndeDateTime) AS klaerfallEndeTime, tbl_klaerfall.klaerfallBerechnung, tbl_klaerfall.klaerfallAnzahl,
--         tbl_status.mitExpress, tbl_status.mitIntern, tbl_status.mitNickel, tbl_status.mitLfgb, tbl_status.mitToys, tbl_status.mit60g, tbl_status.mitKlaerfallBack,
--         DATE_Format(tbl_storno.stornoDateTime, '%d.%m.%Y') AS stornoDate, TIME(tbl_storno.stornoDateTime) AS stornoTime,
--         tbl_kommentar.kommentarText, DATE_Format(tbl_kommentar.kommentarDateTime, '%d.%m.%Y') AS kommentarDate, TIME(tbl_kommentar.kommentarDateTime) AS kommentarTime,
--         DATE_Format(tbl_nickel.nickelRueckgabeDateTime, '%d.%m.%Y') AS nickelRueckgabeDate, TIME(tbl_nickel.nickelRueckgabeDateTime) AS nickelRueckgabeTime, tbl_nickel.nickelBerechnung,
--         DATE_Format(tbl_beurteilung.beurteilungBereitgestelltDateTime, '%d.%m.%Y') AS beurteilungBereitDate, TIME(tbl_beurteilung.beurteilungBereitgestelltDateTime) AS beurteilungBereitTime, tbl_beurteilung.anAbteilung
        
--         FROM
--             tbl_mustereingang

--         LEFT OUTER JOIN tbl_probennahme
--         ON tbl_mustereingang.probenNummer = tbl_probennahme.probenNummer

--         LEFT OUTER JOIN tbl_zerlegung
--         ON tbl_mustereingang.probenNummer = tbl_zerlegung.probenNummer

--         LEFT OUTER JOIN tbl_zpnwagen
--         ON tbl_mustereingang.probenNummer = tbl_zpnwagen.probenNummer

--         LEFT OUTER JOIN tbl_mana
--         ON tbl_mustereingang.probenNummer = tbl_mana.probenNummer

--         LEFT OUTER JOIN tbl_klaerfall
--         ON tbl_mustereingang.probenNummer = tbl_klaerfall.probenNummer

--         LEFT OUTER JOIN tbl_status
--         ON tbl_mustereingang.probenNummer = tbl_status.probenNummer

--         LEFT OUTER JOIN tbl_storno
--         ON tbl_mustereingang.probenNummer = tbl_storno.probenNummer

--         LEFT OUTER JOIN tbl_kommentar
--         ON tbl_mustereingang.probenNummer = tbl_kommentar.probenNummer

--         LEFT OUTER JOIN tbl_nickel
--         ON tbl_mustereingang.probenNummer = tbl_nickel.probenNummer

--         LEFT OUTER JOIN tbl_beurteilung
--         ON tbl_mustereingang.probenNummer = tbl_beurteilung.probenNummer

--         WHERE tbl_mustereingang.probenNummer = :probenNummer

UPDATE
	tbl_probennahme
SET
	tbl_probennahme.einwaageBerechnung = 
	IF ( tbl_probennahme.einwaageEnde IS NOT NULL && tbl_probennahme.einwaageBeginn IS NOT NULL,
		IF ( DATEDIFF( tbl_probennahme.einwaageEnde, tbl_probennahme.einwaageBeginn) >= 1,
            TIMEDIFF( tbl_probennahme.einwaageEnde, tbl_probennahme.einwaageBeginn - SUBDATE(tbl_probennahme.einwaageBeginn, tbl_probennahme.einwaageEnde) ),
		    -- SUBDATE( DATEDIFF( tbl_probennahme.einwaageEnde, tbl_probennahme.einwaageBeginn), tbl_probennahme.einwaageBeginn),
		    TIMEDIFF( tbl_probennahme.einwaageEnde, tbl_probennahme.einwaageBeginn) ), Null ) 
WHERE
	tbl_probennahme.probenNummer = "16-011111-01"



    -- UPDATE
-- 	tbl_probennahme
-- SET
-- 	tbl_probennahme.einwaageBerechnung = 
-- 	IF ( tbl_probennahme.einwaageEnde IS NOT NULL && tbl_probennahme.einwaageBeginn IS NOT NULL,
-- 		IF ( 	DATEDIFF( tbl_probennahme.einwaageEnde, tbl_probennahme.einwaageBeginn) >= 1,
--        	TIMEDIFF( tbl_probennahme.einwaageEnde, tbl_probennahme.einwaageBeginn - DATE_SUB(tbl_probennahme.einwaageEnde, INTERVAL tbl_probennahme.einwaageBeginn DAY) ),
-- 		    	TIMEDIFF( tbl_probennahme.einwaageEnde, tbl_probennahme.einwaageBeginn)
-- 			)
-- 		,Null 
-- 		) 
		
SELECT tbl_probennahme.einwaageBeginn, tbl_probennahme.einwaageEnde, TIMEDIFF( tbl_probennahme.einwaageEnde - DATEDIFF(tbl_probennahme.einwaageEnde, tbl_probennahme.einwaageBeginn), tbl_probennahme.einwaageBeginn) AS Diff

FROM
	tbl_probennahme		
		
WHERE
	tbl_probennahme.probenNummer = "16-011111-01"