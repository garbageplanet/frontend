/*jslint browser: true, white: true, sloppy: true, maxerr: 1000 global tools */

/**
  * @namespace jQuery.fn.serializeObject
  * @method serializeObject()
  * @returns {object} aggregated object - when called on a selection of inputs in a form, returns an object. Name attributes
                      become keys and value attributes become values. Need to collect form data and send it to the backend
  * @see https://gist.github.com/dshaw/449041
  * @requires jQuery
  */
$.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name]) {
            if (!o[this.name].push) {
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
  * @returns {object} string object - the bounding box coordinates returned by default by Leaflet
                      are not in the order expected for making postGRE bounding box requests in the backend.
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
  * @namespace tools
  * @name tools
  * @type {Object}
  */
var tools = {
/**
  * @namespace tools.makeEllipsis
  * @method makeEllipsis()
  * @param {obj} object - the string to shorten.
  * @param {n} integer - the length of the final shortened string.
  * @returns {string} shortened string - returns an inputed string with ellipsis (...)
  * @see http://stackoverflow.com/questions/1199352/smart-way-to-shorten-long-strings-with-javascript/1199420#1199420
  */
    makeEllipsis: function (obj, n) {
        return obj.substr(0,n-1)+(obj.length>n?'&hellip;':'');
    },
 /**
   * @namespace tools.insertString
   * @method insertString()
   * @param {obj} object - the string to modify.
   * @param {index} integer - the position in the string where a character is to be inserted.
   * @param {string} string - the string to be added to the original string.
   * @returns {string} modified string - returns the inputed string with added string.
   */
    insertString: function( obj, index, string) {
        if (index > 0) {
            return obj.substring(0, index) + string + obj.substring(index, obj.length);
        } else {
            return string + obj;
        }
    },
    reverseGeocode: function (o) {

      var latlng = o.replace(', ', '+');
      console.log(latlng);
      var token = '@@opencagetoken';

        if (latlng) {

            var callurl = 'https://api.opencagedata.com/geocode/v1/json?q=' + latlng + '&limit=1&no_annotations=1&key=' + token;
            var request = $.ajax({
                method: 'GET',
                url: callurl
            });

            return request;

        } else { return; }
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
        if (!d) {
            return (c == false) ? maps.icons.garbageMarker : maps.icons.cleanedMarker;

        } else {

            return (new Date(d) < new Date()) ? maps.icons.pastCleaningMarker: maps.icons.cleaningMarker;
        }
    },
    getCurrentBounds: function () {
        var bounds = maps.map.getBounds().toBBoxStringInverse();
        console.log
        return bounds;
    },
    /*roundBounds: function(b) {
    // TODO
        var _NE_lat = o._northEast.lat,
            _SW_lat = o._southWest.lat,
            _NE_lng = o._northEast.lng,
            _SW_lng = o._southWest.lng;
    },*/
    /*cloneLayer: function(layer) {

        var options = layer.options;

        // Marker layers
        if (layer instanceof L.Marker) {
            return L.marker(layer.getLatLng(), options);
        }

        // Vector layers
        if (layer instanceof L.Polygon) {
            return L.polygon(layer.getLatLngs(), options);
        }
        if (layer instanceof L.Polyline) {
            return L.polyline(layer.getLatLngs(), options);
        }

        // layer/feature groups
        if (layer instanceof L.LayerGroup || layer instanceof L.FeatureGroup) {
            var layergroup = L.layerGroup();
            layer.eachLayer(function (inner) {
                layergroup.addLayer(tools.cloneLayer(inner));
            });
            return layergroup;
        }

        throw 'Unknown layer, cannot clone this layer';
    },*/
    /*checkLayerContents: function(oldl, newl) {

        // FIXME this doesn't work because markers lose their event listerners and icons
        // If the non-temp layer is empty get the fetched data into it
        if (oldl.getLayers().length < 1){

            oldl.clearLayers();
            map.removeLayer(oldl);
            oldl = tools.cloneLayer(newl);
            newl.clearLayers();
            map.removeLayer(newl);
            oldl.addTo(map);
            return;
        }

        // If the non-temp layer isn't empty, compare contents
        if (oldl.getLayers().length > 0) {

            if (JSON.stringify(newl.getLayers()) !== JSON.stringify(oldl.getLayers())) {

                map.removeLayer(oldl);
                oldl.clearLayers();
                oldl = this.cloneLayer(newl);
                oldl.addTo(map);
                map.removeLayer(newl);
                newl.clearLayers();
                return;

            } else {
                return;
            }
        }
    },*/
    getVerticalOffset: function () {

        var vOffset = [0, 0];
        // TODO take in account the topbar for offsetting on larger screens
        // TODO do this dynamically
        if (!window.isMobile) {
            vOffset[1] = - $(window).height() / 4 + 20;
        }

        // not needed on mobile
        else {
            vOffset[1] = - $(window).height() / 4;
        }

        return vOffset;
    },
    getHorizontalOffset: function () {

        var hOffset = [0, 0];
        hOffset[0] = - $(window).width() / 6;
        return hOffset;
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
    /* App states for keeping track of things TODO make these immutable*/
    states : {
      currentZoom: null,
      initialBbox: [],
      roundedBounds: null,
      currentFeatureId: null,
      login: null
    },
 /**
   * @namespace tools.checkOpenUiElement - a helper function to check the UI for what's currently going on so that one map
                                           widget closes or stops when another one is called
   * @method checkOpenUiElement()
   * @param {object} map object - the main map object, only needed to be able to identify clicks on cluser markers
   */
    checkOpenUiElement: function (map){

        // TODO can we make the same function with a switch statement?
        // that would require to set states in the UI
        var compactattributions = $('.leaflet-compact-attribution-toggle'),
            ocdsearch = $('.leaflet-control-ocd-search'),
            dropdown = $('.dropdown'),
            layerscontrolbutton = $('.leaflet-control-layers');

        if (ui.sidebar.isVisible()) {
            ui.sidebar.hide();
            return;
        }

        if (ui.bottombar.isVisible()) {
            // TODO check if we are drawing if unfinished, ask user if he wants to cancel
            ui.bottombar.hide();
            return;
        }
        if (dropdown.hasClass('open')) {
            dropdown.removeClass('open');
            return;
        }
        // Custom code added in leaflet (edited out in L.Control.Layers), so the map click is bound here here
        if ( !maps.layerscontrol.options.iscollapsed || $(layerscontrolbutton).hasClass('leaflet-control-layers-expanded')) {
            console.log('layers control collapsing from ui check open elements');
            maps.layerscontrol.collapse();
            return;
        }
        // Somehow checking the collapsed property of the control doesn't work?
        // if (!maps.geocodercontrol.options.collapsed) {
        if (ocdsearch.hasClass('leaflet-control-ocd-search-expanded')) {
            maps.geocodercontrol._collapse();
            L.DomEvent.stopPropagation(map);
            // Force closing softkeyboard
            $('.leaflet-control-ocd-search-form input').blur();
            return;
        }
        if (maps.locationcontrol._active || maps.locationcontrol._marker) {
            maps.locationcontrol.stop();
            return;
        }
        if (compactattributions.is(':checked')) {
            compactattributions.prop('checked', false);
            return;
        }
        // Check the current zoom level and warn the user
        if (map) {
            // If the map itself isn't the target it means a marker cluster was clicked
            if (!map.target) {
                if (map._zoom < 15) {
                    return;
                }
            }
            if (map.target) {
                if (map.target.getZoom() < 15) {
                    alerts.showAlert(15, 'info', 1200);
                    return;
                }
            }
        }
        // Check if there's any marker visible on mobile map
        if (window.isMobile) {
            if (maps.unsavedMarkersLayerGroup.length > 0) {
                maps.map.clearLayers(maps.unsavedMarkersLayerGroup);
                return;
            }
        }

        return true;
    },
 /**
   * @namespace tools.token - the app token to talk to the backend.
   */
    token: '@@windowtoken',
 /**
   * @namespace tools.ogDotIoScraper - opengraph data scraper
   * @method randomString()
   * @param {string} url - URL of the website form which the open graph data needs to be retrieved using the opengraph.io API,
                           used in the 'link' marker creation to enable users to add map marker with content tretived from
                           external webpages.
   * @return - Returns a Promise obj with scrapped data
   */
    openGraphScraper: function (url) {

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
                        alerts.showAlert(5, "danger", 3000);
                        return;
                    }
                    if (data.openGraph.error = 'null' || !data.openGraph.error){
                        console.log('Successfully retrieved OG data');
                    }
                },
                error: function () {
                    console.log('Error fetching og data');
                    return;
                }
            });

            return request;
        }

        else {
            alerts.showAlert(5, "warning", 2000);
            return
        }
    },
    scrapeGeolocationFromText: function (o) {
        // TODO
        return;
    },
 /**
   * @namespace tools.randomString
   * @method randomString()
   * @returns {string} radnom string - Returns a random alphanumeric string [a-z][A-Z][0-9] of determined length, used when
                       creating a game tile and the user didn't give a title to the tile.
   * @param {string} len - Length of the string to be returned
   * @requires Leaflet
   */
    randomString: function (len) {
        var a = '',
            b = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        for( var i=0; i < len; i++ ) {
            a += b.charAt(Math.floor(Math.random() * b.length));
        }
        return a;
    },
 /**
   * @namespace tools.mobileCheck
   * @method mobileCheck()
   * @returns {boolean} true - Returns true if the device on which the site is loaded passes the L.Browser leaflet mobile check.
   * @requires Leaflet
   */
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
    }
};

// Check if mobile device on load
window.isMobile = L.Browser.mobile;
console.log("On mobile device: ", window.isMobile);
