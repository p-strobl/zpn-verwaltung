'use strict';

function appendLfgbTextilContentMainRow(inputTextLeft, inputTextRight) {
    const $contentHeaderRow = $("#content-header-row");
    const $wrapContent$wrapFooter = $("#wrap-content").add($("#wrap-footer"));
    const $headerInput = $("#header-input-lfgbTextil");
    const contentAppend =
        " <section class='content-main-row lfgbTextil' id='content-main-row'> " +
        " <div class='content-main-cell' title='Eingetragene Probennummer.'> " +
        " <p class='content-main-text' id='text-prbNr'>" +
        inputTextLeft +
        "</p> " +
        "</div> " +
        " <div class='content-main-cell lfgbTextil' title='Solldatum zum Muster.'>" +
        " <p class='content-main-text' id='text-sollNr' contenteditable='false'>" +
        inputTextRight +
        "</p> " +
        "</div> " +
        " <div class='content-main-cell lfgbTextil'> " +
        " <div class='content-button-delete-wrap'> " +
        " <button type='button' class='content-button-delete lfgbTextil' id='content-main-row-delete-button' title='Bet&#228;tigen Sie diese Schaltfl&#228;che um den entfernen Dialog zu starten und zu beenden.'>Entfernen</button> " +
        " <div class='slideToggle-wrap-hidden-row' id='slideToggle-wrap-hidden-row'> " +
        " <div class='wrap-hidden-row' id='wrap-hidden-row'> " +
        " <button class='hidden-row confirm-button' id='hidden-row-confirm-button' title='Mit dieser Schaltfl&#228;che best&#228;tigen Sie das entfernen der ausgew&#228;hlten Zeile&#33;'>Ja</button> " +
        " <button class='hidden-row cancel-button' id='hidden-row-cancel-button' title='Mit dieser Schaltfl&#228;che beenden Sie den entfernen Dialog.'>Nein</button> " +
        " </div> " +
        " </div> " +
        " </div> " +
        " </div> " +
        " </section>";

    //Zeigt den Tabellen Header, die Tabelle und den sende Button wieder an.
    hasDisaplayNone($wrapContent$wrapFooter, $headerInput);
    ///Fügt dem HTML Element mit der ID "#wrap-content" eine Zeile mit dem Inhalt von "inputText" und dazugehörigen Checkboxen hinzu.
    $contentHeaderRow.after(contentAppend);

    //Ruft die Funktion "countRows" auf um die Anzahl der vorhandenen Datensätze zu zählen.
    countMainRows.addHighlight('highlight', '#FFB700', 100);

    footerGlobalCounter();
}

//
//Konstruktor für das Array "dataPack"
function ConstructDataPack(probenNummer, sollDatum) {
    this.probenNummer = probenNummer;
    this.sollDatum = sollDatum;
}

//
//Fügt alle Daten einer Zeile in ein Paket zusammen.
function wrapData() {
    const $contentMainRow = $(".content-main-row");
    //Leeres Array für den Datentransfer in die Datenbank.
    const dataPack = [];
    //Zeit Sting pattern
    const newDatePattern = /(\d{2})\.(\d{2})\.(\d{4})/;
    //Durchläuft jede erstellte Zeile der Tabelle.
    $.when($contentMainRow.each(function () {
        //Speichert den Inhalt der einzelnen Spalten der ausgewählten Zeile in einer Variable ab.
        //Überprüft die Checkboxen und übergibt 0 oder 1 als Wert.
        const probenNummer = $(this).find("#text-prbNr").text();
        const sollDatum = $(this).find("#text-sollNr").text().replace(newDatePattern, "$3-$2-$1");
        //Fügt mit hilfer eines Constructor's, den Inhalt der gegenwärtig selektierten Zeile, als Array in das "dataPack" hinzu.
        dataPack.push(new ConstructDataPack(probenNummer, sollDatum));
        //Übergibt das "dataPack" Array zum Ajax handler
    })
    ).done(sendDataPack(dataPack));
}

//
//Übersendet per Ajax und der POST Methode, dass Objekt "dataPack" an die PHP Datei "db-handling.php".
function sendDataPack(dataPack) {

    const ajaxInsertLfgbTextil = $.ajax({
        url: "../php/db-insert.php",
        method: "POST",
        data: {
            lfgbTextilEingangDataPack: dataPack
        },
        dataType: "json"
    });
    //Ajax Anfrage ist erfolgreich.
    ajaxInsertLfgbTextil.done(function (data) {
        const itemCount = data["itemCount"];
        const $stickyFooterMessageWrap = $("#sticky-footer-message-wrap");
        const $stickyFooterSuccessWrap = $("#transmission-successful-wrapper");
        const $stickyFooterFailWrap = $("#transmission-fail-wrap");

        //Funktion zum verstecken des ContentWrap und FooterWrap
        const hideContentFooter = function () {
            const $headerInputEingang = $("#header-input-lfgbTextil");
            const $wrapContent$wrapFooter = $("#wrap-content ").add($("#wrap-footer"));
            $wrapContent$wrapFooter
                .addClass("displayNoneImportant")
                .add($headerInputEingang)
                .addClass("border-edged");
        };

        //Funktion zum entfernen der FooterCounter Anzeige inhalte.
        const emptyMainRowsAndCounter = function () {
            const $contentMainRows = $(".content-main-row");
            const $contentFooterCounter = $(".content-footer-counter");
            $contentMainRows.remove();
            $contentFooterCounter.html("0");
        };

        //Funktion zum Hinzufügen und entfernen von Class des Sticky Footer Elements
        $.fn.animateStickyFooterWrapper = function (animationClass, heightClass, delay) {
            const $stickyFooterWrapper = $(this);
            const $animationClass = animationClass;
            const $heightClass = heightClass;
            const $wrapEingang = $("#wrap-eingang");
            $wrapEingang.css("visibility", "hidden");
            $stickyFooterWrapper
                .removeClass($heightClass)
                .addClass($animationClass);

            setTimeout(function () {
                $stickyFooterWrapper.removeClass($animationClass);
            }, delay);

            setTimeout(function () {
                $wrapEingang.css("visibility", "visible");
                $stickyFooterWrapper.addClass($heightClass);
                $stickyFooterSuccessWrap
                    .add($stickyFooterFailWrap)
                    .css("display", "");
                globalMainRowCounter.length = 0;
                backToInput();
            }, delay + 350);

        };

        if (itemCount >= 1) {
            hideContentFooter();
            emptyMainRowsAndCounter();
            $stickyFooterMessageWrap.animateStickyFooterWrapper(
                "sticky-footer-message-animation",
                "sticky-footer-height",
                1500
            );
        }
    });

    //Ajax Verbindung fehlgeschlagen.
    ajaxInsertLfgbTextil.fail(function (jqXHR, textStatus, errorThrown) {
        const $headerInput = $("#header-input-lfgbTextil");
        console.log(textStatus, errorThrown);
        //Blendet für 6 sek. eine "Verbindung Fehlgeschlagen" auskunft ein.
        showFailMessage.failMessage(
            "no-server header-fail-message-content-margin",
            8000,
            $headerInput.attr('id')
        );
        backToInput();
    });
}
