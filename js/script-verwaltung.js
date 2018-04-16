"use strict";

function getVerwaltungButtonStatus(probenNummer) {
    const ajaxRequestObject = $.ajax({
        url: "../php/db-requestObject.php",
        method: "POST",
        data: {
            requestDataSetDate: probenNummer
        },
        dataType: "json"
    });

    ajaxRequestObject.done(function (data) {

        const baseItems = {
            probenNummer: $("#text-prbNr"),
            sollDatum: $("#text-sollNr")
        };

        const rowItems = {
            einwaageBeginn: $("#content-btn-einwaageBeginn"),
            einwaageEnde: $("#content-btn-einwaageEnde"),
            klaerfallBeginnDateTime: $("#content-btn-klaerfallBeginn"),
            klaerfallEndeDateTime: $("#content-btn-klaerfallEnde"),
            manaEinwaageDateTime: $("#content-btn-manaEinwaage"),
            manaErhaltenDateTime: $("#content-btn-manaErhalten"),
            manaGestelltDateTime: $("#content-btn-manaBestellt"),
            manaZpnWagenDateTime: $("#content-btn-manaEingewogen"),
            zerlegungStart: $("#content-btn-zerlegungStart"),
            zerlegungEnde: $("#content-btn-zerlegungEnde"),
            zpnWagenDateTime: $("#content-btn-zpnWagen")
        };

        baseItems.probenNummer.html(data.base.probenNummer);
        baseItems.sollDatum.html(data.base.sollDatum);

        function setButtonStatus(rowItems, itemKey) {
            const setItem = rowItems[itemKey];
            setItem
                .prop("disabled", true)
                .addClass("setButtonStatus")
                .val("preSet");
            switch (itemKey) {
                case 'einwaageEnde':
                    rowItems.einwaageBeginn.disabled === true ? '' : rowItems.einwaageBeginn.prop('disabled', true).addClass('disableMainRowButton');
                    break;
                case 'klaerfallEndeDateTime':
                    rowItems.klaerfallBeginnDateTime.disabled === true ? '' : rowItems.klaerfallBeginnDateTime.prop('disabled', true).addClass('disableMainRowButton');
                    break;
                case 'manaErhaltenDateTime':
                    rowItems.manaEinwaageDateTime.disabled === true ? '' : rowItems.manaEinwaageDateTime.prop('disabled', true).addClass('disableMainRowButton');
                    break;
                case 'manaZpnWagenDateTime':
                    rowItems.manaEinwaageDateTime.disabled === true ? '' : rowItems.manaEinwaageDateTime.prop('disabled', true).addClass('disableMainRowButton');
                    rowItems.manaErhaltenDateTime.disabled === true ? '' : rowItems.manaErhaltenDateTime.prop('disabled', true).addClass('disableMainRowButton');
                    rowItems.manaErhaltenDateTime.disabled === true ? '' : rowItems.manaErhaltenDateTime.prop('disabled', true).addClass('disableMainRowButton');
                    rowItems.manaGestelltDateTime.disabled === true ? '' : rowItems.manaGestelltDateTime.prop('disabled', true).addClass('disableMainRowButton');
                    break;
                case 'zerlegungEnde':
                    rowItems.zerlegungStart.disabled === true ? '' : rowItems.zerlegungStart.prop('disabled', true).addClass('disableMainRowButton');
                    break;
                case 'zpnWagenDateTime':
                    rowItems.einwaageBeginn.disabled === true ? '' : rowItems.einwaageBeginn.prop('disabled', true).addClass('disableMainRowButton');
                    rowItems.einwaageEnde.disabled === true ? '' : rowItems.einwaageEnde.prop('disabled', true).addClass('disableMainRowButton');
                    rowItems.zerlegungStart.disabled === true ? '' : rowItems.zerlegungStart.prop('disabled', true).addClass('disableMainRowButton');
                    rowItems.zerlegungEnde.disabled === true ? '' : rowItems.zerlegungEnde.prop('disabled', true).addClass('disableMainRowButton');
                    break;
            }
        }

        $.each(data.date, function (dataKey) {
            $.each(rowItems, function (itemKey) {
                itemKey === dataKey ? setButtonStatus(rowItems, itemKey) : "";
            });
        });
    });

    ajaxRequestObject.fail(function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
        //Blendet für 6 sek. eine "Verbindung Fehlgeschlagen" auskunft ein.
        // showFailMessage.failMessage( 'no-server header-fail-message-content-margin', 8000 );
        backToInput();
    });
}
//
//Fügt einen Neuen Datensatz in das HTML ein.
function appendContentMainRow(inputTextLeft, inputTextRight) {
    const $contentHeaderRow = $("#content-header-row");
    const $wrapContent$wrapFooter = $("#wrap-content").add($("#wrap-footer"));
    const $headerInput = $("#header-input-verwaltung");
    const contentAppend =
        " <section class='content-main-row verwaltung' id='content-main-row'> " +
        " <div class='content-main-cell' title='Eingetragene Proben Nummer.'> " +
        " <p class='content-main-text' id='text-prbNr'>" +
        inputTextLeft +
        "</p> " +
        "</div> " +
        " <div class='content-main-cell verwaltung' title='Solldatum zum Muster.'>" +
        " <p class='content-main-text' id='text-sollNr' contenteditable='false'>" +
        inputTextRight +
        "</p> " +
        "</div> " +
        " <div class='content-main-cell verwaltung' title='Bet&#228;tigen Sie diese Schaltfl&#228;che bevor Sie mit der Zerlegung beginnen möchten.'> " +
        " <button type='button' class='content-button-check' id='content-btn-zerlegungStart' value='deactive'>Zerlegung<br />Start</button> " +
        " </div> " +
        " <div class='content-main-cell verwaltung' title='Bet&#228;tigen Sie diese Schaltfl&#228;che nach beendigung der Zerlegung.'> " +
        " <button type='button' class='content-button-check' id='content-btn-zerlegungEnde' value='deactive'>Zerlegung<br />Ende</button> " +
        " </div> " +
        " <div class='content-main-cell verwaltung' title='Bet&#228;tigen Sie diese Schaltfl&#228;che bevor Sie die Einwaage beginnen möchten.'> " +
        " <button type='button' class='content-button-check' id='content-btn-einwaageBeginn' value='deactive'>Einwaage<br />Start</button> " +
        " </div> " +
        " <div class='content-main-cell verwaltung' title='Bet&#228;tigen Sie diese Schaltfl&#228;che nach beendigung der Einwaage.'> " +
        " <button type='button' class='content-button-check' id='content-btn-einwaageEnde' value='deactive'>Einwaage<br />Ende</button> " +
        " </div> " +
        " <div class='content-main-cell verwaltung' title='Bet&#228;tigen Sie diese Schaltfl&#228;che wenn Sie die Einwaage&#47;n&#10;auf dem ZPN Wagen bereit gestellt habe&#47;n.'> " +
        " <button type='button' class='content-button-check' id='content-btn-zpnWagen' value='deactive'>ZPN<br />Wagen</button>" +
        " </div> " +
        " <div class='content-main-cell verwaltung' title='Bet&#228;tigen Sie diese Schaltfl&#228;che wenn Sie einen Kl&#228;rfall beginnen möchten.'> " +
        " <button type='button' class='content-button-check' id='content-btn-klaerfallBeginn' value='deactive'>Kl&#228;rfall<br />Beginn</button> " +
        " </div> " +
        " <div class='content-main-cell verwaltung' title='Bet&#228;tigen Sie diese Schaltfl&#228;che wenn eine Kl&#228;rfall beendet wurde.'> " +
        " <button type='button' class='content-button-check' id='content-btn-klaerfallEnde' value='deactive'>Kl&#228;rfall<br />Ende</button> " +
        " </div> " +
        " <div class='content-main-cell verwaltung' title='Bet&#228;tigen Sie diese Schaltfl&#228;che wenn Sie eine MaNa bestellt haben.'> " +
        " <button type='button' class='content-button-check' id='content-btn-manaBestellt' value='deactive'>MaNa<br />Bestellt</button> " +
        " </div> " +
        " <div class='content-main-cell verwaltung' title='Bet&#228;tigen Sie diese Schaltfl&#228;che wenn Sie das MaNa Material erhalten haben.'> " +
        " <button type='button' class='content-button-check' id='content-btn-manaErhalten' value='deactive'>MaNa<br />Erhalten</button>" +
        " </div> " +
        " <div class='content-main-cell verwaltung' title='Bet&#228;tigen Sie diese Schaltfl&#228;che wenn Sie die MaNa Einwaage beginnen möchten.'> " +
        " <button type='button' class='content-button-check' id='content-btn-manaEinwaage' value='deactive'>MaNa<br />Einwaage</button>" +
        " </div> " +
        " <div class='content-main-cell verwaltung' title='Bet&#228;tigen Sie diese Schaltfl&#228;che nach beendigung der MaNa Einwaage.'> " +
        " <button type='button' class='content-button-check' id='content-btn-manaEingewogen' value='deactive'>MaNa<br />Eingewogen</button>" +
        " </div> " +
        " <div class='content-main-cell verwaltung'> " +
        " <div class='content-button-delete-wrap'> " +
        " <button type='button' class='content-button-delete' id='content-main-row-delete-button' title='Bet&#228;tigen Sie diese Schaltfl&#228;che um den entfernen Dialog zu starten und zu beenden.'>Entfernen</button> " +
        " <div class='slideToggle-wrap-hidden-row' id='slideToggle-wrap-hidden-row'> " +
        " <div class='wrap-hidden-row' id='wrap-hidden-row'> " +
        " <button class='hidden-row confirm-button' id='hidden-row-confirm-button' title='Mit dieser Schaltfl&#228;che best&#228;tigen Sie das entfernen der ausgew&#228;hlten Zeile&#33;'>Ja</button> " +
        " <button class='hidden-row cancel-button' id='hidden-row-cancel-button' title='Mit dieser Schaltfl&#228;che beenden Sie den entfernen Dialog.'>Nein</button> " +
        " </div> " +
        " </div> " +
        " </div> " +
        " </div> " +
        " </section>";

    getVerwaltungButtonStatus(inputTextLeft);

    //Zeigt den Tabellen Header, die Tabelle und den sende Button wieder an.
    hasDisaplayNone($wrapContent$wrapFooter, $headerInput);
    ///Fügt dem HTML Element mit der ID "#wrap-content" eine Zeile mit dem Inhalt von "inputText" und dazugehörigen Checkboxen hinzu.
    $contentHeaderRow.after(contentAppend);
    //Ruft die Funktion "countRows" auf um die Anzahl der vorhandenen Datensätze zu zählen.
    countMainRows.addHighlight('highlight', '#FFB700', 100);
}

