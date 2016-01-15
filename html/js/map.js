// Set the map
// deflate turns shapes into markers at high zoom (minSize in pixels)
var map = L.map.deflate('map', { zoomControl: false, attributionControl: false, minSize: 50 });

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

// Locate the user
map.locate({setView: true, maxZoom: 15});

function onLocationError(e) {
    console.log('location error', e.message);
};

map.on('locationerror', onLocationError);

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
pathLayer = new L.LayerGroup();
eventLayer = new L.LayerGroup();

map.addLayer(garbageLayer, pathLayer, eventLayer, areaLayer);

var overlayGroups = {
"Garbage markers": garbageLayer,
"Cleaning events": eventLayer,
"Dirty coasts and roads": pathLayer,
"Tiles and areas": areaLayer
};

// Add zoom controls above scale
map.addControl( L.control.zoom({position: 'topright'}) );

// Add the layer control
L.control.layers(tileLayers, overlayGroups).setPosition('topright').addTo(map);

// Set an icon on the layer select button
$('.leaflet-control-layers-toggle').append("<span class='fa fa-2x fa-fw fa-th-large fa-icon-black fa-icon-centered'></span>");

// Add a scale
new L.control.scale({
    metric: true,
    imperial: false
}).addTo(map);

//Disable doubleclick to zoom as it might interfer with other map functions
map.doubleClickZoom.disable();

map.on('moveend', function(e) {
    console.log('log map moveend');
    // garbageLayer.clearLayers();
    loadRemoteGarbageMarkers();
});

//MapToOffset//////////////////////////////////////////////////////////
//See license.md in this repo Copyright 2013 Code for America//////////
L.Map.prototype.panToOffset = function (latlng, offset, options) {
    var x = this.latLngToContainerPoint(latlng).x - offset[0]
    var y = this.latLngToContainerPoint(latlng).y - offset[1]
    var point = this.containerPointToLatLng([x, y])
    return this.setView(point, this._zoom, { pan: options })
};

// Adapted functions
function _getVerticalOffset () {
  var vOffset = [0, 0]
  vOffset[1] = - $(window).height() / 4;
  vOffset[0] = 0;
  return vOffset;
};

function _getHorizontalOffset () {
  var hOffset = [0, 0]
  hOffset[0] = - $(window).height() / 4;
  hOffset[1] = 0;
  return hOffset;
};
//////////////////////////////////////////////////////////////////////

// Default behaviour for creating a marker
map.on('click', onMapClick);  

function onMapClick(e) {

    if (!sidebar.isVisible() && !bottombar.isVisible()) {
       marker = L.marker(e.latlng, {
            icon:genericMarker,
            draggable: true
            }).on('click', onLocalMarkerClick).addTo(map);
       
            /*map.on('zoomend', function(e){
                if(e.target.getZoom() < 7){
                    $('.alert-zoom').removeClass('hidden');
                }}); */
      
        $('.form-garbage .marker-lat').val(marker._latlng.lat);
        $('.form-garbage .marker-lng').val(marker._latlng.lng);
      
        // $('#activate-tile-dialog .tile-center-lat').html(e.latlng.lat);
        // $('#activate-tile-dialog .tile-center-lng').html(e.latlng.lng);
        
        //map.addLayer(marker);
      
        map.panToOffset(marker._latlng, _getHorizontalOffset());
      //debugger;
        $('.sidebar-content').hide();
        $('#sidebar').scrollTop = 0;
        sidebar.show($("#create-marker-dialog").show());
      
        marker.on("dragend", function(event){
          var newPos = event.target.getLatLng();
          // console.log("dragged to latlng:", newPos );
          // debugger;
          console.log("dragged marker id:", event.target._leaflet_id );
          // debugger;
          $('.form-garbage .marker-lat').val(newPos.lat);
          $('.form-garbage .marker-lng').val(newPos.lng);
          // console.log("dragged marker newLat:",  newPos.lat); // value is also in newPos.lat/lng
          // console.log("dragged marker newLng:", newPos.lng );
          // debugger;
        });
      
   } else { bottombar.hide();sidebar.hide(); }

};

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