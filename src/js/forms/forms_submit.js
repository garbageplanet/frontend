/*jslint browser: true, white: true, sloppy: true, maxerr: 1000*/
window.token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOjYsImlzcyI6Imh0dHA6XC9cL2FwaS5nYXJiYWdlcGxhLm5ldFwvYXBpXC9hdXRoZW50aWNhdGUiLCJpYXQiOiIxNDQ2OTAxNTcxIiwiZXhwIjoiMTQ0NjkwNTE3MSIsIm5iZiI6IjE0NDY5MDE1NzEiLCJqdGkiOiJhMzljOTg1ZDZmNWNjNmU4MGNlMmQzOWZjODg5NWM1YSJ9.R28VF7VI1S3-PpvaG6cjpyxpygvQCB0JXF5oQ27TxCw';
// for production build purpose window.token = '@@windowToken';

// Save garbage marker
// TODO sort obligatoey and optional fields
$(function () {
    
	$('.form-garbage').on('submit', function (event) {
        
        event.preventDefault();
        
		var that = this,
		    garbageType = [],
            tags = [],
            garbageTodo,
		    garbageAmount,
            lat,
            lng,
            image_url,
		    garbageSize = [],
		    garbageEmbed = [],
            note;

        $(this).find('.selectpicker.garbage-type-select option:selected').each(function (index, value) {
			
            garbageType.push($(value).val());
            
		});

        garbageTodo = $(this).find('.selectpicker.garbage-todo-select option:selected').val();

        $(this).find('.selectpicker.garbage-size-select option:selected').each(function (index, value) {
            
            garbageSize.push($(value).val()) || "0";
            
		});

        $(this).find('.selectpicker.garbage-embed-select option:selected').each(function (index, value) {
            
            garbageEmbed.push($(value).val()) || "0";
            
        });

		garbageAmount = $('.garbage-range-input').val() || "5";
        
        note = $(this).find('.garbage-note').val() || "";
        
		image_url = $(this).find('.garbage-image-hidden-value').val() || "";
        
        tags = $(this).find('.garbage-tags').tagsinput('items') || "";

        // Coordinates
		lat = $(this).find('.marker-lat').val();
        
		lng = $(this).find('.marker-lng').val();

		setTimeout(function () {
            
            // var useToken = localStorage["token"] || window.token;
            var useToken = localStorage.getItem('token') || window.token;

            $.ajax({
                
                method: api.createTrash.method,
                
                url: api.createTrash.url(),
                
                headers: {"Authorization": "Bearer " + useToken},
                                                                
                data: {
                    
                  'lat': lat,
                  'lng': lng,
                  'amount': garbageAmount,
                  'types': garbageType.join(),
                  'todo': garbageTodo,
                  'image_url': image_url,
                  'tag': tags.join(),
                  'sizes': garbageSize.join(),
                  'embed': garbageEmbed.join(),
                  'note': note,
                  'feature_type': "marker_garbage"
                    
                },
                
                success: function (data) {
                    
                    console.log('success data', data);

                    showAlert("Marker saved successfully!", "success", 1500);

                    sidebar.hide('slow');

                    map.removeLayer(marker);

                    loadGarbageMarkers();
                    
                },
                
                error: function (response) {
                    
                    console.log("Error data", response);
                    
                    if (response.status == "200") {
                        
                        showAlert("Sorry, something went wrong with the server", "danger", 2500);
                        
                    } else if (response.status == "error") {
                        
                        showAlert("The request wasn't handled properly by the server", "danger", 2500);

                    } else {
                        
                        showAlert("Something went wrong, HTTP error " + response.status, "danger", 2500);
                         
                    }

                    console.log(response.status);

                    sidebar.hide();

                    map.removeLayer(marker);
                    
                }
                
            });
                            
		}, 100);
        
	});
    
});

// Save cleaning event marker
$(function () {
    $('.form-cleaning').on( 'submit', function (event) {
        event.preventDefault();
        var that = this,
            tags = [],
            eventRecurrence,
            dateTime,
            note,
            lat,
            lng;

        // NOTE the time and date value is set in the onMapClick() function in js/map/map_actions.js for now
        dateTime = $('#date-time-value').val();
                
        tags = $(this).find('.cleaning-tags').tagsinput('items') || "";
        
        note = $(this).find('.cleaning-note').val() || "";
        
        lat = $(this).find('.cleaning-lat').val();
        
        lng = $(this).find('.cleaning-lng').val();
        
        eventRecurrence = $(this).find('.selectpicker.cleaning-recurrent-select option:selected').val();
            
		setTimeout(function () {
            
            var useToken = localStorage.getItem('token') || window.token;

            $.ajax({
              
                method: api.createCleaning.method,
              
                url: api.createCleaning.url(),
              
                headers: {"Authorization": "Bearer " + useToken},
                
                dataType: 'json',
                
                data: {
                  
                    'lat': lat,
                    'lng': lng,
                    'datetime': dateTime,
                    'note': note,
                    'recurrence': eventRecurrence,
                    'tag':tags.join(),
                    'feature_type': "marker_cleaning"
                },
                
                success: function (data) {
                  
                    console.log('success data', data);
                    
                    showAlert("Cleaning event saved successfully!", "success", 2000);
                    
                    sidebar.hide('slow');
                    
                    loadCleaningMarkers();
                    
                    map.removeLayer(marker);

                },
                
                error: function (err) {
                  
                    console.log('err', err);

                    showAlert("Sorry, failed to save the event.", "danger", 3000);

                    sidebar.hide();

                    map.removeLayer(marker);
                  
              }
                
          });
            
        debugger;
            
		}, 100);
        
	});
    
});

