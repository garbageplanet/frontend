// Default behaviour for creating a marker
map.on('click', onMapClick);

// Format latlng for UI display by kirilloid@stackoverflow
truncateDecimals = function (number, digits) {
    var multiplier = Math.pow(10, digits),
        adjustedNum = number * multiplier,
        truncatedNum = Math[adjustedNum < 0 ? 'ceil' : 'floor'](adjustedNum);
    return truncatedNum / multiplier;
};

function onMapClick(e) {
    marker = L.marker(e.latlng, {icon:genericMarker})
        marker.on('click', onMarkerClick);
        map.panTo(e.latlng);
        $currentLatitude = e.latlng.lat.toString();
        $currentLongitude = e.latlng.lng.toString();
        $currentLatitudeTruncated = truncateDecimals($currentLatitude,2);
        $currentLongitudeTruncated = truncateDecimals($currentLongitude,2);
         if ($currentLatitudeTruncated > 0) {
                $('#set-current-location span:nth-child(3)').text("N");
                } else {
                $('#set-current-location span:nth-child(3)').text("S");
            };
         if ($currentLongitudeTruncated > 0) {
                $('#set-current-location span:nth-child(5)').text("E");
                } else {
                $('#set-current-location span:nth-child(5)').text("W");
            };
        $absCurrentLatitudeTruncated = Math.abs($currentLatitudeTruncated);
        $absCurrentLongitudeTruncated = Math.abs($currentLongitudeTruncated);
        $('#set-current-location span:nth-child(2)').html($absCurrentLatitudeTruncated);
        $('#set-current-location span:nth-child(4)').html($absCurrentLongitudeTruncated);
        $('#create-garbage-form .l-lat').val(e.latlng.lat);
        $('#create-garbage-form .l-lng').val(e.latlng.lng);
        $('#activate-tile-dialog .tile-center-lat').html(e.latlng.lat);
        $('#activate-tile-dialog .tile-center-lng').html(e.latlng.lng);
    
        // Get nearby location with overpass api

        var nearbyPlace = new L.OverPassLayer({
            query: "node(BBOX)['place'='city'];out;",
            // TODO fix this - the script stops here so there's a problem below
            callback: function(data) {
                for(var i=0;i<data.elements.length;i++) {
                var e2 = data.elements[0];
                var e3 = e2.tags.name;
                var nearestPlace = e3.toString();
                $('#set-current-location span:nth-child(6)').html($nearestPlace);
                }
             },
           }
        );
        // Hide the sidebar content and show it with the marker dialog
        // $('.panel-collapse').collapse('hide'); THIS MESSES UP THE ACCORDION
        $('.sidebar-content').hide();
        $('#sidebar').scrollTop = 0;
        sidebar.show($("#create-marker-dialog").fadeIn('fast'));
    map.addLayer(marker);
};