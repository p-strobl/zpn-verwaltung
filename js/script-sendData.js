// 'use-strict';

// //
// //Übersendet per Ajax und der POST Methode, dass Objekt "dataPack" an die PHP Datei "db-handling.php".
// function sendData(dataPack) {

//     stripDataPack(dataPack);

//     // switch (origin) {
//     //     case 'beurteilungMusterEingang':
//     //         let ajaxInsertDataset = $.ajax({
//     //             url: "../php/db-insert.php",
//     //             method: "POST",
//     //             data: {
//     //                 beurteilungDataSet: dataPack
//     //             },
//     //             dataType: "json"
//     //         });
//     //         break;

//     //     case 'zpnMusterEingang':
//     //         let ajaxInsertDataset = $.ajax({
//     //             url: "../php/db-insert.php",
//     //             method: "POST",
//     //             data: {
//     //                 musterEingangDataSet: dataPack
//     //             },
//     //             dataType: "json"
//     //         });
//     //         break;
//     // }

//     const ajaxInsertDataset = $.ajax({
//         url: "../php/db-insert.php",
//         method: "POST",
//         data: {
//             beurteilungDataSet: dataPack, musterEingangDataSet: dataPack
//         },
//         dataType: "json"
//     });

//     //Ajax Anfrage ist erfolgreich.
//     ajaxInsertDataset.done(function (data) {
//         const $stickyFooterMessageWrap = $("#sticky-footer-message-wrap");
//         const $stickyFooterSuccessWrap = $("#transmission-successful-wrapper");
//         const $stickyFooterFailWrap = $("#transmission-fail-wrap");
//         const $transmissionCounter = $(".present-item-counter");
//         const $transmissionSuccessCounter = $("#transmission-success-counter");
//         const $transmissionFailCounter = $("#transmission-fail-counter");

//         //Funktion zum entfernen der doppelten Datenbank Item Liste.
//         const removeListOfDoubleItems = function () {
//             $(".transmission-doubleInput-data").each(function () {
//                 $(this).remove();
//             });
//         };

//         //Funktion zum verstecken des ContentWrap und FooterWrap
//         const hideContentFooter = function () {
//             const $headerInputEingang = $("#header-input-eingang");
//             const $headerInputVerwaltung = $("#header-input-verwaltung");
//             const $wrapContent$wrapFooter = $("#wrap-content").add(
//                 $("#wrap-footer")
//             );
//             $wrapContent$wrapFooter
//                 .addClass("displayNoneImportant")
//                 .add($headerInputEingang)
//                 .add($headerInputVerwaltung)
//                 .addClass("border-edged");
//         };

//         //Funktion zum entfernen der FooterCounter Anzeige inhalte.
//         const emptyMainRowsAndCounter = function () {
//             const $contentMainRows = $(".content-main-row");
//             const $contentFooterCounter = $(".content-footer-counter");
//             $contentMainRows.remove();
//             $contentFooterCounter.html("0");
//         };

//         //Funktion um entsprechendes Elemente zu verstecken und die Success und Fail Counter Anzeige zu füllen.
//         const transmissionCounter = function (parameterObject) {
//             const $globalCounter = parameterObject.globalCounter;
//             const $hideElement = parameterObject.hideElement;
//             const $successCount = parameterObject.successCount;
//             const $failCount = parameterObject.failCount;
//             $transmissionCounter.html($globalCounter);
//             $transmissionSuccessCounter.html($successCount);
//             $transmissionFailCounter.html($failCount);
//             switch ($hideElement) {
//                 case undefined:
//                     break;
//                 default:
//                     $hideElement.css("display", "none");
//                     break;
//             }
//         };

//         //Funktion um alle doppelt vorkommenden Datensätze im HMTL anzuzeigen.
//         const listOfDoubleInputItems = function () {
//             const $transmissionDoubleInput = $(
//                 "#transmission-double-input-wrap"
//             );
//             /** @namespace data.doubleInput **/
//             for (const doubleInputItem of data.doubleInput) {
//                 const appendDoubleInput = " <div class='transmission-doubleInput-data'>" + doubleInputItem + "</div> ";
//                 $transmissionDoubleInput.append(appendDoubleInput);
//             }
//         };

