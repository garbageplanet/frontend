// Clear and retrieve all markers each time the map moves
// TODO a smarter way to fetch markers which aren't yet on the map
// such as serving markers as geoJSON https://github.com/glenrobertson/leaflet-tilelayer-geojson
map.on('movestart', function(e) {
    console.log('log movestart');
    garbageLayer.clearLayers();
});

map.on('moveend', function(e) {
    console.log('log map moveend');
    loadRemoteGarbageMarkers();
});

//Disable doubleclick to zoom as it might interfer with other map functions
map.doubleClickZoom.disable();

// Disable creating markers at low zooms
map.on('zoomend', function(e){
    if(e.target.getZoom() < 15){
        map.off('click', onMapClick);
    } else {
        map.on('click', onMapClick);
    }
});

// TODO Disable drawing at low zooms
map.on('zoomend', function(e){
    if(e.target.getZoom() < 18){
        map.on('draw:drawstart', function (e) {
        return false;
    });
   }
});