// Get new markers if the map moves
map.on('moveend', function(e) {
    var bounds = map.getBounds();
    // console.log("leaflet map bounds object:", bounds);
    //  renamed bounds to currentViewBounds
    currentViewBounds = bounds._northEast.lat + ', ' + bounds._northEast.lng + ', ' + bounds._southWest.lat + ', ' + bounds._southWest.lng;
    // console.log("currentViewBounds:", currentViewBounds);
    loadRemoteGarbageMarkers();
    loadRemoteShapes();
});

// Get markers
// TODO only get marker if the layer is set as visible in leaflet
function loadRemoteGarbageMarkers() {
    console.log('loading markers from db');
    garbageLayerGroup.clearLayers();
    // ajax request
    $.ajax({
        type: api.readTrashWithinBounds.method,
        url: api.readTrashWithinBounds.url(currentViewBounds),
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
                // TODO add hasLayer() logic here to only add absent markers?
                garbageLayerGroup.addLayer(marker);
                map.addLayer(garbageLayerGroup);
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
            console.log('Something went wrong while fetching the data', data);
        }
    });
    var useToken = localStorage["token"] || window.token;
};

//Get shapes
function loadRemoteShapes() {
    console.log('loading remote shapes');
  
    if ( map.hasLayer('pathLayerGroup') || map.hasLayer('areaLayerGroup') ) {
      pathLayerGroup.clearLayers();
      areaLayerGroup.clearLayers();   
    
      var useToken = localStorage["token"] || window.token;
      // TODO Use glome token here?
      $.ajax({
        type: api.readShapesWithinBounds.method,
        url: api.readShapesWithinBounds.url(currentViewBounds),
        headers: {"Authorization": "Bearer " + useToken},
        success: function (data) {
          console.log('shape data', data);

          $(data).each(function(index, obj) {
            console.log("object data", obj);
            if (obj.type === 'polyline') {
                  
              var polylineLayer = new L.Polyline(obj.latlngs,
                {
                  polylineId: obj.id,
                  polylineType: obj.type,
                  polylineAmount: obj.amount,
                  polylineTypes: obj.types,
                  polylineImageUrl: obj.image_url
                  // TODO add the rest of the options
                })
              ;

              switch(obj.amount){
                case 1:
                    polylineLayer.setStyle({color:"green"}); 
                    break;
                case 2:
                    polylineLayer.setStyle({color:"limegreen"}); 
                    break;
                case 3:
                    polylineLayer.setStyle({color:"yellow"}); 
                    break;
                case 4:
                    polylineLayer.setStyle({color:"gold"}); 
                    break;
                case 5:
                    polylineLayer.setStyle({color:"orange"}); 
                    break;
                case 6:
                    polylineLayer.setStyle({color:"orangered"});
                    break;
                case 7:
                    polylineLayer.setStyle({color:"red"});
                    break;
                case 8:
                    polylineLayer.setStyle({color:"darkred"}); 
                    break;
                case 9:
                    polylineLayer.setStyle({color:"purple"}); 
                    break;
                case 10:
                    polylineLayer.setStyle({color:"black"}); 
                    break;
                default:
                    polylineLayer.resetStyle();
                    break;
              };
                            
              pathLayerGroup.addLayer(polylineLayer);
              map.addLayer(pathLayerGroup);
              polylineLayer.on('click', function() {
                  onRemoteShapeClick(polylineLayer);
              });
    
            }
              
            if (obj.type === 'polygon'){
              var polygonLayer = new L.Polygon(obj.latLngs,
                {
                  polygonId: obj.id,
                  polygonType: obj.type
                  // TODO add the rest of the options
                }
              );

              areaLayerGroup.addLayer(areaLayer);
              map.addLayer(areaLayerGroup);
              areaLayer.on('click', function() {
                onRemoteShapeClick(areaLayer);
              });
            }
                
            }
          );        
        },
        error: function (data) {
          console.log('Error getting shape data', data);
        }
      });
  
  }
  
  if ( ! map.hasLayer('pathLayerGroup') || ! map.hasLayer('areaLayerGroup') ) {
    // FIXME this displays too much
    // showAlert("Show other types of layer by selecting them from the menu.", "info", 2000);
    return;
  }
  
};

