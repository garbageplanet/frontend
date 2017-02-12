/*jslint browser: true, white: true, sloppy: true, maxerr: 1000*/
/**
* Loading map features from the backend
*/

// TODO make a prototype for getting data from api instead of four different functions
// gbpn.features =
var features =  (function(){
    
    "use strict";
    
    // TODO, get all the markers in current view like this: http://stackoverflow.com/a/24342585
    // TODO make prototype and build the function from there instead of rewriting everything
    var garbageArray = [],
        cleaningArray = [],
        loadGarbageMarkers = function() {

            // Empty the current arrayfor storing markers
            garbageArray = [];

            setTimeout(function () {

                // Store the current data into a new object
                var useToken = localStorage.getItem('token') || tools.token;

                $.ajax({

                    type: api.readTrashWithinBounds.method,
                    url: api.readTrashWithinBounds.url(tools.getCurrentBounds()),
                    success: function (data) {

                        maps.garbageLayerGroup.clearLayers();

                        $(data).each(function (index, obj) {

                            garbageArray.push(obj);

                            // Need to parse the string from the db because LatLngs are now stored as single key:value pair
                            // FIXME, not sure what's going on, L.latlng doesn't want the latlng string passed directly
                            // because the comma inside the string is not recognized
                            var latlng = obj.latlng.toString().replace(/,/g , "").split(' ');
                            var marker = L.marker(L.latLng(latlng[0],latlng[1]),
                                {
                                    icon: maps.icons.garbageMarker,
                                    id: obj.id,
                                    amount: obj.amount,
                                    types: obj.types.join(', '),
                                    image_url: obj.image_url,
                                    latlng: obj.latlng,
                                    confirms: obj.confirms,
                                    todo: tools.setTodoFullText(obj.todo),
                                    tags: obj.tag,
                                    note: obj.note,
                                    feature_type: 'marker_garbage',
                                    size: obj.size,
                                    embed: obj.embed,
                                    created_by: obj.marked_by,
                                    created_at: obj.created_at,
                                    modified_at: obj.updated_at,
                                    cleaned: obj.cleaned,
                                    cleaned_by: obj.cleaned_by,
                                    cleaned_date: obj.cleaned_date
                                });

                            marker.addTo(maps.garbageLayerGroup);
                            $(marker._icon).addClass(tools.setMarkerClassColor(obj.amount));
                            
                            // TODO add the click listener on the L.featuregroup and
                            // use getLayerId to find the id and pass it to featureClick
                            marker.on('click', function(e) {
                                actions.featureClick(e, this)
                            });
                        });
                        // Add layer to map
                        // Only reload the new layer if it's different from current data
                        // TODO do this with contains(<LatLng> latlng) http://leafletjs.com/reference-1.0.0.html#latlngbounds-contains
                        // tools.checkLayerContents(garbageLayerGroup, tempGarbageLayerGroup);
                    },
                    error: function(data) {
                        console.log('Error getting garbage marker data', data);
                        alerts.showAlert(10, 'warning', 1500);
                    }
                });
            }, 100);
    },
        loadCleaningMarkers = function() {
        
            cleaningArray = [];

            setTimeout(function () {

                var useToken = localStorage.getItem('token') || tools.token;

                $.ajax({

                    type: api.readCleaningWithinBounds.method,
                    url: api.readCleaningWithinBounds.url(tools.getCurrentBounds()),
                    success: function(data) {

                        maps.cleaningLayerGroup.clearLayers();
                        // $.extend(cleaningMarkers, data);

                        $(data).each(function(index, obj) {

                            cleaningArray.push(obj);

                            var latlng = obj.latlng.toString().replace(/,/g , "").split(' ');
                            var marker = L.marker(L.latLng(latlng[0], latlng[1]),
                                {
                                    icon:maps.icons.cleaningMarker,
                                    id: obj.id,
                                    datetime: obj.datetime,
                                    latlng: obj.latlng,
                                    feature_type: 'marker_cleaning',
                                    attends: obj.attends,
                                    recurrence: obj.recurrence,
                                    created_by: obj.created_by,
                                    created_at: obj.created_at,
                                    modified_at: obj.updated_at
                                });

                            marker.addTo(maps.cleaningLayerGroup);
                            
                            // TODO add logic to change marker color if date is before today
                            $(marker._icon).addClass('marker-color-blue');
                            
                            marker.on('click', function(e) {
                                // Bind click listener
                                actions.featureClick(e, this);
                            });
                        });
                    },
                    error: function(data) {
                      console.log('Error getting cleaning event (marker) data', data);
                    }
                });
            }, 200);
        },
        loadAreas = function() {
        
            setTimeout(function () {

                var useToken = localStorage.getItem('token') || tools.token;

                $.ajax({

                    type: api.readAreaWithinBounds.method,
                    url: api.readAreaWithinBounds.url(tools.getCurrentBounds()),
                    headers: {"Authorization": 'Bearer ' + useToken},
                    success: function (data) {

                        maps.areaLayerGroup.clearLayers();

                        $(data).each(function(index, obj) {

                            var latlngs = JSON.parse("[" + obj.latlngs + "]");
                            var polygonLayer = new L.Polygon(latlngs,
                                {
                                    id: obj.id,
                                    title: obj.title,
                                    max_players: obj.max_players,
                                    curr_players: obj.curr_players, // how many user have already confirmed participation
                                    note: obj.note,
                                    tags: obj.tag,
                                    contact: obj.contact,
                                    feature_type: 'polygon_area',
                                    shape: true,
                                    created_by: obj.created_by,
                                    created_at: obj.created_at,
                                    modified_at: obj.updated_at,
                                    color: '#33cccc',
                                    weight: 5,
                                    opacity: 0.5,
                                    smoothFactor: 3
                                });

                              maps.areaLayerGroup.addLayer(polygonLayer);
                              // map.addLayer(areaLayerGroup);
                              polygonLayer.on('click', function(e) {
                                  // Bind click listener
                                  actions.featureClick(e, polygonLayer);
                              });
                            }
                        );
                    },
                    error: function (data) { console.log('Error getting area (polygon) data');}
                });
            }, 400);
        },
        loadLitters = function() {
        
            setTimeout(function () {

                var useToken = localStorage.getItem('token') || tools.token;

                $.ajax({

                    type: api.readLitterWithinBounds.method,
                    url: api.readLitterWithinBounds.url(tools.getCurrentBounds()),
                    headers: {"Authorization": 'Bearer ' + useToken},
                    success: function (data) {

                        maps.litterLayerGroup.clearLayers();

                        $(data).each(function(index, obj) {

                            var latlngs = JSON.parse("[" + obj.latlngs + "]");
                            var polylineLayer = L.polyline(latlngs,
                            {
                                id: obj.id,
                                amount: obj.amount,
                                types: obj.types.join(', '),
                                image_url: obj.image_url,
                                tags: obj.tag,
                                shape: true,
                                feature_type: 'polyline_litter',
                                created_by: obj.marked_by,
                                cleaned: obj.cleaned,
                                confirms: obj.confirms,
                                cleaned_by: obj.cleaned_by,
                                created_at: obj.created_at,
                                modified_at: obj.updated_at,
                                physical_length: obj.physical_length,
                                weight: 15, 
                                opacity: 0.5,
                                smoothFactor: 3,
                                color: tools.setPolylineColor(obj.amount),
                                clickable: true,
                            });

                            maps.litterLayerGroup.addLayer(polylineLayer);
                            // map.addLayer(litterLayerGroup);
                            polylineLayer.on('click', function(e) {
                                // Bind click listener
                                actions.featureClick(e, polylineLayer);
                            });
                        });
                    },
                    error: function (data) {
                      console.log('Error getting litter (polyline) data', data);
                    }
                });
            }, 300);
        },
        loadAllFeatures = function() {
            loadGarbageMarkers(); 
            loadCleaningMarkers(); 
            loadAreas();
            loadLitters();
    }, 
        naviguateFeatures = function(feature, direction) {
            // TODO
            // naviguate through the markers visible in currentView from the bottombar's  side buttons
            // var coord = feature.latlng,
                
        };
    
    // Load everything on first load
    maps.map.addOneTimeEventListener('ready', function() {
        features.loadAllFeatures();
    });
    
    // then load markers conditionally
    maps.map.on('dragend zoomend', function(e){
        console.log("map move: ", e);

        if (e.type === 'zoomend') {

            if (e.target.getZoom() >= 2 ) {
                loadGarbageMarkers();              
                loadCleaningMarkers();

                    if (e.target.getZoom() <= 16) {
                        loadLitters();
                        loadAreas();
                    }
            }
            
            if (e.target.getZoom() < 7) {
                maps.areaLayerGroup.clearLayers;
                maps.litterLayerGroup.clearLayers;
            } 
        }

        if (e.type === 'dragend') {
            if (e.distance >= window.innerWidth / 3) {

                if (e.target.getZoom() >= 2 ) {  
                    loadGarbageMarkers();
                    loadCleaningMarkers();

                    if (e.target.getZoom() >= 8 && e.target.getZoom() <= 16) {
                        loadLitters();
                        loadAreas();
                    }
                }
            }
        }
    });
    
    return {
        garbageArray: function() {return garbageArray},
        cleaningArray: function() {return cleaningArray},
        loadGarbageMarkers: loadGarbageMarkers,
        loadCleaningMarkers: loadCleaningMarkers,
        loadAreas: loadAreas,
        loadLitters: loadLitters,
        loadAllFeatures: loadAllFeatures
    };
    
}());

