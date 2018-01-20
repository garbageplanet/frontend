/* jslint browser: true, white: true, sloppy: true, maxerr: 1000 */
/* global L, $, tools, alerts, api, ui, maps */

/**
  * Loading map features from the backend
  */

var features =  ( function () {

    'use strict';

    var token = localStorage.getItem('token') || tools.token;

    function loadFeature (type) {

        // TODO allow type to be an array of types so we don't need 'all'
        // type.forEach( function (item) {
        //     _load(item);
        // });

        // Only run this function if we're outside originally loaded map bounds
        var bounds = maps.map.getBounds();

        // FIXME
        if ( tools.checkIfInsideRoundedBounds(bounds) ) {
            return;
        }

        var inverted_bounds = tools.getInvertedBounds(maps.map);
        var alltypes        = ['garbage','cleaning','litter','area','opengraph'];
        var type            = type.trim();

        switch (type) {

            case 'garbage'  : _loadGarbages(inverted_bounds); break;
            case 'cleaning' : _loadCleanings(inverted_bounds); break;
            case 'litter'   : _loadLitters(inverted_bounds); break;
            case 'area'     : _loadAreas(inverted_bounds); break;
            case 'link'     : _loadLinks(inverted_bounds); break;
            case 'all'      :

                  alltypes.forEach( function (item) {
                      console.log('Loading all features, item value from features.loadFeature(): ', item);
                      loadFeature(item);
                  });

                break;
        }
    }

    function _loadGarbages (bounds) {

        var fetch_garbage = $.ajax({
            type       : api.readTrashWithinBounds.method,
            url        : api.readTrashWithinBounds.url(bounds),
            ifModified : true,
            headers    : {"Authorization": 'Bearer ' + token},
            success    : function (data) {console.log('Success getting garbage marker data', data);},
            error      : function (data) {console.log('Error getting garbage marker data', data);}
        });

        fetch_garbage.done( function (data) {

            if (!data || data.length < 1) {

                return;

            } else {

                maps.garbageLayerGroup.clearLayers();

                $(data).each(function (i, o) {

                    console.log('value of ob.cleaned: ', o.cleaned);

                    // Need to parse the string from the db because LatLngs are now stored as single key:value pair
                    var latlng = o.latlng.toString().replace(/,/g , "").split(' ');
                    var marker = L.marker(L.latLng(latlng[0],latlng[1]),
                        {
                            amount:       o.amount
                          , cleaned:      o.cleaned
                          , cleaned_by:   o.cleaned_by
                          , cleaned_date: o.cleaned_date
                          , confirms:     o.confirms
                          , created_at:   o.created_at
                          , created_by:   o.marked_by
                          , embed:        o.embed
                          , id:           o.id
                          , image_url:    o.image_url
                          , modified_at:  o.updated_at
                          , latlng:       o.latlng
                          , note:         o.note
                          , size:         o.size
                          , tags:         o.tag
                          , types:        o.types.join(', ')
                          , icon: tools.setMarkerIcon(o.cleaned, null)
                          , todo: (o.cleaned === 1) ? tools.setTodoFullText("1") : tools.setTodoFullText(o.todo)
                          , feature_type: 'garbage'
                        });

                    // marker.addTo(maps.garbageLayerGroup);
                    maps.garbageLayerGroup.addLayer(marker);

                    // Set the class for the marker color after the icon is loaded on the map
                    $(marker._icon).addClass(tools.setMarkerClassColor(o.amount));
                });
            }
        });
    }

    function _loadCleanings (bounds) {

        var fetch_cleaning = $.ajax({
            type       : api.readCleaningWithinBounds.method,
            url        : api.readCleaningWithinBounds.url(bounds),
            ifModified : true,
            headers    : {"Authorization": 'Bearer ' + token},
            success    : function (data) {console.log('Success getting cleaning event (marker) data', data);},
            error      : function (data) {console.log('Error getting cleaning event (marker) data', data);}
        });

        fetch_cleaning.done(function (data) {

            if (!data || data.length < 1) { return; }

            maps.cleaningLayerGroup.clearLayers();

                $(data).each(function (i, o) {

                    var latlng = o.latlng.toString().replace(/,/g , "").split(' ');
                    var marker = L.marker(L.latLng(latlng[0], latlng[1]),
                        {
                              attends:     o.attends
                            , created_at:  o.created_at
                            , created_by:  o.created_by
                            , datetime:    o.datetime
                            , id:          o.id
                            , latlng:      o.latlng
                            , modified_at: o.updated_at
                            , recurrence:  o.recurrence
                            , ext_link:    o.note
                            , icon:        tools.setMarkerIcon(null, o.datetime)
                            , feature_type: 'cleaning'
                        });

                    marker.addTo(maps.cleaningLayerGroup);
                });
        });
        fetch_cleaning.fail(function(data){
            alerts.showAlert(10, 'warning', 1500);
        });
    }

    function _loadAreas (bounds) {

        var fetch_area = $.ajax({
            type       : api.readAreaWithinBounds.method,
            url        : api.readAreaWithinBounds.url(bounds),
            ifModified : true,
            headers    : {"Authorization": 'Bearer ' + token},
            success    : function () {console.log('Success getting area data');},
            error      : function () {console.log('Error getting area data');}
        });

        fetch_area.done(function (data) {

            if (!data || data.length < 1) { return; }

            maps.areaLayerGroup.clearLayers();

            $(data).each(function (i, o) {

                var latlngs = JSON.parse("[" + o.latlngs + "]");
                var polygonLayer = new L.Polygon(latlngs,
                    {
                        contact:      o.contact
                      , created_by:   o.created_by
                      , created_at:   o.created_at
                      , curr_players: o.curr_players
                      , id:           o.id
                      , max_players:  o.max_players
                      , note:         o.note
                      , tags:         o.tag
                      , title:        o.title
                      , modified_at:  o.updated_at
                      , feature_type: 'area'
                      , shape:        true
                      , color:        '#33cccc'
                      , weight:       5
                      , opacity:      0.5
                      , smoothFactor: 3
                  });

                  maps.areaLayerGroup.addLayer(polygonLayer);
                }
            );
        });
        fetch_area.fail( function () {
            alerts.showAlert(10, 'warning', 1500);
        });
    }

    function _loadLitters (bounds) {

        var fetch_litter = $.ajax({
            type       : api.readLitterWithinBounds.method,
            url        : api.readLitterWithinBounds.url(bounds),
            ifModified : true,
            headers    : {"Authorization": 'Bearer ' + token},
            success    : function (data) {console.log('Success getting litter (polyline) data', data);},
            error      : function (data) {console.log('Error getting litter (polyline) data', data);}
        });

        fetch_litter.done(function(data) {

            if (!data || data.length < 1) { return; }

            maps.litterLayerGroup.clearLayers();

            $(data).each(function(i, o) {

                var latlngs = JSON.parse("[" + o.latlngs + "]");
                var polylineLayer = L.polyline(latlngs,
                {
                      amount: o.amount
                    , cleaned: o.cleaned
                    , cleaned_by: o.cleaned_by
                    , confirms: o.confirms
                    , color: tools.setPolylineColor(o.amount)
                    , created_at: o.created_at
                    , created_by: o.marked_by
                    , id: o.id
                    , image_url: o.image_url
                    , modified_at: o.updated_at
                    , physical_length: o.physical_length
                    , tags: o.tag
                    , types: o.types.join(', ')
                    , shape: true
                    , feature_type: 'litter'
                    , clickable: true
                    , weight: 15
                    , opacity: 0.5
                    , smoothFactor: 3
                });

                maps.litterLayerGroup.addLayer(polylineLayer);
            });
        });
        fetch_litter.fail(function() {
          alerts.showAlert(10, 'warning', 1500);
        });
    }

    function _loadLinks(bounds) {
        // TODO
        return;
    }

    function _bindEvents () {

        // TODO remove all the conditions blocks once we load a larger area
        // TODO don't load everything if geolocation fails

        console.log('Binding map self events.');

        maps.map.on('zoomstart dragend zoomend', function (e) {

            //var bounds = maps.map.getBounds()

            console.log("map move event: ", e);

            var event_type = e.type.trim();
            var new_zoom = e.target.getZoom();
            var zoom_diff = Math.abs(new_zoom - tools.states.currentZoom);
            var length_diff = e.distance;

            // fetching features if the map is panned by width / 3 is a good compromise for horizontal and vertical dragging
            var viewport_ratio = window.innerWidth / 3;

            switch ( event_type ) {

                case 'zoomstart':

                    tools.states.currentZoom = e.target.getZoom();
                    break;

                case 'zoomend':

                    console.log('zoomend event');
                    console.log("fist zoom: ", tools.states.currentZoom);
                    console.log("new zoom: ", new_zoom);
                    console.log("zoom difference: ", zoom_diff);

                    if ( new_zoom >= 2 && zoom_diff >= 3 ) {

                        // features.loadFeature(['link','cleaning','garbage']);

                        features.loadFeature('cleaning');
                        features.loadFeature('garbage');
                        features.loadFeature('link');

                       if ( new_zoom <= 16 ) {

                            features.loadFeature('litter');
                            features.loadFeature('area');
                        }

                    } else if ( !zoom_diff ) {
                        // if there's no prior zoom value it means we're loading for the first time
                        features.loadFeature('all');
                    }

                    break;

                case 'dragend':

                    if ( length_diff >= viewport_ratio ) {

                        if ( new_zoom >= 2 ) {

                            features.loadFeature('cleaning');
                            features.loadFeature('garbage');
                            features.loadFeature('link');

                            if ( new_zoom >= 8 && new_zoom <= 16 ) {
                                // We don't load large features if we're too close or too far
                                features.loadFeature('litter');
                                features.loadFeature('area');
                            }
                        }
                    }
                    break;
            }
        });
    }

    function init () {

      maps.map.once('ready', _bindEvents());

    }

    return {
        loadFeature : loadFeature
      , init        : init
    }
}());
