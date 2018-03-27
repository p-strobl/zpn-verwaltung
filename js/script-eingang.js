'use strict'

//                                                                                                                                            
//Fügt einen Neuen Datensatz in das HTML ein.
function appendContentMainRow(inputTextLeft, inputTextRight) {
    const $contentHeaderRow = $('#content-header-row');
    const $wrapContent$wrapFooter = $('#wrap-content').add($('#wrap-footer'));
    const $headerInputEingang = $('#header-input-eingang');
    const contentAppend =
        (
            " <section class='content-main-row eingang' id='content-main-row'> " +
            " <div class='content-main-cell' title='Eingetragene Proben Nummer.'> " +
            " <p class='content-main-text' id='text-prbNr'>" + inputTextLeft + " </p> " +
            "</div> " +
            " <div class='content-main-cell'>" +
            " <p class='content-main-text' id='text-sollNr' contenteditable='true' title='Sie können das Solldatum manuell ändern.'>" + inputTextRight + " </p> " +
            "</div> " +
            " <div class='content-main-cell' title='Betätigen Sie diese Schaltfläche um diesen Datensatz als &#34;Express&#34; zu markieren.'> " +
            " <button type='button' class='content-button-check' id='content-btn-chkEx' value='deactive'>Express</button> " +
            " </div> " +
            " <div class='content-main-cell' title='Betätigen Sie diese Schaltfläche um diesen Datensatz als &#34;Intern Vorziehen&#34; zu markieren.'> " +
            " <button type='button' class='content-button-check' id='content-btn-chkIntern' value='deactive'>Vorziehen</button> " +
            " </div> " +
            " <div class='content-main-cell' title='Betätigen Sie diese Schaltfläche um diesen Datensatz als &#34;mit Nickel&#34; zu markieren.'> " +
            " <button type='button' class='content-button-check' id='content-btn-chkNi' value='deactive'>Mit Nickel</button> " +
            " </div> " +
            " <div class='content-main-cell' title='Betätigen Sie diese Schaltfläche um diesen Datensatz als &#34;aus der LFGB&#34; zu markieren.'> " +
            " <button type='button' class='content-button-check' id='content-btn-chkLF' value='deactive'>LFGB</button> " +
            " </div> " +
            " <div class='content-main-cell' title='Betätigen Sie diese Schaltfläche um diesen Datensatz als &#34;aus Team Toy&#39;s&#34; zu markieren.'> " +
            " <button type='button' class='content-button-check' id='content-btn-chkToy' value='deactive'>Toys</button> " +
            " </div> " +
            " <div class='content-main-cell' title='Betätigen Sie diese Schaltfläche um diesen Datensatz als &#34;mit 60g&#34; zu markieren.'> " +
            " <button type='button' class='content-button-check' id='content-btn-chk60g' value='deactive'>Mit 60 g</button> " +
            " </div> " +
            " <div class='content-main-cell' title='Betätigen Sie diese Schaltfläche um diesen Datensatz als &#34;geklärten Klärfall&#34; zu markieren.'> " +
            " <button type='button' class='content-button-check' id='content-btn-chkKlaerBack' value='deactive'>Klärfall geklärt</button>" +
            " </div> " +
            " <div class='content-main-cell' title='Betätigen Sie diese Schaltfläche um diesen Datensatz als &#34;Nickel Rückgabe&#34; zu markieren.'> " +
            " <button type='button' class='content-button-check' id='content-btn-chkNickelBack' value='deactive'>Nickel Rückgabe</button>" +
            " </div> " +
            " <div class='content-main-cell'> " +
            " <button type='button' class='content-button-delete' id='content-main-row-delete-button' title='Betätigen Sie diese Schaltfläche um den entfernen Dialog zu starten und zu beenden.'>Entfernen</button> " +
            " <div class='slideToggle-wrap-hidden-row' id='slideToggle-wrap-hidden-row'> " +
            " <div class='wrap-hidden-row' id='wrap-hidden-row'> " +
            " <button class='hidden-row confirm-button' id='hidden-row-confirm-button' title='Mit dieser Schaltfläche bestätigen Sie das entfernen der ausgewählten Zeile&#33;'>Ja</button> " +
            " <button class='hidden-row cancel-button' id='hidden-row-cancel-button' title='Mit dieser Schaltfläche beenden Sie den entfernen Dialog.'>Nein</button> " +
            " </div> " +
            " </div> " +
            " </div> " +
            " </section>"

        );

    //Zeigt den Tabellen Header, die Tabelle und den sende Button wieder an.
    $wrapContent$wrapFooter.hasClass('displayNoneImportant') === true ? $wrapContent$wrapFooter.removeClass('displayNoneImportant').add($headerInputEingang).removeClass('border-edged') : "";
    ///Fügt dem HTML Element mit der ID "#wrap-content" eine Zeile mit dem Inhalt von "inputText" und dazugehörigen Checkboxen hinzu.
    $contentHeaderRow.after(contentAppend);
    //Ruft die Funktion "countRows" auf um die Anzahl der vorhandenen Datensätze zu zählen.
    countMainRows.addHighlight('highlight', '#FFB700', 100);
}
// content-button-delete
//                                                                                                                                            
//Konstruktor für das Array "dataPack"
function ConstructDataPack(probenNummer, sollDatum, mitExpress, mitIntern, mitNickel, mitLfgb, mitToys, mit60g, mitKlaerfallBack, mitNickelBack) {
    this.probenNummer = probenNummer;
    this.sollDatum = sollDatum;
    this.mitExpress = mitExpress;
    this.mitIntern = mitIntern;
    this.mitNickel = mitNickel;
    this.mitLfgb = mitLfgb;
    this.mitToys = mitToys;
    this.mit60g = mit60g;
    this.mitKlaerfallBack = mitKlaerfallBack;
    this.mitNickelBack = mitNickelBack;
}

