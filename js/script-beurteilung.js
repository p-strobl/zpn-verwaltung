"use strict";

function appendContentMainRow(inputTextLeft, inputTextRight, abteilung) {
    const $contentHeaderRow = $("#content-header-row");
    const $wrapContent$wrapFooter = $("#wrap-content").add($("#wrap-footer"));
    const $headerInput = $("#header-input-beurteilung-abteilung");
    const contentAppend =
        "<section class='content-main-row beurteilung' id='content-main-row'>" +
            "<div class='content-main-cell' title='Eingetragene Proben Nummer.'>" +
                "<p class='content-main-text' id='text-prbNr'>"+inputTextLeft+"</p>" +
            "</div>" +
            "<div class='content-main-cell beurteilung' title='Solldatum zum Muster.'>" +
                "<p class='content-main-text' id='text-sollNr' contenteditable='false'>"+inputTextRight+"</p>" +
            "</div>" +
            "<div class='content-main-cell beurteilung' title='Bet&#228;tigen Sie diese Schaltfl&#228;che bevor Sie mit der Zerlegung beginnen möchten.'>" +
                "<button type='button' class='content-button-check' id='content-btn-zerlegungStart' value='deactive'>An die ZPN</button>" +
            "</div>" +
            "<div class='content-main-cell beurteilung' title='Bet&#228;tigen Sie diese Schaltfl&#228;che nach beendigung der Zerlegung.'>" +
                "<button type='button' class='content-button-check' id='content-btn-zerlegungEnde' value='deactive'>An die LFGB</button>" +
            "</div>" +
            "<div class='content-main-cell beurteilung' title='Bet&#228;tigen Sie diese Schaltfl&#228;che bevor Sie die Einwaage beginnen möchten.'>" +
                "<button type='button' class='content-button-check' id='content-btn-einwaageBeginn' value='deactive'>An die Textilphysik</button>" +
            "</div>" +
            "<div class='content-main-cell beurteilung'>" +
                "<div class='content-button-delete-wrap'>" +
                    "<button type='button' class='content-button-delete' id='content-main-row-delete-button' title='Bet&#228;tigen Sie diese Schaltfl&#228;che um den entfernen Dialog zu starten und zu beenden.'>Entfernen</button>" +
                    "<div class='slideToggle-wrap-hidden-row' id='slideToggle-wrap-hidden-row'>" +
                        "<div class='wrap-hidden-row' id='wrap-hidden-row'>" +
                            "<button class='hidden-row confirm-button' id='hidden-row-confirm-button' title='Mit dieser Schaltfl&#228;che best&#228;tigen Sie das entfernen der ausgew&#228;hlten Zeile&#33;'>Ja</button>" +
                            "<button class='hidden-row cancel-button' id='hidden-row-cancel-button' title='Mit dieser Schaltfl&#228;che beenden Sie den entfernen Dialog.'>Nein</button>" +
                        "</div>" +
                    "</div>" +
                "</div>" +
            "</div>" +
        "</section>";

    //Zeigt den Tabellen Header, die Tabelle und den sende Button wieder an.
    $wrapContent$wrapFooter.hasClass('displayNoneImportant') === true ? $wrapContent$wrapFooter.removeClass('displayNoneImportant').add($headerInput).removeClass('border-edged') : '' ;
    ///Fügt dem HTML Element mit der ID "#wrap-content" eine Zeile mit dem Inhalt von "inputText" und dazugehörigen Checkboxen hinzu.
    $contentHeaderRow.after(contentAppend);
    //Ruft die Funktion "countRows" auf um die Anzahl der vorhandenen Datensätze zu zählen.
    countMainRows.addHighlight('highlight', '#FFB700', 100);
}