/*!
* L.Control.Menu - a leaflet plugin for displaying a menu button on the amp
* This file is based on the Leaflet-locate control plugin which is licensed under the MIT license.
* https://github.com/domoritz/leaflet-locatecontrol. Copyright (c) 2016 Dominik Moritz
* Author: adriennn
*/
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
    // attach the plugin to the global 'L' variable
    if(typeof window !== 'undefined' && window.L){
        window.L.Control.Menu = factory(L);
    }
}

(function (L) {
    var MenuControl = L.Control.extend({
        options: {
            position: 'topleft',
            icon: 'fa fa-2x fa-bars',
            iconElementTag: 'span',
            title: 'Show the menu'
        },

        initialize: function (options) {
            // set default options if nothing is set (merge one step deep)
            for (var i in options) {
                if (typeof this.options[i] === 'object') {
                    L.extend(this.options[i], options[i]);
                } else {
                    this.options[i] = options[i];
                }
            }
        },

        /**
         * Add control to map. Returns the container for the control.
         */
        onAdd: function (map) {
            var container = L.DomUtil.create('div',
                'leaflet-control-menu leaflet-bar leaflet-control');

            this._event = undefined;

            this._link = L.DomUtil.create('a', 'leaflet-bar-part leaflet-bar-part-single', container);
            this._link.href = '#';
            this._link.title = this.options.title;
            this._icon = L.DomUtil.create(this.options.iconElementTag, this.options.icon, this._link);

            L.DomEvent
                .on(this._link, 'click', L.DomEvent.stopPropagation)
                .on(this._link, 'click', L.DomEvent.preventDefault)
                .on(this._link, 'click', this._onClick, this)
                .on(this._link, 'dblclick', L.DomEvent.stopPropagation);

            return container;
        },

        _onClick: function () {
            // We pass a null obj to the templates for now
            var nullobj = {};
            ui.sidebar.setContent( tmpl('tmpl-mobile-menu', nullobj) );
            ui.sidebar.show();
        },
    });

    L.control.menu = function (options) {
        return new L.Control.Menu(options);
    };

    return MenuControl;
}, window));
