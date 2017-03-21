/**
* Forms elements that requires js activations and settings
*/

// TODO make a prototype function makeForm.makeGarbage, makeForm.makeLitter...
var forms = (function() {
  
    var _bindEvents = function() {

            // This function activate the widgets and init the form submission code in js/forms/submit.js
            var selectPickers = $('.selectpicker'),
                tagInput = $('.feature-tags'),
                currentForm = $(".form-feature"),
                saveButton = $(".btn-save");

            // Force styling of multiselects
            // other options are already set in the html
            selectPickers.selectpicker({ 
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
            // FIXME this doesn't work anymore?
            $(".form-feature").bind("keypress", function(e) {

                if (e.keyCode === 13) {
                    saveButton.attr('type');
                    e.preventDefault();
                }
            });
      
            // TODO uncheck siblings in the amount selector when clicking on the next one else
            // all values are passed to the forms

            // initiate the uploader
            // TODO only init if the form needs it
            _initUploader();
      
            // initiate drawing stuff
            // TODO only do this if the form needs it
            drawing.init();
      
            // Re-initialize some listeners
            tools.bindTempMarkerEvents();
      
            // activate the form
            saving.init();
        },
        _formDispatcher = function(id, targetLinkClass) {
          
            console.log("id from form dispatcher: ", id);
            console.log("link class from form dispatcher: ", targetLinkClass );

            var types = {
                          'garbage': 'garbage', 
                          'cleaning': 'cleaning',
                          'dieoff': 'dieoff',
                          'floating': 'floating',
                          'area': 'area',
                          'litter': 'litter'
                        };

            for (var key in types) {

                if (targetLinkClass.indexOf(key) !== -1) {
                      forms.makeForm(id, types[key]);
                  }      
            } // adapted from http://stackoverflow.com/a/22277556/2842348
        },
        passMarkerToForm = function(id) {

            // FIXME there's a circular reference somehwere here?
            "use strict";

            var id = id;
            $('.create-dialog').on('click', function(e) {

                e.preventDefault();
                var ct = $(this).attr('href').toString();  
                console.log(ct);
                _formDispatcher(id, ct);
            });
        },
        makeForm = function(id, type) {

            // Build an object to pass to the templating engine
            var typeobj = {};
            typeobj[type] = type;
            console.log('typeobj', typeobj);

            // Opengraph scraper
            // TODO finish this
            if (!id && type === 'og') {

                console.log('og form');
                var latlng = maps.map.getCenter();
                $('.marker-latlng').val(latlng.lat + ", " + latlng.lng);
                return;
            }

            else {
              
                // hide the close button in the sidebar
                if (!$('.close-panel').hasClass('hidden')) {
                  $('.close-panel').addClass('hidden');
                }

                var typeid = 'create-' + type + '-dialog';
                console.log(typeid);
              
                // Fill the templates
                document.getElementById(typeid).innerHTML = tmpl('tmpl-form-main', typeobj);

                // Forms for shapes
                if (type === "litter" || type === "area") {

                    // Delete any unsaved marker
                    maps.unsavedMarkersLayerGroup.clearLayers();

                    if (type === "litter") {
                        console.log('litter form');

                        document.getElementById('litter-select').innerHTML = tmpl('tmpl-form-garbage-type', ui.templates.garbagetypes);

                    }
                    if (type === "area") {
                        console.log('area form');
                    }
                    //return;
                }

                else {

                    var marker = actions.tempmarkers[id];              
                    var latlng = marker.getLatLng();

                    // Forms for single point markers
                    if (type === "garbage") {

                        console.log('garbage form');
                        // Fill the multiselect templates in the forms
                        document.getElementById('garbage-select').innerHTML = tmpl('tmpl-form-garbage-type', ui.templates.garbagetypes);

                        // TODO Pass the latlng as an object once templates are in place
                        $('.marker-latlng').val(latlng.lat + ", " + latlng.lng);

                        $('input[type=radio]').on('change', function() {

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

                        console.log('cleaning form');

                        // TODO Pass the latlng as an object once templates are in place
                        $('.marker-latlng').val(latlng.lat + ", " + latlng.lng);

                        // Set the options on the time and date selects
                        $('#event-date-time-picker')
                            .datetimepicker({
                                minDate: new Date(2016, 04, 01),
                                showClose: true,
                                ignoreReadonly: true,
                                focusOnShow: false,
                                toolbarPlacement: 'top'
                        });

                        $('#event-date-time-picker').on('dp.change', function (e) {

                            var eventDateTime = e.date.format('YYYY-MM-DD HH:MM:SS');
                            $('#date-time-value').val(eventDateTime);

                            // Change the icon of the marker if a time is set
                            $(marker._icon).removeClass('marker-color-gray marker-generic').addClass('marker-cleaning marker-color-blue');
                        });
                    }
                }
            }
            // init event listener and set forms widget options
            _bindEvents();
        },
        _initUploader = function() {

            var imageuploader = $('.image-uploader'),
                imageuploaderbutton = $('.btn-image-uploader'),
                progressdiv = $('.progress');

            imageuploader.fileupload({

                headers: {'Authorization': 'Client-ID 6f050e213f46ba9'},
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

            imageuploaderbutton.on('click', function() {

                // TODO this needs to be more secure with checkLogin(checkonly)
                if (localStorage.getItem('token')) {
                    // if (checklogin()) {}
                    $(this).next().trigger('click');
                }

                else {
                    alerts.showAlert(3, 'warning', 2000);
                    return;
                }
            });
        };
    
    return {
        makeForm: makeForm,
        passMarkerToForm: passMarkerToForm,
    };
}());