// Default marker types and classes
var mapMarker = L.DivIcon.extend({
    options: {
        iconSize: [30, 30],
        className: 'map-marker',
        html: '<i class="fa fa-fw"></i>'
    }
});

var genericMarker = new mapMarker({className: 'map-marker marker-color-gray marker-generic'}),
    garbageMarker = new mapMarker({className: 'map-marker marker-garbage'}),
    cleaningMarker = new mapMarker({className: 'map-marker marker-cleaning'}),
    dieoffMarker = new mapMarker({className: 'map-marker marker-dieoff'}),
    sewageMarker = new mapMarker({className: 'map-marker marker-sewage'}),
    floatingMarker = new mapMarker({className: 'map-marker marker-floating'});