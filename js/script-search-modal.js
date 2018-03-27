'use strict'

//Leert alle Zeit Angaben der Verwaltungs Anzeige
function resetDetails() {

    const modalContentMainPullSqlItem = $('.modal__content__main__pullSql__item');
    const modalContentCaptionSpan = $('.modal__content__caption__span');
    const modalContentFooterSpan = $('.modal__content__footer__span');
    const modalStatusItems = $('.modal__status');

    modalContentMainPullSqlItem.html(' - ');
    modalContentCaptionSpan.add(modalContentFooterSpan).html('');

    modalStatusItems.each(function () {
        $(this)
            .removeClass('active')
            .addClass('deactive');
    });

    // $detailsOpenButtonWrap.hasClass('transition') ? "" : $detailsOpenButtonWrap.add($mainContentMiddleWrap).addClass('transition');
}

const showCloseModal = (() => {

    const $indexModal = $('#wrap-modal').add('#content-modal');
    const $imgSearch = $('#img-search');
    const $wrapModal = $('#wrap-modal');
    const $modalHeaderClose = $('#modal-header-close');
    const $modalHeaderInput = $('#modal-header-input');

    const showModal = (() => {
        $imgSearch.on('click', function (event) {
            // resetDetails();
            $indexModal.toggleClass('show-modal');
            backToModalInput();
        });
    });

    const closeModal = (() => {
        $wrapModal.on('click', function (event) {
            if (event.target == event.currentTarget) {
                $indexModal.toggleClass('show-modal');
                backToInput();
            }
        });

        $modalHeaderClose.on('click', function () {
            $indexModal.toggleClass('show-modal');
            backToInput();
        });
    });

    const backToModalInput = (() => {
        setTimeout(() => {
            $modalHeaderInput.focus();
        }, 100);
        return;
    });

    return {
        showModal: showModal,
        closeModal: closeModal
    }
})();

function searchDataSet(probenNummer) {
    const ajaxRequestObject = $.ajax({
        url: '../php/db-requestObject.php',
        method: 'POST',
        data: {
            requestDataSet: probenNummer
        },
        dataType: 'json'
    });

    ajaxRequestObject.done(function (data) {

        console.log(data);

        const toFillObject = {

            // anAbteilung: $('#'),
            berechnungDateTimeZpnwagen: $('#pullSql-gesamt-zpnDauer'),
            beurteilungBereitDate: $('#pullSql-beurteilung-date'),
            beurteilungBereitTime: $('#pullSql-beurteilung-time'),
            beurteilungZpnBerechnung: $('#pullSql-gesamt-beurteilung'),
            eingangDate: $('#modal-pullSql-zpnEingang-date'),
            eingangTime: $('#modal-pullSql-zpnEingang-time'),
            einwaageBeginnDate: $('#pullSql-einwaage-start-date'),
            einwaageBeginnTime: $('#pullSql-einwaage-start-time'),
            einwaageBerechnung: $('#pullSql-gesamt-einwaage'),
            einwaageEndeDate: $('#pullSql-einwaage-ende-date'),
            einwaageEndeTime: $('#pullSql-einwaage-ende-time'),
            // klaerfallAnzahl: $('#'),
            klaerfallBeginnDate: $('#pullSql-klaerfall-start-date'),
            klaerfallBeginnTime: $('#pullSql-klaerfall-start-time'),
            klaerfallBerechnung: $('#'),
            klaerfallEndeDate: $('#pullSql-klaerfall-ende-date'),
            klaerfallEndeTime: $('#pullSql-klaerfall-ende-time'),
            kommentarDate: $('#modal-content-footer-span-date'),
            kommentarText: $('#modal-content-footer-span-text'),
            kommentarTime: $('#modal-content-footer-span-time'),
            manaBerechnungDateTimeAnfrage: $('#pullSql-gesamt-mBestellung'),
            manaBerechnungDateTimeEinwaage: $('#pullSql-gesamt-mEinwaage'),
            manaBerechnungDateTimeGesamt: $('#pullSql-gesamt-mGesamt'),
            manaEinwaageDate: $('#pullSql-mEinwaage-ende-date'),
            manaEinwaageTime: $('#pullSql-mEinwaage-ende-time'),
            manaErhaltenDate: $('#pullSql-mErhalten-ende-date'),
            manaErhaltenTime: $('#pullSql-mErhalten-ende-time'),
            manaGestelltDate: $('#pullSql-mBestellt-start-date'),
            manaGestelltTime: $('#pullSql-mBestellt-start-time'),
            manaZpnWagenDate: $('#pullSql-mBestellt-start-time'),
            manaZpnWagenTime: $('#pullSql-mWagen-ende-time'),
            mit60g: $('#modal-status-60g'),
            mitExpress: $('#modal-status-express'),
            mitIntern: $('#modal-status-internVorziehen'),
            mitKlaerfallBack: $('#modal-status-mitKlaerfall'),
            mitLfgb: $('#modal-status-lfgb'),
            mitNickel: $('#modal-status-mitNickel'),
            mitToys: $('#modal-status-toys'),
            nickelBerechnung: $('#pullSql-gesamt-nickelDauer'),
            nickelRueckgabeDate: $('#modal-pullSql-nickelBack-date'),
            nickelRueckgabeTime: $('#modal-pullSql-nickelBack-time'),
            probenNummer: $('#modal-content-caption-nummber-text'),
            sollDatum: $('#modal-content-caption-soll-text'),
            // stornoDate: $('#'),
            // stornoTime: $('#'),
            zerlegungBerechnung: $('#'),
            zerlegungEndeDate: $('#pullSql-zerlegung-ende-date'),
            zerlegungEndeTime: $('#pullSql-zerlegung-ende-time'),
            zerlegungStartDate: $('#pullSql-zerlegung-start-date'),
            zerlegungStartTime: $('#pullSql-zerlegung-start-time'),
            zpnWagenDate: $('#pullSql-zpnWagen-date'),
            zpnWagenTime: $('#pullSql-zpnWagen-time'),
        }

        function setButtonStatus(rowItems, itemKey) {
            const setItem = toFillObject[itemKey];
            setItem
                .prop('disabled', true)
                .addClass('setButtonStatus')
                .val('preSet');
        }

        $.each(data, function (dataKey, dataValue) {
            $.each(toFillObject, function (itemKey, itemValue) {

                switch (dataKey) {
                    case itemKey:
                        setButtonStatus(toFillObject, itemKey);
                        break;
                }
            });
        });
    });

    ajaxRequestObject.fail(function (jqXHR, textStatus, errorThrown) {
        // console.log( textStatus, errorThrown );
        //Blendet für 6 sek. eine "Verbindung Fehlgeschlagen" auskunft ein.
        // showFailMessage.failMessage( 'no-server header-fail-message-content-margin', 8000 );

        backToInput();
    });
}

