// Get new markers if the map moves
map.on('moveend', function(e) {
    var bounds = map.getBounds();
    // console.log("leaflet map bounds object:", bounds);
    //  renamed bounds to currentViewBounds
    currentViewBounds = bounds._northEast.lat + ', ' + bounds._northEast.lng + ', ' + bounds._southWest.lat + ', ' + bounds._southWest.lng;
    // console.log("currentViewBounds:", currentViewBounds);
  
    if ( mapZoom >= 10 ){
      console.log("mapZoom value from get feature.js",mapZoom)
      // TODO call the functions only if map.hasLayer(...)
      loadGarbageMarkers();
      loadCleaningMarkers();
      loadLitters();
    }
    
    if ( mapZoom >= 7 && mapZoom <=15 ){
      // loadAreas();  
    }
});

// Get garbage
function loadGarbageMarkers() {
    console.log('loading garbage markers from db');
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
                        Id: obj.id,
                        Amount: obj.amount,
                        Types: obj.types,
                        ImageUrl: obj.image_url,
                        Lat: obj.lat,
                        Lng: obj.lng,
                        Type: obj.type
                        // TODO add the rest of the vars
                    });
                // TODO add hasLayer() logic here to only add absent markers?
                garbageLayerGroup.addLayer(marker);
                map.addLayer(garbageLayerGroup);
                marker.on('click', function() {
                    onGarbageMarkerClick(marker);
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
    var useToken = localStorage["token"] || window.token || userAuth.name;
};

// Get cleanings
function loadCleaningMarkers() {
    console.log('loading cleaning markers from db');
    cleaningLayerGroup.clearLayers();
    // ajax request
    $.ajax({
        type: api.readCleaningWithinBounds.method,
        url: api.readCleaningWithinBounds.url(currentViewBounds),
        success: function(data) {
            $(data).each(function(index, obj) {
                console.log(obj);
              
                var marker = new L.Marker(new L.LatLng(obj.lat, obj.lng),
                    {
                        icon:cleaningMarker,
                        Id: obj.id,
                        Date: obj.date,
                        Lat: obj.lat,
                        Lng: obj.lng,
                        // TODO add the rest of the vars
                    });
                // TODO add hasLayer() logic here to only add absent markers?
                cleaningLayerGroup.addLayer(marker);
                map.addLayer(cleaningLayerGroup);
                marker.on('click', function() {
                    onCleaningMarkerClick(marker);
                });          
            });
        },
        error: function(data) {
            console.log('Something went wrong while fetching the data', data);
        }
    });
    var useToken = localStorage["token"] || window.token || userAuth.name;};

// Get areas (polygons)
function loadAreas() {
    console.log('loading remote area polygons');
  
    if ( map.hasLayer('areaLayerGroup') ) {
      areaLayerGroup.clearLayers(); 
    
      var useToken = localStorage["token"] || window.token || userAuth.name;
      $.ajax({
        type: api.readAreaWithinBounds.method,
        url: api.readAreaWithinBounds.url(currentViewBounds),
        headers: {"Authorization": "Bearer " + useToken},
        success: function (data) {
          console.log('area data', data);

          $(data).each(function(index, obj) {
            console.log("object data", obj);
                                
              var polygonLayer = new L.Polygon(obj.latlngs,
                {
                  Id: obj.id,
                  // TODO add the rest of the options
                });
                            
              areaLayerGroup.addLayer(polygonLayer);
              map.addLayer(areaLayerGroup);
              polygonLayer.on('click', function() {
                  onAreaClick(polygonLayer);
              });
                
            }
          );        
        },
        error: function (data) {
          console.log('Error getting area data', data);
        }
      });
  
  }
  
  if ( ! map.hasLayer('areaLayerGroup') ) {
    // FIXME this displays too much
    // showAlert("Show other types of layer by selecting them from the eye button.", "info", 2000);
    return;
  }};

// Get litters (polylines)
function loadLitters() {
    console.log('loading remote litter polylines');
  
    if ( map.hasLayer('pathLayerGroup') ) {
      pathLayerGroup.clearLayers(); 
    
      var useToken = localStorage["token"] || window.token || userAuth.name;
      $.ajax({
        type: api.readLitterWithinBounds.method,
        url: api.readLitterWithinBounds.url(currentViewBounds),
        headers: {"Authorization": "Bearer " + useToken},
        success: function (data) {
          console.log('litter data', data);

          $(data).each(function(index, obj) {
            console.log("object data", obj);
                                
              var polylineLayer = new L.Polyline(obj.latlngs,
                {
                  Id: obj.id,
                  Amount: obj.amount,
                  Types: obj.types,
                  ImageUrl: obj.image_url
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
                  onLitterClick(polylineLayer);
              });
                
            }
          );        
        },
        error: function (data) {
          console.log('Error getting shape data', data);
        }
      });
  
  }
  
  if ( ! map.hasLayer('pathLayerGroup') ) {
    // FIXME this displays too much
    // showAlert("Show other types of layer by selecting them from the menu.", "info", 2000);
    return;
  }
};

// onClick behavior for non-saved markers
function onLocalMarkerClick (e) {
    // console.log("local marker clicked");
    bottombar.hide();
    marker = this;
    map.panToOffset(marker._latlng, _getHorizontalOffset());
    console.log("clicked marker id:", marker._leaflet_id );
    marker.on("dragend", function(event){
      var newPos = event.target.getLatLng();
      // console.log("dragged marker id:", event.target._leaflet_id );
      $('.marker-lat').val(newPos.lat);
      $('.marker-lng').val(newPos.lng);
    });

    $('#sidebar').scrollTop =0;
    $('.sidebar-content').hide();
    sidebar.show($("#create-marker-dialog").fadeIn());
};

// onClick behavior for saved markers
function onGarbageMarkerClick (e) {
    console.log("Garbage marker clicked");
    console.log(e);
    var that = this;
    map.panToOffset([e.options.Lat, e.options.Lng], _getVerticalOffset());

        sidebar.hide();
        clearBottomPanelContent();
            
        var markerTypes = e.options.Types;
        var markerAmount = e.options.Amount;
        var markerRawImage = e.options.ImageUrl;
        var markerId = e.options.Id;
        var markerCreatedBy = e.options.marked_by;
        // var markerConfirmed = e.options.confirmed;
        // TODO add the rest of the option once the api route is ready
      
        // Put a placeholder if the media is empty
        if (! markerRawImage ) {
          $('#feature-info').find('.feature-image').attr('src', 'http://placehold.it/160x120');
          $('#feature-info').find('.feature-image-link').attr('href', '');
        };
        console.log("value of rawimage", markerRawImage);
        
        if ( markerRawImage ) {
          // Add an IMGUR api character to the url to fetch thumbnails to save bandwidth
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

        $('#feature-info').find('.feature-info-garbage-type').html(markerTypes.join(", "));
        $("#feature-info-created-by").html(markerCreatedBy);
        // $('#feature-info').find('.feature-info-confirmed p strong').html(markerConfirmed);
      
        // Show the bottombar with content
        bottombar.show();
        $('#feature-info').fadeIn();
        
        // TODO move this logic outside this function and call it with a function and the marker obj as param
        $('#feature-info').find('.btn-delete').click(function (e) {
            // FIXME this send one request the first time deletion is requested (delete button)
            // two requests the second time the deletion is requested
            // three requests ...
            // TODO only allow if session is valid and userid matches
            console.log('trigger delete on id', markerId);
            e.preventDefault();
            var useToken = localStorage.getItem('token') || window.token;
            $.ajax({
                type: api.deleteTrash.method,
                url: api.deleteTrash.url(markerId),
                headers: {"Authorization": "Bearer " + useToken},
                success: function(response) {
                    bottombar.hide();
                    loadGarbageMarkers();
                    showAlert("Marker deleted successfully!", "success", 1500);
                },
                error: function(response) {
                    showAlert("Failed to remove this marker.", "warning", 2000);
                }
            });
        });
        // TODO move this logic outside this function and call it with a function and the marker obj as param
        $('#feature-info').find('.btn-edit').click(function (e, obj) {
            console.log('edit data on id', markerId);
            editFeature(obj);
            e.preventDefault();
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

        };
};

function onCleaningMarkerClick(e) {
    console.log("Garbage marker clicked");
    console.log(e);
    var that = this;
    map.panToOffset([e.options.Lat, e.options.Lng], _getVerticalOffset());

        sidebar.hide();
        clearBottomPanelContent();
            
        var markerTypes = e.options.Types;
        var markerDate = e.options.Date;
        var markerId = e.options.Id;
        var markerCreatedBy = e.options.marked_by;
        // TODO add the rest of the option once the api route is ready

        $("#cleaning-info-created-by").html(markerCreatedBy);
      
        // Show the bottombar with content
        bottombar.show();
        $('#cleaning-info').fadeIn();
        
        // TODO move this logic outside this function and call it with a function and the marker obj as param
        $('#cleaning-info').find('.btn-delete').click(function (e) {
            // FIXME this send one request the first time deletion is requested (delete button)
            // two requests the second time the deletion is requested
            // three requests ...
            // TODO only allow if session is valid and userid matches
            console.log('trigger delete on id', markerId);
            e.preventDefault();
            var useToken = localStorage.getItem('token') || window.token;
            $.ajax({
                type: api.deleteCleaning.method,
                url: api.deleteCleaning.url(markerId),
                headers: {"Authorization": "Bearer " + useToken},
                success: function(response) {
                    bottombar.hide();
                    loadCleaningMarkers();
                    showAlert("Marker deleted successfully!", "success", 1500);
                },
                error: function(response) {
                    showAlert("Failed to remove this marker.", "warning", 2000);
                }
            });
        });
        // TODO move this logic outside this function and call it with a function and the marker obj as param
        $('#feature-info').find('.btn-edit').click(function (e, obj) {
            console.log('edit data on id', markerId);
            editFeature(obj);
            e.preventDefault();
        });
};

// TODO onClick behavior for saved shapes only 
function onAreaClick(e) {                          
    console.log("remote shape clicked");
    console.log(e);
    console.log(e.options.latLngs)
    sidebar.hide();
    var that = this;
    map.panToOffset(e.getCenter(), _getVerticalOffset());

    clearBottomPanelContent();

    if ( e.option.Type === 'polyline'){
      map.fitBounds(e.layer.getBounds(), {paddingBottomRight: [0,200]});
      // inject info for the polyline
      var shapeType = e.options.Type;
      var shapeTypes = e.options.Types;
      var shapeAmount = e.options.Amount;
      var shapeRawImage = e.options.ImageUrl;
      var shapeLatLngs =e.options.LatLngs;
      var shapeId = e.options.Id;
      // TODO add the rest of the option once the api route is ready
    }
  
    if ( e.option.Type === 'polygon'){
      map.fitBounds(e.layer.getBounds());
      // inject info for the polygon
      var shapeType = e.options.Type
      var shapeLatLngs =e.options.LatLngs;
      var shapeId = e.options.Id;
      // TODO add the rest of the option once the api route is ready
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
  
    bottombar.show();
    $('#feature-info').fadeIn();
  
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
        setEditingValues(featureType);
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

function onLitterClick(e) {};