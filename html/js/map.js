//Map scripts
// Set the map
// deflate turns shapes into markers at high zoom (minSize in pixels)
var map = L.map.deflate('map', { zoomControl: false, attributionControl: false, minSize: 50 });

// Locate the user and set the map position
map.locate({
    setView: true,
    maxZoom: 15
});

// Set the marker var else some other scripts complain
//var marker = new L.Marker();

// Creating attributions dynamically (GPLv2 author: humitos@github https://github.com/humitos/osm-pois)
var attribution = 'Data &#169; <a href="http://openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> and Contributors';

var tileLayerData = {
    std: {
    name: 'Basic',
    url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    },
    mapbox_od: {
    name: 'Outdoors',
    url: 'https://api.tiles.mapbox.com/v4/adriennn.9da931dd/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYWRyaWVubm4iLCJhIjoiNWQ5ZTEwYzE0MTY5ZjcxYjIyNmExZDA0MGE2MzI2YWEifQ.WGCZQzbVhF87_Z_Yo1aMIQ',
    attribution: 'Tiles <a href="http://mapbox.com/" target="_blank">MapBox</a>'
    },
    mapbox_sat: {
    name: 'Satellite',
    url: 'https://api.tiles.mapbox.com/v4/adriennn.nej0l93m/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYWRyaWVubm4iLCJhIjoiNWQ5ZTEwYzE0MTY5ZjcxYjIyNmExZDA0MGE2MzI2YWEifQ.WGCZQzbVhF87_Z_Yo1aMIQ',
    attribution: 'Tiles <a href="http://mapbox.com/" target="_blank">MapBox</a>'
    }
};

var tileLayers = {};
    for (tile in tileLayerData) {
        var tileAttribution;
        var subdomains = tileLayerData[tile].subdomains ? tileLayerData[tile].subdomains : 'abc';
            if (tileLayerData[tile].attribution) {
                tileAttribution = tileLayerData[tile].attribution + ' &mdash; ' + attribution;
            }
            else tileAttribution = attribution;
                tileLayers[tileLayerData[tile].name] = L.tileLayer(
                tileLayerData[tile].url,
                {attribution: tileAttribution, subdomains: subdomains}
            )
};
tileLayers['Outdoors'].addTo(map);
// end of GPLv2 by humitos@github

// Sidebar creation and placement
var sidebar = L.control.sidebar('sidebar', {
        position: 'right',
        closebutton: 'true',
        });
map.addControl(sidebar);

// Bottombar with L.sidebar
var bottombar = L.control.sidebar('bottombar', {
        position: 'bottom',
        closebutton: 'true',
        });
map.addControl(bottombar);

// Make the layer groups and add them to the map
garbageLayer = new L.LayerGroup();
areaLayer = new L.LayerGroup();
coastLayer = new L.LayerGroup();
eventLayer = new L.LayerGroup();

map.addLayer(garbageLayer, coastLayer, eventLayer, areaLayer);

var overlayGroups = {
"Garbage markers": garbageLayer,
"Cleaning events": eventLayer,
"Dirty coastal areas": coastLayer,
"Tiles and areas": areaLayer
};

map.on('moveend', function(e) {
    console.log('log map moveend');
    // garbageLayer.clearLayers();
    loadRemoteGarbageMarkers();
});

// Add zoom controls above scale
map.addControl( L.control.zoom({position: 'bottomright'}) );

// Add the layer control
L.control.layers(tileLayers, overlayGroups).setPosition('bottomright').addTo(map);

// Add a scale
new L.control.scale({
    metric: true,
    imperial: false
}).addTo(map);

//Disable doubleclick to zoom as it might interfer with other map functions
map.doubleClickZoom.disable();

// Default behaviour for creating a marker
map.on('click', onMapClick);  


function onMapClick(e) {

    if (!sidebar.isVisible() && !bottombar.isVisible()) {
       marker = L.marker(e.latlng, {
            icon:genericMarker,
            draggable: true
            }).on('click', onGenericMarkerClick);
        map.addLayer(marker);
        map.panTo(e.latlng);
        $('.sidebar-content').hide();
        $('#sidebar').scrollTop = 0;
        sidebar.show($("#create-marker-dialog").show());  
      
   } else { bottombar.hide();sidebar.hide(); }

};

// Disable creating markers at low zooms
/*
map.on('zoomend', function(e){
    if(e.target.getZoom() < 15){
        map.off('click', onMapClick);
    } else {
        map.on('click', onMapClick);
    }
}); 
*/

// Default marker types and set the marker classes
var genericMarker = L.divIcon({
    className: 'map-marker marker-color-gray marker-generic',
    iconSize: [30,30],
    html:'<i class="fa fa-fw"></i>'
});

var garbageMarker = L.divIcon({
    className: 'map-marker marker-garbage',
    iconSize: [30,30],
    html:'<i class="fa fa-fw"></i>'
});

var cleaningMarker = L.divIcon({
    className: 'map-marker marker-cleaning',
    iconSize: [30,30],
    html:'<i class="fa fa-fw"></i>'
});


var deflatedMarker = L.divIcon({
    className: 'map-marker marker-deflated',
    iconSize: [30,30],
    html:'<i class="fa fa-fw"></i>'
});