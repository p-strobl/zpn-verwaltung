"use strict";

function appendContentMainRow(probenNummer, abteilung) {

    //Setzt den entsprechenden status auf den Button um
    function setBeurteilungStatusButton(abteilung) {

        const contentBtnItems = {
            ZPN: $('#anZPN'),
            LFGB: $('#anLFGB'),
            Textilphysik: $('#anTextilphysik')
        };

        function activeButtonStatus(contentBtnID) {
            contentBtnID
                .prop('disabled', false)
                .addClass('preSet')
                .removeClass('disableMainRowButton')
                .val('active');
        }

        function deactiveButtonStatus(contentBtnID) {
            contentBtnID
                .prop('disabled', true)
                .addClass('disableMainRowButton')
                .val('deactive');
        }

        Object.entries(contentBtnItems).forEach(([contentBtnKey, contentBtnValue]) => {
            contentBtnKey === abteilung ? activeButtonStatus(contentBtnValue) : deactiveButtonStatus(contentBtnValue);
        });
    }

    function addFooterCounter(abteilung) {

        const footerCounter = {
            ZPN: $('#content-footer-counter-anZPN'),
            LFGB: $('#content-footer-counter-anLFGB'),
            Textilphysik: $('#content-footer-counter-anTextilphysik')
        };

        function addCounter(footerCounterID) {
            footerCounterID.text(Number(footerCounterID.text()) + 1);
        }

        Object.entries(footerCounter).forEach(([fcKey, fcValue]) => {
            fcKey === abteilung ? addCounter(fcValue) : '';
        });
    }

    const inputTextLeft = leftSplit(probenNummer, 12);
    const inputTextRight = rightSplit(probenNummer, 10);
    const $contentHeaderRow = $("#content-header-row");
    const $wrapContent$wrapFooter = $("#wrap-content").add($("#wrap-footer"));
    const $headerInput = $("#header-input-beurteilung-abteilung");
    const contentAppend =
        "<section class='content-main-row beurteilung' id='content-main-row'>" +
        "<div class='content-main-cell' title='Eingetragene Proben Nummer.'>" +
        "<p class='content-main-text' id='text-prbNr'>" + inputTextLeft + "</p>" +
        "</div>" +
        "<div class='content-main-cell beurteilung' title='Solldatum zum Muster.'>" +
        "<p class='content-main-text' id='text-sollNr' contenteditable='true'>" + inputTextRight + "</p>" +
        "</div>" +
        "<div class='content-main-cell beurteilung'  title='Bet&#228;tigen Sie diese Schaltfl&#228;che bevor Sie mit der Zerlegung beginnen möchten.'>" +
        "<button type='button' class='content-button-check' id='anZPN' value=''>An die ZPN</button>" +
        "</div>" +
        "<div class='content-main-cell beurteilung '  title='Bet&#228;tigen Sie diese Schaltfl&#228;che nach beendigung der Zerlegung.'>" +
        "<button type='button' class='content-button-check' id='anLFGB' value=''>An die LFGB</button>" +
        "</div>" +
        "<div class='content-main-cell beurteilung'  title='Bet&#228;tigen Sie diese Schaltfl&#228;che bevor Sie die Einwaage beginnen möchten.'>" +
        "<button type='button' class='content-button-check' id='anTextilphysik' value=''>An die Textilphysik</button>" +
        "</div>" +
        "<div class='content-main-cell beurteilung'>" +
        "<div class='content-button-delete-wrap'>" +
        "<button type='button' class='content-button-delete' id='content-main-row-delete-button' title='Bet&#228;tigen Sie diese Schaltfl&#228;che um den entfernen Dialog zu starten und zu beenden.'>Entfernen</button>" +
        "<div class='slideToggle-wrap-hidden-row' id='slideToggle-wrap-hidden-row'>" +
        "<div class='wrap-hidden-row' id='wrap-hidden-row'>" +
        "<button class='hidden-row confirm-button' id='hidden-row-confirm-button' title='Mit dieser Schaltfl&#228;che best&#228;tigen Sie das entfernen der ausgew&#228;hlten Zeile&#33;'>Ja</button>" +
        "<button class='hidden-row cancel-button' id='hidden-row-cancel-button' title='Mit dieser Schaltfl&#228;che beenden Sie den entfernen Dialog.'>Nein</button>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "</section>";



    //Zeigt den Tabellen Header, die Tabelle und den sende Button wieder an.
    $wrapContent$wrapFooter.hasClass('displayNoneImportant') === true ? $wrapContent$wrapFooter.removeClass('displayNoneImportant').add($headerInput).removeClass('border-edged') : '';
    //Fügt dem HTML Element mit der ID "#wrap-content" eine Zeile mit dem Inhalt von "inputText" und dazugehörigen Checkboxen hinzu.
    $contentHeaderRow.after(contentAppend);
    //Setzt den entsprechenden Button im HTML auf aktiv
    setBeurteilungStatusButton(abteilung);
    //Addiert dem Footer Counter an entsprechender Stellt hoch
    addFooterCounter(abteilung);
    //Ruft die Funktion "countRows" auf um die Anzahl der vorhandenen Datensätze zu zählen.
    countMainRows.addHighlight('highlight', '#FFB700', 100);
}


