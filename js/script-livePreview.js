
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

    jQuery('#ft-preview-header-caption').fitText();

    // function updatePreview() {
    //     const ajaxRequestObject = $.ajax({
    //         url: '../php/db-requestObject.php',
    //         method: 'POST',
    //         data: {
    //             requestDataSetComplete: test
    //         },
    //         dataType: 'json'
    //     });
    // }

});