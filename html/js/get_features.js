/*jslint browser: true, white: true, sloppy: true, maxerr: 1000*/
// Get new markers if the map moves
map.on('moveend', function (e) {
  console.log("map was moved");
  var bounds = map.getBounds();
  currentViewBounds = bounds._northEast.lat + ',%20' + bounds._northEast.lng + ',%20' + bounds._southWest.lat + ',%20' + bounds._southWest.lng;
  console.log("currentViewBounds:", currentViewBounds);

  if (mapZoom >= 8) {
    console.log("mapZoom value from get_feature.js", mapZoom);
    loadGarbageMarkers();
    loadCleaningMarkers();
  }

  if (mapZoom >= 8 && mapZoom <= 16) {
    loadLitters();
  }

  if (mapZoom >= 7 && mapZoom <=15) {
    loadAreas(); 
  }
});


// Get garbage
function loadGarbageMarkers () {
    console.log('loading garbage markers from db');
    garbageLayerGroup.clearLayers();
    // ajax request
    $.ajax({
        type: api.readTrashWithinBounds.method,
        url: api.readTrashWithinBounds.url(currentViewBounds),
        success: function (data) {
            $(data).each(function (index, obj) {
                // console.log(obj);
              
                var marker = new L.Marker(new L.LatLng(obj.lat, obj.lng),
                    {
                        icon: garbageMarker,
                        Id: obj.id,
                        Amount: obj.amount,
                        Types: obj.types,
                        ImageUrl: obj.image_url,
                        Lat: obj.lat,
                        Lng: obj.lng,
                        Confirm: obj.confirm,
                        Todo: obj.todo,
                        Tags: obj.tag,
                        Note: obj.note,
                        FeatureType: obj.featuretype
                    });
              
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
    var useToken = localStorage.getItem('token') || window.token;
}

// Get cleanings
function loadCleaningMarkers () {
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
                        FeatureType: obj.featuretype,
                        Paticipants: obj.participants,
                        Recurrence: obj.recurrence

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
    var useToken = localStorage.getItem('token') || window.token;
}

// Get areas (polygons)
function loadAreas () {
  console.log('loading remote area polygons');
  
  areaLayerGroup.clearLayers(); 

  var useToken = localStorage.getItem('token') || window.token;
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
              Title: obj.title,
              Players: obj.players,
              Note: obj.note,
              Tags: obj.tag,
              Contact: obj.contact,
              FeatureType: obj.featuretype
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

// Get litters (polylines)
function loadLitters () {
  console.log('loading remote litter polylines');
  
  pathLayerGroup.clearLayers(); 

  var useToken = localStorage.getItem('token') || window.token;
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
              ImageUrl: obj.image_url,
              Tags: obj.tag,
              FeatureType: obj.featuretype              
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
          }

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


// onClick behavior for saved garbage markers
function onGarbageMarkerClick (e) {
    console.log("Garbage marker clicked");
    console.log(e);
  
    var that = this,
        markerTypes = e.options.Types,
        markerAmount = e.options.Amount,
        markerRawImage = e.options.ImageUrl,
        markerId = e.options.Id,
        markerCreatedBy = e.options.marked_by,
        markerNote = e.options.note,
        markerTags = e.options.tag,
        markerTodo = e.options.todo,
        markerConfirm = e.options.confirm,
        markertarget = "http://garbagepla.net/#15/"+e.options.Lat+"/"+e.options.Lng+"string"; //create a url to the marker add a parameter at the end to open the bottombar
      
    map.panToOffset([e.options.Lat, e.options.Lng], _getVerticalOffset());

    sidebar.hide();
    clearBottomPanelContent();

        // TODO push all the data to the bottombar
        
        // Put a placeholder if the media is empty
        if (!markerRawImage) {
          $('#feature-info').find('.feature-image').attr('src', 'http://placehold.it/160x120');
          $('#feature-info').find('.feature-image-link').attr('href', '');
        }
        
        if (markerRawImage) {
          // Add an IMGUR api character to the url to fetch thumbnails to save bandwidth
          String.prototype.insert = function (index, string) {
              if (index > 0) {
                  return this.substring(0, index) + string + this.substring(index, this.length);
              } else {
                return string + this;
              }
          };
        
          markerImage = markerRawImage.insert(26, "t");
          $('#feature-info').find('.feature-image').attr('src', markerImage);
          $('#feature-info').find('.feature-image-link').attr('href', markerRawImage);
        }
        
        $('#feature-info').find('.feature-info-garbage-type').html(markerTypes.join(", "));
        $("#feature-info-created-by").html(markerCreatedBy);
        // push the url to the href of share buttons
        $('#feature-info').find('.btn-share').each(function() {
          $(this).attr("data-url", markertarget);
        });
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
        // TODO pass the object to editFeature()
        $('#feature-info').find('.btn-edit').click(function (e) {
            e.preventDefault();
            console.log('edit data on id', markerId);
            editFeature(e);
        });
      
        // amount mapping
        switch (markerAmount) {
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
        }
}

// onClick behavior for saved cleaning markers
function onCleaningMarkerClick (e) {
    console.log("Garbage marker clicked");
    console.log(e);
  
    var that = this,
    markerTypes = e.options.Types,
    markerDate = e.options.Date,
    markerId = e.options.Id,
    markerCreatedBy = e.options.marked_by;

    // TODO add the rest of the option once the api route is ready
  
    map.panToOffset([e.options.Lat, e.options.Lng], _getVerticalOffset());

        sidebar.hide();
        clearBottomPanelContent();
            


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
}

// onClick behavior for saved areas
function onAreaClick (e) {                          
    console.log("remote polygon clicked");
    console.log(e);
    console.log(e.options.latLngs);
  
    var that = this,
      areaLatLngs = e.layer.options.LatLngs,
      areaId = e.layer.options.Id,
      areatags = e.layer.options.Tags,
      areacontact = e.layer.options.Contact,
      areanote = e.layer.options.Note,
      areatitle = e.layer.options.Title,
      areaplayers = e.layer.options.Players,
      areaCreatedBy = e.options.marked_by;
  
    sidebar.hide();
    map.panToOffset(e.getCenter(), _getVerticalOffset());
    map.fitBounds(e.layer.getBounds());
    clearBottomPanelContent();

    // TODO push the data to the bottom bar
  
    bottombar.show();
    $('#feature-info').fadeIn();
  
    $('#feature-info').find('.btn-delete').click(function (e) {
        
        e.preventDefault();
        var useToken = localStorage.getItem('token') || window.token;
      
        $.ajax({
            type: api.deleteArea.method,
            url: api.deleteArea.url(areaId),
            headers: {"Authorization": "Bearer " + useToken},
            success: function(response) {
                bottombar.hide();
                loadAreas();
                showAlert("Area deleted successfully.", "success", 1500);
            },
            error: function(response) {
                showAlert("Failed to delete this area.", "warning", 2000);
            }
        });
    });

    $('#feature-info').find('.btn-edit').click(function (e) {
        console.log('show data on id', areaId);
        e.preventDefault();
        editFeature(e.obj, "polygon");

    });
}

// onClick behavior for saved litters
function onLitterClick (e) {                     
    console.log("remote polyline clicked");
    console.log(e);
    console.log(e.options.latLngs);
  
    var that = this,
      litterType = e.layer.options.Type,
      litterAmount = e.layer.options.Amount,
      litterRawImage = e.layer.options.ImageUrl,
      litterLatLngs =e.layer.options.LatLngs,
      litterId = e.layer.options.Id,
      litterTags = e.layer.options.Tags,
      litterNote = e.layer.options.Note,
      litterLength = e.layer.options.Length,
      litterConfirm = e.layer.options.Confirm,
      litterCreatedBy = e.options.marked_by;

    // TODO push data to the bottom bar
  
    sidebar.hide();
    map.panToOffset(e.getCenter(), _getVerticalOffset());

    clearBottomPanelContent();

    map.fitBounds(e.layer.getBounds(), {paddingBottomRight: [0,200]});
    


    // Put a placeholder if the media is empty
    if (!litterRawImage ) {
      $('#feature-info').find('.feature-image').attr('src', 'http://placehold.it/160x120');
      $('#feature-info').find('.feature-image-link').attr('href', '');
    }

    if (litterRawImage) {
      
      // Add an IMGUR api character to the url to fetch thumbnails to save bandwith
      String.prototype.insert = function (index, string) {
        
        if (index > 0) {
            return this.substring(0, index) + string + this.substring(index, this.length);
        } else {
          return string + this;
        }
      };
      
      litterImage = litterRawImage.insert(26, "t");
      
      $('#feature-info').find('.feature-image').attr('src', litterImage);
      $('#feature-info').find('.feature-image-link').attr('href', litterRawImage);
      
    }
  
    bottombar.show();
    $('#feature-info').fadeIn();
  
    $('#feature-info').find('.btn-delete').click(function (e) {
        
        e.preventDefault();
        var useToken = localStorage.getItem('token') || window.token;
      
        $.ajax({
            type: api.deleteShape.method,
            url: api.deleteShape.url(litterId),
            headers: {"Authorization": "Bearer " + useToken},
            success: function(response) {
                bottombar.hide();
                loadRemoteLitter();
                showAlert("Litter line deleted successfully.", "success", 1500);
            },
            error: function(response) {
                showAlert("Failed to delete this litter line.", "warning", 2000);
            }
        });
    });

    $('#feature-info').find('.btn-edit').click(function (e) {
        //debugger;
        console.log('show data on id', litterId);
        e.preventDefault();
        editFeature(e.obj, "litter");
        // TODO load the marker data into the form

    });

    // amount mapping
    switch (litterAmount) {
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
        $('#feature-info').find('.feature-info-garbage-amount').html('Oh my God Becky');
        break;
      default:
        $('#feature-info').find('.feature-info-garbage-amount').html('Undefined');
    }
};
