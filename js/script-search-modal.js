'use strict';

//Leert alle Zeit Angaben der Verwaltungs Anzeige
function resetDetails() {
    const modalContentMainPullSqlItem = $('.modal__content__main__pullSql__item');
    const modalContentMainPullSqlItemGesamt = $('.modal__content__main__pullSql__item.gesamt');
    const modalContentCaptionSpan = $('.modal__content__caption__span');
    const modalContentAppendedSpan = $('.modal__footer__append__span__wrap');
    const modalHeaderInput = $('#modal-header-input');
    const modalPromtSlider = $('#modal-footer-promt-slider');
    const modalStatusItems = $('.modal__status');
    const modalFooterInput = $('#modal-footer-input');
    const modalAnEingang = $('#spanAnEingang');

    modalContentMainPullSqlItem.add(modalContentMainPullSqlItemGesamt).html('&#151');
    modalContentCaptionSpan.add(modalAnEingang).html('');
    modalContentAppendedSpan.remove();
    modalHeaderInput.add(modalHeaderInput).val('');
    modalPromtSlider.removeClass('transform__modal');
    modalStatusItems.each(function () {
        $(this)
            .val('deactive')
            .removeClass('statusButton-preSet disableMainRowButton setButtonStatus')
            .prop('disabled', false);
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
    const wrapModalFooter = $('#wrap-modal-footer');
    const modalPromtSlider = $('#modal-footer-promt-slider');
    const modalFooterContentWrap = $('#modal-footer-content-wrap');

    const showModal = (() => {
        imgSearch.on('click', function () {
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
                wrapModalContent.add(wrapModalFooter).add(modalPromtSlider).add(modalFooterContentWrap).removeClass('transform__modal');
                setTimeout(() => {
                    wrapModal.removeClass('show__modal');
                }, 300);

                backToInput();
            }
        });

        modalHeaderClose.on('click', function () {
            contentModal.toggleClass('transform__modal');
            wrapModalContent.add(wrapModalFooter).add(modalPromtSlider).add(modalFooterContentWrap).removeClass('transform__modal');
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
            requestDataSetComplete: probenNummer
        },
        dataType: 'json'
    });

    ajaxRequestObject.done(function (data) {
        const wrapModalContent = $('#wrap-modal-content');
        const wrapModalFooter = $('#wrap-modal-footer');
        const modalHeaderInput = $('#modal-header-input');
        const modalFooterSpanWrap = $('#modal-footer-span-wrap');

        if (Object.keys(data).every((key) => data[key])) {
            resetDetails();
            const toFillItems = {
                base: {
                    probenNummer: $('#modal-content-caption-nummber-text'),
                    sollDatum: $('#modal-content-caption-soll-text')
                },
                date: {
                    anLfgbAbteilungEingangDate: $('#modal-pullSql-abteilungEingang-date'),
                    anTextilAbteilungEingangDate: $('#modal-pullSql-abteilungEingang-date'),
                    beurteilungBereitgestelltDateTime: $('#pullSql-beurteilung-date'),
                    einwaageBeginn: $('#pullSql-einwaage-start-date'),
                    einwaageEnde: $('#pullSql-einwaage-ende-date'),
                    klaerfallBeginnDateTime: $('#pullSql-klaerfall-start-date'),
                    klaerfallEndeDateTime: $('#pullSql-klaerfall-ende-date'),
                    manaEinwaageDateTime: $('#pullSql-mEinwaage-ende-date'),
                    manaErhaltenDateTime: $('#pullSql-mErhalten-ende-date'),
                    manaGestelltDateTime: $('#pullSql-mBestellt-start-date'),
                    manaZpnWagenDateTime: $('#pullSql-mWagen-ende-date'),
                    nickelRueckgabeDateTime: $('#modal-pullSql-nickelBack-date'),
                    zerlegungEnde: $('#pullSql-zerlegung-ende-date'),
                    zerlegungStart: $('#pullSql-zerlegung-start-date'),
                    zpnEingangDateTime: $('#modal-pullSql-zpnEingang-date'),
                    zpnWagenDateTime: $('#pullSql-zpnWagen-date')
                },
                time: {
                    anLfgbAbteilungEingangTime: $('#modal-pullSql-abteilungEingang-time'),
                    anTextilAbteilungEingangTime: $('#modal-pullSql-abteilungEingang-time'),
                    beurteilungBereitTime: $('#pullSql-beurteilung-time'),
                    eingangTime: $('#modal-pullSql-zpnEingang-time'),
                    einwaageBeginnTime: $('#pullSql-einwaage-start-time'),
                    einwaageEndeTime: $('#pullSql-einwaage-ende-time'),
                    klaerfallBeginnTime: $('#pullSql-klaerfall-start-time'),
                    klaerfallEndeTime: $('#pullSql-klaerfall-ende-time'),
                    manaEinwaageTime: $('#pullSql-mEinwaage-ende-time'),
                    manaErhaltenTime: $('#pullSql-mErhalten-ende-time'),
                    manaGestelltTime: $('#pullSql-mBestellt-start-time'),
                    manaZpnWagenTime: $('#pullSql-mWagen-ende-time'),
                    nickelRueckgabeTime: $('#modal-pullSql-nickelBack-time'),
                    zerlegungStartTime: $('#pullSql-zerlegung-start-time'),
                    zerlegungEndeTime: $('#pullSql-zerlegung-ende-time'),
                    zpnMusterEingangTime: $('#modal-pullSql-zpnEingang-time'),
                    zpnWagenTime: $('#pullSql-zpnWagen-time')
                },
                berechnung: {
                    anLfgbAbteilungBerechnung: $('#pullSql-gesamt-beurteilung'),
                    anTextilAbteilungBerechnung: $('#pullSql-gesamt-beurteilung'),
                    beurteilungZpnBerechnung: $('#pullSql-gesamt-beurteilung'),
                    beurteilungAbteilungBerechnung: $('#pullSql-gesamt-anAbteilung'),
                    berechnungDateTimeZpnwagen: $('#pullSql-gesamt-zpnDauer'),
                    einwaageBerechnung: $('#pullSql-gesamt-einwaage'),
                    klaerfallBerechnung: $('#pullSql-gesamt-klaerfall'),
                    manaBerechnungDateTimeAnfrage: $('#pullSql-gesamt-mBestellung'),
                    manaBerechnungDateTimeEinwaage: $('#pullSql-gesamt-mEinwaage'),
                    manaBerechnungDateTimeGesamt: $('#pullSql-gesamt-mGesamt'),
                    nickelBerechnung: $('#pullSql-gesamt-nickelDauer'),
                    zerlegungBerechnung: $('#pullSql-gesamt-zerlegung')
                },
                status: {
                    mit60g: $('#mit60g'),
                    mitExpress: $('#mitExpress'),
                    mitIntern: $('#mitIntern'),
                    mitKlaerfallBack: $('#mitKlaerfallBack'),
                    mitLfgb: $('#mitLfgb'),
                    mitNickel: $('#mitNickel'),
                    mitToys: $('#mitToys'),
                    anAbteilung: $('.spanAnEingang'),
                },
                kommentar: {
                    kommentarDate: $('#modal-footer-span-date'),
                    kommentarText: $('#modal-footer-span-text'),
                    kommentarTime: $('#modal-footer-span-time')
                },
                verwaltungItems: {
                    klaerfallBeginnDateTime: $('#klaerfallBeginn'),
                    klaerfallEndeDateTime: $('#klaerfallEnde'),
                    manaGestelltDateTime: $('#manaBestellt'),
                    manaErhaltenDateTime: $('#manaErhalten'),
                    manaEinwaageDateTime: $('#manaEinwaage'),
                    manaZpnWagenDateTime: $('#manaEingewogen'),
                    zerlegungStart: $('#zerlegungStart'),
                    zerlegungEnde: $('#zerlegungEnde'),
                    einwaageBeginn: $('#einwaageStart'),
                    einwaageEnde: $('#einwaageEnde'),
                    zpnWagenDateTime: $('#zpnWagen'),
                }
            };
            const modalVerwaltungItems = {
                einwaageBeginn: $("#einwaageStart"),
                einwaageEnde: $("#einwaageEnde"),
                klaerfallBeginnDateTime: $("#klaerfallBeginn"),
                klaerfallEndeDateTime: $("#klaerfallEnde"),
                manaEinwaageDateTime: $("#manaEinwaage"),
                manaErhaltenDateTime: $("#manaErhalten"),
                manaGestelltDateTime: $("#manaBestellt"),
                manaZpnWagenDateTime: $("#manaEingewogen"),
                zerlegungStart: $('#zerlegungStart'),
                zerlegungEnde: $("#zerlegungEnde"),
                zpnWagenDateTime: $("#zpnWagen")
            };

            // Befüllt das Kommentarfeld
            function setKommentar(kommentarItem) {
                const modalKommentarSpanWrap = $('#modal-footer-span-wrap');
                const prependKommentar = (
                    ' <div class="modal__footer__append__span__wrap"> ' +
                    '     <span class="modal__append__span / text"> ' + kommentarItem.kommentarText + ' ' +
                    '         <span class="modal__append__span / dateTime">' + kommentarItem.kommentarDate + '</span> ' +
                    '         <span class="modal__append__span / dateTime">' + kommentarItem.kommentarTime + " Uhr" + ' Uhr</span> ' +
                    '     </span> ' +
                    ' </div> '
                );
                modalKommentarSpanWrap.prepend(prependKommentar);
            }

            $.each(data.base, (basicKey, basicValue) => {
                $.each(toFillItems.base, (toFillBasicKey, toFillBasicValue) => {
                    if (basicKey === toFillBasicKey) {
                        toFillBasicValue.html(basicValue);
                        return false;
                    }
                });
            });
            $.each(data.status, (statusKey, statusValue) => {
                $.each(toFillItems.status, (toFillStatusKey, toFillStatusValue) => {
                    if (statusKey === toFillStatusKey) {
                        toFillStatusValue.val(statusValue).addClass('statusButton-preSet');
                        statusKey === 'anAbteilung' ? toFillStatusValue.html(statusValue) : '';
                        return false;
                    }
                });
            });
            $.each(data.date, (dateKey, dateValue) => {
                $.each(toFillItems.date, (toFillDateKey, toFillDateValue) => {
                    if (dateKey === toFillDateKey) {
                        toFillDateValue.html(dateValue);
                        return false;
                    }
                });
                $.each(toFillItems.verwaltungItems, (toFillverwaltungItemsKey, toFillverwaltungItemsValue) => {
                    if (dateKey === toFillverwaltungItemsKey) {
                        toFillverwaltungItemsValue.val(dateValue).addClass('disableMainRowButton setButtonStatus').prop('disabled', true);
                        $.each(modalVerwaltungItems, function (itemKey) {
                            itemKey === dateKey ? setButtonStatus(modalVerwaltungItems, itemKey) : "";
                        });
                        return false;
                    }
                });
            });
            $.each(data.time, (timeKey, timeValue) => {
                $.each(toFillItems.time, (toFillTimeKey, toFillTimeValue) => {
                    if (timeKey === toFillTimeKey) {
                        toFillTimeValue.html(timeValue + ' Uhr');
                        return false;
                    }
                });
            });
            $.each(data.berechnung, (berechnungKey, berechnungValue) => {
                $.each(toFillItems.berechnung, (toFillBerechnungKey, toFillBerechnungValue) => {
                    if (berechnungKey === toFillBerechnungKey) {
                        toFillBerechnungValue.html(berechnungValue + ' Std.');
                        return false;
                    }
                });
            });
            $.each(data.kommentar, function (dataKey, dataValue) {
                setKommentar(dataValue);
            });

            document.getElementById('modal-footer-span-wrap').childElementCount >= 4 ? modalFooterSpanWrap.css('overflow-y', 'scroll') : modalFooterSpanWrap.css('overflow-y', '');

            wrapModalContent.hasClass('transform__modal') === true ? wrapModalContent.add(wrapModalFooter).removeClass('transform__modal') : '';

            setTimeout(() => {
                modalHeaderInput.val('');
                wrapModalContent.add(wrapModalFooter).addClass('transform__modal');
            }, 400);

            showCloseModal.backToModalInput;

        } else if (Object.keys(data).every((key) => !data[key])) {
            showFailMessage.failMessage('fail-input-no-dataset', 1500, modalHeaderInput.attr('id'));
            showCloseModal.backToModalInput;

        } else if (data.failCode === 2002) {
            showFailMessage.failMessage('fail-connect', 3000, modalHeaderInput.attr('id'));
            showCloseModal.backToModalInput;
        }
    });

    ajaxRequestObject.fail(function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
        const modalHeaderInput = $('#modal-header-input');
        //Blendet für 6 sek. eine "Verbindung Fehlgeschlagen" auskunft ein.
        showFailMessage.failMessage('fail-connect', 3000, modalHeaderInput.attr('id'));
        showCloseModal.backToModalInput;
    });
}

// In einem aufgerufenen Datensatz kann nachträglich der "Proben Status" geändert werden,
// hier wird der gesetzte Status abgefragt und dann in der Datenbank geändert.
const updateStatusButton = () => {
    const modalStatusButton = $('.modal__status');

    modalStatusButton.on('click', function () {
        const probenNummer = $('#modal-content-caption-nummber-text').html();
        const sollDatum = $('#modal-content-caption-soll-text').html();
        let setButton = $(this);
        let statusButtonID = $(this).attr('id');
        let statusButtonValue = $(this).attr('value');

        const modalVerwaltungStatus = {
            mit60g: $('#mit60g'),
            mitExpress: $('#mitExpress'),
            mitIntern: $('#mitIntern'),
            mitKlaerfallBack: $('#mitKlaerfallBack'),
            mitLfgb: $('#mitLfgb'),
            mitNickel: $('#mitNickel'),
            mitToys: $('#mitToys'),
            anAbteilung: $('#spanAnEingang')
        };

        const modalVerwaltungVorbereitung = {
            zerlegungStart: $('#zerlegungStart').attr('value'),
            zerlegungEnde: $('#zerlegungEnde').attr('value'),
            einwaageBeginn: $('#einwaageStart').attr('value'),
            einwaageEnde: $('#einwaageEnde').attr('value'),
            zpnWagen: $('#zpnWagen').attr('value'),
            klaerfallBeginn: $('#klaerfallBeginn').attr('value'),
            klaerfallEnde: $('#klaerfallEnde').attr('value'),
            manaBestellt: $('#manaBestellt').attr('value'),
            manaErhalten: $('#manaErhalten').attr('value'),
            manaEinwaage: $('#manaEinwaage').attr('value'),
            manaEingewogen: $('#manaEingewogen').attr('value')
        };

        let sendData = {
            probenNummer: probenNummer,
            sollDatum: sollDatum,
            statusButtonID: statusButtonID,
            statusButtonValue: statusButtonValue
        }

        if (sendData.statusButtonValue === 'active') {
            sendData.statusButtonValue = 'deactive'
        } else if (sendData.statusButtonValue === 'deactive') {
            sendData.statusButtonValue = 'active'
        }

        if (sendData.statusButtonID in modalVerwaltungStatus) {
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
                showFailMessage.failMessage('fail-connect', 3000, modalHeaderInput.attr('id'));
                console.log(textStatus, errorThrown);
            });
        }

        if (sendData.statusButtonID in modalVerwaltungVorbereitung) {

            statusButtonValue === 'deactive' ? statusButtonValue = 'active' : statusButtonValue = 'deactive';

            sendData[statusButtonID] = statusButtonValue;

            const sendPack = []
            sendPack.push(sendData);

            const ajaxRequestUpdate = $.ajax({
                url: "../php/db-update.php",
                method: "POST",
                data: {
                    updateDataSet: sendPack
                },
                dataType: "json"
            });

            ajaxRequestUpdate.done(function (data) {

                const modalVerwaltungItems = {
                    einwaageBeginn: $("#einwaageStart"),
                    einwaageEnde: $("#einwaageEnde"),
                    klaerfallBeginnDateTime: $("#klaerfallBeginn"),
                    klaerfallEndeDateTime: $("#klaerfallEnde"),
                    manaEinwaageDateTime: $("#manaEinwaage"),
                    manaErhaltenDateTime: $("#manaErhalten"),
                    manaGestelltDateTime: $("#manaBestellt"),
                    manaZpnWagenDateTime: $("#manaEingewogen"),
                    zerlegungStart: $('#zerlegungStart'),
                    zerlegungEnde: $("#zerlegungEnde"),
                    zpnWagenDateTime: $("#zpnWagen")
                };

                setButton.prop('disabled', true).addClass('disableMainRowButton setButtonStatus');
                statusButtonValue = 'active';
                Object.entries(modalVerwaltungItems).forEach(([itemKey, itemValue]) => {
                    itemValue.attr('id') === statusButtonID ? setButtonStatus(modalVerwaltungItems, itemKey) : "";
                });
            });

            ajaxRequestUpdate.fail(function (jqXHR, textStatus, errorThrown) {
                const modalHeaderInput = $('#modal-header-input');
                //Blendet für 6 sek. eine "Verbindung Fehlgeschlagen" auskunft ein.
                showFailMessage.failMessage('fail-connect', 3000, modalHeaderInput.attr('id'));
                console.log(textStatus, errorThrown);
            });
        }
    });
}

