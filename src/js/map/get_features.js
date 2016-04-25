/*jslint browser: true, white: true, sloppy: true, maxerr: 1000*/
// Create a global array to store retrievable data objects for onscreen objects
var featurearray = [];

// Load the feature once in the currentView on page load
map.addOneTimeEventListener('move', function (e) {
    
    // use map.toBBoxString();
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
// TODO smarter way to load stuff
map.on('dragend zoomend', function (e){
  
    var bounds = map.getBounds();
    
    currentViewBounds = bounds._northEast.lat + ',%20' + bounds._northEast.lng + ',%20' + bounds._southWest.lat + ',%20' + bounds._southWest.lng;
    
    if (e.type === 'zoomend') {
        
        featurearray = [];
                  
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
            
            featurearray = [];
            
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

                    return c === 1  ? 'marker-color-limegreen'  :
                           c === 2  ? 'marker-color-yellow'     :
                           c === 3  ? 'marker-color-orangered'  :
                           c === 4  ? 'marker-color-red'        :
                                      'marker-color-violet';
                    };
                
                $(data).each(function (index, obj) {

                    // Need to parse the string from the db because LatLngs are now stored as single key:value pair
                    var latlng = obj.latlng.toString().replace(/,/g , "").split(' ');
                    
                    // Push data summary to global object
                    featurearray.push(
                        
                        {
                            "latlng":obj.latlng, 
                            "type":"garbage", 
                            "amount":obj.amount
                        });
                                                            
                    var marker = new L.Marker(new L.LatLng(latlng[0],latlng[1]),
                        {
                            icon: garbageMarker,
                            id: obj.id,
                            amount: obj.amount,
                            types: obj.types.join(", "),
                            image_url: obj.image_url,
                            latlng: obj.latlng,
                            confirm: obj.confirm,
                            todo: obj.todo,
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
                
                $(data).each(function(index, obj) {
                    
                    var latlng = obj.latlng.toString().replace(/,/g , "").split(' ');

                    var marker = new L.Marker(new L.LatLng(latlng[0], latlng[1]),
                        {
                            icon:cleaningMarker,
                            id: obj.id,
                            datetime: obj.datetime,
                            latlng: obj.latlng,
                            feature_type: 'marker_cleaning',
                            participants: obj.participants,
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

                    console.log("Area object data", obj);
                    
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

                        return c === 1  ? '#ccff66' :
                               c === 2  ? '#ffff00' :
                               c === 3  ? '#FF4500' :
                               c === 4  ? '#ff1a1a' :
                                          '#e60073' ;
                    };
                    
                    var polylineLayer = L.polyline(latlngs,
                    {
                        id: obj.id,
                        amount: obj.amount,
                        types: obj.types.join(', '),
                        image_url: obj.image_url,
                        tags: obj.tag,
                        feature_type: 'polyline_litter',
                        created_by: obj.marked_by,
                        cleaned: obj.cleaned,
                        cleaned_by: obj.cleaned_by,
                        created_at: obj.created_at,
                        modified_at: obj.updated_at,
                        physical_length: obj.physical_length,
                        weight: 15, 
                        opacity: 0.5,
                        smoothFactor: 3,
                        color: setColor(obj.amount)
                    });
                    
                    console.log("POLYLINE OBJ DATA: ", polylineLayer);
                    
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
    
    var latlng = e.options.latlng.toString().replace(/,/g , "").split(' ');
    
    console.log("Garbage marker clicked");
    
    map.panToOffset([latlng[0], latlng[1]], _getVerticalOffset());
    
    sidebar.hide();
    
}

// onClick behavior for saved cleaning markers
function onCleaningMarkerClick (e) {
    
    var latlng = e.options.latlng.toString().replace(/,/g , "").split(' ');
    
    console.log("Cleaning marker clicked");
    
    console.log(e);
    
    map.panToOffset([latlng[0], latlng[1]], _getVerticalOffset());
    
    sidebar.hide();
    
}

// onClick behavior for saved areas
function onAreaClick (e) {
    
    // map.off('click', onMapClick);
    
    console.log("remote polygon clicked");
    
    setTimeout(function () {
    
        sidebar.hide();

        bottombar.show();

        map.panToOffset(e.getCenter(), _getVerticalOffset());
        
    }, 100);
    
}

// onClick behavior for saved litters
function onLitterClick (e) {
        
    console.log("remote polyline clicked");
        
    setTimeout(function () {
    
        sidebar.hide();

        bottombar.show();

        map.panToOffset(e.getCenter(), _getVerticalOffset());
        
    }, 100);
   
};
