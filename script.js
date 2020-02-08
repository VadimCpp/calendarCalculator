/**
 * Global app variables.
 */
var globals = {
    calendarsList: null
};

function start() {
    /**
     * Init the client first.
     * Then init the model and update UI.
     */
    gapi.client.init({
        'apiKey': 'AIzaSyA-udSmPEWrf2gzxZeqV-dfBLrYnT1Cd5I',
        'clientId': '432393497287-9i1o458ibu2lk00h6h9el7mimhkd8dvq.apps.googleusercontent.com',
        'scope': 'profile https://www.googleapis.com/auth/calendar.readonly',

    }).then(function() {

        gapi.auth2.getAuthInstance().isSignedIn.listen(signinStatusEvent);

        updateAuthButtonPanel();
        updateUserName();
        updateCalendarsPanel();
        updateCalendarsList();
        updateEventsPanel();
        updateCalculatorPanel();
        updateCalculation();                

        $('#authorize-btn').click(function() {                
            gapi.auth2.getAuthInstance().signIn();                                    
        });

        $('#signout-btn').click(function() {                
            gapi.auth2.getAuthInstance().signOut();
        });
      
        $('#list-calendars-btn').click(function() {
            updateCalendarsList();
        });

        $('#list-events-btn').click(function() {
            updateEventsList();
        });

        $('#calculate-btn').click(function() {
            updateCalculation();
        });

        $('#auth-panel-expand-btn').click(expandAuthPanel);

        $('#auth-panel-collapse-btn').click(collapseAuthPanel);

        $('#calendars-panel-expand-btn').click(expandCalendarsPanel);

        $('#calendars-panel-collapse-btn').click(collapseCalendarsPanel); 

        $('#events-panel-expand-btn').click(expandEventsPanel);

        $('#events-panel-collapse-btn').click(collapseEventsPanel);

        collapseAuthPanel();
        collapseCalendarsPanel();     
        collapseEventsPanel();
    });

    /**
     * Handler.
     * Listen to auth status beeing changed.
     */
    function signinStatusEvent(isSignedIn) {
        updateAuthButtonPanel();
        updateUserName();
        updateCalendarsPanel();   
        updateCalendarsList();
        updateCalendarsRadioList();
        updateEventsPanel();
        updateEventsList();
        updateCalculatorPanel();
        updateCalculation();
    }

    /**
     * Handler.
     * Expand authorization panel
     */    
    function expandAuthPanel() {            
        $('#auth-panel-expand-btn').hide();
        $('#auth-panel-collapse-btn').show();
        $('#auth-panel .expandable').show();
    }

    /**
     * Handler.
     * Collapse authorization panel
     */    
    function collapseAuthPanel() {            
        $('#auth-panel-collapse-btn').hide();
        $('#auth-panel-expand-btn').show();
        $('#auth-panel .expandable').hide();
    }

    /**
     * Handler.
     * Expand calendars panel
     */    
    function expandCalendarsPanel() {            
        $('#calendars-panel-expand-btn').hide();
        $('#calendars-panel-collapse-btn').show();
        $('#calendars-panel .expandable').show();
    }

    /**
     * Handler.
     * Collapse calendars panel
     */    
    function collapseCalendarsPanel() {            
        $('#calendars-panel-collapse-btn').hide();
        $('#calendars-panel-expand-btn').show();
        $('#calendars-panel .expandable').hide();
    }

    /**
     * Handler.
     * Expand calendars panel
     */    
    function expandEventsPanel() {            
        $('#events-panel-expand-btn').hide();
        $('#events-panel-collapse-btn').show();
        $('#events-panel .expandable').show();
    }

    /**
     * Handler.
     * Collapse calendars panel
     */    
    function collapseEventsPanel() {            
        $('#events-panel-collapse-btn').hide();
        $('#events-panel-expand-btn').show();
        $('#events-panel .expandable').hide();
    }

    /**
     * Util.
     * Get verbose name for months
     */
    function verboseMonth(number) {
        var months = [
            'Январь',
            'Февраль',
            'Март',
            'Апрель',
            'Май',
            'Июнь',
            'Июль',
            'Август',
            'Сентябрь',
            'Октябрь',
            'Ноябрь',
            'Декабрь'
        ];

        return months[number];
    }

    /**
     * UI method.
     * Updates auth button panel.
     */
    function updateAuthButtonPanel() {
        if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
            $("#authorize-btn").prop('disabled', true);
            $("#signout-btn").prop('disabled', false);                    
        } else {
            $("#authorize-btn").prop('disabled', false);
            $("#signout-btn").prop('disabled', true);
        }
    }

    /**
     * UI method.
     * Updates user name.
     */
    function updateUserName() {
        gapi.client.request({
            'path': 'https://people.googleapis.com/v1/people/me?requestMask.includeField=person.names',
        }).then(function(response) {
            $("#user-name").text(
                response.result.names && response.result.names[0] && response.result.names[0].displayName ? 
                response.result.names[0].displayName : 
                'Имя не указано ☹️'
            );
        }, function(reason) {
            console.log('Error: ' + reason && reason.result && reason.result.error && reason.result.error.message ? reason.result.error.message : 'Неизвестная ошибка');
            $("#user-name").text('Анон 😎');
        });
    }

    /**
     * UI method.
     * Updates user name.
     */
    function updateCalendarsPanel() {
        if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
            $("#calendars-panel").show();                    
        } else {
            $("#calendars-panel").hide();
        }
    }

    /**
     * UI method.
     * Updates list of calendars.
     */  
    function updateCalendarsList(success, data) {

        $('#calendars-list').text('...');
        
        globals.calendarsList = null;
        updateCalendarsRadioList();

        gapi.client.request({
            'path': 'https://www.googleapis.com/calendar/v3/users/me/calendarList',
        }).then(function(response) {

            if (response && response.result && response.result.items && response.result.items.length) {
                globals.calendarsList = response.result.items;
                var text = '';

                for (var i = 0; i < response.result.items.length; i++) {
                    text += response.result.items[i].summary;
                    if (i < response.result.items.length - 1) {
                        text += ", ";
                    }
                }
                
                $('#calendars-list').text(text);
            } else {
                $('#calendars-list').text('пусто');
            }
            
            updateCalendarsRadioList();

        }, function(reason) {
            $('#calendars-list').text('пусто');
            updateCalendarsRadioList();
        });
    }

    /**
     * UI method.
     * Updates list of calendars.
     */  
    function updateCalendarsRadioList() {

        if (globals.calendarsList) {
            var text = '';

            for (var i = 0; i < globals.calendarsList.length; i++) {
                text += 
                    '<li class="list-group-item">' +
                    '<input type="radio" id="radio-btn-' + i + '" value="' + globals.calendarsList[i].id + '" name="calendars-group">' +
                    ' <label for="' + globals.calendarsList[i].id + '">' + globals.calendarsList[i].summary + '</label>' +
                    '</li>';                              
            }
            
            $('#calendars-radio-list').html(text);

            $('input[type=radio][name=calendars-group]').on('change', function() {
                updateEventsPanel();
                updateEventsList();
                updateCalculatorPanel();
                updateCalculation();
            });

            // select first calendar automatically and load events
            $("#radio-btn-0").prop("checked", true);
            updateEventsPanel();
            updateEventsList();
            updateCalculatorPanel();
            updateCalculation();

        } else {
            $('#calendars-radio-list').html('');
        }
    }

    /**
     * UI method.
     * Updates visibility of events panel.
     */
    function updateEventsPanel() {

        var calendarId = $('input[name=calendars-group]:checked').val();
        if ($('input[name=calendars-group]:checked').val()) {
            $("#events-panel").show();
            $("#current-calendar").text(calendarId);             
        } else {
            $("#events-panel").hide();
        }
    }

    /**
     * UI method.
     * Updates list of events.
     */  
    function updateEventsList() {
        var calendarId = $('input[name=calendars-group]:checked').val();
        
        $('#events-list').html('...');

        if ($('input[name=calendars-group]:checked').val()) {

            var beginningOfCurrentYear = moment((new Date(new Date().getFullYear(), 0, 1)).getTime()).format();

            gapi.client.request({
                'path': 'https://www.googleapis.com/calendar/v3/calendars/' + calendarId + '/events' + 
                        '?timeMin=' + encodeURIComponent(beginningOfCurrentYear),
            }).then(function(response) {

                if (response && response.result && response.result.items) {
                    var total = '' + response.result.items.length + ' запись(ей)<br>';
                    var text = total;
                    for (var i = 0; i < response.result.items.length; i++) {
                        text += '<span class="small text-secondary">' + response.result.items[i].summary + ' : ' + (response.result.items[i].description ? response.result.items[i].description : '') + '</span>';
                        text += '<br>';
                    }
                    $('#events-list').html(text);
                } else {
                    $('#events-list').html('пусто');
                }

            }, function(reason) {
                $('#events-list').html('пусто');
            });

        } else {
            $('#events-list').html('пусто');
        }
    };

    /**
     * UI method.
     * Updates visibility of events panel.
     */
    function updateCalculatorPanel() {
        if ($('input[name=calendars-group]:checked').val()) {
            $("#calculator-panel").show();                    
        } else {
            $("#calculator-panel").hide();
        }
    }

    /**
     * UI method.
     * Updates calculation.
     */  
    function updateCalculation() {
        var calendarId = $('input[name=calendars-group]:checked').val();
        
        $('#calculation').html('...');

        if ($('input[name=calendars-group]:checked').val()) {

            var beginningOfCurrentYear = moment('2019-01-01').format();

            gapi.client.request({
                'path': 'https://www.googleapis.com/calendar/v3/calendars/' + calendarId + '/events' + 
                        '?timeMin=' + encodeURIComponent(beginningOfCurrentYear),
            }).then(function(response) {

                if (response && response.result && response.result.items) {  

                    response.result.items.sort(function(a, b) {
                        var dateA = a.start ? a.start.date : 0;
                        var dateB = b.start ? b.start.date : 0;
                        if (dateA < dateB) {
                            return -1;
                        }
                        if (dateA > dateB) {
                            return 1;
                        }
                        return 0;
                    });

                    var text = 'По месяцам:<br><br>';
                    var month = null;
                    var year = null;
                    var total = 0;
                    var yearsTotal = [];

                    for (var i = 0; i < response.result.items.length; i++) {
                        var item = response.result.items[i];
                        if (item && item.start) {
                            var itemMonth = (moment(item.start.date).month());
                            var itemYear = (moment(item.start.date).year());

                            if (month !== itemMonth || year !== itemYear) {
                                if (month !== null && year !== null) {
                                    text += '<br>';
                                    text += '<i>Итого: ' + total + ' ₽</i>';
                                    text += '<hr><br>';
                                    total = 0;
                                }

                                text += '<b>' + verboseMonth(itemMonth) + ', ' + itemYear + '</b><br>' ;
                                month = itemMonth;
                                year = itemYear;
                            }
                            total += isNaN(parseInt(item.summary)) ? 0 : parseInt(item.summary);
                            
                            if (yearsTotal[year] === undefined) {
                                yearsTotal[year] = 0;
                            }

                            yearsTotal[year] += isNaN(parseInt(item.summary)) ? 0 : parseInt(item.summary);
                            text += '<span class="small text-black-50">' + item.summary + ',</span>';
                        }
                    }
                    text += '<br>';
                    text += '<i>Итого: ' + total + ' ₽</i>';

                    yearsTotal.forEach(function(total, year) {
                        text += '<hr><br>';
                        text += '<b><i>Всего за год ' + year + ': ' + total + ' ₽</i></b>';
                        text += '<br><br>';                        
                    })
                    $('#calculation').html(text);
                } else {
                    $('#calculation').html('пусто');
                }

            }, function(reason) {
                $('#calculation').html('пусто');
            });

        } else {
            $('#calculation').html('пусто');
        }
    }

};

gapi.load('client', start);