// Temporary fix for local (unsaved) marker clicked
function onLocalMarkerClick (e) {
    // console.log("local marker clicked");
    bottombar.hide();
    marker = this;
    map.panToOffset(marker._latlng, _getHorizontalOffset());
    console.log("clicked marker id:", marker._leaflet_id );
    marker.on("dragend", function(event){
      var newPos = event.target.getLatLng();
      // console.log("dragged marker id:", event.target._leaflet_id );
      $('.form-garbage .marker-lat').val(newPos.lat);
      $('.form-garbage .marker-lng').val(newPos.lng);
    });

    $('#sidebar').scrollTop =0;
    $('.sidebar-content').hide();
    sidebar.show($("#create-marker-dialog").fadeIn());
};

// onClick behavior for saved markers
function onRemoteMarkerClick (e) {
    console.log("remote marker clicked");
    console.log(e);
    var that = this;
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
        var markerTypes = e.options.mTypes /*|| 'Glass, Glass bottles'*/;
        var markerAmount = e.options.mAmount;
        var markerRawImage = e.options.mImageUrl;

        // Put a placeholder if the media is empty
        if (! markerRawImage ) {
          $('#feature-info').find('.feature-image').attr('src', 'http://placehold.it/160x120');
          $('#feature-info').find('.feature-image-link').attr('href', '');
        };
        console.log("value of rawimage", markerRawImage);
        
        if ( markerRawImage ) {
          // Add an IMGUR api character to the url to fetch thumbnails to save bandwith
          String.prototype.insert = function (index, string) {
              if (index > 0)
                  return this.substring(0, index) + string + this.substring(index, this.length);
              else
              return string + this;
              };
          markerImage = markerRawImage.insert(26, "t");
          console.log("value of parsed image", markerImage);
          $('#feature-info').find('.feature-image').attr('src', markerImage);
          $('#feature-info').find('.feature-image-link').attr('href', markerRawImage);
        };

        var markerId = e.options.mId;

        $('#feature-info').find('.feature-info-garbage-type').html(markerTypes.join(", "));

        $('#feature-info').find('.btn-delete').click(function (e) {
            //debugger;
            console.log('trigger delete on id', markerId);
            e.preventDefault();
            var useToken = localStorage["token"] || window.token;
            $.ajax({
                type: api.deleteTrash.method,
                url: api.deleteTrash.url(markerId),
                headers: {"Authorization": "Bearer " + useToken},
                success: function(response) {
                    bottombar.hide();
                    loadRemoteGarbageMarkers();
                    showAlert("Marker deleted successfully!", "success", 1500);
                },
                error: function(response) {
                    showAlert("Failed to remove this marker.", "warning", 2000);
                }
            });
        });
      
        $('#feature-info').find('.btn-edit').click(function (e) {
            //debugger;
            console.log('show data on id', markerId);
                    
            e.preventDefault();
            // TODO load the marker data into the form

        });
      
        // amount mapping
        switch(markerAmount) {
            case 0:
                $('#feature-info').find('.feature-info-garbage-amount').html('Are you sure about that?');
                break;
            case 1:
                $('#feature-info').find('.feature-info-garbage-amount').html('You are seeing ghosts');
                break;
            case 2:
                $('#feature-info').find('.feature-info-garbage-amount').html('Here and there');
                break;
            case 3:
                $('#feature-info').find('.feature-info-garbage-amount').html('Quite some');
                break;
            case 4:
                $('#feature-info').find('.feature-info-garbage-amount').html('Already too much');
                break;
            case 5:
                $('#feature-info').find('.feature-info-garbage-amount').html('What happened here?');
                break;
            case 6:
                $('#feature-info').find('.feature-info-garbage-amount').html('This is getting out of hand');
                break;
            case 7:
                $('#feature-info').find('.feature-info-garbage-amount').html('Dude...');
                break;
            case 8:
                $('#feature-info').find('.feature-info-garbage-amount').html('What the what?');
                break;
            case 9:
                $('#feature-info').find('.feature-info-garbage-amount').html('Cant touch this');
                break;
            case 10:
                $('#feature-info').find('.feature-info-garbage-amount').html('Oh my God Becky, look at...');
                break;
            default:
                $('#feature-info').find('.feature-info-garbage-amount').html('Undefined');
                break;

            // do for the rest of values
        };

    } 
  
    if ( $(marker._icon).hasClass('marker-cleaning') ) {
        bottombar.hide();
        $('.sidebar-content').hide();
        sidebar.show($("#cleaning-info").fadeIn())
    };
};

