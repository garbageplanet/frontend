
// Set the color of polyline dynamically
$('#coastal-trash-amount').change(function() {
var selectedValue = parseInt(jQuery(this).val());
    switch(selectedValue){
    case 0:
            drawControl.setDrawingOptions({
                polyline: {
                    shapeOptions: {
                        color: '#33CC33',
                        weight: 5
                    }
                }
            }); break;
    case 1:
            drawControl.setDrawingOptions({
                polyline: {
                    shapeOptions: {
                        color: '#1E90FF',
                        weight: 5
                    }
                }
            }); break;
    case 2:
            drawControl.setDrawingOptions({
                polyline: {
                    shapeOptions: {
                        color: '#ddff55',
                        weight: 10
                    }
                }
            }); break;
    case 3:
           drawControl.setDrawingOptions({
                polyline: {
                    shapeOptions: {
                        color: '#FFC266',
                        weight: 15
                    }
                }
            }); break;
    case 4:
            drawControl.setDrawingOptions({
                polyline: {
                    shapeOptions: {
                        color: '#FF3300',
                        weight: 20
                    }
                }
            }); break;
     }
});

// Save the drawn items
map.on('draw:created', function (e) {
    var type = e.layerType,
        layer = e.layer;
    if (layer === 'polyline'){
        // save to db as geoJSON with attribute polyline and other form fields
            /*map.on('draw:created', function (e) {
              var type = e.layerType;
              var layer = e.layer;
              var shape = layer.toGeoJSON()
              var shape_for_db = JSON.stringify(shape);
            });*/
    } else if (layer === 'polygon') {
       // save to db as geoJSON with attribute polygon and other form fields
    };
    drawnItems.addLayer(layer);
});

// Get the type of feature during editing
map.on('draw:edited', function (e) {
var layers = e.layers;
var getShapeType = function(layer) {
    if ((layer instanceof L.Polyline) && ! (layer instanceof L.Polygon)) {
        return 'polyline';
    }
    if ((layer instanceof L.Polygon) && ! (layer instanceof L.Rectangle)) {
        return 'polygon';
    }
};
layers.eachLayer(function (getShapeType) {
    if (getShapeType === 'polyline'){
    // Save to db
    ;}
    if (getShapeType === 'polygon'){
    // Save to db
    }

    });
});

// Prevent onMapClick while drawing and add location in sidebar

map.on('draw:drawstart', function (e) {
    if ( e.layerType === 'polyline') {
            $('.sidebar-content').hide();
            $('#sidebar').scrollTop = 0;
            var center =  map.getCenter();
            $currentCenterLatitude = center.lat.toString();
            $currentCenterLongitude = center.lng.toString();
            $currentCenterLatitudeTruncated = truncateDecimals($currentCenterLatitude,2);
            $currentCenterLongitudeTruncated = truncateDecimals($currentCenterLongitude,2);
                 if ($currentCenterLatitudeTruncated > 0) {
                        $('#set-current-location span:nth-child(3)').text("N");
                        } else {
                        $('#set-current-location span:nth-child(3)').text("S");
                    };
                 if ($currentCenterLongitudeTruncated > 0) {
                        $('#set-current-location span:nth-child(5)').text("E");
                        } else {
                        $('#set-current-location span:nth-child(5)').text("W");
                    };
            $absCurrentCenterLatitudeTruncated = Math.abs($currentCenterLatitudeTruncated);
            $absCurrentCenterLongitudeTruncated = Math.abs($currentCenterLongitudeTruncated);
            $('#set-current-location span:nth-child(2)').html($absCurrentCenterLatitudeTruncated);
            $('#set-current-location span:nth-child(4)').html($absCurrentCenterLongitudeTruncated);
            sidebar.show($("#create-highlight-dialog").fadeIn());
        } else if (e.layerType === 'polygon') {
            $('.sidebar-content').hide();
            $('#sidebar').scrollTop = 0;
            var center =  map.getCenter();
            $currentCenterLatitude = center.lat.toString();
            $currentCenterLongitude = center.lng.toString();
            $currentCenterLatitudeTruncated = truncateDecimals($currentCenterLatitude,2);
            $currentCenterLongitudeTruncated = truncateDecimals($currentCenterLongitude,2);
                 if ($currentCenterLatitudeTruncated > 0) {
                        $('#set-current-location span:nth-child(3)').text("N");
                        } else {
                        $('#set-current-location span:nth-child(3)').text("S");
                    };
                 if ($currentCenterLongitudeTruncated > 0) {
                        $('#set-current-location span:nth-child(5)').text("E");
                        } else {
                        $('#set-current-location span:nth-child(5)').text("W");
                    };
            $absCurrentCenterLatitudeTruncated = Math.abs($currentCenterLatitudeTruncated);
            $absCurrentCenterLongitudeTruncated = Math.abs($currentCenterLongitudeTruncated);
            $('#set-current-location span:nth-child(2)').html($absCurrentCenterLatitudeTruncated);
            $('#set-current-location span:nth-child(4)').html($absCurrentCenterLongitudeTruncated);
            sidebar.show($("#create-outline-dialog").fadeIn());
        };
    map.off('click', onMapClick);
});

// Show the dialog when editing features
map.on('draw:editstart draw:deletestart', function (e) {
    if (e.layerType === 'polyline') {
        $('.sidebar-content').hide();
        sidebar.show($("#create-highlight-dialog").fadeIn());
    } else if (e.layerType === 'polygon') {
        // replace text in dialog
            $('.sidebar-content').hide();
            sidebar.show($("#create-outline-dialog").fadeIn());
          };
    map.off('click', onMapClick);
});

map.on('draw:drawstop draw:editstop draw:deletestop', function (e) {
    map.on('click', onMapClick);

});
