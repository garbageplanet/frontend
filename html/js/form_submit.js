window.token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOjYsImlzcyI6Imh0dHA6XC9cL2FwaS5nYXJiYWdlcGxhLm5ldFwvYXBpXC9hdXRoZW50aWNhdGUiLCJpYXQiOiIxNDQ2OTAxNTcxIiwiZXhwIjoiMTQ0NjkwNTE3MSIsIm5iZiI6IjE0NDY5MDE1NzEiLCJqdGkiOiJhMzljOTg1ZDZmNWNjNmU4MGNlMmQzOWZjODg5NWM1YSJ9.R28VF7VI1S3-PpvaG6cjpyxpygvQCB0JXF5oQ27TxCw';

// Save garbage marker
$(function () {
	$('.form-garbage').on( 'submit', function (event) {
		var that = this;
		event.preventDefault();
		var typeOfTrash = [];
        // var tags = [];
        // var garbageSize = [];
        // var garbageEmbed = [];
        // var garbageTodo = [];
		var amountOfTrash, 
            lat, 
            lng, 
            image_url/*, 
            note,
            garbageSize,
            embed*/;

        $(this).find('.selectpicker.garbage-type-select option:selected').each(function(index, value) {
			typeOfTrash.push($(value).val());
		});
      
        /*$(this).find('.selectpicker.garbage-size-select option:selected').each(function(index, value) {
			garbageSize.push($(value).val());
		});
      
        $(this).find('.selectpicker.garbage-embed-select option:selected').each(function(index, value) {
			garbageEmbed.push($(value).val());
		});
      
        $(this).find('.selectpicker.garbage-todo-select option:selected').each(function(index, value) {
			garbageTodo.push($(value).val());
		});*/

		amountOfTrash = $('input[class=garbage-range-input]').val();
        // note = $(this).find('.garbage-note').val();

		image_url = $(this).find('.garbage-image-hidden-value').val();

        // tags = $(this).find('.garbage-tags').tagsinput('items');
      
        // console.log("tags", tags);
       //  console.log("note", note);
        // console.log("todo", garbageTodo);
      
        // Coordinates
		lat = $(this).find('.marker-lat').val();
		lng = $(this).find('.marker-lng').val();

		console.log('lat', lat);
		console.log('lng', lng);
		console.log('type of trash', typeOfTrash);
		console.log('amount of trash', amountOfTrash);
		console.log('image url', image_url);

		setTimeout(function () {
          var useToken = localStorage["token"] || window.token || authUser.name;
          $.ajax({
              method: api.createTrash.method,
              url: api.createTrash.url(),
              headers: {"Authorization": "Bearer" + useToken},
              data: {
                  'lat': lat,
                  'lng': lng,
                  'amount': amountOfTrash,
                  'types': typeOfTrash.join(),
                  'image_url': image_url
              },
              success: function (data) {
                  console.log('success data', data);
                  showAlert("Marker saved successfully!", "success", 1500);
                  if (amountOfTrash > 8) {
                      showAlert("That's a lot of trash, we opened a 311 ticket!", "warning", 3000);
                  };
                  sidebar.hide('slow');
              },
              error: function (err) {
                  console.log('err', err);
                  showAlert("Failed to save the marker, are you logged in?", "danger", 2000);
                  sidebar.hide();
                  map.removeLayer(marker);
              }
          })
		}, 100);
	})
});

// Save cleaning event marker
$(function () {
	$('.form-cleaning').on( 'submit', function (event) {
		var that = this;
		event.preventDefault();
        var tags = [];
        var dateTime,
            lat, 
            lng, 
            image_url, 
            eventRecurrence;
      
        dateTime = $(this).find('.event-date-hidden').val();

        console.log("time", dateTime);
        debugger;
              
        tags = $(this).find('.cleaning-tags').tagsinput('items');

		image_url = $(this).find('.cleaning-image-hidden-value').val();
      
        $(this).find('.selectpicker.cleaning-recurrent-select option:selected').each(function(index, value) {
			eventRecurrence.push($(value).val());
		});
      
        console.log("recurrence values", eventRecurrence);
      
        // Coordinates
		lat = $(this).find('.cleaning-lat').val();
		lng = $(this).find('.cleaning-lng').val();
        console.log("cleaning marker coordinates", lat + lng);

		setTimeout(function () {
          var useToken = localStorage["token"] || window.token || authUser.name;
          $.ajax({
              method: api.createCleaning.method,
              url: api.createCleaning.url(),
              headers: {"Authorization": "Bearer" + useToken},
              data: {
                  'lat': lat,
                  'lng': lng,
                  'date': dateTime,
                  'image_url': image_url,
                  'eventRecurrence': eventRecurrence
              },
              success: function (data) {
                  $(marker._icon).removeClass('marker-color-gray marker-generic').addClass('marker-cleaning marker-color-coral');
                  console.log('success data', data);
                  showAlert("Cleaning event saved successfully!", "success", 2000);
                  sidebar.hide('slow');
              },
              error: function (err) {
                  console.log('err', err);
                  showAlert("Sorry, failed to save the event.", "danger", 3000);
                  sidebar.hide();
                  map.removeLayer(marker);
              }
          })
		}, 100);
	})
});

