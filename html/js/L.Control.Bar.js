/*
 License: MIT, see the first link below for full license
 Authored by Turbo87 https://github.com/Turbo87/leaflet-sidebar
 Modified June 2015 by filipzava https://github.com/filipzava/leaflet-control-bar
 Modified January 2016 by adriennn https://github.com/adriennn/leaflet-control-bottom-bar
 */

L.Control.Bar = L.Control.extend({

    includes: L.Mixin.Events,

    options: {
        position: 'bottom',
        visible: 'true',
	    autoPan: true,
    },

    initialize: function (placeholder, options) {
        L.setOptions(this, options);

        // Find content container
        var content = this._contentContainer = L.DomUtil.get(placeholder);

        // Remove the content container from its original parent
        content.parentNode.removeChild(content);

        var visibileClass = (this.options.visible) ? 'visible' : '';


        // Create bar container
        var container = this._container =
            L.DomUtil.create('div', 'leaflet-control-bar-'+this.options.position+' leaflet-control-bar ' + visibileClass);

        // Style and attach content container
        L.DomUtil.addClass(content,'leaflet-control');
        container.appendChild(content);

    },

    addTo: function (map) {
        var container = this._container;
        var content = this._contentContainer;

        L.DomEvent
            .on(container, 'transitionend',
            this._handleTransitionEvent, this)
            .on(container, 'webkitTransitionEnd',
            this._handleTransitionEvent, this);

        var controlContainer = map._controlContainer;
        controlContainer.insertBefore(container, controlContainer.firstChild);

        this._map = map;

        // Make sure we don't drag the map when we interact with the content
        var stop = L.DomEvent.stopPropagation;
        var fakeStop = L.DomEvent._fakeStop || stop;
        L.DomEvent
            .on(content, 'contextmenu', stop)
            .on(content, 'click', fakeStop)
            .on(content, 'mousedown', stop)
            .on(content, 'touchstart', stop)
            .on(content, 'dblclick', fakeStop)
            .on(content, 'mousewheel', stop)
            .on(content, 'MozMousePixelScroll', stop);

        return this;
    },

    removeFrom: function (map) {
        //if the control is visible, hide it before removing it.
        this.hide();

        var content = this._contentContainer;

        // Remove bar container from controls container
        var controlContainer = map._controlContainer;
        controlContainer.removeChild(this._container);

        //disassociate the map object
        this._map = null;

        // Unregister events to prevent memory leak
        var stop = L.DomEvent.stopPropagation;
        var fakeStop = L.DomEvent._fakeStop || stop;
        L.DomEvent
            .off(content, 'contextmenu', stop)
            .off(content, 'click', fakeStop)
            .off(content, 'mousedown', stop)
            .off(content, 'touchstart', stop)
            .off(content, 'dblclick', fakeStop)
            .off(content, 'mousewheel', stop)
            .off(content, 'MozMousePixelScroll', stop);

        L.DomEvent
            .off(container, 'transitionend',
            this._handleTransitionEvent, this)
            .off(container, 'webkitTransitionEnd',
            this._handleTransitionEvent, this);


        return this;
    },

    isVisible: function () {
        return L.DomUtil.hasClass(this._container, 'visible');
    },

    show: function () {
        if (!this.isVisible()) {
            L.DomUtil.addClass(this._container, 'visible');
	    if (this.options.autoPan) {
                this._map.panBy([0, -this.getOffset() / 2], {
                    duration: 0.5
                });
            }
            this.fire('show');
        }
    },

    hide: function (e) {
        if (this.isVisible()) {
            L.DomUtil.removeClass(this._container, 'visible');
	    if (this.options.autoPan) {
                this._map.panBy([0, this.getOffset() / 2], {
                    duration: 0.5
                });
            }
            this.fire('hide');
        }
        if(e) {
            L.DomEvent.stopPropagation(e);
        }
    },

    toggle: function () {
        if (this.isVisible()) {
            this.hide();
        } else {
            this.show();
        }
    },

    getContainer: function () {
        return this._contentContainer;
    },

    setContent: function (content) {
        this.getContainer().innerHTML = content;
        return this;
    },
  
    getOffset: function () {
        if (this.options.position === 'right') {
            return this._container.offsetHeight;
        } else {
            return -this._container.offsetHeight;
        }
    },

    _handleTransitionEvent: function (e) {
        if (e.propertyName == 'bottom' || e.propertyName == 'top')
            this.fire(this.isVisible() ? 'shown' : 'hidden');
    }
});

L.control.bar = function (placeholder, options) {
    return new L.Control.Bar(placeholder, options);
};
