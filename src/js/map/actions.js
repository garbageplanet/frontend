/* jslint browser: true, white: true, sloppy: true, maxerr:1000 global: actions*/

/**
* User actions on the map and on features that are already present
*/

var actions = (function() {

    'use strict';

    var tempmarkers = [],        
        mapClick = function(map) {

            // This function is ugly
            // build a dedicated function
            // Check that there's not already something else going on in the UI
            if (!tools.checkOpenUiElement(map)){
                return;
            }

            // Else place a marker on the map
            else {
              
                // Make the actual marker
                var marker = L.marker(map.latlng, {
                    icon: maps.icons.genericMarker,
                    draggable: false,
                    feature_type: 'marker_generic'
                });
              
                marker.addTo(maps.unsavedMarkersLayerGroup);
                var markerid = marker._leaflet_id;

                actions.tempmarkers[markerid] = marker;
              
                // Set listeners in the case the marker isn't saved
                tools.bindTempMarkerEvents(markerid);
              
                // Pan action for desktop and larger screens
                if (!window.isMobile) {
                  
                    // This passes the marker obj directly to unsavedMarkerClick as an obj
                    marker.on('click', function() {
                        unsavedMarkerClick(marker);
                    });
                  
                    maps.map.panToOffset(marker.getLatLng(), tools.getHorizontalOffset());
                    $('.sidebar-content').hide();
                    $('#sidebar').scrollTop = 0;
                    ui.sidebar.show($("#create-marker-dialog").show());

                    // Send the marker to the forms
                    forms.passMarkerToForm(markerid);
                }

                // Pan action for mobile and small screens
                if (window.isMobile) {
                  
                // FIXME this is still very buggy
                  
                    // Check that there isn't already another marker menu visible on the screen
                    if (!$('.leaflet-marker-menu').is(':visible')) {
                      
                        // Make sure the marker doesn't already have a menu
                        // Don't allow creation of more than one temp marker on mobile
                        if (!marker._menu) {

                            marker.setMenu(tools.mobileMarkerMenu);
                            maps.map.panTo(marker.getLatLng());
                          
                            // debugger;

                            // Open the mobile menu if it's not already open
                            // TODO prevent feature click when mobile marker menu is open
                            if (!marker._menu._isOpened) {
                                
                                maps.map.off('click', mapClick);
                                marker.setZIndexOffset(1000);
                                marker.openMenu();
                                // Stop the map click listener
                                // Send the marker to the forms after the menu is created else the event listeners don't work
                                forms.passMarkerToForm(markerid);
                              
                                // Manually close the marker menu after selecting a menu item
                                $('.fa-marker-menu').on('click', function() {
                                  
                                    console.log('mobile marker menu item clicked');

                                    setTimeout(function() {
                                        if(marker) {
                                            if (marker._menu._isOpened) {
                                                marker.closeMenu();  
                                            }
                                        }
                                    }, 500);
                                });
                            }
                        }
                    }
                }
            }
        },
        unsavedMarkerClick = function(m) {
            
            // Clear all the marker icon styles when clicking on a marker when user is doing sthg
            // inside a form for another marker else it's possible to modify a new marker with
            // another marker not cleared nor saved
            if (!window.mobile) {
                actions.tempmarkers.forEach(function(index){
                    // console.log('index from unsavedMarkerClick loop: ', index._leaflet_id);
                    tools.resetIconStyle(index._leaflet_id);
                });
            }
                              
            var marker = m,
                markerid = m._leaflet_id,
                // marker = actions.tempmarkers[markerid],
                latlng = marker.getLatLng();                

            console.log("unsaved marker id from unsavedMarkerClick: ", markerid);
            console.log("unsaved marker obj from unsavedMarkerClick: ", marker);

            forms.passMarkerToForm(markerid);
          
            // Behavior for large screens
            if (!window.isMobile) {

                maps.map.panToOffset(latlng, tools.getHorizontalOffset());
                $('#sidebar').scrollTop = 0;
                $('.sidebar-content').hide();
                ui.sidebar.show($("#create-marker-dialog").fadeIn());
            }
          
            // Mobile behavior
            // Disabled this for now because it's too buggy
            /*if (window.isMobile) {

                if (marker._menu) {
                    // maps.map.panTo(marker.getLatLng());
                    // Toggle the mobile menu, the click listeners are already set with L.Marker.Menu.setMenu()
                    marker.setZIndexOffset(500);
                }

                if (!marker._menu) {
                    marker.setMenu(actions.mobileMarkerMenu);
                    maps.map.panTo(marker.getLatLng());
                    marker.openMenu();                  
                }
            }*/
        },
        featureClick = function(e, obj) {

            console.log("map feature clicked: ", obj);
            console.log("map feature clicked event: ", e);
          
            // Check that there's not already something else going on in the UI
            if (!tools.checkOpenUiElement()){
                return;
            }

            L.DomEvent.stopPropagation(e);

            if (obj.options) {

                // check if the feature is a shape
                if (obj.options.shape) {

                    // setTimeout(function () {
                    maps.map.panToOffset(obj.getCenter(), tools.getVerticalOffset());
                    ui.pushDataToBottomPanel(obj);
                    //}, 100);
                }

                // if not a shape clicked it's a marker, bring it to the map center with panToOffset()
                if (!obj.options.shape) {
                    // Rise the marker to the top of others
                    var currentZindex = obj._zIndex;
                    obj.setZIndexOffset(currentZindex + 10000);
                    maps.map.panToOffset(obj.getLatLng(), tools.getVerticalOffset());
                    ui.pushDataToBottomPanel(obj);
                }
            }
        },
        editFeature = function(e) {
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
        },
        confirmGarbage = function(e) {

            if (!localStorage.getItem('token')){
                alerts.showAlert(3, "info", 2000);
                return;

            } else {

                var callurl = null;

                if (e.feature_type === 'marker_garbage') {
                    callurl = api.confirmTrash.url(e.id);
                }

                else if (e.feature_type === 'polyline_litter') {
                    callurl = api.confirmLitter.url(e.id);
                }

                setTimeout(function () {

                    var useToken = localStorage.getItem('token') || tools.token;

                    $.ajax({

                        method: 'PUT',
                        url: callurl,
                        headers: {"Authorization": "Bearer" + useToken},
                        success: function (response) {

                            var message = response.data.message;
                            ui.pushDataToBottomPanel(response.data.data);

                            // TODO add the possibility to call loadFeatures() with an id to retrive only one marker

                            // update litters if we confirmed litter
                            if (message.indexOf('litter') === 0) {
                                features.loadLitters();
                            }
                            // else update trash markers to reflect new data
                            else {
                                features.loadGarbageMarkers();
                            }
                        },

                        error: function (err) {
                          alerts.showAlert(10, "info", 2000);
                        }
                  });

                }, 100);
            }
        },
        deleteFeature = function(o) {

            console.log("object passed to function: ", o);
            // debugger;

            // Set the ajax type and url for deletion given the type of feature
            if (o.options.feature_type) {

                switch (o.options.feature_type) {

                    case 'marker_cleaning':
                      var deletemethod = api.deleteCleaning.method;
                      var deleteurl = api.deleteCleaning.url(o.options.id);
                      break;

                    case 'polyline_litter':
                      var deletemethod = api.deleteLitter.method;
                      var deleteurl = api.deleteLitter.url(o.options.id);
                      break;

                    case 'polygon_area':
                      var deletemethod = api.deleteArea.method;
                      var deleteurl = api.deleteArea.url(o.options.id);
                      break;

                    case 'marker_garbage':
                      var deletemethod = api.deleteTrash.method;
                      var deleteurl = api.deleteTrash.url(o.options.id);
                      break;
                }

                var useToken = localStorage.getItem('token') || tools.token;

                if ((o.options.marked_by || o.options.created_by)  == localStorage.getItem('userid')) {

                    $.ajax({

                        type: deletemethod,
                        url: deleteurl,
                        headers: {"Authorization": "Bearer " + useToken},
                        success: function(response) {
                            ui.bottombar.hide();
                            maps.map.removeLayer(o);
                            // in leaflet 1.0, we can do o.remove();
                            // features.loadAllFeatures();
                            alerts.showAlert(7, "success", 1500);
                        },

                        error: function(response) {
                            console.log("DELETE ERROR: ", response);
                            alerts.showAlert(6, "warning", 2000);
                        }
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
        attendCleaning = function(e) {
             // TODO make session-dependant and allow once per user per marker
            if (!localStorage.getItem('token')){

                alerts.showAlert(3, "info", 2000);
                return;
            }

            else {

                setTimeout(function () {

                    var useToken = localStorage.getItem('token') || tools.token,
                        id = e.id;

                    $.ajax({

                        method: 'PUT',
                        url: api.attendCleaning.url(id),
                        headers: {"Authorization": "Bearer" + useToken},
                        success: function (response) {
                            // push the new data to the bottom bar
                            ui.pushDataToBottomPanel(response.data.data);

                            features.loadCleaningMarkers();
                        },
                        error: function (err) {
                            alerts.showAlert(10, "info", 2000);
                        }
                    });
                }, 100);
            }
        },
        joinGame = function(e) {
            // get the userid
            // check with backend if registered in area
            // allow to join
        },
        cleanedGarbage = function(e) {
            // TODO Finish this
            // TODO make session-dependant and allow once per user per marker
            // TODO change the value of the todo field to 'this has been cleaned already'
            if (!localStorage.getItem('token')){

                alerts.showAlert(3, "info", 2000);
                return;
            }

            else {

                setTimeout(function () {

                    var useToken = localStorage.getItem('token') || tools.token;

                    $.ajax({

                        method: api.editTrash.method,
                        url: api.editTrash.url(),
                        headers: {"Authorization": "Bearer" + useToken},
                        data: {
                            'clean': 1
                        },
                        success: function(data) {
                            // TODO reload the markers and bottombar to display change
                            console.log('success data', data);
                        },
                        error: function(err) {
                            alerts.showAlert(2, "info", 2000);
                            console.log('err', err);
                        }
                  });
                }, 100);
            }
        },
        bindEvents = function() {
          
            maps.map.on('click', mapClick);
          
        },
        init = function() {
          
            // Check the map obj is available
            if (maps.map) {
                bindEvents();
            }
          
        };
  
        init();
  
    return {
        mapClick: mapClick,
        featureClick: featureClick,
        editFeature: editFeature,
        confirmGarbage: confirmGarbage,
        deleteFeature: deleteFeature,
        attendCleaning: attendCleaning,
        joinGame: joinGame,
        cleanedGarbage: cleanedGarbage,
        tempmarkers: tempmarkers
    };
}());