// //                                                                                                                                            
// //Übergibt die eingebene Probenummer an das PHP script und gleicht die Nummer mit der Datenbank ab.
// function searchDataSet(inputText) {

//     resetDetails();

//     const $headerInputField = $('#header-input-verwaltung');

//     const ajaxRequest = $.ajax({
//         url: '../php/db-search.php',
//         method: 'POST',
//         data: {
//             getStatusItems: inputText
//         },
//         dataType: 'json'
//     });

//     ajaxRequest.done(function (data) {
//         console.log(data);

//         // const $headerInputField = $('#header-input-verwaltung');
//         $headerInputField.effect('highlight', {
//             color: '#FFB700'
//         }, 200);

//         if (data.success === true) {
//             const $mainButtonProbenNahme = $('#main-middle-item-probenNahme');
//             const $mainButtonNickel = $('#main-middle-item-nickel');
//             const $mainButtonKlaerfall = $('#main-middle-item-klaerfall');
//             const $mainButtonMana = $('#main-middle-item-maNa');
//             const $mainButtonZpnWagen = $('#main-middle-item-zpnWagen');
//             const $mainButtonKommentar = $('#comment-send-button');

//             const $detailsOpenButtonWrap = $('#detailsOpenButtonWrap');
//             const $mainContentMiddleWrap = $('#mainContentMiddleWrap');

//             var toFillTimingSpansObject = {
//                 eingangDate: $('#span-timing-date-eingang'),
//                 eingangTime: $('#span-timing-time-eingang'),

//                 gesamtInZPN: $('#gesamt-timing-ZPNWagen'),
//                 gesamtKlaerfall: $('#gesamt-timing-klaerfall'),
//                 gesamtManaAnfrage: $('#gesamt-timing-manaAnfrag'),
//                 gesamtManaDauer: $('#gesamt-timing-manaGesamt'),
//                 gesamtNickel: $('#gesamt-timing-nickel'),
//                 gesamtProbenNahme: $('#gesamt-timing-probenahme'),

//                 klaefallBeginnDate: $('#span-timing-date-klaerfallGestellt'),
//                 klaefallBeginnTime: $('#span-timing-time-klaerfallGestellt'),
//                 klaerfallEndeDate: $('#span-timing-date-klaerfallErhalten'),
//                 klaerfallEndeTime: $('#span-timing-time-klaerfallErhalten'),

//                 // kommentarDate: "",
//                 kommentarText: $('#comment-text'),
//                 // kommentarTime: "",

//                 maNaErhaltenDate: $('#span-timing-date-maNaErhalten'),
//                 maNaErhaltenTime: $('#span-timing-time-maNaErhalten'),
//                 maNaGestelltDate: $('#span-timing-date-maNaAngefordert'),
//                 maNaGestelltTime: $('#span-timing-time-maNaAngefordert'),
//                 maNaZpnWagenDate: $('#span-timing-date-maNaEingewogen'),
//                 maNaZpnWagenTime: $('#span-timing-time-maNaEingewogen'),

