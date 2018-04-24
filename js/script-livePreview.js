
// let checkWindowHeight = function() {
//
//     let windowEvent = function(event) {
//         let windowHeight = window.innerHeight;
//         if(windowHeight <= 200) {
//             console.log("Test");
//         }
//     };
//
//     window.addEventListener('resize', windowEvent, false);
//
// };
//
//
// document.addEventListener('DOMContentLoaded', checkWindowHeight, false);



document.addEventListener('DOMContentLoaded', function () {

    // jQuery('#ft-preview-header-caption').fitText();

    function updatePreview() {
        const ajaxRequestPreview = $.ajax({
            url: '../php/db-request-PreView-Items.php',
            dataType: 'json'
        });

        ajaxRequestPreview.done((receivedPreviewItems) => {
            console.log(receivedPreviewItems);
            const toFillPreviewItems = {
                anLFGB: $('#daily-lfgb'),
                anTextilphysik: $('#daily-Textil'),
                anZPN: $('.daily-zpn'),
                zpnKlaerfaelle: $('#panel-zpnKlaerfall'),
                zpnMustereingang: $('#panel-zpnMusterEingang'),
                zpnWagen: $('#panel-zpnWagen')
            };

            Object.entries(receivedPreviewItems).forEach(([receivedKey, receivedValue]) => {
                Object.entries(toFillPreviewItems).forEach(([toFillKey, toFillValue]) => {

                    console.log(toFillValue.html());
                    receivedKey === toFillKey ? toFillValue.html(receivedValue) : '';
                    // console.log(receivedKey + ", " + receivedValue);
                    // console.log(toFillKey + ", " + toFillValue);
                });
            });

        });

        ajaxRequestPreview.fail((jqXHR, textStatus, errorThrown) => {
            console.log(textStatus, errorThrown);
        });
    }

    updatePreview();

});