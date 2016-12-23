/* 
 * OpenCage Data Search Control v1.1.2 - 2015-08-31
 * Copyright (c) 2015, OpenCage Data 
 * info@opencagedata.com 
 * http://www.opencagedata.com 
 * modified by adriennn for www.garbagepla.net
 * 
 * Licensed under the BSD license. 
 * Demo: http://geocoder.opencagedata.com/code.html 
 * Source: git@github.com:opencagedata/leaflet-opencage-search.git 
 */
(function (factory) {
	// Packaging/modules magic dance
	var L;
	if (typeof define === 'function' && define.amd) {
		// AMD
		define(['leaflet'], factory);
	}

	else if (typeof module !== 'undefined') {
		// Node/CommonJS
		L = require('leaflet');
		module.exports = factory(L);
	}

	else {
		// Browser globals
		if (typeof window.L === 'undefined') {
			throw 'Leaflet must be loaded first';
		}
		factory(window.L);
	}
}(function (L) {
	'use strict';
	L.Control.OpenCageSearch = L.Control.extend({
		options: {
			showResultIcons: false,
			collapsed: true,
			expand: 'click',
			position: 'topleft',
			placeholder: 'Address search...',
			errorMessage: 'Nothing found.',
			key: '',
			limit: 5
		},

		_callbackId: 0,

		initialize: function (options) {
			L.Util.setOptions(this, options);
			if (!this.options.geocoder) {
				this.options.geocoder = new L.Control.OpenCageSearch.Geocoder(this.options);
			}
		},

		onAdd: function (map) {
			var className = 'leaflet-control-ocd-search';
			var container = L.DomUtil.create('div', className);
			var icon = this._icon = L.DomUtil.create('span', 'leaflet-control-ocd-search-icon fa fa-fw fa-search', container);
			var form = this._form = L.DomUtil.create('form', className + '-form', container);
			var input;

			this._map = map;
			this._container = container;
			input = this._input = L.DomUtil.create('input');
			input.type = 'text';
			input.placeholder = this.options.placeholder;

			L.DomEvent.addListener(input, 'keydown keypress', this._keydown, this);

			this._errorElement = document.createElement('div');
			this._errorElement.className = className + '-form-no-error';
			this._errorElement.innerHTML = this.options.errorMessage;
            this._icon.title = "Search for places";

			this._alts = L.DomUtil.create('ul', className + '-alternatives leaflet-control-ocd-search-alternatives-minimized');

			form.appendChild(input);
			form.appendChild(this._errorElement);
			container.appendChild(this._alts);

			if (this.options.collapsed) {
				if (this.options.expand === 'click') {
					L.DomEvent.addListener(icon, 'click', function(e) {
						if (e.button === 0 && e.detail !== 2) {
							this._toggle();
						}
					}, this);
				}
                
                // This below doesn't work?
				else {
					L.DomEvent.addListener(icon, 'mouseover', this._expand, this);
					L.DomEvent.addListener(icon, 'mouseout', this._collapse, this);
					this._map.on('movestart', this._collapse, this);
				}
			}

			else {
				this._expand();
			}
            
            // Make sure we don't send clicks to the map when we interact with the content
            // From L.Control.Sidebar
            var stop = L.DomEvent.stopPropagation;
            var fakeStop = L.DomEvent._fakeStop || stop;
            L.DomEvent
                .on(container, 'contextmenu', stop)
                .on(container, 'click', fakeStop)
                .on(container, 'mousedown', stop)
                .on(container, 'touchstart', stop)
                .on(container, 'dblclick', fakeStop)
                .on(container, 'mousewheel', stop)
                .on(container, 'MozMousePixelScroll', stop)
                .on(icon, 'click', fakeStop)
                .on(icon, 'mousedown', stop)
                .on(icon, 'touchstart', stop)
                .on(icon, 'dblclick', fakeStop);
            
            L.DomEvent.disableClickPropagation(container);
            L.DomEvent.disableClickPropagation(form);
            
            // L.DomEvent.addListener(form, 'submit', this._geocode, this);  
            
            L.DomEvent.on(form, 'submit', function (e) {
                e.stopImmediatePropagation();
                L.DomEvent.stop;
                L.DomEvent._fakestop;
                setTimeout(L.bind(this._geocode, this), 10);
                L.DomEvent.preventDefault(e);
               console.log('submit event: ', e)
            }, this);

            return container;
		},

		_geocodeResult: function (results) {
			L.DomUtil.removeClass(this._container, 'leaflet-control-ocd-search-spinner');
            
            L.DomUtil.removeClass(this._icon, 'fa-spinner');
            L.DomUtil.removeClass(this._icon, 'fa-pulse');
            L.DomUtil.addClass(this._icon, 'fa-close');
            
			if (results.length === 1) {
				this._geocodeResultSelected(results[0]);
			}

			else if (results.length > 0) {
				this._alts.innerHTML = '';
				this._results = results;
				L.DomUtil.removeClass(this._alts, 'leaflet-control-ocd-search-alternatives-minimized');
				for (var i = 0; i < results.length; i++) {
					this._alts.appendChild(this._createAlt(results[i], i));
				}
                
                // Hide soft keyboard on mobile credit: http://stackoverflow.com/a/32862822/2842348
                if (window.innerWidth < 768) {
                    
                    var searchfield = this._input;
                    searchfield.setAttribute('readonly', 'readonly');
                    setTimeout(function() {

                        searchfield.blur();
                        searchfield.removeAttribute('readonly');

                    }, 100);
                }
			}

			else {
				L.DomUtil.addClass(this._errorElement, 'leaflet-control-ocd-search-error');
			}
		},

		markGeocode: function(result) {
			if (result.bounds) {
				this._map.fitBounds(result.bounds);
			} else {
				// this._map.panTo(result.center);
                this._map.flyTo(result.center);
			}

			return this;
		},

		_geocode: function(event) {
                        
			L.DomUtil.addClass(this._container, 'leaflet-control-ocd-search-spinner');
            
            L.DomUtil.removeClass(this._icon,'fa-arrow-left');
            L.DomUtil.addClass(this._icon,'fa-spinner');
            L.DomUtil.addClass(this._icon,'fa-pulse');

            this._clearResults();
			this.options.geocoder.geocode(this._input.value, this._geocodeResult, this);

			return false;
		},

		_geocodeResultSelected: function(result) {
			if (!this.options.collapsed) {
				this._collapse();
			}

			else {
				this._clearResults();
			}

			this.markGeocode(result);
		},

		_toggle: function() {
            console.log("ToGGLING!!!!!!");
			if (this._container.className.indexOf('leaflet-control-ocd-search-expanded') >= 0) {
				this._collapse();
			}

			else {
				this._expand();
			}
		},

		_expand: function () {
            console.log("EXPANDING!!!!!!");
			L.DomUtil.addClass(this._container, 'leaflet-control-ocd-search-expanded');
            
            // CUSTOM added three lines
            L.DomUtil.removeClass(this._icon, 'fa-search');
            L.DomUtil.addClass(this._icon, 'fa-arrow-left');
            this.options.collapsed = false;
            
            // Hide the bottombar else the results list will be covered
            if (ui.bottombar.isVisible() || ui.sidebar.isVisible()) {
                ui.bottombar.hide();
                ui.sidebar.hide();
            }
            
			this._input.select();
		},

		_collapse: function () {
            console.log("COLLAPSING!!!!!!");
			this._container.className = this._container.className.replace(' leaflet-control-ocd-search-expanded', '');
			L.DomUtil.addClass(this._alts, 'leaflet-control-ocd-search-alternatives-minimized');
			L.DomUtil.removeClass(this._errorElement, 'leaflet-control-ocd-search-error');
                                    
            L.DomUtil.removeClass(this._icon,'fa-close');
            L.DomUtil.removeClass(this._icon,'fa-arrow-left');
            L.DomUtil.addClass(this._icon,'fa-search');
            this.options.collapsed = true;
            
             $('.leaflet-control-ocd-search-form input').blur();

		},

		_clearResults: function () {
            console.log("CLEARING RESULTS!!!!!!");
            L.DomUtil.addClass(this._alts, 'leaflet-control-ocd-search-alternatives-minimized');
			this._selection = null;
			L.DomUtil.removeClass(this._errorElement, 'leaflet-control-ocd-search-error');
		},

		_createAlt: function(result, index) {
			var li = document.createElement('li');
			li.innerHTML = '<a href="#" data-result-index="' + index + '">' +
				(this.options.showResultIcons && result.icon ?
					'<img src="' + result.icon + '"/>' :
					'') +
				result.name + '</a>';
			L.DomEvent.addListener(li, 'click', function clickHandler(e) {
                // CUSTOM line
                L.DomEvent.preventDefault(e);
				this._geocodeResultSelected(result);
			}, this);

			return li;
		},

		_keydown: function(e) {
            
            console.log('key event: ', e);
            
			var _this = this,
				select = function select(dir) {
					if (_this._selection) {
						L.DomUtil.removeClass(_this._selection.firstChild, 'leaflet-control-ocd-search-selected');
						_this._selection = _this._selection[dir > 0 ? 'nextSibling' : 'previousSibling'];
					}

					if (!_this._selection) {
						_this._selection = _this._alts[dir > 0 ? 'firstChild' : 'lastChild'];
					}

					if (_this._selection) {
						L.DomUtil.addClass(_this._selection.firstChild, 'leaflet-control-ocd-search-selected');
					}
				};

			switch (e.keyCode) {
			// Up
			case 38:
				select(-1);
				L.DomEvent.preventDefault(e);
				break;
			// Down
			case 40:
				select(1);
				L.DomEvent.preventDefault(e);
				break;
			// Enter
			case 13:
                L.DomEvent.stopPropagation(e);
                L.DomEvent._fakeStop;
                    
				if (this._selection) {
					var index = parseInt(this._selection.firstChild.getAttribute('data-result-index'), 10);
					this._geocodeResultSelected(this._results[index]);
                    this._clearResults();
					L.DomEvent.preventDefault(e);
				}
                
                /*else {
                    this._geocode;
                    L.DomEvent.preventDefault(e);
                }*/
			}
			return true;
		}
	});

	L.Control.openCageSearch = function(id, options) {
		return new L.Control.OpenCageSearch(id, options);
	};

	L.Control.OpenCageSearch.callbackId = 0;
	L.Control.OpenCageSearch.jsonp = function(url, params, callback, context, jsonpParam) {
		var callbackId = '_ocd_geocoder_' + (L.Control.OpenCageSearch.callbackId++);

		params[jsonpParam || 'callback'] = callbackId;
		window[callbackId] = L.Util.bind(callback, context);
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = url + L.Util.getParamString(params);
		script.id = callbackId;
		document.getElementsByTagName('head')[0].appendChild(script);
	};

	L.Control.OpenCageSearch.Geocoder = L.Class.extend({
		options: {
			serviceUrl: 'https://api.opencagedata.com/geocode/v1/',
			geocodingQueryParams: {},
			reverseQueryParams: {},
			key: '',
			limit: 5
		},

		initialize: function(options) {
			L.Util.setOptions(this, options);
		},

		geocode: function(query, cb, context) {
			L.Control.OpenCageSearch.jsonp(this.options.serviceUrl + 'json/', L.extend({
				q: query,
				limit: this.options.limit,
				key: this.options.key
			}, this.options.geocodingQueryParams),
			function(data) {
				var results = [];
				for (var i=data.results.length - 1; i >= 0; i--) {
					results[i] = {
						name: data.results[i].formatted,
						center: L.latLng(data.results[i].geometry.lat, data.results[i].geometry.lng)
					};
					if (data.results[i].bounds) {
						results[i].bounds = L.latLngBounds(
							[data.results[i].bounds.southwest.lat, data.results[i].bounds.southwest.lng],
							[data.results[i].bounds.northeast.lat, data.results[i].bounds.northeast.lng]);
					}	
				}
				cb.call(context, results);
			}, this, 'jsonp');
		},

		reverse: function(location, scale, cb, context) {
			this.geocode(location, cb, context);
		}
	});

	L.Control.OpenCageSearch.geocoder = function(options) {
		return new L.Control.OpenCageSearch.Geocoder(options);
	};

	return L.Control.OpenCageSearch;
}));
