-- --------------------------------------------------------
-- Host:                         localhost
-- Server Version:               10.1.31-MariaDB - mariadb.org binary distribution
-- Server Betriebssystem:        Win32
-- HeidiSQL Version:             9.4.0.5125
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Exportiere Datenbank Struktur für zpn-verwaltung
CREATE DATABASE IF NOT EXISTS `zpn-verwaltung` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci */;
USE `zpn-verwaltung`;

-- Exportiere Struktur von Tabelle zpn-verwaltung.tbl_beurteilung
CREATE TABLE IF NOT EXISTS `tbl_beurteilung` (
  `probenNummer` char(12) COLLATE utf8_unicode_ci NOT NULL,
  `bereitgestelltDateTime` datetime DEFAULT NULL,
  `anAbteilung` tinytext COLLATE utf8_unicode_ci,
  PRIMARY KEY (`probenNummer`),
  UNIQUE KEY `probenNummer` (`probenNummer`),
  CONSTRAINT `FK_beurteilung` FOREIGN KEY (`probenNummer`) REFERENCES `tbl_mustereingang` (`probenNummer`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=COMPACT;

-- Daten Export vom Benutzer nicht ausgewählt
-- Exportiere Struktur von Tabelle zpn-verwaltung.tbl_klaerfall
CREATE TABLE IF NOT EXISTS `tbl_klaerfall` (
  `autoID` int(11) NOT NULL AUTO_INCREMENT,
  `klaerfallBeginnDateTime` datetime DEFAULT NULL,
  `klaerfallEndeDateTime` datetime DEFAULT NULL,
  `klaerfallBerechnung` time DEFAULT NULL,
  `probenNummer` char(12) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`autoID`),
  UNIQUE KEY `probenNummer` (`probenNummer`),
  CONSTRAINT `FK_klaerfall-probenNummer` FOREIGN KEY (`probenNummer`) REFERENCES `tbl_mustereingang` (`probenNummer`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Daten Export vom Benutzer nicht ausgewählt
-- Exportiere Struktur von Tabelle zpn-verwaltung.tbl_kommentar
CREATE TABLE IF NOT EXISTS `tbl_kommentar` (
  `probenNummer` char(12) COLLATE utf8_unicode_ci NOT NULL,
  `kommentarText` text COLLATE utf8_unicode_ci NOT NULL,
  `kommentarDateTime` datetime NOT NULL,
  PRIMARY KEY (`probenNummer`),
  UNIQUE KEY `probenNummer` (`probenNummer`),
  CONSTRAINT `FK_kommentar-probenNummer` FOREIGN KEY (`probenNummer`) REFERENCES `tbl_mustereingang` (`probenNummer`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Daten Export vom Benutzer nicht ausgewählt
-- Exportiere Struktur von Tabelle zpn-verwaltung.tbl_mana
CREATE TABLE IF NOT EXISTS `tbl_mana` (
  `autoID` int(11) NOT NULL AUTO_INCREMENT,
  `manaGestelltDateTime` datetime DEFAULT NULL,
  `manaErhaltenDateTime` datetime DEFAULT NULL,
  `manaEinwaageDateTime` datetime DEFAULT NULL,
  `manaZpnWagenDateTime` datetime DEFAULT NULL,
  `manaBerechnungDateTimeAnfrage` time DEFAULT NULL,
  `manaBerechnungDateTimeEinwaage` time DEFAULT NULL,
  `manaBerechnungDateTimeGesamt` time DEFAULT NULL,
  `probenNummer` char(12) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`autoID`),
  UNIQUE KEY `probenNummer` (`probenNummer`),
  CONSTRAINT `FK_maNa-probenNummer` FOREIGN KEY (`probenNummer`) REFERENCES `tbl_mustereingang` (`probenNummer`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Daten Export vom Benutzer nicht ausgewählt
-- Exportiere Struktur von Tabelle zpn-verwaltung.tbl_mustereingang
CREATE TABLE IF NOT EXISTS `tbl_mustereingang` (
  `probenNummer` char(12) COLLATE utf8_unicode_ci NOT NULL,
  `sollDatum` date DEFAULT NULL,
  `eingangDateTime` datetime DEFAULT NULL,
  PRIMARY KEY (`probenNummer`),
  UNIQUE KEY `probenNummer` (`probenNummer`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Daten Export vom Benutzer nicht ausgewählt
-- Exportiere Struktur von Tabelle zpn-verwaltung.tbl_nickel
CREATE TABLE IF NOT EXISTS `tbl_nickel` (
  `probenNummer` char(12) COLLATE utf8_unicode_ci NOT NULL,
  `nickelRueckgabeDateTime` datetime DEFAULT NULL,
  `nickelBerechnung` time DEFAULT NULL,
  PRIMARY KEY (`probenNummer`),
  UNIQUE KEY `probenNummer` (`probenNummer`),
  CONSTRAINT `FK_nickel-probenNummer` FOREIGN KEY (`probenNummer`) REFERENCES `tbl_mustereingang` (`probenNummer`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Daten Export vom Benutzer nicht ausgewählt
-- Exportiere Struktur von Tabelle zpn-verwaltung.tbl_probennahme
CREATE TABLE IF NOT EXISTS `tbl_probennahme` (
  `autoID` int(11) NOT NULL AUTO_INCREMENT,
  `einwaageBeginn` datetime DEFAULT NULL,
  `einwaageEnde` datetime DEFAULT NULL,
  `einwaageBerechnung` time DEFAULT NULL,
  `probenNummer` char(12) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`autoID`),
  UNIQUE KEY `probenNummer` (`probenNummer`),
  CONSTRAINT `FK_probenNahme-probenNummer` FOREIGN KEY (`probenNummer`) REFERENCES `tbl_mustereingang` (`probenNummer`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Daten Export vom Benutzer nicht ausgewählt
-- Exportiere Struktur von Tabelle zpn-verwaltung.tbl_status
CREATE TABLE IF NOT EXISTS `tbl_status` (
  `probenNummer` char(12) COLLATE utf8_unicode_ci NOT NULL,
  `mitExpress` tinytext COLLATE utf8_unicode_ci,
  `mitIntern` tinytext COLLATE utf8_unicode_ci,
  `mitNickel` tinytext COLLATE utf8_unicode_ci,
  `mitLfgb` tinytext COLLATE utf8_unicode_ci,
  `mitToys` tinytext COLLATE utf8_unicode_ci,
  `mit60g` tinytext COLLATE utf8_unicode_ci,
  `mitKlaerfallBack` tinytext COLLATE utf8_unicode_ci,
  PRIMARY KEY (`probenNummer`),
  UNIQUE KEY `probenNummer` (`probenNummer`),
  CONSTRAINT `FK_status-probenNummer` FOREIGN KEY (`probenNummer`) REFERENCES `tbl_mustereingang` (`probenNummer`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Daten Export vom Benutzer nicht ausgewählt
-- Exportiere Struktur von Tabelle zpn-verwaltung.tbl_storno
CREATE TABLE IF NOT EXISTS `tbl_storno` (
  `probenNummer` char(12) COLLATE utf8_unicode_ci NOT NULL,
  `stornoDateTime` datetime DEFAULT NULL,
  PRIMARY KEY (`probenNummer`),
  UNIQUE KEY `probenNummer` (`probenNummer`),
  CONSTRAINT `FK_storno-probenNummer` FOREIGN KEY (`probenNummer`) REFERENCES `tbl_mustereingang` (`probenNummer`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Daten Export vom Benutzer nicht ausgewählt
-- Exportiere Struktur von Tabelle zpn-verwaltung.tbl_zerlegung
CREATE TABLE IF NOT EXISTS `tbl_zerlegung` (
  `autoID` int(11) NOT NULL AUTO_INCREMENT,
  `zerlegungStart` datetime DEFAULT NULL,
  `zerlegungEnde` datetime DEFAULT NULL,
  `zerlegungBerechnung` time DEFAULT NULL,
  `probenNummer` char(12) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`autoID`),
  UNIQUE KEY `probenNummer` (`probenNummer`),
  CONSTRAINT `tbl_zerlegung_ibfk_1` FOREIGN KEY (`probenNummer`) REFERENCES `tbl_mustereingang` (`probenNummer`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=207 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=COMPACT;

-- Daten Export vom Benutzer nicht ausgewählt
-- Exportiere Struktur von Tabelle zpn-verwaltung.tbl_zpnwagen
CREATE TABLE IF NOT EXISTS `tbl_zpnwagen` (
  `probenNummer` char(12) COLLATE utf8_unicode_ci NOT NULL,
  `zpnWagenDateTime` datetime DEFAULT NULL,
  `berechnungDateTimeZpnwagen` time DEFAULT NULL,
  PRIMARY KEY (`probenNummer`),
  UNIQUE KEY `probenNummer` (`probenNummer`),
  CONSTRAINT `FK_zpnWagen-probenNummer` FOREIGN KEY (`probenNummer`) REFERENCES `tbl_mustereingang` (`probenNummer`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Daten Export vom Benutzer nicht ausgewählt
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
