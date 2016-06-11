/** L.PanToOffset.Control
* a plugin to pan the map with an offset
* based on the functions by @
* Still in the works 
**/

L.Map = L.Map.extend({
    
    panToOffset: function (map, options) {

        options = L.extend({
            horizontal: true,
            point: [0,0],
        }, options);

        if (!this.options.horizontal) {
            
            var x = this.latLngToContainerPoint(latlng).x - this.map._getVerticalOffset(),

        }


        else {
                
                
        } 
        
        var y = this.latLngToContainerPoint(latlng).y - this.map._getHorizontalOffset();

        this.options.point = this.containerPointToLatLng([x, y]);

        return this.setView(this.options.point, this.map._zoom);

        return this;
    },

    _getVerticalOffset: function (map) {

    var vOffset = 0;

    if (this.innerWidth > 767) { 
        vOffset = - this.height() / 4 + 20; 
    }

    // not needed on mobile
    else {
        vOffset[1] = - this.height() / 4;
    }

    return vOffset;

    },

    _getHorizontalOffset: function (map) {

      var hOffset = [0, 0];
      hOffset[0] = - this.width() / 5;
      return hOffset;
    }

});
})();
