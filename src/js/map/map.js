/*jslint browser: true, white: true, sloppy: true, maxerr: 1000*/
// Set the map
var map = L.map('map', {zoomControl: false, attributionControl: true});
// Add location hash
var hash = new L.Hash(map);

// Base layer
var baselayer = {
    
    "Mapbox Outdoors": L.tileLayer('https://api.tiles.mapbox.com/v4/adriennn.9da931dd/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYWRyaWVubm4iLCJhIjoiNWQ5ZTEwYzE0MTY5ZjcxYjIyNmExZDA0MGE2MzI2YWEifQ.WGCZQzbVhF87_Z_Yo1aMIQ',
    {maxZoom: 18,
     reuseTiles: true,
     attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>, Imagery &copy; <a href="http://mapbox.com">Mapbox</a>',
    }),
    
    "Mapbox Satellite": L.tileLayer('https://api.tiles.mapbox.com/v4/adriennn.nej0l93m/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYWRyaWVubm4iLCJhIjoiNWQ5ZTEwYzE0MTY5ZjcxYjIyNmExZDA0MGE2MzI2YWEifQ.WGCZQzbVhF87_Z_Yo1aMIQ',
    {maxZoom: 18,
     reuseTiles: true,
     attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>, Imagery &copy; <a href="http://mapbox.com">Mapbox</a>',
    })
    
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

// Make the controls
var zoomcontrol = L.control.zoom({position: 'topleft'});
var locationcontrol = L.control.locate({position: 'topleft'});
var scalecontrol = L.control.scale({metric: true, imperial: false});
var layerscontrol = L.control.layers(baselayer, overlayGroups, {position: 'topleft'});
var sidebar = L.control.sidebar('sidebar', {position: 'right', closebutton: 'true'});
var bottombar = L.control.sidebar('bottombar', {position: 'bottom', closebutton: 'true'});
var geocodercontrol = new L.Control.openCageSearch({key: '2bb5bf0d3b9300eacceb225f3cf9cd7d', limit: 5, position: 'topleft'}); //.setPosition('topleft');
var glomelogincontrol = L.control.login();

//Disable doubleclick to zoom as it might interfer with other map functions
map.doubleClickZoom.disable();

// Add zoom controls if not mobile / small screen
zoomcontrol.addTo(map);
locationcontrol.addTo(map);
scalecontrol.addTo(map);
layerscontrol.addTo(map);
geocodercontrol.addTo(map);
sidebar.addTo(map);
bottombar.addTo(map);

// TODO put this into the mobile code
if (window.innerWidth < 768) {
    // Delete the zoom keys from map
    map.removeControl(zoomcontrol);
};

// Set an icon on the layer select button
$('.leaflet-control-layers-toggle').append("<span class='fa fa-2x fa-globe fa-icon-control-centered'></span>");

// Request location update and set location if the address bar doesn't already contain a location at startup
var locating = (function (){
    
    var coordsinhrf = window.location.href.match(/[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)\/*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)/);
    
    var checkHref = function () {
        if (!coordsinhrf) {
            locationcontrol.start();
        }   
    };
    
    var onLocationFound = function (e) {
        map.setView(e.latlng, 18);
    };
    
    var onLocationError = function (e) {
      
        alerts.showAlert(16, "warning", 2000);
    
        if (coordsinhrf) {
            locationcontrol.stop();
        }
        // Show the world on localization fail
        else {
            map.setView([0, 0], 2);
        }
    
    };
    
    map.on('locationerror', onLocationError);
    map.on('locationfound', onLocationFound);
    // Locate on load
    map.locate();
    
})();




