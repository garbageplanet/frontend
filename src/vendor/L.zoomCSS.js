/*!
 * @license
 * Leaflet.ZoomCSS
 * Copyright (c) 2014, Dag Jomar Mersland, dagjomar@gmail.com, @dagjomar
 * https://github.com/dagjomar/Leaflet.ZoomCSS
 */
L.Map.mergeOptions({
  zoomCss: true
});

L.Map.ZoomCSS = L.Handler.extend({
  addHooks: function () {
    this._map.on('zoomend', this._zoomCSS, this);
  },

  removeHooks: function () {
    this._map.off('zoomend', this._zoomCSS, this);
  },

  _zoomCSS: function (e) {

    var map = this._map,
        zoom = map.getZoom(),
        container = map.getContainer();

    container.className = container.className.replace( /z[0-9]{1,2}/g, '' ) + ' z' + zoom;
  }
});

L.Map.addInitHook('addHandler', 'zoomCss', L.Map.ZoomCSS);