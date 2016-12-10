/*jslint browser: true, white: true, sloppy: true, maxerr: 1000*/

/**
* User actions on the map and on features that are already present
*/


// FIXME:
// stop using L.layergroup or featuregroup with unsaved markers, that's why they catch the same colors XD

var actions = (function() {
    
    'use strict';
    // TODO, switch back to using a layerGroup fo unsaved markers so we can easily clear the markers form the map
    var tempmarkers = [],
        mapClick = function(map) {
            
            console.log("map clicked");
            // map.originalEvent.preventDefault();
                             
            // Check that there's not already something else going on in the UI
            if (!tools.checkOpenUiElement(map)){
                return;
            }
                          
            // Else place a marker on the map
            // TODO one prototypes for these both actions.addMarker()
            else {
                var marker, markerid;
                // Pan action for desktop and larger screens      
                if ($(window).width() > 767) {

                    // Make the actual marker
                    marker = L.marker(map.latlng, {
                                                    icon: maps.icons.genericMarker, 
                                                    draggable: true, 
                                                    feature_type: 'marker_generic'
                                                    });
                    marker.addTo(maps.map);
                    markerid = marker._leaflet_id;
                    actions.tempmarkers[markerid] = marker;
                    maps.map.panToOffset(marker.getLatLng(), tools.getHorizontalOffset()); 
                    $('.sidebar-content').hide();
                    $('#sidebar').scrollTop = 0;
                    ui.sidebar.show($("#create-marker-dialog").show());
                    marker.on('click', actions.unsavedMarkerClick);
                    // Get new coordinates after drag
                    marker.on("dragend", function (event){
                                            var newPos = event.target.getLatLng();
                                            $('.marker-latlng').val(newPos.lat + ", " + newPos.lng);
                                        }
                    );

                    // Set the event listener for unsaved markers
                    marker.on('click', actions.unsavedMarkerClick);
                    // Send the marker to the forms
                    actions.passMarkerToForm(markerid); 
                    // Set listeners if the marker isn't saved
                    tools.bindTempMarkerEvents(markerid);
                    return;
                }

                // Pan action for mobile and small screens
                if ($(window).width() < 768) {
                    // FIXME use the private method _isOpened() for hecking visibility
                    if (!$('.leaflet-marker-menu').is(':visible')) {
                    // if (!marker._menu || !marker._menu.isOpened) {

                        // Make an non-draggable marker on mobile
                        marker = L.marker(map.latlng, {
                                                        icon: maps.icons.genericMarker, 
                                                        draggable: false, 
                                                        feature_type: 'marker_generic'
                                                        });
                        marker.addTo(maps.map);
                        markerid = marker._leaflet_id;
                        actions.tempmarkers[markerid] = marker;
                        // marker.setMenu(tools.mobileMarkerMenu({markerid: markerid}));
                        marker.setMenu(tools.mobileMarkerMenu);
                        maps.map.panTo(marker.getLatLng());

                        // Set the event listener for unsaved markers
                        marker.on('click', actions.unsavedMarkerClick);

                        // Setlisteners if the marker isn't saved
                        tools.bindTempMarkerEvents(markerid);
                        // Open the mobile menu
                        if (!marker._menu._isOpened) {
                            marker.setZIndexOffset(1000);
                            marker.openMenu();
                            // Send the marker to the forms after the menu is created else the event listeners don't work
                            actions.passMarkerToForm(markerid);
                            return;
                        }
                        return;
                    }
                }
            }
        },
        unsavedMarkerClick = function() {
                 
            "use strict";

            var markerid = this._leaflet_id,
                marker = actions.tempmarkers[markerid],
                latlng = marker.getLatLng(),
                menu = this._menu;

            console.log("unsaved marker id from unsavedMarkerClick: ", markerid);
            console.log("unsaved marker obj from unsavedMarkerClick: ", marker);

            actions.passMarkerToForm(markerid);
            ui.bottombar.hide();

            // Mobile behavior
            // Toggle the mobile menu, the listeners are already set with setMenu()
            if ($(window).width() <= 768) {

                if (menu) {

                    // maps.map.panTo(marker.getLatLng());
                    marker.setZIndexOffset(500);
                    return;
                }

                if (!menu) {

                    marker.setMenu(actions.mobileMarkerMenu);
                    maps.map.panTo(marker.getLatLng());
                    marker.openMenu();
                    return;
                }
            }

            // Behavior for large screens
            if ($(window).width() > 768) {

                maps.map.panToOffset(latlng, tools.getHorizontalOffset());
                $('#sidebar').scrollTop = 0;
                $('.sidebar-content').hide();
                ui.sidebar.show($("#create-marker-dialog").fadeIn());

                marker.on("dragend", function(event){
                    var newpos = event.target.getLatLng();
                    $('.marker-latlng').val(newpos.lat + ", " + newpos.lng); 
                });
            }
        },
        featureClick = function(e, obj) {
            
            console.log("map feature clicked: ", obj);
            console.log("map feature clicked event: ", e);
                        
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
                // then load data into bottom panel and show it
                
            }
        },
        editFeature = function(e) {
            // TODO fill the form templates with the current marker data
            // TODO more secure way to restrict edition, must match current session token with id in backend
            // TODO Push the data to the form on .btn-edit click (requires to build all forms with templates)
            var userid = localStorage.getItem('userid');

            // FIXME use ===
            if (userid == e.marked_by) {

                ui.bottombar.hide();
                alerts.showAlert(11, "warning", 3000);

                if (e.feature_type === 'marker_garbage') {
                    ui.sidebar.show($('#create-garbage-dialog').fadeIn());
                }

                if (e.feature_type === 'marker_cleaning') {
                    ui.sidebar.show($('#create-cleaning-dialog').fadeIn());
                }

                if (e.feature_type === 'polyline_litter') {
                    ui.sidebar.show($('#create-litter-dialog').fadeIn());
                }

                if (e.feature_type === 'polygon_area') {
                    ui.sidebar.show($('#create-area-dialog').fadeIn());
                }
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

                    var useToken = localStorage.getItem('token') || window.token;

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

                var useToken = localStorage.getItem('token') || window.token;

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

                    var useToken = localStorage.getItem('token') || window.token,
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
        joinGame = function() {},
        cleanedGarbage = function(e) {
            // TODO Finish this
            // TODO make session-dependant and allow once per user per marker
            if (!localStorage.getItem('token')){

                alerts.showAlert(3, "info", 2000);
                return;
            }

            else {

                setTimeout(function () {

                    var useToken = localStorage.getItem('token') || window.token;

                    $.ajax({

                        method: api.confirmTrash.method,
                        url: api.confirmTrash.url(),
                        headers: {"Authorization": "Bearer" + useToken},
                        data: {
                            // TODO finish this
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
        passMarkerToForm = function(id) {

            "use strict";

            var id = id;
            // FIXME, this isn't working how it should, the event listeners shouldn't be set here.
            // do something like passMarkerToForm(id, type){...}
            $('.create-dialog').on('click', function(e) {

                e.preventDefault();

                if (e.target && id){

                    console.log($(this));

                    var ct = $(this).attr('href').toString();

                    console.log(ct);

                    if (ct.indexOf('garbage') !== -1){
                        forms.makeGarbageForm(id);
                        return;
                    }
                    if (ct.indexOf('cleaning') !== -1){
                        forms.makeCleaningForm(id);
                        return;
                    }
                    if (ct.indexOf('wastewater') !== -1){
                        forms.makeWastewaterForm(id);
                        return;
                    }
                    if (ct.indexOf('dieoff') !== -1){
                        forms.makeDieoffForm(id);
                        return;
                    }
                    if (ct.indexOf('floating') !== -1){
                        forms.makeFloatingForm(id);
                        return;
                    }
                    if (ct.indexOf('area') !== -1 || ct.indexOf('litter') !== -1) {
                        return
                    }
                }
            });
        };
    
    return {
        mapClick: mapClick,
        unsavedMarkerClick: unsavedMarkerClick,
        featureClick: featureClick,
        editFeature: editFeature,
        confirmGarbage: confirmGarbage,
        deleteFeature: deleteFeature,
        attendCleaning: attendCleaning,
        joinGame: joinGame,
        cleanedGarbage: cleanedGarbage,
        passMarkerToForm: passMarkerToForm,
        tempmarkers: tempmarkers,
        };
    
}());

maps.map.on('click', actions.mapClick);