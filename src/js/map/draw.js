/*jslint browser: true, white: true, sloppy: true, maxerr: 1000*/

/**
* All code related to drawing shapes
* TODO only load if not mobile
*/

var drawing = (function() {
  
    'use strict';
    
    var drawControl = new L.Control.Draw({
    
            position: 'topright',
            draw: { 
                circle: false,
                rectangle: false,
                marker: false 
            },
        }),
        _bindEvents = function() {
            var buttonDraw = $('.btn-draw'),
                buttonCancel = $('.btn-cancel'),
                buttonDrawEdit = $('.leaflet-draw-edit-edit'),
                buttonDrawRemove = $('.leaflet-draw-edit-remove'),
                buttonDrawPolyline = $('.btn-draw-polyline'),
                buttonDrawPolygon = $('.btn-draw-polygon');
            var polylineListener = new L.Draw.Polyline(maps.map, 
                  { 
                    allowIntersection: false,
                       drawError: {
                       color: '#cc0000',
                       timeout: 2000
                       },
                    metric: true,
                    clickable: true,
                    shapeOptions: {
                      color: '#A9A9A9',
                      weight: 10,
                      opacity: 0.5
                    }
            });
            var polygonListener = new L.Draw.Polygon(maps.map, 
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
            });
          
            buttonDrawPolyline.on('click', function() {

                // Stop default marker event listener
                maps.map.off('click', actions.mapClick);
                polylineListener.enable();

                // Disable editing for now
                // $('.leaflet-draw-edit-edit').addClass('visible');

                $('.leaflet-draw-edit-remove').addClass('visible');


                if (window.isMobile) {

                    ui.sidebar.hide();
                    alerts.showAlert(14, 'warning', 3500);
                }
            });
            buttonDrawPolygon.on('click', function() {

                // Stop default marker event listener
                maps.map.off('click', actions.mapClick);
                polygonListener.enable();
                $('.leaflet-draw-edit-remove').addClass('visible');

                if (window.isMobile) {
                        ui.sidebar.hide();
                        alerts.showAlert(14, 'warning', 3500);  
                }
            });
          
            maps.map.on('draw:drawstart', function(e) {

                var type = e.layerType,
                    layer = e.layer;

                console.log(actions.tempmarkers);
              
                // Disable start drawing buttons
                // TODO entirely disable handlers
                buttonDraw.addClass('disabled');
            });
            // Stop click listeners when editing and deleting features
            // TODO remove these as editing / deleting unsvaed shapes isn't implemented yet
            maps.map.on('draw:editstart', function(e) {
              
                maps.map.off('click', actions.mapClick);

                $('.btn-draw').addClass('disabled');

                // litterLayerGroup.off('click', onPathClick);
                // areaLayerGroup.off('click', onAreaClick);
            });
            maps.map.on('draw:editstop', function(e) { 

                // $('.btn-draw').removeClass('disabled');

                $('.leaflet-draw-edit-edit').removeClass('visible');

                $('.leaflet-draw-edit-remove').removeClass('visible');

                // litterLayerGroup.off('click', onPathClick);
                // areaLayerGroup.off('click', onAreaClick);
            });
            maps.map.on('draw:deletestart', function(e) { 

                maps.map.off('click', actions.mapClick);

                $('.btn-draw').addClass('disabled');

                // litterLayerGroup.off('click', onPathClick);
                // areaLayerGroup.off('click', onAreaClick);
            });
            maps.map.on('draw:deletestop', function(e) {

                maps.map.on('click', actions.mapClick);

                // $('.btn-draw').removeClass('disabled');
                buttonDrawEdit.removeClass('visible');
                buttonDrawRemove.removeClass('visible');
                // litterLayerGroup.off('click', onPathClick);
                // areaLayerGroup.off('click', onAreaClick);
            });
            // Need to make sure the user can click again on the map if the drawing is aborted
            // This needs to be called in this fashion else it messes up actions.mapClick()'s behavior
            maps.map.on('draw:drawstop', function() {

                maps.map.off('click', actions.mapClick);

                maps.map.on('click', actions.mapClick);

                // $('.btn-draw').removeClass('disabled');

            });
            // What to do once a shape is created
            maps.map.on('draw:created', function(e) {

                var latlngs = e.layer.getLatLngs().toString().replace(/\(/g, '[').replace(/\)/g, ']').replace(/LatLng/g, ''),
                    polylineLayer, 
                    polygonLayer;

                if (e.layerType === 'polyline') {

                    // Show the sidebar again on mobile
                    if (window.isMobile) {

                        ui.sidebar.show($("#create-litter-dialog").show());
                    }

                    polylineLayer = e.layer;
                    maps.map.fitBounds(e.layer.getBounds(), {paddingBottomRight: [300,0]});
                    // push the latlngs to the form
                    $('.litter-latlngs').val(latlngs);
                    // Range slider for amount of garbage on polyline
                    $('input[type=radio]').on('change', function () {

                        // Get the color value from the select options
                        var selectedValue = parseInt($(this).attr('value'), 10);
                       // Set the color of the line
                        e.layer.setStyle({color: tools.setPolylineColor(selectedValue)});
                    });

                    // editableLayerGroup.addLayer(e.layer);

                    maps.map.addLayer(e.layer);
                }

                if( e.layerType === 'polygon') {

                    // Show the sidebar again on mobile    
                    if (window.isMobile) {

                        ui.sidebar.show($("#create-area-dialog").show());
                    }

                    polygonLayer = e.layer;
                    maps.map.fitBounds(e.layer.getBounds(), {paddingBottomRight: [300,0]});
                    // push the latlngs to the form
                    $('.form-area .area-latlngs').val(latlngs);
                    // editableLayerGroup.addLayer(e.layer);
                    maps.map.addLayer(e.layer);

                    // Delete the feature on cancel button
                    buttonCancel.on('click', function () {

                        buttonDrawEdit.removeClass('visible');
                        buttonDrawRemove.removeClass('visible');
                        maps.map.removeLayer(e.layer);
                    });

                    ui.sidebar.on('hide', function() {

                        maps.map.removeLayer(e.layer);
                    });
                    
                }

                // Reactivate default marker event listener and drawing button
                maps.map.on('click', actions.mapClick);

                // TODO set listeners somewhere else
                // Delete the feature on cancel button
                buttonCancel.on('click', function () {
                    buttonDrawEdit.removeClass('visible');
                    buttonDrawRemove.removeClass('visible');
                    maps.map.removeLayer(e.layer);
                    polylineListener.disable();
                    polygonListener.disable();
                });

                ui.sidebar.on('hide', function() {
                    maps.map.removeLayer(e.layer);
                });

              return {
                  polylinelayer: polylineLayer,
                  polygonlayer: polygonLayer
              };
            });
            // What to do once a shape was edited
            // TODO save edited features after edit
            // FIXME if the user saves after editing the actions.mapClick() function fails
            // FIXME one edit handler during feature creation and one for editing already created features
            maps.map.on('draw:edited', function(e) {

                var layers = e.layers;

                layers.eachLayer(function(layer) {

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
                maps.map.on('click', actions.mapClick());

            });
            // Own handlers for calling L.Draw
            // TODO change to "once" handlers so that only one shape can be drawn before saving
        },
        init = function() {
            // drawing apabilities are only called when the forms are loaded in /js/forms.js
            maps.map.addControl(drawControl);
            _bindEvents();
        };

    return {
        init: init,
        drawControl: drawControl
    };
}());