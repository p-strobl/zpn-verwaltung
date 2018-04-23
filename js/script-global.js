"use strict";

//
//Globaler zähler
let globalMainRowCounter = [];

//
//Stellt sicher das nur Zahlen in die Inputbox eingetragen werden können.
function regexInput() {
    //noRegEx gibt an welche Zeichen nicht eingegeben werden können.
    const noRegEx = /[^0-9#;.-]/g;
    const zpnRegEx = /[ZPN]/g;
    const lfgbRegEx = /[LFGB]/g;
    const physikRegEx = /[Textilphysik]/g;
    const $headerInputEingang = $('#header-input-eingang');
    const $headerInputVerwaltung = $('#header-input-verwaltung');
    const $headerInputBeurteilungProbennummer = $('#header-input-beurteilung-probennummer');
    const $headerInputBeurteilungAbteilung = $('#header-input-beurteilung-abteilung');
    const $modalHeaderInput = $('#modal-header-input');

    $headerInputEingang
        .add($modalHeaderInput)
        .add($headerInputVerwaltung)
        .add($headerInputBeurteilungProbennummer)
        .on('keyup', function () {
            //Überprüft die Eingabe der Inputbox und ersetzt die Eingabe von Buchstaben und ungewünschten Zeichen mit einem leeren Zeichen.
            if (noRegEx.test(this.value)) {
                $(this)
                    .val(this.value.replace(noRegEx, ""));
                // .effect('highlight', {color: '#FF3100'}, 200);
            }
        });
    $headerInputBeurteilungAbteilung
        .on('keyup', function (keypressed) {
            if (this.value.match(zpnRegEx) || this.value.match(lfgbRegEx) || this.value.match(physikRegEx) || keypressed.keyCode === 13) {
                // $(this)
                // .effect('highlight', {color: 'lime'}, 200);
            } else {
                $(this)
                    .val(this.value.replace(this.value, ""));
                // .effect('highlight', {color: '#FF3100'}, 200);
            }
        });
}

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
//Splittet dein eingegebenen String
function rightSplit(str, chr) {
    const yesRegEx = /\d{2}.\d{2}.\d{4}/;
    let sliceStr = str.slice(str.length - chr, str.length);
    return sliceStr.match(yesRegEx) ? sliceStr : '-';
}

//
//Überwacht die Inputbox und stellt sicher das nur erlaubte Zeichenfolgen angenommen werden.
function checkInput() {
    const $headerInputEingang = $("#header-input-eingang");
    const $headerInputVerwaltung = $("#header-input-verwaltung");
    const $headerInputBeurteilungProbennummer = $('#header-input-beurteilung-probennummer');
    const $headerInputBeurteilungAbteilung = $('#header-input-beurteilung-abteilung');
    const $modalHeaderInput = $("#modal-header-input");
    //Setzt den Focus nach dem laden der Seite in die Inputbox
    $headerInputEingang
        .add($headerInputVerwaltung)
        .add($headerInputBeurteilungProbennummer)
        .focus();

    //Enter Taste in der Inputbox wird betätigt.
    $headerInputEingang
        .add($headerInputVerwaltung)
        .add($headerInputBeurteilungProbennummer)
        .add($headerInputBeurteilungAbteilung)
        .add($modalHeaderInput)
        .on("keyup", function (pressedKey) {
            //Überprüft ob der focus auf der Inputbox liegt und die Enter Taste gedrückt wurde.
            if (pressedKey.keyCode === 13 && this.value !== '') {
                //Teilt den inputText auf
                const inputTextLeft = leftSplit($(this).val(), 12);
                const inputTextRight = rightSplit($(this).val(), 10);
                //Speichert den Inhalt der Inputbox in der Variable "inputText".
                const inputText = $(this).val();
                //Eingabe Muster einer Probennummer entspricht
                const yesRegEx = /\d{2}-\d{6}-\d{2}/;
                const zpnRegEx = /[zpnZPN]/g;
                const lfgbRegEx = /[LFGB]/g;
                const physikRegEx = /[Textilphysik]/g;
                //Eingabe länge einer Probennummer beträgt 23 Zeichen.
                const minCharacter = 12;

                //Überprüft ob die Eingabe in der Inputbox, einer Probennummer entspricht.
                if (inputTextLeft.match(yesRegEx) && inputTextLeft.length === minCharacter || inputText.match(zpnRegEx) && this.value.length === 3 || inputText.match(lfgbRegEx) && this.value.length === 4 || inputText.match(physikRegEx) && this.value.length === 12) {
                    switch (this.id) {
                        case 'header-input-eingang':
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
                                showFailMessage.failMessage('double-input', 2000, this.id);
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
                        case 'modal-header-input':
                            searchDataSet(inputTextLeft);
                            break;
                        case 'header-input-beurteilung-probennummer':
                            if ($.inArray(inputTextLeft, globalMainRowCounter) > -1) {
                                $headerInputBeurteilungProbennummer.effect('highlight', { color: '#FF3100' }, 200).val('');
                                //Ja es ist bereits ein Datensatz vorhanden, es wird eine Fehler Meldung angezeigt.
                                //Blendet für 3,5 sek. eine "Fehlgeschlagen, Doppelter Eintrag" auskunft ein.
                                showFailMessage.failMessage('double-input', 2000, this.id);
                            } else {
                                $headerInputBeurteilungProbennummer
                                    .effect('highlight', { color: '#FFB700' }, 200);
                                //in die Globale Variable "globalMainRowCounter" wird der hinzugefügte Datensatz zwischengespeichert.
                                globalMainRowCounter.push(inputTextLeft);
                                $headerInputBeurteilungProbennummer.attr('disabled', 'disabled');
                                $headerInputBeurteilungAbteilung.removeAttr('disabled').focus();
                            }
                            break;
                        case 'header-input-beurteilung-abteilung':
                            appendContentMainRow($headerInputBeurteilungProbennummer.val(), this.value);
                            $headerInputBeurteilungProbennummer.add($headerInputBeurteilungAbteilung).val('');
                            $headerInputBeurteilungAbteilung.attr('disabled', 'disabled');
                            $headerInputBeurteilungProbennummer
                                .removeAttr('disabled')
                                .focus();
                            break;
                        default:
                    }
                } else {
                    //Nach der Enter Eingabe, blinkt das Input Feld kurz auf.
                    $(this).effect('highlight', { color: '#FF3100' }, 200);
                    //Leert das eingabe Feld nach einem Fehlerhaften Eintrag
                    $(this).val('');
                    //Zeigt dem Benutzer eine kurze(2s) Fehler Nachricht an, via CSS "content".
                    showFailMessage.failMessage('fail-input-not-a-nummber', 2500, this.id);
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
            case "header-input-beurteilung-probennummer":
                this.$wrapContent.hasClass("displayNoneImportant") === true ? this.$headerFailMessageWrap.addClass("border-edged").add(this.$headerInputEingang.removeClass("border-edged")) : "";
                this.$headerFailMessageContent.addClass(errorClassType);
                this.$headerFailMessageWrap.addClass("header-fail-message-animation");
                setTimeout(() => {
                    this.$headerFailMessageWrap.removeClass(
                        "header-fail-message-animation"
                    );
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

const hasDisaplayNone = ($wrapContent$wrapFooter, $headerInput) => {
    $wrapContent$wrapFooter.hasClass('displayNoneImportant') === true ? $wrapContent$wrapFooter.removeClass('displayNoneImportant').add($headerInput).removeClass('border-edged') : '';
};

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
        showFailMessage.failMessage("fail-input-noSelection header-fail-message-content-margin", 5000, headerInput);
        return false;
    }
}

const backToInput = (() => {
    const $headerInputBeurteilung = $('#header-input-beurteilung-probennummer');
    const $headerInputEingang = $("#header-input-eingang");
    const $headerInputVerwaltung = $("#header-input-verwaltung");
    setTimeout(() => {
        $headerInputBeurteilung.add($headerInputEingang).add($headerInputVerwaltung).focus();
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
//Ermittelt welcher Auswahl-Button gedrückt wurde, und addiert oder subtrahiert die entsprechende Anzeige.
function countCheckedButtons() {
    const $wrapContent = $("#wrap-content");

    const $footerAnzahlAnZPN = $('#content-footer-counter-anZPN');
    const $footerAnzahlAnLFGB = $('#content-footer-counter-anLFGB');
    const $footerAnzahlAnTextil = $('#content-footer-counter-anTextilphysik');

    const $footerAnzahlExpress = $("#content-footer-counter-express");
    const $footerAnzahlIntern = $("#content-footer-counter-intern");
    const $footerAnzahlNickel = $("#content-footer-counter-nickel");
    const $footerAnzahlLFGB = $("#content-footer-counter-LFGB");
    const $footerAnzahlToys = $("#content-footer-counter-toys");
    const $footerAnzahl60g = $("#content-footer-counter-60g");
    const $footerAnzahlKlaerfall = $("#content-footer-counter-klaerfallBack");

    const $footerAnzahlZerlegungStart = $("#content-footer-counter-zerlegungStart");
    const $footerAnzahlZerlegungEnde = $("#content-footer-counter-zerlegungEnde");
    const $footerAnzahlEinwaageBeginn = $("#content-footer-counter-einwaageBeginn");
    const $footerAnzahlEinwaageEnde = $("#content-footer-counter-einwaageEnde");
    const $footerAnzahlNickelBack = $("#content-footer-counter-nickelBack");
    const $footerAnzahlKlaerfallBeginn = $("#content-footer-counter-klaerfallBeginn");
    const $footerAnzahlKlaerfallEnde = $("#content-footer-counter-klaerfallEnde");
    const $footerAnzahlManaBestellt = $("#content-footer-counter-manaBestellt");
    const $footerAnzahlManaErhalten = $("#content-footer-counter-manaErhalten");
    const $footerAnzahlManaEinwaage = $("#content-footer-counter-manaEinwaage");
    const $footerAnzahlManaEingewogen = $("#content-footer-counter-manaEingewogen");
    const $footerAnzahlZpnWagen = $("#content-footer-counter-zpnWagen");

    function effectOnElement(footerElement, countValue1Buttons, effectColor) {
        footerElement
            .html($(countValue1Buttons).length)
            .parent()
            .effect("highlight", effectColor, 200);
    }

    function enableButton(startElement, enableElement, cssClassName) {
        if ($(startElement).closest(".content-main-row").find(enableElement).val() === "preSet") {
            return false;
        } else {
            if (startElement.value === "deactive") {
                $(startElement)
                    .closest(".content-main-row")
                    .find(enableElement)
                    .removeClass(cssClassName)
                    .attr("disabled", false);
            }
        }
    }

    function disableButton(startElement, disableElement, cssClassName) {
        if (startElement.value === "active") {
            $(startElement)
                .closest(".content-main-row")
                .find(disableElement)
                .addClass(cssClassName)
                .attr("disabled", true);
        }
    }

    function activateButton(startElement, activeElement) {
        if (startElement.value === "active") {
            $(startElement)
                .closest(".content-main-row")
                .find(activeElement)
                .css("background-color", "#FFB700")
                .val("active");
        }
    }

    function deactiveButton(startElement, deactiveElement) {
        if (startElement.value === "deactive") {
            $(startElement)
                .closest(".content-main-row")
                .find(deactiveElement)
                .css("background-color", "#ededed")
                .val("deactive");
        }
    }

    $wrapContent.on("click", ".content-button-check", function () {
        switch (this.value) {
            case "deactive":
                $(this)
                    .attr("value", "active")
                    .css("background-color", "#FFB700");
                switch (this.id) {
                    case "ZPN":
                        effectOnElement($footerAnzahlAnZPN, '#ZPN[value="active"]', {
                            color: "#FFB700"
                        });
                        disableButton(this, "#LFGB", "disableMainRowButton");
                        disableButton(this, "#Textilphysik", "disableMainRowButton");
                        break;
                    case "LFGB":
                        effectOnElement($footerAnzahlAnLFGB, '#LFGB[value="active"]', {
                            color: "#FFB700"
                        });
                        disableButton(this, "#ZPN", "disableMainRowButton");
                        disableButton(this, "#Textilphysik", "disableMainRowButton");
                        break;
                    case "Textilphysik":
                        effectOnElement($footerAnzahlAnTextil, '#Textilphysik[value="active"]', {
                            color: "#FFB700"
                        });
                        disableButton(this, "#ZPN", "disableMainRowButton");
                        disableButton(this, "#LFGB", "disableMainRowButton");
                        break;
                    //--------------------------------------------------------------------------------------------------------------------
                    case "content-btn-chkEx":
                        effectOnElement($footerAnzahlExpress, '#content-btn-chkEx[value="active"]', {
                            color: "#FFB700"
                        });
                        break;
                    case "content-btn-chkIntern":
                        effectOnElement($footerAnzahlIntern, '#content-btn-chkIntern[value="active"]', {
                            color: "#FFB700"
                        });
                        break;
                    case "content-btn-chkNi":
                        effectOnElement($footerAnzahlNickel, '#content-btn-chkNi[value="active"]', {
                            color: "#FFB700"
                        });
                        disableButton(this, "#content-btn-chkNickelBack", "disableMainRowButton");
                        break;
                    case "content-btn-chkLF":
                        effectOnElement($footerAnzahlLFGB, '#content-btn-chkLF[value="active"]', {
                            color: "#FFB700"
                        });
                        break;
                    case "content-btn-chkToy":
                        effectOnElement($footerAnzahlToys, '#content-btn-chkToy[value="active"]', {
                            color: "#FFB700"
                        });
                        break;
                    case "content-btn-chk60g":
                        effectOnElement($footerAnzahl60g, '#content-btn-chk60g[value="active"]', {
                            color: "#FFB700"
                        });
                        break;
                    case "content-btn-chkKlaerBack":
                        effectOnElement($footerAnzahlKlaerfall, '#content-btn-chkKlaerBack[value="active"]', {
                            color: "#FFB700"
                        });
                        break;
                    case "content-btn-chkNickelBack":
                        effectOnElement($footerAnzahlNickelBack, '#content-btn-chkNickelBack[value="active"]', {
                            color: "#FFB700"
                        });
                        disableButton(this, "#content-btn-chkNi", "disableMainRowButton");
                        break;
                    //--------------------------------------------------------------------------------------------------------------------
                    case "content-btn-zerlegungStart":
                        effectOnElement($footerAnzahlZerlegungStart, '#content-btn-zerlegungStart[value="active"]', {
                            color: "#FFB700"
                        });
                        disableButton(this, "#content-btn-zerlegungEnde", "disableMainRowButton");
                        disableButton(this, "#content-btn-einwaageBeginn", "disableMainRowButton");
                        disableButton(this, "#content-btn-einwaageEnde", "disableMainRowButton");
                        disableButton(this, "#content-btn-klaerfallBeginn", "disableMainRowButton");
                        disableButton(this, "#content-btn-klaerfallEnde", "disableMainRowButton");
                        disableButton(this, "#content-btn-manaBestellt", "disableMainRowButton");
                        disableButton(this, "#content-btn-manaErhalten", "disableMainRowButton");
                        disableButton(this, "#content-btn-manaEinwaage", "disableMainRowButton");
                        disableButton(this, "#content-btn-manaEingewogen", "disableMainRowButton");
                        disableButton(this, "#content-btn-zpnWagen", "disableMainRowButton");
                        break;

                    case "content-btn-zerlegungEnde":
                        effectOnElement($footerAnzahlZerlegungEnde, '#content-btn-zerlegungEnde[value="active"]', {
                            color: "#FFB700"
                        });
                        disableButton(this, "#content-btn-zerlegungStart", "disableMainRowButton");
                        disableButton(this, "#content-btn-einwaageBeginn", "disableMainRowButton");
                        disableButton(this, "#content-btn-einwaageEnde", "disableMainRowButton");
                        disableButton(this, "#content-btn-klaerfallBeginn", "disableMainRowButton");
                        disableButton(this, "#content-btn-klaerfallEnde", "disableMainRowButton");
                        disableButton(this, "#content-btn-manaBestellt", "disableMainRowButton");
                        disableButton(this, "#content-btn-manaErhalten", "disableMainRowButton");
                        disableButton(this, "#content-btn-manaEinwaage", "disableMainRowButton");
                        disableButton(this, "#content-btn-manaEingewogen", "disableMainRowButton");
                        disableButton(this, "#content-btn-zpnWagen", "disableMainRowButton");
                        break;

                    case "content-btn-einwaageBeginn":
                        effectOnElement($footerAnzahlEinwaageBeginn, '#content-btn-einwaageBeginn[value="active"]', {
                            color: "#FFB700"
                        });
                        disableButton(this, "#content-btn-zerlegungStart", "disableMainRowButton");
                        disableButton(this, "#content-btn-zerlegungEnde", "disableMainRowButton");
                        disableButton(this, "#content-btn-einwaageEnde", "disableMainRowButton");
                        disableButton(this, "#content-btn-klaerfallBeginn", "disableMainRowButton");
                        disableButton(this, "#content-btn-klaerfallEnde", "disableMainRowButton");
                        disableButton(this, "#content-btn-manaBestellt", "disableMainRowButton");
                        disableButton(this, "#content-btn-manaErhalten", "disableMainRowButton");
                        disableButton(this, "#content-btn-manaEinwaage", "disableMainRowButton");
                        disableButton(this, "#content-btn-manaEingewogen", "disableMainRowButton");
                        disableButton(this, "#content-btn-zpnWagen", "disableMainRowButton");
                        break;
                    case "content-btn-einwaageEnde":
                        effectOnElement($footerAnzahlEinwaageEnde, '#content-btn-einwaageEnde[value="active"]', {
                            color: "#FFB700"
                        });
                        disableButton(this, "#content-btn-zerlegungStart", "disableMainRowButton");
                        disableButton(this, "#content-btn-zerlegungEnde", "disableMainRowButton");
                        disableButton(this, "#content-btn-einwaageBeginn", "disableMainRowButton");

                        disableButton(this, "#content-btn-klaerfallBeginn", "disableMainRowButton");
                        disableButton(this, "#content-btn-klaerfallEnde", "disableMainRowButton");
                        disableButton(this, "#content-btn-manaBestellt", "disableMainRowButton");
                        disableButton(this, "#content-btn-manaErhalten", "disableMainRowButton");
                        disableButton(this, "#content-btn-manaEinwaage", "disableMainRowButton");
                        disableButton(this, "#content-btn-manaEingewogen", "disableMainRowButton");
                        disableButton(this, "#content-btn-zpnWagen", "disableMainRowButton");
                        break;

                    case "content-btn-klaerfallBeginn":
                        effectOnElement($footerAnzahlKlaerfallBeginn, '#content-btn-klaerfallBeginn[value="active"]', {
                            color: "#FFB700"
                        });
                        disableButton(this, "#content-btn-zerlegungStart", "disableMainRowButton");
                        disableButton(this, "#content-btn-zerlegungEnde", "disableMainRowButton");
                        disableButton(this, "#content-btn-einwaageBeginn", "disableMainRowButton");
                        disableButton(this, "#content-btn-einwaageEnde", "disableMainRowButton");

                        disableButton(this, "#content-btn-klaerfallEnde", "disableMainRowButton");
                        disableButton(this, "#content-btn-manaBestellt", "disableMainRowButton");
                        disableButton(this, "#content-btn-manaErhalten", "disableMainRowButton");
                        disableButton(this, "#content-btn-manaEinwaage", "disableMainRowButton");
                        disableButton(this, "#content-btn-manaEingewogen", "disableMainRowButton");
                        disableButton(this, "#content-btn-zpnWagen", "disableMainRowButton");
                        break;
                    case "content-btn-klaerfallEnde":
                        effectOnElement($footerAnzahlKlaerfallEnde, '#content-btn-klaerfallEnde[value="active"]', {
                            color: "#FFB700"
                        });
                        disableButton(this, "#content-btn-zerlegungStart", "disableMainRowButton");
                        disableButton(this, "#content-btn-zerlegungEnde", "disableMainRowButton");
                        disableButton(this, "#content-btn-einwaageBeginn", "disableMainRowButton");
                        disableButton(this, "#content-btn-einwaageEnde", "disableMainRowButton");
                        disableButton(this, "#content-btn-klaerfallBeginn", "disableMainRowButton");

                        disableButton(this, "#content-btn-manaBestellt", "disableMainRowButton");
                        disableButton(this, "#content-btn-manaErhalten", "disableMainRowButton");
                        disableButton(this, "#content-btn-manaEinwaage", "disableMainRowButton");
                        disableButton(this, "#content-btn-manaEingewogen", "disableMainRowButton");
                        disableButton(this, "#content-btn-zpnWagen", "disableMainRowButton");
                        break;
                    case "content-btn-manaBestellt":
                        effectOnElement($footerAnzahlManaBestellt, '#content-btn-manaBestellt[value="active"]', {
                            color: "#FFB700"
                        });
                        disableButton(this, "#content-btn-zerlegungStart", "disableMainRowButton");
                        disableButton(this, "#content-btn-zerlegungEnde", "disableMainRowButton");
                        disableButton(this, "#content-btn-einwaageBeginn", "disableMainRowButton");
                        disableButton(this, "#content-btn-einwaageEnde", "disableMainRowButton");
                        disableButton(this, "#content-btn-klaerfallBeginn", "disableMainRowButton");
                        disableButton(this, "#content-btn-klaerfallEnde", "disableMainRowButton");

                        disableButton(this, "#content-btn-manaErhalten", "disableMainRowButton");
                        disableButton(this, "#content-btn-manaEinwaage", "disableMainRowButton");
                        disableButton(this, "#content-btn-manaEingewogen", "disableMainRowButton");
                        disableButton(this, "#content-btn-zpnWagen", "disableMainRowButton");
                        break;
                    case "content-btn-manaErhalten":
                        effectOnElement($footerAnzahlManaErhalten, '#content-btn-manaErhalten[value="active"]', {
                            color: "#FFB700"
                        });
                        disableButton(this, "#content-btn-zerlegungStart", "disableMainRowButton");
                        disableButton(this, "#content-btn-zerlegungEnde", "disableMainRowButton");
                        disableButton(this, "#content-btn-einwaageBeginn", "disableMainRowButton");
                        disableButton(this, "#content-btn-einwaageEnde", "disableMainRowButton");
                        disableButton(this, "#content-btn-klaerfallBeginn", "disableMainRowButton");
                        disableButton(this, "#content-btn-klaerfallEnde", "disableMainRowButton");
                        disableButton(this, "#content-btn-manaBestellt", "disableMainRowButton");

                        disableButton(this, "#content-btn-manaEinwaage", "disableMainRowButton");
                        disableButton(this, "#content-btn-manaEingewogen", "disableMainRowButton");
                        disableButton(this, "#content-btn-zpnWagen", "disableMainRowButton");
                        break;
                    case "content-btn-manaEinwaage":
                        effectOnElement($footerAnzahlManaEinwaage, '#content-btn-manaEinwaage[value="active"]', {
                            color: "#FFB700"
                        });
                        disableButton(this, "#content-btn-zerlegungStart", "disableMainRowButton");
                        disableButton(this, "#content-btn-zerlegungEnde", "disableMainRowButton");
                        disableButton(this, "#content-btn-einwaageBeginn", "disableMainRowButton");
                        disableButton(this, "#content-btn-einwaageEnde", "disableMainRowButton");
                        disableButton(this, "#content-btn-klaerfallBeginn", "disableMainRowButton");
                        disableButton(this, "#content-btn-klaerfallEnde", "disableMainRowButton");
                        disableButton(this, "#content-btn-manaBestellt", "disableMainRowButton");
                        disableButton(this, "#content-btn-manaErhalten", "disableMainRowButton");

                        disableButton(this, "#content-btn-manaEingewogen", "disableMainRowButton");
                        disableButton(this, "#content-btn-zpnWagen", "disableMainRowButton");
                        break;
                    case "content-btn-manaEingewogen":
                        effectOnElement($footerAnzahlManaEingewogen, '#content-btn-manaEingewogen[value="active"]', {
                            color: "#FFB700"
                        });
                        disableButton(this, "#content-btn-zerlegungStart", "disableMainRowButton");
                        disableButton(this, "#content-btn-zerlegungEnde", "disableMainRowButton");
                        disableButton(this, "#content-btn-einwaageBeginn", "disableMainRowButton");
                        disableButton(this, "#content-btn-einwaageEnde", "disableMainRowButton");
                        disableButton(this, "#content-btn-klaerfallBeginn", "disableMainRowButton");
                        disableButton(this, "#content-btn-klaerfallEnde", "disableMainRowButton");
                        disableButton(this, "#content-btn-manaBestellt", "disableMainRowButton");
                        disableButton(this, "#content-btn-manaErhalten", "disableMainRowButton");
                        disableButton(this, "#content-btn-manaEinwaage", "disableMainRowButton");

                        disableButton(this, "#content-btn-zpnWagen", "disableMainRowButton");
                        break;
                    case "content-btn-zpnWagen":
                        disableButton(this, "#content-btn-zerlegungStart", "disableMainRowButton");
                        disableButton(this, "#content-btn-zerlegungEnde", "disableMainRowButton");
                        disableButton(this, "#content-btn-einwaageBeginn", "disableMainRowButton");
                        disableButton(this, "#content-btn-klaerfallBeginn", "disableMainRowButton");
                        disableButton(this, "#content-btn-klaerfallEnde", "disableMainRowButton");
                        disableButton(this, "#content-btn-manaBestellt", "disableMainRowButton");
                        disableButton(this, "#content-btn-manaErhalten", "disableMainRowButton");
                        disableButton(this, "#content-btn-manaEinwaage", "disableMainRowButton");
                        disableButton(this, "#content-btn-manaEingewogen", "disableMainRowButton");
                        activateButton(this, "#content-btn-einwaageEnde");
                        effectOnElement($footerAnzahlZpnWagen, '#content-btn-zpnWagen[value="active"]', {
                            color: "#FFB700"
                        });
                        effectOnElement($footerAnzahlEinwaageEnde, '#content-btn-einwaageEnde[value="active"]', {
                            color: "#FFB700"
                        });
                        break;
                    default:
                }
                break;
            case "active":
                $(this)
                    .attr("value", "deactive")
                    .css("background-color", "#ededed");
                switch (this.id) {
                    case "ZPN":
                        effectOnElement($footerAnzahlAnZPN, '#ZPN[value="active"]', {
                            color: "#FF3100"
                        });
                        enableButton(this, "#LFGB", "disableMainRowButton");
                        enableButton(this, "#Textilphysik", "disableMainRowButton");
                        break;
                    case "LFGB":
                        effectOnElement($footerAnzahlAnLFGB, '#LFGB[value="active"]', {
                            color: "#FF3100"
                        });
                        enableButton(this, "#ZPN", "disableMainRowButton");
                        enableButton(this, "#Textilphysik", "disableMainRowButton");
                        break;
                    case "Textilphysik":
                        effectOnElement($footerAnzahlAnTextil, '#Textilphysik[value="active"]', {
                            color: "#FF3100"
                        });
                        enableButton(this, "#ZPN", "disableMainRowButton");
                        enableButton(this, "#LFGB", "disableMainRowButton");
                        break;
                    //--------------------------------------------------------------------------------------------------------------------
                    case "content-btn-chkEx":
                        effectOnElement($footerAnzahlExpress, '#content-btn-chkEx[value="active"]', {
                            color: "#FF3100"
                        });
                        break;
                    case "content-btn-chkIntern":
                        effectOnElement($footerAnzahlIntern, '#content-btn-chkIntern[value="active"]', {
                            color: "#FF3100"
                        });
                        break;
                    case "content-btn-chkNi":
                        effectOnElement($footerAnzahlNickel, '#content-btn-chkNi[value="active"]', {
                            color: "#FF3100"
                        });
                        enableButton(this, "#content-btn-chkNickelBack", "disableMainRowButton");
                        break;
                    case "content-btn-chkLF":
                        effectOnElement($footerAnzahlLFGB, '#content-btn-chkLF[value="active"]', {
                            color: "#FF3100"
                        });
                        break;
                    case "content-btn-chkToy":
                        effectOnElement($footerAnzahlToys, '#content-btn-chkToy[value="active"]', {
                            color: "#FF3100"
                        });
                        break;
                    case "content-btn-chk60g":
                        effectOnElement($footerAnzahl60g, '#content-btn-chk60g[value="active"]', {
                            color: "#FF3100"
                        });
                        break;
                    case "content-btn-chkKlaerBack":
                        effectOnElement($footerAnzahlKlaerfall, '#content-btn-chkKlaerBack[value="active"]', {
                            color: "#FF3100"
                        });
                        break;
                    case "content-btn-chkNickelBack":
                        effectOnElement($footerAnzahlNickelBack, '#content-btn-chkNickelBack[value="active"]', {
                            color: "#FF3100"
                        });
                        enableButton(this, "#content-btn-chkNi", "disableMainRowButton");
                        break;
                    //--------------------------------------------------------------------------------------------------------------------
                    case "content-btn-zerlegungStart":
                        effectOnElement($footerAnzahlZerlegungStart, '#content-btn-zerlegungStart[value="active"]', {
                            color: "#FF3100"
                        });

                        enableButton(this, "#content-btn-zerlegungEnde", "disableMainRowButton");
                        enableButton(this, "#content-btn-einwaageBeginn", "disableMainRowButton");
                        enableButton(this, "#content-btn-einwaageEnde", "disableMainRowButton");
                        enableButton(this, "#content-btn-klaerfallBeginn", "disableMainRowButton");
                        enableButton(this, "#content-btn-klaerfallEnde", "disableMainRowButton");
                        enableButton(this, "#content-btn-manaBestellt", "disableMainRowButton");
                        enableButton(this, "#content-btn-manaErhalten", "disableMainRowButton");
                        enableButton(this, "#content-btn-manaEinwaage", "disableMainRowButton");
                        enableButton(this, "#content-btn-manaEingewogen", "disableMainRowButton");
                        enableButton(this, "#content-btn-zpnWagen", "disableMainRowButton");
                        break;
                    case "content-btn-zerlegungEnde":
                        effectOnElement($footerAnzahlZerlegungEnde, '#content-btn-zerlegungEnde[value="active"]', {
                            color: "#FF3100"
                        });
                        enableButton(this, "#content-btn-zerlegungStart", "disableMainRowButton");

                        enableButton(this, "#content-btn-einwaageBeginn", "disableMainRowButton");
                        enableButton(this, "#content-btn-einwaageEnde", "disableMainRowButton");
                        enableButton(this, "#content-btn-klaerfallBeginn", "disableMainRowButton");
                        enableButton(this, "#content-btn-klaerfallEnde", "disableMainRowButton");
                        enableButton(this, "#content-btn-manaBestellt", "disableMainRowButton");
                        enableButton(this, "#content-btn-manaErhalten", "disableMainRowButton");
                        enableButton(this, "#content-btn-manaEinwaage", "disableMainRowButton");
                        enableButton(this, "#content-btn-manaEingewogen", "disableMainRowButton");
                        enableButton(this, "#content-btn-zpnWagen", "disableMainRowButton");
                        break;
                    case "content-btn-einwaageBeginn":
                        effectOnElement($footerAnzahlEinwaageBeginn, '#content-btn-einwaageBeginn[value="active"]', {
                            color: "#FF3100"
                        });
                        enableButton(this, "#content-btn-zerlegungStart", "disableMainRowButton");
                        enableButton(this, "#content-btn-zerlegungEnde", "disableMainRowButton");

                        enableButton(this, "#content-btn-einwaageEnde", "disableMainRowButton");
                        enableButton(this, "#content-btn-klaerfallBeginn", "disableMainRowButton");
                        enableButton(this, "#content-btn-klaerfallEnde", "disableMainRowButton");
                        enableButton(this, "#content-btn-manaBestellt", "disableMainRowButton");
                        enableButton(this, "#content-btn-manaErhalten", "disableMainRowButton");
                        enableButton(this, "#content-btn-manaEinwaage", "disableMainRowButton");
                        enableButton(this, "#content-btn-manaEingewogen", "disableMainRowButton");
                        enableButton(this, "#content-btn-zpnWagen", "disableMainRowButton");
                        break;
                    case "content-btn-einwaageEnde":
                        effectOnElement($footerAnzahlEinwaageEnde, '#content-btn-einwaageEnde[value="active"]', {
                            color: "#FF3100"
                        });
                        enableButton(this, "#content-btn-zerlegungStart", "disableMainRowButton");
                        enableButton(this, "#content-btn-zerlegungEnde", "disableMainRowButton");
                        enableButton(this, "#content-btn-einwaageBeginn", "disableMainRowButton");

                        enableButton(this, "#content-btn-klaerfallBeginn", "disableMainRowButton");
                        enableButton(this, "#content-btn-klaerfallEnde", "disableMainRowButton");
                        enableButton(this, "#content-btn-manaBestellt", "disableMainRowButton");
                        enableButton(this, "#content-btn-manaErhalten", "disableMainRowButton");
                        enableButton(this, "#content-btn-manaEinwaage", "disableMainRowButton");
                        enableButton(this, "#content-btn-manaEingewogen", "disableMainRowButton");
                        enableButton(this, "#content-btn-zpnWagen", "disableMainRowButton");
                        break;

                    case "content-btn-klaerfallBeginn":
                        effectOnElement($footerAnzahlKlaerfallBeginn, '#content-btn-klaerfallBeginn[value="active"]', {
                            color: "#FF3100"
                        });
                        enableButton(this, "#content-btn-zerlegungStart", "disableMainRowButton");
                        enableButton(this, "#content-btn-zerlegungEnde", "disableMainRowButton");
                        enableButton(this, "#content-btn-einwaageBeginn", "disableMainRowButton");
                        enableButton(this, "#content-btn-einwaageEnde", "disableMainRowButton");

                        enableButton(this, "#content-btn-klaerfallEnde", "disableMainRowButton");
                        enableButton(this, "#content-btn-manaBestellt", "disableMainRowButton");
                        enableButton(this, "#content-btn-manaErhalten", "disableMainRowButton");
                        enableButton(this, "#content-btn-manaEinwaage", "disableMainRowButton");
                        enableButton(this, "#content-btn-manaEingewogen", "disableMainRowButton");
                        enableButton(this, "#content-btn-zpnWagen", "disableMainRowButton");
                        break;
                    case "content-btn-klaerfallEnde":
                        effectOnElement($footerAnzahlKlaerfallEnde, '#content-btn-klaerfallEnde[value="active"]', {
                            color: "#FF3100"
                        });
                        enableButton(this, "#content-btn-zerlegungStart", "disableMainRowButton");
                        enableButton(this, "#content-btn-zerlegungEnde", "disableMainRowButton");
                        enableButton(this, "#content-btn-einwaageBeginn", "disableMainRowButton");
                        enableButton(this, "#content-btn-einwaageEnde", "disableMainRowButton");
                        enableButton(this, "#content-btn-klaerfallBeginn", "disableMainRowButton");

                        enableButton(this, "#content-btn-manaBestellt", "disableMainRowButton");
                        enableButton(this, "#content-btn-manaErhalten", "disableMainRowButton");
                        enableButton(this, "#content-btn-manaEinwaage", "disableMainRowButton");
                        enableButton(this, "#content-btn-manaEingewogen", "disableMainRowButton");
                        enableButton(this, "#content-btn-zpnWagen", "disableMainRowButton");
                        break;
                    case "content-btn-manaBestellt":
                        effectOnElement($footerAnzahlManaBestellt, '#content-btn-manaBestellt[value="active"]', {
                            color: "#FF3100"
                        });
                        enableButton(this, "#content-btn-zerlegungStart", "disableMainRowButton");
                        enableButton(this, "#content-btn-zerlegungEnde", "disableMainRowButton");
                        enableButton(this, "#content-btn-einwaageBeginn", "disableMainRowButton");
                        enableButton(this, "#content-btn-einwaageEnde", "disableMainRowButton");
                        enableButton(this, "#content-btn-klaerfallBeginn", "disableMainRowButton");
                        enableButton(this, "#content-btn-klaerfallEnde", "disableMainRowButton");

                        enableButton(this, "#content-btn-manaErhalten", "disableMainRowButton");
                        enableButton(this, "#content-btn-manaEinwaage", "disableMainRowButton");
                        enableButton(this, "#content-btn-manaEingewogen", "disableMainRowButton");
                        enableButton(this, "#content-btn-zpnWagen", "disableMainRowButton");
                        break;
                    case "content-btn-manaErhalten":
                        effectOnElement($footerAnzahlManaErhalten, '#content-btn-manaErhalten[value="active"]', {
                            color: "#FF3100"
                        });
                        enableButton(this, "#content-btn-zerlegungStart", "disableMainRowButton");
                        enableButton(this, "#content-btn-zerlegungEnde", "disableMainRowButton");
                        enableButton(this, "#content-btn-einwaageBeginn", "disableMainRowButton");
                        enableButton(this, "#content-btn-einwaageEnde", "disableMainRowButton");
                        enableButton(this, "#content-btn-klaerfallBeginn", "disableMainRowButton");
                        enableButton(this, "#content-btn-klaerfallEnde", "disableMainRowButton");
                        enableButton(this, "#content-btn-manaBestellt", "disableMainRowButton");

                        enableButton(this, "#content-btn-manaEinwaage", "disableMainRowButton");
                        enableButton(this, "#content-btn-manaEingewogen", "disableMainRowButton");
                        enableButton(this, "#content-btn-zpnWagen", "disableMainRowButton");
                        break;
                    case "content-btn-manaEinwaage":
                        effectOnElement($footerAnzahlManaEinwaage, '#content-btn-manaEinwaage[value="active"]', {
                            color: "#FF3100"
                        });
                        enableButton(this, "#content-btn-zerlegungStart", "disableMainRowButton");
                        enableButton(this, "#content-btn-zerlegungEnde", "disableMainRowButton");
                        enableButton(this, "#content-btn-einwaageBeginn", "disableMainRowButton");
                        enableButton(this, "#content-btn-einwaageEnde", "disableMainRowButton");
                        enableButton(this, "#content-btn-klaerfallBeginn", "disableMainRowButton");
                        enableButton(this, "#content-btn-klaerfallEnde", "disableMainRowButton");
                        enableButton(this, "#content-btn-manaBestellt", "disableMainRowButton");
                        enableButton(this, "#content-btn-manaErhalten", "disableMainRowButton");

                        enableButton(this, "#content-btn-manaEingewogen", "disableMainRowButton");
                        enableButton(this, "#content-btn-zpnWagen", "disableMainRowButton");
                        break;
                    case "content-btn-manaEingewogen":
                        effectOnElement($footerAnzahlManaEingewogen, '#content-btn-manaEingewogen[value="active"]', {
                            color: "#FF3100"
                        });
                        enableButton(this, "#content-btn-zerlegungStart", "disableMainRowButton");
                        enableButton(this, "#content-btn-zerlegungEnde", "disableMainRowButton");
                        enableButton(this, "#content-btn-einwaageBeginn", "disableMainRowButton");
                        enableButton(this, "#content-btn-einwaageEnde", "disableMainRowButton");
                        enableButton(this, "#content-btn-klaerfallBeginn", "disableMainRowButton");
                        enableButton(this, "#content-btn-klaerfallEnde", "disableMainRowButton");
                        enableButton(this, "#content-btn-manaBestellt", "disableMainRowButton");
                        enableButton(this, "#content-btn-manaErhalten", "disableMainRowButton");
                        enableButton(this, "#content-btn-manaEinwaage", "disableMainRowButton");

                        enableButton(this, "#content-btn-zpnWagen", "disableMainRowButton");
                        break;
                    case "content-btn-zpnWagen":
                        enableButton(this, "#content-btn-zerlegungStart", "disableMainRowButton");
                        enableButton(this, "#content-btn-zerlegungEnde", "disableMainRowButton");
                        enableButton(this, "#content-btn-einwaageBeginn", "disableMainRowButton");
                        enableButton(this, "#content-btn-klaerfallBeginn", "disableMainRowButton");
                        enableButton(this, "#content-btn-klaerfallEnde", "disableMainRowButton");
                        enableButton(this, "#content-btn-manaBestellt", "disableMainRowButton");
                        enableButton(this, "#content-btn-manaErhalten", "disableMainRowButton");
                        enableButton(this, "#content-btn-manaEinwaage", "disableMainRowButton");
                        enableButton(this, "#content-btn-manaEingewogen", "disableMainRowButton");
                        deactiveButton(this, "#content-btn-einwaageEnde");
                        effectOnElement($footerAnzahlZpnWagen, '#content-btn-zpnWagen[value="active"]', {
                            color: "#FF3100"
                        });
                        effectOnElement($footerAnzahlEinwaageEnde, '#content-btn-einwaageEnde[value="active"]', {
                            color: "#FF3100"
                        });
                        break;
                    default:
                }
                break;
            default:
        }
        backToInput();
    });

    //Nach auslösen des Confirm Button wird die im Footer Anzahl angezeigten Zahlen angepasst.
    $wrapContent.on("click", "#hidden-row-confirm-button", function () {
        const selectedRowCheckedButtons = $(this)
            .closest("#content-main-row")
            .find(".content-button-check");

        $.each(selectedRowCheckedButtons, function () {
            switch (this.value) {
                case "active":
                    $(this)
                        .attr("value", "deactive")
                        .css("background-color", "#ededed");
                    switch (this.id) {
                        case "ZPN":
                            effectOnElement($footerAnzahlAnZPN, '#ZPN[value="active"]', {
                                color: "#FF3100"
                            });
                            break;
                        case "LFGB":
                            effectOnElement($footerAnzahlAnLFGB, '#LFGB[value="active"]', {
                                color: "#FF3100"
                            });
                            break;
                        case "Textilphysik":
                            effectOnElement($footerAnzahlAnTextil, '#Textilphysik[value="active"]', {
                                color: "#FF3100"
                            });
                            break;
                        //--------------------------------------------------------------------------------------------------------------------
                        case "content-btn-chkEx":
                            effectOnElement($footerAnzahlExpress, '#content-btn-chkEx[value="active"]', {
                                color: "#FF3100"
                            });
                            break;
                        case "content-btn-chkIntern":
                            effectOnElement($footerAnzahlIntern, '#content-btn-chkIntern[value="active"]', {
                                color: "#FF3100"
                            });
                            break;
                        case "content-btn-chkNi":
                            effectOnElement($footerAnzahlNickel, '#content-btn-chkNi[value="active"]', {
                                color: "#FF3100"
                            });
                            break;
                        case "content-btn-chkLF":
                            effectOnElement($footerAnzahlLFGB, '#content-btn-chkLF[value="active"]', {
                                color: "#FF3100"
                            });
                            break;
                        case "content-btn-chkToy":
                            effectOnElement($footerAnzahlToys, '#content-btn-chkToy[value="active"]', {
                                color: "#FF3100"
                            });
                            break;
                        case "content-btn-chk60g":
                            effectOnElement($footerAnzahl60g, '#content-btn-chk60g[value="active"]', {
                                color: "#FF3100"
                            });
                            break;
                        case "content-btn-chkKlaerBack":
                            effectOnElement($footerAnzahlKlaerfall, '#content-btn-chkKlaerBack[value="active"]', {
                                color: "#FF3100"
                            });
                            break;
                        case "content-btn-chkNickelBack":
                            effectOnElement($footerAnzahlNickelBack, '#content-btn-chkNickelBack[value="active"]', {
                                color: "#FF3100"
                            });
                            break;
                        //--------------------------------------------------------------------------------------------------------------------
                        case "content-btn-zerlegungStart":
                            effectOnElement($footerAnzahlZerlegungStart, '#content-btn-zerlegungStart[value="active"]', {
                                color: "#FF3100"
                            });
                            break;
                        case "content-btn-zerlegungEnde":
                            effectOnElement($footerAnzahlZerlegungEnde, '#content-btn-zerlegungEnde[value="active"]', {
                                color: "#FF3100"
                            });
                            break;
                        case "content-btn-einwaageBeginn":
                            effectOnElement($footerAnzahlEinwaageBeginn, '#content-btn-einwaageBeginn[value="active"]', {
                                color: "#FF3100"
                            });
                            break;
                        case "content-btn-einwaageEnde":
                            effectOnElement($footerAnzahlEinwaageEnde, '#content-btn-einwaageEnde[value="active"]', {
                                color: "#FF3100"
                            });
                            break;
                        case "content-btn-nickelBack":
                            effectOnElement($footerAnzahlNickelBack, '#content-btn-nickelBack[value="active"]', {
                                color: "#FF3100"
                            });
                            break;
                        case "content-btn-klaerfallBeginn":
                            effectOnElement($footerAnzahlKlaerfallBeginn, '#content-btn-klaerfallBeginn[value="active"]', {
                                color: "#FF3100"
                            });
                            break;
                        case "content-btn-klaerfallEnde":
                            effectOnElement($footerAnzahlKlaerfallEnde, '#content-btn-klaerfallEnde[value="active"]', {
                                color: "#FF3100"
                            });
                            break;
                        case "content-btn-manaBestellt":
                            effectOnElement($footerAnzahlManaBestellt, '#content-btn-manaBestellt[value="active"]', {
                                color: "#FF3100"
                            });
                            break;
                        case "content-btn-manaErhalten":
                            effectOnElement($footerAnzahlManaErhalten, '#content-btn-manaErhalten[value="active"]', {
                                color: "#FF3100"
                            });
                            break;
                        case "content-btn-manaEinwaage":
                            effectOnElement($footerAnzahlManaEinwaage, '#content-btn-manaEinwaage[value="active"]', {
                                color: "#FF3100"
                            });
                            break;
                        case "content-btn-manaEingewogen":
                            effectOnElement($footerAnzahlManaEingewogen, '#content-btn-manaEingewogen[value="active"]', {
                                color: "#FF3100"
                            });
                            break;
                        case "content-btn-zpnWagen":
                            effectOnElement($footerAnzahlZpnWagen, '#content-btn-zpnWagen[value="active"]', {
                                color: "#FF3100"
                            });
                            break;
                        default:
                    }
                    break;
                default:
            }
        });
    });
    backToInput();
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
                    this.css({
                        display: ""
                    });
                    $(selectedRow)
                        .closest("#content-main-row")
                        .remove();
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
                $(selectedRow)
                    .closest("#content-main-row")
                    .remove();
                backToInput();
            });
    }
};

//
// //Mit einem Slide Effekt wird die bestätigung der löschung des Selektierten Datensatz abgefragt.
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


document.addEventListener('DOMContentLoaded', function () {
    regexInput();
    checkInput();
    countCheckedButtons();
    highlightSelectedRow();
    confirmDelete();
    showCloseModal.showModal();
    showCloseModal.closeModal();
    updateStatusButton();
    updateKommentar();
});
