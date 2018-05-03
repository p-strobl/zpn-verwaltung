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
                zpnAnzahl: $('.itemZPN'),
                zpnPanelAnzahl: $('#panel-zpn'),
                zpnKlaerfaelle: $('#panel-zpnKlaerfall'),
                zpnMustereingang: $('#panel-zpnMusterEingang'),
                zpnWagen: $('#panel-zpnWagen')
            };

            //
            //Fügt nach dem Page reload die gespeicherten Werte in die entsprechenden html Elemente ein
            localStorage.getItem('lfgbAnzahl') == 0 ? $('#daily-lfgb').html(0) : $('#daily-lfgb').html(localStorage.getItem('lfgbAnzahl'));
            localStorage.getItem('textilAnzahl') == 0 ? $('#daily-Textil').html(0) : $('#daily-Textil').html(localStorage.getItem('textilAnzahl'));
            localStorage.getItem('zpnAnzahl') == 0 ? $('#daily-zpn').add($('#panel-zpn')).html(0) : $('#daily-zpn').add($('#panel-zpn')).html(localStorage.getItem('zpnAnzahl'));
            localStorage.getItem('zpnKlaerfaelle') == 0 ? $('#panel-zpnKlaerfall').html(0) : $('#panel-zpnKlaerfall').html(localStorage.getItem('zpnKlaerfaelle'));
            localStorage.getItem('zpnMustereingang') == 0 ? $('#panel-zpnMusterEingang').html(0) : $('#panel-zpnMusterEingang').html(localStorage.getItem('zpnMustereingang'));
            localStorage.getItem('zpnWagen') == 0 ? $('#panel-zpnWagen').html(0) : $('#panel-zpnWagen').html(localStorage.getItem('zpnWagen'));

            //
            //Fügt die aus dem Ajax call erhaltenen Werte, wenn nicht schon im localStorage identisch in die entpsprechenden html Elemente ein
            Object.entries(receivedPreviewItems).forEach(([receivedKey, receivedValue]) => {
                Object.entries(toFillPreviewItems).forEach(([toFillKey, toFillValue]) => {
                    if (receivedKey === toFillKey && receivedValue != localStorage.getItem(toFillKey)) {
                        toFillValue.html(receivedValue);
                        toFillValue.parent().css({ 'backgroundColor': '#ffb700' })
                    }
                });
            });
        });


        //
        //Fügt die aus dem Ajax call erhaltenen Werte, wenn nicht schon im localStorage identisch in die entpsprechenden html Elemente ein
        // Object.entries(receivedPreviewItems).forEach(([receivedKey, receivedValue]) => {
        //     receivedValue < 0 ? receivedValue = 0 : '';
        //     Object.entries(toFillPreviewItems).forEach(([toFillKey, toFillValue]) => {
        //         if (receivedKey === toFillKey && receivedValue != localStorage.getItem(toFillKey)) {
        //             toFillValue.html(receivedValue);
        //             if (receivedValue > localStorage.getItem(toFillKey)) {
        //                 toFillValue.html(receivedValue);
        //                 toFillValue.parent().css({ 'backgroundColor': '#ffb700' })
        //             } else {
        //                 toFillValue.html(receivedValue);
        //                 toFillValue.parent().css({ 'backgroundColor': '#ff3300' })
        //             }
        //         }
        //     });
        // });


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