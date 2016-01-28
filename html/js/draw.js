// TODO use rectangles rather than polygon for simplicity.
// All code related to drawing shapes
var drawControl = new L.Control.Draw({
    position: 'topright',
    draw: { circle: false,
            rectangle: false,
            marker: false },
    edit: {
    // FIXME: one draw toolbar only allows to edit feature inside itw own layer, need a second if we want two layers (area and paths)
        featureGroup: pathLayerGroup, 
        remove: true
    }
});

map.addControl(drawControl);

map.on('draw:drawstart', function (e) {
  var type = e.layerType,
      layer = e.layer;
  
  // Disable start drawing buttons
  $('.btn-draw').addClass('disabled');
  
});

// Stop click listeners when editing and deleting features
// FIXME stop listening to onPathClick and onAreaClick during delete event
// the implementation below (commented out) stops all click going to the features
// editing works though
map.on('draw:editstart', function (e) { 
  map.off('click', onMapClick);
  $('.btn-draw').addClass('disabled');
  // pathLayerGroup.off('click', onPathClick);
  // areLayerGroup.off('click', onAreaClick);
});

map.on('draw:editstop', function (e) { 
  $('.btn-draw').removeClass('disabled');
  $('.leaflet-draw-edit-edit').removeClass('visible');
  $('.leaflet-draw-edit-remove').removeClass('visible');

  // pathLayerGroup.off('click', onPathClick);
  // areLayerGroup.off('click', onAreaClick);
});

map.on('draw:deletestart', function (e) { 
  map.off('click', onMapClick);
  $('.btn-draw').addClass('disabled');
  // pathLayerGroup.off('click', onPathClick);
  // areLayerGroup.off('click', onAreaClick);
});

map.on('draw:deletestop', function (e) {
  map.on('click', onMapClick);
  $('.btn-draw').removeClass('disabled');
  $('.leaflet-draw-edit-edit').removeClass('visible');
  $('.leaflet-draw-edit-remove').removeClass('visible');

  // pathLayerGroup.off('click', onPathClick);
  // areLayerGroup.off('click', onAreaClick);
});

// Need to make sure the user can click again on the map if the drawing is aborted
// This needs to be called in this fashion else it messes up onMapClick's behavior
map.on('draw:drawstop', function () { 
    map.off('click', onMapClick); 
    map.on('click', onMapClick)
    $('.btn-draw').removeClass('disabled');
});

// What to do once a shape is created
map.on('draw:created', function (e) {
    // var distanceStr, areaStr;
    var type = e.layerType;
  
    if (type === 'polyline') {
      var polylineLayer = e.layer;
      //FIXME get the lenght inside $('.polyline-length')
      // console.log("distance size", distanceStr);
      // the value is sotred as distanceStr in L.Draw.js
      // $('input[class=polyline-length]').val(distanceStr);
      // seems the the data gets cleared at draw:created
      // console.log("length", $('.leaflet-draw-tooltip-subtext').val() )
      // $('input[class=polyline-length]').val($('.leaflet-draw-tooltip-subtext').val());  
      
      // push the latlngs to the form
      
      var latlngs = polylineLayer.getLatLngs().toString().replace(/\(/g, '[').replace(/\)/g, ']').replace(/LatLng/g, '');
            
      $('.form-litter .litter-latlngs').val( latlngs );
      console.log("layer's latlngs", latlngs );
  
      
      // Range slider for amount of garbage on polyline
      $('.litter-range-input').on('change', function() {
          $('.litter-range-value').html(this.value);
          // Get the color value from the select options
          var selectedValue = parseInt(jQuery(this).val());
            switch(selectedValue){
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

      pathLayerGroup.addLayer(polylineLayer)
      map.addLayer(pathLayerGroup);
      
      $('.btn-cancel').on('click', function(){
        $('.leaflet-draw-edit-edit').removeClass('visible');
        $('.leaflet-draw-edit-remove').removeClass('visible');

        map.removeLayer(polylineLayer);
      });
      
    }
  
    if( type === 'polygon') {
      var polygonLayer = e.layer;

      // push the latlngs to the form
      var latlngs = polygonLayer.getLatLngs().toString().replace(/\(/g, '[').replace(/\)/g, ']').replace(/LatLng/g, '');
      $('.form-area .area-latlngs').val( latlngs );
      
      areaLayerGroup.addLayer(polygonLayer);
      map.addLayer(areaLayerGroup);
      
      $('.btn-cancel').on('click', function(){
        $('.leaflet-draw-edit-edit').removeClass('visible');
        $('.leaflet-draw-edit-remove').removeClass('visible');

        map.removeLayer(polygonLayer);
      });
    }
    
    // Reactivate default marker event listener and drawing button
    map.on('click', onMapClick);
    $('.btn-draw').removeClass('disabled');  
});

// What to do once a shape was edited
// FIXME if the user saves after editing the onMapClick function fails
map.on('draw:edited', function (e) {
    var layers = e.layers;
  
    layers.eachLayer(function (layer) {
      
      var type = e.layerType,
      layer = e.layer;
      
      if( type === 'polyline') { /*save to backend*/ }
      
      if( type === 'polygon') { /*save to backend*/ }
      
    });
  
    map.on('click', onMapClick);
});

// Own handlers for calling L.Draw
$('.btn-draw-polyline').on('click', function(){
  // Stop default marker event listener
  map.off('click', onMapClick);
  map.removeLayer(marker);
  $('.leaflet-draw-edit-edit').addClass('visible');
  $('.leaflet-draw-edit-remove').addClass('visible');
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
  $('.leaflet-draw-edit-remove').addClass('visible');

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

// FIXME make sure the function below don't mess the shapes onClick in get_features.js
// Add click events for draw layers
function onAreaClick (e) {
    sidebar.hide();
    bottombar.show();
    map.fitBounds(e.layer.getBounds());
};

function onPathClick (e) {
    sidebar.hide();
    bottombar.show();
    map.fitBounds(e.layer.getBounds(), {paddingBottomRight: [0,200]});
    // map.panToOffset(e._latlng, _getVerticalOffset());
};

pathLayerGroup.on('click', onPathClick)
areaLayerGroup.on('click', onAreaClick)