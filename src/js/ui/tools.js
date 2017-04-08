/*jslint browser: true, white: true, sloppy: true, maxerr: 1000 global tools */

/**
 * Tools an utilities.
 * @namespace tools
 * @name tools
 * @type {Object}
 * @returns 
 * @method
 * @param {string} title - The title of the book.
 * @param {string} author - The author of the book.
 * @see 
 */

var tools = {
    /**
   * @namespace tools.makeEllipsis
   * @method makeEllipsis()
   * @param {obj} object - The string to shorten.
   * @param {n} n - The length of the final shortened string.
   * @returns {string} shortened string - returns an inputed string with ellipsis (...)
   * @see http://stackoverflow.com/questions/1199352/smart-way-to-shorten-long-strings-with-javascript/1199420#1199420
   */
    makeEllipsis: function(obj, n) {
        return obj.substr(0,n-1)+(obj.length>n?'&hellip;':'');
    },
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
    setTodoFullText: function(t) {

        return t == 1  ? ' it has been cleaned up already'  :
               t == 2  ? ' need help to clean it up'        :
               t == 3  ? ' full bags need to be collected'  :
               t == 4  ? ' a cleaning needs to be organized':
                         ' tell the local authorities'      ;
    },
    setPolylineColor: function(c) {

        return c === 1  ? '#ccff66' :
               c === 2  ? '#ffff00' :
               c === 3  ? '#FF4500' :
               c === 4  ? '#ff1a1a' :
                          '#e60073' ;
    },
    getCurrentBounds: function() {
        var bounds = maps.map.getBounds().toBBoxStringInverse();
        return bounds;
    },
    cloneLayer: function(layer) {
        
        // stripped down version of original function by @jieter
        // github.com/jieter/leaflet-clonelayer
        // unlicensed
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
        
        // FIXME, this doesn't work because markers lose their event listerners and icons
        
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
    mobileMarkerMenu: L.markerMenu({
        // Marker context menu for mobile
        radius: 100,
        size: [50, 50],                    
        animate: true,                     
        duration: 200,                    
        items: [
            {   title: 'Mark garbage',
                className: 'create-dialog fa fa-fw fa-2x fa-marker-menu fa-map-marker',
                href:'create-garbage-dialog',
                click: function (e) {
                    e.preventDefault();
                    ui.sidebar.show($('#create-garbage-dialog').show());
                    // Restore main map click event listener
                    maps.map.on('click', actions.mapClick);
                }
            },
            {   title: 'Create a cleaning event',
                className: 'create-dialog fa fa-fw fa-2x fa-marker-menu fa-calendar-o',
                href:'create-cleaning-dialog',
                click: function (e) {
                    e.preventDefault();
                    ui.sidebar.show($('#create-cleaning-dialog').show());
                    // Restore main map click event listener
                    maps.map.on('click', actions.mapClick);
                }
            },
            {   title: 'Mark litter',
                className: 'create-dialog fa fa-fw fa-2x fa-marker-menu fa-ellipsis-h',
                href:'create-litter-dialog',
                click: function (e) {
                    e.preventDefault();
                    ui.sidebar.show($('#create-litter-dialog').show());
                    // Restore main map click event listener
                    maps.map.on('click', actions.mapClick);
                }
            },
            {   title: 'Fetch from link',
                className: 'modal-link modal-link-og fa fa-fw fa-2x fa-marker-menu fa-link',
                href:'',
                click: function (e) {
                    e.preventDefault();
                    // Simulate click on modal link
                    $('.modal-link-og').click();
                    // Restore main map click event listener
                    maps.map.on('click', actions.mapClick);
                }
            }
        ],
    }),
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
        var menubacklink = $('.menu-backlink');
        var cancelbutton = $('.btn-cancel');
        
        ui.sidebar.on ('hide', function() {
            tools.resetIconStyle(id);
        });

        menubacklink.click(function(e) {
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
        
        var compactattributions = $('.leaflet-compact-attribution-toggle'),
            ocdsearch = $('.leaflet-control-ocd-search'),
            dropdown = $('.dropdown'),
            layerscontrol = $('.leaflet-control-layers');
        
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
        if (!maps.layerscontrol.options.collapsed || layerscontrol.hasClass('leaflet-control-layers-expanded')) {
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
    coordsinhrf: window.location.href.match(/[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)\/*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)/),
   /**
   * @namespace tools.token - the base token to talk to the api endpoints
   */
    token: '@@windowtoken',
    ogDotIoScraper: function(url) {

        var ogdotiotoken = '@@opengraphiotoken';

        if (url) {
            var callurl = 'https://opengraph.io/api/1.0/site/' + encodeURIComponent(url);
            var request = $.ajax({
                method: 'GET',
                url: callurl,
                data: jQuery.param({'app_id': ogdotiotoken}),
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
                    // build a new object from data
                    // saving.saveGarbage(newobj);
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
    mobileCheck: function(){
      
        var mobilecheck = L.Browser.mobile;

        if (mobilecheck) {
            return true;
        }
        if (!mobilecheck) {
            return false;
        }      
    }
};
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

// Check if mobile device on load
window.isMobile = tools.mobileCheck();
console.log("On mobile device: ", window.isMobile);