// Nach einer Prüfung wird der enstprechende Kommentar dem Datensatz hinzugefüht und auch direkt mit angezeigt.
const updateKommentar = () => {
    const modalKommentarInput = $('#modal-footer-input');
    const modalPromtSlider = $('#modal-footer-promt-slider');
    const modalPromtConfirm = $('#modal-promt-confirm');
    const modalPromtCancel = $('#modal-promt-cancel');
    let probenNummer = $('#modal-content-caption-nummber-text');

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
                const modalFooterSpanWrap = $('#modal-footer-span-wrap');
                const prependKommentar = (
                    ' <div class="modal__footer__append__span__wrap"> ' +
                    '     <span class="modal__append__span / text"> ' + data.kommentarText + ' ' +
                    '         <span class="modal__append__span / dateTime">' + data.kommentarDate + '</span> ' +
                    '         <span class="modal__append__span / dateTime">' + data.kommentarTime + ' Uhr</span> ' +
                    '     </span> ' +
                    ' </div> '
                );
                modalFooterSpanWrap.prepend(prependKommentar);
                modalKommentarInput.val('');
                document.getElementById('modal-footer-span-wrap').childElementCount >= 4 ? modalFooterSpanWrap.css('overflow-y', 'scroll') : modalFooterSpanWrap.css('overflow-y', '');
                modalPromtSlider.removeClass('transform__modal');
            } else if (data.success === false && data.failCode === 999) {
                const modalHeaderInput = $('#modal-header-input');
                modalPromtSlider.removeClass('transform__modal');
                modalKommentarInput.val('');
                showFailMessage.failMessage('fail-forbidden', 3000, modalHeaderInput.attr('id'));
            }
        });

        ajaxRequestAddKommentar.fail((jqXHR, textStatus, errorThrown) => {
            const modalHeaderInput = $('#modal-header-input');
            //Blendet für 6 sek. eine "Verbindung Fehlgeschlagen" auskunft ein.
            showFailMessage.failMessage('fail-connect', 3000, modalHeaderInput.attr('id'));
            console.log(textStatus, errorThrown);
        });
    });
}
