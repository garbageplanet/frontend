/* jslint browser: true, white: true, sloppy: true, maxerr: 1000 */
/* global L, $, tools, alerts, api, ui, features, maps, drawing, actions, saving, tmpl */

/**
* Forms elements that requires js activations and settings
*/

var forms = ( function () {

    'use strict';

    var _bindEvents = function _bindEvents (id, type) {

            // Manually activate tabs so we can use data-target instead of href
            $(".nav-tabs").on("click", "a", function(e){
              e.preventDefault();
              $(this).tab('show');
            })


            console.log('binding form events');

            // Style and activate multiselects
            var selectpicker = $('.selectpicker');

            selectpicker.selectpicker({
                style: 'btn-lg btn-default text-center',
                size: 6
            });

            // window.isMobile ? selectpicker.selectpicker('mobile') :
            selectpicker.selectpicker('render');

            // selectpicker.selectpicker('refresh');

            // Separate tags by hitting space bar or right key
           $('.feature-tags, .bootstrap-tagsinput').tagsinput({
                maxTags: 3,
                confirmKeys: [32, 39],
                maxChars: 16,
                trimValue: true
            });

            // Prevent sending the form with enter key
            var form = $('form');

            form.bind('keypress', function (e) {

                if (e.keyCode === 13) {
                    $('.btn-save').attr('type');
                    e.preventDefault();
                }
            });

            if ( type === 'garbage' || type === 'cleaning' ) {

                var marker = maps.unsavedMarkersLayerGroup.getLayer(id);
            }

            if (type === 'garbage') {

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

            if (type === 'cleaning') {

                console.log('loading cleaning form');

                var datetimecontainer = document.getElementById('#cleaning-main-tab');

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
            actions.bindUnsavedMarkerEvents();

            // Bind the event for saving the form data
            saving.init();
        },
        makeForm = function makeForm (id, type) {

            console.log('id from forms.makeForm(): ', id);
            console.log('type from forms.makeForm(): ', type);

            // We exit if it's the menu form, no need for any activation
            if (type === 'menu') {
                return;
            }

            // add a marker with data from a webpage scraped using the Opengraph scraper
            // this form opens inside a modal
            if (type === 'opengraph') {

                ui.makeModal(type, null);

                console.log('opengraph form');
                marker = maps.unsavedMarkersLayerGroup.getLayer(id);
                latlng = marker.getLatLng();

                $('.marker-latlng').val(latlng.lat + ", " + latlng.lng);
            }


              // Build the garbage multipicker and init uploader
              if (type === 'garbage' || type === 'litter') {

                  document.getElementById('type-select').innerHTML = tmpl('tmpl-form-garbage-type', ui.templates.garbagetypes);

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
                  maxSize: 1024,
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
