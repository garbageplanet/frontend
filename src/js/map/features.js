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

        switch (type) {

            case 'garbage'  :

                Object.keys(data).forEach(function(key) {

                    var latlng = data[key].latlng.split(',');
                    var marker = L.marker(L.latLng(latlng[0],latlng[1]),
                    {
                        amount       : data[key].amount
                      , cleaned      : data[key].cleaned
                      , cleaned_by   : data[key].cleaned_by
                      , cleaned_date : data[key].cleaned_date
                      , confirms     : data[key].confirms
                      , created_at   : data[key].created_at
                      , created_by   : data[key].marked_by
                      , embed        : data[key].embed
                      , id           : data[key].id
                      , image_url    : data[key].image_url
                      , modified_at  : data[key].updated_at
                      , latlng       : data[key].latlng
                      , note         : data[key].note
                      , size         : data[key].size
                      , tags         : data[key].tag
                      , types        : data[key].types.join(', ')
                      , icon         : tools.setMarkerIcon(data[key].cleaned, null)
                      , todo         : data[key].cleaned === 1 ? tools.setTodoFullText("1") : tools.setTodoFullText(data[key].todo)
                      , feature_type : 'garbage'
                    });
                    // marker.addTo(maps.garbageLayerGroup);
                    maps.garbageLayerGroup.addLayer(marker);
                    // Set the class for the marker color after the icon is loaded on the map
                    $(marker._icon).addClass(tools.setMarkerClassColor(data[key].amount));
                });
                break;

            case 'cleaning' :
                Object.keys(data).forEach(function (key) {

                    var latlng = data[key].latlng.split(',');
                    var marker = L.marker(L.latLng(latlng[0], latlng[1]),
                    {
                          attends      : data[key].attends
                        , created_at   : data[key].created_at
                        , created_by   : data[key].created_by
                        , datetime     : data[key].datetime
                        , id           : data[key].id
                        , latlng       : data[key].latlng
                        , modified_at  : data[key].updated_at
                        , recurrence   : data[key].recurrence
                        , ext_link     : data[key].note
                        , icon         : tools.setMarkerIcon(null, data[key].datetime)
                        , feature_type : 'cleaning'
                    });
                    marker.addTo(maps.cleaningLayerGroup);
                });
                break;

            case 'litter' :
                Object.keys(data).forEach(function(key) {

                    var latlngs = JSON.parse("[" + data[key].latlngs + "]");
                    var polylineLayer = L.polyline(latlngs,
                    {
                         amount          : data[key].amount
                       , cleaned         : data[key].cleaned
                       , cleaned_by      : data[key].cleaned_by
                       , confirms        : data[key].confirms
                       , color           : tools.setPolylineColor(data[key].amount)
                       , created_at      : data[key].created_at
                       , created_by      : data[key].marked_by
                       , id              : data[key].id
                       , image_url       : data[key].image_url
                       , latlngs         : JSON.stringify(latlngs)
                       , modified_at     : data[key].updated_at
                       , physical_length : data[key].physical_length
                       , tags            : data[key].tag
                       , types           : data[key].types.join(', ')
                       , shape           : true
                       , feature_type    : 'litter'
                       , clickable       : true
                       , weight          : 15
                       , opacity         : 0.5
                       , smoothFactor    : 3
                    });

                    maps.litterLayerGroup.addLayer(polylineLayer);
                });

                break;

            case 'area' :
                Object.keys(data).forEach(function (key) {

                    var latlngs = JSON.parse("[" + data[key].latlngs + "]");
                    var polygonLayer = new L.Polygon(latlngs,
                    {
                         contact      : data[key].contact
                       , created_by   : data[key].created_by
                       , created_at   : data[key].created_at
                       , curr_players : data[key].curr_players
                       , id           : data[key].id
                       , max_players  : data[key].max_players
                       , note         : data[key].note
                       , latlngs      : JSON.stringify(latlngs)
                       , tags         : data[key].tag
                       , title        : data[key].title
                       , modified_at  : data[key].updated_at
                       , feature_type : 'area'
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

          .catch(error => { console.log('Error getting features', error) })

          .then(response => {

              console.log(`API data for ${item}`, response);
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

    return {
        loadFeature : loadFeature
      , init        : init
    }
}());
