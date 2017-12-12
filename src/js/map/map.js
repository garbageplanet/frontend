/* jslint browser: true, white: true, sloppy: true, maxerr: 1000 */
/* global L, alerts */

/**
  * Extend L.Control.Locate to accomodate the url regex
  *  @namespace L.Control.Locate - regex to check if the address bar of the browser contains coordinates, needed when we
                                   gelocate at startup so we don't override geographic locations in inbound urls
  * @see http://stackoverflow.com/a/18690202/2842348
  * @author Iain Fraser
  * @license MIT stackoverflow
  */
L.Control.CustomLocate = L.Control.Locate.extend({
   latlnginURL: function () {
     return window.location.href.match(/^([-+]?\d{1,2}[.]\d+)\s*\/\s*([-+]?\d{1,3}[.]\d+)$/);
   },
   sharedURL: function () {
     return window.location.href.match(/shared/);
   },

});

/**
  * Set the map and plugins
  */

var maps = ( function () {

    'use strict';

    var _tiles = {

        // TODO simplify this
        "Mapbox Outdoors":
            L.tileLayer('https://api.mapbox.com/v4/adriennn.9da931dd/{z}/{x}/{y}.png?access_token=@@mapboxtoken',
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
                }),
        "Stamen Toner":
            L.tileLayer('http://{s}.tile.stamen.com/toner-hybrid/{z}/{x}/{y}.png',
                {
                    maxZoom: 20,
                    minZoom: 2,
                    reuseTiles: true,
                    updateWhenZooming: true,
                    attribution: 'Map design &copy; <a href="http://maps.stamen.com/toner">Stamen</a>',
                })
        },
        map = L.map('map', { zoomControl        : false,
                             attributionControl : true,
                             zoomSnap           : 0,
                             zoomDelta          : 2,
                             wheelPxPerZoomLevel: 40,
                             wheelDebounceTime  : 200
                           }),
        garbageLayerGroup = L.markerClusterGroup({
            spiderfyOnMaxZoom: false,
            maxClusterRadius: 50,
            disableClusteringAtZoom: 15,
            showCoverageOnHover: false,
            singleMarkerMode: true
        }),
        cleaningLayerGroup = L.markerClusterGroup({
            spiderfyOnMaxZoom: false,
            maxClusterRadius: 80,
            disableClusteringAtZoom: 15,
            showCoverageOnHover: false,
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
        }),
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
        }),
        litterLayerGroup = L.featureGroup(),
        areaLayerGroup = L.featureGroup(),
        unsavedMarkersLayerGroup = L.featureGroup(),
        allLayers = L.layerGroup([
                          garbageLayerGroup
                        , areaLayerGroup
                        , cleaningLayerGroup
                        , litterLayerGroup
                        , linkLayerGroup
                    ]),
        // hash = L.hash(map, {baseURI: '', query: true}),
        _overlayGroups = {
              "Garbage markers"           : garbageLayerGroup
            , "Cleaning events"           : cleaningLayerGroup
            , "Littered coasts and roads" : litterLayerGroup
            , "Linked markers"            : linkLayerGroup
            , "Tiles and areas"           : areaLayerGroup
        },
        locationcontrol = new L.Control.CustomLocate({
            locateOptions: {
                enableHighAccuracy: true,
                maxZoom: 19
            },
            position: 'topleft',
            icon: 'fa fa-location-arrow',
            onLocationError: function (err, control) {

                console.log('value of this from location error: ', this);

                alerts.showAlert(16, "warning", 2000);

                console.log('Location error: ', err.message);
                console.log('There are coordinates in the url: ', maps.locationcontrol.latlnginURL() !== null);

                // If we are currently trying to locate the user and it fails and the maps is already set, just stop the control
                if ( maps.locationcontrol.latlnginURL() || maps.locationcontrol.sharedURL() ) {
                    control.stop();
                }
                // Show the world without borders if geolocalization fails
                else if ( !maps.locationcontrol.latlnginURL() || !maps.locationcontrol.sharedURL()  ) {
                    control.stop();
                    maps.map.setView([0, 0], 2);
                }
            }
        }),
        scalecontrol = L.control.scale({metric: true, imperial: false}),
        layerscontrol = L.control.layers(_tiles, _overlayGroups, {
            // the custom icon 'linkText' is set in Leaflet 1.0.3 source code in L.Control.Layers.__initLayout()
            position: 'topleft',
            linkText: '<span class="fa fa-fw fa-globe"></span>'
        }),
        geocodercontrol = L.Control.openCageSearch({key: '@@opencagetoken', limit: 5, position: 'topleft'}),
        glomelogincontrol = L.control.login(),
        menucontrol = L.control.menu(),
        icons = ( function icons () {

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

                  genericMarker      = mapmarker({className: 'map-marker marker-color-gray marker-generic'})
                , garbageMarker      = mapmarker({className: 'map-marker marker-garbage'})
                , cleaningMarker     = mapmarker({className: 'map-marker marker-cleaning marker-color-blue'})
                , pastCleaningMarker = mapmarker({className: 'map-marker marker-cleaning-past marker-color-blue'})
                , dieoffMarker       = mapmarker({className: 'map-marker marker-dieoff'})
                , sewageMarker       = mapmarker({className: 'map-marker marker-sewage'})
                , floatingMarker     = mapmarker({className: 'map-marker marker-floating'})
                , linkMarker         = mapmarker({className: 'map-marker marker-link'})
                , cleanedMarker      = mapmarker({className: 'map-marker marker-cleaned'});

            return {   genericMarker      : genericMarker
                     , garbageMarker      : garbageMarker
                     , cleaningMarker     : cleaningMarker
                     , dieoffMarker       : dieoffMarker
                     , sewageMarker       : sewageMarker
                     , floatingMarker     : floatingMarker
                     , linkMarker         : linkMarker
                     , cleanedMarker      : cleanedMarker
                     , pastCleaningMarker : pastCleaningMarker
                    };
        }()),
        getTrashBins = function getTrashBins () {
            // load trashbins icons on the map
            var tbq = '(node["amenity"="waste_basket"]({{bbox}});node["amenity"="recycling"]({{bbox}});node["amenity"="waste_disposal"]({{bbox}}););out;';

            var osmTrashbinLayer = new L.OverPassLayer({
                query: tbq
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
            if ( !window.isMobile ) {
                var zoomcontrol = L.control.zoom({position: 'topleft'});
                    zoomcontrol.options.zoomInText  = '<span class="fa fa-fw fa-search-plus"></span>';
                    zoomcontrol.options.zoomOutText = '<span class="fa fa-fw fa-search-minus"></span>';
                    zoomcontrol.addTo(maps.map);
            }

            locationcontrol.addTo(maps.map);
               scalecontrol.addTo(maps.map);
              layerscontrol.addTo(maps.map);
            geocodercontrol.addTo(maps.map);

            // Add feature layers
            maps.garbageLayerGroup.addTo(maps.map);
            maps.areaLayerGroup.addTo(maps.map);
            maps.litterLayerGroup.addTo(maps.map);
            maps.linkLayerGroup.addTo(maps.map);
            maps.cleaningLayerGroup.addTo(maps.map);
            maps.unsavedMarkersLayerGroup.addTo(maps.map);

            // Add a glome anonymous login button on mobile and small screens
            if ( window.isMobile ) {

                if ( !maps.map.glomelogincontrol ) {
                    maps.glomelogincontrol.addTo(maps.map);
                }

                menucontrol.addTo(maps.map);
            }

            if ( !maps.locationcontrol.latlnginURL() || !maps.locationcontrol.sharedURL()  ) {
                console.log('starting to geolocate');
                maps.locationcontrol.start();
            }

          _tiles['Mapbox Outdoors'].on('load', function () {

                // Remove the loader div once the tiles have loaded
                var loader = document.getElementById('loader');

                if ( loader ) {
                    document.body.removeChild(loader);
                    loader = null;
                }
             });
        };

    return {   init                     : init
             , map                      : map
             // , hash                     : hash
             , getTrashBins             : getTrashBins
             , locationcontrol          : locationcontrol
             , glomelogincontrol        : glomelogincontrol
             , layerscontrol            : layerscontrol
             , geocodercontrol          : geocodercontrol
             , garbageLayerGroup        : garbageLayerGroup
             , areaLayerGroup           : areaLayerGroup
             , litterLayerGroup         : litterLayerGroup
             , linkLayerGroup           : linkLayerGroup
             , cleaningLayerGroup       : cleaningLayerGroup
             , unsavedMarkersLayerGroup : unsavedMarkersLayerGroup
             , allLayers                : allLayers
             , icons                    : icons
            };
}());
