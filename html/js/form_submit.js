window.token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOjYsImlzcyI6Imh0dHA6XC9cL2FwaS5nYXJiYWdlcGxhLm5ldFwvYXBpXC9hdXRoZW50aWNhdGUiLCJpYXQiOiIxNDQ2OTAxNTcxIiwiZXhwIjoiMTQ0NjkwNTE3MSIsIm5iZiI6IjE0NDY5MDE1NzEiLCJqdGkiOiJhMzljOTg1ZDZmNWNjNmU4MGNlMmQzOWZjODg5NWM1YSJ9.R28VF7VI1S3-PpvaG6cjpyxpygvQCB0JXF5oQ27TxCw';

// Save garbage marker
$(function () {
	$('.form-garbage').on( 'submit', function (event) {
		var that = this;
		event.preventDefault();
		var typeOfTrash = [];
		var amoutOfTrash, lat, lng, image_url;

        $(this).find('.selectpicker.garbage-type-select option:selected').each(function(index, value) {
			typeOfTrash.push($(value).val());
		});

        // Input range selector
		amoutOfTrash = $('input[class=garbage-range-input]').val();

		image_url = $(this).find('.garbage-image-hidden-value').val();
      
        // Coordinates
		lat = $(this).find('.marker-lat').val();
		lng = $(this).find('.marker-lng').val();

		console.log('lat', lat);
		console.log('lng', lng);
		console.log('type of trash', typeOfTrash);
		console.log('amout of trash', amoutOfTrash);
		console.log('image url', image_url);
        debugger;

		setTimeout(function () {
          var useToken = localStorage["token"] || window.token;
          $.ajax({
              method: api.createTrash.method,
              url: api.createTrash.url(),
              headers: {"Authorization": "Bearer" + useToken},
              data: {
                  'lat': lat,
                  'lng': lng,
                  'amount': amoutOfTrash,
                  'types': typeOfTrash.join(),
                  'image_url': image_url
              },
              success: function (data) {
                  console.log('success data', data);
                  showAlert("Marker saved successfully!", "success", 3000);
                  if (amoutOfTrash > 8) {
                      showAlert("That's a lot of trash, we opened a 311 ticket!", "warning", 3000);
                  };
                  sidebar.hide('slow');
              },
              error: function (err) {
                  console.log('err', err);
                  showAlert("Failed to save the marker, are you logged in?", "danger", 3000);
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
        var dateTime, lat, lng, image_url, eventRecurrence;
      
        $('#event-date-time-picker').on('dp.change', function(e) {
          // TODO format date and time before storage?
           var dateTime = e.date;
        });
        console.log("time", dateTime);

		image_url = $(this).find('.cleaning-image-hidden-value').val();
        console.log('cleaning image url',image_url);
        $(this).find('.selectpicker.cleaning-recurrent-select option:selected').each(function(index, value) {
			eventRecurrence.push($(value).val());
		});
        console.log("recurrence values", eventRecurrence);
      
        // Coordinates
		lat = $(this).find('.cleaning-lat').val();
		lng = $(this).find('.cleaning-lng').val();
        console.log("cleaning marker coordinates", lat + lng);

		setTimeout(function () {
          var useToken = localStorage["token"] || window.token;
          $.ajax({
              method: api.createCleaning.method,
              url: api.createCleaning.url(),
              headers: {"Authorization": "Bearer" + useToken},
              data: {
                  'lat': lat,
                  'lng': lng,
                  'dateTime': dateTime,
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

// NOTE Save shapes forms are nested in draw:created event listener in draw/draw.js