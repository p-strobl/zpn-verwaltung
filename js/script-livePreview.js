'use strict';

document.addEventListener('DOMContentLoaded', function () {

    var serverSideEvent = new EventSource('../php/db-request-PreView-Items.php');

    function updatePreview(receivedPreviewItems) {
        const toFillPreviewItems = {
            lfgbAnzahl: $('#daily-lfgb'),
            textilAnzahl: $('#daily-Textil'),
            zpnAnzahl: $('#daily-zpn').add($('#panel-zpn')),
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

    serverSideEvent.onmessage = function (message) {
        updatePreview(JSON.parse(message.data));
    };

});