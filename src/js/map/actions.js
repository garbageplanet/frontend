/* jslint browser: true, white: true, sloppy: true, maxerr:1000 global: actions*/

/**
* User actions on the map and on features that are already present
*/

var actions = (function () {

    'use strict';

    var mapClick = function mapClick (map) {
          
            console.log('caught a click to map from actions.mapClick()');
      
            // this function needs to bepublic because we should be able to
            // pause the listener (map.off('click')) from outside
            var marker = null, 
                markerid = null;
          
            // Check that there's not already something else going on in the UI and if yes then we don't do anything with the click
            if (!tools.checkOpenUiElement(map)) {
                return;
            }
            // Else place a marker on the map
            else {
              
                // Make the actual marker and add it to the map
                marker = L.marker(map.latlng, { icon: maps.icons.genericMarker, draggable: false, feature_type: 'marker_generic' });
                // marker.addTo(maps.unsavedMarkersLayerGroup);
                maps.unsavedMarkersLayerGroup.addLayer(marker);
                markerid = maps.unsavedMarkersLayerGroup.getLayerId(marker);
                
                // Send the marker id to the forms so we can retrieve the object without sending it around
                forms.passMarkerToForm(markerid);
              
                // Show the menu with a delay on mobile
                if (window.isMobile) {
                    // Pan the map to center the marker  
                    maps.map.panTo(marker.getLatLng());
                  
                    setTimeout( function(){
                        ui.sidebar.show($("#create-marker-dialog").show());
                    }, 1000);
                }
              
                // On desktop,we keep the marker available event if not saved
                else if (!window.isMobile) {
                  
                    // Pan the map to center the marker
                    maps.map.panToOffset(marker.getLatLng(), tools.getHorizontalOffset());
                                    
                    // Set listeners in the case the marker isn't saved
                    tools.bindUnsavedMarkerEvents(markerid);
                  
                    // Reset the sidebar contents and show the form container
                    // the form itself is built from template from the function forms.passMarkerToForm() above
                    $('.sidebar-content').hide();
                    $('#sidebar').scrollTop = 0;
                    ui.sidebar.show($("#create-marker-dialog").show());
                }
            }
        },
        _unsavedMarkerClick = function _unsavedMarkerClick (obj) {
                                
            // Clear all the marker icon styles when clicking on a marker when user is doing sthg
            // inside a form for another marker else it's possible to modify a new marker with
            // another marker not cleared nor saved
            if (!window.mobile) {
              
                console.log('unsavedMarkersLayerGroup data: ', maps.unsavedMarkersLayerGroup);
              
                for (var i in maps.unsavedMarkersLayerGroup._layers) {

                    if (maps.unsavedMarkersLayerGroup._layers.hasOwnProperty(i)) {   
                        tools.resetIconStyle(i);
                    }
                }
            }
          
            // console.log("unsaved marker id from unsavedMarkerClick: ", maps.unsavedMarkersLayerGroup.getLayerId(obj));
            console.log("unsaved marker obj from unsavedMarkerClick: ", obj.layer);
          
            // forms.passMarkerToForm(obj.target._leaflet_id);
            forms.passMarkerToForm(maps.unsavedMarkersLayerGroup.getLayerId(obj.layer));
            // forms.passMarkerToForm(obj.target);
          
            // Behavior for large screens
            if (!window.isMobile) {

                maps.map.panToOffset(obj.layer.getLatLng(), tools.getHorizontalOffset());
                $('#sidebar').scrollTop = 0;
                $('.sidebar-content').hide();
                ui.sidebar.show($("#create-marker-dialog").fadeIn());
            }
        },
        _featureClick = function featureClick (obj) {

            console.log("map feature clicked obj: ", obj);
            
            // We must stop the bubbling else the map catches click
            // obj.originalEvent.preventDefault();
            L.DomEvent.stopPropagation(obj);

          
            // Check that there's not already something else going on in the UI
            // TODO need to bypass the bottombar check because we just want to update its contents
            // if it's already open with another marker data
            /*if (!tools.checkOpenUiElement()){
                return;
            }*/

            // L.DomEvent.stopPropagation(e);

            if ( obj.layer.options ) {
                // check if the feature is a shape
                if ( obj.layer.options.shape ) {
                  
                    maps.map.panToOffset(obj.layer.getCenter(), tools.getVerticalOffset());
                    ui.pushDataToBottomPanel(obj.layer);
                  
                } else {

                    // if not a shape clicked it's a marker, bring it to the map center with panToOffset()
                    // Rise the marker to the top of others
                    var currentZindex = obj.layer._zIndex;
                    obj.layer.setZIndexOffset(currentZindex + 10000);
                    maps.map.panToOffset(obj.layer.getLatLng(), tools.getVerticalOffset());
                    ui.pushDataToBottomPanel(obj.layer);
                }
            } else {
              console.log('no options in the object');
              return; 
            }
        },
        act = function act (t, o) {
            // NOTE t = classname for click target, o = feature object
            // we must check for both icon and button class because they can both catch clicks
          
            console.log('acting type: ', t);
            console.log(o);
            var t = t.trim();
            // oo, options only
            var oo = o.options;
            console.log('trimmed value t: ', t);

            switch (t) {
                                
                case 'cleaned' : _cleanGarbage(oo);
                break;

                case 'confirm' : _confirmGarbage(oo);
                break;

                case 'attend' : _attendCleaning(oo);
                break;

                case 'join' : _joinGame(oo);
                break;
                // pass the full leaflet object to the delete method
                case 'delete' : _deleteFeature(o);
                break;

                case 'edit' : _editFeature(oo);
                break;
                
                default: return;
            }
        },
        _editFeature = function editFeature (e) {
          
            if (!localStorage.getItem('token')){
                alerts.showAlert(3, "info", 2000);
                return;

            } else {
                // TODO fill the form templates with the current marker data
                // TODO more secure way to restrict edition, must match current session token with id in backend
                // TODO Push the data to the form on .btn-edit click (requires to build all forms with templates)
                var userid = localStorage.getItem('userid'),
                    useridmatch = e.created_by;
                    // id = marker._leaflet_id;

                if (userid == useridmatch) {

                    // ui.bottombar.hide();
                    // TEMPORARY warning about edit system
                    alerts.showAlert(11, "warning", 3000);

                    /*if (e.feature_type === 'marker_garbage') {
                        ui.sidebar.show($('#create-garbage-dialog'))
                        forms.passMarkerToForm(id);
                    }
                    if (e.feature_type === 'marker_cleaning') {
                        ui.sidebar.show($('#create-cleaning-dialog'))
                        forms.passMarkerToForm(id);
                    }
                    if (e.feature_type === 'polyline_litter') {
                        ui.sidebar.show($('#create-litter-dialog'))
                        forms.passMarkerToForm(id);
                    }
                    if (e.feature_type === 'polygon_area') {
                        ui.sidebar.show($('#create-area-dialog'))
                        forms.passMarkerToForm(id);
                    }*/
                }

                else {
                    alerts.showAlert(9, "danger", 3000);
                    return;
                }
            }
        },
        _confirmGarbage = function confirmGarbage (e) {
          
            console.log('event value object options from _confirm garbage: ', e);

            if (!localStorage.getItem('token')){
                alerts.showAlert(3, "info", 2000);
                return;

            } else {

                var callurl = null;

                if (e.feature_type === 'marker_garbage') {
                    var callurl = api.confirmTrash.url(e.id);
                }

                else if (e.feature_type === 'polyline_litter') {
                    var callurl = api.confirmLitter.url(e.id);
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
              
                confirmcall.done(function(response) {

                    var message = response.data.message;
                    ui.pushDataToBottomPanel(response.data.data);

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
        },
        _deleteFeature = function deleteFeature (o) {

            console.log("object passed to function: ", o);
            // debugger;
            // cf, short for current feature
            var cf = o.options;
            // Set the ajax type and url for deletion given the type of feature
            if (cf.feature_type) {

                switch (cf.feature_type) {

                    case 'marker_cleaning':
                      var deletemethod = api.deleteCleaning.method;
                      var deleteurl = api.deleteCleaning.url(cf.id);
                      break;

                    case 'polyline_litter':
                      var deletemethod = api.deleteLitter.method;
                      var deleteurl = api.deleteLitter.url(cf.id);
                      break;

                    case 'polygon_area':
                      var deletemethod = api.deleteArea.method;
                      var deleteurl = api.deleteArea.url(cf.id);
                      break;

                    case 'marker_garbage':
                      var deletemethod = api.deleteTrash.method;
                      var deleteurl = api.deleteTrash.url(cf.id);
                      break;
                    
                    case 'link_marker':
                      var deletemethod = api.deleteLink.method;
                      var deleteurl = api.deleteLink.url(cf.id);
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
                  
                    deletecall.done(function(response) {
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
        },
        _attendCleaning = function attendCleaning (e) {
             // TODO make session-dependant and allow once per user per marker
            if (!localStorage.getItem('token')){
                alerts.showAlert(3, "info", 2000);
                return;
            }

            else {

                var useToken = localStorage.getItem('token') || tools.token;
                var id = e.id;
                var attendcall = $.ajax({
                    method: 'PUT',
                    url: api.attendCleaning.url(id),
                    headers: {"Authorization": "Bearer" + useToken},
                    success: function (response) {
                        console.log('success:', response);
                    },
                    error: function (err) {
                        console.log('error: ', err);
                    }
                });
                attendcall.done(function(response) {
                    // push the new data to the bottom bar
                    ui.pushDataToBottomPanel(response.data.data);
                    // features.loadCleaningMarkers();
                    features.loadFeature('cleaning');
                });
                attendcall.fail(function() {
                    alerts.showAlert(10, "info", 2000);
                });
            }
        },
        _cleanGarbage = function cleanGarbage (e) {
          
            if (!localStorage.getItem('token')){
                alerts.showAlert(3, "info", 2000);
                return;
            }

            else {
              
                var callurl = null;

                if (e.feature_type === 'marker_garbage') {
                    var callurl = api.cleanTrash.url(e.id);
                }

                else if (e.feature_type === 'polyline_litter') {
                    var callurl = api.cleanLitter.url(e.id);
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
              
                cleancall.done(function(response) {

                    var message = response.data.message;
                    ui.pushDataToBottomPanel(response.data.data);

                    if (message.indexOf('litter') === 0) {
                        // features.loadLitters();
                        features.loadFeature('litter');
                    }
                    else {
                        // features.loadGarbageMarkers();
                        features.loadFeature('garbage');
                    }
                });
                cleancall.fail(function() {
                    alerts.showAlert(2, "info", 2000);
                });
            }
        },
        _joinGame = function joinGame (e) {
            console.log('game not implemented');
            return;
        },
        _bindEvents = function _bindEvents () {
          
            // NOTE the event listeners for most map feature actions are set in the ui/ui.js file in ui.pushDataToBottomPanel() 
            // because we need to bind the feature data for each action
            console.log('binding basic map action');
            maps.map.on('click', mapClick);
          
            // binding the 'click' on the L.clustermarkers only listen for click on actual markers, not the cluster markers
            maps.garbageLayerGroup.on('click', _featureClick);
            maps.litterLayerGroup.on('click', _featureClick);
          
            // Bind click on standard L.featureGroup
            maps.cleaningLayerGroup.on('click', _featureClick);
            maps.areaLayerGroup.on('click', _featureClick);
          
            // bind click to unsavedmarkers
            maps.unsavedMarkersLayerGroup.on('click', _unsavedMarkerClick);
        },
        _init = (function () {
          
            // Check the map obj is available
            if (maps.map) {
                _bindEvents();
            } else {
                setTimeout(function() {
                    maps.map.once('ready', _bindEvents)
                }, 500); 
            }
        }());
  
    return { mapClick: mapClick,
             act: act };
}());