//         //Funktion zum Hinzufügen und entfernen von Class des Sticky Footer Elements
//         $.fn.animateStickyFooterWrapper = function (
//             animationClass,
//             heightClass,
//             delay
//         ) {
//             const $stickyFooterWrapper = $(this);
//             const $animationClass = animationClass;
//             const $heightClass = heightClass;
//             const $wrapEingang = $("#wrap-eingang");
//             $wrapEingang.css("visibility", "hidden");
//             $stickyFooterWrapper
//                 .removeClass($heightClass)
//                 .addClass($animationClass);
//             setTimeout(function () {
//                 $stickyFooterWrapper.removeClass($animationClass);
//             }, delay);
//             setTimeout(function () {
//                 $wrapEingang.css("visibility", "visible");
//                 $stickyFooterWrapper.addClass($heightClass);
//                 $stickyFooterSuccessWrap
//                     .add($stickyFooterFailWrap)
//                     .css("display", "");
//                 removeListOfDoubleItems();
//                 globalMainRowCounter.length = 0;
//                 backToInput();
//             }, delay + 350);
//         };

//         //Alle vorliegenden Datensätze waren noch nicht in der Datenbank vorhanden und wurden jetzt eingetragen.
//         if (data.success === true && data.doubleInput.length === 0) {
//             /** @namespace data.successInput **/
//             hideContentFooter();
//             emptyMainRowsAndCounter();
//             transmissionCounter({
//                 globalCounter: globalMainRowCounter.length,
//                 hideElement: $stickyFooterFailWrap,
//                 successCount: data.successInput.length
//             });
//             $stickyFooterMessageWrap.animateStickyFooterWrapper(
//                 "sticky-footer-message-animation",
//                 "sticky-footer-height",
//                 4000
//             );
//         } else if (data.success === true && data.doubleInput.length >= 1) {
//             // Alle nicht vorhandenen Datensätze wurden in die Datenbank eingetragen, aber alle doppelt vorhandenen sind in einem Array aufgeführt.
//             hideContentFooter();
//             emptyMainRowsAndCounter();
//             transmissionCounter({
//                 globalCounter: globalMainRowCounter.length,
//                 successCount: data.successInput.length,
//                 failCount: data.doubleInput.length
//             });
//             listOfDoubleInputItems();
//             $stickyFooterMessageWrap.animateStickyFooterWrapper(
//                 "sticky-footer-message-animation",
//                 "sticky-footer-height",
//                 8000
//             );
//         } else if (data.success === false) {
//             //Alle vorhandenen Datensätze sind bereits in der Datenbank eingetragen und wurden zur weiterverarbeitung in ein Array aufgeführt.
//             // else if (data.success === false && data.doubleInput.length >= 1)
//             /** @namespace data.failCode **/
//             switch (data.failCode) {
//                 case 1049:
//                     showFailMessage.failMessage(
//                         "no-database header-fail-message-content-margin",
//                         8000
//                     );
//                     console.log(data);
//                     backToInput();
//                     break;

//                 case 2002:
//                     showFailMessage.failMessage(
//                         "no-server header-fail-message-content-margin",
//                         8000
//                     );
//                     console.log(data);
//                     backToInput();
//                     break;

//                 case "23000":
//                     hideContentFooter();
//                     emptyMainRowsAndCounter();
//                     transmissionCounter({
//                         globalCounter: globalMainRowCounter.length,
//                         hideElement: $stickyFooterSuccessWrap,
//                         failCount: data.doubleInput.length
//                     });
//                     listOfDoubleInputItems();
//                     $stickyFooterMessageWrap.animateStickyFooterWrapper(
//                         "sticky-footer-message-animation",
//                         "sticky-footer-height",
//                         8000
//                     );
//                     console.log(data);
//                     break;

