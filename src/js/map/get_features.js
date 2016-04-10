/*jslint browser: true, white: true, sloppy: true, maxerr: 1000*/
// Load the feature once in the currentView on page load
map.addOneTimeEventListener('move', function (e) {
    
    var bounds = map.getBounds();
    
    currentViewBounds = bounds._northEast.lat + ',%20' + bounds._northEast.lng + ',%20' + bounds._southWest.lat + ',%20' + bounds._southWest.lng;

    // console.log("currentViewBounds:", currentViewBounds);

    if (e.target.getZoom() >= 8 && e.target.getZoom() <= 16) {
        
        loadLitters();
        
    }

    if (e.target.getZoom() >= 8 ) {    
        
        loadGarbageMarkers();

        loadCleaningMarkers();
        
    }

    if (e.target.getZoom() >= 7 && e.target.getZoom() <=15) {
    
        loadAreas();
        
    }
    
});

// After the first page load, the features from the backend only if the map is moved by a certain extent (here window width / 2)
// TODO smarter way to determine smallest map move distance
// FIXME the data loading functions get called but the data is not fetched?
map.on('dragend zoomend', function (e){
  
    var bounds = map.getBounds();
    
    currentViewBounds = bounds._northEast.lat + ',%20' + bounds._northEast.lng + ',%20' + bounds._southWest.lat + ',%20' + bounds._southWest.lng;
    
    if (e.type === 'zoomend') {
                  
        if (e.target.getZoom() >= 8 && e.target.getZoom() <= 16) {

            loadLitters();

        }

        if (e.target.getZoom() >= 8 ) {

            loadGarbageMarkers();
                                
            loadCleaningMarkers();

        }

        if (e.target.getZoom() >= 7 && e.target.getZoom() <=15) {

            loadAreas();

        }
        
        if (e.target.getZoom() < 7) {

            areaLayerGroup.clearLayers();
            
            litterLayerGroup.clearLayers();

        }
        
    }

    if (e.type === 'dragend') {
          
        console.log("distance in pixels", e.distance);

        if (e.distance >= window.innerWidth / 3) {
            
            console.log("Window width / 3: ", window.innerWidth / 3);

            if (e.target.getZoom() >= 8 && e.target.getZoom() <= 16) {

                loadLitters();

            }

            if (e.target.getZoom() >= 8 ) {  

                loadGarbageMarkers();
                
                loadCleaningMarkers();

            }

            if (e.target.getZoom() >= 7 && e.target.getZoom() <=15) {

                loadAreas();

            }

        }
    
    }

});
  
// Get garbage
function loadGarbageMarkers () {
    
    setTimeout(function () {
    
        garbageLayerGroup.clearLayers();

        var useToken = localStorage.getItem('token') || window.token;

        $.ajax({

            type: api.readTrashWithinBounds.method,

            url: api.readTrashWithinBounds.url(currentViewBounds),

            success: function (data) {
                
                // Set the color given the amount of trash
                function setClassColor(c) {

                    return c === 1  ? 'marker-color-gree' :
                           c === 2  ? 'marker-color-limegree' :
                           c === 3  ? 'marker-color-yellow' :
                           c === 4  ? 'marker-color-gold' :
                           c === 4  ? 'marker-color-orange' :
                           c === 6  ? 'marker-color-orangered' :
                           c === 7  ? 'marker-color-red' :
                           c === 8  ? 'marker-color-penk' :
                           c === 9  ? 'marker-color-freespeech' :
                                      'marker-color-lonestar' ;
                    };
                
                console.log("Garbage markers successfully loaded.");

                $(data).each(function (index, obj) {

                    var marker = new L.Marker(new L.LatLng(obj.lat, obj.lng),
                        {
                            icon: garbageMarker,
                            id: obj.id,
                            amount: obj.amount,
                            types: obj.types.join(", "),
                            image_url: obj.image_url,
                            lat: obj.lat,
                            lng: obj.lng,
                            confirm: obj.confirm,
                            todo: obj.todo,
                            tags: obj.tag,
                            note: obj.note,
                            feature_type: 'marker_garbage',
                            size: obj.size,
                            embed: obj.embed,
                            marked_by: obj.marked_by,
                            cleaned: obj.cleaned,
                            cleaned_by: obj.cleaned_by,
                            cleaned_date: obj.cleaned_date
                        });

                    garbageLayerGroup.addLayer(marker);
                    
                    $(marker._icon).addClass(setClassColor(obj.amount));

                    map.addLayer(garbageLayerGroup);

                    marker.on('click', function() {

                        // UI behavior
                        onGarbageMarkerClick(marker);

                        // Push data
                        pushDataToBottomPanel(marker);

                    });
                    
                });

            },

            error: function(data) {

                console.log('Error getting garbage (marker) data', data);

            }

        });

        }, 200);
    
}

