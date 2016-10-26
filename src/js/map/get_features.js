/*jslint browser: true, white: true, sloppy: true, maxerr: 1000*/
/**
* Loading map features from the backend
*/

var features =  (function(){
    
    var garbageArray = [];
    var cleaningArray = [];
    
    var loadGarbageMarkers = function () {
        
        garbageArray = [];
                
        setTimeout(function () {

            garbageLayerGroup.clearLayers();
            var useToken = localStorage.getItem('token') || window.token;
                        
            $.ajax({

                type: api.readTrashWithinBounds.method,
                url: api.readTrashWithinBounds.url(tools.getCurrentBounds()),
                success: function (data) {
                                        
                   // $.extend(garbageMarkers, data);
                    
                    $(data).each(function (index, obj) {
                        
                        garbageArray.push(obj);
                                                                        
                        // Need to parse the string from the db because LatLngs are now stored as single key:value pair
                        var latlng = obj.latlng.toString().replace(/,/g , "").split(' ');

                        var marker = new L.Marker(new L.LatLng(latlng[0],latlng[1]),
                            {
                                icon: garbageMarker,
                                id: obj.id,
                                amount: obj.amount,
                                types: obj.types.join(", "),
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
                        
                        garbageLayerGroup.addLayer(marker);

                        // $(marker._icon).addClass(setClassColor(obj.amount));
                        $(marker._icon).addClass(tools.setMarkerClassColor(obj.amount));
                        map.addLayer(garbageLayerGroup);
                        marker.on('click', function() {

                            // Bind click listener
                            featureClick(marker);
                            console.log("marker data:", marker)
                            // rise the marker to the top of others
                            // FIXME need to reset the value after clicking on another marker
                            // FIXME add highlighting (larger white circle underneath)
                            var currentZindex = marker._zIndex;
                            marker.setZIndexOffset(currentZindex + 10000);
                        });
                    });
                },
                error: function(data) {
                    console.log('Error getting garbage marker data', data);
                }
            });
        }, 100);
    };
    var loadCleaningMarkers = function () {
        
        // cleaningMarkers = {};
        cleaningArray = [];
        
        setTimeout(function () {

            cleaningLayerGroup.clearLayers();
            var useToken = localStorage.getItem('token') || window.token;

            $.ajax({

                type: api.readCleaningWithinBounds.method,
                url: api.readCleaningWithinBounds.url(tools.getCurrentBounds()),
                success: function(data) {
                    
                    // $.extend(cleaningMarkers, data);

                    $(data).each(function(index, obj) {

                        cleaningArray.push(obj);
                        
                        var latlng = obj.latlng.toString().replace(/,/g , "").split(' ');
                        var marker = new L.Marker(new L.LatLng(latlng[0], latlng[1]),
                            {
                                icon:cleaningMarker,
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

                        // TODO add hasLayer() logic here to only add absent markers?
                        cleaningLayerGroup.addLayer(marker);
                        map.addLayer(cleaningLayerGroup);
                        // TODO add logic to change marker color if date is before today
                        $(marker._icon).addClass('marker-color-blue');

                        marker.on('click', function() {
                            // Bind click listener
                            featureClick(marker);
                        });
                    });
                },
                error: function(data) {
                    console.log('Error getting cleaning event (marker) data', data);
                }
            });
        }, 200);
    };
    var loadAreas = function () {
        
        setTimeout(function () {

            areaLayerGroup.clearLayers();
            var useToken = localStorage.getItem('token') || window.token;

            $.ajax({

                type: api.readAreaWithinBounds.method,
                url: api.readAreaWithinBounds.url(tools.getCurrentBounds()),
                headers: {"Authorization": "Bearer " + useToken},
                success: function (data) {

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

                          areaLayerGroup.addLayer(polygonLayer);

                          map.addLayer(areaLayerGroup);
                          polygonLayer.on('click', function() {
                              // Bind click listener
                              featureClick(polygonLayer);
                          });
                        }
                    );
                },

                error: function (data) {
                    console.log('Error getting area (polygon) data');
                }
            });
        }, 400);
    };
    var loadLitters = function () {
        
        setTimeout(function () {

            litterLayerGroup.clearLayers();
            var useToken = localStorage.getItem('token') || window.token;

            $.ajax({

                type: api.readLitterWithinBounds.method,
                url: api.readLitterWithinBounds.url(tools.getCurrentBounds()),
                headers: {"Authorization": "Bearer " + useToken},
                success: function (data) {                

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
                            color: tools.setPolylineColor(obj.amount)
                        });

                        litterLayerGroup.addLayer(polylineLayer);
                        map.addLayer(litterLayerGroup);
                        polylineLayer.on('click', function() {

                            // Bind click listener
                            featureClick(polylineLayer);
                        });
                    });
                },

                error: function (data) {
                    console.log('Error getting litter (polyline) data', data);
                }
            });
        }, 300);
    };
    var loadAllFeatures = function() {
            loadGarbageMarkers; 
            loadCleaningMarkers; 
            loadAreas;
            loadLitters;
    }
    
    map.on('dragend zoomend', function (e){

        if (e.type === 'zoomend') {

            if (e.target.getZoom() >= 8 ) {
                loadGarbageMarkers();              
                loadCleaningMarkers();

                    if (e.target.getZoom() <= 16) {
                        loadLitters();
                        loadAreas();
                    }
            }
            
            if (e.target.getZoom() < 7) {
                areaLayerGroup.clearLayers;
                litterLayerGroup.clearLayers;
            } 
        }

        if (e.type === 'dragend') {
            if (e.distance >= window.innerWidth / 3) {

                if (e.target.getZoom() >= 8 ) {  
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
    
})();

