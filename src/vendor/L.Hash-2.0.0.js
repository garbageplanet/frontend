/*! Leaflet Hash
 * https://github.com/mlevans/leaflet-hash/blob/master/LICENSE.md Copyright (c) 2013 Michael Lawrence Evans
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * params added by @sephcoster - https://github.com/sephcoster/leaflet-hash/blob/master/leaflet-hash.js
 * modified by @adriennn, cleanedup lodash req and pulled external function in plugins
 */
(function(window) {
    var HAS_HASHCHANGE = (function() {
        var doc_mode = window.documentMode;
        return ('onhashchange' in window) &&
            (doc_mode === undefined || doc_mode > 7);
    })();

    L.Hash = function(map) {
        this.onHashChange = L.Util.bind(this.onHashChange, this);

        if (map) {
            this.init(map);
        }
    };

    // Return the hash parameters from the current URL. [source](https://stackoverflow.com/a/4198132/2842348)
    L.Hash.getHashParams = function () {
        var hashParams = {};
        var e,
            a = /\+/g,  // Regex for replacing addition symbol with a space
            r = /([^!&;=<>]+)(!?[=><]?)([^&;]*)/g,
            d = function (s) { return decodeURIComponent(s.replace(a, ' ')); },
            q = window.location.hash.substring(1).replace(/^!\/?/, '');

        while (e = r.exec(q)) {
          hashParams[d(e[1])] = {
            values: d(e[3]),
            comparator: d(e[2])
          };
        }
        return hashParams;
    };

    // The `generateUrlHash` method builds and returns a URL hash from a set of object parameters
    L.Hash.updateUrlHash = function (params) {

        var newHash,
        hashParams = [];

        // Loop through params, stringify them and push them into the temp array.
        Object.keys(params).forEach( function (key) {

            hashParams.push( key + '=' + params[key].values );
        });

        console.log('PARAMS from updateUrlHash', params);
        console.log('HASHPARAMS from updateUrlHash', hashParams);

        newHash = '&' + hashParams.join('&');
        window.location.hash = newHash;

    };

    // Create a parameter from scratch (automatically builds object)
    L.Hash.addParam = function ( paramName, values ){

        var params = L.Hash.getHashParams();

        params[paramName] = {};
        params[paramName].values = values;
        params[paramName].comparator = '=';

        L.Hash.updateUrlHash(params);
    };

    // Change this to parse the different options as an object.
    L.Hash.parseHash = function (hash) {

        var params = L.Hash.getHashParams();

        if( typeof params.zoom !== 'undefined' || typeof params.lat !== 'undefined' || typeof params.lon !== 'undefined') {

            // var zoom = parseInt(params.zoom.values, 10),
            var zoom = (L.version >= '1.0.0') ? parseFloat(params.zoom) : parseInt(params.zoom, 10),

            lat = parseFloat(params.lat.values),
            lon = parseFloat(params.lon.values);

            if ( isNaN(zoom) || isNaN(lat) || isNaN(lon) ) {
                return false;

            } else {

                return {
                    center: {'lat': lat, 'lon': lon},
                    zoom: zoom,
                    params: params
                };
            }
        } else {

            return false;
        }
    };

    L.Hash.formatHash = function (map) {

        var center = map.getCenter(),
            zoom = map.getZoom(),
            precision = Math.max(0, Math.ceil(Math.log(zoom) / Math.LN2)),
            obj = {
                'zoom': { values: zoom, comparator: '='},
                'lat': { values: center.lat.toFixed(precision), comparator: '=' },
                'lon': { values: center.lng.toFixed(precision), comparator: '=' }
            };

            return obj;
    };

    L.Hash.prototype = {

        map: null,
        lastHash: null,
        parseHash: L.Hash.parseHash,
        formatHash: L.Hash.formatHash,
        getHashParams: L.Hash.getHashParams,
        updateUrlHash: L.Hash.updateUrlHash,
        addParam: L.Hash.addParam,
        isListening: false,
        hashChangeInterval: null,
        movingMap: false,
        changeDefer: 200,
        changeTimeout: null,

        init: function(map) {

            this.map = map;

            this.lastHash = null;

            this.onHashChange();

            this.startListening();
        },

        removeFrom: function(map) {

            if (this.changeTimeout) {
                clearTimeout(this.changeTimeout);
            }

            this.stopListening();

            this.map = null;
        },

        onMapMove: function() {
            // bail if we're moving the map (updating from a hash),
            // or if the map is not yet loaded
            var hash;

            if ( this.movingMap || !this.map._loaded ) {
                return false;
            }

            // If getHashParams returns no zoom, etc it is created for initialization
            if ( !this.parseHash(hash) ){

                hash = this.getHashParams();

                console.log('HASH FROM onMapMove before extending', hash);

                hash = Object.assign({/*hash*/}, this.formatHash(this.map));

                console.log('HASH FROM onMapMove after extending', hash);

                this.updateUrlHash(hash);

            } else {

                hash = getHashParams();
                var newParams = this.formatHash(this.map);

                // newParams.map(
                //
                //   function(val,key){
                //       hash[key].values = val.values;
                //       hash[key].comparator = '=';
                //   }
                // );

                Object.keys(newParams).forEach( function (key) {

                    // hashParams.push( params[key] + '=' + params[key].values );

                    hash[key].values = key.values;
                    hash[key].comparator = '=';

                });

                this.updateUrlHash(hash);
            }

            this.lastHash = hash;
        },

        update: function() {

            var hash = this.getHashParams();

            if ( JSON.stringify(hash) === JSON.stringify(this.lastHash) ){
                return false;
            }

            var parsed = this.parseHash(hash);

            if (parsed) {
                this.movingMap = true;

                this.map.setView(parsed.center, parsed.zoom);

                this.movingMap = false;

            } else {
                this.onMapMove(this.map);
            }
        },

        onHashChange: function() {
            // throttle calls to update() so that they only happen every
            // `changeDefer` ms
            if (!this.changeTimeout) {

                var that = this;

                this.changeTimeout = setTimeout(function() {
                    that.update();
                    that.changeTimeout = null;
                }, this.changeDefer);
            }
        },

        startListening: function() {

            if (this.isListening) { return; }

            this.map.on("moveend", this.onMapMove, this);

            if (HAS_HASHCHANGE) {
                L.DomEvent.addListener(window, "hashchange", this.onHashChange);

            } else {
                clearInterval(this.hashChangeInterval);
                this.hashChangeInterval = setInterval(this.onHashChange, 500);
            }
            this.isListening = true;
        },

        stopListening: function() {

            if (!this.isListening) { return; }

            this.map.off("moveend", this.onMapMove, this);

            if (HAS_HASHCHANGE) {
                L.DomEvent.removeListener(window, "hashchange", this.onHashChange);

            } else {
                clearInterval(this.hashChangeInterval);
            }
            this.isListening = false;
        }
    };

    L.hash = function(map) {
        return new L.Hash(map);
    };
    L.Map.prototype.addHash = function() {
        this._hash = L.hash(this);
    };
    L.Map.prototype.removeHash = function() {
        this._hash.removeFrom();
    };
})(window);
