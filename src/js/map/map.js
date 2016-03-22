/*jslint browser: true, white: true, sloppy: true, maxerr: 1000*/
// Set the map
var map = L.map('map', {zoomControl: false, attributionControl: false});
// Add location hash
var hash = new L.Hash(map);

// Base layer
var baselayer = {
    
    "Mapbox Outdoors": L.tileLayer('https://api.tiles.mapbox.com/v4/adriennn.9da931dd/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYWRyaWVubm4iLCJhIjoiNWQ5ZTEwYzE0MTY5ZjcxYjIyNmExZDA0MGE2MzI2YWEifQ.WGCZQzbVhF87_Z_Yo1aMIQ',
    {maxZoom: 20, reuseTiles: true}),
    
    "Mapbox Satellite": L.tileLayer('https://api.tiles.mapbox.com/v4/adriennn.nej0l93m/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYWRyaWVubm4iLCJhIjoiNWQ5ZTEwYzE0MTY5ZjcxYjIyNmExZDA0MGE2MzI2YWEifQ.WGCZQzbVhF87_Z_Yo1aMIQ',
    {maxZoom: 20, reuseTiles: true})
    
};

/* For production build purpose
var baselayer = {
    "Mapbox Outdoors": L.tileLayer('https://api.tiles.mapbox.com/v4/adriennn.9da931dd/{z}/{x}/{y}.png?access_token=@@mapboxToken',
    {maxZoom: 20, reuseTiles: true}),
    "Mapbox Satellite": L.tileLayer('https://api.tiles.mapbox.com/v4/adriennn.nej0l93m/{z}/{x}/{y}.png?access_token=@@mapboxToken',
    {maxZoom: 20, reuseTiles: true})
};
*/

baselayer['Mapbox Outdoors'].addTo(map);

// Set the minimap
/*var minimap = L.map('minimap', { zoomControl: false, attributionControl: false });
baselayer['Mapbox Outdoors'].addTo(minimap);
minimap.sync(map);*/

function onLocationError(e) {

    showAlert("Couldn't find your position.", "warning", 2000);

    map.setZoom(2);

}

// FIXME this doesnt work
// function onLocationFound(e) {
// Locate the user if the url doesn't contains lat lngs regex adatped from Iain Fraser http://stackoverflow.com/questions/3518504/regular-expression-for-matching-latitude-longitude-coordinates
  if (!window.location.href.match(/[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)\/*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)/)) {

    map.locate({setView: true, maxZoom: 16});

  }
// }

map.on('locationerror', onLocationError);

// map.on('locationfound', onLocationFound);


// Sidebar creation and placement
var sidebar = L.control.sidebar('sidebar', {position: 'right', closebutton: 'true'});

map.addControl(sidebar);

// Bottombar with L.sidebar
var bottombar = L.control.sidebar('bottombar', {position: 'bottom', closebutton: 'true'});

map.addControl(bottombar);

// Make the layer groups and add them to the map
var garbageLayerGroup = new L.LayerGroup(),
    
    areaLayerGroup = new L.FeatureGroup(),
    
    litterLayerGroup = new L.FeatureGroup(),
    
    cleaningLayerGroup = new L.LayerGroup(),
    
    allLayers = new L.LayerGroup([
        
                                      garbageLayerGroup,

                                      areaLayerGroup,

                                      cleaningLayerGroup,

                                      litterLayerGroup
        
                ]);

map.addLayer(garbageLayerGroup, cleaningLayerGroup, litterLayerGroup, areaLayerGroup);

var overlayGroups = {
    
  "Garbage markers": garbageLayerGroup,
    
  "Cleaning events": cleaningLayerGroup,
    
  "Littered coasts and roads": litterLayerGroup,
    
  "Tiles and areas": areaLayerGroup
    
};

// Add a scale, layers and zoom controls
// TODO Remove scale and zoom controls on mobile?
map.addControl(L.control.zoom({position: 'topleft'}));

L.control.layers(baselayer, overlayGroups).setPosition('topleft').addTo(map);

new L.control.scale({metric: true, imperial: false}).addTo(map);

// Set an icon on the layer select button
$('.leaflet-control-layers-toggle').append("<span class='fa fa-2x fa-eye fa-icon-black fa-icon-centered'></span>");

//Disable doubleclick to zoom as it might interfer with other map functions
map.doubleClickZoom.disable();

// Default marker types and classes
var genericMarker = L.divIcon({
    
    className: 'map-marker marker-color-gray marker-generic',
    
    iconSize: [30, 30],
    
    html: '<i class="fa fa-fw"></i>'
    
});

var garbageMarker = L.divIcon({
    
    className: 'map-marker marker-garbage',
    
    iconSize: [30, 30],
    
    html: '<i class="fa fa-fw"></i>'
    
});

var cleaningMarker = L.divIcon({
    
    className: 'map-marker marker-cleaning',
    
    iconSize: [30, 30],
    
    html: '<i class="fa fa-fw"></i>'
    
});