//                                                                                                                                            
//Fügt alle Daten einer Zeile in ein Paket zusammen.
function wrapData() {
    const $contentMainRow = $('.content-main-row');
    //Leeres Array für den Datentransfer in die Datenbank.
    const dataPackEingang = [];
    //Zeit Sting pattern
    const newDatePattern = /(\d{2})\.(\d{2})\.(\d{4})/;
    //Durchläuft jede erstellte Zeile der Tabelle.
    $.when($contentMainRow.each(function () {
        //Speichert den Inhalt der einzelnen Spalten der ausgewählten Zeile in einer Variable ab.
        //Überprüft die Checkboxen und übergibt 0 oder 1 als Wert.
        const probenNummer = $(this).find('#text-prbNr').text();
        let sollDatum = $(this).find('#text-sollNr').text();
        const mitExpress = $(this).find('#content-btn-chkEx').attr('value');
        const mitIntern = $(this).find('#content-btn-chkIntern').attr('value');
        const mitNickel = $(this).find('#content-btn-chkNi').attr('value');
        const mitLfgb = $(this).find('#content-btn-chkLF').attr('value');
        const mitToys = $(this).find('#content-btn-chkToy').attr('value');
        const mit60g = $(this).find('#content-btn-chk60g').attr('value');
        const mitKlaerfallBack = $(this).find('#content-btn-chkKlaerBack').attr('value');
        const mitNickelBack = $(this).find('#content-btn-chkNickelBack').attr('value');

        //Umbau des sollDatum Sting
        sollDatum = sollDatum.replace(newDatePattern, '$3-$2-$1');

        //Fügt mit hilfer eines Constructor's, den Inhalt der gegenwärtig selektierten Zeile, als Array in das "dataPack" hinzu.
        dataPackEingang.push(new ConstructDataPack(probenNummer, sollDatum, mitExpress, mitIntern, mitNickel, mitLfgb, mitToys, mit60g, mitKlaerfallBack, mitNickelBack));
        // dataPack.push(JSON.stringify(new ConstructDataPack(prbNr, sollNr, chkEx, chkNi, chkLF, chkToy, chk60g)));
        // console.log(dataPackEingang);
        //Übergibt das "dataPack" Array zum Ajax handler
    })).done(sendData(dataPackEingang));
}

