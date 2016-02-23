/*jslint browser: true, white: true, sloppy: true, maxerr: 1000*/

// Alerts by lgal http://stackoverflow.com/a/33662720/2842348
function showAlert(errorMessage, errorType, closeDelay) {

    // default to alert-info; other options include success, warning, danger
    if (!errorType || typeof errorType === 'undefined') {var errorType = "info";}

    var alert = $('<div class="alert alert-' + errorType + ' fade in">').append(errorMessage);
    // add the alert div to top of alerts-container, use append() to add to bottom
    $(".alert-container").prepend(alert);

    // if closeDelay was passed - set a timeout to close the alert
    if (closeDelay) {
      window.setTimeout(function() {alert.alert("close");}, closeDelay);
    }
};

// Set the map
var map = L.map('map', { zoomControl: false, attributionControl: false });
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

function onLocationError(e) {

  showAlert("Couldn't find your position.", "warning", 2000);
  map.setZoom(2);

}
// FIXME geolocation fails on mobile
/*function onLocationFound(e) {*/
// Locate the user if the url doesn't contains lat lngs regex by Iain Fraser http://stackoverflow.com/questions/3518504/regular-expression-for-matching-latitude-longitude-coordinates
  if (!window.location.href.match(/[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)\/*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)/)) {

    map.locate({setView: true, maxZoom: 16});

  };
/*}*/

map.on('locationerror', onLocationError);
/*
map.on('locationfound', onLocationFound);
*/

// Sidebar creation and placement
var sidebar = L.control.sidebar('sidebar', { position: 'right', closebutton: 'true' });
map.addControl(sidebar);

// Bottombar with L.sidebar
var bottombar = L.control.sidebar('bottombar', { position: 'bottom', closebutton: 'true' });
map.addControl(bottombar);

// Make the layer groups and add them to the map
var garbageLayerGroup = new L.LayerGroup(),
    areaLayerGroup = new L.FeatureGroup(),
    pathLayerGroup = new L.FeatureGroup(),
    cleaningLayerGroup = new L.LayerGroup();

map.addLayer(garbageLayerGroup, cleaningLayerGroup, pathLayerGroup, areaLayerGroup);

var overlayGroups = {
"Garbage markers": garbageLayerGroup,
"Cleaning events": cleaningLayerGroup,
"Littered coasts and roads": pathLayerGroup,
"Tiles and areas": areaLayerGroup
};

// Add zoom controls above scale
// TODO No zoom controls on mobile
// if (L.Browser.android || L.Browser.android23 || L.Browser.retina || L.Browser.mstouch ) {}
map.addControl(L.control.zoom({position: 'topleft'}));

// Add the layer control
L.control.layers(baselayer, overlayGroups).setPosition('topleft').addTo(map);

// Set an icon on the layer select button
$('.leaflet-control-layers-toggle').append("<span class='fa fa-2x fa-eye fa-icon-black fa-icon-centered'></span>");

// Add a scale
new L.control.scale({metric: true, imperial: false}).addTo(map);

//Disable doubleclick to zoom as it might interfer with other map functions
map.doubleClickZoom.disable();

// Store zoom
map.on('zoomend', function (e) {
  mapZoom = e.target.getZoom();

  if (mapZoom < 10) {
    showAlert("Zoom in closer to create features", "info", 1200);
  }

});

// Default marker types and set the marker classes
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
