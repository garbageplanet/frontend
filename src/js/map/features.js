/*jslint browser: true, white: true, sloppy: true, maxerr: 1000*/
/**
* Loading map features from the backend
*/

var features =  (function() {
    
    'use strict';
    
    var garbageArray = [],
        cleaningArray = [],
        useToken = localStorage.getItem('token') || tools.token,
        /*_load = function(type) {
        // TODO finish this
            type = type.trim();
            switch (type) {
                case 'garbage' :
                // load 
                break;
                case 'cleaning' :
                // load 
                break;
                case 'litter' :
                // load 
                break;
                case 'areas' :
                // load 
                break;
                case 'all' :
                // 
                break;
            }
        },*/
        loadGarbageMarkers = function loadGarbageMarkers () {

            // garbageArray = [];
            var fetchGarbage = $.ajax({
                type: api.readTrashWithinBounds.method,
                url: api.readTrashWithinBounds.url(tools.getCurrentBounds()),
                crossDomain: true,
                headers: {
                          "Authorization": 'Bearer ' + useToken
                         },
                success: function(data) {
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

                    // garbageArray.push(o);
                  
                    garbageArray.indexOf(o) === -1 ? garbageArray.push(o) : console.log("This item already exists");

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
                      
                          icon: tools.setMarkerIcon(o.cleaned, null),
                          todo: (o.cleaned === true) ? tools.setTodoFullText("1") : tools.setTodoFullText(o.todo), // FIXME this doesnt do what it should be doing
                          
                          feature_type: 'marker_garbage'
                        });

                    marker.addTo(maps.garbageLayerGroup);
                    // Set the class for the marker color after the icon is loaded on the map
                    $(marker._icon).addClass(tools.setMarkerClassColor(o.amount));

                    marker.on('click', function(e) {
                        actions.featureClick(e, this)
                    });
                });
            });
        },
        loadCleaningMarkers = function loadCleaningMarkers () {
        
            // cleaningArray = [];
          
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

                        // cleaningArray.push(o);
                        cleaningArray.indexOf(o) === -1 ? cleaningArray.push(o) : console.log("This item already exists");

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
                                ext_link:    o.note,
                                icon:        tools.setMarkerIcon(null, o.datetime),
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
        loadAreas = function loadAreas () {
        
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
        loadLitters = function loadLitters () {
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
        _loadAllFeatures = function _loadAllfeatures () {
            loadCleaningMarkers(); 
            loadAreas();
            loadLitters();
            loadGarbageMarkers(); 
            // features._load('all';)
    },
        _bindEvents = (function _bindEvents () {

            console.log('Binding map self events.')
            // Load features conditionally if the wider bbox is set
            // if (tools.states.initialBbox.length !== 0) {
                // if the map was already loaded we listen to specific events before fetching features
                maps.map.on('zoomstart dragend zoomend', function(e) {
              
                console.log("map move event: ", e);
                var eventtype = e.type.trim();
                var newZoom = e.target.getZoom();
                var zoomDiff = Math.abs(newZoom - tools.states.currentZoom);
                var lengthDiff = e.distance;
                // fetching features if the map is panned by width / 3 is a good compromise for horizontal and vertical draggin
                var viewportRatio = window.innerWidth / 3;

                switch (eventtype) {

                    case 'zoomend':

                        console.log('zoomend event');
                        console.log("fist zoom: ", tools.states.currentZoom);
                        console.log("new zoom: ", newZoom);
                        console.log("zoom difference: ", zoomDiff);

                        // TODO we need a better way to load marker from the API
                        // for example we can pre-load from a larger area than current viewport bbox
                        // and only check with the backend if the viewport moves out of the bound of the currently
                        // loaded area, if it is we can then reload more markers.
                        // the only problem remains with the clusters, because when they are exploded
                        // the single markers lose their styles
                        if (newZoom >= 2 && zoomDiff >= 1) {
                            loadCleaningMarkers();
                            loadGarbageMarkers(); 

                           if (newZoom <= 16) {
                                loadLitters();
                                loadAreas();
                            }
                          
                        } else if (!zoomDiff) {
                            // if there's no prior zoom value it means we're loading for the first time
                            _loadAllFeatures();
                        }

                    break;
                    case 'dragend':
                        if (lengthDiff >= viewportRatio) {

                            if (newZoom >= 2 ) {
                                loadCleaningMarkers();
                                loadGarbageMarkers();

                                if (newZoom >= 8 && newZoom <= 16) {
                                    // We don't load large features if we're too close or too far
                                    loadLitters();
                                    loadAreas();
                                }
                            }
                        }
                    break;
                    case 'zoomstart':
                        tools.states.currentZoom = e.target.getZoom();
                    break;
                };
            });
            /*} else {
                // else we load an area beyond the viewport to cache the features
                var outerBbox = tools.getCurrentBounds();
                console.log('value of outerBbox from features._bindEvents()', outerBbox);
                tools.states.initialBbox = outerBbox;
                maps.map.once('zoomend', function() {
                    // var currentbounds = tools.roundBounds(maps.map.getBounds());
                    tools.states.roundedBounds = null;
                    console.log('bbox string: ', maps.map.getBounds());
                    _loadAllFeatures();
                });
            }*/
        }());
    
    return { garbageArray: function () {return garbageArray},
             cleaningArray: function () {return cleaningArray},
             loadGarbageMarkers: loadGarbageMarkers,
             loadCleaningMarkers: loadCleaningMarkers,
             loadAreas: loadAreas,
             loadLitters: loadLitters
    };
}());