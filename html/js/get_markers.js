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
                        mImageUrl: obj.image_url,
                        mLat: obj.lat,
                        mLng: obj.lng
                    });
                garbageLayer.addLayer(marker);
                map.addLayer(garbageLayer);
                marker.on('click', function() {
                    onRemoteMarkerClick(marker);
                });

                switch(obj.amount){
                    
                case 0:
                    $(marker._icon).addClass('marker-color-darkgreen');
                    break;   
                case 1:
                    $(marker._icon).addClass('marker-color-green');
                    break;
                case 2:
                    $(marker._icon).addClass('marker-color-limegreen');
                    break;
                case 3:
                    $(marker._icon).addClass('marker-color-yellow');
                    break;
                case 4:
                    $(marker._icon).addClass('marker-color-gold');
                    break;
                case 5:
                    $(marker._icon).addClass('marker-color-orange');
                    break;
                case 6:
                    $(marker._icon).addClass('marker-color-orangered');
                    break;
                case 7:
                    $(marker._icon).addClass('marker-color-red');
                    break;
                case 8:
                    $(marker._icon).addClass('marker-color-darkred');
                    break;
                case 9:
                    $(marker._icon).addClass('marker-color-purple');
                    break;
                case 10:
                    $(marker._icon).addClass('marker-color-black');
                    break;
                default:
                    $(marker._icon).addClass('marker-color-unknown');
                    break;
                }
            });
        },
        error: function(data) {
            console.log('Something went wrong while fetching remote data', data);
        }
    });
    var useToken = localStorage["token"] || window.token;
    $.ajax({
        url: 'http://api.garbagepla.net/api/monitoringtiles',
        headers: {"Authorization": "Bearer " + useToken},
        method: 'GET',
        success: function (data) {
            console.log('data------tiles', data);
            for (var i = 0; i < data.length; i++) {
                var top_right = [Number(data[i].ne_lat), Number(data[i].ne_lng)];
                var bottom_left = [Number(data[i].sw_lat), Number(data[i].sw_lng)];
                var rectangleBounds = [bottom_left, top_right];
                console.log('rectangle bounds', rectangleBounds);
                var rectangle = L.rectangle(rectangleBounds);
                rectangle.addTo(map);
            };
        },
        error: function (err) {
            console.log('tiles get err', err);
        }
    })
};

// Temporary fix for local (unsaved) marker clicked
function onLocalMarkerClick (e) {
    console.log("local marker clicked");
    bottombar.hide();
    marker = this;
    debugger;
    map.panToOffset(marker._latlng, _getHorizontalOffset());
    // debugger;
    console.log("clicked marker id:", marker._leaflet_id );
    // debugger;
    marker.on("dragend", function(event){
      var newPos = event.target.getLatLng();
      console.log("dragged marker id:", event.target._leaflet_id );
    // debugger;
      $('.form-garbage .marker-lat').val(newPos.lat);
      $('.form-garbage .marker-lng').val(newPos.lng);
    // debugger;
    });
  
    $('#sidebar').scrollTop =0;
    $('.sidebar-content').hide();
    sidebar.show($("#create-marker-dialog").fadeIn());
};

// onClick behaviours for saved markers
function onRemoteMarkerClick (e) {
    console.log("remote marker clicked");
    console.log(e);
    var that = this;
    debugger;
    map.panToOffset([e.options.mLat, e.options.mLng], _getVerticalOffset());
  
    if ($(e._icon).hasClass('marker-garbage')){
        sidebar.hide();
        //clear the data in the bottom panel
        $("#feature-info-garbage-type").empty();
        $("#feature-info-garbage-amount").empty();
        $("#feature-info-image").attr("src", "");
        $("#feature-info").find('.feature-image-link').attr("href", "");

        bottombar.show();
        // start to inject info
        var markerType = e.options.mTypes || 'Glass, Glass bottles';
        var markerAmount = e.options.mAmount;
        var markerRawImage = e.options.mImageUrl;

        // Add an IMGUR api character to the url to fetch thumbnails to save bandwith
        String.prototype.insert = function (index, string) {
            if (index > 0)
                return this.substring(0, index) + string + this.substring(index, this.length);
            else
            return string + this;
            };

        markerImage = markerRawImage.insert(26, "t");
        
        // TODO put a placeholder if the media is empty?
        // FIXME marker without media display a broken image icon
        /*if (markerRawImage.val().length() == null ) {
           $('#feature-info').find('.feature-image').attr('src', 'http://placehold.it/160x120');
        };*/
      
        var markerId = e.options.mId;

        $('#feature-info').find('.feature-info-garbage-type').html(markerType);
        $('#feature-info').find('.feature-image').attr('src', markerImage);
        $('#feature-info').find('.feature-image-link').attr('href', markerRawImage);
      
        $('#feature-info').find('.btn-delete-marker').click(function (e) {
          debugger;
            console.log('trigger delete on id', markerId);
            e.preventDefault();
            var useToken = localStorage["token"] || window.token;
            $.ajax({
                type: "DELETE",
                headers: {"Authorization": "Bearer " + useToken},
                url: "http://api.garbagepla.net/api/trashes/" + markerId,
                success: function(response) {
                    bottombar.hide();
                    loadRemoteGarbageMarkers();
                    alert('Marker successfully deleted!');
                    console.log('Marker successfully deleted', response);
                },
                error: function(response) {
                    alert('You cannot remove this marker');
                }
            });
        })
        // amount mapping
        switch(markerAmount) {
            
            case 1:
                $('#feature-info').find('.feature-info-garbage-amount').html('You are seeing ghosts');
                break;
            case 2:
                $('#feature-info').find('.feature-info-garbage-amount').html('Here and there');
                break;
            case 3:
                $('#feature-info').find('.feature-info-garbage-amount').html('Quite');
                break;
            case 4:
                $('#feature-info').find('.feature-info-garbage-amount').html('Too much');
                break;
            default:
                $('#feature-info').find('.feature-info-garbage-amount').html('Undefined');
                break;
            
            // do for the rest of values
        };
        
    } else if ($(marker._icon).hasClass('marker-cleaning')){
        bottombar.hide();
        $('.sidebar-content').hide();
        sidebar.show($("#cleaning-info").fadeIn())
    };


};