/*!
This file is a stripped-down version of the leaflet locate control plugin which is licensed under the MIT license.
You can find the project at: https://github.com/domoritz/leaflet-locatecontrol. Copyright (c) 2016 Dominik Moritz

*/

function arrayMap(array, cb, context) {
    for (var i = 0, l = array.length; i < l; i++) {
        cb.call(context || null, array[i], i, array);
    }
}
            
(function (factory, window) {
     // see https://github.com/Leaflet/Leaflet/blob/master/PLUGIN-GUIDE.md#module-loaders
     // for details on how to structure a leaflet plugin.

    // define an AMD module that relies on 'leaflet'
    if (typeof define === 'function' && define.amd) {
        define(['leaflet'], factory);

    // define a Common JS module that relies on 'leaflet'
    } else if (typeof exports === 'object') {
        if (typeof window !== 'undefined' && window.L) {
            module.exports = factory(L);
        } else {
            module.exports = factory(require('leaflet'));
        }
    }

    // attach your plugin to the global 'L' variable
    if(typeof window !== 'undefined' && window.L){
        window.L.MarkerMenu = factory(L);
    }
    

    
} (function (L) {
    var MarkerMenu = L.Class.extend({
        includes: L.Mixin.Events,

        options: {
            pane: 'menuPane',
            radius: 100,
            animate: true,
            duration: 200,
            size: [24, 24]
        },
        
        initialize: function (options, source) {
            L.setOptions(this, options);

            this._items = [];

            // DOM Element represents ul
            this._menuList = null; 

            // DOM Elements array represents li's
            this._menuItems = [];

            this._appendItems(this.options.items);

            this._source = source;
            this._isOpened = false;
        },
        
        hide: function () {
                
                this._container.style.display = 'none';
        },

        show: function () {
            
                this._container.style.display = 'block';
        },

        getItems: function () {
            return this._items;
        },

        append: function (items) {
            if (items instanceof L.MarkerMenu) {
                this._appendItems(items.getItems());
            } else {
                this._appendItems(items);
            }
        },

        getLatLng: function () {
            return this._latlng;
        },

        setLatLng: function (latlng) {
            this._latlng = latlng;

            if (this._map) {
                this._updatePosition();
            }

            return this;
        },

        onAdd: function (map) {
            this._map = map;

            if (!this._container) {
                this._initLayout();
                this._updateMenu();
            }

            map.on('zoomstart', this._onZoomStart, this);
            map.on('zoomend', this._onZoomEnd, this);

            this._updatePosition();

            map.getPanes().markerPane.appendChild(this._container);

            if (this._source) {
                this._source.fire('menuopen', {menu: this});
            }
        },

        onRemove: function (map) {
            var that = this;

            this._resetItemsPositions();

            map.off('zoomstart', this._onZoomStart);
            map.off('zoomend', this._onZoomEnd);

            setTimeout(function () {
                that._map = null;

                map.getPanes().markerPane.removeChild(that._container);

                if (that._source) {
                    that._source.fire('menuclose', {menu: that});
                }
            }, this.options.duration);
        },
        
        _onZoomStart: function () {
            this.hide();
        },

        _onZoomEnd: function () {
            this._updatePosition();
            this.show();
        },
        
        _appendItems: function (items) {
            arrayMap(items, function (item) {
                this._items.push(item);
            }, this);

            this._updateMenu();
            this._updatePosition();
        },

        _initLayout: function () {
            var prefix = 'leaflet-marker-menu';
            
            this._container = L.DomUtil.create('div',
                prefix + ' ' + (this.options.className || '') + ' leaflet-zoom-hide');

            this._container.style.zIndex = -1;
            this._container.style.position = 'absolute';
        },

        _updateMenu: function () {
            if (!this._container) {
                return;
            }

            var prefix = 'leaflet-marker-menu-item';

            if (this._menuList) {
                this._container.removeChild(this._menuList);
            }

            this._menuList = L.DomUtil.create('ul', '', this._container);
            this._menuItems = [];

            this._menuList.style.listStyle = 'none';
            this._menuList.style.padding = 0;
            this._menuList.style.margin = 0;
            this._menuList.style.position = 'relative';
            this._menuList.style.width = this.options.size[0] + 'px';
            this._menuList.style.height = this.options.size[1] + 'px';

            arrayMap(this._items, function (item, i, items) {
                var listItem = L.DomUtil.create('li','', this._menuList),
                    menuItem = L.DomUtil.create('a', prefix + ' ' + (this.options.itemClassName || '') +
                        ' ' + (item.className || ''), listItem);

                menuItem.style.width = this.options.size[0] + 'px';
                menuItem.style.height = this.options.size[1] + 'px';
                menuItem.style.display = 'block';
                menuItem.style.cursor = 'pointer';

                menuItem.title = item.title;

                listItem.style.position = 'absolute';
                listItem.style.zIndex = 1000;

                // only css3 for a now needs implementation something like PosAnimation for opacity
                if (this.options.animate) {
                    listItem.style.left = 0;
                    listItem.style.bottom = 0;

                    L.DomUtil.setOpacity(listItem, 0);

                    listItem.style[L.DomUtil.TRANSITION] = 'all ' + (this.options.duration / 1000) + 's';
                }

                L.DomEvent.addListener(menuItem, 'click', item.click, item);
                
                // Make sure we touch the map when we interact with the content
                var stop = L.DomEvent.stopPropagation;
                var fakeStop = L.DomEvent._fakeStop || stop;
                L.DomEvent
                    .on(menuItem, 'contextmenu', stop)
                    .on(menuItem, 'click', fakeStop)
                    .on(menuItem, 'mousedown', stop)
                    .on(menuItem, 'touchstart', stop);

                this._menuItems.push(listItem);
            }, this);

            this._menuItems.reverse();
        },

        _resetItemsPositions: function () {
            arrayMap(this._menuItems, function (item) {
                item.style.left = 0;
                item.style.bottom = 0;

                L.DomUtil.setOpacity(item, 0);
            }, this);
        },

        _updatePosition: function () {
            if (!this._map) {
                return;
            }

            var pos = this._map.latLngToLayerPoint(this._latlng),
                offset = L.point(this.options.offset || [0, 0]),
                container = this._container,
                style = container.style,
                angle = Math.PI / (this._menuItems.length + 1),
                radius = this.options.radius,
                that = this;

            var bottom = this._containerBottom = -offset.y - pos.y;
            var left = this._containerLeft = offset.x + pos.x;

            this._container.style.bottom = (bottom - (this.options.size[1] )) + 'px';
            this._container.style.left = (left - (this.options.size[0] / 2)) + 'px';

            setTimeout(function () {
                arrayMap(that._menuItems, function (item, i) {
                    var itemLeft = (Math.cos(angle * (i + 1)) * radius),
                        itemBottom = (Math.sin(angle * (i + 1)) * radius) ;

                    item.style.left = Math.round(itemLeft) + 'px';
                    item.style.bottom = Math.round(itemBottom) + 'px';

                    L.DomUtil.setOpacity(item, 1);
                }, this);
            }, 0);
        },

        _resetPosition: function () {
            arrayMap(this._menuItems, function (item) {
                item.style.left = 0 + 'px';
                item.style.bottom = 0 + 'px';

                L.DomUtil.setOpacity(item, 0);
            }, this);
        }

    });

    L.markerMenu = function (options, source) {
        return new L.MarkerMenu(options, source);
    };
        
    L.Marker.include({
        openMenu: function () {
            if (!this._menu) {
                return;
            }

            this._menu.setLatLng(this._latlng);
            this._menu._isOpened = true;

            this._map.addLayer(this._menu);
            
            return this;
        },
        
        closeMenu: function () {
            if (!this._menu) {
                return;
            }

            this._map.removeLayer(this._menu);
            this._menu._isOpened = false;
        },
        
        toggleMenu: function () {
            if (!this._menu) {
                return;
            }

            if (this._menu._isOpened) {
                this.closeMenu();
            } else {
                this.openMenu();
            }
        },
        
        getMenu: function () {
            return this._menu;
        },
        
        setMenu: function (options) {
            if (!options instanceof L.MarkerMenu && options.items.length === 0) {
                return;
            }

            var that = this;
            
            if (this._menu) {
                this.removeMenu();
            }

            if (options instanceof L.MarkerMenu) {
                this._menu = options;
            } else {
                this._menu = L.markerMenu(options, this);
            }
            
            this.on('click', this.toggleMenu, this);
            this.on('move', this._moveMenu, this);
            this.on('remove', this.closeMenu, this);
        },

        removeMenu: function () {
            if (!this._menu) {
                return;
            }

            this.off('click', this.toggleMenu);
            this.off('move', this._moveMenu);
            this.off('remove', this.closeMenu);

            this.closeMenu();
            this._menu = null;
        },

        _moveMenu: function (e) {
            if (!this._menu) {
                return;
            }

            this._menu.setLatLng(this._latlng);
        },
    });
    
    return MarkerMenu;
    
}, window));