// Save polyline / litter
$(function () {
    
    $('.form-litter').on( 'submit', function (event) {

    event.preventDefault();

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

    tags = $(this).find('.litter-tags').tagsinput('items') || "";
        
    amount_quantitative = $(this).find('.litter-amount-quantitative').val() || "";
        
    // FIXME the slider selector cannot take a form-control class for now, so user might submit the form without
    // selecting the amount of garbage, add 5 by default if option is not set
    litterAmount = $('input[class=litter-range-input]').val() || "5";
        
    physical_length = $(this).find('.litter-path-length').val() || "";
        
    image_url = $(this).find('.litter-image-hidden-value').val() || "";
        
    note = $('input[class=litter-note]').val() || "";

    setTimeout(function () {
        
        var useToken = localStorage.getItem('token') || window.token;

        $.ajax({
            
            method: api.createLitter.method,
            
            url: api.createLitter.url(),
            
            headers: {"Authorization": "Bearer " + useToken},
            
            dataType: 'jsonp',
            
            data: {
                
                'latlngs': latlngs,
                'amount': litterAmount,
                'types': litterType.join(),
                'image_url': image_url,
                'physical_length': physical_length,
                'tag': tags.join(),
                'amount_quantitative': amount_quantitative,
                'feature_type': "polyline_litter"
            },
            
            success: function (data) {
              
              console.log('success data', data);
              
              showAlert("Litter saved successfully!", "success", 1500);
              
              sidebar.hide('slow');
              loadLitters();
              
            },
            
            error: function (err) {
              
              console.log('err', err);
              
              showAlert("Sorry, failed to save the litter.", "danger", 2000);
              
              sidebar.hide();
              
              // FIXME remove the feature on error?
              map.removeLayer(polylineLayer);
              
            }
            
        });
        
    }, 200);
        
    });
    
});

// Save polygon / area
$(function () {
    
    $('.form-area').on( 'submit', function (event) {

    event.preventDefault();

    var that = this,
        tags = [],
        latlngs,
        note,
        secret,
        max_players,
        title,
        contact,
        game;

    game = $( ".tile-game-check input:checked" ).length || 0;

    latlngs = $(this).find('.area-latlngs').val();

    title = $(this).find('.area-title').val();

    note = $(this).find('.area-note').val() || "";

    secret = $(this).find('.area-secret').val() || "";

    contact = $(this).find('.area-contact').val() || "";

    players = $(this).find('.area-players').val() || "";

    tags = $(this).find('.area-tags').tagsinput('items') || "";

    // Generate a random id if the user didn't set a title
    if (!title) {

      function randomString(len)
        {
            var text = " ",
            
                charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            
            for( var i=0; i < len; i++ )
                
                randomStringValue += charset.charAt(Math.floor(Math.random() * charset.length));

            return randomStringValue; 
            
        }

      title = randomString(12);

      console.log("randomly generated area title ", title);

    }

    setTimeout(function () {
        
        var useToken = localStorage.getItem('token') || window.token;
        
        $.ajax({
            
            
            method: api.createArea.method,

            url: api.createArea.url(),

            headers: {"Authorization": "Bearer " + useToken},
            
            dataType: 'jsonp',

            data: {
              
                'type': 'polygon',
                'latlngs': latlngs,
                'note': note,
                'contact': contact,
                'secret': secret,
                'title': title,
                'tag': tags.join(),
                'game' : game,
                'feature_type': "polygon_area"
                
            },
            
            success: function (data) {
              
                console.log('success data', data);

                showAlert("Area saved successfully!", "success", 1500);

                sidebar.hide('slow');

                loadAreas();
                
            },
            
            error: function (err) {
              
                console.log('err', err);

                showAlert("Sorry, failed to save the area.", "danger", 2000);

                sidebar.hide();

                map.removeLayer(polygonLayer);
            }
            
      });
        
    }, 200);
        
  });
    
});
