// Tools and utilities
var tools = {
    makeEllipsis: function(obj, n) {
              return obj.substr(0,n-1)+(obj.length>n?'&hellip;':'');
    }, // credit: http://stackoverflow.com/questions/1199352/smart-way-to-shorten-long-strings-with-javascript/1199420#1199420
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
    checkLayerContents: function(oldl, newl){
        
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
        if (window.innerWidth > 767) { 
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
            // Context menu for mobile / small screens
            radius: 100,
            size: [50, 50],                    
            animate: true,                     
            duration: 200,                    
            items: [
                {   title: 'Mark garbage',
                    className: 'create-dialog fa fa-fw fa-2x fa-marker-menu fa-map-marker',
                    href:'#create-garbage-dialog',
                    // className: 'icon-trashbag',
                    // FIXME, if the link has the create-dialog classe, the shouldnt been need for event listernet function
                    click: function (e) {
                        e.preventDefault();
                        ui.sidebar.show($('#create-garbage-dialog').show());
                    }
                },
                {   title: 'Create a cleaning event',
                    className: 'create-dialog fa fa-fw fa-2x fa-marker-menu fa-calendar-o',
                    href:'create-cleaning-dialog',
                    click: function (e) {
                        e.preventDefault();
                        ui.sidebar.show($('#create-cleaning-dialog').show());
                        // FIXME how to access marker menu from here?
                        // setTimeout(function () {marker.closeMenu();}, 400);
                    }
                },
                {   title: 'Mark litter',
                    className: 'create-dialog fa fa-fw fa-2x fa-marker-menu fa-ellipsis-h',
                    href:'create-litter-dialog',
                    click: function (e) {
                        e.preventDefault();
                        // ui.sidebar.show($('#create-litter-dialog').show());
                        // setTimeout(function () {marker.closeMenu();}, 400);
                    }
                },
                {   title: 'Fetch from link',
                    className: 'modal-link modal-link-og fa fa-fw fa-2x fa-marker-menu fa-link',
                    href:'',
                    click: function (e) {
                        e.preventDefault();
                        $('.modal-link-og').click();
                    }
                }
            ],
        }),
    clearTempMarkerStyle: function(id) {
                  
        if (id || id !== undefined) {
            
            // var marker = maps.unsavedLayerGroup.getLayer(id);
            var marker = actions.tempmarkers[id],
                markericon = $(marker._icon);

            markericon.removeClass('marker-garbage');
            markericon.removeClass('marker-cleaning');
            markericon.removeClass(function (index, css) {
                return (css.match(/(^|\s)marker-color-\S+/g) || []).join(' ');
            }).addClass('marker-generic');
            markericon.addClass('marker-color-gray');
            // Delete the marker on small screen else the mobile marker menu bugs
            if ($(window).width() <= 567) {
                maps.map.removeLayer(marker);
            }
        }
    },
    bindTempMarkerEvents: function(id) {
        
        var marker = actions.tempmarkers[id],
            menubacklink = $('.menu-backlink'),
            cancelbutton = $('.btn-cancel');
        
        ui.sidebar.on ('hide', function() {
            tools.clearTempMarkerStyle(id);
        });

        menubacklink.click(function(e) {
             e.preventDefault();
            // Remove the styling for temp markers
            tools.clearTempMarkerStyle(id);
        });
        
        // Close sidebar if cancel button clicked
        cancelbutton.on('click', function (e){
            e.preventDefault();
            ui.sidebar.hide();
            tools.clearTempMarkerStyle(id);
            maps.map.removeLayer(marker);
        }); 
    },
    checkOpenUiElement: function(map){
        
        var compactattributions = $('.leaflet-compact-attribution-toggle'),
            ocdsearch = $('.leaflet-control-ocd-search'),
            dropdown = $('.dropdown'),
            layerscontrol = $('.leaflet-control-layers');
        
        if (ui.sidebar.isVisible() ){
            ui.sidebar.hide();
            return;
        }    
            
        if (ui.bottombar.isVisible()) {
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
        
        return true;
    },
    version: function() {
        return '0.3.0'
    },
    coordsinhrf: window.location.href.match(/[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)\/*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)/),
    token: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOjYsImlzcyI6Imh0dHA6XC9cL2FwaS5nYXJiYWdlcGxhLm5ldFwvYXBpXC9hdXRoZW50aWNhdGUiLCJpYXQiOiIxNDQ2OTAxNTcxIiwiZXhwIjoiMTQ0NjkwNTE3MSIsIm5iZiI6IjE0NDY5MDE1NzEiLCJqdGkiOiJhMzljOTg1ZDZmNWNjNmU4MGNlMmQzOWZjODg5NWM1YSJ9.R28VF7VI1S3-PpvaG6cjpyxpygvQCB0JXF5oQ27TxCw',
    ogDotIoScraper: function(url) {

        var ogdotiotoken = '5899e0ad4c09780e001df53b';

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
                    // actions.passMarkerToForm(newobj);
                }
                else { return; }
          });
        }
      
        else {  
            alerts.showAlert(5, "warning", 2000);
            return;
        }
    }
};