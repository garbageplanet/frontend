//Get markers
console.log('zoom is larger than 14');
loadRemoteGarbageMarkers();

function loadRemoteGarbageMarkers() {
    console.log('loadremotegarbagemarkers');
    garbageLayer.clearLayers();
    var bounds = map.getBounds();
    console.log(bounds);
    bounds = bounds._northEast.lat + ', ' + bounds._northEast.lng + ', ' + bounds._southWest.lat + ', ' + bounds._southWest.lng;

    // ajax request
    $.ajax({
        type: "GET",
        url: "http://api.garbagepla.net/api/trashes/withinbounds?bounds=" + bounds,
        success: function(data) {

               $(data).each(function(index, obj) {
                console.log(obj);
                var marker = new L.Marker(new L.LatLng(obj.lat, obj.lng),
                    {
                        icon:garbageMarker,
                        mId: obj.id,
                        mAmount: obj.amount,
                        mTypes: obj.types,
                        mImageUrl: obj.image_url
                    });
                garbageLayer.addLayer(marker);
                map.addLayer(garbageLayer);
                marker.on('click', function() {
                    console.log("clicked");
                    onMarkerClick(marker);
                });

                switch(obj.amount){
                    case 0:
                    $(marker._icon).addClass('marker-color-green');
                    break;
                case 1:
                    $(marker._icon).addClass('marker-color-blue');
                    break;
                case 2:
                    $(marker._icon).addClass('marker-color-yellow');
                    break;
                case 3:
                    $(marker._icon).addClass('marker-color-orange');
                    break;
                case 4:
                    $(marker._icon).addClass('marker-color-red');

                    break;
                }
            });
        },
        error: function(data) {
            console.log('Something went wrong when fetching remote data', data);
        }
    });
    var useToken = localStorage["token"] || window.token;
    $.ajax({
        url: 'http://api.garbagepla.net/api/monitoringtiles',
        headers: {"Authorization": "Bearer " + useToken},
        method: 'get',
        success: function (data) {
            console.log('data------tiles', data);
            for (var i = 0; i < data.length; i++) {
                var top_right = [Number(data[i].ne_lat), Number(data[i].ne_lng)];
                var bottom_left = [Number(data[i].sw_lat), Number(data[i].sw_lng)];
                var rectangleBounds = [bottom_left, top_right];
                console.log('rectangleBounds', rectangleBounds);
                var rectangle = L.rectangle(rectangleBounds);
                rectangle.addTo(map);
            };
        },
        error: function (err) {
            console.log('tiles get err', err);
        }
    })
};

// onClick behaviours for default and saved markers
// TODO the elements linger in the DOM and clicking on one marker
// might open the dialog from a previously clicked element
function onMarkerClick (marker) {
    console.log("marker clicked");
    console.log(marker);
    var that = this;
    //some html mod stuff...
    if ($(marker._icon).hasClass('marker-generic')){
        $('#sidebar').scrollTop =0;
        $('.sidebar-content').hide();
        sidebar.show($("#create-marker-dialog").fadeIn());
    } else if ($(marker._icon).hasClass('marker-garbage')){
        // $('.sidebar-content').hide();
        $('#feature-details-lead span:nth-child(1)').text('garbage');
        // sidebar.show($("#marker-info").fadeIn('slow'))
        $('#marker-info').modal({backdrop: true});
        // start to inject info
        var markerType = marker.options.mTypes || 'Glass, Glass bottles';
        var markerAmount = marker.options.mAmount;
        var markerRawImage = marker.options.mImageUrl;

        // Add an IMGUR api character to the url to fetch thumbnails
        /*String.prototype.insert = function (index, string) {
            if (index > 0)
                return this.substring(0, index) + string + this.substring(index, this.length);
            else
            return string + this;
            };

        //markerImage = markerRawImage.insert(26, "t"); */

        var markerId = marker.options.mId;

        $('#marker-info').find('.l-marker-type').html(markerType);
        $('#marker-info').find('.l-marker-image').attr('src',markerRawImage);
        $('#marker-info').find('.delete-marker-id').click(function (e) {
            console.log('trigger delete on id', markerId);
            e.preventDefault();
            var useToken = localStorage["token"] || window.token;
            $.ajax({
                type: "DELETE",
                headers: {"Authorization": "Bearer " + useToken},
                url: "http://api.garbagepla.net/api/trashes/" + markerId,
                success: function(response) {
                    //$('#marker-info').find('.fa-times').trigger('click');
                    $('#marker-info').modal('hide');
                    loadRemoteGarbageMarkers();
                    alert('Marker successfully deleted!');
                    console.log('Marker successfully deleted', response);
                },
                error: function(response) {
                    //alert('failed to remove the marker');
                }
            });
        })
        // amount mapping
        switch(markerAmount) {
            case 0:
                $('#marker-info').find('.l-marker-amount').html('Here and There');
                break;
            case 1:
                $('#marker-info').find('.l-marker-amount').html('A little too much');
                break;
            case 2:
                $('#marker-info').find('.l-marker-amount').html('A whole lot');
                break;
            case 3:
                $('#marker-info').find('.l-marker-amount').html('Industrial quantities');
                break;
            case 4:
                $('#marker-info').find('.l-marker-amount').html('Nightmare');
                break;
            default:
                $('#marker-info').find('.l-marker-amount').html('Unknown');
                break;
        };
        
        //insert the data in the modal
        $("#marker-info-trash-type").empty();
        $("#marker-info-trash-type").append(marker.options.mTypes);
        $("#marker-info-trash-amount").empty();
        $("#marker-info-trash-amount").append(marker.options.mAmount);
        $("#marker-info-image").attr("src", "");
        $("#marker-info-image").attr("src",marker.options.mImageUrl);
        
    } else if ($(marker._icon).hasClass('marker-cleaning')){
        $('.sidebar-content').hide();
        sidebar.show($("#cleaning-info").fadeIn())
    };


}
