/*jslint browser: true, white: true, sloppy: true, maxerr: 1000*/
// TODO Get new markers if the map moves
// FIXME changed .on() to .addOneTimeEventListener() for now
map.addOneTimeEventListener('moveend', function (e) {
  console.log("map was moved");
  var bounds = map.getBounds();
  currentViewBounds = bounds._northEast.lat + ',%20' + bounds._northEast.lng + ',%20' + bounds._southWest.lat + ',%20' + bounds._southWest.lng;
  console.log("currentViewBounds:", currentViewBounds);

  if (mapZoom >= 8) {
    console.log("mapZoom value from get_feature.js", mapZoom);
    // TODO another way to get the markers this makes too many html requests
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
    var useToken = localStorage.getItem('token') || window.token;
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
                        id: obj.id,
                        amount: obj.amount,
                        types: obj.types,
                        imageUrl: obj.image_url,
                        lat: obj.lat,
                        lng: obj.lng,
                        confirm: obj.confirm,
                        todo: obj.todo,
                        tags: obj.tag,
                        note: obj.note,
                        feature_type: obj.featuretype,
                        size: obj.size,
                        embed: obj.embed,
                        marked_by: obj.marked_by
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
            console.log('Something went wrong while fetching the garbage markers', data);
        }
    });
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
                        id: obj.Id,
                        date: obj.Date,
                        lat: obj.Lat,
                        lng: obj.Lng,
                        feature_type: obj.featuretype,
                        participants: obj.participants,
                        recurrence: obj.Recurrence,
                        marked_by: obj.marked_by

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
            console.log('Something went wrong while fetching the cleaning events', data);
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
              isPrototypeOfd: obj.id,
              title: obj.title,
              players: obj.players,
              note: obj.note,
              tags: obj.tag,
              contact: obj.contact,
              feature_type: obj.featuretype,
              marked_by: obj.marked_by
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
              id: obj.id,
              amount: obj.amount,
              types: obj.types,
              imageUrl: obj.image_url,
              tags: obj.tag,
              feature_type: obj.featuretype,
              marked_by: obj.marked_by,
              physical_length: obj.physical_length
            });

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
  
    map.panToOffset([e.options.lat, e.options.lng], _getVerticalOffset());
    sidebar.hide();
    // Clear the current data
    clearBottomPanelContent();
    // Push data
    pushDataToBottomPanel(e);
    
    // Show the bottombar with content
    bottombar.show($('#feature-info').fadeIn());

    // TODO move this logic outside this function and call it with a function and the marker obj as param
    $('#feature-info').find('.btn-delete').one('click', function (e) {
        // FIXME this send one request the first time deletion is requested (delete button)
        // two requests the second time the deletion is requested
        // three requests ...
        // TODO only allow if session is valid and userid matches
        console.log('trigger delete on id', e.options.id);
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
    $('#feature-info').find('.btn-edit').on('click', function (e) {
        e.preventDefault();
        console.log('edit data on id', e.options.id);
        // TODO pass the feature data
        // editFeature(e); 
        bottombar.hide();
        sidebar.show($('#create-garbage-dialog').fadeIn());
    });

}

// onClick behavior for saved cleaning markers
function onCleaningMarkerClick (e) {
    console.log("Cleaning marker clicked");

    map.panToOffset([e.options.lat, e.options.lng], _getVerticalOffset());

        sidebar.hide();
        clearBottomPanelContent();
        pushDataToBottomPanel(e);

        // Show the bottombar with content
        bottombar.show($('#cleaning-info').fadeIn());

        // TODO move this logic somewhere else
        $('#cleaning-info').find('.btn-delete').click(function (e) {
            // FIXME this send one request the first time deletion is requested (delete button)
            // two requests the second time the deletion is requested
            // three requests ...
            // TODO only allow if session is valid and userid matches
            console.log('trigger delete on id', e.options.id);
            e.preventDefault();
            var useToken = localStorage.getItem('token') || window.token;
            $.ajax({
                type: api.deleteCleaning.method,
                url: api.deleteCleaning.url(e.options.id),
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
        $('#feature-info').find('.btn-edit').on('click', function (e, obj) {
            console.log('edit data on id', e.options.id);
            e.preventDefault();
            // TODO pass the feature data  
            // editFeature(e); 
            bottombar.hide();
            sidebar.show($('#create-cleaning-dialog').fadeIn());
        });
}

// onClick behavior for saved areas
function onAreaClick (e) {
    console.log("remote polygon clicked");
    console.log(e);
    console.log(e.options.latlngs);

    sidebar.hide();
    map.panToOffset(e.getCenter(), _getVerticalOffset());
    map.fitBounds(e.layer.getBounds());
    clearBottomPanelContent();
    pushDataToBottomPanel(e);

    bottombar.show();
    $('#feature-info').fadeIn();

    $('#feature-info').find('.btn-delete').click(function (e) {

      e.preventDefault();
      var useToken = localStorage.getItem('token') || window.token;

      $.ajax({
          type: api.deleteArea.method,
          url: api.deleteArea.url(e.options.id),
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
        console.log('show data on id', e.options.id);
        e.preventDefault();
        // TODO pass the feature data  
        // editFeature(e); 
        bottombar.hide();
        sidebar.show($('#create-area-dialog').fadeIn());
    });
}

// onClick behavior for saved litters
function onLitterClick (e) {
    console.log("remote polyline clicked");
    console.log(e);
    console.log(e.options.latlngs);

    sidebar.hide();
    map.panToOffset(e.getCenter(), _getVerticalOffset());

    clearBottomPanelContent();
    pushDataToBottomPanel(e);

    map.fitBounds(e.layer.getBounds(), {paddingBottomRight: [0,200]});

    bottombar.show($('#feature-info').fadeIn());

    $('#feature-info').find('.btn-delete').click(function (e) {

        e.preventDefault();
        var useToken = localStorage.getItem('token') || window.token;

        $.ajax({
            type: api.deleteShape.method,
            url: api.deleteShape.url(e.options.id),
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
        console.log('show data on id', e.options.id);
        e.preventDefault();
        // TODO pass the feature data  
        // editFeature(e); 
        bottombar.hide();
        sidebar.show($('#create-area-dialog').fadeIn());

    });

};
