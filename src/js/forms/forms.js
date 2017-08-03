/**
* Forms elements that requires js activations and settings
*/

var forms = (function () {

    'use strict';

    var _bindEvents = function _bindEvents (type) {

            // This function activates the widgets and init the form submission code in js/forms/submit.js

            // Force styling of multiselects
            // other options are already set as html attributes
            // FIXME mobile display
            $('.selectpicker').selectpicker({
                style: 'btn-lg btn-default text-center',
                size: 6
            });

            // Separate tags by hitting space bar or right key
            // FIXME space key doesn't work with mobile keyboard
            // FIXME options are removed upon calling 'removeAll' even when commenting out the code in the plugin
           $('.feature-tags, .bootstrap-tagsinput').tagsinput({
                maxTags: 3,
                confirmKeys: [32, 39],
                maxChars: 16,
                trimValue: true
            });

            // Prevent sending the form with enter key
            // FIXME this doesn't seem to work anymore?
            $(".form-feature").bind("keypress", function (e) {

                if (e.keyCode === 13) {
                    $(".btn-save").attr('type');
                    e.preventDefault();
                }
            });

            // initiate the image uploader
            _initUploader();

            // initiate drawing stuff
            if (type === 'litter' || type === 'area') {
                drawing.init();
            }
            // Re-initialize some listeners
            actions.bindUnsavedMarkerEvents();

            // activate the form
            saving.init();
        },
        formDispatcher = function _formDispatcher (id, targetLinkClass) {

            console.log("id from _formDispatcher: ", id);
            console.log("link class from _formDispatcher(): ", targetLinkClass );
            // TODO extract this logic to tools.dispatcher so we can dispatch any type of function with any callback
            var types = { 'garbage': 'garbage',
                          'cleaning': 'cleaning',
                          'dieoff': 'dieoff',
                          'floating': 'floating',
                          'area': 'area',
                          'litter': 'litter',
                          'opengraph' : 'opengraph'};

            for (var key in types) {

                if (targetLinkClass.indexOf(key) !== -1) {
                    _makeForm(id, types[key]);
                }
            } // adapted from http://stackoverflow.com/a/22277556/2842348
        },
        _makeForm = function _makeForm (id, type) {
          // TODO extract the form events and init into separate functions
            var typeobj = {},
                typeid = null,
                marker = null,
                latlng = null;

            // Build a mock object to pass to the templating engine so we can use conditional blocks
            typeobj = {};
            typeobj[type] = type;

            console.log('typeobj', typeobj);
            console.log("id from _makeForm(): ", id);

            // add a marker with data from a webpage scraped using the Opengraph scraper
            // this form opens inside a modal
            // TODO make opengraph as a sidebar form?
            if (type === 'opengraph') {

                ui.makeModal(type, null);

                console.log('opengraph form');
                marker = maps.unsavedMarkersLayerGroup.getLayer(id);
                latlng = marker.getLatLng();
                $('.marker-latlng').val(latlng.lat + ", " + latlng.lng);
            }

            // Else we deal with normal map features
            else {

                typeid = 'create-' + type + '-dialog';
                console.log(typeid);

                // Fill the templates
                document.getElementById(typeid).innerHTML = tmpl('tmpl-form-main', typeobj);

                // Hide the close button in the sidebar when we show forms because they have a cancel button
                $('.close-right').addClass('hidden');

                // Forms for shapes (polylines and areas)
                if (type === "litter" || type === "area") {

                    // BUG
                    // FIXME this causes a bug where the layerGroup becomes unaccessible
                    // Delete any unsaved marker icons before drawing shapes
                    // maps.unsavedMarkersLayerGroup.clearLayers();

                    if (type === "litter") {
                        // Fill the garbage type multiselect
                        console.log('litter form');
                        document.getElementById('litter-select').innerHTML = tmpl('tmpl-form-garbage-type', ui.templates.garbagetypes);
                    }

                    if (type === "area") {
                        console.log('area form');
                    }
                }

                else {

                    // Forms for single point markers
                    marker = maps.unsavedMarkersLayerGroup.getLayer(id);

                    latlng = marker.getLatLng();

                    // TODO Pass the latlng as an object once templates are in place?
                    $('.marker-latlng').val(latlng.lat + ", " + latlng.lng);

                    if (type === "garbage") {

                        console.log('garbage form');

                        // Fill the multiselect templates in the forms
                        document.getElementById('garbage-select').innerHTML = tmpl('tmpl-form-garbage-type', ui.templates.garbagetypes);

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

                    if (type === "cleaning") {

                        console.log('loading cleaning form');

                        var datetimecontainer =document.getElementById('#cleaning-main-tab');

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

                        $("#event-date-time-input").flatpickr(config);
                    }
                }
            }
            // init event listener and set forms widget options
            _bindEvents(type);
        },
        _initUploader = function _initUploader () {
        // TODO find a jquery uploader that doesnt need widget but uses native html file access
            var imageuploader = $('.image-uploader'),
                imageuploaderbutton = $('.btn-image-uploader'),
                progressdiv = $('.progress');

            imageuploader.fileupload({

                headers: {'Authorization': 'Client-ID @@imgurtoken'},
                type: 'POST',
                url: 'https://api.imgur.com/3/upload',
                dataType: 'json',
                paramName: 'image',
                progressall: function(e, data) {

                    var progress = parseInt(data.loaded / data.total * 100, 10),
                        progressbar = $('.progress-bar');

                    progressdiv.removeClass('hidden');
                    progressbar.css('width', progress + '%');
                },

                fail: function(err) {
                    console.log("upload error: ", err);
                    progressdiv.addClass('hidden').delay(400);
                },

                error: function(err) {
                    console.log("upload error: ", err);
                    progressdiv.addClass('hidden').delay(400);
                },

                done: function(e, data) {

                    console.log("IMGUR DATA OBJ: ", data);
                    $(e.target).parent().next().val(data.result.data.link);
                    progressdiv.addClass('hidden').delay(200);

                // TODO use promises here
                    /*$.ajax({

                        method: "PUT",
                        url:  	'https://api.imgur.com/3/album/pWW73/add',
                        headers: {'Authorization': 'Client-ID 6f050e213f46ba9'},
                        dataType: 'json',
                        data: {ids: data.result.data.id},
                        success: function (data) {

                            console.log('success data', data);
                        },

                        error: function (err) {
                            console.log('err', err);
                        }
                    });*/
                }
            });

            imageuploaderbutton.on('click', function () {

                // TODO this needs to be more secure with session.checkLogin(checkonly)
                // but how to catch the promise?
                if (localStorage.getItem('token')) {

                    console.log('we got check')
                    $(this).next().trigger('click');

                  } else {
                    alerts.showAlert(3, 'warning', 2000);
                    return;
                }
            });
        };

    return { formDispatcher: formDispatcher };
}());
