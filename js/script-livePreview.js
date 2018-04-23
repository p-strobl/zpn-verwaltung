
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

window.addEventListener('load', function () {

    function updatePreview() {
        const ajaxRequestObject = $.ajax({
            url: '../php/db-requestObject.php',
            method: 'POST',
            data: {
                requestDataSetComplete:
            },
            dataType: 'json'
        });
    }

});