var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

var drawControl = new L.Control.Draw({
    position: 'topright',
    draw: {
        polyline: {
            shapeOptions: {
                allowIntersection: false,
                drawError: {
                color: '#e1e100',
                message: '<strong>You can\'t cross lines!'
                },
                color: '#f357a1',
                weight: 20
            }
        },
        polygon: {
            allowIntersection: false,
            drawError: {
                color: '#e1e100',
                message: '<strong>You can\'t draw that!'
            },
            shapeOptions: {
                color: '#bada55'
            }
        },
        circle: false,
        rectangle: false,
        marker: false
    },
    edit: {
        featureGroup: drawnItems, //REQUIRED!!
        remove: true
    }
});
map.addControl(drawControl);

map.on('draw:drawstart', function (e) {
      var type = e.layerType,
          layer = e.layer,
          distanceStr;
  
  //FIXME
  // get the lenght inside $('.polyline-path.length')
  // the value is sotred as distanceStr in L.Draw.js
  console.log("current length", distanceStr);
  $('input[class=polyline-path-length]').val(distanceStr);
  
});

// Stop click listening when editing features
map.on('draw:editstart', function (e) { map.off('click', onMapClick) });

map.on('draw:editstop', function (e) { map.on('click', onMapClick) });


// What to do once a shape is created
map.on('draw:created', function (e) {
    var type = e.layerType,
        layer = e.layer;

    if (type === 'polyline') {
        
    // Range slider for amount of garbage on polyline
    $('.polyline-range-input').on('change', function() {
        $('.polyline-range-value').html(this.value);
        // Get the color value from the select options
        var selectedValue = parseInt(jQuery(this).val());
          switch(selectedValue){
                  // so much cringe here, let's try to do this with ternaries
                    case 1:
                        layer.setStyle({color:"green"}); 
                        break;
                    case 2:
                        layer.setStyle({color:"limegreen"}); 
                        break;
                    case 3:
                        layer.setStyle({color:"yellow"}); 
                        break;
                    case 4:
                        layer.setStyle({color:"gold"}); 
                        break;
                    case 5:
                        layer.setStyle({color:"orange"}); 
                        break;
                    case 6:
                        layer.setStyle({color:"orangered"});
                        break;
                    case 7:
                        layer.setStyle({color:"red"});
                        break;
                    case 8:
                        layer.setStyle({color:"darkred"}); 
                        break;
                    case 9:
                        layer.setStyle({color:"purple"}); 
                        break;
                    case 10:
                        layer.setStyle({color:"black"}); 
                        break;
                    default:
                        layer.resetStyle();
                        break;
            }
    });
      
    //TODO
    // get the points at e._latlngs[0]...[n]
    //ajax success
    showAlert("Path saved successfully!", "success", 1200);

    //ajax error
    showAlert("There was an error while saving the path.", "danger", 1200);

    }
  
    if( type === 'polygon') {
      
      //TODO
      //ajax success
        showAlert("Area saved successfully!", "success", 1200);
      //ajax error
        showAlert("There was an error while saving the area.", "error", 1200);
      
    }

    // Do whatever else you need to. (save to db, add to map etc)
    map.addLayer(layer);
    
    // Reactivate default marker event listener
    map.on('click', onMapClick);
});

// What to do once a shape was edited
map.on('draw:edited', function (e) {
    var layers = e.layers;
    layers.eachLayer(function (layer) {
        
      // TODO
      //ajax success
        showAlert("Feature saved successfully!", "success", 1200);
      //ajax error
        showAlert("There was an error while saving the feature.", "error", 1200);
      
      
    });
    map.on('click', onMapClick);
});

// Show the edit button on draw, hide on cancel / save
$('.btn-draw-polyline').on('click', function(){
  // Stop default marker event listener
  map.off('click', onMapClick);
  map.removeLayer(marker);
  $('.leaflet-draw-edit-edit').addClass('visible');
  new L.Draw.Polyline(map, drawControl.options.polyline).enable();
});

$('.btn-draw-polygon').on('click', function(){
  // Stop default marker event listener
  map.off('click', onMapClick);
  map.removeLayer(marker);
  $('.leaflet-draw-edit-edit').addClass('visible');
  new L.Draw.Polygon(map, drawControl.options.polygon).enable();
});

$('.btn-cancel-shape').on('click', function(){
  $('.leaflet-draw-edit-edit').removeClass('visible');
});