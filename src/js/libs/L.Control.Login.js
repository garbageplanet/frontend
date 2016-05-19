/*!
Copyright (c) 2016 Dominik Moritz

This file is part of the leaflet locate control. It is licensed under the MIT license.
You can find the project at: https://github.com/domoritz/leaflet-locatecontrol
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

    // attach your plugin to the global 'L' variable
    if(typeof window !== 'undefined' && window.L){
        window.L.Control.Login = factory(L);
    }
} (function (L) {
    var LoginControl = L.Control.extend({
        options: {
            position: 'topleft',
            icon: 'fa fa-2x fa-user-secret',
            iconElementTag: 'span',
            title: 'One-click anonyous login'
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
                'leaflet-control-login leaflet-bar leaflet-control');

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

            this._resetVariables();

            return container;
        },

        /**
         * This method is called when the user clicks on the control.
         */
        _onClick: function() {

            glomego();
            this._active = true;
            this._updateContainerStyle();
        },
        
        updateContainerStyle: function() {
            
            if (!this._container) {
                return;
            }

            if (this._active && !this._event) {
                this._setClasses('loggedin');
                
            } else if (this._active) {
                this._setClasses('loggedout');
                
            } else {
                this._cleanClasses();
            }
        },

        /**
         * Sets the CSS classes for the state.
         */
        _setClasses: function(state) {
            if (state == 'loggedout') {
                L.DomUtil.removeClasses(this._container, "logged-in");
                L.DomUtil.addClasses(this._container, "logged-out");
                
            } else if (state == 'loggedin') {
                L.DomUtil.removeClasses(this._container, "logged-out");
                L.DomUtil.addClasses(this._container, "logged-in");

            }
        },

        /**
         * Removes all classes from button.
         */
        _cleanClasses: function() {
            L.DomUtil.removeClass(this._container, "logged-in");
        },

        /**
         * Reinitializes state variables.
         */
        _resetVariables: function() {
            // whether user is actively logged in or not
            this._active = false;

        }
    });

    L.control.login = function (options) {
        return new L.Control.Login(options);
    };

    (function(){
      // leaflet.js raises bug when trying to addClass / removeClass multiple classes at once
      // Let's create a wrapper on it which fixes it.
      var LDomUtilApplyClassesMethod = function(method, element, classNames) {
        classNames = classNames.split(' ');
        classNames.forEach(function(className) {
            L.DomUtil[method].call(this, element, className);
        });
      };

      L.DomUtil.addClasses = function(el, names) { LDomUtilApplyClassesMethod('addClass', el, names); };
      L.DomUtil.removeClasses = function(el, names) { LDomUtilApplyClassesMethod('removeClass', el, names); };
    })();

    return LoginControl;
}, window));
