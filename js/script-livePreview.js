'use strict';

document.addEventListener('DOMContentLoaded', function () {

    var sse = new EventSource('../php/db-request-PreView-Items.php');

    //
    //Ajax call
    // function updatePreview() {
    //     const ajaxRequestPreview = $.ajax({
    //         url: '../php/db-request-PreView-Items.php',
    //         dataType: 'json'
    //     });

    //     ajaxRequestPreview.done((receivedPreviewItems) => {

    //         const toFillPreviewItems = {
    //             lfgbAnzahl: $('#daily-lfgb'),
    //             textilAnzahl: $('#daily-Textil'),
    //             zpnAnzahl: $('#daily-zpn'),
    //             zpnPanelAnzahl: $('#panel-zpn'),
    //             zpnKlaerfaelle: $('#panel-zpnKlaerfall'),
    //             zpnMustereingang: $('#panel-zpnMusterEingang'),
    //             zpnWagen: $('#panel-zpnWagen')
    //         };

    //         //
    //         //Fügt die aus dem Ajax call erhaltenen Werte, wenn nicht schon im localStorage identisch in die entpsprechenden html Elemente ein
    //         Object.entries(receivedPreviewItems).forEach(([receivedKey, receivedValue]) => {
    //             Object.entries(toFillPreviewItems).forEach(([toFillKey, toFillValue]) => {
    //                 if (receivedKey === toFillKey && receivedValue != toFillValue.html()) {
    //                     let currentNumber = toFillValue.html();
    //                     toFillValue.html(receivedValue);
    //                     if (currentNumber <= receivedValue) {
    //                         toFillValue.parent().effect('highlight', { color: '#ffb700' }, 4000);
    //                     } else {
    //                         toFillValue.parent().effect('highlight', { color: '#ff3300' }, 4000);
    //                     }
    //                 }
    //             });
    //         });
    //     });

    //     ajaxRequestPreview.fail((jqXHR, textStatus, errorThrown) => {
    //         console.log(textStatus, errorThrown);
    //     });
    // }

    function updatePreview(receivedPreviewItems) {
        const toFillPreviewItems = {
            lfgbAnzahl: $('#daily-lfgb'),
            textilAnzahl: $('#daily-Textil'),
            zpnAnzahl: $('#daily-zpn'),
            zpnPanelAnzahl: $('#panel-zpn'),
            zpnKlaerfaelle: $('#panel-zpnKlaerfall'),
            zpnMustereingang: $('#panel-zpnMusterEingang'),
            zpnWagen: $('#panel-zpnWagen')
        };

        //
        //Fügt die aus dem Ajax call erhaltenen Werte, wenn nicht schon im localStorage identisch in die entpsprechenden html Elemente ein
        Object.entries(receivedPreviewItems).forEach(([receivedKey, receivedValue]) => {
            Object.entries(toFillPreviewItems).forEach(([toFillKey, toFillValue]) => {
                if (receivedKey === toFillKey && receivedValue != toFillValue.html()) {
                    let currentNumber = toFillValue.html();
                    toFillValue.html(receivedValue);
                    if (currentNumber <= receivedValue) {
                        toFillValue.parent().effect('highlight', { color: '#ffb700' }, 4000);
                    } else {
                        toFillValue.parent().effect('highlight', { color: '#ff3300' }, 4000);
                    }
                }
            });
        });
    }

    sse.onmessage = function (message) {
        updatePreview(JSON.parse(message.data));
    };

    // setInterval(() => {
    //     updatePreview();
    // }, 5000);

});