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
map.on('dragend zoomend', function (e){
  
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
    
    // console.log('loading garbage markers from db');
  
    garbageLayerGroup.clearLayers();
    
    var useToken = localStorage.getItem('token') || window.token;
    
    $.ajax({
        
        type: api.readTrashWithinBounds.method,
        
        url: api.readTrashWithinBounds.url(currentViewBounds),
        
        success: function (data) {
            
            $(data).each(function (index, obj) {
                
                // console.log(obj);

                var marker = new L.Marker(new L.LatLng(obj.lat, obj.lng),
                    {
                        icon: garbageMarker,
                        id: obj.id,
                        amount: obj.amount,
                        types: obj.types,
                        image_url: obj.image_url,
                        lat: obj.lat,
                        lng: obj.lng,
                        confirm: obj.confirm,
                        todo: obj.todo,
                        tags: obj.tag,
                        note: obj.note,
                        feature_type: obj.featuretype,
                        size: obj.size,
                        embed: obj.embed,
                        marked_by: obj.marked_by,
                        cleaned: obj.cleaned,
                        cleaned_by: obj.cleaned_by,
                        cleaned_date: obj.cleaned_date
                    });

                garbageLayerGroup.addLayer(marker);
                
                map.addLayer(garbageLayerGroup);

                marker.on('click', function() {
                    
                    // UI behavior
                    onGarbageMarkerClick(marker);
                    
                    // Push data
                    pushDataToBottomPanel(marker);
                    
                });

                switch(obj.amount){

                case 0:
                    $(marker._icon).addClass('marker-color-darkgreen');
                    break;
                case 1:
                    $(marker._icon).addClass('marker-color-green');
                    break;
                case 2:
                    $(marker._icon).addClass('marker-color-limegreen');
                    break;
                case 3:
                    $(marker._icon).addClass('marker-color-yellow');
                    break;
                case 4:
                    $(marker._icon).addClass('marker-color-gold');
                    break;
                case 5:
                    $(marker._icon).addClass('marker-color-orange');
                    break;
                case 6:
                    $(marker._icon).addClass('marker-color-orangered');
                    break;
                case 7:
                    $(marker._icon).addClass('marker-color-red');
                    break;
                case 8:
                    $(marker._icon).addClass('marker-color-darkred');
                    break;
                case 9:
                    $(marker._icon).addClass('marker-color-purple');
                    break;
                case 10:
                    $(marker._icon).addClass('marker-color-black');
                    break;
                default:
                    $(marker._icon).addClass('marker-color-unknown');
                    break;
                }
                
            });
            
        },
        
        error: function(data) {
            
            console.log('Something went wrong while fetching the garbage markers', data);
            
        }
        
    });
    
}

// Get cleanings
function loadCleaningMarkers () {
    
    // console.log('loading cleaning markers from db');

    cleaningLayerGroup.clearLayers();
    
    var useToken = localStorage.getItem('token') || window.token;

    $.ajax({
        
        type: api.readCleaningWithinBounds.method,
        
        url: api.readCleaningWithinBounds.url(currentViewBounds),
        
        success: function(data) {
            
            $(data).each(function(index, obj) {
                
                console.log(obj);

                var marker = new L.Marker(new L.LatLng(obj.lat, obj.lng),
                    {
                        icon:cleaningMarker,
                        id: obj.id,
                        date: obj.date,
                        lat: obj.lat,
                        lng: obj.lng,
                        feature_type: obj.featuretype,
                        participants: obj.participants,
                        recurrence: obj.recurrence,
                        marked_by: obj.marked_by

                    });
                
                // TODO add hasLayer() logic here to only add absent markers?
                cleaningLayerGroup.addLayer(marker);
                
                map.addLayer(cleaningLayerGroup);
                
                marker.on('click', function() {
                    
                    // UI behavior
                    onCleaningMarkerClick(marker);
                    
                    // Push data
                    pushDataToBottomPanel(marker);
                    
                });
                
            });
            
        },
        
        error: function(data) {
            
            console.log('Something went wrong while fetching the cleaning events', data);
            
        }
    });
    
}

// Get areas (polygons)
function loadAreas () {
    
    // console.log('loading remote area polygons');

    areaLayerGroup.clearLayers();

    var useToken = localStorage.getItem('token') || window.token;

    $.ajax({
      
        type: api.readAreaWithinBounds.method,
        
        url: api.readAreaWithinBounds.url(currentViewBounds),
        
        headers: {"Authorization": "Bearer " + useToken},
        
        success: function (data) {
            
            console.log('area data', data);

            $(data).each(function(index, obj) {

                console.log("object data", obj);

                  var polygonLayer = new L.Polygon(obj.latlngs,
                    {
                      id: obj.id,
                      title: obj.title,
                      max_players: obj.max_players,
                      curr_players: obj.curr_players, // how many user have already confirmed participation
                      note: obj.note,
                      tags: obj.tag,
                      contact: obj.contact,
                      feature_type: obj.featuretype,
                      marked_by: obj.marked_by
                    });

                  areaLayerGroup.addLayer(polygonLayer);

                  map.addLayer(areaLayerGroup);

                  polygonLayer.on('click', function() {

                      // Ui behavior
                      onAreaClick(polygonLayer);

                      // Push data
                      pushDataToBottomPanel(polygonLayer);
                  });

            }

          );

        },

        error: function (data) {

            console.log('Error getting area data', data);

        }
      
  });
    
}

// Get litters (polylines)
function loadLitters () {
    
    // console.log('loading remote litter polylines');

    litterLayerGroup.clearLayers();

    var useToken = localStorage.getItem('token') || window.token;
    
    $.ajax({
        
        type: api.readLitterWithinBounds.method,
        
        url: api.readLitterWithinBounds.url(currentViewBounds),
        
        headers: {"Authorization": "Bearer " + useToken},
        
        success: function (data) {
            
            console.log('litter data', data);

            $(data).each(function(index, obj) {
                
                console.log("object data", obj);

                var polylineLayer = new L.Polyline(obj.latlngs,
                {
                  id: obj.id,
                  amount: obj.amount,
                  types: obj.types,
                  image_url: obj.image_url,
                  tags: obj.tag,
                  feature_type: obj.featuretype,
                  marked_by: obj.marked_by,
                  cleaned: obj.cleaned,
                  cleaned_by: obj.cleaned_by,
                  physical_length: obj.physical_length
                });

              switch(obj.amount){
                      
                case 1:
                    polylineLayer.setStyle({color:"green"});
                    break;
                case 2:
                    polylineLayer.setStyle({color:"limegreen"});
                    break;
                case 3:
                    polylineLayer.setStyle({color:"yellow"});
                    break;
                case 4:
                    polylineLayer.setStyle({color:"gold"});
                    break;
                case 5:
                    polylineLayer.setStyle({color:"orange"});
                    break;
                case 6:
                    polylineLayer.setStyle({color:"orangered"});
                    break;
                case 7:
                    polylineLayer.setStyle({color:"red"});
                    break;
                case 8:
                    polylineLayer.setStyle({color:"darkred"});
                    break;
                case 9:
                    polylineLayer.setStyle({color:"purple"});
                    break;
                case 10:
                    polylineLayer.setStyle({color:"black"});
                    break;
                default:
                    polylineLayer.resetStyle();
                    break;
                      
              }

              litterLayerGroup.addLayer(polylineLayer);

              map.addLayer(litterLayerGroup);

              polylineLayer.on('click', function() {
                  
                  // UI behavior
                  onLitterClick(polylineLayer);
                  
                  // Push data
                  pushDataToBottomPanel(polylineLayer);
                  
              });
            }
                         
        );
            
        },
        
        error: function (data) {

            console.log('Error getting shape data', data);

        }
        
    });
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
