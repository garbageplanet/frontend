// some basic leaflet functions
        
var map = L.map('map').setView([51.505, -0.09], 13);
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
}
tileLayers['Outdoors'].addTo(map);
// Add the layer control
L.control.layers(tileLayers).setPosition('topright').addTo(map);