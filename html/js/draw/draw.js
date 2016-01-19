var drawControl = new L.Control.Draw({
    position: 'topright',
    draw: { circle: false,
            rectangle: false,
            marker: false },
    edit: {
        featureGroup: pathLayerGroup,
        remove: true
    }
});

map.addControl(drawControl);

map.on('draw:drawstart', function (e) {
      var type = e.layerType,
          layer = e.layer,
          distanceStr;
  
  //FIXME
  // get the lenght inside $('.polyline-length') and area inside $('.polygone-area')
  // the value is sotred as distanceStr in L.Draw.js
  console.log("current length", distanceStr);
  $('input[class=polyline-length]').val(distanceStr);
  
});

// Stop click listening when editing features
map.on('draw:editstart', function (e) { map.off('click', onMapClick) });

map.on('draw:editstop', function (e) { map.on('click', onMapClick) });

// What to do once a shape is created
map.on('draw:created', function (e) {
    var type = e.layerType;
        
    if (type === 'polyline') {
      
      var polylineLayer = e.layer;
        
      // Range slider for amount of garbage on polyline
      $('.polyline-range-input').on('change', function() {
          $('.polyline-range-value').html(this.value);
          // Get the color value from the select options
          var selectedValue = parseInt(jQuery(this).val());
            switch(selectedValue){
                    // so much cringe here, let's try to do this with ternaries
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
      });
      
      //TODO
      // get the points at e._latlngs[0]...[n]
      //ajax success
      showAlert("Path saved successfully!", "success", 1200);
      //ajax error
      showAlert("There was an error while saving the path.", "danger", 1200);

      pathLayerGroup.addLayer(polylineLayer)
      map.addLayer(pathLayerGroup);
      
      $('.btn-cancel').on('click', function(){
        $('.leaflet-draw-edit-edit').removeClass('visible');
        map.removeLayer(polylineLayer);
      });
    }
  
    if( type === 'polygon') {
      
      var polygonLayer = e.layer;
      
      //TODO
      //ajax success
        showAlert("Area saved successfully!", "success", 1200);
      //ajax error
        showAlert("There was an error while saving the area.", "danger", 1200);
      
        areaLayerGroup.addLayer(polygonLayer);
        map.addLayer(areaLayerGroup);
      
        $('.btn-cancel').on('click', function(){
          $('.leaflet-draw-edit-edit').removeClass('visible');
          map.removeLayer(polygonLayer);
        });
      
    }
    
    // Reactivate default marker event listener
    map.on('click', onMapClick);
});

// What to do once a shape was edited
map.on('draw:edited', function (e) {
    var layers = e.layers;
    layers.eachLayer(function (layer) {
      
    var type = e.layerType,
    layer = e.layer;
      
    if( type === 'polyline') {}
      
    if( type === 'polygon') {}
        
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
  new L.Draw.Polyline(map, 
                          { allowIntersection: false,
                               drawError: {
                               color: '#cc0000',
                               timeout: 2000 
                               },
                            metric: true,
                            clickable: true,
                            shapeOptions: {
                              color: '#A9A9A9',
                              weight: 10,
                              opacity: 0.5,
                              smoothFactor: 2}}).enable();
});

$('.btn-draw-polygon').on('click', function(){
  // Stop default marker event listener
  map.off('click', onMapClick);
  map.removeLayer(marker);
  $('.leaflet-draw-edit-edit').addClass('visible');
  new L.Draw.Polygon(map, 
                          { 
                           shapeOptions: {
                              color: '#dd55ff',
                              weight: 5,
                              opacity: 0.5,
                              smoothFactor: 2
                              },
                          showArea: true,
                          metric: true,
                          clickable: true,
                          allowIntersection: false,
                                 drawError: {
                                 color: '#cc0000',
                                 timeout: 2000 
                                 }}).enable();
});

// Add click events for draw layers
pathLayerGroup.on('click', 
                  function onPathClick (e) {
                    sidebar.hide();
                    bottombar.show();
});

areaLayerGroup.on('click', 
                  function onAreaClick (e) {
                    sidebar.hide();
                    bottombar.show();
});