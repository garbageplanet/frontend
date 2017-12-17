/* jslint browser: true, white: true, sloppy: true, maxerr: 1000 */
/* global L, $, tools, alerts, api, ui, maps, features, forms */

/**
* User actions on the map and on features that are already present
*/

var actions = ( function () {

    'use strict';

    function mapClick (map) {

        // this function needs to bepublic because we should be able to pause the listener (map.off('click')) from elsewhere
        console.log('caught a click to map from actions.mapClick()');

        // Check that there's not already something else going on in the UI and if yes then we don't do anything with the click
        if ( !tools.checkOpenUiElement(map) ) {
            return;
        }
        // Else place a marker on the map
        else {

            // Make the actual marker and add it to the map
            var marker = L.marker(map.latlng, { icon: maps.icons.genericMarker, draggable: false, feature_type: 'generic' });

            // Add the marker to the unsaved layer
            maps.unsavedMarkersLayerGroup.addLayer(marker);

            // Fetch the internal leaflet id
            var markerid = maps.unsavedMarkersLayerGroup.getLayerId(marker);

            console.log('markerid after setting it: ', markerid);

            // Send the marker id to the forms so we can retrieve the object without sending it around
            tools.states.currentFeatureId = markerid;

            // Set listeners in the case the marker isn't saved
            actions.bindUnsavedMarkerEvents(markerid);

            // Build the route
            var route = router.generate('form', {
                id: markerid,
                type: 'menu'
            });

            console.log('route:', route);

            // Show the menu with a delay on mobile

             if ( window.isMobile ) {

               maps.map.panTo(marker.getLatLng());

               setTimeout(
                 function () {
                   router.navigate(route);
                 }, 1000);

             } else {

               console.log('not mobile');
               maps.map.panToOffset(marker.getLatLng(), tools.getHorizontalOffset());
               router.navigate(route);
             }
        }
    }

    function _unsavedMarkerClick (obj) {

        console.log('caught click on unsaved marker');

        // Clear all the marker icon styles when clicking on a marker when user is doing sthg
        // inside a form for another marker else it's possible to modify a new marker with
        // another marker not cleared nor saved. This can only happen on desktop.
        if ( !window.mobile ) {

            console.log('unsavedMarkersLayerGroup data: ', maps.unsavedMarkersLayerGroup);

            for ( var i in maps.unsavedMarkersLayerGroup._layers ) {

                if (maps.unsavedMarkersLayerGroup._layers.hasOwnProperty(i)) {
                    tools.resetIconStyle(i);
                }
            }
        }

        // console.log("unsaved marker id from unsavedMarkerClick: ", maps.unsavedMarkersLayerGroup.getLayerId(obj));
        console.log("unsaved marker obj from unsavedMarkerClick: ", obj.layer);

        tools.states.currentFeatureId = maps.unsavedMarkersLayerGroup.getLayerId(obj.layer);

        // Behavior for large screens
        if ( !window.isMobile ) {

            maps.map.panToOffset(obj.layer.getLatLng(), tools.getHorizontalOffset());

            // Build the route
            var route = router.generate('form', {
                id: tools.states.currentFeatureId,
                type: 'menu'
            });

            console.log('route:', route);
            router.navigate(route)
        }
    }

    function _featureClick (obj) {

        console.log("map feature clicked obj: ", obj);

        // We must stop the bubbling else the map catches click
        L.DomEvent.stopPropagation(obj);

        console.log(maps.garbageLayerGroup.getLayers());

        // Build the route from the obj data with the db feature id and feature type
        var route = router.generate('feature.show', {
            id: obj.layer.options.id,
            // id: obj.layer._leaflet_id,
            type: obj.layer.options.feature_type
        });

        console.log('route:', route);

        router.navigate(route);

        // Purely visual logic below, the router dispatches the business logic
        if ( obj.layer.options ) {

            // check if the feature is a shape
            if ( obj.layer.options.shape ) {

                maps.map.panToOffset(obj.layer.getCenter(), tools.getVerticalOffset());

            } else {

                // if not a shape clicked it's a marker, bring it to the map center with panToOffset()
                // Rise the marker to the top of others
                var currentZindex = obj.layer._zIndex;

                obj.layer.setZIndexOffset(currentZindex + 10000);
                maps.map.panToOffset(obj.layer.getLatLng(), tools.getVerticalOffset());
            }
        } else {
          // return error to user
          console.log('no options in the object');
          alerts.showAlert(5, 'danger', 1000);
          return;
        }
    }

    function act (t, o) {

        console.log('acting type: ', t);
        console.log(o);
        t = t.trim();
        // oo, options only
        var opt = o.options;
        console.log('trimmed value t: ', t);

        switch (t) {

            case 'cleaned' : _cleanGarbage(opt);
            break;

            case 'confirm' : _confirmGarbage(opt);
            break;

            case 'attend' : _attendCleaning(opt);
            break;

            case 'join' : _joinGame(opt);
            break;
            // pass the full leaflet object to the delete method
            case 'delete' : _deleteFeature(o);
            break;

            case 'edit' : _editFeature(opt);
            break;

            default: return;
        }
    }

    function _editFeature (e) {

        if ( !localStorage.getItem('token' ) ) {

            alerts.showAlert(3, "info", 2000);
            return;

        } else {
            // TODO fill the form templates with the current marker data
            // TODO more secure way to restrict edition, must match current session token with id in backend
            // TODO Push the data to the form on .btn-edit click (requires to build all forms with templates)

            var userid = localStorage.getItem('userid'),
                useridmatch = e.created_by;

            if ( userid == useridmatch ) {

                // TEMPORARY warning about edit system
                alerts.showAlert(11, "warning", 3000);
            }

            else {
                alerts.showAlert(9, "danger", 3000);
                return;
            }
        }
    }

    function _confirmGarbage (e) {

        console.log('event value object options from _confirm garbage: ', e);

        if ( !localStorage.getItem('token') ){
            alerts.showAlert(3, "info", 2000);
            return;

        } else {

            var callurl = null;

            if ( e.feature_type === 'garbage' ) {
                callurl = api.confirmTrash.url(e.id);
            }

            else if ( e.feature_type === 'litter' ) {
                callurl = api.confirmLitter.url(e.id);
            }

            var useToken = localStorage.getItem('token') || tools.token;

            var confirmcall = $.ajax({
                method: 'PUT',
                url: callurl,
                headers: {"Authorization": "Bearer" + useToken},
                success: function (response) {
                    console.log(response);
                },
                error: function (err) {
                    console.log(err);
                }
            });

            confirmcall.done( function (response) {

                var message = response.data.message;

                ui.setContent(null, response.data.data);

                // update litters if we confirmed litter
                if (message.indexOf('litter') === 0) {
                    // features.loadLitters();
                    features.loadFeature('litter');
                }
                // else update trash markers to reflect new data
                else {
                    // features.loadGarbageMarkers();
                    features.loadFeature('garbage');
                }
            });
            confirmcall.fail(function() {
                alerts.showAlert(2, "info", 2000);
            });
        }
    }

    function _deleteFeature (o) {

        var deletemethod, deleteurl;

        console.log("object passed to function: ", o);
        // debugger;
        // cf, short for current feature
        var cf = o.options;
        // Set the ajax type and url for deletion given the type of feature
        if (cf.feature_type) {

            switch (cf.feature_type) {

                case 'cleaning':
                  deletemethod = api.deleteCleaning.method;
                  deleteurl = api.deleteCleaning.url(cf.id);
                  break;

                case 'litter':
                  deletemethod = api.deleteLitter.method;
                  deleteurl = api.deleteLitter.url(cf.id);
                  break;

                case 'area':
                  deletemethod = api.deleteArea.method;
                  deleteurl = api.deleteArea.url(cf.id);
                  break;

                case 'garbage':
                  deletemethod = api.deleteTrash.method;
                  deleteurl = api.deleteTrash.url(cf.id);
                  break;

                case 'marker':
                  deletemethod = api.deleteLink.method;
                  deleteurl = api.deleteLink.url(cf.id);
                  break;

                default: console.log('error deleting item');
            }

            var useToken = localStorage.getItem('token') || tools.token;

            if ((cf.marked_by || cf.created_by)  == localStorage.getItem('userid')) {

                var deletecall = $.ajax({
                    type: deletemethod,
                    url: deleteurl,
                    headers: {"Authorization": "Bearer " + useToken}
                });

                deletecall.done(function() {
                    // itd item to delete
                    // var itd = null;
                    maps.map.removeLayer(o);
                    alerts.showAlert(7, "success", 1500);
                    ui.bottombar.hide();

                    // Get the right map layer from which to delete the feature
                    /*switch (o.feature_type) {

                        case 'marker_cleaning':
                          itd = maps.cleaningLayerGroup.getLayer(o.id);
                          break;

                        case 'polyline_litter':
                          itd = maps.litterLayerGroup.getLayer(o.id);
                          break;

                        case 'polygon_area':
                          itd = maps.areaLayerGroup.getLayer(o.id);
                          break;

                        case 'marker_garbage':
                          itd = maps.garbageLayerGroup.getLayer(o.id);
                          break;

                        case 'link_marker':
                          itd = maps.linkLayerGroup.getLayer(o.id);
                          break;
                    }*/


                });

                deletecall.fail(function() {
                    alerts.showAlert(6, "warning", 2000);
                });
            }

            else {
                ui.bottombar.hide();
                alerts.showAlert(0, "danger", 2500);
                return;
            }
        } else {
            ui.bottombar.hide();
            alerts.showAlert(10, "warning", 2500);
            return;
        }
    }

    function _attendCleaning (e) {
         // TODO make session-dependant and allow once per user per marker
        if ( !localStorage.getItem('token') ){
            alerts.showAlert(3, "info", 2000);
            return;
        }

        else {

            var useToken = localStorage.getItem('token') || tools.token;

            var attendcall = $.ajax({
                method: 'PUT',
                url: api.attendCleaning.url(e.id),
                headers: {"Authorization": "Bearer" + useToken}
            });
            attendcall.done(function(response) {
                console.log('success:', response);
                // push the new data to the bottom bar
                ui.setContent(null, response.data.data);
                // features.loadCleaningMarkers();
                features.loadFeature('cleaning');
            });
            attendcall.fail(function(err) {
                console.log('error: ', err);
                alerts.showAlert(10, "info", 2000);
            });
        }
    }

    function _cleanGarbage (e) {

        if (!localStorage.getItem('token')){
            alerts.showAlert(3, "info", 2000);
            return;
        }

        else {

            var callurl = null;

            if ( e.feature_type === 'garbage' ) {
                callurl = api.cleanTrash.url(e.id);
            }

            else if ( e.feature_type === 'litter' ) {
                callurl = api.cleanLitter.url(e.id);
            }

            var useToken = localStorage.getItem('token') || tools.token;
            var cleancall = $.ajax({

                method: 'PUT',
                url: callurl,
                headers: {"Authorization": "Bearer" + useToken},
                success: function(response) {
                    console.log('success data', response);
                },
                error: function(err) {
                    console.log('err', err);
                }
          });

            cleancall.done(function (response) {

                var message = response.data.message;
                ui.setContent(null, response.data.data);

                if ( message.indexOf('litter') === 0 ) {
                    // features.loadLitters();
                    features.loadFeature('litter');
                }
                else {
                    // features.loadGarbageMarkers();
                    features.loadFeature('garbage');
                }
            });
            cleancall.fail(function () {
                alerts.showAlert(2, "info", 2000);
            });
        }
    }

    function _joinGame () {
        console.log('game not implemented');
        return;
    }

    function _bindEvents () {

        // NOTE the event listeners for most map feature actions are set in the ui/ui.js file in ui.setContent()
        // because we need to bind the feature data for each action

        console.log('binding basic map actions');
        maps.map.on('click', mapClick);

        // binding the 'click' on the L.clustermarkers only listen for click on actual markers, not the cluster markers
        maps.garbageLayerGroup.on('click', _featureClick);
        maps.litterLayerGroup.on('click', _featureClick);

        // Bind click on standard L.featureGroup
        maps.cleaningLayerGroup.on('click', _featureClick);
        maps.areaLayerGroup.on('click', _featureClick);

        // bind click to unsavedmarkers
        maps.unsavedMarkersLayerGroup.on('click', _unsavedMarkerClick);

        // Bind the click on the feature creation selector
        $('.create-dialog').on('click', function (e) {

            e.preventDefault();
            var ct = $(this).attr('href').toString();

            console.log(ct);
            console.log("id from create-dialog click binding: ", tools.states.currentFeatureId);

            forms.formDispatcher(tools.states.currentFeatureId, ct);
        });
    }

    function bindUnsavedMarkerEvents (id) {

        var marker = maps.unsavedMarkersLayerGroup.getLayer(id);
        var cancelbutton = $('.btn-cancel');

        ui.sidebar.on ('hide', function () {
            tools.resetIconStyle(id);
        });

        // Close sidebar if cancel button clicked and delete unsaved markers
        cancelbutton.on('click', function (e) {

            e.preventDefault();
            ui.sidebar.hide();

            if ( id ) {
                tools.resetIconStyle(id);
                maps.map.removeLayer(marker);
            } else {
              maps.unsavedMarkersLayerGroup.clearLayers();
            }
        });
    }

    function init () {

        // Check the map obj is available
        if ( maps.map !== undefined ) {
            _bindEvents();

        } else {
            setTimeout( function () {
                maps.map.once('ready', _bindEvents);
            }, 1000);
        }
    }

    return {   mapClick                : mapClick
             , act                     : act
             , bindUnsavedMarkerEvents : bindUnsavedMarkerEvents
             , init                    : init
    }
}());
