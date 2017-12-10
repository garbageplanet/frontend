/* jslint browser: true, white: true, sloppy: true, maxerr: 1000 */
/* global L, $, tools, alerts, api, ui, features, maps, drawing, actions, saving, tmpl */

/**
* Forms elements that requires js activations and settings
*/

var forms = ( function () {

    'use strict';

    var garbagetypes = [
        {short:"plastic",long:"Plastic items"},
        {short:"bags",long:"Plastic bags"},
        {short:"foodpacks",long:"Plastic food containers"},
        {short:"pet",long:"PET bottles"},
        {short:"party",long:"Party leftovers"},
        {short:"poly",long:"Expanded plastic polymers"},
        {short:"butts",long:"Cigarette butts"},
        {short:"toys",long:"Kids beach toys"},
        {short:"syringe",long:"Syringes and needles"},
        {short:"glassbroken",long:"Broken glass"},
        {short:"glass",long:"Glass"},
        {short:"bottles",long:"Glass bottles"},
        {short:"metal",long:"Metal"},
        {short:"fastfood",long:"Fastfood garbage"},
        {short:"tin",long:"Tin cans"},
        {short:"alu",long:"Aluminium cans"},
        {short:"wood",long:"Recomposed wood"},
        {short:"chemicals",long:"Chemicals"},
        {short:"canister",long:"Oil canister"},
        {short:"barrel",long:"Barrel"},
        {short:"household",long:"Household garbage"},
        {short:"clothes",long:"Shoes and clothes"},
        {short:"fabric",long:"Carpets and fabrics"},
        {short:"matress",long:"Matresses"},
        {short:"tarp",long:"Tarps and other large covers"},
        {short:"electronic",long:"Electronics"},
        {short:"electric",long:"Electric appliances"},
        {short:"battery", long:"Batteries"},
        {short:"industrial",long:"Industrial wastes"},
        {short:"construction",long:"Construction wastes"},
        {short:"gas",long:"Gasoline and petroleum oil"},
        {short:"crude",long:"Crude oil"},
        {short:"vehicle",long:"Large vehicle"},
        {short:"bicycle",long:"Bicycles"},
        {short:"motorcyle",long:"Motorcycles"},
        {short:"tyres",long:"Tyres"},
        {short:"engine",long:"Engine parts"},
        {short:"vehicleparts",long:"Vehicles parts"},
        {short:"fishing",long:"Fishing gears"},
        {short:"commercial",long:"Commercial fishing gears"},
        {short:"net",long:"Fishing net"},
        {short:"lines",long:"Fishing line"},
        {short:"boat",long:"Small boat"},
        {short:"vessel",long:"Large boat or wreck"},
        {short:"boating",long:"Boating equipment"},
        {short:"buoy",long:"Buoys and floats"},
        {short:"navigation",long:"Navigation aid buoy"},
        {short:"pontoon",long:"Pontoon"},
        {short:"maritime",long:"Maritime equipment"},
        {short:"sewage",long:"Sewage"},
        {short:"dogs",long:"Dog poop bags"},
        {short:"stormwater",long:"Polluted stormwaters"},
    ],
    _bindEvents = function _bindEvents (id, type) {

            console.log('binding form events');

            // Manually activate tabs so we can use data-target instead of href which is incompatible with the routing
            $(".nav-tabs").on("click", "a", function (e) {

              e.preventDefault();
              $(this).tab('show');
            });

            // Style and activate multiselects
            $('.selectpicker').selectpicker({
                style: 'btn-lg btn-default text-center',
                size: 6
            });

            $('selectpicker').on('click', function (e) {

                console.log('selectpicker click', e);

            });

            // Separate tags by hitting space bar or right key
           $('.feature-tags, .bootstrap-tagsinput').tagsinput({
                maxTags: 3,
                confirmKeys: [32, 39],
                maxChars: 16,
                trimValue: true
            });

            // Prevent sending the form with enter key with attr hack
            var form = $('form');

            form.bind('keypress', function (e) {

                if ( e.keyCode === 13 ) {

                    $('.btn-save').attr('type');
                    e.preventDefault();
                }
            });

            // Retrieve the leaflet id so we can modified the marker being created
            if ( type === 'garbage' || type === 'cleaning' ) {

                var marker = maps.unsavedMarkersLayerGroup.getLayer(id);
            }

            if ( type === 'opengraph' ) {
              // Bind the action to launch the scraper
              $('.btn-opengraph-fetch').click( function () {

                  // Retrieve the value of the url
                  var url = $('#opengraph-url').val();

                  $('.btn-opengraph-fetch').text('...');
                  $('.btn-opengraph-fetch').attr('disabled', 'disabled');

                  // Start the scraper promise
                  $.when( tools.openGraphScraper(url) ).then( function (data) {

                      console.log('data from openGraph Promise resolved:', data);

                      // Load the data into the template
                      var ogcontent = document.getElementById('opengraph-content').innerHTML = tmpl('tmpl-result-opengraph', data);
                      // Remove input styles
                      $('#opengraph-content input, #opengraph-content textarea').css('border','none').css('background','transparent').css('box-shadow', 'none');

                      // Replace button text and disable nutil request has finished
                      $('.btn-opengraph-fetch').text('Fetch');
                      $('.btn-opengraph-fetch').removeAttr('disabled');
                      
                  }).catch( function () {
                      // If the promise returns any error reset the form field
                      $('.btn-opengraph-fetch').text('Fetch');
                      $('.btn-opengraph-fetch').removeAttr('disabled');
                  });
              });
            }

            if ( type === 'garbage' ) {

                $('input[type=radio]').on('change', function () {

                    // Remove the generic marker class
                    $(marker._icon).removeClass('marker-generic').addClass('marker-garbage');

                    // Get the color value from the select options
                    var selectedValue = parseInt($(this).attr('value'), 10);

                    // Change the class to the corresponding value
                    $(marker._icon).removeClass(function (index, css) {

                        return (css.match(/(^|\s)marker-color-\S+/g) || []).join(' ');

                    }).addClass(tools.setMarkerClassColor(selectedValue));
                });
            }

            if ( type === 'cleaning' ) {

                console.log('loading cleaning form');

                var datetimecontainer = document.getElementById('#cleaning-main-tab');

                // Setup the date widget
                var config = {
                    enableTime: true,
                    appendTo: datetimecontainer,
                    altInput: true,
                    disableMobile: true,
                    onChange: function (selectedDates, dateStr, instance) {
                        console.log(dateStr);
                        // Change the icon of the marker if a time is set
                        $(marker._icon).removeClass('marker-color-gray marker-generic').addClass('marker-cleaning marker-color-blue');
                    }
                };

                $('#event-date-time-input').flatpickr(config);
            }

            // initiate drawing plugin
            if (type === 'litter' || type === 'area') {
                drawing.init();
            }

            // Re-initialize some listeners
            // TODO need to unset listeners
            actions.bindUnsavedMarkerEvents();

            // Bind the event for saving the form data
            saving.init();
        },
        makeForm = function makeForm (id, type) {

            console.log('id from forms.makeForm(): ', id);
            console.log('type from forms.makeForm(): ', type);

            // Build the garbage multipicker and init uploader
            if ( type === 'garbage' || type === 'litter' ) {

                document.getElementById('type-select').innerHTML = tmpl('tmpl-form-garbage-type', garbagetypes);

                _initUploader();
            }

            // Hide the close button in the sidebar when we show forms because they have a cancel button
            $('.close-right').addClass('hidden');

            // Forms for single point markers
            var feature = maps.unsavedMarkersLayerGroup.getLayer(id);

            try {

                var latlng = feature.getLatLng();
                $('.marker-latlng').val(latlng.lat + ", " + latlng.lng);

            } catch (e) {

                console.log ('latlngs will be set from draw.js', e);
            }

            // init event listener and set forms widget options
            _bindEvents(id, type);
        },
        _initUploader = function _initUploader () {

            var imageuploader = $('.image-uploader'),
                imageuploaderbutton = $('.btn-image-uploader'),
                progress = $('.progress');

            var uploader = new ss.SimpleUpload({

                  button: imageuploaderbutton,
                  url: 'https://api.imgur.com/3/upload',
                  name: 'image',
                  responseType: 'json',
                  allowedExtensions: ['jpg', 'jpeg', 'png'],
                  // maxSize: 1024,
                  hoverClass: 'upload-state-hover',
                  focusClass: 'upload-state-focus',
                  disabledClass: 'upload-state-disabled',
                  onSubmit: function(filename, extension) {
                      this.setProgressBar(progress);
                    },
                  onComplete: function(filename, response) {

                      console.log('response: ', response);

                      if (!response) {
                          alert(filename + 'upload failed');
                          return false;
                      }

                      imageuploaderbutton.parent().next().val(response.result.data.link);
                    }
            });

            // imageuploader.fileupload({
            //
            //     headers: {'Authorization': 'Client-ID @@imgurtoken'},
            //     type: 'POST',
            //     url: 'https://api.imgur.com/3/upload',
            //     dataType: 'json',
            //     paramName: 'image',
            //     progressall: function (e, data) {
            //
            //         var progress = parseInt(data.loaded / data.total * 100, 10),
            //             progressbar = $('.progress-bar');
            //
            //         progressdiv.removeClass('hidden');
            //         progressbar.css('width', progress + '%');
            //     },
            //
            //     fail: function (err) {
            //         console.log('upload error: ', err);
            //         progressdiv.addClass('hidden').delay(400);
            //     },
            //
            //     error: function (err) {
            //         console.log('upload error: ', err);
            //         progressdiv.addClass('hidden').delay(400);
            //     },
            //
            //     done: function (e, data) {
            //
            //         console.log("IMGUR DATA OBJ: ", data);
            //         $(e.target).parent().next().val(data.result.data.link);
            //         progressdiv.addClass('hidden').delay(200);
            //     }
            // });

            // imageuploaderbutton.on('click', function () {
            //
            //     // TODO check for tools.states.loggedin;
            //     if ( localStorage.getItem('token') ) {
            //
            //         $(this).next().trigger('click');
            //
            //       } else {
            //         alerts.showAlert(3, 'warning', 2000);
            //         return;
            //     }
            // });
        };

        return { makeForm : makeForm };
}());
