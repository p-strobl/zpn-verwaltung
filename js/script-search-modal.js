'use strict'
/// <reference path="../typings/globals/jquery/index.d.ts" />

//Leert alle Zeit Angaben der Verwaltungs Anzeige
function resetDetails() {
    const modalContentMainPullSqlItem = $('.modal__content__main__pullSql__item');
    const modalContentCaptionSpan = $('.modal__content__caption__span');
    const modalContentAppendedSpan = $('.modal__content__footer__append__span__wrap');
    const modalPromtSlider = $('#modal-content-footer-promt-slider');
    const modalStatusItems = $('.modal__status');
    const modalFooterInput = $('#modal-content-footer-input');

    modalContentMainPullSqlItem.html(' - ');
    modalContentCaptionSpan.html('');
    modalContentAppendedSpan.remove();
    modalFooterInput.val('');
    modalPromtSlider.removeClass('transform__modal');
    modalStatusItems.each(function () {
        $(this)
            .val('deactive')
            .removeClass('statusButton-preSet');
    });
}

// Schließt das Search Modal Fenster durch klick auf das X oder ausserhalb des bereiches und führt dann die Funktion resetDetails(); aus
const showCloseModal = (() => {
    const imgSearch = $('#img-search');
    const wrapModal = $('#wrap-modal');
    const contentModal = $('#content-modal');
    const modalHeaderClose = $('#modal-header-close');
    const modalHeaderInput = $('#modal-header-input');
    const wrapModalContent = $('#wrap-modal-content');
    const modalPromtSlider = $('#modal-content-footer-promt-slider');
    const modalFooterInputWrap = $('.modal__content__footer__input__wrap');
    const modalFooterContentWrap = $('#modal-content-footer-content-wrap');

    const showModal = (() => {
        imgSearch.on('click', function (event) {
            resetDetails();
            wrapModal.addClass('show__modal');
            contentModal.toggleClass('transform__modal');
            backToModalInput();
        });
    });

    const closeModal = (() => {
        wrapModal.on('click', function (event) {
            if (event.target == event.currentTarget) {
                contentModal.toggleClass('transform__modal');
                wrapModalContent.add(modalPromtSlider).add(modalFooterInputWrap).add(modalFooterContentWrap).removeClass('transform__modal');
                setTimeout(() => {
                    wrapModal.removeClass('show__modal');
                }, 300);

                backToInput();
            }
        });

        modalHeaderClose.on('click', function () {
            contentModal.toggleClass('transform__modal');
            wrapModalContent.add(modalPromtSlider).add(modalFooterInputWrap).add(modalFooterContentWrap).removeClass('transform__modal');
            setTimeout(() => {
                wrapModal.removeClass('show__modal');
            }, 300);
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

// Übernimmt die geprüfte Input Eingabe und macht eine Datenbank Abfrag zu der gesuchten Nummer.
// Wenn erfolgreich, werden alle ensptechenden Felder gefüllt.
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
        const modalFooterInputWrap = $('.modal__content__footer__input__wrap');
        const modalFooterContentWrap = $('#modal-content-footer-content-wrap');

        if (data !== false && !data.hasOwnProperty(0)) {
            resetDetails();
            wrapModalContent.hasClass('transform__modal') === true ? wrapModalContent.removeClass('transform__modal') : '';
            setTimeout(() => {
                modalHeaderInput.val('');
                wrapModalContent.add(modalFooterInputWrap).add(modalFooterContentWrap).addClass('transform__modal');
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
                klaerfallBeginnDate: $('#pullSql-klaerfall-start-date'),
                klaerfallBeginnTime: $('#pullSql-klaerfall-start-time'),
                klaerfallBerechnung: $('#pullSql-gesamt-klaerfall'),
                klaerfallEndeDate: $('#pullSql-klaerfall-ende-date'),
                klaerfallEndeTime: $('#pullSql-klaerfall-ende-time'),
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

            const toFillKommentar = {
                kommentarDate: $('#modal-content-footer-span-date'),
                kommentarText: $('#modal-content-footer-span-text'),
                kommentarTime: $('#modal-content-footer-span-time'),
            }

            // Befüllt die Status Button's
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

            // Befüllt das Kommentarfeld
            function setKommentar(kommentarItem) {
                const modalKommentarSpanWrap = $('#modal-content-footer-span-wrap');
                const prependKommentar = (
                    ' <div class="modal__content__footer__append__span__wrap"> ' +
                    '     <span class="modal__append__span / text"> ' + kommentarItem.kommentarText + ' ' +
                    '         <span class="modal__append__span / dateTime">' + kommentarItem.kommentarDate + '</span> ' +
                    '         <span class="modal__append__span / dateTime">' + kommentarItem.kommentarTime + " Uhr" + ' Uhr</span> ' +
                    '     </span> ' +
                    ' </div> '
                );
                modalKommentarSpanWrap.prepend(prependKommentar);
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
            $.each(data.kommentar, function (dataKey, dataValue) {
                setKommentar(dataValue);
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

// In einem aufgerufenen Datensatz kann nachträglich der "Proben Status" geändert werden,
// hier wird der gesetzte Status abgefragt und dann in der Datenbank geändert.
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

        ajaxRequestStatusButton.fail((jqXHR, textStatus, errorThrown) => {
            const modalHeaderInput = $('#modal-header-input');
            //Blendet für 6 sek. eine "Verbindung Fehlgeschlagen" auskunft ein.
            showFailMessage.failMessage('fail-connect', 8000, modalHeaderInput.attr('id'));
            console.log(textStatus, errorThrown);
        });
    });
}

// Nach einer Prüfung wird der enstprechende Kommentar dem Datensatz hinzugefüht und auch direkt mit angezeigt.
const updateKommentar = () => {
    const modalKommentarInput = $('#modal-content-footer-input');
    const modalPromtSlider = $('#modal-content-footer-promt-slider');
    const modalPromtConfirm = $('#modal-promt-confirm');
    const modalPromtCancel = $('#modal-promt-cancel');
    let probenNummer = $('#modal-content-caption-nummber-text');
    let modalTextContent = $('#modal-content-footer-span-text');
    let modalTextDate = $('#modal-content-footer-span-date');
    let modalTextTime = $('#modal-content-footer-span-time');

    modalKommentarInput.on('keyup', function (pressedKey) {
        if (pressedKey.keyCode === 13 && this.value != '') {
            modalPromtSlider.addClass('transform__modal');
            modalPromtConfirm.focus();
        }
    });

    modalPromtCancel.on('click', () => {
        modalPromtSlider.removeClass('transform__modal');
    });

    modalPromtConfirm.on('click', () => {
        const sendData = {
            probenNummer: probenNummer.html(),
            modalKommentarText: modalKommentarInput.val()
        }
        const ajaxRequestAddKommentar = $.ajax({
            url: '../php/db-modalAddComment.php',
            method: 'POST',
            data: {
                updateAddKommentar: sendData
            },
            dataType: 'json'
        });

        ajaxRequestAddKommentar.done((data) => {
            if (data.success === true && data.successItem === probenNummer.html()) {
                const modalKommentarSpanWrap = $('#modal-content-footer-span-wrap');
                const prependKommentar = (
                    ' <div class="modal__content__footer__append__span__wrap"> ' +
                    '     <span class="modal__append__span / text"> ' + data.kommentarText + ' ' +
                    '         <span class="modal__append__span / dateTime">' + data.kommentarDate + '</span> ' +
                    '         <span class="modal__append__span / dateTime">' + data.kommentarTime + " Uhr" + ' Uhr</span> ' +
                    '     </span> ' +
                    ' </div> '
                );
                modalKommentarSpanWrap.prepend(prependKommentar);
                modalKommentarInput.val('');
                modalPromtSlider.removeClass('transform__modal');
            } else if (data.success === false && data.failCode === 999) {
                const modalHeaderInput = $('#modal-header-input');
                modalPromtSlider.removeClass('transform__modal');
                modalKommentarInput.val('');
                showFailMessage.failMessage('fail-forbidden', 8000, modalHeaderInput.attr('id'));
            }
        });

        ajaxRequestAddKommentar.fail((jqXHR, textStatus, errorThrown) => {
            const modalHeaderInput = $('#modal-header-input');
            //Blendet für 6 sek. eine "Verbindung Fehlgeschlagen" auskunft ein.
            showFailMessage.failMessage('fail-connect', 8000, modalHeaderInput.attr('id'));
            console.log(textStatus, errorThrown);
        });
    });
}

$(document).ready(function () {
    updateStatusButton();
    updateKommentar();
});