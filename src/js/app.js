Vue.config.debug = true
// vue instance

var vm = new Vue({
    el: '#app',
    data: {
        newMarkerLat: '',
        newMarkerLng: '',
        addMarker: false,
        markers: '',
        userIsLoggedIn: false,
    },
    ready: function() {
        this.getMarkers();
        map.on('click', this.addNewMarkerPosition);
    },
    methods: {
        createMarker: function(e) {
            var marker = L.marker([this.newMarkerLat, this.newMarkerLng]).addTo(map);
            this.markers.push({ 'lat':this.newMarkerLat, 'lng':this.newMarkerLng});
            this.emptyNewMarker();
        },

        emptyNewMarker: function() {
            this.newMarkerLat = '';
            this.newMarkerLng = '';
            this.addMarker = false;
        },

        renderMarkers: function() {
            this.markers.forEach(function(m) {
                var marker = L.marker([m.lat, m.lng]).addTo(map);
            });
        },

        addNewMarkerPosition: function(e) {
            this.newMarkerLat = e.latlng.lat;
            this.newMarkerLng = e.latlng.lng;
            this.addMarker = true;
        },

        getMarkers: function() {
            // GET request
            this.$http.get('http://api.garbagepla.net/api/trashes', function (data, status, request) {
                // set data on vm
                this.markers = data;
                this.renderMarkers();
            }).error(function (data, status, request) {
                console.log(status);
            })
        },
        login: function() {
            this.userIsLoggedIn = true;
        },
        logout: function() {
            this.userIsLoggedIn = false;
        },
    }
});