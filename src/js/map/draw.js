/*jslint browser: true, white: true, sloppy: true, maxerr: 1000*/
// All code related to drawing shapes
editableLayerGroup = new L.FeatureGroup();

var drawControl = new L.Control.Draw({
    
    position: 'topright',
    
    draw: { 
        
        circle: false,
        rectangle: false,
        marker: false 
    },
    
    edit: {
        
        featureGroup: editableLayerGroup,
        remove: false

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
map.on('draw:editstart', function (e) {
    
    map.off('click', onMapClick);
    
    $('.btn-draw').addClass('disabled');
    
    // litterLayerGroup.off('click', onPathClick);
    // areaLayerGroup.off('click', onAreaClick);
});

map.on('draw:editstop', function (e) { 
    
    $('.btn-draw').removeClass('disabled');
    
    $('.leaflet-draw-edit-edit').removeClass('visible');
    
    $('.leaflet-draw-edit-remove').removeClass('visible');

    // litterLayerGroup.off('click', onPathClick);
    // areaLayerGroup.off('click', onAreaClick);
});

map.on('draw:deletestart', function (e) { 

    map.off('click', onMapClick);

    $('.btn-draw').addClass('disabled');

    // litterLayerGroup.off('click', onPathClick);
    // areaLayerGroup.off('click', onAreaClick);
});

map.on('draw:deletestop', function (e) {

    map.on('click', onMapClick);

    $('.btn-draw').removeClass('disabled');

    $('.leaflet-draw-edit-edit').removeClass('visible');

    $('.leaflet-draw-edit-remove').removeClass('visible');

    // litterLayerGroup.off('click', onPathClick);
    // areaLayerGroup.off('click', onAreaClick);
});

// Need to make sure the user can click again on the map if the drawing is aborted
// This needs to be called in this fashion else it messes up onMapClick's behavior
map.on('draw:drawstop', function () {
    
    map.off('click', onMapClick);

    map.on('click', onMapClick);

    $('.btn-draw').removeClass('disabled');
    
});

// What to do once a shape is created
map.on('draw:created', function (e) {
  
    var latlngs = e.layer.getLatLngs().toString().replace(/\(/g, '[').replace(/\)/g, ']').replace(/LatLng/g, '');

    if (e.layerType === 'polyline') {

        map.fitBounds(e.layer.getBounds(), {paddingBottomRight: [300,0]});
        //FIXME get the length inside $('.polyline-length')
        // console.log("distance size", distanceStr);
        // the value is sotred as distanceStr in L.Draw.js
        // $('input[class=polyline-length]').val(distanceStr);
        // seems the the data gets cleared at draw:created
        // console.log("length", $('.leaflet-draw-tooltip-subtext').val() )
        // $('input[class=polyline-length]').val($('.leaflet-draw-tooltip-subtext').val());  

        // push the latlngs to the form
        // The latlngs array must follow the format (lat1 lng1, lat2 lng2, ...) for easier transformation to geom

        $('.form-litter .litter-latlngs').val(latlngs);
        
        console.log("layer's latlngs", latlngs);

        // Range slider for amount of garbage on polyline
        $('.litter-range-input').on('change', function () {

            $('.litter-range-value').html(this.value);

            // Get the color value from the select options
            var selectedValue = parseInt($(this).val(), 10);

            switch (selectedValue) {
                    
              case 1:
                  e.layer.setStyle({color: "green"});
                  break;
              case 2:
                  e.layer.setStyle({color: "limegreen"});
                  break;
              case 3:
                  e.layer.setStyle({color: "yellow"});
                  break;
              case 4:
                  e.layer.setStyle({color: "gold"});
                  break;
              case 5:
                  e.layer.setStyle({color: "orange"});
                  break;
              case 6:
                  e.layer.setStyle({color: "orangered"});
                  break;
              case 7:
                  e.layer.setStyle({color: "red"});
                  break;
              case 8:
                  e.layer.setStyle({color: "darkred"});
                  break;
              case 9:
                  e.layer.setStyle({color: "purple"});
                  break;
              case 10:
                  e.layer.setStyle({color: "black"});
                  break;
              default:
                  e.layer.resetStyle();
                  break;
                    
              }
            
      });

      editableLayerGroup.addLayer(e.layer);
        
      map.addLayer(editableLayerGroup);

      $('.btn-cancel').on('click', function () {
          
        $('.leaflet-draw-edit-edit').removeClass('visible');
          
        $('.leaflet-draw-edit-remove').removeClass('visible');

        map.removeLayer(e.layer);
          
      });

    }

    if( e.layerType === 'polygon') {
        
        map.fitBounds(e.layer.getBounds(), {paddingBottomRight: [300,0]});

        // push the latlngs to the form
        $('.form-area .area-latlngs').val(latlngs);

        editableLayerGroup.addLayer(e.layer);

        map.addLayer(editableLayerGroup);

        $('.btn-cancel').on('click', function () {
            
            $('.leaflet-draw-edit-edit').removeClass('visible');

            $('.leaflet-draw-edit-remove').removeClass('visible');

            map.removeLayer(e.layer);
            
        });
    }

    // Reactivate default marker event listener and drawing button
    map.on('click', onMapClick);
    
    $('.btn-draw').removeClass('disabled');  
    
});

// What to do once a shape was edited
// TODO save edited features after eidt
// FIXME if the user saves after editing the onMapClick function fails
map.on('draw:edited', function (e) {
    
    var layers = e.layers;
  
    layers.eachLayer(function (layer) {
      
      var type = e.layerType,
          currentlayer = e.layer;
      
      if ( type === 'polyline') { 
          
          return "polyline";/*save to backend*/ 
      
      }
      
      if ( type === 'polygon') { 
          
          return "polygon";/*save to backend*/ 
      
      }
      
    });
      
    // Reactivate default marker event listener and drawing button
    map.on('click', onMapClick);
    
});

// Own handlers for calling L.Draw
$('.btn-draw-polyline').on('click', function () {
    
    // Stop default marker event listener
    map.off('click', onMapClick);

    $('.leaflet-draw-edit-edit').addClass('visible');

    $('.leaflet-draw-edit-remove').addClass('visible');
    new L.Draw.Polyline(map, 
      { 
        allowIntersection: false,
           drawError: {
           color: '#cc0000',
           timeout: 2000},
        metric: true,
        clickable: true,
        shapeOptions: {
          color: '#A9A9A9',
          weight: 10,
          opacity: 0.5,
          smoothFactor: 2}
      }).enable();
    
});

$('.btn-draw-polygon').on('click', function () {
    
  // Stop default marker event listener
  map.off('click', onMapClick);
    
  $('.leaflet-draw-edit-edit').addClass('visible');
    
  $('.leaflet-draw-edit-remove').addClass('visible');

  new L.Draw.Polygon(map, 
      { 
       shapeOptions:{
          color: '#dd55ff',
          weight: 5,
          opacity: 0.5,
          smoothFactor: 2},
      showArea: true,
      metric: true,
      clickable: true,
      allowIntersection: false,
             drawError:{
             color: '#cc0000',
             timeout: 2000}
      }).enable();
    
});