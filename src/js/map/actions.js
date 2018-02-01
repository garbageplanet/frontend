/* jslint browser: true, white: true, sloppy: true, maxerr: 1000 */
/* global L, $, tools, alerts, api, ui, maps, features, forms */

/**
* User actions on the map and on features that are already present
*/

var actions = ( function () {

    'use strict';

    function mapClick (map) {

        // this function needs to be public because we should be able to pause the listener (map.off('click')) from elsewhere
        console.log('caught a click to map from actions.mapClick()');

        // Stop leaflet hash else it overrides the url for the router
        maps.hash.stopListening();

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
            var marker_id = maps.unsavedMarkersLayerGroup.getLayerId(marker);

            // Send the marker id to the forms so we can retrieve the object without sending it around
            // TODO use setter function for states?
            tools.states.currentFeatureId = marker_id;

            // Set listeners in the case the marker isn't saved
            actions.bindUnsavedMarkerEvents(marker_id);

            // Build the route
            var route = router.generate('form', {
                id: marker_id,
                type: 'menu'
            });

            console.log('route:', route);

            // Show the menu with a delay on mobile
             if ( window.isMobile ) {

                 maps.map.panTo(marker.getLatLng());

                 setTimeout( function () {
                     router.navigate(route);
                 }, 1000);

             } else {

                 maps.map.panToOffset(marker.getLatLng(), tools.getHorizontalOffset());
                 router.navigate(route);
             }
        }
    }

    function _unsavedMarkerClick (obj) {

        // Clear all the marker icon styles when clicking on a marker when user is doing sthg
        // inside a form for another marker else it's possible to modify a new marker with
        // another marker not cleared nor saved. This can only happen on desktop.
        console.log('unsavedMarkersLayerGroup data: ', maps.unsavedMarkersLayerGroup);

        // Stop leaflet hash else it overrides the url for the router
        maps.hash.stopListening();

        for ( var i in maps.unsavedMarkersLayerGroup._layers ) {

            if ( maps.unsavedMarkersLayerGroup._layers.hasOwnProperty(i) ) {
                tools.resetIconStyle(i);
            }
        }

        // TODO do we need this sate at all?
        tools.states.currentFeatureId = maps.unsavedMarkersLayerGroup.getLayerId(obj.layer);

        maps.map.panToOffset(obj.layer.getLatLng(), tools.getHorizontalOffset());

        // Build the route
        var route = router.generate('form', {
            id: tools.states.currentFeatureId,
            type: 'menu'
        });

        console.log('route:', route);
        router.navigate(route)

    }

    function _featureClick (obj) {

        console.log("map feature clicked obj: ", obj);

        // Stop leaflet hash else it overrides the url for the router
        maps.hash.stopListening();

        // We must stop the bubbling else the map catches clicks
        L.DomEvent.stopPropagation(obj);

        var id   = obj.layer.options.id;
        var type = obj.layer.options.feature_type;

        // Build the route from the obj data with the db feature id and feature type
        var route = router.generate('feature.show', {
            id   : id,
            type : type
        });

        console.log('route:', route);

        router.navigate(route);

        // Center the feature on the map
        tools.centerFeatureOnMap(maps.map, obj.layer)

    }

    function act (type, object/*, action*/) {

        // TODO pass by router?
        // TODO set navigo links in template
        // TODO get type from object
        // TODO merge attendCleaning, confirmGarbage and cleanGarbage as they all have the similar mechanism

        console.log('action type: ', type);
        console.log(object);
        type = type.trim();

        switch (type) {

            case 'cleaned' : _cleanGarbage(object.options);
            break;

            // case 'cleaned' :
            // case 'confirm' :
            // case 'attend'  : _toggleFeatureState(object.options, type);
            // break;

            case 'confirm' : _confirmGarbage(object.options);
            break;

            case 'attend' : _attendCleaning(object.options);
            break;

            case 'join' : _joinGame(object.options);
            break;
            // we pass the full leaflet object to the delete method so we can remove it from the map without going through loops
            case 'delete' : _deleteFeature(object);
            break;

            case 'edit' : _editFeature(object.options);
            break;

            default: return;
        }
    }

    function _editFeature (o) {

        // TODO fill the form templates with the current marker data
        // TODO more secure way to restrict edition, check session.checkLogin()
        // TODO Push the data to the form on .btn-edit click (requires to build all forms with templates)

        var user_id = localStorage.getItem('userid'),
            user_id_match = e.created_by;

        if ( user_id == user_id_match ) {

            // TEMPORARY warning about edit system
            alerts.showAlert(11, "warning", 3000);
        }

        else {
            alerts.showAlert(9, "danger", 3000);
            return;
        }
    }

    function _confirmGarbage (o) {

        console.log('event value object options from _confirm garbage: ', o);

        var token = localStorage.getItem('token') || tools.token;
        var feature_type = tools.capitalizeFirstLetter(o.feature_type);

        var params = {
          url: api['confirm' + feature_type].url(o.id),
          method: 'PUT',
          auth: "Bearer" + token
        };

        tools.makeApiCall(params, window.fetch)
            .catch(error => {
                console.log(error);
            }).then(response => {

                ui.setContent(null, response.data.data);

                response.data.message.indexOf('litter') === 0 ? features.loadFeature('litter') : features.loadFeature('garbage');
            });
    }

    function _deleteFeature (o) {

        console.log("object passed to function: ", o);

        var token = localStorage.getItem('token') || tools.token;

        // Check user rights
        // TODO warn user before deletion
        if ( (o.options.marked_by || o.options.created_by) === parseInt(localStorage.getItem('id'),10) ) {

            var type = tools.capitalizeFirstLetter(o.options.feature_type);

            var params = {
              url: api['delete' + type].url(o.options.id),
              method: api['delete' + type].method,
              auth: "Bearer " + token
            };

            tools.makeApiCall(params, window.fetch)

                .then(response => {

                  maps.map.removeLayer(o);
                  alerts.showAlert(7, "success", 1500);
                  ui.bottombar.hide();

                })

                .catch(err => {

                  console.log(err);
                  alerts.showAlert(6, "warning", 2000);

                });

        } else {

            ui.bottombar.hide();
            alerts.showAlert(0, "danger", 2500);
            return;
        }
    }

    function _attendCleaning (o) {

        // TODO merge with confirmGarbage() and change backend route for /attend/

        var token = localStorage.getItem('token') || tools.token;

        var params = {
          url: api.attendCleaning.url(o.id),
          method: 'PUT',
          auth: "Bearer" + token
        };

        tools.makeApiCall(params, window.fetch)
            .catch(error => {
                console.log(error);
            }).then(response => {

                ui.setContent(null, response.data.data);

                features.loadFeature('cleaning');
            });
    }

    function _cleanGarbage (o) {

        var token = localStorage.getItem('token') || tools.token;
        var feature_type = tools.capitalizeFirstLetter(o.feature_type);

        var params = {
          url: api['clean' + feature_type].url(o.id),
          method: 'PUT',
          auth: "Bearer" + token
        };

        tools.makeApiCall(params, window.fetch)
            .catch(error => {
                console.log(error);
            }).then(response => {

                ui.setContent(null, response.data.data);

                response.data.message.indexOf('litter') === 0 ? features.loadFeature('litter') : features.loadFeature('garbage');
            });
    }

    function _joinGame (o) {
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

        // bind click to unsavedmarkers on larger screens
        if ( !window.isMobile ) {

          maps.unsavedMarkersLayerGroup.on('click', _unsavedMarkerClick);
        }
    }

    function bindUnsavedMarkerEvents (id) {

        var marker = maps.unsavedMarkersLayerGroup.getLayer(id);
        var cancel_button = $('.btn-cancel');
        // var cancel_button = document.querySelectorAll('.btn-cancel');

        ui.sidebar.on ('hide', function () {
            tools.resetIconStyle(id);
        });

        // Close sidebar if cancel button clicked and delete unsaved markers
        cancel_button.on('click', function (e) {
        // cancel_button.addEventListener('click', function (e) {

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
             , featureClick            : _featureClick
    }
}());
