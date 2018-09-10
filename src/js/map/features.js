/* jslint browser: true, white: true, sloppy: true, maxerr: 1000 */
/* global L, $, tools, alerts, api, ui, maps */

/**
  * Loading map features from the backend
  * TODO cache mechanism and backend 304 if data in the response is the same
  */

var features =  ( function () {

    'use strict';

    function _createFeatures (type, data) {

        maps[type + 'LayerGroup'].clearLayers();

        if (!data || typeof response === 'undefined') { return false; }

        switch (type) {

            case 'garbage'  :

                data.forEach(function(f) {

                    var latlng = f.latlng.split(',');
                    var marker = L.marker(L.latLng(latlng[0],latlng[1]),
                    {
                        amount       : f.amount
                      , cleaned      : f.cleaned
                      , cleaned_by   : f.cleaned_by
                      , cleaned_date : f.cleaned_date
                      , confirms     : f.confirms
                      , created_at   : f.created_at
                      , created_by   : f.marked_by
                      , embed        : f.embed
                      , id           : f.id
                      , image_url    : f.image_url
                      , modified_at  : f.updated_at
                      , latlng       : f.latlng
                      , note         : f.note
                      , size         : f.size
                      , tags         : f.tag
                      , types        : f.types.join(', ')
                      , icon         : tools.setMarkerIcon(f.cleaned, null)
                      , todo         : f.cleaned === 1 ? tools.setTodoFullText("1") : tools.setTodoFullText(f.todo)
                      , feature_type : type
                    });
                    // marker.addTo(maps.garbageLayerGroup);
                    maps.garbageLayerGroup.addLayer(marker);
                    // Set the class for the marker color after the icon is loaded on the map
                    $(marker._icon).addClass(tools.setMarkerClassColor(f.amount));
                });
                break;

            case 'cleaning' :
                data.forEach(function (f) {

                    var latlng = f.latlng.split(',');
                    var marker = L.marker(L.latLng(latlng[0], latlng[1]),
                    {
                          attends      : f.attends
                        , created_at   : f.created_at
                        , created_by   : f.created_by
                        , datetime     : f.datetime
                        , id           : f.id
                        , latlng       : f.latlng
                        , modified_at  : f.updated_at
                        , recurrence   : f.recurrence
                        , ext_link     : f.note
                        , icon         : tools.setMarkerIcon(null, f.datetime)
                        , feature_type : type
                    });
                    marker.addTo(maps.cleaningLayerGroup);
                });
                break;

            case 'litter' :
                data.forEach(function(f) {

                    var latlngs = JSON.parse("[" + f.latlngs + "]");
                    var polylineLayer = L.polyline(latlngs,
                    {
                         amount          : f.amount
                       , cleaned         : f.cleaned
                       , cleaned_by      : f.cleaned_by
                       , confirms        : f.confirms
                       , color           : tools.setPolylineColor(f.amount)
                       , created_at      : f.created_at
                       , created_by      : f.marked_by
                       , id              : f.id
                       , image_url       : f.image_url
                       , latlngs         : JSON.stringify(latlngs)
                       , modified_at     : f.updated_at
                       , physical_length : f.physical_length
                       , tags            : f.tag
                       , types           : f.types.join(', ')
                       , shape           : true
                       , feature_type    : type
                       , clickable       : true
                       , weight          : 15
                       , opacity         : 0.5
                       , smoothFactor    : 3
                    });

                    maps.litterLayerGroup.addLayer(polylineLayer);
                });

                break;

            case 'area' :
                data.forEach(function (f) {

                    var latlngs = JSON.parse("[" + f.latlngs + "]");
                    var polygonLayer = new L.Polygon(latlngs,
                    {
                         contact      : f.contact
                       , created_by   : f.created_by
                       , created_at   : f.created_at
                       , curr_players : f.curr_players
                       , id           : f.id
                       , max_players  : f.max_players
                       , note         : f.note
                       , latlngs      : JSON.stringify(latlngs)
                       , tags         : f.tag
                       , title        : f.title
                       , modified_at  : f.updated_at
                       , feature_type : type
                       , shape        : true
                       , color        : '#33cccc'
                       , weight       : 5
                       , opacity      : 0.5
                       , smoothFactor : 3
                     });

                     maps.areaLayerGroup.addLayer(polygonLayer);
                });
                break;
            // TODO Link markers in backend
            // case 'link'     :
            //     return  null;
            //
            //     break;
            // default: ;

        }
    }

    function loadFeature (type) {

      if ( !type ) {

        return;

      }
      // Coherce type into array because external function pass one type of feature at a time as string
      var type = Array.isArray(type) ? type : [type];

      // TODO make this return a Promise.all so we can wait for items to load up on the map if we need to act on them
      // FIXME redraw markers if inside the same bounds and they are exploded from markerGroup else styles aren't applied
      // TODO this needs refactoring of markers
      // FIXME return null if

      var bounds = maps.map.getBounds();
      var inverted_bounds = tools.getInvertedBounds(maps.map);
      var token = localStorage.getItem('token') || tools.token;

      // if ( tools.checkIfInsideRoundedBounds(bounds) ) {
      //     return;
      // }

      type.forEach( function (item) {

          var feature_type = tools.capitalizeFirstLetter(item);

          var params = {
            url: api['read' + feature_type + 'WithinBounds'].url(inverted_bounds),
            method: api['read' + feature_type + 'WithinBounds'].method,
            auth: 'Bearer ' + token
          };

          tools.makeApiCall(params, window.fetch)

          // FIXME parse error and check for 200

          .catch(function(error) {


            // if ( !data or data.length === 0 || typeof data === 'undefined' ) {
            //
            //     let error = new Error ("Received empty data from the server.");
            //
            //     return alerts.showAlert(0,"danger", 3000, error);
            //
            // }

            console.log('Error getting features', error)

          })

          .then(function(response) {

              //console.log(`API data for ${item}`, response);
              console.log('API data: ', response);

              if (!response || typeof response === 'undefined') { return false; }

              _createFeatures(item, response);
          });
      });
    }

    function _bindEvents () {

        // TODO remove all the conditions blocks once we load a larger area
        // TODO don't load everything if geolocation fails

        console.log('Binding map self events.');

        maps.map.on('zoomstart dragend zoomend', function (e) {

            console.log("map move event: ", e);

            var event_type = e.type.trim();
            var new_zoom = e.target.getZoom();
            var zoom_diff = Math.abs(new_zoom - tools.states.currentZoom);
            var length_diff = e.distance;
            var viewport_ratio = window.innerWidth / 3;

            switch ( event_type ) {

                case 'zoomstart':

                    tools.states.currentZoom = e.target.getZoom();
                    break;

                case 'zoomend':

                    // console.log('zoomend event');
                    // console.log("fist zoom: ", tools.states.currentZoom);
                    // console.log("new zoom: ", new_zoom);
                    // console.log("zoom difference: ", zoom_diff);

                    if ( new_zoom >= 2 && zoom_diff >= 2 ) {

                        // features.loadFeature(['link','cleaning','garbage']);

                        features.loadFeature(['cleaning', 'garbage' /*'link'*/]);

                       if ( new_zoom <= 16 ) {

                            features.loadFeature(['litter', 'area']);
                        }

                    } else if ( !zoom_diff ) {
                        // if there's no prior zoom value it means we're loading for the first time
                        features.loadFeature(['cleaning', 'garbage'/*, 'link'*/, 'area', 'litter']);
                    }

                    break;

                case 'dragend':

                    // fetching features if the map is panned by width / 3 is a good compromise for horizontal and vertical dragging
                    if ( length_diff >= viewport_ratio ) {

                        if ( new_zoom >= 2 ) {

                            features.loadFeature(['cleaning', 'garbage' /*'link'*/]);

                            if ( new_zoom >= 8 && new_zoom <= 16 ) {
                                // We don't load large features if we're too close or too far
                                features.loadFeature(['litter', 'area']);
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

    return Object.freeze({
        loadFeature : loadFeature
      , init        : init
    });
}());
