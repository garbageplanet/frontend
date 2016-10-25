/*jslint browser: true, white: true, sloppy: true, maxerr: 1000*/

/**
* Saving forms data to the backend
*/

window.token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOjYsImlzcyI6Imh0dHA6XC9cL2FwaS5nYXJiYWdlcGxhLm5ldFwvYXBpXC9hdXRoZW50aWNhdGUiLCJpYXQiOiIxNDQ2OTAxNTcxIiwiZXhwIjoiMTQ0NjkwNTE3MSIsIm5iZiI6IjE0NDY5MDE1NzEiLCJqdGkiOiJhMzljOTg1ZDZmNWNjNmU4MGNlMmQzOWZjODg5NWM1YSJ9.R28VF7VI1S3-PpvaG6cjpyxpygvQCB0JXF5oQ27TxCw';
// for production build purpose window.token = '@@windowToken';

// Save features on the map
var saving = (function(){
    
    var saveGarbage = function (e) {
        // Prevent form submit if validator is active - this doesn't work
        /* if (event.isDefaultPrevented()) {

            showAlert('Please fill all required fields.', 'warning', 2000);

            // event.stopPropagation();
            
            return;

        } else {*/
        
        e.preventDefault();
        
		var that = this,
		    garbageType = [],
            tags = [],
            garbageTodo,
		    garbageAmount,
            latlng,
            image_url,
		    garbageSize = [],
		    garbageEmbed = [],
            note;

        $(this).find('.selectpicker.garbage-type-select option:selected').each(function (index, value) {
            garbageType.push($(value).val());
		});

        garbageTodo = $(this).find('.selectpicker.garbage-todo-select option:selected').val();

        $(this).find('.selectpicker.garbage-size-select option:selected').each(function (index, value) {
            garbageSize.push($(value).val()) || '';
		});

        $(this).find('.selectpicker.garbage-embed-select option:selected').each(function (index, value) {
            garbageEmbed.push($(value).val()) || '';
        });

        garbageAmount = $('.btn-group-amount').find('.active > input').attr('name') || '3';
        note = $(this).find('.garbage-note').val() || '';
		image_url = $(this).find('.garbage-image-hidden-value').val() || '';
        tags = $(this).find('.garbage-tags').tagsinput('items') || '';
        // Coordinates
		latlng = $(this).find('.garbage-latlng').val();
        
		setTimeout(function () {
            
            // var useToken = localStorage['token'] || window.token;
            var useToken = localStorage.getItem('token') || window.token;

            $.ajax({
                
                method: api.createTrash.method,
                url: api.createTrash.url(),
                headers: {'Authorization': 'Bearer ' + useToken},                            
                data: {
                    
                  'latlng': latlng,
                  'amount': garbageAmount,
                  'types': garbageType.join(),
                  'todo': garbageTodo,
                  'image_url': image_url,
                  'tag': tags.join(),
                  'sizes': garbageSize.join(),
                  'embed': garbageEmbed.join(),
                  'note': note                    
                },
                
                success: function (data) {
                    
                    console.log('success data', data);
                    alerts.showAlert(25, 'success', 1500);
                    sidebar.hide('slow');
                    map.removeLayer(marker);
                    features.loadGarbageMarkers();
                },
                
                error: function (response) {
                                        
                    alerts.showErrorType(response);
                    sidebar.hide();
                    map.removeLayer(marker);
                    
                }
                
            });
                            
		}, 100);
    };
    var saveCleaning = function (e) {
    
        e.preventDefault();
        
        var that = this,
            tags = [],
            eventRecurrence,
            dateTime,
            note,
            latlng;

        // NOTE the time and date value is set in the onMapClick() function in js/map/map_actions.js for now
        dateTime = $('#date-time-value').val();        
        tags = $(this).find('.cleaning-tags').tagsinput('items') || '';
        note = $(this).find('.cleaning-note').val() || '';
        latlng = $(this).find('.cleaning-latlng').val();
        eventRecurrence = $(this).find('.selectpicker.cleaning-recurrent-select option:selected').val();
   
		setTimeout(function () {
            
            var useToken = localStorage.getItem('token') || window.token;

            $.ajax({
              
                method: api.createCleaning.method,
                url: api.createCleaning.url(),
                headers: {'Authorization': 'Bearer ' + useToken},
                dataType: 'json',
                data: {
                  
                    'latlng': latlng,
                    'datetime': dateTime,
                    'note': note,
                    'recurrence': eventRecurrence,
                    'tag':tags.join()
                },
                success: function (data) {
                                      
                    alerts.showAlert(26, 'success', 2000);
                    sidebar.hide('slow');
                    features.loadCleaningMarkers();
                    map.removeLayer(marker);
                },
                error: function (response) {
                                        
                    alerts.showErrorType(response);
                    sidebar.hide();
                    map.removeLayer(marker);
                }
          });          
		}, 100);
    };
    var saveLitter = function (e) {
        
        $('.btn-draw').removeClass('disabled');

        e.preventDefault();

        var that = this,
            litterType = [],
            tags = [],
            litterAmount,
            latlngs,
            image_url,
            length,
            note,
            amount_quantitative;

        latlngs = $(this).find('.litter-latlngs').val();

        $(this).find('.selectpicker.litter-type-select option:selected').each(function (index, value) {
            litterType.push($(value).val());
        });

        tags = $(this).find('.litter-tags').tagsinput('items') || '';
        amount_quantitative = $(this).find('.litter-amount-quantitative').val() || '';
        // selecting the amount of garbage, add 3 by default if option is not set
        litterAmount = $('.btn-group-amount-litter').find('.active > input').attr('name') || '3';
        physical_length = $(this).find('.litter-path-length').val() || '';
        image_url = $(this).find('.litter-image-hidden-value').val() || ''; 
        note = $('input[class=litter-note]').val() || '';

        setTimeout(function () {

            var useToken = localStorage.getItem('token') || window.token;

            $.ajax({

                method: api.createLitter.method,
                url: api.createLitter.url(),
                headers: {'Authorization': 'Bearer ' + useToken},
                dataType: 'json',
                data: {

                    'latlngs': latlngs.toString(),
                    'amount': litterAmount,
                    'types': litterType.join(),
                    'image_url': image_url,
                    'tag': tags.join()
                    // 'physical_length': physical_length,
                    // 'amount_quantitative': amount_quantitative
                },

                success: function (data) {
                  console.log('success data', data);
                  alerts.showAlert(26, 'success', 1500);
                  sidebar.hide('slow');  
                  features.loadLitters(); 
                },

                error: function (response) {

                        alerts.showErrorType(response);
                        sidebar.hide();
                        map.removeLayer(polylineLayer);
                    }
            });               
        }, 200);
    };
    var saveArea = function (e) {
        
        $('.btn-draw').removeClass('disabled');    
        e.preventDefault();

        var that = this,
            tags = [],
            latlngs,
            note,
            secret,
            max_players,
            title,
            contact,
            game;

        game = $( '.tile-game-check input:checked' ).length || 0;
        console.log("game: ",game)
        latlngs = $(this).find('.area-latlngs').val();
        title = $(this).find('.area-title').val();
        note = $(this).find('.area-note').val() || '';
        secret = $(this).find('.area-secret').val() || '';
        contact = $(this).find('.area-contact').val() || '';
        max_players = $(this).find('.area-players').val() || '';
        tags = $(this).find('.area-tags').tagsinput('items') || '';

        function randomString(len) {

            var randomStringValue = ' ',
                charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            for( var i=0; i < len; i++ ) {
                randomStringValue += charset.charAt(Math.floor(Math.random() * charset.length));
            }
            return randomStringValue; 
        }

        // Generate a random id if the user didn't set a title
        if (!title) {
            title = randomString(12);
            console.log('randomly generated area title ', title);
        }

        setTimeout(function () {

            var useToken = localStorage.getItem('token') || window.token;

            $.ajax({

                method: api.createArea.method,
                url: api.createArea.url(),
                headers: {'Authorization': 'Bearer ' + useToken},
                dataType: 'json',
                data: {
                    'latlngs': latlngs,
                    'note': note,
                    'contact': contact,
                    'secret': secret,
                    'title': title,
                    'tag': tags.join(),
                    'game' : game
                },

                success: function (data) {

                    console.log('success data', data);
                    alerts.showAlert(27, 'success', 1500);
                    sidebar.hide('slow');
                    features.loadAreas(); 
                },

                error: function (response) {
                        alerts.showErrorType(response);
                        sidebar.hide();
                        map.removeLayer(polygoneLayer); 
                    }
          });
        }, 200);
    };
    
    return {
        saveGarbage: saveGarbage,
        saveCleaning: saveCleaning,
        saveLitter: saveLitter,
        saveArea: saveArea
    };
    
})();

// Event listeners for forms
$(function () {
    $('.form-garbage').on('submit', saving.saveGarbage);
    $('.form-cleaning').on( 'submit', saving.saveCleaning);               
    $('.form-litter').on( 'submit', saving.saveLitter);               
    $('.form-area').on( 'submit', saving.saveArea);                 
});
