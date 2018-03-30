'use strict'
/// <reference path="../typings/globals/jquery/index.d.ts" />

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
            .val('deactive')
            .removeClass('statusButton-preSet');
    });
}

const showCloseModal = (() => {
    const indexModal = $('#wrap-modal').add('#content-modal');
    const imgSearch = $('#img-search');
    const wrapModal = $('#wrap-modal');
    const modalHeaderClose = $('#modal-header-close');
    const modalHeaderInput = $('#modal-header-input');
    const wrapModalContent = $('#wrap-modal-content');
    const showModal = (() => {
        imgSearch.on('click', function (event) {
            resetDetails();
            indexModal.toggleClass('show-modal');
            backToModalInput();
        });
    });
    const closeModal = (() => {
        wrapModal.on('click', function (event) {
            if (event.target == event.currentTarget) {
                indexModal.toggleClass('show-modal');
                wrapModalContent.removeClass('transform__modal__down');
                backToInput();
            }
        });
        modalHeaderClose.on('click', function () {
            indexModal.toggleClass('show-modal');
            wrapModalContent.removeClass('transform__modal__down');
            backToInput();
        });
    });
    const backToModalInput = (() => {
        setTimeout(() => {
            modalHeaderInput.focus();
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
        const wrapModalContent = $('#wrap-modal-content');
        const modalHeaderInput = $('#modal-header-input');
        if (data !== false && !data.hasOwnProperty(0)) {
            resetDetails();
            wrapModalContent.hasClass('transform__modal__down') === true ? wrapModalContent.removeClass('transform__modal__down') : '';
            setTimeout(() => {
                modalHeaderInput.val('');
                wrapModalContent.addClass('transform__modal__down');
            }, 400);
            const toFillTimingSpansValue = {
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
                klaerfallBerechnung: $('#pullSql-gesamt-klaerfall'),
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
                manaZpnWagenDate: $('#pullSql-mWagen-ende-date'),
                manaZpnWagenTime: $('#pullSql-mWagen-ende-time'),
                nickelBerechnung: $('#pullSql-gesamt-nickelDauer'),
                nickelRueckgabeDate: $('#modal-pullSql-nickelBack-date'),
                nickelRueckgabeTime: $('#modal-pullSql-nickelBack-time'),
                probenNummer: $('#modal-content-caption-nummber-text'),
                sollDatum: $('#modal-content-caption-soll-text'),
                // stornoDate: $('#'),
                // stornoTime: $('#'),
                zerlegungBerechnung: $('#pullSql-gesamt-zerlegung'),
                zerlegungEndeDate: $('#pullSql-zerlegung-ende-date'),
                zerlegungEndeTime: $('#pullSql-zerlegung-ende-time'),
                zerlegungStartDate: $('#pullSql-zerlegung-start-date'),
                zerlegungStartTime: $('#pullSql-zerlegung-start-time'),
                zpnWagenDate: $('#pullSql-zpnWagen-date'),
                zpnWagenTime: $('#pullSql-zpnWagen-time')
            }
            const toFillStatusButton = {
                mit60g: $('#mit60g'),
                mitExpress: $('#mitExpress'),
                mitIntern: $('#mitIntern'),
                mitKlaerfallBack: $('#mitKlaerfallBack'),
                mitLfgb: $('#mitLfgb'),
                mitNickel: $('#mitNickel'),
                mitToys: $('#mitToys')
            }

            function setStatus(literalObject, itemKey, dataValue) {
                switch (literalObject) {
                    case toFillTimingSpansValue:
                        literalObject[itemKey]
                            .html(dataValue);
                        break;
                    case toFillStatusButton:
                        if (dataValue == 'active') {
                            literalObject[itemKey]
                                .addClass('statusButton-preSet')
                                .val('active');
                        }
                        break;
                    default:
                }
            }
            $.each(data, function (dataKey, dataValue) {
                $.each(toFillTimingSpansValue, (itemKey, itemValue) => {
                    switch (dataKey) {
                        case itemKey:
                            setStatus(toFillTimingSpansValue, itemKey, dataValue);
                            break;
                        default:
                    }
                });
                $.each(toFillStatusButton, (itemKey, itemValue) => {
                    switch (dataKey) {
                        case itemKey:
                            setStatus(toFillStatusButton, itemKey, dataValue);
                            break;
                        default:
                    }
                });
            });
            showCloseModal.backToModalInput;
        } else if (data === false) {
            showFailMessage.failMessage('fail-input', 2000, modalHeaderInput.attr('id'));
            showCloseModal.backToModalInput;
        } else if (data.hasOwnProperty(0)) {
            showFailMessage.failMessage('fail-connect', 8000, modalHeaderInput.attr('id'));
            showCloseModal.backToModalInput;
        }
    });
    ajaxRequestObject.fail(function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
        const modalHeaderInput = $('#modal-header-input');
        //Blendet für 6 sek. eine "Verbindung Fehlgeschlagen" auskunft ein.
        showFailMessage.failMessage('fail-connect', 8000, modalHeaderInput.attr('id'));
        showCloseModal.backToModalInput;
    });
}

const updateStatusButton = () => {
    const modalStatusButton = $('.modal__status');
    modalStatusButton.on('click', function () {
        const probenNummer = $('#modal-content-caption-nummber-text').html();
        let statusButtonID = $(this).attr('id');
        let statusButtonValue = $(this).attr('value');
        const statusButtonObject = {
            mit60g: $('#mit60g'),
            mitExpress: $('#mitExpress'),
            mitIntern: $('#mitIntern'),
            mitKlaerfallBack: $('#mitKlaerfallBack'),
            mitLfgb: $('#mitLfgb'),
            mitNickel: $('#mitNickel'),
            mitToys: $('#mitToys')
        }
        let sendData = {
            probenNummer: probenNummer,
            statusButtonID: statusButtonID,
            statusButtonValue: statusButtonValue
        }
        if (sendData.statusButtonValue === 'active') {
            sendData.statusButtonValue = 'deactive'
        } else if (sendData.statusButtonValue === 'deactive') {
            sendData.statusButtonValue = 'active'
        }
        const ajaxRequestStatusButton = $.ajax({
            url: '../php/db-modalStatusUpdate.php',
            method: 'POST',
            data: {
                updateModalStatus: sendData
            },
            dataType: 'json'
        });
        ajaxRequestStatusButton.done((data) => {
            if (data.success === true && data.successItem === probenNummer) {
                this.id = data.statusButtonID;
                this.value = data.statusButtonValue;
                $(this).toggleClass('statusButton-preSet');
            }
        });
        ajaxRequestStatusButton.fail((jqXHR, textStatus, errorThrown) => {});
    });
}

const updateKommentar = () => {
    const modalKommentarSendButton = $('#');
    const modalKommentarInput = $('#modal-content-footer-input');
    const test = $('#modal-');
    console.log(modalKommentarInput);
}


$(document).ready(function () {
    updateStatusButton();
});