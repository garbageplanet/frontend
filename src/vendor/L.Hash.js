(function(window) {
	var HAS_HASHCHANGE = (function() {
		var doc_mode = window.documentMode;
		return ('onhashchange' in window) &&
			(doc_mode === undefined || doc_mode > 7);
	})();

	L.Hash = function(map, options) {
		this.onHashChange = L.Util.bind(this.onHashChange, this);

		this.options = options || {};

		if (map) {
			this.init(map);
		}
	};

	L.Hash.parseHash = function(hash) {

		if (this.options && this.options.baseURI) {
			hash = hash.replace(this.options.baseURI, "");
		}
		if (this.options && this.options.query) {
			hash = hash.split('?')[0];
		}
		if (hash.indexOf('#') === 0) {
			hash = hash.substr(1);
		}
		var args = hash.split("/");

		if (args.length == 3) {
			var zoom = parseFloat(args[0]),
			     lat = parseFloat(args[1]),
			     lon = parseFloat(args[2]);

			if (isNaN(zoom) || isNaN(lat) || isNaN(lon)) {
				return false;
			} else {
				return {
					center: new L.LatLng(lat, lon),
					zoom: zoom
				};
			}
		} else {
			return false;
		}
	};

	L.Hash.formatHash = function(map) {
		var center = map.getCenter(),
		    zoom = map.getZoom(),
		    precision = Math.max(0, Math.ceil(Math.log(zoom) / Math.LN2));

		var query = (this.options && this.options.query && location.hash.indexOf('?') > -1 ? '?' + location.hash.split('?')[1] : '');

		return (this.options && this.options.baseURI ? this.options.baseURI : "") +
		  [zoom,
			center.lat.toFixed(precision),
			center.lng.toFixed(precision)
		].join("/") + query;
	},

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
			if (this.movingMap || !this.map._loaded) {
				return false;
			}

			var hash = this.formatHash(this.map);

			// Custom code - do not replace the hash if it does not start with a float or intger after the /#
			// var hash_3rd_char = hash.charAt(2);
			// console.log('Hash from L.Hash.onMapMove(): ', hash);
			// console.log('Hash 3rd char from L.Hash.onMapMove(): ', hash_3rd_char);
			//
			// if ( !parseInt(hash_3rd_char, 10) || !parseFloat(hash_3rd_char)) {
			// 	return false;
			// }

			if (this.lastHash != hash) {
				location.replace(hash);
				this.lastHash = hash;
			}
		},

		movingMap: false,
		update: function() {
			var hash = location.hash;

			// var hash_3rd_char = hash.charAt(2);
			// console.log('Hash from L.Hash.update(): ', hash);
			// console.log('Hash 3rd char from L.Hash.update(): ', hash_3rd_char);
			//
			// if ( !parseInt(hash_3rd_char, 10) || !parseFloat(hash_3rd_char)) {
			// 	return false;
			// }

			if (hash === this.lastHash) {
				return;
			}

			var parsed = this.parseHash(hash);

			if (parsed) {
				this.movingMap = true;

				this.map.setView(parsed.center, parsed.zoom, { animate: false});

				this.movingMap = false;
			} else {
				this.onMapMove(this.map);
			}
		},

		// defer hash change updates every 100ms
		changeDefer: 1000,
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

			if (this.isListening) { return; }

			this.map.on("moveend", this.onMapMove, this);

			if (HAS_HASHCHANGE) {
				L.DomEvent.addListener(window, "hashchange", this.onHashChange);
			} else {
				clearInterval(this.hashChangeInterval);
				this.hashChangeInterval = setInterval(this.onHashChange, 50);
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
	L.hash = function(map, options) {
		return new L.Hash(map, options);
	};
	L.Map.prototype.addHash = function() {
		this._hash = L.hash(this);
	};
	L.Map.prototype.removeHash = function() {
		this._hash.removeFrom();
	};
})(window);
