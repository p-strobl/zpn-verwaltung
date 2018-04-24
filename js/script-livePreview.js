'use strict';

document.addEventListener('DOMContentLoaded', function () {

    //
    //Ajax call
    function updatePreview() {
        const ajaxRequestPreview = $.ajax({
            url: '../php/db-request-PreView-Items.php',
            dataType: 'json'
        });

        ajaxRequestPreview.done((receivedPreviewItems) => {
            const toFillPreviewItems = {
                lfgbAnzahl: $('#daily-lfgb'),
                textilAnzahl: $('#daily-Textil'),
                zpnAnzahl: $('.daily-zpn'),
                zpnKlaerfaelle: $('#panel-zpnKlaerfall'),
                zpnMustereingang: $('#panel-zpnMusterEingang'),
                zpnWagen: $('#panel-zpnWagen')
            };

            //
            //Fügt nach dem Page reload die gespeicherten Werte in die entsprechenden html Elemente ein
            $('#daily-lfgb').html(localStorage.getItem('lfgbAnzahl'));
            $('#daily-Textil').html(localStorage.getItem('textilAnzahl'));
            $('#daily-zpn').html(localStorage.getItem('zpnAnzahl'));
            $('#panel-zpnKlaerfall').html(localStorage.getItem('zpnKlaerfaelle'));
            $('#panel-zpnMusterEingang').html(localStorage.getItem('zpnMustereingang'));
            $('#zpnWagen').html(localStorage.getItem('zpnWagen'));

            //
            //Fügt die aus dem Ajax call erhaltenen Werte, wenn nicht schon im localStorage identisch in die entpsprechenden html Elemente ein
            Object.entries(receivedPreviewItems).forEach(([receivedKey, receivedValue]) => {
                Object.entries(toFillPreviewItems).forEach(([toFillKey, toFillValue]) => {
                    if (receivedKey === toFillKey && receivedValue != localStorage.getItem(toFillKey)) {
                        toFillValue.html(receivedValue);
                        toFillValue.parent().effect('highlight', { color: '#FFB700' }, 200);;
                    }
                });
            });

        });

        ajaxRequestPreview.fail((jqXHR, textStatus, errorThrown) => {
            console.log(textStatus, errorThrown);
        });
    }

    //
    //Speichert vor dem Page reload die angezeigten Werte im localStorage
    window.onbeforeunload = function () {
        localStorage.setItem("lfgbAnzahl", $('#daily-lfgb').html());
        localStorage.setItem("textilAnzahl", $('#daily-Textil').html());
        localStorage.setItem("zpnAnzahl", $('#daily-zpn').html());
        localStorage.setItem("zpnKlaerfaelle", $('#panel-zpnKlaerfall').html());
        localStorage.setItem("zpnMustereingang", $('#panel-zpnMusterEingang').html());
        localStorage.setItem("zpnWagen", $('#panel-zpnWagen').html());
    }

    updatePreview();

});