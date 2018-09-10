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
    ];

    function _bindEvents (id, type) {

        console.log('binding form events');

        // Manually activate tabs because we use data-target instead of href which is incompatible with routing
        tools.activateTabs();

        // Style and activate multiselects
        $('.selectpicker').selectpicker({
            style: 'btn-lg btn-default text-center',
            size: 6
        });

        // Separate tags by hitting space bar or right key
       $('.feature-tags, .bootstrap-tagsinput').tagsinput({
            maxTags: 3,
            confirmKeys: [32, 39],
            maxChars: 16,
            trimValue: true
        });

        // Prevent sending the form with enter key with attr hack
        $('form').bind('keypress', function (e) {

            if ( e.keyCode === 13 ) {

                $('.btn-save').attr('type');
                e.preventDefault();
            }
        });

        // load form-specific events
        // TODO make this without a switch by e.g. calling _bind[type]
        switch (type) {
          case 'area': _bindAreaEvents(); break;
          case 'litter': _bindLitterEvents(); break;
          case 'cleaning': _bindCleaningEvents(id); break;
          case 'garbage': _bindGarbageEvents(id); break;
          case 'opengraph': _bindLinkmarkerEvents(); break;
        }
        // Re-initialize some listeners
        actions.bindUnsavedMarkerEvents();

        // Bind the event for saving the form data
        saving.init();
    }

    function _bindGarbageEvents (id) {

        // _initUploader();

        var marker = maps.unsavedMarkersLayerGroup.getLayer(id);
        var radio_input = $('input[type=radio]');

        radio_input.on('change', function () {

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

    function _bindCleaningEvents (id) {

        var marker = maps.unsavedMarkersLayerGroup.getLayer(id);

        console.log('loading cleaning form');

        // Setup the date widget
        var config = {
            enableTime: true,
            altInput: true,
            disableMobile: true,
            onChange: function (selectedDates, dateStr, instance) {
                console.log("cleaning event date: ", dateStr);
                // Change the icon of the marker if a time is set
                $(marker._icon).removeClass(function (index, css) {
                    return (css.match(/(^|\s)marker-color-\S+/g) || []).join(' ');
                }).removeClass(' marker-generic').addClass('marker-cleaning marker-color-blue');
            }
        };

        document.querySelector('#event-date-time-input').flatpickr(config);

    }

    function _bindLitterEvents () {
        // _initUploader();
        drawing.init('polyline');
    }

    function _bindAreaEvents () {
        drawing.init('polygon');
    }

    function _bindLinkmarkerEvents (id) {

        var btn_opengraph_fetch = $('.btn-opengraph-fetch');
        var og_content = document.getElementById('opengraph-content');

        // function toggleButtons (i) {
        //   if ( i === 'start' ) {
        //     btn_opengraph_fetch.text('...');
        //     btn_opengraph_fetch.attr('disabled', 'disabled');
        //   } else if ( i === 'stop' ) {
        //     btn_opengraph_fetch.text('Fetch');
        //     btn_opengraph_fetch.removeAttr('disabled');
        //   }
        // }

        // Bind the action to launch the scraper
        btn_opengraph_fetch.click( function () {

            // Retrieve the value of the url
            var url = $('#opengraph-url').val();

            toggleButtons('start',btn_opengraph_fetch);

            if (!url) {
              alerts.showAlert(34, 'danger', 2000);
              toggleButtons('stop',btn_opengraph_fetch);
              return;
            }

            // Start the scraper promise
            // $.when( tools.openGraphScraper(url) ).then( function (data) {

              tools.openGraphScraper(url).then(function (data) {

                console.log('data from openGraph Promise resolved:', data);

                // Load the data into the template
                og_content.innerHTML = tmpl('tmpl-result-opengraph', data);
                // Remove input styles
                $('#opengraph-content input, #opengraph-content textarea').css('border','none').css('background','transparent').css('box-shadow', 'none');

                toggle_buttons('stop');

            }).catch( function (err) {
                alerts.showAlert(null, 'info', 2000, JSON.stringify(err));
                toggle_buttons('stop');
            });
        });
    }

    function makeForm (id, type) {

        console.log('id from forms.makeForm(): ', id);
        console.log('type from forms.makeForm(): ', type);

        // Build the garbage type multipicker
        if ( type === 'garbage' || type === 'litter' ) {

            document.getElementById('type-select').innerHTML = tmpl('tmpl-form-garbage-type', garbagetypes);
        }

        // Hide the close button in the sidebar when we show forms because they have a cancel button
        document.querySelector('.close-right').classList.add('hidden');

        // Get the leaflet feature for single point markers
        var feature = maps.unsavedMarkersLayerGroup.getLayer(id);

        try {

            var latlng = feature.getLatLng();
            document.querySelector('.marker-latlng').value = latlng.lat + ", " + latlng.lng;
            //$('.marker-latlng').val(latlng.lat + ", " + latlng.lng);

        } catch (e) {

            console.log ('latlngs will be set from draw.js', e);
        }

        // init event listener and set forms widget options
        _bindEvents(id, type);
    }

    return Object.freeze({ makeForm : makeForm });
}());
