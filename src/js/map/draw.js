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
    // FIXME entirely disable handlers
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
    
    // $('.btn-draw').removeClass('disabled');
    
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

    // $('.btn-draw').removeClass('disabled');

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

    // $('.btn-draw').removeClass('disabled');
    
});

// What to do once a shape is created
map.on('draw:created', function (e) {
  
    var latlngs = e.layer.getLatLngs().toString().replace(/\(/g, '[').replace(/\)/g, ']').replace(/LatLng/g, '');

    console.log("LatLng data: ", e.layer.getLatLngs());
    
    if (e.layerType === 'polyline') {
        
        // Show the sidebar again on mobile
        if ($(window).width() <= 567) {

            sidebar.show($("#create-litter-dialog").show());

        }
        
        function setClassColor(c) {

            return c === 1  ? '#ccff66' :
                   c === 2  ? '#ffff00' :
                   c === 3  ? '#FF4500' :
                   c === 4  ? '#ff1a1a' :
                              '#e60073' ;
        };

        polylineLayer = e.layer;

        map.fitBounds(e.layer.getBounds(), {paddingBottomRight: [300,0]});
        //FIXME get the length inside $('.polyline-length')
        // console.log("distance size", distanceStr);
        // the value is sotred as distanceStr in L.Draw.js
        // $('input[class=polyline-length]').val(distanceStr);
        // seems the the data gets cleared at draw:created
        // console.log("length", $('.leaflet-draw-tooltip-subtext').val() )
        // $('input[class=polyline-length]').val($('.leaflet-draw-tooltip-subtext').val());  

        // push the latlngs to the form
        $('.litter-latlngs').val(latlngs);
        
        // Range slider for amount of garbage on polyline
        $('input[type=radio]').on('change', function () {

            // Get the color value from the select options
            var selectedValue = parseInt($(this).attr('name'), 10);

           // Set the color of the line
            e.layer.setStyle({color: setClassColor(selectedValue)});
            
        });

        editableLayerGroup.addLayer(e.layer);

        map.addLayer(editableLayerGroup);

        // Delete the feature on cancel button
        $('.btn-cancel').on('click', function () {

            $('.leaflet-draw-edit-edit').removeClass('visible');

            $('.leaflet-draw-edit-remove').removeClass('visible');

            map.removeLayer(e.layer);

        });
        
        sidebar.on('hide', function() {
            
            map.removeLayer(e.layer);
            
        });

    }

    if( e.layerType === 'polygon') {
        
        // Show the sidebar again on mobile    
        if ($(window).width() <= 567) {

            sidebar.show($("#create-area-dialog").show());

        }
        
        polygonLayer = e.layer;
        
        map.fitBounds(e.layer.getBounds(), {paddingBottomRight: [300,0]});

        // push the latlngs to the form
        $('.form-area .area-latlngs').val(latlngs);

        editableLayerGroup.addLayer(e.layer);

        map.addLayer(editableLayerGroup);

        // Delete the feature on cancel button
        $('.btn-cancel').on('click', function () {
            
            $('.leaflet-draw-edit-edit').removeClass('visible');

            $('.leaflet-draw-edit-remove').removeClass('visible');

            map.removeLayer(e.layer);
            
        });
        
        sidebar.on('hide', function() {
            
            map.removeLayer(e.layer);
            
        });
        
    }

    // Reactivate default marker event listener and drawing button
    map.on('click', onMapClick);
    
    // $('.btn-draw').removeClass('disabled');  
    
});

// What to do once a shape was edited
// TODO save edited features after edit
// FIXME if the user saves after editing the onMapClick function fails
// FIXME one edit handler during feature creation and one for editing already created features
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
// TODO change to "once" handlers so that only one shape can be drawn before saving
$('.btn-draw-polyline').on('click', function () {
    
    // Stop default marker event listener
    map.off('click', onMapClick);

    // Disable editing for now
    // $('.leaflet-draw-edit-edit').addClass('visible');

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
          opacity: 0.5}
    }).enable();
    
        if ($(window).width() <= 567) {
            
            sidebar.hide();
            
            showAlert('Drawing on mobile is still in development, expect issues.', 'warning', 3500);
            
        }

});

$('.btn-draw-polygon').on('click', function () {
    
    // Stop default marker event listener
    map.off('click', onMapClick);

    // Disable editing for now
    // $('.leaflet-draw-edit-edit').addClass('visible');
    
    $('.leaflet-draw-edit-remove').addClass('visible');

    new L.Draw.Polygon(map, 
      { 
       shapeOptions:{
          color: '#33cccc',
          weight: 5,
          opacity: 0.5},
      showArea: true,
      metric: true,
      clickable: true,
      allowIntersection: false,
             drawError:{
             color: '#cc0000',
             timeout: 2000}
    }).enable();
    
    if ($(window).width() <= 567) {
            
            sidebar.hide();
            
            showAlert('Drawing on mobile is still in development, expect issues.', 'warning', 3500);
            
    }
    
});