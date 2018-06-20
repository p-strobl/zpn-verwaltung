'use strict';

//
//Globaler zähler
let globalMainRowCounter = [];

//
//Stellt sicher das nur Zahlen in die Inputbox eingetragen werden können.
function regexInput() {
    //noRegEx gibt an welche Zeichen nicht eingegeben werden können.
    const noRegEx = /[^0-9#;.-]/g;
    const oneOfRegEx = /[ZPN]|[LFGB]|[Textilphysik]|[Standard]|[Express]|[Intern]|[mitNickel]|[Toys]|[mit60g]|[backKlaerfall]|[backNickel]/g;
    const $modalHeaderInput = $('#modal-header-input');
    const $headerInputEingang = $('#header-input-eingang');
    const $headerInputLfgbTextil = $('#header-input-lfgbTextil');
    const $headerInputVerwaltung = $('#header-input-verwaltung');
    const $headerInputBeurteilungProbennummer = $('#header-input-beurteilung-probennummer');
    const $headerInputBeurteilungAbteilung = $('#header-input-beurteilung-abteilung');
    const $headerInputZpnEingangZusatz = $('#header-input-eingang-zusatz');

    $headerInputEingang
        .add($modalHeaderInput)
        .add($headerInputLfgbTextil)
        .add($headerInputVerwaltung)
        .add($headerInputBeurteilungProbennummer)
        .on('keyup', function () {
            //Überprüft die Eingabe der Inputbox und ersetzt die Eingabe von Buchstaben und ungewünschten Zeichen mit einem leeren Zeichen.
            if (noRegEx.test(this.value)) {
                $(this).val(this.value.replace(noRegEx, ""));
            }
        });
    // $headerInputBeurteilungAbteilung
    //     .add($headerInputZpnEingangZusatz)
    //     .on('keyup', function (keypressed) {
    //         if (this.value.match(oneOfRegEx) || keypressed.keyCode === 13) {
    //         } else {
    //             $(this).val(this.value.replace(this.value, ""));
    //         }
    //     });
}

//
//Splittet dein eingegebenen String
function leftSplit(str, chr) {
    if (str.length > 12) {
        return str.slice(0, chr - str.length);
    } else if (str.length === 10) {
        const stripedInputText = str.substring(0, 2) + '-' + str.substring(2, 8) + '-' + str.substring(8, 10);
        return stripedInputText;
    } else {
        return str;
    }
}

//
//Splittet dein eingegebenen String
function rightSplit(str, chr) {
    const yesRegEx = /\d{2}.\d{2}.\d{4}/;
    let sliceStr = str.slice(str.length - chr, str.length);
    return sliceStr.match(yesRegEx) ? sliceStr : '-';
}

//
//Kopiert den Input String in die Zwischenablage
function copyToClipboard(copyText) {
    let inputText = document.createElement('input');
    inputText.value = copyText.substring(0, 9) + '%';
    inputText.setAttribute('readonly', '');
    inputText.style.position = 'absolute';
    inputText.style.left = '-9999px';
    document.body.appendChild(inputText);
    inputText.select();
    let outputText = document.execCommand('copy');
    document.body.removeChild(inputText);
}

//
//Überwacht die Inputbox und stellt sicher das nur erlaubte Zeichenfolgen angenommen werden.
function checkInput() {
    const $headerInputEingang = $("#header-input-eingang");
    const $headerInputEingangZusatz = $('#header-input-eingang-zusatz');
    const $headerInputVerwaltung = $("#header-input-verwaltung");
    const $headerInputLfgbTextil = $('#header-input-lfgbTextil');
    const $headerInputBeurteilungProbennummer = $('#header-input-beurteilung-probennummer');
    const $headerInputBeurteilungAbteilung = $('#header-input-beurteilung-abteilung');
    const $modalHeaderInput = $("#modal-header-input");


    //Setzt den Focus nach dem laden der Seite in die Inputbox
    $headerInputEingang
        .add($headerInputVerwaltung)
        .add($headerInputBeurteilungProbennummer)
        .add($headerInputLfgbTextil)
        .focus();

    //Enter Taste in der Inputbox wird betätigt.
    $headerInputEingang
        .add($headerInputVerwaltung)
        .add($headerInputLfgbTextil)
        .add($headerInputBeurteilungProbennummer)
        .add($modalHeaderInput)
        .on("keyup", function (pressedKey) {
            //Überprüft ob der focus auf der Inputbox liegt und die Enter Taste gedrückt wurde.
            if (pressedKey.keyCode === 13 && this.value !== '') {
                //Teilt den inputText auf
                //Speichert den Inhalt der Inputbox in der Variable "inputText".
                let inputTextLeft = leftSplit($(this).val(), 12);
                let inputTextRight = rightSplit($(this).val(), 10);
                let inputText = $(this).val();
                //Eingabe Muster einer Probennummer entspricht
                const yesRegEx = /\d{2}-\d{6}-\d{2}/;
                //Eingabe länge einer Probennummer beträgt 23 Zeichen.
                const minCharacter = 12;

                //Überprüft ob die Eingabe in der Inputbox, einer Probennummer entspricht.
                if (inputTextLeft.match(yesRegEx) && inputTextLeft.length === minCharacter) {
                    switch (this.id) {
                        case 'header-input-verwaltung':
                            if ($.inArray(inputTextLeft, globalMainRowCounter) > -1) {
                                //Nach der Enter Eingabe, blinkt das Input Feld kurz auf.
                                $headerInputEingang
                                    .add($headerInputVerwaltung)
                                    .effect('highlight', { color: '#FF3100' }, 200);
                                //Ja es ist bereits ein Datensatz vorhanden, es wird eine Fehler Meldung angezeigt.
                                //Blendet für 3,5 sek. eine "Fehlgeschlagen, Doppelter Eintrag" auskunft ein.
                                $headerInputEingang
                                    .add($headerInputVerwaltung)
                                    .val('');
                                showFailMessage.failMessage('double-input', 1500, this.id);
                            } else {
                                //Nach der Enter Eingabe, blinkt das Input Feld kurz auf.
                                $headerInputEingang
                                    .add($headerInputVerwaltung)
                                    .effect('highlight', { color: '#FFB700' }, 200);
                                //in die Globale Variable "globalMainRowCounter" wird der hinzugefügte Datensatz zwischengespeichert.
                                globalMainRowCounter.push(inputTextLeft);
                                //Nein, es ist noch kein Datensatz vorhanden, eine neue Zeile mit dem Datensatz wird erstellt.
                                //Ruft die Funktion "appendContentMainRow" auf um dem Inhalt der Variablen "inputText" als Tabelle in das DOM zu übertragen.
                                appendContentMainRow(inputTextLeft, inputTextRight);
                                //Leert das eingabe Feld nach einem Fehlerhaften Eintrag
                                $headerInputEingang
                                    .add($headerInputVerwaltung)
                                    .val('');
                            }
                            break;
                        case 'header-input-lfgbTextil':
                            if ($.inArray(inputTextLeft, globalMainRowCounter) > -1) {
                                //Nach der Enter Eingabe, blinkt das Input Feld kurz auf.
                                $headerInputLfgbTextil.effect('highlight', { color: '#FF3100' }, 200);
                                //Ja es ist bereits ein Datensatz vorhanden, es wird eine Fehler Meldung angezeigt.
                                //Blendet für 3,5 sek. eine "Fehlgeschlagen, Doppelter Eintrag" auskunft ein.
                                $headerInputLfgbTextil.val('');
                                showFailMessage.failMessage('double-input', 1500, this.id);
                            } else {
                                //Nach der Enter Eingabe, blinkt das Input Feld kurz auf.
                                $headerInputLfgbTextil.effect('highlight', { color: '#FFB700' }, 200);
                                //in die Globale Variable "globalMainRowCounter" wird der hinzugefügte Datensatz zwischengespeichert.
                                globalMainRowCounter.push(inputTextLeft);
                                //Nein, es ist noch kein Datensatz vorhanden, eine neue Zeile mit dem Datensatz wird erstellt.
                                //Ruft die Funktion "appendContentMainRow" auf um dem Inhalt der Variablen "inputText" als Tabelle in das DOM zu übertragen.
                                appendLfgbTextilContentMainRow(inputTextLeft, inputTextRight);
                                //Leert das eingabe Feld nach einem Fehlerhaften Eintrag
                                $headerInputLfgbTextil.val('');
                            }
                            break;
                        case 'header-input-eingang':
                            if ($.inArray(inputTextLeft, globalMainRowCounter) > -1) {
                                $headerInputEingang.effect('highlight', { color: '#FF3100' }, 200);
                                $headerInputEingang.val('');
                                showFailMessage.failMessage('double-input', 1500, this.id);
                            }
                            else {
                                $headerInputEingang.effect('highlight', { color: '#FFB700' }, 200);
                                globalMainRowCounter.push(inputTextLeft);
                                $headerInputEingang.attr('disabled', 'disabled');
                                $headerInputEingangZusatz.removeAttr('disabled').focus();
                            }
                            break;
                        case 'header-input-beurteilung-probennummer':
                            if ($.inArray(inputTextLeft, globalMainRowCounter) > -1) {
                                $headerInputBeurteilungProbennummer.effect('highlight', { color: '#FF3100' }, 200).val('');
                                //Ja es ist bereits ein Datensatz vorhanden, es wird eine Fehler Meldung angezeigt.
                                //Blendet für 3,5 sek. eine "Fehlgeschlagen, Doppelter Eintrag" auskunft ein.
                                showFailMessage.failMessage('double-input', 1500, this.id);
                            } else {
                                $headerInputBeurteilungProbennummer.effect('highlight', { color: '#FFB700' }, 200);
                                //in die Globale Variable "globalMainRowCounter" wird der hinzugefügte Datensatz zwischengespeichert.
                                globalMainRowCounter.push(inputTextLeft);
                                $headerInputBeurteilungProbennummer.attr('disabled', 'disabled');
                                $headerInputBeurteilungAbteilung.removeAttr('disabled').focus();
                            }
                            break;
                        case 'modal-header-input':
                            copyToClipboard(inputTextLeft);
                            searchDataSet(inputTextLeft);
                            break;
                        default:
                    }
                } else {
                    //Nach der Enter Eingabe, blinkt das Input Feld kurz auf.
                    $(this).effect('highlight', { color: '#FF3100' }, 200);
                    //Leert das eingabe Feld nach einem Fehlerhaften Eintrag
                    $(this).val('');
                    //Zeigt dem Benutzer eine kurze(2s) Fehler Nachricht an, via CSS "content".
                    showFailMessage.failMessage('fail-input-not-a-number', 2500, this.id);
                }
            }
        });
    $headerInputBeurteilungAbteilung
        .add($headerInputEingangZusatz)
        .on("keyup", function (pressedKey) {
            const oneOfRegEx = /((ZPN)|(LFGB)|(Textilphysik)|(Standard)|(Express)|(Intern)|(mitNickel)|(Toys)|(mit60g)|(backKlaerfall)|(backNickel))/g;
            let inputText = $(this).val();

            if (pressedKey.keyCode === 13 && this.value !== '') {
                if (inputText.match(oneOfRegEx) || inputText === $headerInputEingang.val()) {
                    switch (this.id) {
                        case 'header-input-eingang-zusatz':
                            let inputTextLeft = leftSplit($headerInputEingang.val(), 12);
                            let inputTextRight = rightSplit($headerInputEingang.val(), 10);
                            appendContentMainRow(inputTextLeft, inputTextRight, this.value);
                            $headerInputEingangZusatz
                                .effect('highlight', { color: '#FFB700' }, 200)
                                .attr('disabled', 'disabled')
                                .val('');
                            $headerInputEingang
                                .val('')
                                .removeAttr('disabled')
                                .focus();
                            break;
                        case 'header-input-beurteilung-abteilung':
                            appendContentMainRow($headerInputBeurteilungProbennummer.val(), this.value);
                            $headerInputBeurteilungProbennummer.add($headerInputBeurteilungAbteilung).val('');
                            $headerInputBeurteilungAbteilung.attr('disabled', 'disabled');
                            $headerInputBeurteilungProbennummer
                                .removeAttr('disabled')
                                .effect('highlight', { color: '#FFB700' }, 200)
                                .focus();
                            break;
                    }
                } else {
                    //Nach der Enter Eingabe, blinkt das Input Feld kurz auf.
                    $(this).effect('highlight', { color: '#FF3100' }, 200);
                    //Leert das eingabe Feld nach einem Fehlerhaften Eintrag
                    $(this).val('');
                    //Zeigt dem Benutzer eine kurze(2s) Fehler Nachricht an, via CSS "content".
                    showFailMessage.failMessage('fail-input-not-a-zusatz', 2500, this.id);
                }
            }
        });
}

//
//Zeigt eine entsprechende Fehlermeldung an
const showFailMessage = {
    $headerFailMessageWrap: $("#header-fail-message-wrap"),
    $headerFailMessageContent: $("#header-fail-message-content"),
    $headerInputEingang: $("#header-input-eingang"),
    $wrapContent: $("#wrap-content"),
    $modalFailMessageWrap: $("#modal-fail-message-wrap"),
    $modalFailMessageContent: $("#modal-fail-message-content"),

    failMessage: function (errorClassType, setTimeoutTimer, thisObject) {
        switch (thisObject) {
            case "header-input-eingang":
            case "header-input-verwaltung":
            case "header-input-lfgbTextil":
            case "header-input-beurteilung-probennummer":
            case "header-input-beurteilung-abteilung":
            case "header-input-eingang-zusatz":
                this.$wrapContent.hasClass("displayNoneImportant") === true ? this.$headerFailMessageWrap.addClass("border-edged").add(this.$headerInputEingang.removeClass("border-edged")) : "";
                this.$headerFailMessageContent.addClass(errorClassType);
                this.$headerFailMessageWrap.addClass("header-fail-message-animation");
                setTimeout(() => {
                    this.$headerFailMessageWrap.removeClass("header-fail-message-animation");
                    setTimeout(() => {
                        this.$wrapContent.hasClass("displayNoneImportant") === true ? this.$headerFailMessageWrap.removeClass("border-edged").add(this.$headerInputEingang.addClass("border-edged")) : "";
                        this.$headerFailMessageContent.removeClass(errorClassType);
                    }, 330);
                }, setTimeoutTimer);
                backToInput();
                break;

            case "modal-header-input":
                this.$modalFailMessageContent.addClass(errorClassType);
                this.$modalFailMessageWrap.addClass("transform__modal");
                setTimeout(() => {
                    this.$modalFailMessageContent.removeClass(errorClassType);
                    this.$modalFailMessageWrap.removeClass("transform__modal");
                }, setTimeoutTimer);
                backToInput();
                break;
            default:
        }
    }
};

//
//
const hasDisaplayNone = ($wrapContent$wrapFooter, $headerInput) => {
    $wrapContent$wrapFooter.hasClass('displayNoneImportant') === true ? $wrapContent$wrapFooter.removeClass('displayNoneImportant').add($headerInput).removeClass('border-edged') : '';
};

//
//
function stripDataPack(dataPack) {
    Object.entries(dataPack).forEach(([dataPackKey, dataPackValue]) => {
        Object.entries(dataPackValue).forEach(([itemKey, itemValue]) => {
            if (itemValue === "preSet" || itemValue === "deactive") {
                delete dataPackValue[itemKey];
            }
        });
    });
}

//
//
function setButtonStatus(rowItems, itemKey) {
    const setItem = rowItems[itemKey];
    setItem
        .prop("disabled", true)
        .addClass("setButtonStatus")
        .val("preSet");
    switch (itemKey) {
        case 'einwaageBeginn':
            rowItems.einwaageBeginn.prop('disabled', true).addClass('disableMainRowButton');
            break;
        case 'einwaageEnde':
            rowItems.einwaageBeginn.disabled === true ? '' : rowItems.einwaageBeginn.prop('disabled', true).addClass('disableMainRowButton');
            break;
        case 'klaerfallEndeDateTime':
            rowItems.klaerfallBeginnDateTime.disabled === true ? '' : rowItems.klaerfallBeginnDateTime.prop('disabled', true).addClass('disableMainRowButton');
            break;
        case 'manaErhaltenDateTime':
            rowItems.manaGestelltDateTime.disabled === true ? '' : rowItems.manaGestelltDateTime.prop('disabled', true).addClass('disableMainRowButton');
            break;
        case 'manaZpnWagenDateTime':
            rowItems.manaGestelltDateTime.disabled === true ? '' : rowItems.manaGestelltDateTime.prop('disabled', true).addClass('disableMainRowButton');
            rowItems.manaErhaltenDateTime.disabled === true ? '' : rowItems.manaErhaltenDateTime.prop('disabled', true).addClass('disableMainRowButton');
            rowItems.manaEinwaageDateTime.disabled === true ? '' : rowItems.manaEinwaageDateTime.prop('disabled', true).addClass('disableMainRowButton');
            break;
        case 'zerlegungEnde':
            rowItems.zerlegungStart.disabled === true ? '' : rowItems.zerlegungStart.prop('disabled', true).addClass('disableMainRowButton');
            break;
        case 'zpnWagenDateTime':
            rowItems.einwaageBeginn.disabled === true ? '' : rowItems.einwaageBeginn.prop('disabled', true).addClass('disableMainRowButton');
            rowItems.einwaageEnde.disabled === true ? '' : rowItems.einwaageEnde.prop('disabled', true).addClass('disableMainRowButton');
            rowItems.zerlegungStart.disabled === true ? '' : rowItems.zerlegungStart.prop('disabled', true).addClass('disableMainRowButton');
            rowItems.zerlegungEnde.disabled === true ? '' : rowItems.zerlegungEnde.prop('disabled', true).addClass('disableMainRowButton');
            break;
    }
}

//
//Entfernt in der aus wrapData übertragenes Object die values mit einem "deactive" key
function checkForUnchecked(dataPack, headerInput, origin) {
    let countActive = 0;
    const dataPackLength = dataPack.length;

    $.each(dataPack, function (packKey, packValue) {
        $.each(packValue, function (objectKey, objectValue) {
            if (objectValue === 'active') {
                countActive++;
                return false;
            }
        });
    });

    if (countActive === dataPackLength && origin === 'beurteilung') {
        sendData(dataPack);
        return false;
    }
    else if (countActive === dataPackLength && origin === 'verwaltung') {
        sendUpdateData(dataPack);
        return false;
    } else if (countActive !== dataPackLength) {
        showFailMessage.failMessage("fail-input-noSelection header-fail-message-content-margin", 3000, headerInput);
        return false;
    }
}

//
// Bringt den Cursor wieder in das selektierte Eingabefeld.
const backToInput = (() => {
    const $headerInputBeurteilung = $('#header-input-beurteilung-probennummer');
    const $headerInputEingang = $("#header-input-eingang");
    const $headerInputVerwaltung = $("#header-input-verwaltung");
    const $headerInputLfgbTextil = $('#header-input-lfgbTextil');
    setTimeout(() => {
        $headerInputBeurteilung.add($headerInputEingang).add($headerInputVerwaltung).add($headerInputLfgbTextil).focus();
    }, 100);
    return;
});

//
// Färbt die Anzeige der Datensatz Menge enstprechend, wenn Hinzugefügt: Grün, wenn entfernt: Rot.
const countMainRows = {
    $footerAnzahlMusterText: $("#content-footer-counter-muster"),
    addHighlight: function (effect, effectColor, effectTimer) {
        this.$footerAnzahlMusterText
            .html(globalMainRowCounter.length)
            .parent()
            .effect(effect, {
                color: effectColor
            }, effectTimer);
    }
};

//
// Addiert den Footer counter
function addFooterCounter(abteilung, footerCounter) {

    function addCounter(footerCounterID) {
        footerCounterID.text(Number(footerCounterID.text()) + 1);
    }

    Object.entries(footerCounter).forEach(([fcKey, fcValue]) => {
        fcKey === abteilung ? addCounter(fcValue) : '';
    });
}

//
// Subtrahiert den Footer counter
function removeFooterCounter(clickedButton) {

    const footerCountRow = $('#content-footer-count-row');
    const activeButton = clickedButton.closest('#content-main-row').find($('[value=active]'));

    function subtractCounter(parentValue) {
        let parentSpan = $(parentValue).find('span');
        parentSpan.text(Number(parentSpan.text()) - 1);
        $(parentValue).effect("highlight", { color: "#FF3100" }, 200);
    }

    Object.entries(activeButton).forEach(([activeButtonKey, activeButtonValue]) => {
        let eachFooterCounterParent = footerCountRow.find($('[name=' + $(activeButtonValue).prop('name') + ']'));
        $(activeButtonValue).attr('name') === $(eachFooterCounterParent).attr('name') ? subtractCounter(eachFooterCounterParent) : '';
    });
}

//
// 
function footerGlobalCounter() {
    let contentMainRow = $('#content-main-row');
    let contentFooterCountRow = $('#content-footer-count-row');
    let buttonZpnEingang = $('.content-button-check');
    let footerParentSpanZpnEingang = $('.content-footer-count-input');
    let footerSpanZpnEingang = $('.content-footer-counter');

    contentMainRow.on('click', '.content-button-check', function () {
        let matchedFooterParent = $(contentFooterCountRow).find($("[name=" + $(this).prop('name') + "]"));
        let matchedFooterSpan = $(matchedFooterParent).find('span');
        if ($(this).val() === 'active') {
            $(this)
                .removeClass('preSet')
                .val('deactive');
            matchedFooterSpan.text(Number(matchedFooterSpan.text()) - 1);
            matchedFooterParent.effect("highlight", { color: "#FF3100" }, 200);
            blockButtons($(this));
        } else {
            $(this)
                .addClass('preSet')
                .val('active');
            matchedFooterSpan.text(Number(matchedFooterSpan.text()) + 1);
            matchedFooterParent.effect("highlight", { color: "#FFB700" }, 200);
            blockButtons($(this));
        }
    });
};

//
// Sperrt entsprechend nach Auswahl, die andern Buttons
function blockButtons(clickedButton) {
    const siblingButtons = clickedButton.parent().siblings().children();
    const blockButtons = {
        'content-btn-zerlegungStart': $('#content-btn-zerlegungStart'),
        'content-btn-zerlegungEnde': $('#content-btn-zerlegungEnde'),
        'content-btn-einwaageBeginn': $('#content-btn-einwaageBeginn'),
        'content-btn-einwaageEnde': $('#content-btn-einwaageEnde'),
        'content-btn-zpnWagen': $('#content-btn-zpnWagen'),
        'content-btn-klaerfallBeginn': $('#content-btn-klaerfallBeginn'),
        'content-btn-klaerfallEnde': $('#content-btn-klaerfallEnde'),
        'content-btn-manaBestellt': $('#content-btn-manaBestellt'),
        'content-btn-manaErhalten': $('#content-btn-manaErhalten'),
        'content-btn-manaEinwaage': $('#content-btn-manaEinwaage'),
        'content-btn-manaEingewogen': $('#content-btn-manaEingewogen'),
        'ZPN': $('#ZPN'),
        'LFGB': $('#LFGB'),
        'Textilphysik': $('#Textilphysik')
    };
    switch (clickedButton.val()) {
        case 'active':
            Object.entries(siblingButtons).forEach(([siblingKey, siblingValue]) => {
                if (siblingValue.id in blockButtons) {
                    !clickedButton.is(siblingValue) ? $(siblingValue).prop('disabled', true).addClass('disabled') : '';
                }
            });
            break;
        case 'deactive':
            Object.entries(siblingButtons).forEach(([siblingKey, siblingValue]) => {
                if (siblingValue.id in blockButtons) {
                    !clickedButton.is(siblingValue) ? $(siblingValue).prop('disabled', false).removeClass('disabled disableMainRowButton') : '';
                }
            });
            break;
        default:
    }
}

//
//Während dem "hover" über dem Löschen button, wird die gesamte Zeile entprechend eingefärbt.
function highlightSelectedRow() {
    const $wrapContent = $("#wrap-content");
    $wrapContent.on(
        "mouseenter",
        "#content-main-row-delete-button, #hidden-row-confirm-button",
        function () {
            $(this)
                .closest("#content-main-row")
                .addClass("highlightSelectedRow")
                .find(".content-button-check, .content-button-delete")
                .addClass("highlightSelectedButton");
        }
    );

    $wrapContent.on(
        "mouseleave",
        "#content-main-row-delete-button, #hidden-row-confirm-button",
        function () {
            $(this)
                .closest("#content-main-row")
                .removeClass("highlightSelectedRow")
                .find(".content-button-check, .content-button-delete")
                .removeClass("highlightSelectedButton");
        }
    );
}

//
//Löscht die gesamte Zeile des ausgewählten Buttons.
const deleteSelectedRow = function (selectedRow) {
    const $wrapContent = $("#wrap-content");
    const $headerInputEingang = $("#header-input-eingang");
    const $wrapContent$wrapFooter = $("#wrap-content").add($("#wrap-footer"));
    const $contentFooterMainRowSendButton = $("#wrap-content")
        .add($("#content-footer-count-wrap"))
        .add($("#content-main-row"))
        .add($("#footer-button-send"));
    const $selectedRowClosestMainRow = $(selectedRow).closest(
        "#content-main-row"
    );
    const rowMainCount = $wrapContent.find(".content-main-row").length;
    const selectedRowPrbNrText = $selectedRowClosestMainRow.find("#text-prbNr").text();

    if (rowMainCount === 1) {
        globalMainRowCounter = globalMainRowCounter.filter(item => item !== selectedRowPrbNrText);
        countMainRows.addHighlight("highlight", "#FF3100", 100);
        $($contentFooterMainRowSendButton).each(function () {
            $(this)
                .fadeOut(300)
                .promise()
                .done(function () {
                    this.css({ display: "" });
                    $(selectedRow).closest("#content-main-row").remove();
                    $wrapContent$wrapFooter.addClass("displayNoneImportant");
                    $headerInputEingang.addClass("border-edged");
                    backToInput();
                });
        });
    } else if (rowMainCount > 1) {
        globalMainRowCounter = globalMainRowCounter.filter(item => item !== selectedRowPrbNrText);
        countMainRows.addHighlight("highlight", "#FF3100", 100);
        $selectedRowClosestMainRow
            .fadeOut(300)
            .promise()
            .done(function () {
                $(selectedRow).closest("#content-main-row").remove();
                backToInput();
            });
    }
};

//
// Mit einem Slide Effekt wird die bestätigung der löschung des Selektierten Datensatz abgefragt.
function confirmDelete() {
    const $wrapContent = $("#wrap-content");
    $wrapContent.on("click", "#content-main-row-delete-button", function () {
        //$(this) = Clicked(#content-main-row-delete-button)
        $(this)
            .siblings("#slideToggle-wrap-hidden-row")
            .slideToggle("fast", function () {
                //$(this) = Div(#slideToggle-wrap-hidden-row)
                $(this)
                    .children("#wrap-hidden-row")
                    .on("click", "#hidden-row-confirm-button", function () {
                        //$(this) = Clicked(#hidden-row-confirm-button)
                        deleteSelectedRow($(this));
                        removeFooterCounter($(this));
                    });
                $(this)
                    .children("#wrap-hidden-row")
                    .on("click", "#hidden-row-cancel-button", function () {
                        //$(this) = Clicked(#hidden-row-cancel-button)
                        $(this)
                            .parent()
                            .parent("#slideToggle-wrap-hidden-row")
                            .slideUp("fast");
                    });
            });
    });
}

//
// Document load handler
document.addEventListener('DOMContentLoaded', function () {
    regexInput();
    checkInput();
    highlightSelectedRow();
    confirmDelete();
    showCloseModal.showModal();
    showCloseModal.closeModal();
    updateStatusButton();
    updateKommentar();
});