//
//Konstruktor für das Array "dataPack"
function ConstructDataPack(probenNummer, sollDatum, zerlegungStart, zerlegungEnde, einwaageBeginn, einwaageEnde, klaerfallBeginn, klaerfallEnde, manaBestellt, manaErhalten, manaEinwaage, manaEingewogen, zpnWagen) {
    this.probenNummer = probenNummer;
    this.sollDatum = sollDatum;
    this.zerlegungStart = zerlegungStart;
    this.zerlegungEnde = zerlegungEnde;
    this.einwaageBeginn = einwaageBeginn;
    this.einwaageEnde = einwaageEnde;
    this.klaerfallBeginn = klaerfallBeginn;
    this.klaerfallEnde = klaerfallEnde;
    this.manaBestellt = manaBestellt;
    this.manaErhalten = manaErhalten;
    this.manaEinwaage = manaEinwaage;
    this.manaEingewogen = manaEingewogen;
    this.zpnWagen = zpnWagen;
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
        const zerlegungStart = $(this).find("#content-btn-zerlegungStart").attr("value");
        const zerlegungEnde = $(this).find("#content-btn-zerlegungEnde").attr("value");
        const einwaageBeginn = $(this).find("#content-btn-einwaageBeginn").attr("value");
        const einwaageEnde = $(this).find("#content-btn-einwaageEnde").attr("value");
        const klaerfallBeginn = $(this).find("#content-btn-klaerfallBeginn").attr("value");
        const klaerfallEnde = $(this).find("#content-btn-klaerfallEnde").attr("value");
        const manaBestellt = $(this).find("#content-btn-manaBestellt").attr("value");
        const manaErhalten = $(this).find("#content-btn-manaErhalten").attr("value");
        const manaEinwaage = $(this).find("#content-btn-manaEinwaage").attr("value");
        const manaEingewogen = $(this).find("#content-btn-manaEingewogen").attr("value");
        const zpnWagen = $(this).find("#content-btn-zpnWagen").attr("value");

        //Fügt mit hilfer eines Constructor's, den Inhalt der gegenwärtig selektierten Zeile, als Array in das "dataPack" hinzu.
        dataPack.push(new ConstructDataPack(probenNummer, sollDatum, zerlegungStart, zerlegungEnde, einwaageBeginn, einwaageEnde, klaerfallBeginn, klaerfallEnde, manaBestellt, manaErhalten, manaEinwaage, manaEingewogen, zpnWagen));
        //Übergibt das "dataPack" Array zum Ajax handler
    })
    ).done(checkForUnchecked(dataPack, 'header-input-verwaltung', 'verwaltung'));
}

