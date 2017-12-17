/* jslint browser: true, white: true, sloppy: true, maxerr: 1000 */
/* global L, $, tools, alerts, api, ui, maps */

/**
* All code related to drawing shapes
*/

var drawing = (function () {

    'use strict';

    var drawControl = new L.Control.Draw({

        position: 'topright',
        draw: {
            circle: false,
            rectangle: false,
            marker: false
        }
    });

    // TODO extract polygon and polyline - specific code
    function _bindEvents (type) {

        // type = 'polyline' | 'polygon'

        var buttonDraw   = $('.btn-draw');
        var buttonCancel = $('.btn-cancel');

        var polylineListener = new L.Draw.Polyline(maps.map, {
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

        var polygonListener = new L.Draw.Polygon(maps.map, {
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

        buttonDraw.on('click', function(e) {

            maps.map.off('click', actions.mapClick);

            if ($(this).attr('name') === 'polyline') {
                polylineListener.enable();
            }

            if ($(this).attr('name') === 'polygon') {
                polygonListener.enable();
            }
        });

        // Disable start drawing buttons
        maps.map.on('draw:drawstart', function (e) {
            buttonDraw.addClass('disabled');
        });

        // Reactivate map lcik listeners once drawing is done
        maps.map.on('draw:drawstop', function () {

            maps.map.off('click', actions.mapClick);
            maps.map.on('click', actions.mapClick);
        });
        // What to do once a shape is created
        maps.map.on('draw:created', function (e) {

            var latlngs = e.layer.getLatLngs().toString().replace(/\(/g, '[').replace(/\)/g, ']').replace(/LatLng/g, ''),
                polylineLayer,
                polygonLayer;

            // Add the latlngs to the form
            $('.latlngs').val(latlngs);

            maps.map.fitBounds(e.layer.getBounds(), {paddingBottomRight: [300,0]});

            maps.map.addLayer(e.layer);

            if ( e.layerType === 'polyline' ) {

                polylineLayer = e.layer;

                // Range slider for amount of garbage on polyline
                $('input[type=radio]').on('change', function () {

                    // Get the color value from the select options
                    var selectedValue = parseInt($(this).attr('value'), 10);
                   // Set the color of the line
                    e.layer.setStyle({color: tools.setPolylineColor(selectedValue)});
                });
            }

            if ( e.layerType === 'polygon' ) {

                polygonLayer = e.layer;
            }

            // Reactivate default marker event listener and drawing button
            maps.map.on('click', actions.mapClick);

            // Delete the feature on cancel button
            buttonCancel.on('click', function () {

                maps.map.removeLayer(e.layer);
                polylineListener.disable();
                polygonListener.disable();
            });

            ui.sidebar.on('hide', function() {

                maps.map.removeLayer(e.layer);
            });

          // return {
          //     polylinelayer: polylineLayer,
          //     polygonlayer: polygonLayer
          // };
        });
      }

      function init (type) {
          // drawing apabilities are only called when the forms are loaded in /js/forms.js
          maps.map.addControl(drawControl);
          _bindEvents(type);
      }

    function _bindPolygonEvents () {}

    function _bindPolylineEvents () {}

    return {   init        : init
             , drawControl : drawControl
            };
}());
