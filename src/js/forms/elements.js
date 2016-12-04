/**
* Forms elements that requires js activations and settings
*/

// TODO make a prototype function makeForm.makeGarbage, makeForm.makeLitter...
var forms = (function() {
    
    var activate = function() {
        
            // Force styling of multiselects
            // other options are already set in the html
            $('.selectpicker').selectpicker({ 
                style: 'btn-lg btn-default text-center', 
                // How many list items to display?
                size: 6
            });
            // Separate tags by hitting space bar or right key
            // FIXME space key doesn't work with mobile keyboard
            $('.feature-tags').tagsinput({
                maxTags: 3,
                confirmKeys: [32, 39],
                maxChars: 16,
                trimValue: true
            });

            // Prevent sending the form with enter key
            $(".form-feature").bind("keypress", function(e) {

                if (e.keyCode === 13) {
                    $(".btn-save").attr('type');
                    e.preventDefault();
                }
            });
        },
        makeGarbageForm = function(id) {
        
            "use strict";

            console.log("current marker id from makeGarbageForm: ", id);

            var marker = actions.tempmarkers[id],
                latlng = marker.getLatLng();

            console.log("unsaved marker obj from makeGarbageForm: ", marker);

            // TODO Fill the form template
            // document.getElementById('create-garbage-dialog').innerHTML = tmpl('tmpl-form-garbage', data);

            if (marker) {

                // TODO Pass the latlng as an object once templates are in place
                $('.marker-latlng').val(latlng.lat + ", " + latlng.lng);

                $('input[type=radio]').on('change', function() {
                    // Remove the generic marker class
                    $(marker._icon).removeClass('marker-generic').addClass('marker-garbage');
                    // Get the color value from the select options 
                    var selectedValue = parseInt($(this).attr('name'), 10);
                    // Change the class to the corresponding value
                    $(marker._icon).removeClass(function (index, css) {
                        return (css.match(/(^|\s)marker-color-\S+/g) || []).join(' ');
                    }).addClass(tools.setMarkerClassColor(selectedValue));
                });
            }
        },
        makeCleaningForm = function(id) {
                
            var marker = actions.tempmarkers[id],
                latlng = marker.getLatLng();
            
            // TODO Fill the form template
            // document.getElementById('create-cleaning-dialog').innerHTML = tmpl('tmpl-form-cleaning', data);

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
        },
        makeLitterForm = function(id) {},
        makeAreaForm = function(id) {},
        uploader = $(function () {
    
            $('.image-uploader').fileupload({

                headers: {'Authorization': 'Client-ID 6f050e213f46ba9'},
                type: 'POST',
                url: 'https://api.imgur.com/3/upload',
                dataType: 'json',
                paramName: 'image',
                progressall: function (e, data) {       
                    var progress = parseInt(data.loaded / data.total * 100, 10);
                    $('.progress').removeClass('hidden');
                    $('.progress-bar').css('width', progress + '%');
                },

                fail: function (err) {
                    console.log("upload error: ", err);
                    $('.progress').addClass('hidden').delay(400);
                },

                error: function (err) {
                    console.log("upload error: ", err);
                    $('.progress').addClass('hidden').delay(400);
                },

                done: function (e, data) {

                    console.log("IMGUR DATA OBJ: ", data);
                    $(e.target).parent().next().val(data.result.data.link);
                    $('.progress').addClass('hidden').delay(200);

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

            $('.btn-image-uploader').on('click', function () {

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
        });

    return {
        init: activate,
        makeGarbageForm: makeGarbageForm,
        makeCleaningForm: makeCleaningForm,
        makeLitterForm: makeLitterForm,
        makeAreaForm: makeAreaForm,
    };
    
}());

forms.init();