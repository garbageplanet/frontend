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

    // Change this to parse the different options as an object.
    L.Hash.parseHash = function(hash) {

        var params = getHashParams();

        if ( typeof params.zoom != 'undefined' || typeof params.lat != 'undefined' || typeof params.lon != 'undefined' ) {

            var zoom = parseInt(params.zoom.values, 10),
                lat = parseFloat(params.lat.values),
                lon = parseFloat(params.lon.values);

            if ( isNaN(zoom) || isNaN(lat) || isNaN(lon) || !zoom || !lat || !lon ) {
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

    L.Hash.formatHash = function(map) {
        var center = map.getCenter(),
            zoom = map.getZoom(),
            precision = Math.max(0, Math.ceil(Math.log(zoom) / Math.LN2)),
            returnObj = {
                'zoom': { values: zoom, comparator: '='},
                'lat': { values: center.lat.toFixed(precision), comparator: '=' },
                'lon': { values: center.lng.toFixed(precision), comparator: '=' }
            };
            return returnObj;
    };

    L.Hash.prototype = {
        map: null,
        lastHash: null,

        parseHash: L.Hash.parseHash,
        formatHash: L.Hash.formatHash,

        init: function(map) {
            this.map = map;

            // reset the hash
            this.lastHash = null;
            this.onHashChange();

            if (!this.isListening) {
                this.startListening();
            }
        },

        removeFrom: function(map) {
            if (this.changeTimeout) {
                clearTimeout(this.changeTimeout);
            }

            if (this.isListening) {
                this.stopListening();
            }

            this.map = null;
        },

        onMapMove: function() {
            // bail if we're moving the map (updating from a hash),
            // or if the map is not yet loaded
            var hash;

            if (this.movingMap || !this.map._loaded) {
                return false;
            }

            // If getHashParams returns no zoom, etc it is created for initialization
            if ( !this.parseHash(hash) ){

                hash = getHashParams();

                // hash = Object.assign(hash, this.formatHash(this.map));

                L.Util.extend(this.formatHash(this.map), hash);

                updateUrlHash(hash);

            } else if ( !hash ) {

                hash = this.getHashParams();

                var newParams = this.formatHash(this.map);

                console.log("NEW PARAMS",newParams);

                console.log('HASH***********', hash)

                Object.keys(newParams).forEach( function (val, key) {

                    hash[key].values = val.values;
                    hash[key].comparator = '=';
                });

                updateUrlHash(hash);
            }

            this.lastHash = hash;

        },

        movingMap: false,
        update: function() {

            var hash = getHashParams();

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

        // defer hash change updates every 200ms
        changeDefer: 200,
        changeTimeout: null,
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

        isListening: false,
        hashChangeInterval: null,
        startListening: function() {
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

// Return the hash parameters from the current URL. [source](http://goo.gl/mebsOI)
function getHashParams(){
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
}

// The `generateUrlHash` method builds and returns a URL hash from a set of object parameters
function updateUrlHash(params) {
    var newHash,
    hashParams = [];
    // Loop through params, stringify them and push them into the temp array.

    // Loop through params, stringify them and push them into the temp array.
    Object.keys(params).forEach( function (key) {

        hashParams.push( key + '=' + params[key].values );
    });

    newHash = '&' + hashParams.join('&');
    window.location.hash = newHash;

}

// Create a parameter from scratch (automatically builds object)
function addParam( paramName, values ){
    var params = getHashParams();
    params[paramName] = {};
    params[paramName].values = values;
    params[paramName].comparator = '=';
    updateUrlHash(params);
}

/*
    END HASH PARSING FUNCTIONS
*/