//
//Übersendet per Ajax und der POST Methode, dass Objekt "dataPack" an die PHP Datei "db-handling.php".
function sendUpdateData(dataPack) {

    stripDataPack(dataPack);

    const ajaxRequestUpdate = $.ajax({
        url: "../php/db-update.php",
        method: "POST",
        data: {
            updateDataSet: dataPack
        },
        dataType: "json"
    });
    //Ajax Anfrage ist erfolgreich.
    ajaxRequestUpdate.done(function (data) {
        // console.log(data);
        const itemCount = data["itemCount"];
        const $stickyFooterMessageWrap = $("#sticky-footer-message-wrap");
        const $stickyFooterSuccessWrap = $("#transmission-successful-wrapper");
        const $stickyFooterFailWrap = $("#transmission-fail-wrap");

        //Funktion zum verstecken des ContentWrap und FooterWrap
        const hideContentFooter = function () {
            const $headerInputEingang = $("#header-input-eingang");
            const $wrapContent$wrapFooter = $("#wrap-content ").add(
                $("#wrap-footer")
            );
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
                2000
            );
        }
    });

    //Ajax Verbindung fehlgeschlagen.
    ajaxRequestUpdate.fail(function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
        //Blendet für 6 sek. eine "Verbindung Fehlgeschlagen" auskunft ein.
        showFailMessage.failMessage("no-server header-fail-message-content-margin", 8000, headerInput);

        backToInput();
    });
}

