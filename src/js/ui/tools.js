var tools = {
    
    // Set the color class of the marker given the amount of trash
    setMarkerClassColor: function(c) {

        return c === 1  ? 'marker-color-limegreen'  :
               c === 2  ? 'marker-color-yellow'     :
               c === 3  ? 'marker-color-orangered'  :
               c === 4  ? 'marker-color-red'        :
                          'marker-color-violet'     ;
    },

    // Set the full text for todo values in the feature description
    // TODO smarter way to do this, also for types
    setTodoFullText: function(t) {

        return t == 1  ? ' it has been cleaned up already'  :
               t == 2  ? ' need help to clean it up'        :
               t == 3  ? ' full bags need to be collected'  :
               t == 4  ? ' a cleaning needs to be organized':
                         ' tell the local authorities'      ;
    },

    // Set the color of the polyline given the amount of trash
    setPolylineColor: function(c) {

        return c === 1  ? '#ccff66' :
               c === 2  ? '#ffff00' :
               c === 3  ? '#FF4500' :
               c === 4  ? '#ff1a1a' :
                          '#e60073' ;
    },
    
    getCurrentBounds: function() {
        var currentViewBounds = map.getBounds().toBBoxString();
        return currentViewBounds;
    }
    
};

// Easily add ellipses to long strings credit: http://stackoverflow.com/questions/1199352/smart-way-to-shorten-long-strings-with-javascript/1199420#1199420
String.prototype.ellipsis = function(n){
          return this.substr(0,n-1)+(this.length>n?'&hellip;':'');
};