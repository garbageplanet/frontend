/*jslint browser: true, white: true, sloppy: true, maxerr: 1000*/
/**
* Loading map features from the backend
*/

// TODO make a prototype for getting data from api instead of four different functions
// TODO use promises instead of error, success in api calls
var features =  (function() {
    
    "use strict";
    
    var garbageArray = [],
        cleaningArray = [],
        useToken = localStorage.getItem('token') || tools.token,
        loadGarbageMarkers = function() {

            garbageArray = [];
            var fetchGarbage = $.ajax({
                type: api.readTrashWithinBounds.method,
                url: api.readTrashWithinBounds.url(tools.getCurrentBounds()),
                headers: {"Authorization": 'Bearer ' + useToken},
                success: function (data) {
                    console.log('Success getting garbage marker data', data);
                },
                error: function(data) {
                    console.log('Error getting garbage marker data', data);
                }
            });
            fetchGarbage.done(function(data) {
                
                maps.garbageLayerGroup.clearLayers();

                $(data).each(function(i, o) {
                  
                    console.log('value of ob.cleaned: ', o.cleaned);

                    garbageArray.push(o);

                    // Need to parse the string from the db because LatLngs are now stored as single key:value pair
                    var latlng = o.latlng.toString().replace(/,/g , "").split(' ');
                    var marker = L.marker(L.latLng(latlng[0],latlng[1]),
                        {
                          amount:       o.amount,  
                          cleaned:      o.cleaned,
                          cleaned_by:   o.cleaned_by,
                          cleaned_date: o.cleaned_date,
                          confirms:     o.confirms,
                          created_at:   o.created_at,
                          created_by:   o.marked_by,
                          embed:        o.embed,
                          id:           o.id,
                          image_url:    o.image_url,
                          modified_at:  o.updated_at,
                          latlng:       o.latlng,
                          note:         o.note,
                          size:         o.size,
                          tags:         o.tag,
                          types:        o.types.join(', '),
                      
                          icon: tools.setMarkerIcon(o.cleaned, o.todo, null),
                          todo: tools.setTodoFullText(o.todo),
                          
                          feature_type: 'marker_garbage'
                        });

                    marker.addTo(maps.garbageLayerGroup);
                    // Set the class for the marker color
                    $(marker._icon).addClass(tools.setMarkerClassColor(o.amount));

                    marker.on('click', function(e) {
                        actions.featureClick(e, this)
                    });
                });
            });
        },
        loadCleaningMarkers = function() {
        
            cleaningArray = [];
          
            var fetchCleaning = $.ajax({
                type: api.readCleaningWithinBounds.method,
                url: api.readCleaningWithinBounds.url(tools.getCurrentBounds()),
                headers: {"Authorization": 'Bearer ' + useToken},
                success: function(data) {
                    console.log('Success getting cleaning event (marker) data', data);
                },
                error: function(data) {
                  console.log('Error getting cleaning event (marker) data', data);
                }
            });
            fetchCleaning.done(function(data){
                maps.cleaningLayerGroup.clearLayers();

                    $(data).each(function(i, o) {

                        cleaningArray.push(o);

                        var latlng = o.latlng.toString().replace(/,/g , "").split(' ');
                        var marker = L.marker(L.latLng(latlng[0], latlng[1]),
                            {
                                attends:     o.attends, 
                                created_at:  o.created_at,
                                created_by:  o.created_by,
                                datetime:    o.datetime,
                                id:          o.id,
                                latlng:      o.latlng,
                                modified_at: o.updated_at,
                                recurrence:  o.recurrence,
                                
                                icon:        tools.setMarkerIcon(null, null, o.datetime),
                                feature_type: 'marker_cleaning',
                            });
                                 
                        marker.addTo(maps.cleaningLayerGroup);
                        marker.on('click', function(e) {
                            // Bind click listener
                            actions.featureClick(e, this);
                        });
                    });
            });
            /* fetchCleaning.fail(function(data){
                alerts.showAlert(10, 'warning', 1500);
            });*/
        },
        loadAreas = function() {
        
            var fetchArea = $.ajax({
                type: api.readAreaWithinBounds.method,
                url: api.readAreaWithinBounds.url(tools.getCurrentBounds()),
                headers: {"Authorization": 'Bearer ' + useToken},
                success: function (data) {
                    console.log('Success getting area data');
                },
                error: function (data) {
                  console.log('Error getting area data');
                }
            });
            fetchArea.done(function(data) {
              
                maps.areaLayerGroup.clearLayers();

                $(data).each(function(i, o) {

                    var latlngs = JSON.parse("[" + o.latlngs + "]");
                    var polygonLayer = new L.Polygon(latlngs,
                        {
                          contact:      o.contact,
                          created_by:   o.created_by,
                          created_at:   o.created_at,
                          curr_players: o.curr_players,
                          id:           o.id,
                          max_players:  o.max_players,
                          note:         o.note,
                          tags:         o.tag,
                          title:        o.title,
                          modified_at:  o.updated_at,

                          feature_type: 'polygon_area',
                          shape:        true,
                          color:        '#33cccc',
                          weight:       5,
                          opacity:      0.5,
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
            });
            /* fetchArea.fail(function(data) {
                alerts.showAlert(10, 'warning', 1500);
            });*/
          
        },
        loadLitters = function() {
            var fetchLitter = $.ajax({
                type: api.readLitterWithinBounds.method,
                url: api.readLitterWithinBounds.url(tools.getCurrentBounds()),
                headers: {"Authorization": 'Bearer ' + useToken},
                success: function (data) {
                  console.log('Success getting litter (polyline) data', data);
                },
                error: function (data) {
                  console.log('Error getting litter (polyline) data', data);
                }
            });
            fetchLitter.done(function(data) {
              
                maps.litterLayerGroup.clearLayers();

                $(data).each(function(i, o) {

                    var latlngs = JSON.parse("[" + o.latlngs + "]");
                    var polylineLayer = L.polyline(latlngs,
                    {
                        amount: o.amount,
                        cleaned: o.cleaned,
                        cleaned_by: o.cleaned_by,
                        confirms: o.confirms,
                        color: tools.setPolylineColor(o.amount),
                        created_at: o.created_at,
                        created_by: o.marked_by,
                        id: o.id,
                        image_url: o.image_url,
                        modified_at: o.updated_at,
                        physical_length: o.physical_length,
                        tags: o.tag,
                        types: o.types.join(', '),

                        shape: true,
                        feature_type: 'polyline_litter',
                        clickable: true,
                        weight: 15, 
                        opacity: 0.5,
                        smoothFactor: 3,
                    });

                    maps.litterLayerGroup.addLayer(polylineLayer);
                    // map.addLayer(litterLayerGroup);
                    polylineLayer.on('click', function(e) {
                        // Bind click listener
                        actions.featureClick(e, polylineLayer);
                    });
                });
            });
            /* fetchLitter.fail(function() {}); */
          
        },
        _loadAllFeatures = function() {
            loadGarbageMarkers(); 
            loadCleaningMarkers(); 
            loadAreas();
            loadLitters();
    };
    
    // Load everything on first load
    maps.map.addOneTimeEventListener('ready', function() {
        features.loadAllFeatures();
    });
    
    // then load markers conditionally
    maps.map.on('dragend zoomend', function(e) {
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
    };
}());