$(document).ready(function () {
    //                                                                                                                                            
    //Fähr die Detailansicht hoch und runter
    function toggleDetails() {
        const $mainContentDetails = $('.main-content.details');
        const $detailsOpenButton = $('#details-open-button');

        $detailsOpenButton.on('click', function () {
            $mainContentDetails.toggleClass('transition');
        });
    }

    //                                                                                                                                            
    //Stellt sicher das nur Zahlen in die Inputbox eingetragen werden können.
    function regexInput() {
        //noRegEx gibt an welche Zeichen nicht eingegeben werden können.
        const noRegEx = /[^0-9;.-]/g;
        const $headerInputEingang = $('#header-input-verwaltung');

        $headerInputEingang.on('keyup', function () {
            //Überprüft die Eingabe der Inputbox und ersetzt die Eingabe von Buchstaben und ungewünschten Zeichen mit einem leeren Zeichen.
            if (noRegEx.test(this.value)) {
                $headerInputEingang.val(this.value.replace(noRegEx, ''))
                    .effect('highlight', {
                        color: '#FF3100'
                    }, 200);
            }
        });
    }

    //                                                                                                                                            
    //Zeigt eine entsprechende Fehlermeldung an
    const showFailMessage = {
        $headerFailMessageWrap: $('#header-fail-message-wrap'),
        $headerFailMessageContent: $('#header-fail-message-content'),
        $headerInputEingang: $('#header-input-eingang'),
        $wrapContent: $('#wrap-content'),

        failMessage: function (errorClassType, setTimeoutTimer, failItem) {
            this.$headerFailMessageContent.html(failItem).addClass(errorClassType);
            this.$headerFailMessageWrap.addClass('transition');
            setTimeout(() => {
                this.$headerFailMessageWrap.removeClass('transition');
                setTimeout(() => {
                    this.$headerFailMessageContent.html("").removeClass(errorClassType);
                }, 330);
            }, setTimeoutTimer);
        },
    };

    //                                                                                                                                            
    //Prüft ob die Eingabe in das Input Feld einer Probenummer entspricht.
    function inputVerwaltungCheck() {
        const $headerInputEingang = $('#header-input-verwaltung');

        $headerInputEingang.focus();

        //Enter Taste in der Inputbox wird betätigt.
        $headerInputEingang.on('keyup', function (pressedKey) {
            if (pressedKey.keyCode === 13) {
                //Speichert den Inhalt der Inputbox in der Variable "inputText".
                const inputText = $headerInputEingang.val();

                //Eingabe Muster einer Probennummer entspricht
                const minYesRegEx = /\d{2}\d{6}\d{2}/;
                const maxYesRegEx = /\d{2}-\d{6}-\d{2}/;
                //Eingabe länge einer Probennummer beträgt 23 Zeichen.
                const minCharacter = 10;
                const maxCharacter = 12;

                resetDetails();

                if (inputText.match(minYesRegEx) && inputText.length === minCharacter) {
                    const stripedInputText = inputText.substring(0, 2) + "-" + inputText.substring(2, 8) + "-" + inputText.substring(8, 10);
                    searchDataSet(stripedInputText);
                } else if (inputText.match(maxYesRegEx) && inputText.length === maxCharacter) {
                    searchDataSet(inputText);
                } else {
                    showFailMessage.failMessage('fail-input', 5000);
                }
            }
        });
    }

    //                                                                                                                                            
    //Leert alle Zeit Angaben der Verwaltungs Anzeige
    function resetDetails() {
        const $classDetailsStatusButton = $('.details-status-button');
        const $mainMiddleItems = $('.main-middle-item');

        const $detailsOpenButtonWrap = $('#detailsOpenButtonWrap');
        const $mainContentMiddleWrap = $('#mainContentMiddleWrap');

        const $commentText = $('#comment-text');

        const $middleItemProbenNahme = $('#main-middle-item-probenNahme');
        const $middleItemNickel = $('#main-middle-item-nickel');

        const $classTimingDate = $('.span-timing-date');
        const $classTimingTime = $('.span-timing-time');

        const $classSpanInputTextProbenummer = $('.span-input-text-probenummer');
        const $classSpanTextSollDatum = $('.span-input-text-solldatum');

        $classTimingDate.html(' - ');
        $classTimingTime.html(' - ');
        $classSpanInputTextProbenummer.html("");
        $classSpanTextSollDatum.html("");
        $commentText.html("");

        $classDetailsStatusButton.each(function () {
            $(this)
                .removeClass('active')
                .addClass('deactive');
        });

        $mainMiddleItems.each(function () {
            $(this)
                .removeClass('started stopped done restarted')
                .addClass('default')
                .val('default');
        });

        // $detailsOpenButtonWrap.hasClass('transition') ? "" : $detailsOpenButtonWrap.add($mainContentMiddleWrap).addClass('transition');
    }

    //                                                                                                                                            
    //Übergibt die eingebene Probenummer an das PHP script und gleicht die Nummer mit der Datenbank ab.
    function searchDataSet(inputText) {

        resetDetails();

        const $headerInputField = $('#header-input-verwaltung');

        const ajaxRequest = $.ajax({
            url: '../php/db-search.php',
            method: 'POST',
            data: {
                getStatusItems: inputText
            },
            dataType: 'json'
        });

        ajaxRequest.done(function (data) {
            console.log(data);

            // const $headerInputField = $('#header-input-verwaltung');
            $headerInputField.effect('highlight', {
                color: '#FFB700'
            }, 200);

            if (data.success === true) {
                const $mainButtonProbenNahme = $('#main-middle-item-probenNahme');
                const $mainButtonNickel = $('#main-middle-item-nickel');
                const $mainButtonKlaerfall = $('#main-middle-item-klaerfall');
                const $mainButtonMana = $('#main-middle-item-maNa');
                const $mainButtonZpnWagen = $('#main-middle-item-zpnWagen');
                const $mainButtonKommentar = $('#comment-send-button');

                const $detailsOpenButtonWrap = $('#detailsOpenButtonWrap');
                const $mainContentMiddleWrap = $('#mainContentMiddleWrap');

                var toFillTimingSpansObject = {
                    eingangDate: $('#span-timing-date-eingang'),
                    eingangTime: $('#span-timing-time-eingang'),

                    gesamtInZPN: $('#gesamt-timing-ZPNWagen'),
                    gesamtKlaerfall: $('#gesamt-timing-klaerfall'),
                    gesamtManaAnfrage: $('#gesamt-timing-manaAnfrag'),
                    gesamtManaDauer: $('#gesamt-timing-manaGesamt'),
                    gesamtNickel: $('#gesamt-timing-nickel'),
                    gesamtProbenNahme: $('#gesamt-timing-probenahme'),

                    klaefallBeginnDate: $('#span-timing-date-klaerfallGestellt'),
                    klaefallBeginnTime: $('#span-timing-time-klaerfallGestellt'),
                    klaerfallEndeDate: $('#span-timing-date-klaerfallErhalten'),
                    klaerfallEndeTime: $('#span-timing-time-klaerfallErhalten'),

                    // kommentarDate: "",
                    kommentarText: $('#comment-text'),
                    // kommentarTime: "",

                    maNaErhaltenDate: $('#span-timing-date-maNaErhalten'),
                    maNaErhaltenTime: $('#span-timing-time-maNaErhalten'),
                    maNaGestelltDate: $('#span-timing-date-maNaAngefordert'),
                    maNaGestelltTime: $('#span-timing-time-maNaAngefordert'),
                    maNaZpnWagenDate: $('#span-timing-date-maNaEingewogen'),
                    maNaZpnWagenTime: $('#span-timing-time-maNaEingewogen'),

                    nickelRueckgabeDate: $('#span-timing-date-nickelRueckgabeDateTime'),
                    nickelRueckgabeTime: $('#span-timing-time-nickelRueckgabeDateTime'),

                    probenNahmeBeginnDate: $('#span-timing-date-probenNahme'),
                    probenNahmeBeginnTime: $('#span-timing-time-probenNahme'),
                    probenNahmeEndeDate: $('#span-timing-date-probenNahmeEnde'),
                    probenNahmeEndeTime: $('#span-timing-time-probenNahmeEnde'),

                    sollDatum: $('#span-input-text-solldatum'),
                    probenNummerPK: $('#span-input-text-probenummer'),

                    zpnWagenDate: $('#span-timing-date-zpnWagen'),
                    zpnWagenTime: $('#span-timing-time-zpnWagen'),
                }

                var toFillStatusObject = {
                    mit60g: $('#mit60g'),
                    mitExpress: $('#mitExpress'),
                    mitIntern: $('#mitIntern'),
                    mitLfgb: $('#mitLfgb'),
                    mitNickel: $('#mitNickel'),
                    mitToys: $('#mitToys'),
                }

                var toFillOnOffStatusMiddleItems = {
                    onOffStatusKlaerfall: $('#main-middle-item-klaerfall'),
                    onOffStatusKommentar: $('#comment-send-button'),
                    onOffStatusManaErhalten: $('#main-middle-item-maNa'),
                    onOffStatusManaWagen: $('#main-middle-item-maNa'),
                    onOffStatusNickelRueckgabe: $('#main-middle-item-nickel'),
                    onOffStatusProbenNahme: $('#main-middle-item-probenNahme'),
                    onOffStatusZpnWagen: $('#main-middle-item-zpnWagen'),
                    // onOffStatusStorno: '',
                }

                var receivedSQLItems = data.successItem;

                $detailsOpenButtonWrap.hasClass('transition') ? "" : $detailsOpenButtonWrap.add($mainContentMiddleWrap).addClass('transition');

                $.map(receivedSQLItems, function (receivedSQLItemsValue, receivedSQLItemsKey) {
                    $.map(toFillTimingSpansObject, function (toFillTimingSpansValue, toFillTimingSpansKey) {
                        switch (toFillTimingSpansKey) {
                            case receivedSQLItemsKey:
                                toFillTimingSpansValue.html(receivedSQLItemsValue);
                                delete toFillTimingSpansObject[toFillTimingSpansKey];
                                delete receivedSQLItems[receivedSQLItemsKey];
                                break;

                        }
                    });

                    $.map(toFillStatusObject, function (statusObjectValue, statusObjectKey) {
                        switch (statusObjectKey) {
                            case receivedSQLItemsKey:
                                statusObjectValue
                                    .attr('value', receivedSQLItemsValue)
                                    .removeClass('deactive')
                                    .addClass('active');
                                delete toFillStatusObject[statusObjectKey];
                                delete receivedSQLItems[receivedSQLItemsKey];
                                break;

                            default:
                        }
                    });

                    $.map(toFillOnOffStatusMiddleItems, function (statusMiddleButtonValue, statusMiddleButtonKey) {
                        switch (statusMiddleButtonKey) {
                            case receivedSQLItemsKey:
                                statusMiddleButtonValue
                                    .attr('value', receivedSQLItemsValue)
                                    .removeClass('default started done restarted')
                                    .addClass(receivedSQLItemsValue);
                                delete toFillOnOffStatusMiddleItems[statusMiddleButtonKey];
                                delete receivedSQLItems[receivedSQLItemsKey];
                                break;

                            default:
                        }
                    });
                });

            } else if (data.success === false) {
                $headerInputField.effect('highlight', {
                    color: '#FF3100'
                }, 200);

                switch (data.failCode) {
                    case "no-entry":
                        showFailMessage.failMessage('no-entry', 4000, data.failItem);
                        console.log(data);
                        break;

                    case "42S02":
                        showFailMessage.failMessage('no-table', 5000);
                        console.log(data);
                        break;

                    case "42S22":
                        showFailMessage.failMessage('no-tableField', 5000);
                        console.log(data);
                        break;

                    case 1049:
                        showFailMessage.failMessage('no-database', 5000);
                        console.log(data);
                        break;

                    case 1044:
                    case 1045:
                        showFailMessage.failMessage('no-usernameOrPassword', 5000);
                        console.log(data);
                        break;

                    default:
                        showFailMessage.failMessage('fail-database', 5000);
                        console.log(data);
                        break;
                }
            }
            $headerInputField.val('').focus();
        });

        ajaxRequest.fail(function (data) {
            $headerInputField.effect('highlight', {
                color: '#FF3100'
            }, 200);
            showFailMessage.failMessage('fail-database', 5000);
        });
    }

    //
    //Updated den Status des aufgerufene Datensatzes
    function updateStatusItems() {
        $('.details-status-button, .main-middle-item').on('click', function () {
            const yesRegEx = /\d{2}-\d{6}-\d{2}/;
            const updatedProbenNummer = $('#span-input-text-probenummer').html();
            const updatedProbenSoll = $('#span-input-text-solldatum').html();
            const updateItemId = this.id;
            const updateItemMainClass = this.className.split(" ")[0];
            const updateItemSecondClass = this.className.split(" ")[1];
            const updateItemTblName = this.className.split(" ")[2];
            const updateOnOffItemValue = this.value;

            let updateObject = {
                'updatedProbenNummer': updatedProbenNummer,
                'updatedProbenSoll': updatedProbenSoll,
                'updateItemId': updateItemId,
                'updateItemMainClass': updateItemMainClass,
                'updateItemSecondClass': updateItemSecondClass,
                'updateItemTblName': updateItemTblName,
                'updateOnOffItemValue': updateOnOffItemValue
            }

            if (updatedProbenNummer.match(yesRegEx)) {
                switch (updateItemMainClass) {
                    case "details-status-button":
                        switch (this.value) {
                            case "deactive":
                                $(this).attr('value', 'active');
                                updateObject.updateOnOffItemValue = this.value;
                                requestStatusItemUpdate(updateObject, $(this));
                                break;

                            case "active":
                                $(this).attr('value', 'deactive')
                                updateObject.updateOnOffItemValue = this.value;
                                requestStatusItemUpdate(updateObject, $(this));
                                break;

                            default:
                        }
                        break;

                    case "main-middle-item":

                        switch (this.value) {
                            case "default":
                                $(this).attr('value', 'started');
                                updateObject.updateOnOffItemValue = this.value;
                                requestStatusItemUpdate(updateObject, $(this));
                                break;

                            case "started":
                                $(this).attr('value', 'done')
                                updateObject.updateOnOffItemValue = this.value;
                                requestStatusItemUpdate(updateObject, $(this));
                                break;

                            case "done":
                                $(this).attr('value', 'restarted')
                                updateObject.updateOnOffItemValue = this.value;
                                break;

                            default:
                        }

                        break;

                    default:
                }
            }
        });



        //
        //
        function requestStatusItemUpdate(updateStatusItem, updateHtmlItem) {
            const ajaxRequest = $.ajax({
                url: '../php/db-update.php',
                method: 'POST',
                data: {
                    updateDataSet: updateStatusItem
                },
                dataType: 'json'
            });

            ajaxRequest.done(function (data) {
                const $spanProbenEingangDate = $('#span-timing-date-eingang');
                const $spanProbenEingangTime = $('#span-timing-time-eingang');

                const $spanProbenNahmeDate = $('#span-timing-date-probenNahme');
                const $spanProbenNahmeTime = $('#span-timing-time-probenNahme');

                const $spanZpnWagenDate = $('#span-timing-date-zpnWagen');
                const $spanZpnWagenTime = $('#span-timing-time-zpnWagen');

                const $spanNickelRueckgabeDate = $('#span-timing-date-nickelRueckgabeDateTime');
                const $spanNickelRueckgabeTime = $('#span-timing-time-nickelRueckgabeDateTime');

                const $spanKlaerfallGestelltDate = $('#span-timing-date-klaerfallGestellt');
                const $spanKlaerfallGestelltTime = $('#span-timing-time-klaerfallGestellt');
                const $spanKlaerfallErhaltentDate = $('#span-timing-date-klaerfallErhalten');
                const $spanKlaerfallErhaltenTime = $('#span-timing-time-klaerfallErhalten');

                const $spanManaAngefordertDate = $('#span-timing-date-maNaAngefordert');
                const $spanManaAngefordertTime = $('#span-timing-time-maNaAngefordert');
                const $spanManaErhaltenDate = $('#span-timing-date-maNaErhalten');
                const $spanManaErhaltenTime = $('#span-timing-time-maNaErhalten');
                const $spanManaEingewogenDate = $('#span-timing-date-maNaEingewogen');
                const $spanManaEingewogenTime = $('#span-timing-time-maNaEingewogen');

                const $spanGesamtProbenNahme = $('#gesamt-timing-probenahme');
                const $spanGesamtZpnWagen = $('#gesamt-timing-ZPNWagen');
                const $spanGesamtNickel = $('#gesamt-timing-nickel');
                const $spanGesamtKlaerfall = $('#gesamt-timing-klaerfall');
                const $spanGesamtManaAnfrag = $('#gesamt-timing-manaAnfrag');
                const $spanGesamtManaGesamt = $('#gesamt-timing-manaGesamt');

                switch (data.success) {
                    case true:
                        switch (data.onOffDetailsStatus) {
                            case "deactive":
                                updateHtmlItem
                                    .removeClass('active')
                                    .addClass('deactive');
                                break;

                            case "active":
                                updateHtmlItem
                                    .removeClass('deactive')
                                    .addClass('active');
                                break;

                            default:
                        }

                        switch (data.onOffMainMiddleButtonStatus) {
                            case "started":
                                updateHtmlItem
                                    .removeClass('default')
                                    .addClass('started');
                                break;

                            case "done":
                                updateHtmlItem
                                    .removeClass('started')
                                    .addClass('done');
                                break;

                            case "restarted":
                                updateHtmlItem
                                    .removeClass('done')
                                    .addClass('restarted');
                                break;

                            default:
                        }
                        break;

                    case false:
                        showFailMessage.failMessage('fail-database', 5000);
                        console.log(data);
                        break;

                    default:
                }

            });

            ajaxRequest.fail(function (data) {
                showFailMessage.failMessage('fail-database', 5000);
                console.log(data);
            });
        }
    }


    // function addComment()
    // {
    //     $('#comment-send-button').on('click', function()
    //     {
    //         console.log($('#comment-input-field').val());
    //         $('#comment-text').html($('#comment-input-field').val());
    //         $('#comment-input-field').val("");
    //         // $('#comment-text').html() = $('#comment-input-field').value;
    //     });
    // }



    regexInput();
    toggleDetails();
    inputVerwaltungCheck();
    updateStatusItems();
    // updateMainMiddleButtons();

});