//                                                                                                                                            
//Übersendet per Ajax und der POST Methode, dass Objekt "dataPack" an die PHP Datei "db-handling.php".
function sendData(dataPackEingang) {

    const ajaxRequestEingang = $.ajax({
        url: '../php/db-insert.php',
        method: 'POST',
        data: {
            insertDataSet: dataPackEingang
        },
        dataType: 'json',
    });

    //Ajax Anfrage ist erfolgreich.
    ajaxRequestEingang.done(function (data) {
        const $stickyFooterMessageWrap = $('#sticky-footer-message-wrap');
        const $stickyFooterSuccessWrap = $('#transmission-successful-wrapper');
        const $stickyFooterFailWrap = $('#transmission-fail-wrap');
        const $transmissionCounter = $('.present-item-counter');
        const $transmissionSuccessCounter = $('#transmission-success-counter');
        const $transmissionFailCounter = $('#transmission-fail-counter');

        //Funktion zum entfernen der doppelten Datenbank Item Liste.
        const removeListOfDoubleItems = function () {
            $('.transmission-doubleInput-data').each(function () {
                $(this).remove();
            });
        }

        //Funktion zum verstecken des ContentWrap und FooterWrap
        const hideContentFooter = function () {
            const $headerInputEingang = $('#header-input-eingang');
            const $headerInputVerwaltung = $('#header-input-verwaltung');
            const $wrapContent$wrapFooter = $('#wrap-content').add($('#wrap-footer'));
            $wrapContent$wrapFooter
                .addClass('displayNoneImportant')
                .add($headerInputEingang)
                .add($headerInputVerwaltung)
                .addClass('border-edged');
        };

        //Funktion zum entfernen der FooterCounter Anzeige inhalte.
        const emptyMainRowsAndCounter = function () {
            const $contentMainRows = $('.content-main-row');
            const $contentFooterCounter = $('.content-footer-counter');
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
                    $hideElement.css('display', 'none');
                    break;
            }
        };

        //Funktion um alle doppelt vorkommenden Datensätze im HMTL anzuzeigen.
        const listOfDoubleInputItems = function () {
            const $transmissionDoubleInput = $('#transmission-double-input-wrap');
            for (const doubleInputItem of data.doubleInput) {
                const appendDoubleInput = (
                    " <div class='transmission-doubleInput-data'>" + doubleInputItem + "</div> "
                );
                $transmissionDoubleInput.append(appendDoubleInput);
            }
        };

        //Funktion zum Hinzufügen und entfernen von Class des Sticky Footer Elements
        $.fn.animateStickyFooterWrapper = function (animationClass, heightClass, delay) {
            const $stickyFooterWrapper = $(this);
            const $animationClass = animationClass;
            const $heightClass = heightClass;
            $stickyFooterWrapper
                .removeClass($heightClass)
                .addClass($animationClass);
            setTimeout(function () {
                $stickyFooterWrapper.removeClass($animationClass);
            }, delay);
            setTimeout(function () {
                $stickyFooterWrapper.addClass($heightClass);
                $stickyFooterSuccessWrap
                    .add($stickyFooterFailWrap)
                    .css('display', '');
                removeListOfDoubleItems();
                globalMainRowCounter.length = 0;
                backToInput();
            }, delay + 350);
        };

        // console.log(data.success);
        // console.log(data.doubleInput);
        // console.log(data.doubleInput);

        //Alle vorliegenden Datensätze waren noch nicht in der Datenbank vorhanden und wurden jetzt eingetragen.
        if (data.success === true && data.doubleInput.length === 0) {
            hideContentFooter();
            emptyMainRowsAndCounter();
            transmissionCounter
                ({
                    globalCounter: globalMainRowCounter.length,
                    hideElement: $stickyFooterFailWrap,
                    successCount: data.successInput.length
                });
            $stickyFooterMessageWrap.animateStickyFooterWrapper('sticky-footer-message-animation', 'sticky-footer-height', 4000);
        }
        // Alle nicht vorhandenen Datensätze wurden in die Datenbank eingetragen, aber alle doppelt vorhandenen sind in einem Array aufgeführt.
        else if (data.success === true && data.doubleInput.length >= 1) {
            hideContentFooter();
            emptyMainRowsAndCounter();
            transmissionCounter
                ({
                    globalCounter: globalMainRowCounter.length,
                    successCount: data.successInput.length,
                    failCount: data.doubleInput.length
                });
            listOfDoubleInputItems();
            $stickyFooterMessageWrap.animateStickyFooterWrapper('sticky-footer-message-animation', 'sticky-footer-height', 8000);
        }

        //Alle vorhandenen Datensätze sind bereits in der Datenbank eingetragen und wurden zur weiterverarbeitung in ein Array aufgeführt.
        else if (data.success === false)
        // else if (data.success === false && data.doubleInput.length >= 1)
        {
            switch (data.failCode) {
                case 1049:
                    showFailMessage.failMessage('no-database header-fail-message-content-margin', 8000);
                    console.log(data);
                    backToInput();
                    break;

                case 2002:
                    showFailMessage.failMessage('no-server header-fail-message-content-margin', 8000);
                    console.log(data);
                    backToInput();
                    break;

                case "23000":
                    hideContentFooter();
                    emptyMainRowsAndCounter();
                    transmissionCounter
                        ({
                            globalCounter: globalMainRowCounter.length,
                            hideElement: $stickyFooterSuccessWrap,
                            failCount: data.doubleInput.length
                        });
                    listOfDoubleInputItems();
                    $stickyFooterMessageWrap.animateStickyFooterWrapper('sticky-footer-message-animation', 'sticky-footer-height', 8000);
                    // console.log(data);
                    break;

                default:
            }
        }
    });

    //Ajax Verbindung fehlgeschlagen.
    ajaxRequestEingang.fail(function (jqXHR, textStatus, errorThrown) {
        //Blendet für 6 sek. eine "Verbindung Fehlgeschlagen" auskunft ein.
        showFailMessage.failMessage('no-server header-fail-message-content-margin', 8000);
        console.log(textStatus, errorThrown);
        backToInput();
    });
}



// function showModal() {
//     const $wrapModal = $('#wrap-modal');
//     const $indexModal = $('#wrap-modal').add('#content-modal');
//     const $imgSearch = $('#img-search');
//     const $modalHeaderClose = $('#modal-header-close');

//     $imgSearch.on('click', function (event) {
//         resetDetails();
//         $indexModal.toggleClass('show-modal');
//         backToModalInput();
//     });
// }

// function closeModal() {
//     const $wrapModal = $('#wrap-modal');
//     const $indexModal = $('#wrap-modal').add('#content-modal');
//     const $modalHeaderClose = $('#modal-header-close');

//     $wrapModal.on('click', function (event) {
//         if (event.target == event.currentTarget) {
//             $indexModal.toggleClass('show-modal');
//             backToInput();
//         }
//     });

//     $modalHeaderClose.on('click', function () {
//         $indexModal.toggleClass('show-modal');
//         backToInput();
//     });
// }