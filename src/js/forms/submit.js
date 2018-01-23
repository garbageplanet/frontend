/* jslint browser: true, white: true, sloppy: true, maxerr: 1000 */
/* global L, $, tools, alerts, api, ui, maps, features, forms */

/**
  * Saving forms data to the backend
  */

// Save features on the map
var saving = ( function () {

    'use strict';

    function _saveFeature (formobj, formtype) {

        var form_type = tools.capitalizeFirstLetter(formtype);
        var token = localStorage.getItem('token') || tools.token;
        var auth = 'Bearer ' + token;

        // Prepare a submission object by checking if the form has any arrayed keys and join them in a string
        var submission_obj = tools.joinObjectProperties(formobj);

        var post_obj = {
          url: api['create' + form_type].url(),
          method: api['create' + form_type].method,
          auth: auth,
          data: submission_obj
        };

        tools.makeApiCall(post_obj, window.fetch)
            .catch(error => {

                  // TODO pass error.message to showAlert()

                  console.log(error);

                  alerts.showAlert(1, 'danger', 1500, error.message);
                  ui.sidebar.hide();
                  tools.resetIconStyle();
            })
            .then((response) => {

                console.log('post request', response);

                // Remove any unsaved marker
                for ( var i in maps.unsavedMarkersLayerGroup._layers ) {

                    if ( maps.unsavedMarkersLayerGroup._layers.hasOwnProperty(i) ) {

                        tools.resetIconStyle(i);
                        maps.map.removeLayer(maps.unsavedMarkersLayerGroup.getLayer(i));
                    }
                }

                // Reload map features after an item is saved
                // TODO need to change this logic for loading newly created features
                // call the route to retrieve data for a single feature after saved
                // and only render this particular feature
                // features.loadOne();
                features.loadFeature(formtype);
                alerts.showAlert(25, 'success', 1500);
                ui.sidebar.hide();

            });

      }

    function _bindEvents (obj) {

        console.log('current formobj: ', obj);

        var current_form = obj;

        current_form.on('keyup change keydown', function () {
            current_form.validator('validate');
        });

        // Form submission
        current_form.validator().on('submit', function (e) {

            if ( e.isDefaultPrevented() ) {
                // isDefaultPrevented is the way the validator plugin tells sthg is wrong with the form
                alerts.showAlert(30, 'danger', 2000);

            }  else {

                e.preventDefault();
                // Get the data from the form
                var form_name = current_form[0].className;
                var form_obj  = current_form.serializeObject();
                // console.log('Form obj:', form_obj);
                var clean_form_obj = tools.deleteEmptyKeys(form_obj);
                // console.log('Clean form obj:', clean_form_obj);

                // extract the form type from the classname and trim the string
                // with Navigo we can omit this because the info will be in the route obj
                var form_type = form_name.substr(form_name.lastIndexOf('-') + 1).trim();

                // Save the data with ajax
                // _saveFeature.bin({formObj: clean_form_obj, formType: form_type})
                _saveFeature(clean_form_obj, form_type);
            }
        });
    }

    function init () {
        // we init this code only when a form is created in forms._bindEvents() in src/js/forms/forms.js
        this.form = null;
        // Cache the current form, there's always only one .form-feature in the DOM
        this.form = $('.form-feature');
        _bindEvents(this.form);
    }

    return { init: init }
}());