// Get cleanings
function loadCleaningMarkers () {
    
    setTimeout(function () {
    
        // console.log('loading cleaning markers from db');

        cleaningLayerGroup.clearLayers();

        var useToken = localStorage.getItem('token') || window.token;

        $.ajax({

            type: api.readCleaningWithinBounds.method,

            url: api.readCleaningWithinBounds.url(currentViewBounds),

            success: function(data) {
                
                console.log("Cleaning markers successfully loaded.");

                $(data).each(function(index, obj) {

                    // console.log(obj);

                    var marker = new L.Marker(new L.LatLng(obj.lat, obj.lng),
                        {
                            icon:cleaningMarker,
                            id: obj.id,
                            datetime: obj.datetime,
                            lat: obj.lat,
                            lng: obj.lng,
                            feature_type: 'marker_cleaning',
                            participants: obj.participants,
                            recurrence: obj.recurrence,
                            marked_by: obj.marked_by

                        });

                    // TODO add hasLayer() logic here to only add absent markers?
                    cleaningLayerGroup.addLayer(marker);

                    map.addLayer(cleaningLayerGroup);
                    
                    // TODO add logic to change marker color if date is before today
                    $(marker._icon).addClass('marker-color-blue');

                    marker.on('click', function() {

                        // UI behavior
                        onCleaningMarkerClick(marker);

                        // Push data
                        pushDataToBottomPanel(marker);

                    });

                });

            },

            error: function(data) {

                console.log('Error getting cleaning event (marker) data', data);

            }
        });
        
    }, 200);
    
}

// Get areas (polygons)
function loadAreas () {
    
    setTimeout(function () {
    
        // console.log('loading remote area polygons');

        areaLayerGroup.clearLayers();

        var useToken = localStorage.getItem('token') || window.token;

        $.ajax({

            type: api.readAreaWithinBounds.method,

            url: api.readAreaWithinBounds.url(currentViewBounds),

            headers: {"Authorization": "Bearer " + useToken},

            success: function (data) {
                
                console.log("Areas polygons successfully loaded.");

                // console.log('Loading area data', data);

                $(data).each(function(index, obj) {

                    console.log("object data", obj);
                    
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
                          marked_by: obj.marked_by
                        });

                      areaLayerGroup.addLayer(polygonLayer);

                      map.addLayer(areaLayerGroup);

                      polygonLayer.on('click', function() {

                          // UI behavior
                          onAreaClick(polygonLayer);

                          // Push data
                          pushDataToBottomPanel(polygonLayer);
                      });

                }

              );

            },

            error: function (data) {

                console.log('Error getting area (polygon) data', data);

            }

        });

    }, 200);
    
}

// Get litters (polylines)
function loadLitters () {
    
    setTimeout(function () {
    
        // console.log('loading remote litter polylines');

        litterLayerGroup.clearLayers();

        var useToken = localStorage.getItem('token') || window.token;

        $.ajax({

            type: api.readLitterWithinBounds.method,

            url: api.readLitterWithinBounds.url(currentViewBounds),

            headers: {"Authorization": "Bearer " + useToken},

            success: function (data) {                

                $(data).each(function(index, obj) {
                    
                var latlngs = JSON.parse("[" + obj.latlngs + "]");
                    
                // Set the color given the amount of trash
                function setColor(c) {

                    return c === 1  ? '#' :
                           c === 2  ? '#' :
                           c === 3  ? '#' :
                           c === 4  ? '#' :
                           c === 4  ? '#' :
                           c === 6  ? '#' :
                           c === 7  ? '#' :
                           c === 8  ? '#' :
                           c === 9  ? '#' :
                                      '#' ;
                    };
                    
                    var polylineLayer = L.polyline(latlngs,
                    {
                        id: obj.id,
                        amount: obj.amount,
                        types: obj.types.join(', '),
                        image_url: obj.image_url,
                        tags: obj.tag,
                        feature_type: 'polyline_litter',
                        marked_by: obj.marked_by,
                        cleaned: obj.cleaned,
                        cleaned_by: obj.cleaned_by,
                        physical_length: obj.physical_length,
                        color: setColor(obj.amount)
                    });
                    
                    
                    litterLayerGroup.addLayer(polylineLayer);
                    
                    map.addLayer(litterLayerGroup);

                    polylineLayer.on('click', function() {

                        // UI behavior
                        onLitterClick(polylineLayer);

                        // Push data - the function is inside the file js/ui/bottombar.js
                        pushDataToBottomPanel(polylineLayer);

                    });
                    
                });

            },

            error: function (data) {

                console.log('Error getting litter (polyline) data', data);

            }

        });
        
    }, 200);
}

// onClick behavior for saved garbage markers
function onGarbageMarkerClick (e) {
    
    console.log("Garbage marker clicked");
    
    map.panToOffset([e.options.lat, e.options.lng], _getVerticalOffset());
    
    sidebar.hide();
    
}

// onClick behavior for saved cleaning markers
function onCleaningMarkerClick (e) {
    
    console.log("Cleaning marker clicked");
    
    console.log(e);
    
    map.panToOffset([e.options.lat, e.options.lng], _getVerticalOffset());
    
    sidebar.hide();
    
}

// onClick behavior for saved areas
function onAreaClick (e) {
    
    console.log("remote polygon clicked");
    
    sidebar.hide();
    
    map.panToOffset(e.getCenter(), _getVerticalOffset());
    
    map.fitBounds(e.layer.getBounds());
    
}

// onClick behavior for saved litters
function onLitterClick (e) {
    
    console.log("remote polyline clicked");
    
    sidebar.hide();
    
    map.panToOffset(e.getCenter(), _getVerticalOffset());
    
    map.fitBounds(e.layer.getBounds(), {paddingBottomRight: [0,200]});
    
};
