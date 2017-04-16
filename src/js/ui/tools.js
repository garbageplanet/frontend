/*jslint browser: true, white: true, sloppy: true, maxerr: 1000 global tools */

/**
  * @namespace jQuery.fn.serializeObject
  * @method serializeObject()
  * @returns {object} aggregated object - when called on a selection of inputs in a form, returns an object. Name attributes become keys and value attributes become values.
  * @see https://gist.github.com/dshaw/449041
  * @requires jQuery
  */
$.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};
/**
  * @namespace Leaflet.LatLngBounds.prototype.toBBoxStringInverse
  * @method toBBoxStringInverse()
  * @returns {object} string object - the bounding box coordinates returned by default by Leaflet 
                      are not in the order expected for making postGRE bounding box requests in the backend.
  * @requires Leaflet
  */
L.LatLngBounds.prototype.toBBoxStringInverse = function() {
    return [this.getSouth(), this.getWest(), this.getNorth(), this.getEast()].join(',');
};
/**
  * @namespace Leaflet.Map.prototype.panToOffset
  * @method panToOffset()
  * @returns {object} coordinate string object
  * @param {object} latlng - [lat, lng] Leaflet coordinates object or array 
  * @param {array} offset - [x, y] offset by which the map should be moved
  * @param {string} zoom - level to use
  * @param {object} options - leaflet options to pass to the function
  * @requires Leaflet
  * @author louh@github
  * @copyright Copyright (c) 2013, Code for America
  * @see LICENSE.md
  */
L.Map.prototype.panToOffset = function(latlng, offset, zoom, options) {

    var x = this.latLngToContainerPoint(latlng).x - offset[0],
        y = this.latLngToContainerPoint(latlng).y - offset[1],
        point = this.containerPointToLatLng([x, y]);

    if (zoom) {
        return this.setView(point, zoom, {pan: options});
    } else {
        return this.setView(point, this._zoom, {pan: options});
    }
};

/**
  * Tools an utilities.
  * @namespace tools
  * @name tools
  * @type {Object} 
  */