//
//Entfernt in der aus wrapData übertragenes Object die values mit einem "deactive" key
function checkForUnchecked(dataPackUpdate) {
    let countActive = 0;
    const dataPackLength = dataPackUpdate.length;

    console.log(dataPackUpdate);

    $.each(dataPackUpdate, function (packKey, packValue) {
        $.each(packValue, function (objectKey, objectValue) {
            if (objectValue.match(/^(active)/)) {
                packValue.anAbteilung = objectKey.substring(2);
                countActive++;
                return false;
            }
        });
    });

    if (countActive === dataPackLength) {
        sendData(dataPackUpdate);
        return false;
    } else if (countActive !== dataPackLength) {
        showFailMessage.failMessage("fail-input-verwaltung header-fail-message-content-margin", 5000);
        return false;
    }
}

//
//Konstruktor für das Array "dataPack"
function ConstructDataPack(
    probenNummer,
    sollDatum,
    anZPN,
    anLFGB,
    anTextilphysik
) {
    this.probenNummer = probenNummer;
    this.sollDatum = sollDatum;
    this.anZPN = anZPN;
    this.anLFGB = anLFGB;
    this.anTextilphysik = anTextilphysik;
}

//
//Fügt alle Daten einer Zeile in ein Paket zusammen.
function wrapData() {
    const $contentMainRow = $(".content-main-row");
    //Leeres Array für den Datentransfer in die Datenbank.
    const dataPackUpdate = [];
    //Zeit Sting pattern
    const newDatePattern = /(\d{2})\.(\d{2})\.(\d{4})/;
    //Durchläuft jede erstellte Zeile der Tabelle.
    $.when($contentMainRow.each(function () {
        //Speichert den Inhalt der einzelnen Spalten der ausgewählten Zeile in einer Variable ab.
        //Überprüft die Checkboxen und übergibt 0 oder 1 als Wert.
        const probenNummer = $(this).find("#text-prbNr").text();
        let sollDatum = $(this).find("#text-sollNr").text();
        const anZPN = $(this).find("#anZPN").attr("value");
        const anLFGB = $(this).find("#anLFGB").attr("value");
        const anTextilphysik = $(this).find("#anTextilphysik").attr("value");

        //Umbau des sollDatum Sting
        sollDatum = sollDatum.replace(newDatePattern, "$3-$2-$1");
        //Fügt mit hilfer eines Constructor's, den Inhalt der gegenwärtig selektierten Zeile, als Array in das "dataPack" hinzu.
        dataPackUpdate.push(new ConstructDataPack(probenNummer, sollDatum, anZPN, anLFGB, anTextilphysik));
        console.log(dataPackUpdate);
        //Übergibt das "dataPack" Array zum Ajax handler
    })).done(checkForUnchecked(dataPackUpdate));
}

function stripDataPack(dataPackUpdate) {
    Object.entries(dataPackUpdate).forEach(([dataPackKey, dataPackValue]) => {
        Object.entries(dataPackValue).forEach(([itemKey, itemValue]) => {
            if (itemValue === "preSet" || itemValue === "active" || itemValue === "deactive") {
                delete dataPackValue[itemKey];
            }
        });
    });
}

