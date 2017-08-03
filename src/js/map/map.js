/*jslint browser: true, white: true, sloppy: true, maxerr: 1000 global maps locating*/
// Set the map
var maps = (function () {
  
    'use strict';
    
    var _tiles = {
    
        // TODO simplify this
        "Mapbox Outdoors": 
            L.tileLayer('https://api.tiles.mapbox.com/v4/adriennn.9da931dd/{z}/{x}/{y}.png?access_token=@@mapboxtoken',
            //L.tileLayer('https://api.tiles.mapbox.com/v4/adriennn.9da931dd/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYWRyaWVubm4iLCJhIjoiNWQ5ZTEwYzE0MTY5ZjcxYjIyNmExZDA0MGE2MzI2YWEifQ.WGCZQzbVhF87_Z_Yo1aMIQ',
                { 
                    maxZoom: 20,
                    minZoom: 2,
                    reuseTiles: true,
                    updateWhenZooming: true,
                    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>, Imagery &copy; <a href="http://mapbox.com">Mapbox</a>',
                }),

        "Mapbox Satellite Street": 
            L.tileLayer('https://api.mapbox.com/styles/v1/adriennn/ciw6qz5tn00002qry747yh58p/tiles/256/{z}/{x}/{y}?access_token=@@mapboxtoken',
                {
                    maxZoom: 20,
                    minZoom: 2,
                    reuseTiles: true,
                    updateWhenZooming: false,
                    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>, Imagery &copy; <a href="http://mapbox.com">Mapbox</a>',
                }),
        "Mapbox Dark": 
            L.tileLayer('https://api.mapbox.com/styles/v1/adriennn/ciw6qtrg900072pqrevagx9hv/tiles/256/{z}/{x}/{y}?access_token=@@mapboxtoken',
                {
                    maxZoom: 20,
                    minZoom: 2,
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
                    html:   '<div><span class="leaflet-marker-cluster-count leaflet-marker-cluster-count-cleaning">' + childCountText + 
                            '</span><i class="leaflet-marker-cluster-icon leaflet-marker-cluster-icon-cleaning"></i></div>', 
                    className: 'leaflet-marker-cluster leaflet-marker-cluster-cleaning',
                    iconSize: [40,40]
                });
            }
        }).addTo(map),
        linkLayerGroup = L.markerClusterGroup({
            spiderfyOnMaxZoom: false,
            maxClusterRadius: 80,
            disableClusteringAtZoom: 15,
            showCoverageOnHover: false,
            singleMarkerMode: true,
            iconCreateFunction:  function (cluster) {
                
                var childCountText = cluster.getChildCount();

                return L.divIcon({
                    html:   '<div><span class="leaflet-marker-cluster-count leaflet-marker-cluster-count-link">' + childCountText + 
                            '</span><i class="leaflet-marker-cluster-icon leaflet-marker-cluster-icon-link"></i></div>', 
                    className: 'leaflet-marker-cluster leaflet-marker-cluster-link',
                    iconSize: [40,40]
                });
            }
        }).addTo(map),
        litterLayerGroup = L.featureGroup().addTo(map),
        areaLayerGroup = L.featureGroup().addTo(map),
        unsavedMarkersLayerGroup = L.featureGroup().addTo(map),
        allLayers = L.layerGroup([
                        garbageLayerGroup,
                        areaLayerGroup,
                        cleaningLayerGroup,
                        litterLayerGroup
                    ]),
        _overlayGroups = {
            "Garbage markers": garbageLayerGroup,
            "Cleaning events": cleaningLayerGroup,
            "Littered coasts and roads": litterLayerGroup,
            "Tiles and areas": areaLayerGroup
        },
        locationcontrol = L.control.locate({position: 'topleft'}),
        scalecontrol = L.control.scale({metric: true, imperial: false}),
        layerscontrol = L.control.layers(_tiles, _overlayGroups, {
        /* The custom icon 'linkText' is set for the tilelayers in Leaflet source code 
         * in L.Control.Layers.__initLayout()
         */
            position: 'topleft',
            linkText: '<span class="fa fa-fw fa-globe"></span>'
        }),
        geocodercontrol = L.Control.openCageSearch({key: '@@opencagetoken', limit: 5, position: 'topleft'}),
        glomelogincontrol = L.control.login(),
        menucontrol = L.control.menu(),
        _locating = function _locating () {

            var onLocationFound = function(e) {
                console.log('location found');
                maps.map.setView(e.latlng, 18);
            };
          
            var onLocationError = function(e) {

                alerts.showAlert(16, "warning", 2000);
                // If we are currently trying to locate the user and it fails and the maps is already set, just stop the control
                if (tools.coordsinhrf) {
                    maps.locationcontrol.stop();
                    return;
                }
                // Show the world without borders if geolocalization fail
                else {
                    maps.locationcontrol.stop();
                    maps.map.setView([0, 0], 2);
                }
            };

            return {
                onLocationError: onLocationError,
                onLocationFound: onLocationFound
            }
        },
        icons = (function icons () {
            
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

                genericMarker      = mapmarker({className: 'map-marker marker-color-gray marker-generic'}),
                garbageMarker      = mapmarker({className: 'map-marker marker-garbage'}),
                cleaningMarker     = mapmarker({className: 'map-marker marker-cleaning marker-color-blue'}),
                pastCleaningMarker = mapmarker({className: 'map-marker marker-cleaning-past marker-color-blue'}),
                dieoffMarker       = mapmarker({className: 'map-marker marker-dieoff'}),
                sewageMarker       = mapmarker({className: 'map-marker marker-sewage'}),
                floatingMarker     = mapmarker({className: 'map-marker marker-floating'}),
                linkMarker         = mapmarker({className: 'map-marker marker-link'}),
                cleanedMarker      = mapmarker({className: 'map-marker marker-cleaned'});

            return {
                genericMarker : genericMarker,
                garbageMarker : garbageMarker,
                cleaningMarker : cleaningMarker,
                dieoffMarker : dieoffMarker,
                sewageMarker : sewageMarker,
                floatingMarker : floatingMarker,
                linkMarker: linkMarker,
                cleanedMarker: cleanedMarker,
                pastCleaningMarker: pastCleaningMarker
            }
        }()),
        getTrashBins = function  getTrashBins () {
            // load trashbins icons on the map
            var query = '(node["amenity"="waste_basket"]({{bbox}});node["amenity"="recycling"]({{bbox}});node["amenity"="waste_disposal"]({{bbox}}););out;';
          
            var osmTrashbinLayer = new L.OverPassLayer({
                query: query
            });
          
            maps.map.addLayer(osmTrashbinLayer);
          
            // Stop the function call on map move
            // FIXME stop the call, don't remove the layer
            /*maps.map.on('movestart', function (e) {
                maps.map.removeLayer(osmTrashbinLayer);
            });*/
        },
        init = function init () {
        
            _tiles['Mapbox Outdoors'].addTo(maps.map);
          
            //Disable doubleclick to zoom as it might interfer with other map functions
            maps.map.doubleClickZoom.disable();

            // Add zoom controls on desktop
            if (!window.isMobile) {
                var zoomcontrol = L.control.zoom({position: 'topleft'});
                zoomcontrol.options.zoomInText = '<span class="fa fa-fw fa-plus"></span>';
                zoomcontrol.options.zoomOutText = '<span class="fa fa-fw fa-minus"></span>';
                zoomcontrol.addTo(maps.map);
            }
          
            locationcontrol.addTo(maps.map);
            scalecontrol.addTo(maps.map);
            layerscontrol.addTo(maps.map);
            geocodercontrol.addTo(maps.map);
          
            // Add a glome anonymous login button on mobile and small screens
            if (window.isMobile) {
                if (!maps.map.glomelogincontrol) {
                    maps.glomelogincontrol.addTo(map);
                }
                menucontrol.addTo(maps.map);
            }
            // Start geolocalization
            maps.map.on('locationerror', _locating.onLocationError);
            maps.map.on('locationfound', _locating.onLocationFound);
          
            if (!tools.coordsinhrf || tools.coordsinhrf == 'undefined') {
                console.log('starting to geolocate');
                maps.locationcontrol.start();
            } 
        };
    
    return { init: init,
             map: map,
             hash: hash,
             getTrashBins: getTrashBins,
             locationcontrol: locationcontrol,
             glomelogincontrol: glomelogincontrol,
             layerscontrol: layerscontrol,
             geocodercontrol: geocodercontrol,
             garbageLayerGroup: garbageLayerGroup,
             areaLayerGroup: areaLayerGroup,
             litterLayerGroup: litterLayerGroup,
             linkLayerGroup: linkLayerGroup,
             cleaningLayerGroup: cleaningLayerGroup,
             unsavedMarkersLayerGroup: unsavedMarkersLayerGroup,
             allLayers: allLayers,
             icons: icons };
}());

maps.init();