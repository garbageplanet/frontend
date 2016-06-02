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

// Add zoom controls if not mobile / small screen
if (window.innerWidth > 568) { 

    map.addControl(L.control.zoom({position: 'topleft'}));

}

// Create a global Locate control object
var locationcontrol = L.control.locate().addTo(map);

// request location update and set location if the address bar doesn't already contain a location at startup
if (!window.location.href.match(/[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)\/*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)/)) {

    locationcontrol.start();

}

    
function onLocationFound(e) {
    
    map.setView(e.latlng, 18);
    
/*    setTimeout(function () {
        
        locationcontrol.stop();
        
    }, 1000);*/
    
}
    
// FIXME donät reset view if there
function onLocationError(e) {
      
    showAlert("Couldn't find your position.", "warning", 2000);
    
    if (window.location.href.match(/[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)\/*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)/)) {

        locationcontrol.stop();
        
    }
    
    else {
        
        map.setView([0, 0], 2);
        
    }
    
}

map.on('locationerror', onLocationError);

map.on('locationfound', onLocationFound);

// Add scale and layers control
L.control.scale({metric: true, imperial: false}).addTo(map);

L.control.layers(baselayer, overlayGroups).setPosition('topleft').addTo(map);

// Setup the geocoder plugin
var opencageoptions = {
    key: '2bb5bf0d3b9300eacceb225f3cf9cd7d',
    limit: 5
};

var geocoder = L.Control.OpenCageSearch.geocoder(opencageoptions);

var geocodercontrol = new L.Control.openCageSearch(opencageoptions).setPosition('topleft').addTo(map);

// Set an icon on the layer select button
$('.leaflet-control-layers-toggle').append("<span class='fa fa-2x fa-globe fa-icon-control-centered'></span>");


// Add a glome anonymous login button if it's mobile
// FIXME rename object
if (window.innerWidth < 568) { 
    
    var logincontrol = L.control.login().addTo(map);

}

//Disable doubleclick to zoom as it might interfer with other map functions
map.doubleClickZoom.disable();