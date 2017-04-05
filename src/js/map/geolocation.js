/* HTML Geolocation */
var locating = (function() {
    
    var checkHref = function() {
            if (!tools.coordsinhrf || tools.coordsinhrf == 'undefined') {
                console.log('no coords in href calling locationcontrol.start');
                maps.locationcontrol.start();
            }   
        },
        onLocationFound = function(e) {
            maps.map.setView(e.latlng, 18);
        },
        onLocationError = function(e) {

            alerts.showAlert(16, "warning", 2000);

            if (tools.coordsinhrf) {
                console.log('catching coors in href');
                maps.locationcontrol.stop();
            }
            // Show the world on localization fail
            else {
                maps.locationcontrol.stop();
                maps.map.setView([0, 0], 2);
                // shortcut but ugly:
                // maps.map.fitWorld();
            }
        };

    return {
        checkHref: checkHref,
        onLocationError: onLocationError,
        onLocationFound: onLocationFound
    }
}());