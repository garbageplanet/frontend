/* jslint browser: true, white: true, sloppy: true, maxerr: 1000 */
/* global $, L, maps */

/**
  * User interfaces that don't happen directly on the map
  */

var ui = ( function () {

    'use strict';

    var sidebar = L.control.sidebar('sidebar', {position: 'right', closebutton: 'true'});
    var bottombar = L.control.sidebar('bottombar', {position: 'bottom', closebutton: 'true'});

    function setContent (type, id) {

        console.log("setting content of bottom panel");

        var feature;

        // Retrieve the data from the feature according to type and find the leaflet id from the db id
        if ( type && type !== null ) {

            feature = tools.getLeafletObj(type, id);
            console.log('Feature: ', feature);
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
        // TODO extract function to make the datatable
        // TODO extract event listeners
        console.log('type of modal: ', type);
        console.log('data for table: ', arr);

        var template,
            typeobj,
            modaltmplname,
            modaltableid,
            modaltablebodyid,
            modalid,
            modalbodyid;

        var modalid          = 'modal-'      + type,
            modaltmplname    = 'tmpl-modal-' + type,
            modaltableid     = '#modal-'     + type + '-table',
            modaltablebodyid = 'modal-'      + type + '-table-body';

        // Build an object to pass to the templating engine
        var typeobj = {};
        typeobj[type] = type;

        // Make the modal skeleton inside of which we'll load the templates
        template = '<div id="' + modalid + '" class="modal" role="dialog"></div>';
        $('body').append(template);

        // if it's a data modal check that the array contains data else warn user
        if ( arr ) {
            if ( arr.length < 1 && ( type != 'game' ) ) {
                alerts.showAlert(29, 'warning', 2000);
                return;
            }
            else {

               var datatableoptions = {  lengthMenu:     [[5, 10, 20, -1], [5, 10, 20, "All"]],
                                         scrollY:        '50vh',
                                         scrollCollapse: true,
                                         paging:         false,
                                         retrieve:       true,
                                         bFilter:        false };

                // Fill the template skeleton and the data
                document.getElementById(modalid).innerHTML = tmpl('tmpl-modal', typeobj);
                document.getElementById(modaltablebodyid).innerHTML = tmpl(modaltmplname, arr);

                // Activate the datatables in the modal
                $(modaltableid).DataTable(datatableoptions);

                // Show the modal
                $('#' + modalid).modal('show');

                // Force sort the columns to fix thead width bug
                $(modaltableid).DataTable().order([0, 'desc']).draw();

                // Attach events for buttons
                $('#modal-data-load-more').on('click', function () {

                    maps.map.setZoom(tools.currentZoom - 1);

                    $('.modal-data-row').empty();

                    var newmarkers = tools.listMarkersInView(type);

                    document.getElementById(modaltablebodyid).innerHTML = tmpl(modaltmplname, newmarkers);
                    $(modaltableid).DataTable(datatableoptions);
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

        // Navigation for sidebar links
        $('.sidebar-link').on('click', function (e) {

            e.preventDefault();

            if( !ui.sidebar.isVisible() ) {
                ui.sidebar.show();
            }

            $(this.hash).fadeIn().siblings().hide();
            $('#sidebar').scrollTop = 0;
        });

        // Empty the sidebar on hide, reset accordion and reset scroll
        ui.sidebar.on('hide', function () {

            // Reset the router
            router.navigate('/');

            // FIXME this removes the placeholder as well ?
            // $('.bootstrap-tagsinput').tagsinput('removeAll');

            // Remove any unsaved marker on mobile
            if ( window.isMobile ) {
                // Reset sidebar close button visibility
                if ( $('.close-right').hasClass('hidden') ) {

                  $('.close-right').removeClass('hidden');
                }

                maps.unsavedMarkersLayerGroup.clearLayers();
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
          });

          // Events to execute when the bottombat is shown
          // FIXME, need to use tools.checkOpenUiElement()
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

    function _bindTopbarEvents () {

        // var usertools = $('#topbar').find('#dropdown-user-tools');
        var trashbinbutton = $('#topbar').find('#btn-trashbins');
        var modallink = $('#topbar').find('.modal-link');

        // Activate dropdown menu links in topbar
        // usertools.on('click', 'a', function (e) {
        //
        //     if ( $(this).hasClass('dropdown-link') ) {
        //         e.preventDefault();
        //         ui.bottombar.hide();
        //         ui.sidebar.show();
        //         $(this.hash).fadeIn().siblings().hide();
        //     }
        // });

        // Show nearby trashbins
        // TODO move these to router
        trashbinbutton.on('click', function () {

            if( maps.map.getZoom() < 15 ) {

                alerts.showAlert(31, 'info', 2000);
                return;

            } else {
                maps.getTrashBins();
            }
        });

        // Set the event listeners for modals in the topbar or elsewhere
        // TODO move these to router
        modallink.on('click', function (e) {

            e.preventDefault();

            var type = $(this).attr('name');
            var currentmarkers = tools.listMarkersInView(type);

            makeModal(type, currentmarkers);
        });

        // Register the navigo links in the topbar
        router.updatePageLinks();
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

            var ct = $(this).attr('name');
            console.log(ct);

            // Send the full leaflet object to actions dispatch function
            actions.act(ct, obj);
        });
    }

    function init () {

        console.log('init UI');

        // Add the Leaflet ui controls to the map
        sidebar.addTo(maps.map);
        bottombar.addTo(maps.map);

        // Fill the main topbar and set non-mobile listeners
        if ( !window.isMobile ) {
            document.getElementById('topbar').innerHTML = tmpl('tmpl-topbar-main', strings);
            _bindTopbarEvents();
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
    }
}());
