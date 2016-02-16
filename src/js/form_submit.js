/*jslint browser: true, white: true, sloppy: true, maxerr: 1000*/
window.token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOjYsImlzcyI6Imh0dHA6XC9cL2FwaS5nYXJiYWdlcGxhLm5ldFwvYXBpXC9hdXRoZW50aWNhdGUiLCJpYXQiOiIxNDQ2OTAxNTcxIiwiZXhwIjoiMTQ0NjkwNTE3MSIsIm5iZiI6IjE0NDY5MDE1NzEiLCJqdGkiOiJhMzljOTg1ZDZmNWNjNmU4MGNlMmQzOWZjODg5NWM1YSJ9.R28VF7VI1S3-PpvaG6cjpyxpygvQCB0JXF5oQ27TxCw';

// Save garbage marker
$(function () {
	$('.form-garbage').on('submit', function (event) {
        event.preventDefault();
		var that = this,
		    garbageType = [],
            tags = [],
            garbageTodo = [],
		    garbageAmount,
            lat,
            lng,
            image_url,
		    garbageSize,
		    garbageEmbed,
            note;

        $(this).find('.selectpicker.garbage-type-select option:selected').each(function (index, value) {
			garbageType.push($(value).val());
		});

        $(this).find('.selectpicker.garbage-todo-select option:selected').each(function (index, value) {
			garbageTodo.push($(value).val());
		});

        $(this).find('.selectpicker.garbage-size-select option:selected').each(function (index, value) {
			garbageSize.push($(value).val());
		});

        $(this).find('.selectpicker.garbage-embed-select option:selected').each(function (index, value) {
            garbageEmbed.push($(value).val());
        });

		garbageAmout = $('input[class=garbage-range-input]').val();
        note = $(this).find('.garbage-note').val();
		image_url = $(this).find('.garbage-image-hidden-value').val();
        tags = $(this).find('.garbage-tags').tagsinput('items');

        // Coordinates
		lat = $(this).find('.marker-lat').val();
		lng = $(this).find('.marker-lng').val();

		setTimeout(function () {
          // var useToken = localStorage["token"] || window.token;
          var useToken = localStorage.getItem('token') || window.token;

          $.ajax({
              method: api.createTrash.method,
              url: api.createTrash.url(),
              headers: {"Authorization": "Bearer" + useToken},
              data: {
                  'lat': lat,
                  'lng': lng,
                  'amount': garbageAmount,
                  'types': garbageType.join(),
                  'todo': garbageTodo,
                  'image_url': image_url,
                  'tag': tags.join(),
                  'size': garbageSize,
                  'embed': garbageEmbed,
                  'note': note,
                  'featuretype': "marker_garbage"
              },
              success: function (data) {
                  console.log('success data', data);
                  showAlert("Marker saved successfully!", "success", 1500);

                  if (garbageAmount > 8) {
                      showAlert("That's a lot of trash, we opened a 311 ticket!", "warning", 3000);
                  }

                  sidebar.hide('slow');
                  map.removeLayer(marker);
                  loadGarbageMarkers();
              },
              error: function (response) {
                  showAlert("Something went wrong, HTTP error " + response.status, "danger", 2500);
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
          eventRecurrence = [],
          dateTime,
          lat,
          lng;

        dateTime = $('.date-time-value').val();
        tags = $(this).find('.cleaning-tags').tagsinput('items');
        lat = $(this).find('.cleaning-lat').val();
		lng = $(this).find('.cleaning-lng').val();

        $(this).find('.selectpicker.cleaning-recurrent-select option:selected').each(function(index, value) {
			eventRecurrence.push($(value).val());
		});

		setTimeout(function () {
          // var useToken = localStorage["token"] || window.token;
          var useToken = localStorage.getItem('token') || window.token;

          $.ajax({
              method: api.createCleaning.method,
              url: api.createCleaning.url(),
              headers: {"Authorization": "Bearer" + useToken},
              data: {
                  'lat': lat,
                  'lng': lng,
                  'date': dateTime,
                  'recurrence': eventRecurrence,
                  'tag':tags.join(),
                  'featuretype': "marker_cleaning"
              },
              success: function (data) {
                  $(marker._icon).removeClass('marker-color-gray marker-generic').addClass('marker-cleaning marker-color-coral');
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
        geojson_data,
        wms_url,
        note;

    latlngs = $(this).find('.litter-latlngs').val();

    $(this).find('.selectpicker.litter-type-select option:selected').each(function (index, value) {
        litterType.push($(value).val());
    });

    tags = $(this).find('.litter-tags').tagsinput('items');

    litterAmount = $('input[class=litter-range-input]').val();
    length = $(this).find('.litter-path-length').val();
    image_url = $(this).find('.litter-image-hidden-value').val();
    note = $('input[class=litter-note]').val();
    wms_url = $('input[class=litter-wms-url]').val();
    geojson_data =  $('input[class=litter-geojson-data]').val();

    console.log('coordinates', latlngs);
    console.log('type of trash', litterType);
    console.log('amout of trash', litterAmount);
    console.log('image url', image_url);
    console.log('length of the line', length);
    console.log('tags', tags);

    setTimeout(function () {
      var useToken = localStorage.getItem('token') || window.token;

      $.ajax({
          method: api.createShape.method,
          url: api.createShape.url(),
          headers: {"Authorization": "Bearer" + useToken},
          data: {
              'latlngs': latlngs.join(),
              'amount': litterAmount,
              'types': litterType.join(),
              'image_url': image_url,
              'length': length,
              'wms_url': wms_url,
              'geojson_data': geojson_data,
              'tag': tags.join(),
              'featuretype': "polyline_litter"
              // TODO add quantitative amountfields
          },
          success: function (data) {
              console.log('success data', data);
              showAlert("Litter saved successfully!", "success", 1500);
              sidebar.hide('slow');
              // loadRemoteShapes();
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
    console.log('tags', tags);
    console.log('title', title);

    setTimeout(function () {
      // var useToken = localStorage["token"] || window.token;
      var useToken = localStorage.getItem('token') || window.token;
      $.ajax({
          method: api.createShape.method,
          url: api.createShape.url(),
          headers: {"Authorization": "Bearer" + useToken},
          data: {
              'type': 'polygon',
              'latlngs': latlngs.join(),
              'players': players.join(),
              'note': note,
              'contact': contact,
              'secret': secret,
              'title': title,
              'tag': tags.join(),
              'featuretype': "polygon_area"
          },
          success: function (data) {
              console.log('success data', data);
              showAlert("Area saved successfully!", "success", 1500);
              sidebar.hide('slow');
              // loadRemoteShapes();
          },
          error: function (err) {
              console.log('err', err);
              showAlert("Sorry, failed to save the area.", "danger", 2000);
              sidebar.hide();
              // FIXME remove the feature on error?
              map.removeLayer(polygonLayer);
          }
      });
    }, 200);
  });
});