//                 nickelRueckgabeDate: $('#span-timing-date-nickelRueckgabeDateTime'),
//                 nickelRueckgabeTime: $('#span-timing-time-nickelRueckgabeDateTime'),

//                 probenNahmeBeginnDate: $('#span-timing-date-probenNahme'),
//                 probenNahmeBeginnTime: $('#span-timing-time-probenNahme'),
//                 probenNahmeEndeDate: $('#span-timing-date-probenNahmeEnde'),
//                 probenNahmeEndeTime: $('#span-timing-time-probenNahmeEnde'),

//                 sollDatum: $('#span-input-text-solldatum'),
//                 probenNummerPK: $('#span-input-text-probenummer'),

//                 zpnWagenDate: $('#span-timing-date-zpnWagen'),
//                 zpnWagenTime: $('#span-timing-time-zpnWagen'),
//             }

//             var toFillStatusObject = {
//                 mit60g: $('#mit60g'),
//                 mitExpress: $('#mitExpress'),
//                 mitIntern: $('#mitIntern'),
//                 mitLfgb: $('#mitLfgb'),
//                 mitNickel: $('#mitNickel'),
//                 mitToys: $('#mitToys'),
//             }

//             var toFillOnOffStatusMiddleItems = {
//                 onOffStatusKlaerfall: $('#main-middle-item-klaerfall'),
//                 onOffStatusKommentar: $('#comment-send-button'),
//                 onOffStatusManaErhalten: $('#main-middle-item-maNa'),
//                 onOffStatusManaWagen: $('#main-middle-item-maNa'),
//                 onOffStatusNickelRueckgabe: $('#main-middle-item-nickel'),
//                 onOffStatusProbenNahme: $('#main-middle-item-probenNahme'),
//                 onOffStatusZpnWagen: $('#main-middle-item-zpnWagen'),
//                 // onOffStatusStorno: '',
//             }

//             var receivedSQLItems = data.successItem;

//             $detailsOpenButtonWrap.hasClass('transition') ? "" : $detailsOpenButtonWrap.add($mainContentMiddleWrap).addClass('transition');

//             $.map(receivedSQLItems, function (receivedSQLItemsValue, receivedSQLItemsKey) {
//                 $.map(toFillTimingSpansObject, function (toFillTimingSpansValue, toFillTimingSpansKey) {
//                     switch (toFillTimingSpansKey) {
//                         case receivedSQLItemsKey:
//                             toFillTimingSpansValue.html(receivedSQLItemsValue);
//                             delete toFillTimingSpansObject[toFillTimingSpansKey];
//                             delete receivedSQLItems[receivedSQLItemsKey];
//                             break;

//                     }
//                 });

//                 $.map(toFillStatusObject, function (statusObjectValue, statusObjectKey) {
//                     switch (statusObjectKey) {
//                         case receivedSQLItemsKey:
//                             statusObjectValue
//                                 .attr('value', receivedSQLItemsValue)
//                                 .removeClass('deactive')
//                                 .addClass('active');
//                             delete toFillStatusObject[statusObjectKey];
//                             delete receivedSQLItems[receivedSQLItemsKey];
//                             break;

//                         default:
//                     }
//                 });

//                 $.map(toFillOnOffStatusMiddleItems, function (statusMiddleButtonValue, statusMiddleButtonKey) {
//                     switch (statusMiddleButtonKey) {
//                         case receivedSQLItemsKey:
//                             statusMiddleButtonValue
//                                 .attr('value', receivedSQLItemsValue)
//                                 .removeClass('default started done restarted')
//                                 .addClass(receivedSQLItemsValue);
//                             delete toFillOnOffStatusMiddleItems[statusMiddleButtonKey];
//                             delete receivedSQLItems[receivedSQLItemsKey];
//                             break;

//                         default:
//                     }
//                 });
//             });

//         } else if (data.success === false) {
//             $headerInputField.effect('highlight', {
//                 color: '#FF3100'
//             }, 200);

//             switch (data.failCode) {
//                 case "no-entry":
//                     showFailMessage.failMessage('no-entry', 4000, data.failItem);
//                     console.log(data);
//                     break;

//                 case "42S02":
//                     showFailMessage.failMessage('no-table', 5000);
//                     console.log(data);
//                     break;

//                 case "42S22":
//                     showFailMessage.failMessage('no-tableField', 5000);
//                     console.log(data);
//                     break;

//                 case 1049:
//                     showFailMessage.failMessage('no-database', 5000);
//                     console.log(data);
//                     break;

//                 case 1044:
//                 case 1045:
//                     showFailMessage.failMessage('no-usernameOrPassword', 5000);
//                     console.log(data);
//                     break;

//                 default:
//                     showFailMessage.failMessage('fail-database', 5000);
//                     console.log(data);
//                     break;
//             }
//         }
//         $headerInputField.val('').focus();
//     });

//     ajaxRequest.fail(function (data) {
//         $headerInputField.effect('highlight', {
//             color: '#FF3100'
//         }, 200);
//         showFailMessage.failMessage('fail-database', 5000);
//     });
// }