//                 default:
//             }
//         }
//     });

//     //Ajax Verbindung fehlgeschlagen.
//     ajaxInsertDataset.fail(function (jqXHR, textStatus, errorThrown) {
//         //Blendet für 6 sek. eine "Verbindung Fehlgeschlagen" auskunft ein.
//         showFailMessage.failMessage(
//             "no-server header-fail-message-content-margin",
//             8000
//         );
//         console.log(textStatus, errorThrown);
//         backToInput();
//     });
// }

// //Verwaltun DataSend Update
// //
// //Übersendet per Ajax und der POST Methode, dass Objekt "dataPack" an die PHP Datei "db-handling.php".
// function sendUpdate(dataPack) {

//     stripDataPack(dataPack);

//     const ajaxRequestUpdate = $.ajax({
//         url: "../php/db-update.php",
//         method: "POST",
//         data: {
//             updateDataSet: dataPack
//         },
//         dataType: "json"
//     });
//     //Ajax Anfrage ist erfolgreich.
//     ajaxRequestUpdate.done(function (data) {
//         // console.log(data);
//         const itemCount = data["itemCount"];
//         const $stickyFooterMessageWrap = $("#sticky-footer-message-wrap");
//         const $stickyFooterSuccessWrap = $("#transmission-successful-wrapper");
//         const $stickyFooterFailWrap = $("#transmission-fail-wrap");

//         //Funktion zum verstecken des ContentWrap und FooterWrap
//         const hideContentFooter = function () {
//             const $headerInputEingang = $("#header-input-eingang");
//             const $wrapContent$wrapFooter = $("#wrap-content ").add(
//                 $("#wrap-footer")
//             );
//             $wrapContent$wrapFooter
//                 .addClass("displayNoneImportant")
//                 .add($headerInputEingang)
//                 .addClass("border-edged");
//         };

//         //Funktion zum entfernen der FooterCounter Anzeige inhalte.
//         const emptyMainRowsAndCounter = function () {
//             const $contentMainRows = $(".content-main-row");
//             const $contentFooterCounter = $(".content-footer-counter");
//             $contentMainRows.remove();
//             $contentFooterCounter.html("0");
//         };

//         //Funktion zum Hinzufügen und entfernen von Class des Sticky Footer Elements
//         $.fn.animateStickyFooterWrapper = function (animationClass, heightClass, delay) {
//             const $stickyFooterWrapper = $(this);
//             const $animationClass = animationClass;
//             const $heightClass = heightClass;
//             const $wrapEingang = $("#wrap-eingang");
//             $wrapEingang.css("visibility", "hidden");
//             $stickyFooterWrapper
//                 .removeClass($heightClass)
//                 .addClass($animationClass);

//             setTimeout(function () {
//                 $stickyFooterWrapper.removeClass($animationClass);
//             }, delay);

//             setTimeout(function () {
//                 $wrapEingang.css("visibility", "visible");
//                 $stickyFooterWrapper.addClass($heightClass);
//                 $stickyFooterSuccessWrap
//                     .add($stickyFooterFailWrap)
//                     .css("display", "");

//                 globalMainRowCounter.length = 0;
//                 backToInput();
//             }, delay + 350);
//         };

//         if (itemCount >= 1) {
//             hideContentFooter();
//             emptyMainRowsAndCounter();
//             $stickyFooterMessageWrap.animateStickyFooterWrapper(
//                 "sticky-footer-message-animation",
//                 "sticky-footer-height",
//                 4000
//             );
//         }
//     });

//     //Ajax Verbindung fehlgeschlagen.
//     ajaxRequestUpdate.fail(function (jqXHR, textStatus, errorThrown) {
//         console.log(textStatus, errorThrown);
//         //Blendet für 6 sek. eine "Verbindung Fehlgeschlagen" auskunft ein.
//         showFailMessage.failMessage("no-server header-fail-message-content-margin", 8000);

//         backToInput();
//     });
// }