// Save polyline / litter
$(function () {
  $('.form-litter').on( 'submit', function (event) {
    var that = this;
    event.preventDefault();
    var typeOfTrash = [];
    var tags = [];
    var amoutOfTrash, 
        latlngs, 
        image_url, 
        length,
        geojson_data,
        wms_url,
        note;

    latlngs = $(this).find('.litter-latlngs').val();

    $(this).find('.selectpicker.litter-type-select option:selected').each(function(index, value) {
        typeOfTrash.push($(value).val());
    });
        
    tags = $(this).find('.litter-tags').tagsinput('items');

    // Input range selector
    amoutOfTrash = $('input[class=litter-range-input]').val();

    image_url = $(this).find('.litter-image-hidden-value').val();
    note = $('input[class=litter-note]').val();
    wms_url = $('input[class=litter-wms-url]').val();
    geojson_data =  $('input[class=litter-geojson-data]').val();

    console.log('coordinates', latlngs);
    console.log('type of trash', typeOfTrash);
    console.log('amout of trash', amoutOfTrash);
    console.log('image url', image_url);
    console.log('length of the line', length);
    console.log('tags', tags);

    setTimeout(function () {
      var useToken = localStorage["token"] || window.token || authUser.name;
      $.ajax({
          method: api.createShape.method,
          url: api.createShape.url(),
          headers: {"Authorization": "Bearer" + useToken},
          data: {
              'lat_lngs': latlngs.join(),
              'amount': amoutOfTrash,
              'types': typeOfTrash.join(),
              'image_url': image_url,
              'length': length,
              'wms_url': wms_url,
              'geojson_data': geojson_data
          },
          success: function (data) {
              console.log('success data', data);
              showAlert("Litter saved successfully!", "success", 1500);
              sidebar.hide('slow');
          },
          error: function (err) {
              console.log('err', err);
              showAlert("Sorry, failed to save the litter.", "danger", 2000);
              sidebar.hide();
              // FIXME remove the feature on error?
              map.removeLayer(polylineLayer);
          }
      })
    }, 200);
  });
});

// Save polygon / area
// TODO how to store the secret in the db?
$(function () {
  $('.form-area').on( 'submit', function (event) {
    var that = this;
    event.preventDefault();
    var tags = [];
    var latlngs,
        note,
        secret,
        players,
        title,
        contact;

    latlngs = $(this).find('.area-latlngs').val();
    title = $(this).find('.area-title').val();
    note = $(this).find('.area-note').val();
    secret = $(this).find('.area-secret').val();
    contact = $(this).find('.area-contact').val();
    players = $(this).find('.area-players').val();
         
    tags = $(this).find('.area-tags').tagsinput('items');

    console.log('coordinates', latlngs);
    console.log('surface area', surfacearea);
    console.log('tags', tags);
    console.log('title', title);
    
    setTimeout(function () {
      var useToken = localStorage["token"] || window.token || authUser.name;
      $.ajax({
          method: api.createShape.method,
          url: api.createShape.url(),
          headers: {"Authorization": "Bearer" + useToken},
          data: {
              'latlngs': latlngs.toGeoJSON(),
              'players': players.join(),
              'note': note,
              'contact': contact,
              'secret': secret,
              'title': title
          },
          success: function (data) {
              console.log('success data', data);
              showAlert("Litter saved successfully!", "success", 1500);
              sidebar.hide('slow');
          },
          error: function (err) {
              console.log('err', err);
              showAlert("Sorry, failed to save the litter.", "danger", 2000);
              sidebar.hide();
              // FIXME remove the feature on error?
              map.removeLayer(polylineLayer);
          }
      })
    }, 200);
  });
});