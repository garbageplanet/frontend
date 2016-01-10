//Map scripts
// Set the map
var map = L.map('map', { zoomControl: false, attributionControl: false });

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

/*map.on('movestart', function(e) {
    console.log('log movestart');
    garbageLayer.clearLayers();
});*/

// Sidebar creation and placement
var sidebar = L.control.sidebar('sidebar', {
        position: 'right',
        closebutton: 'true',
        });
map.addControl(sidebar);

// Fire hide event so that onMapClick can pick on the status of the sidebar
$(document).ready(function() {
sidebar.hide();
console.log('sidebar is hidden');
});
                 
// Bottombar creation and placement
var bottombar = L.control.bar('bottombar', {
        position: 'bottom',
        visible: false,
        autoPan: true,
        });
map.addControl(bottombar);

// Make the layer groups and add them to the map
garbageLayer = new L.LayerGroup();
areaLayer = new L.LayerGroup();
coastLayer = new L.LayerGroup();
eventLayer = new L.LayerGroup();
osmTrashbinLayer = new L.LayerGroup();

map.addLayer(garbageLayer, coastLayer, eventLayer, osmTrashbinLayer, areaLayer);

var overlayGroups = {
"Garbage markers": garbageLayer,
"Cleaning events": eventLayer,
"Dirty coastal areas": coastLayer,
"Nearby trashbins": osmTrashbinLayer,
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

// Create a generic marker locally before it is saved
/*function createLocalMarker() {
        marker = L.marker(e.latlng, {
                icon:genericMarker,
                draggable: true
                }).on('click', onLocalMarkerClick);
        map.addLayer(marker).panTo(e.latlng);
        $('.sidebar-content').hide();
        $('#sidebar').scrollTop = 0;
        sidebar.show($("#create-marker-dialog").show());
};*/

function onMapClick(e) {
  
    sidebar.once('hidden', createLocalMarker);
  
    
    function createLocalMarker() {
        marker = L.marker(e.latlng, {
                icon:genericMarker,
                draggable: true
                }).on('click', onLocalMarkerClick);
        map.addLayer(marker).panTo(e.latlng);
        $('.sidebar-content').hide();
        $('#sidebar').scrollTop = 0;
        sidebar.show($("#create-marker-dialog").show());
    };
    
    
  
  
  
  sidebar.on('shown', sidebar.hide() );
  bottombar.on('shown', bottombar.hide() );
  

};

// Disable creating markers at low zooms
map.on('zoomend', function(e){
    if(e.target.getZoom() < 15){
        map.off('click', onMapClick);
    } else {
        map.on('click', onMapClick);
    }
}); 

// Hide all the siblings of the clicked link in the sidebar when linking internally and reset sidebar scroll
$('.sidebar-link').click(function(e) {
    e.preventDefault();
    $(this.hash).fadeIn().siblings().hide();
    $('#sidebar').scrollTop = 0;
});

// Go back to the marker creation menu link
$('.menu-backlink').click(function(e) {
    $('.panel-collapse').collapse('hide');
    $('#sidebar').scrollTop = 0;
    $(this.hash).fadeIn().siblings().hide();
    e.preventDefault();
});

// Change the marker-color class as well upon form completion
$(".btn-save-garbage").on('click', function (){
$(marker._icon).removeClass('marker-generic').addClass('marker-garbage');

});

// Set the marker color from the form
$('#select-trash-amount').change(function() {
    // Remove any color class that has previsouly been set
    $(marker._icon).removeClass('marker-color-gray');
    // Get the color value from the select options
    var selectedValue = parseInt(jQuery(this).val());
        switch(selectedValue){
            case 0:
            $(marker._icon).addClass('marker-color-green');
                break;
            case 1:
            $(marker._icon).addClass('marker-color-blue');
                break;
            case 2:
            $(marker._icon).addClass('marker-color-yellow');
                break;
            case 3:
            $(marker._icon).addClass('marker-color-orange');
                break;
            case 4:
            $(marker._icon).addClass('marker-color-red');
                break;
        }
});

$(".btn-save-cleaning").on('click', function (){
     $(marker._icon).removeClass('marker-color-gray marker-generic').addClass('marker-cleaning marker-color-coral');
});

// Set the marker color from the form
$('#select-pollution-amount').change(function() {
    // Remove any color class that has previsouly been set
    $(marker._icon).removeClass('marker-color-gray');
    // Get the color value from the select options
    var selectedValue = parseInt(jQuery(this).val());
        switch(selectedValue){
            case 0:
            $(marker._icon).addClass('marker-color-green').redraw();
                break;
            case 1:
            $(marker._icon).addClass('marker-color-blue').redraw();
                break;
            case 2:
            $(marker._icon).addClass('marker-color-yellow').redraw();
                break;
            case 3:
            $(marker._icon).addClass('marker-color-orange').redraw();
                break;
            case 4:
            $(marker._icon).addClass('marker-color-red').redraw();
                break;
        }
});

$(".btn-save-site").on('click', function (){
    $(marker._icon).removeClass('marker-generic').addClass('marker-site marker-color-purple');
});

// Sidbar reset functions
// Delete marker if button is clicked
$(".btn-delete-marker").on('click', function (){
     map.removeLayer(marker);
});

// Close sidebar and reset forms if cancel button clicked
$(".btn-cancel").on('click', function (){
    sidebar.hide();
});

// Empty the sidebar on hide, reset accordion and reset scroll
sidebar.on('hide', function () {
        $('.panel-collapse').collapse('hide');
        $('.sidebar-content').hide();
        $('#sidebar').scrollTop = 0;
        $('form').each(function() { this.reset() });
        $("textarea").val('');
        $("input").val('');
        // $('#coastal-trash-amount').selectpicker('render');
        $('.selectpicker').selectpicker('render');
        // $('#user-login-dialog').find('.with-errors').hide();
        // $('#glome-dialog').find('.with-errors').hide();
    });

// Default marker creation
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

// TODO Edit markers from a link in #marker-info or #event-info
    $(".edit-marker").click(function(event) {
    event.preventDefault();
        $('.sidebar-content').hide();
        $('#sidebar').scrollTop =0;
        sidebar.show($("#create-cleaning-dialog").fadeIn('slow'));
                $('#create-cleaning h2').text("Edit this cleaning event");
                $('#set-current-location span:nth-child(1)').text('editing');

    });

//Remove unsaved markers with class 'marker-generic' after a timeout
setTimeout(function() {
  $('div.marker-generic').remove();
}, 200000);

// Activate Summarizing Tile part
$('#l-active-tile-btn').click(function () {
    var r = 0.01
    var lat = Number($('#activate-tile-dialog').find('.tile-center-lat').text());
    var lng = Number($('#activate-tile-dialog').find('.tile-center-lng').text());
    var bottom_left = [lat-r, lng-r];
    var top_right = [lat+r, lng+r];

    console.log('lat', lat);
    console.log('lng', lng);
    console.log('bottom_left', bottom_left);
    console.log('top_right', top_right);

    var rectangleBounds = [bottom_left, top_right];
    var rectangle = L.rectangle(rectangleBounds);
    rectangle.addTo(map);
    rectangle.editing.enable();
    window.rectangle = rectangle;
    rectangle.on('edit', function(data) {
        window.ne_lat = data.target._latlngs[1].lat;
        window.ne_lng = data.target._latlngs[1].lng;
        window.sw_lat = data.target._latlngs[3].lat;
        window.sw_lng = data.target._latlngs[3].lng;
        $('#activate-tile-dialog').find('.tile-ne-lat').text(ne_lat);
        $('#activate-tile-dialog').find('.tile-ne-lng').text(ne_lng);
        $('#activate-tile-dialog').find('.tile-sw-lat').text(sw_lat);
        $('#activate-tile-dialog').find('.tile-sw-lng').text(sw_lng);
    });
});