//
//Übersendet per Ajax und der POST Methode, dass Objekt "dataPack" an die PHP Datei "db-handling.php".
function sendData(dataPackUpdate) {

    stripDataPack(dataPackUpdate);

    const ajaxInsertDataset = $.ajax({
        url: "../php/db-insert.php",
        method: "POST",
        data: {
            beurteilungDataSet: dataPackUpdate
        },
        dataType: "json"
    });
    //Ajax Anfrage ist erfolgreich.
    ajaxInsertDataset.done(function (data) {
        const $stickyFooterMessageWrap = $("#sticky-footer-message-wrap");
        const $stickyFooterSuccessWrap = $("#transmission-successful-wrapper");
        const $stickyFooterFailWrap = $("#transmission-fail-wrap");
        const $transmissionCounter = $(".present-item-counter");
        const $transmissionSuccessCounter = $("#transmission-success-counter");
        const $transmissionFailCounter = $("#transmission-fail-counter");

        //Funktion zum entfernen der doppelten Datenbank Item Liste.
        const removeListOfDoubleItems = function () {
            $(".transmission-doubleInput-data").each(function () {
                $(this).remove();
            });
        };

        //Funktion zum verstecken des ContentWrap und FooterWrap
        const hideContentFooter = function () {
            const $headerInputEingang = $("#header-input-eingang");
            const $headerInputVerwaltung = $("#header-input-verwaltung");
            const $wrapContent$wrapFooter = $("#wrap-content").add(
                $("#wrap-footer")
            );
            $wrapContent$wrapFooter
                .addClass("displayNoneImportant")
                .add($headerInputEingang)
                .add($headerInputVerwaltung)
                .addClass("border-edged");
        };

        //Funktion zum entfernen der FooterCounter Anzeige inhalte.
        const emptyMainRowsAndCounter = function () {
            const $contentMainRows = $(".content-main-row");
            const $contentFooterCounter = $(".content-footer-counter");
            $contentMainRows.remove();
            $contentFooterCounter.html("0");
        };

        //Funktion um entsprechendes Elemente zu verstecken und die Success und Fail Counter Anzeige zu füllen.
        const transmissionCounter = function (parameterObject) {
            const $globalCounter = parameterObject.globalCounter;
            const $hideElement = parameterObject.hideElement;
            const $successCount = parameterObject.successCount;
            const $failCount = parameterObject.failCount;
            $transmissionCounter.html($globalCounter);
            $transmissionSuccessCounter.html($successCount);
            $transmissionFailCounter.html($failCount);
            switch ($hideElement) {
                case undefined:
                    break;
                default:
                    $hideElement.css("display", "none");
                    break;
            }
        };

        //Funktion um alle doppelt vorkommenden Datensätze im HMTL anzuzeigen.
        const listOfDoubleInputItems = function () {
            const $transmissionDoubleInput = $(
                "#transmission-double-input-wrap"
            );
            /** @namespace data.doubleInput **/
            for (const doubleInputItem of data.doubleInput) {
                const appendDoubleInput = " <div class='transmission-doubleInput-data'>" + doubleInputItem + "</div> ";
                $transmissionDoubleInput.append(appendDoubleInput);
            }
        };

        //Funktion zum Hinzufügen und entfernen von Class des Sticky Footer Elements
        $.fn.animateStickyFooterWrapper = function (
            animationClass,
            heightClass,
            delay
        ) {
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
                removeListOfDoubleItems();
                globalMainRowCounter.length = 0;
                backToInput();
            }, delay + 350);
        };

        //Alle vorliegenden Datensätze waren noch nicht in der Datenbank vorhanden und wurden jetzt eingetragen.
        if (data.success === true && data.doubleInput.length === 0) {
            /** @namespace data.successInput **/
            hideContentFooter();
            emptyMainRowsAndCounter();
            transmissionCounter({
                globalCounter: globalMainRowCounter.length,
                hideElement: $stickyFooterFailWrap,
                successCount: data.successInput.length
            });
            $stickyFooterMessageWrap.animateStickyFooterWrapper(
                "sticky-footer-message-animation",
                "sticky-footer-height",
                4000
            );
        } else if (data.success === true && data.doubleInput.length >= 1) {
            // Alle nicht vorhandenen Datensätze wurden in die Datenbank eingetragen, aber alle doppelt vorhandenen sind in einem Array aufgeführt.
            hideContentFooter();
            emptyMainRowsAndCounter();
            transmissionCounter({
                globalCounter: globalMainRowCounter.length,
                successCount: data.successInput.length,
                failCount: data.doubleInput.length
            });
            listOfDoubleInputItems();
            $stickyFooterMessageWrap.animateStickyFooterWrapper(
                "sticky-footer-message-animation",
                "sticky-footer-height",
                8000
            );
        } else if (data.success === false) {
            //Alle vorhandenen Datensätze sind bereits in der Datenbank eingetragen und wurden zur weiterverarbeitung in ein Array aufgeführt.
            // else if (data.success === false && data.doubleInput.length >= 1)
            /** @namespace data.failCode **/
            switch (data.failCode) {
                case 1049:
                    showFailMessage.failMessage(
                        "no-database header-fail-message-content-margin",
                        8000
                    );
                    console.log(data);
                    backToInput();
                    break;

                case 2002:
                    showFailMessage.failMessage(
                        "no-server header-fail-message-content-margin",
                        8000
                    );
                    console.log(data);
                    backToInput();
                    break;

                case "23000":
                    hideContentFooter();
                    emptyMainRowsAndCounter();
                    transmissionCounter({
                        globalCounter: globalMainRowCounter.length,
                        hideElement: $stickyFooterSuccessWrap,
                        failCount: data.doubleInput.length
                    });
                    listOfDoubleInputItems();
                    $stickyFooterMessageWrap.animateStickyFooterWrapper(
                        "sticky-footer-message-animation",
                        "sticky-footer-height",
                        8000
                    );
                    console.log(data);
                    break;

                default:
            }
        }
    });

    //Ajax Verbindung fehlgeschlagen.
    ajaxInsertDataset.fail(function (jqXHR, textStatus, errorThrown) {
        //Blendet für 6 sek. eine "Verbindung Fehlgeschlagen" auskunft ein.
        showFailMessage.failMessage(
            "no-server header-fail-message-content-margin",
            8000
        );
        console.log(textStatus, errorThrown);
        backToInput();
    });
}
