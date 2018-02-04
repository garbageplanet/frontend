/* jslint browser: true, white: true, sloppy: true, maxerr: 1000 */
/* global $, L, maps */

/**
  * User interfaces that don't happen directly on the map
  */

var ui = ( function () {

    'use strict';

    var strings = {
      version: 'v. unstable',
      credits : [
          {
              "title":"homepage",
              "linkurl":"http://garbageplanet.github.io/",
              "text":"Project"
          },
          {
              "title":"Let's Encrypt",
              "linkurl":"https://letsencrypt.org/",
              "text":"Certs with"
          },
          {
              "title":"Mapbox",
              "linkurl":"https://www.mapbox.com/",
              "text":"Basemaps imagery ©"
          },
          {
              "title":"Openstreetmap and contributors",
              "linkurl":"http://www.openstreetmap.org/",
              "text":"Maps and underlying data ©"
          },
          {
              "title":"Overpass API",
              "linkurl":"http://www.overpass-api.de/",
              "text":"POIs retrieved using the"
          },
          {
              "title":"OpenCage Geocoder",
              "linkurl":"https://geocoder.opencagedata.com/",
              "text":"Address search and geocoding using"
          },
          {
              "title":"Leaflet",
              "linkurl":"https://leafletjs.com/",
              "text":"Mapping done with "
          },
          {
              "title":"FontAwesome",
              "linkurl":"http://fontawesome.io/",
              "text":"Icons by"
          },
          {
              "title":"Bootstrap",
              "linkurl":"http://getbootstrap.com/",
              "text":"Built with"
          },
          {
              "title":"JQuery",
              "linkurl":"https://jquery.com/",
              "text":"Runs on"
          },
          {
              "title":"Laravel",
              "linkurl":"https://laravel.com/",
              "text":"Backed by"
          },
          {
              "title":"JavaScript-Templates",
              "linkurl":"https://github.com/blueimp/JavaScript-Templates",
              "text":"Templating with"
          },
          {
              "title":"Navigo",
              "linkurl":"https://github.com/krasimir/navigo",
              "text":"Frontend routing with"
          },
          {
              "title":"Imgur",
              "linkurl":"https://imgur.com",
              "text":"Image storage courtesy of"
          },
          {
              "title":"Github",
              "linkurl":"https://github.com/garbageplanet",
              "text":"Source code available on"
          },
          {
            "title": "privacy policy",
            "linkurl": "/info/privacy",
            "text": "Read our",
          }
      ]
    };
    var sidebar = L.control.sidebar('sidebar', {position: 'right', closebutton: 'true'});
    var bottombar = L.control.sidebar('bottombar', {position: 'bottom', closebutton: 'true'});

    function setContent (type, id) {

        console.log("setting content of bottom panel");

        var feature;

        // Retrieve the data from the feature according to type and find the leaflet id from the db id
        if ( type && type !== null ) {

            feature = tools.getLeafletObj(type, id);
        }
        // if the data is passed from the server JSON response (attend, confirm, join ...)
        // the actual data are in the second parameter passed to the function (id)
        // catch the error and continue with the alternative
        try {

            var featuredata = feature.options;
            console.log('feature data from ui.setContent()', featuredata);

        } catch (e) {

            console.log('options are somewhere else', e);

            try {

                var featuredata = id;
                console.log('feature data as id from ui.setContent()', featuredata);

            } catch (e) {

                alerts.showAlert(5, 'danger', 2000);
                return;
            }
        }

        // Fill the template data
        ui.bottombar.setContent( tmpl('tmpl-info-feature', featuredata) );
        ui.bottombar.show();

        // Set the vars after loading the template
        var featureinfo = $('#feature-info');

        // Add an imgur api character to the url to fetch thumbnails only and change the link to https
        if ( featuredata.image_url ) {

            var img_api_char = tools.insertString(featuredata.image_url, 26, 'b');
            var img_https = tools.insertString(img_api_char, 4, 's');

            featureinfo.find('.feature-image').attr('src', img_https);
        }

        // if there's a datetime field it's a cleaning event, we fetch the address from the reverse geocoder
        // if ( !featuredata.address || featuredata.address === 'undefined' || featuredata.address === '' ) {
        if ( featuredata.datetime ) {

            console.log('calling reverse geocoder');

            var getadress = tools.reverseGeocode(featuredata.latlng);

            getadress.done( function (data) {

                // console.log('data from Promise resolved:', data.results[0].formatted);
                featureinfo.find('.feature-info-location').html(data.results[0].formatted);

            }).catch( function (err) {

              console.log(err);
            });
        }

        // Create the templateData.social data dynamically before calling the template
        social.shareThisFeature(featuredata);

        // Bind actions for the feature only if it's not loaded from a JSON backend response
        if ( feature ) {
            _bindBottombarFeatureEvents(feature);
        }
    }

    function makeModal (type, arr) {

        console.log('type of modal: ', type);
        console.log('data for table: ', arr);

        var template,
            type_obj,
            modal_tmpl_name,
            modal_table_id,
            modal_table_body_id,
            modal_id,
            modal_body_id;

            modal_id            = 'modal-'      + type,
            modal_tmpl_name     = 'tmpl-modal-' + type,
            modal_table_id      = '#modal-'     + type + '-table',
            modal_table_body_id = 'modal-'      + type + '-table-body';

        // Build an object to pass to the templating engine
        var type_obj = {};
        type_obj[type] = type;

        // Make the modal skeleton inside of which we'll load the templates
        template = '<div id="' + modal_id + '" class="modal" role="dialog"></div>';
        $('body').append(template);

        // if it's a data modal check that the array contains data else warn user
        if ( arr ) {

            if ( arr.length < 1 && ( type != 'game' ) ) {

                alerts.showAlert(29, 'warning', 2000);
                return;

            } else {

                var data_table_options = {
                    lengthMenu     : [[5, 10, 20, -1], [5, 10, 20, "All"]],
                    scrollY        : '50vh',
                    scrollCollapse : true,
                    paging         : false,
                    retrieve       : true,
                    bFilter        : false
                };

                // Fill the template skeleton and the data
                document.getElementById(modal_id).innerHTML = tmpl('tmpl-modal', type_obj);
                document.getElementById(modal_table_body_id).innerHTML = tmpl(modal_tmpl_name, arr);

                // Activate the datatables in the modal
                $(modal_table_id).DataTable(data_table_options);

                // Show the modal
                $('#' + modal_id).modal('show');

                // Force sort the columns to fix thead width bug
                $(modal_table_id).DataTable().order([0, 'desc']).draw();

                // Attach events for buttons
                $('#modal-data-load-more').on('click', function () {

                    maps.map.setZoom(tools.currentZoom - 1);

                    $('.modal-data-row').empty();

                    var features = tools.listMarkersInView(type);

                    document.getElementById(modal_table_body_id).innerHTML = tmpl(modal_tmpl_name, features);
                    $(modal_table_id).DataTable(data_table_options);
                });

                $('#data-download-garbage, #data-download-cleaning').on('click', function (e) {

                    // FIXME event listener worksonly once?
                    e.preventDefault;
                    tools.downloadDataAsJSON(arr);

                });
            }
        }
    }

    function _bindSidebarEvents () {

        console.log('binding sidebar events');

        // Empty the sidebar on hide
        ui.sidebar.on('hide', function () {

            // Reset the router
            router.navigate('/');

            // Restart leaflet hash
            maps.hash.startListening();

            // Set empty content
            ui.sidebar.setContent('');

            // Reset sidebar close button visibility
            var close_right = document.querySelector('.close-right');

            if ( close_right.classList.contains('hidden') ) {

              close_right.classList.remove('hidden');
            }
        });

        ui.sidebar.on('show', function () {

            if ( ui.bottombar.isVisible() ) {

                ui.bottombar.hide();
            }
        });
    }

    function _bindBottombarEvents () {

          // Events to execute when the bottombar is hidden
          ui.bottombar.on('hide', function () {
              // force destroy the popup which hangs on certain tablets (tested on samsung w/ android)
              $('.btn-social').popover('destroy');
              // reset any modals that was created
              $('.modal').modal('hide').data('bs.modal', null);

              // Reset the router
              router.navigate('/');

              // Restart leaflet hash
              maps.hash.startListening();

              // Set empty content
              ui.bottombar.setContent('')
          });

          // Events to execute when the bottombat is shown
          // TODO this, need to use tools.checkOpenUiElement()
          ui.bottombar.on('show', function () {

              // hide the sidebar if it's visible
              if ( ui.sidebar.isVisible() ) {
                  ui.sidebar.hide();
              }

              if ( $('.leaflet-control-ocd-search').hasClass('leaflet-control-ocd-search-expanded') ) {
                  maps.geocodercontrol._collapse();
              }
          });

          // Destroy modals upon hiding them
          $('.modal').on('hidden.bs.modal', function () {
              $(body).find('.modal').remove();
          });
    }

    function _bindBottombarFeatureEvents (obj) {

        var btnfeature = $('#bottombar').find('.btn-feature');

        var options = {
            trigger: 'focus',
            html : true,
            container: 'body',
            placement: function (pop) {
                window.isMobile ? 'top' : 'right';
            },
            content: function () {
                return $('#social-links').html();
            },
            template: '<div class="popover popover-share" role="tooltip"><div class="popover-content popover-share"></div></div>'
        };

        // Event listener for share button and social links
        $('.btn-social').popover( options );

        // Event listener for actions buttons (edit, cleaned join, confirm, play)
        btnfeature.on('click', function (e) {

          // Warn the user if not logged in
          if ( !localStorage.getItem('token') ){

              alerts.showAlert(3, "info", 2000);
              return false;

          } else {

              var action_type = $(this).attr('name');
              console.log(action_type);

              // Send the full leaflet object to actions dispatch function
              // use bind
              actions.act(action_type, obj);
          }

        });
    }

    function init () {

        console.log('init UI');

        // Add the Leaflet ui controls to the map
        sidebar.addTo(maps.map);
        bottombar.addTo(maps.map);


        if ( !window.isMobile ) {
            // Fill the main topbar template on desktop
            document.getElementById('topbar').innerHTML = tmpl('tmpl-topbar-main', strings);
            // Register the navigo links in the topbar
            router.updatePageLinks();
        }

        // Set the rest of the listeners
        _bindSidebarEvents();
        _bindBottombarEvents();

        // custom alerts at startup for cookies
        // alerts.showAlert(32, 'warning', 5000);
    }

    return {   bottombar  : bottombar
             , init       : init
             , makeModal  : makeModal
             , setContent : setContent
             , sidebar    : sidebar
             , strings    : strings
    }
}());