// TODO onClick behavior for saved shapes
// TODO can we move all this logic in a single function for all features?
function onRemoteShapeClick (e) {                          
    console.log("remote shape clicked");
    console.log(e);
    console.log(e.options.latLngs)
    sidebar.hide();
    var that = this;
    map.panToOffset(e.getCenter(), _getVerticalOffset());
    //clear the data in the bottom panel
    $("#feature-info-garbage-type").empty();
    $("#feature-info-garbage-amount").empty();
    $("#feature-info-image").attr("src", "");
    $("#feature-info").find('.feature-image-link').attr("href", "");
    bottombar.show();

    if ( e.option.polylineType === 'polyline'){
      map.fitBounds(e.layer.getBounds(), {paddingBottomRight: [0,200]});
      // inject info for the polyline
      var shapeType = e.options.polylineType;
      var shapeTypes = e.options.polylineTypes;
      var shapeAmount = e.options.polylineAmount;
      var shapeRawImage = e.options.polylineImageUrl;
      var shapeLatLngs =e.options.polylineLatLngs;
      var shapeId = e.options.polylineId;
    }
  
    if ( e.option.polylineType === 'polygon'){
      map.fitBounds(e.layer.getBounds());
      // inject info for the polygon
      var shapeType = e.options.polygonType
      var shapeTypes = e.options.polygonTypes;
      var shapeAmount = e.options.polygonAmount;
      var shapeRawImage = e.options.polygonImageUrl;
      var shapeLatLngs =e.options.polygonLatLngs;
      var shapeId = e.options.polygonId;
    }

    // Put a placeholder if the media is empty
    if (! shapeRawImage ) {
      $('#feature-info').find('.feature-image').attr('src', 'http://placehold.it/160x120');
      $('#feature-info').find('.feature-image-link').attr('href', '');
    };

    if ( shapeRawImage ) {
      
      // Add an IMGUR api character to the url to fetch thumbnails to save bandwith
      String.prototype.insert = function (index, string) {
        
          if (index > 0)
              return this.substring(0, index) + string + this.substring(index, this.length);
          else
          return string + this;
          };
      
      shapeImage = shapeImage.insert(26, "t");
      
      $('#feature-info').find('.feature-image').attr('src', shapeImage);
      $('#feature-info').find('.feature-image-link').attr('href', shapeRawImage);
      
    };

    $('#feature-info').find('.feature-info-garbage-type').html(shapeTypes);
  
    $('#feature-info').find('.btn-delete').click(function (e) {
        
        e.preventDefault();
        var useToken = localStorage["token"] || window.token;
      
        $.ajax({
            type: api.deleteShape.method,
            url: api.deleteShape.url(markerId),
            headers: {"Authorization": "Bearer " + useToken},
            success: function(response) {
                bottombar.hide();
                loadRemoteShapes();
                showAlert("Feature deleted successfully.", "success", 1500);
            },
            error: function(response) {
                showAlert("Failed to delete this feature.", "warning", 2000);
            }
        });
    });

    $('#feature-info').find('.btn-edit').click(function (e) {
        //debugger;
        console.log('show data on id', shapeId);
        e.preventDefault();
        // TODO load the marker data into the form

    });

    // amount mapping
    switch(shapeAmount) {
        case 0:
            $('#feature-info').find('.feature-info-garbage-amount').html('Are you sure about that?');
            break;
        case 1:
            $('#feature-info').find('.feature-info-garbage-amount').html('You are seeing ghosts');
            break;
        case 2:
            $('#feature-info').find('.feature-info-garbage-amount').html('Here and there');
            break;
        case 3:
            $('#feature-info').find('.feature-info-garbage-amount').html('Quite some');
            break;
        case 4:
            $('#feature-info').find('.feature-info-garbage-amount').html('Already too much');
            break;
        case 5:
            $('#feature-info').find('.feature-info-garbage-amount').html('What happened here?');
            break;
        case 6:
            $('#feature-info').find('.feature-info-garbage-amount').html('This is getting out of hand');
            break;
        case 7:
            $('#feature-info').find('.feature-info-garbage-amount').html('Dude...');
            break;
        case 8:
            $('#feature-info').find('.feature-info-garbage-amount').html('What the what?');
            break;
        case 9:
            $('#feature-info').find('.feature-info-garbage-amount').html('Cant touch this');
            break;
        case 10:
            $('#feature-info').find('.feature-info-garbage-amount').html('Oh my God Becky, lok at...');
            break;
        default:
            $('#feature-info').find('.feature-info-garbage-amount').html('Undefined');
            break;
    };

};