var tools = {
/**
  * @namespace tools.makeEllipsis
  * @method makeEllipsis()
  * @param {obj} object - the string to shorten.
  * @param {n} integer - the length of the final shortened string.
  * @returns {string} shortened string - returns an inputed string with ellipsis (...)
  * @see http://stackoverflow.com/questions/1199352/smart-way-to-shorten-long-strings-with-javascript/1199420#1199420
  */
    makeEllipsis: function(obj, n) {
        return obj.substr(0,n-1)+(obj.length>n?'&hellip;':'');
    },
 /**
   * @namespace tools.insertString
   * @method insertString()
   * @param {obj} object - the string to modify.
   * @param {index} integer - the position in the string where a character is to be inserted.
   * @param {string} string - the string to be added to the original string.
   * @returns {string} modified string - returns the inputed string with added string.
   */
    insertString: function(obj, index, string) {
        if (index > 0) {
            return obj.substring(0, index) + string + obj.substring(index, obj.length);
        } else {
            return string + obj;
        }
    },
    setMarkerClassColor: function(c) {

        return c === 1  ? 'marker-color-limegreen'  :
               c === 2  ? 'marker-color-yellow'     :
               c === 3  ? 'marker-color-orangered'  :
               c === 4  ? 'marker-color-red'        :
                          'marker-color-violet'     ;
    },
    setPolylineColor: function(c) {

        return c === 1  ? '#ccff66' :
               c === 2  ? '#ffff00' :
               c === 3  ? '#FF4500' :
               c === 4  ? '#ff1a1a' :
                          '#e60073' ;
    },
    setTodoFullText: function(t) {

        return t == 1  ? ' it has been cleaned up already'  :
               t == 2  ? ' need help to clean it up'        :
               t == 3  ? ' full bags need to be collected'  :
               t == 4  ? ' a cleaning needs to be organized':
                         ' tell the local authorities'      ;
    },
    getCurrentBounds: function() {
        var bounds = maps.map.getBounds().toBBoxStringInverse();
        return bounds;
    },
    cloneLayer: function(layer) {
        
        /** 
        * stripped down version of original function by @jieter
        * @see github.com/jieter/leaflet-clonelayer
        * @note unlicensed
        */
        var options = layer.options;

        // Marker layers
        if (layer instanceof L.Marker) {
            return L.marker(layer.getLatLng(), options);
        }

        // Vector layers
        if (layer instanceof L.Polygon) {
            return L.polygon(layer.getLatLngs(), options);
        }
        if (layer instanceof L.Polyline) {
            return L.polyline(layer.getLatLngs(), options);
        }

        // layer/feature groups
        if (layer instanceof L.LayerGroup || layer instanceof L.FeatureGroup) {
            var layergroup = L.layerGroup();
            layer.eachLayer(function (inner) {
                layergroup.addLayer(tools.cloneLayer(inner));
            });
            return layergroup;
        }

        throw 'Unknown layer, cannot clone this layer';  
    },
    checkLayerContents: function(oldl, newl) {
        
        // FIXME this doesn't work because markers lose their event listerners and icons
        // If the non-temp layer is empty get the fetched data into it
        if (oldl.getLayers().length < 1){
                        
            oldl.clearLayers();
            map.removeLayer(oldl);
            oldl = tools.cloneLayer(newl);
            newl.clearLayers();            
            map.removeLayer(newl);
            oldl.addTo(map);
            return;
        }

        // If the non-temp layer isn't empty, compare contents
        if (oldl.getLayers().length > 0) {
            
            if (JSON.stringify(newl.getLayers()) !== JSON.stringify(oldl.getLayers())) {
                
                map.removeLayer(oldl);
                oldl.clearLayers();
                oldl = this.cloneLayer(newl);
                oldl.addTo(map);
                map.removeLayer(newl);
                newl.clearLayers();
                return;
                
            } else {
                return;
            }
        }
    },
    getVerticalOffset: function() {
    
        var vOffset = [0, 0];
        // TODO take in account the topbar for offsetting on larger screens
        // TODO do this dynamically
        if (!window.isMobile) { 
            vOffset[1] = - $(window).height() / 4 + 20; 
        }

        // not needed on mobile
        else {
            vOffset[1] = - $(window).height() / 4;
        }

        return vOffset;
    },
    getHorizontalOffset: function() {
    
        var hOffset = [0, 0];
        hOffset[0] = - $(window).width() / 6;
        return hOffset;
    },
    getAllFeatures: function() {
        // Credit to https://github.com/kedar2a
        // http://stackoverflow.com/a/24342585

        var allMarkersObjArray = []; // for marker objects
        var allMarkersGeoJsonArray = []; // for readable geoJson markers

        $.each(maps.map._layers, function (ml) {

            if (maps.map._layers[ml].feature) {

                allMarkersObjArray.push(this)
                allMarkersGeoJsonArray.push(JSON.stringify(this.toGeoJSON()))
            }
        });

        console.log(allMarkersObjArray);
    },
    resetIconStyle: function(id) {
      
        /*console.log('*******************');
        console.log(actions.tempmarkers);
        console.log('*******************');*/
                  
        if (id > 0 && (id || typeof id != 'undefined')) {
            // console.log('id from resetIconStyle: ', id)
            // var marker = maps.unsavedLayerGroup.getLayer(id);
            var marker = actions.tempmarkers[id];
            // console.log('marker obj: ', marker);
            var markericon = $(marker._icon) || 'undefined';

            if (markericon || typeof markericon != 'undefined') {
                markericon.removeClass('marker-garbage');
                markericon.removeClass('marker-cleaning');
                markericon.removeClass(function(index, css) {
                    return (css.match(/(^|\s)marker-color-\S+/g) || []).join(' ');
                }).addClass('marker-generic');
                markericon.addClass('marker-color-gray');
            }

            // Delete the marker on small screen else the mobile marker menu bugs
            if (window.isMobile) {
              
                if (marker._menu) {
                  
                    marker.closeMenu();
                  
                }
              
                // Check that the marker is still here
                // Drawing form delete the marker right away
                if (marker) {
                    maps.map.removeLayer(marker);
                }
            }
          
            return;
        }
        // Return false if 
        return false;
    },
    bindTempMarkerEvents: function(id) {
        
        var marker = actions.tempmarkers[id];
        var cancelbutton = $('.btn-cancel');
        
        ui.sidebar.on ('hide', function() {
            tools.resetIconStyle(id);
        });

        $('.menu-backlink').click(function(e) {
             e.preventDefault();
            // Remove the styling for temp markers
            tools.resetIconStyle(id);
        });
        
        // Close sidebar if cancel button clicked
        cancelbutton.on('click', function (e){
            e.preventDefault();
            ui.sidebar.hide();
            if (id) {
                tools.resetIconStyle(id);
                maps.map.removeLayer(marker);
            }
            else { maps.unsavedMarkersLayerGroup.clearLayers() }

        }); 
    },
    checkOpenUiElement: function(map){
        
        // TODO can we make the same function with a switch statement?
        // that would require to set states in the UI
        var compactattributions = $('.leaflet-compact-attribution-toggle'),
            ocdsearch = $('.leaflet-control-ocd-search'),
            dropdown = $('.dropdown'),
            layerscontrolbutton = $('.leaflet-control-layers');
        
        if (ui.sidebar.isVisible()) {
            ui.sidebar.hide();
            return;
        }    
            
        if (ui.bottombar.isVisible()) {
            // TODO check if we are drawing if unfinished, ask user if he wants to cancel
            ui.bottombar.hide();
            return;
        }       
        if (dropdown.hasClass('open')) {
            dropdown.removeClass('open');
            return;
        } 
        // Custom code added in leaflet (edited out in L.Control.Layers), so the map click is bound here here
        if ( !maps.layerscontrol.options.iscollapsed || $(layerscontrolbutton).hasClass('leaflet-control-layers-expanded')) {
            console.log('layers control collapsing from ui check open elements');
            maps.layerscontrol.collapse();
            return;
        }
        // Somehow checking the collapsed property of the control doesn't work?
        // if (!maps.geocodercontrol.options.collapsed) {
        if (ocdsearch.hasClass('leaflet-control-ocd-search-expanded')) {
            maps.geocodercontrol._collapse();
            L.DomEvent.stopPropagation(map);
            // Force closing softkeyboard
            $('.leaflet-control-ocd-search-form input').blur();
            return;
        }
        if (maps.locationcontrol._active || maps.locationcontrol._marker) {
            maps.locationcontrol.stop();
            return;
        }
        if (compactattributions.is(':checked')) {
            compactattributions.prop('checked', false);  
            return;
        }
        // Check the current zoom level and warn the user
        if (map) {
            // If the map itself isn't the target it means a marker cluster was clicked
            if (!map.target) {
                if (map._zoom < 15) {
                    return;
                }
            }
            if (map.target) {
                if (map.target.getZoom() < 15) {
                    alerts.showAlert(15, 'info', 1200);
                    return;
                }
            }
        }
        // Check if there's any marker visible on mobile map
        if (window.isMobile) {
            if (maps.unsavedMarkersLayerGroup.length > 0) {
                maps.map.clearLayers(maps.unsavedMarkersLayerGroup);
                return;
            }
        }
        
        return true;
    },
 /**
   * @namespace tools.coordsinhrf - regex to check if
   * @see http://stackoverflow.com/a/18690202/2842348
   * @author Iain Fraser
   * @license MIT
   */
    coordsinhrf: window.location.href.match(/[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)\/*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)/),
   /**
   * @namespace tools.token - the app token to talk to the backend.
   */
    token: '@@windowtoken',
    ogDotIoScraper: function(url) {

        // var token = '@@opengraphiotoken'; 
        var ogdotiotoken = '5899e0ad4c09780e001df53b';

        if (url) {
            var callurl = 'https://opengraph.io/api/1.0/site/' + encodeURIComponent(url);
            var request = $.ajax({
                method: 'GET',
                url: callurl,
                data: jQuery.param({'app_id': token}),
                success: function(data) {
                    console.log('ajax call pass', data);
                    if (data.error) {
                        alerts.showAlert(5, "danger", 3000);
                        return;
                    }
                    if (data.openGraph.error = 'null' || !data.openGraph.error){
                        console.log('Successfully retrieved OG data');
                    }
                },
                error: function() {
                    console.log('Error fetching og data');
                    return;
                }
            });
          
            // Push the openg raph data to the modal
            request.done(function(data) {
              
                console.log("request.done", data);
                if (!data.error){
                    // Load the data into the template
                    var ogcontent = document.getElementById('og-content').innerHTML = tmpl('tmpl-modal-og', data);
                    $('#modal-og-submit').removeClass('hidden');

                    // TODO pass marker to forms with map.center() as coordinates
                    console.log(data);
                    saving.saveOpenGraph(data);
                }
                else { return; }
          });
        }
      
        else {  
            alerts.showAlert(5, "warning", 2000);
            return;
        }
    },
 /**
   * @namespace tools.randomString
   * @method randomString()
   * @returns {string} radnom string - Returns a random alphanumeric string [a-z][A-Z][0-9] of determined length
   * @param {string} len - Length of the string to be returned
   * @requires Leaflet
   */
    randomString: function(len) {
        var a = ' ',
            b = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        for( var i=0; i < len; i++ ) {
            a += b.charAt(Math.floor(Math.random() * b.length));
        }
        return a; 
    },
 /**
   * @namespace tools.mobileCheck
   * @method mobileCheck()
   * @returns {boolean} true - Returns true if the device on which the site is loaded passes the L.Browser leaflet mobile check.
   * @requires Leaflet
   */
};

// Check if mobile device on load
window.isMobile = L.Browser.mobile;
console.log("On mobile device: ", window.isMobile);