/* jslint browser: true, white: true, sloppy: true, maxerr: 1000 */
/* global $, L, maps, jQuery, alerts */

/**
  * @namespace jQuery.fn.serializeObject
  * @method serializeObject()
  * @returns {object} aggregated object - when called on a selection of inputs in a form, returns an object. Name attributes become keys and value attributes become values. Need to collect form data and send it to the backend
  * @see https://gist.github.com/dshaw/449041
  * @requires jQuery
  */
$.fn.serializeObject = function () {

    var o = {};
    var a = this.serializeArray();

    $.each(a, function () {

        if ( o[this.name] ) {
            if ( !o[this.name].push ) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });

    return o;
};
/**
  * @namespace Leaflet.LatLngBounds.prototype.toBBoxStringInverse
  * @method toBBoxStringInverse()
  * @returns {object} string object - the bounding box coordinates returned by default by Leaflet are not in the order expected for making postgres bounding box requests in the backend.
  * @requires Leaflet
  */
L.LatLngBounds.prototype.toBBoxStringInverse = function () {

    return [this.getSouth(), this.getWest(), this.getNorth(), this.getEast()].join(',');
};
/**
  * @namespace Leaflet.Map.prototype.panToOffset
  * @method panToOffset()
  * @returns {object} coordinate string object
  * @param {object} latlng - [lat, lng] Leaflet coordinates object or array
  * @param {array} offset - [x, y] offset by which the map should be moved
  * @param {string} zoom - level to use
  * @param {object} options - leaflet options to pass to the function
  * @requires Leaflet
  * @author louh@github
  * @copyright Copyright (c) 2013, Code for America
  * @see LICENSE.md
  */
L.Map.prototype.panToOffset = function (latlng, offset, zoom, options) {

    var x = this.latLngToContainerPoint(latlng).x - offset[0],
        y = this.latLngToContainerPoint(latlng).y - offset[1],
        point = this.containerPointToLatLng([x, y]);

    if (zoom) {
        return this.setView(point, zoom, {pan: options});
    } else {
        return this.setView(point, this._zoom, {pan: options});
    }
};
/**
  * Tools an utilities.
  */
var tools = {
    makeEllipsis: function (obj, n) {
        return obj.substr(0,n-1)+(obj.length>n?'&hellip;':'');
    },
    insertString: function (obj, index, string) {

        if (index > 0) {

            return obj.substring(0, index) + string + obj.substring(index, obj.length);

        } else {

            return string + obj;
        }
    },
    reverseGeocode: function (o) {

        var latlng = o.replace(', ', '+');
        // console.log(latlng);

        var token = '@@opencagetoken';

        if ( latlng ) {

            var callurl = 'https://api.opencagedata.com/geocode/v1/json?q=' + latlng + '&limit=1&no_annotations=1&key=' + token;

            var request = $.get(callurl);

            return request;

        } else { return null; }
    },
    setMarkerClassColor: function( c) {

        return c === 1  ? 'marker-color-limegreen'  :
               c === 2  ? 'marker-color-yellow'     :
               c === 3  ? 'marker-color-orangered'  :
               c === 4  ? 'marker-color-red'        :
                          'marker-color-violet'     ;
    },
    setPolylineColor: function (c) {

        return c === 1  ? '#ccff66' :
               c === 2  ? '#ffff00' :
               c === 3  ? '#FF4500' :
               c === 4  ? '#ff1a1a' :
                          '#e60073' ;
    },
    setTodoFullText: function (t) {

        return t == 1  ? ' it has been cleaned up already'  :
               t == 2  ? ' need help to clean it up'        :
               t == 3  ? ' full bags need to be collected'  :
               t == 4  ? ' a cleaning needs to be organized':
                         ' tell the local authorities'      ;
    },
    setMarkerIcon: function (c, d) {
        if ( !d ) {
            return (c == false) ? maps.icons.garbageMarker : maps.icons.cleanedMarker;

        } else {

            return ( new Date(d) < new Date() ) ? maps.icons.pastCleaningMarker: maps.icons.cleaningMarker;
        }
    },
    getInvertedBounds: function (map) {
        var bounds = map.getBounds().toBBoxStringInverse();
        return bounds;
    },
    getRoundedBounds: function (o) {

         // We artibtrarily set outer bounds to one degree more NE and one less SW
         o._northEast.lat = Math.ceil(o._northEast.lat) + 1;
         o._northEast.lng = Math.ceil(o._northEast.lng) + 1;
         o._southWest.lat = Math.floor(o._southWest.lat) - 1;
         o._southWest.lng = Math.floor(o._southWest.lng) - 1;
         return o;
    },
    checkIfInsideRoundedBounds: function (bounds) {

        if ( tools.states.roundedBounds && tools.states.roundedBounds.contains(bounds) ) {
            // New view inside original bounds
            return true;

        } else {
            // New view outside original bounds
            var new_bounds = maps.map.getBounds();
            rounded_bounds = tools.getRoundedBounds(new_bounds);

            tools.states.roundedBounds = rounded_bounds;

            return false;
        }
    },
    getTrashBins: function (map) {

        if ( map.getZoom() < 15 ) {

            alerts.showAlert(31, 'info', 2000);
            return;
        }

        // load trashbins icons on the map
        var query = '(node["amenity"="waste_basket"]({{bbox}});node["amenity"="recycling"]({{bbox}});node["amenity"="waste_disposal"]({{bbox}}););out;';

        var osmTrashbinLayer = new L.OverPassLayer({
            query: query
        });

        console.log('loading bins');

        map.addLayer(osmTrashbinLayer);
    },
    getLeafletObj: function (type, id) {

        var layername = type + 'LayerGroup';

        var layergroup = maps[layername].getLayers();

        console.log('layername', layername);
        console.log('layergroup', layergroup);

        var layer = layergroup.filter( function( obj ) {
            return obj.options.id == id;
        })[0];

        return layer;
    },
    getVerticalOffset: function () {

        return !window.isMobile ? [0, - $(window).height() / 4 + 20] : [0, - $(window).height() / 4]
    },
    getHorizontalOffset: function () {

        return [- $(window).width() / 6, 0];
    },
    resetIconStyle: function (id) {

        if (id > 0 && (id || typeof id != 'undefined')) {

            console.log('id from resetIconStyle: ', id)

            var marker = maps.unsavedMarkersLayerGroup.getLayer(id);

            console.log('marker obj from resetIconStyle(): ', marker);

            if (marker) {
                var markericon = $(marker._icon) || 'undefined';
            }

            if (markericon || typeof markericon != 'undefined' && marker) {

                markericon.removeClass('marker-garbage marker-cleaning');
                // markericon.removeClass('marker-cleaning');

                // Remove any class color from the icon and add the generic marker class and color
                markericon.removeClass(function(index, css) {
                    return (css.match(/(^|\s)marker-color-\S+/g) || []).join(' ');
                }).addClass('marker-generic');

                markericon.addClass('marker-color-gray');

            } else {  return; }

        } else { return; }
    },
    checkOpenUiElement: function (map){

        var compactattributions = $('.leaflet-compact-attribution-toggle'),
            ocdsearch = $('.leaflet-control-ocd-search'),
            dropdown = $('.dropdown'),
            layerscontrolbutton = $('.leaflet-control-layers');

        if ( ui.sidebar.isVisible() ) {
            ui.sidebar.hide();
            return;
        }

        if ( ui.bottombar.isVisible() ) {
            // TODO check if we are drawing if unfinished, ask user if he wants to cancel
            ui.bottombar.hide();
            return;
        }
        if ( dropdown.hasClass('open') ) {
            dropdown.removeClass('open');
            return;
        }
        // Custom code added in leaflet (edited out in L.Control.Layers), so the map click is bound here here
        if ( !maps.layerscontrol.options.iscollapsed || $(layerscontrolbutton).hasClass('leaflet-control-layers-expanded')) {
            console.log('layers control collapsing from ui check open elements');
            maps.layerscontrol.collapse();
            // return;
        }
        // Somehow checking the collapsed property of the control doesn't work?
        // if (!maps.geocodercontrol.options.collapsed) {
        if ( ocdsearch.hasClass('leaflet-control-ocd-search-expanded') ) {
            maps.geocodercontrol._collapse();
            L.DomEvent.stopPropagation(map);
            // Force closing softkeyboard
            $('.leaflet-control-ocd-search-form input').blur();
            return;
        }
        if ( maps.locationcontrol._active || maps.locationcontrol._marker ) {
            maps.locationcontrol.stop();
            return;
        }
        if ( compactattributions.is(':checked') ) {
            compactattributions.prop('checked', false);
            return;
        }
        // Check the current zoom level and warn the user
        if ( map ) {
            // If the map itself isn't the target it means a marker cluster was clicked
            if ( !map.target ) {
                if (map._zoom < 15) {
                    return;
                }
            }
            if ( map.target ) {
                if (map.target.getZoom() < 15) {
                    alerts.showAlert(15, 'info', 1200);
                    return;
                }
            }
        }
        // Check if there's any marker visible on mobile map
        if ( window.isMobile ) {
            if (maps.unsavedMarkersLayerGroup.length > 0) {
                maps.map.clearLayers(maps.unsavedMarkersLayerGroup);
                return;
            }
        }

        return true;
    },
    openGraphScraper: function (url) {
        // TODO use tools.processRequestStatus() to send UI feedback if the below fails
        var token = '@@opengraphiotoken';

        if (url) {

            var callurl = 'https://opengraph.io/api/1.0/site/' + encodeURIComponent(url);
            var request = $.ajax({
                method: 'GET',
                url: callurl,
                data: jQuery.param({'app_id': token}),
                success: function (data) {
                    console.log('ajax call pass', data);
                    if (data.error) {
                        alerts.showAlert(5, "danger", 2000);
                        return;
                    }
                    if (data.openGraph.error == 'null' || !data.openGraph.error) {
                        console.log('Successfully retrieved OG data');
                    }
                },
                error: function () {
                    console.log('Error fetching og data');
                    alerts.showAlert(5, "danger", 2000);
                    return;
                }
            });

            return request;
        }

        else {
            alerts.showAlert(5, "warning", 2000);
            return;
        }
    },
    scrapeGeolocationFromText: function () {
        // TODO
        return;
    },
    activateTabs: function () {
      // document.queryselectorAll('.nav-tabs' ...)
      $(".nav-tabs").on("click", "a", function (e) {

        e.preventDefault();
        // this.
        $(this).tab('show');

      });

    },
    randomString: function (len) {
        var a = '',
            b = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        for( var i=0; i < len; i++ ) {
            a += b.charAt(Math.floor(Math.random() * b.length));
        }
        return a;
    },
    listMarkersInView: function (type) {

        var tempMarkers = [];

        (type === 'garbage' ? maps.garbageLayerGroup : maps.cleaningLayerGroup).eachLayer( function (layer) {

            if ( maps.map.getBounds().contains(layer.getLatLng()) ) {

                tempMarkers.push(layer);
            }
        });

        console.log('Markers in temp array: ', tempMarkers);

        return tempMarkers;
    },
    downloadDataAsJSON: function (arr) {

        // Extract the data from the 'options' key of the object
        var extractedoptions = [];

        arr.forEach( function (el) {
            // Remove these two keys as they're not useful
            delete el.options['icon'];
            delete el.options['_initHooksCalled'];

            extractedoptions.push(el.options);
        });

        // https://stackoverflow.com/a/30800715/2842348 @volzo LIC MIT
        var datastr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(extractedoptions));
        var elem = document.getElementById('data-download-hidden');

        elem.setAttribute("href", datastr);
        elem.setAttribute("download", "data.json");
        elem.click();
    },
    getScript: function (src) {

        return new Promise((resolve, reject) => {

            var script = document.createElement('script');
            document.body.appendChild(script);
            script.onload = resolve;
            script.onerror = reject;
            script.async = true;
            script.src = src;
        })
    },
    uploadToImgur: function (file) {

        // based on a pen by James Skinner - License MIT - https://codepen.io/spiralx/pen/mJxWJE
        var formData = new FormData()
            formData.append('type', 'file')
            formData.append('image', file)

        return fetch('https://api.imgur.com/3/upload', {

          method: 'POST',
          headers: {
            Accept: 'application/json',
            Authorization: 'Client-ID @@imgurtoken'
          },
          body: formData
        })

        .then((response) => {
          response.json()

          if ( response.status === 200 || response.status === 0 ) {

            var image_uploader_url = document.getElementById('image-uploader-url');
                image_uploader_url.value = response.data.link;

          }
          else {
            alerts.showAlert(5, "danger", 2000);
            return false;
          }


        })
    },
    fileUploadHandler: function (file) {
    // base on a pen by James Skinner - License MIT - https://codepen.io/spiralx/pen/mJxWJE

      console.log('UUUUUUUUUUUUUUUUUUUUUUUUu', file);

      // TODO send to uploader


    },
    deleteEmptyKeys: function (obj) {

      var new_obj = obj

      Object.keys(obj).forEach(key => {

        if ( !obj[key] || typeof obj[key] === 'undefined' || obj[key].length === 0 ) {
          delete obj[key];
        }
      });

      return obj;
    },
    makeApiCall: function (obj) {

        console.log('makeapicall obj', obj);

        var options =  {
              method: obj.method
            , headers: new Headers({
                  'Accept': 'application/json'
                , 'Content-type':'application/json'
                , 'Authorization': obj.auth.toString()
              })
            , body: obj.data
        };

        console.log('makeapicall options', options);

        return fetch(obj.url, options);
    },
    joinObjectProperties: function (obj) {

      var new_obj = {};

      for ( var k in obj ) {

          var o = obj[k];
          // if the key is an object gather the values in a string
          if ( o.join ) {
            new_obj[k] = o.join();
          }
          else {
              new_obj[k] = obj[k];
          }
      }

      return new_obj;

    },
    capitalizeFirstLetter: function (string) {
        // License MIT, Steve Harrison @SO https://stackoverflow.com/a/1026087/2842348
        return string.charAt(0).toUpperCase() + string.slice(1);
    },
    states: {
      /**
        * App shared states
        * TODO set writeability / Object.freeze()
        */
        currentZoom: null
      , roundedBounds: null
      , currentFeatureId: null
      , loggedin: null
    },
    token: '@@windowtoken'
};

// Seal tools object so we can only change current props
// Object.seal(tools);

// Check if mobile device on load
window.isMobile = L.Browser.mobile;
console.log("On mobile device: ", window.isMobile);
