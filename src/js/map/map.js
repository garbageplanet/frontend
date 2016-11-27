/*jslint browser: true, white: true, sloppy: true, maxerr: 1000*/
// Set the map

var maps = (function (){
    
    var baselayer = {
    
        "Mapbox Outdoors": 
            L.tileLayer('https://api.tiles.mapbox.com/v4/adriennn.9da931dd/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYWRyaWVubm4iLCJhIjoiNWQ5ZTEwYzE0MTY5ZjcxYjIyNmExZDA0MGE2MzI2YWEifQ.WGCZQzbVhF87_Z_Yo1aMIQ',
                { 
                    maxZoom: 18,
                    reuseTiles: true,
                    updateWhenZooming: true,
                    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>, Imagery &copy; <a href="http://mapbox.com">Mapbox</a>',
                }),

        "Mapbox Satellite Street": 
            L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYWRyaWVubm4iLCJhIjoiNWQ5ZTEwYzE0MTY5ZjcxYjIyNmExZDA0MGE2MzI2YWEifQ.WGCZQzbVhF87_Z_Yo1aMIQ',
                {
                    maxZoom: 18,
                    reuseTiles: true,
                    updateWhenZooming: false,
                    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>, Imagery &copy; <a href="http://mapbox.com">Mapbox</a>',
                }),
        "Mapbox Dark": 
            L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYWRyaWVubm4iLCJhIjoiNWQ5ZTEwYzE0MTY5ZjcxYjIyNmExZDA0MGE2MzI2YWEifQ.WGCZQzbVhF87_Z_Yo1aMIQ',
                {
                    maxZoom: 18,
                    reuseTiles: true,
                    updateWhenZooming: true,
                    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>, Imagery &copy; <a href="http://mapbox.com">Mapbox</a>',
                })
        },
        map = L.map('map', {zoomControl: false, attributionControl: true}),
        hash = L.hash(map),
        garbageLayerGroup = L.markerClusterGroup({
            spiderfyOnMaxZoom: false,
            maxClusterRadius: 50,
            disableClusteringAtZoom: 15,
            showCoverageOnHover: false,
            singleMarkerMode: true,
        }).addTo(map),
        cleaningLayerGroup = L.markerClusterGroup({
            spiderfyOnMaxZoom: false,
            maxClusterRadius: 80,
            disableClusteringAtZoom: 15,
            showCoverageOnHover: false,
            // FIXME singleMarkerMode doesn't work with iConCreateFunction enabled
            singleMarkerMode: true,
            iconCreateFunction:  function (cluster) {
                
                var childCountText = cluster.getChildCount();

                return L.divIcon({
                    html:   '<div><span class="leaflet-marker-cluster-count-cleaning">' + childCountText + 
                            '</span><i class="leaflet-marker-cluster-icon-cleaning"></i></div>', 
                    className: 'leaflet-marker-cluster leaflet-marker-cluster-cleaning',
                    iconSize: [40,40]
                });
            }
        }).addTo(map),
        litterLayerGroup = L.featureGroup().addTo(map),
        areaLayerGroup = L.featureGroup().addTo(map),
        allLayers = L.layerGroup([
                        garbageLayerGroup,
                        areaLayerGroup,
                        cleaningLayerGroup,
                        litterLayerGroup
                    ]),
        overlayGroups = {
            "Garbage markers": garbageLayerGroup,
            "Cleaning events": cleaningLayerGroup,
            "Littered coasts and roads": litterLayerGroup,
            "Tiles and areas": areaLayerGroup
        },
        zoomcontrol = L.control.zoom({position: 'topleft'}),
        locationcontrol = L.control.locate({position: 'topleft'}),
        scalecontrol = L.control.scale({metric: true, imperial: false}),
        layerscontrol = L.control.layers(baselayer, overlayGroups, {position: 'topleft'}),
        geocodercontrol = L.Control.openCageSearch({key: '2bb5bf0d3b9300eacceb225f3cf9cd7d', limit: 5, position: 'topleft'}),
        glomelogincontrol = L.control.login(),
        activate = function() {
        
            baselayer['Mapbox Outdoors'].addTo(maps.map);
            //Disable doubleclick to zoom as it might interfer with other map functions
            maps.map.doubleClickZoom.disable();
            // Add zoom controls if not mobile / small screen
            zoomcontrol.addTo(maps.map);
            locationcontrol.addTo(maps.map);
            scalecontrol.addTo(maps.map);
            layerscontrol.addTo(maps.map);
            geocodercontrol.addTo(maps.map);


            // Add a glome anonymous login button on mobile and small screens
            if (window.innerWidth < 768) {
                if (!maps.map.glomelogincontrol) {
                    maps.glomelogincontrol.addTo(map);
                }
            }
        
            // Set an icon on the layer select button
            // TODO modify this in lealfet code once moved to 1.0
            $('.leaflet-control-layers-toggle').append("<span class='fa fa-2x fa-globe'></span>");
            
            // FIXME, this doesnt work either
            $('.leaflet-control-ocd-search-form input').on('submit', function (e) {
                L.DomEvent.stop;
                L.DomEvent._fakeStop;
                e.stopImmediatePropagation();
                e.stopPropagation();
                e.preventDefault();
            });

        },
        icons = (function (){

            var mapMarker = L.DivIcon.extend({
                options: {
                    iconSize: [30, 30],
                    className: 'map-marker',
                    html: '<i class="fa fa-fw"></i>'
                }
            }),

            mapmarker = function (options) {
                return new mapMarker(options);
            },

            genericMarker  = mapmarker({className: 'map-marker marker-color-gray marker-generic'}),
            garbageMarker  = mapmarker({className: 'map-marker marker-garbage'}),
            cleaningMarker = mapmarker({className: 'map-marker marker-cleaning'}),
            dieoffMarker   = mapmarker({className: 'map-marker marker-dieoff'}),
            sewageMarker   = mapmarker({className: 'map-marker marker-sewage'}),
            floatingMarker = mapmarker({className: 'map-marker marker-floating'});

            return {
                genericMarker : genericMarker,
                garbageMarker : garbageMarker,
                cleaningMarker : cleaningMarker,
                dieoffMarker : dieoffMarker,
                sewageMarker : sewageMarker,
                floatingMarker : floatingMarker,
            }
        })(),
        localTrashBins = function() {
            maps.osmTrashbinLayer = new L.OverPassLayer({
                query: '(node["amenity"="waste_basket"]({{bbox}});node["amenity"="recycling"]({{bbox}});node["amenity"="waste_disposal"]({{bbox}}););out;'
            });
            maps.map.addLayer(maps.osmTrashbinLayer);
        };
    
    return {
        init: activate,
        map: map,
        hash: hash,
        trashBins: localTrashBins,
        locationcontrol: locationcontrol,
        glomelogincontrol: glomelogincontrol,
        layerscontrol: layerscontrol,
        geocodercontrol: geocodercontrol,
        zoomcontrol: zoomcontrol,
        garbageLayerGroup: garbageLayerGroup,
        areaLayerGroup: areaLayerGroup,
        litterLayerGroup: litterLayerGroup,
        cleaningLayerGroup: cleaningLayerGroup,
        allLayers: allLayers,
        icons: icons,
    };
    
}());

maps.init();

// Request location update and set location if the address bar doesn't already contain a location at startup
var locating = (function (){
    
    var coordsinhrf = window.location.href.match(/[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)\/*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)/),
    
        checkHref = function () {
        if (!coordsinhrf) {
            maps.locationcontrol.start();
        }   
    },
        onLocationFound = function (e) {
        maps.map.setView(e.latlng, 18);
    },
        onLocationError = function (e) {
      
        alerts.showAlert(16, "warning", 2000);
    
        if (coordsinhrf) {
            maps.locationcontrol.stop();
        }
        // Show the world on localization fail
        else {
            maps.map.setView([0, 0], 2);
            // shortcut but ugly:
            // maps.map.fitWorld();
        }
    
    };
    
    maps.map.on('locationerror', onLocationError);
    maps.map.on('locationfound', onLocationFound);
    
    // Locate upon hoisting the function if the current address bar doesn't have coordinates (e.g. redirect from facebook)
    if (!coordsinhrf) {
        maps.map.locate();
    }
})();