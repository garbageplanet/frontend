/*jslint browser: true, white: true, sloppy: true, maxerr: 1000*/

/**
* User actions on the map pane and unsaved markers
*/

// Warn user once if zoom is too far, then warn on map click inside onMapClick()
map.addOneTimeEventListener('zoomend', function (e) {

    if (e.target.getZoom() < 10) {
        
        showAlert("Zoom in closer to create features", "info", 1200);
        
    }
        
});

//MapToOffset//////////////////////////////////////////////////////////
//See license.md in this repo Copyright 2013 Code for America//////////
L.Map.prototype.panToOffset = function (latlng, offset, options) {
    
    var x = this.latLngToContainerPoint(latlng).x - offset[0],
        
        y = this.latLngToContainerPoint(latlng).y - offset[1],
        
        point = this.containerPointToLatLng([x, y]);
    
  return this.setView(point, this._zoom, { pan: options });
    
};

// Adapted functions
function getVerticalOffset() {
    
  var vOffset = [0, 0];
  
  vOffset[1] = - $(window).height() / 4;
    
  vOffset[0] = 0;
  
  return vOffset;
    
}

function getHorizontalOffset() {
    
  var hOffset = [0, 0];
  
  hOffset[0] = - $(window).width() / 5;
    
  hOffset[1] = 0;
  
  return hOffset;
}
//////////////////////////////////////////////////////////////////////

// Create the context menu for mobile / small screens
var featuremenu = L.markerMenu({
    
        radius: 100,
        size: [50, 50],                    
        animate: true,                     
        duration: 200,                    

        items: [
            {
            title: "Mark garbage",
            className: "fa fa-fw fa-2x fa-marker-menu fa-map-marker",
            click: function () {
                sidebar.show($("#create-garbage-dialog").show());
                setTimeout(function () {marker.closeMenu();}, 400);
                }
            }
            ,{
            title: "Create a cleaning event",
            className: "fa fa-fw fa-2x fa-marker-menu fa-calendar-o",
            click: function () {
                sidebar.show($("#create-cleaning-dialog").show());
                setTimeout(function () {marker.closeMenu();}, 400);
                }
            }
            ,{
            title: "Mark litter",
            className: "fa fa-fw fa-2x fa-marker-menu fa-ellipsis-h",
            click: function () {
                sidebar.show($("#create-litter-dialog").show());
                setTimeout(function () {marker.closeMenu();}, 400);
                }
            }
            ,{
            title: "Add an area",
            className: "fa fa-fw fa-2x fa-marker-menu fa-ellipsis-h",
            click: function () {
                sidebar.show($("#create-area-dialog").show());
                setTimeout(function () {marker.closeMenu();}, 400);
                }
            }
        ]
});

// Default behavior for map clicks
function onMapClick(e) {
    
    // check that there's not already something else going on in the UI
    if (!sidebar.isVisible() && 
        !bottombar.isVisible() && 
        e.target.getZoom() >= 10 && 
        !$('.dropdown').hasClass('open') && 
        !$('.leaflet-control-layers').hasClass('leaflet-control-layers-expanded') && 
        !$('.leaflet-control-ocd-search').hasClass('leaflet-control-ocd-search-expanded') &&
        $('.leaflet-control-ocd-search-alternatives').hasClass('leaflet-control-ocd-search-alternatives-minimized') &&
        !$('.leaflet-compact-attribution-toggle').is(':checked') &&
        locationcontrol._active !== true
       ) {
                
        // We need a global object for the marker so that it can be referred during other map interactions
        marker = L.marker(e.latlng, { icon: genericMarker, draggable: true });
        
        // Actions for mobile and small screens
        if ($(window).width() <= 567) {
            
            if (!$('.leaflet-marker-menu').is(':visible')) {

                marker.setMenu(featuremenu);

                map.addLayer(marker).panTo(marker._latlng);

                marker.openMenu();   
                
            }

        }
        
        // Actions for desktop and larger screens      
        if ($(window).width() > 567) {
            
            map.addLayer(marker);

            map.panToOffset(marker._latlng, getHorizontalOffset());

            $('.sidebar-content').hide();

            $('#sidebar').scrollTop = 0;
            
            sidebar.show($("#create-marker-dialog").show());

        }
            
        $('.marker-latlng').val(marker._latlng.lat + ", " + marker._latlng.lng);
                
        function setClassColor(c) {

            return c === 1 ? 'marker-color-limegreen' :
                   c === 2 ? 'marker-color-yellow' : 
                   c === 3 ? 'marker-color-orangered' : 
                   c === 4 ? 'marker-color-red' : 
                             'marker-color-violet'
        };

        // Range selector for amount of garbage on marker icon
        $('input[type=radio]').on('change', function () {
        
            // Remove the generic marker class
            $(marker._icon).removeClass('marker-generic').addClass('marker-garbage');

            // Get the color value from the select options 
            var selectedValue = parseInt($(this).attr('name'), 10);
            // Change the class to the corresponding value

            $(marker._icon).removeClass(function (index, css) {

                return (css.match(/(^|\s)marker-color-\S+/g) || []).join(' ');

            }).addClass(setClassColor(selectedValue));

        });
        
        // Change the cleaning event icon if a time is set
        // FIXME put this logic somewhere else
        $('#event-date-time-picker').on('dp.change', function (e) {

            var eventDateTime = e.date.format('YYYY-MM-DD HH:MM:SS');

            $('#date-time-value').val(eventDateTime);

            // Change the icon of the marker if a time is set
            $(marker._icon).removeClass('marker-color-gray marker-generic').addClass('marker-cleaning marker-color-blue');

        });
    
        // Allow unsaved markers to be dragged and get new coordinates after drag
        marker.on("dragend", function (event){

            var newPos = event.target.getLatLng();

            $('.marker-latlng').val(newPos.lat + ", " + newPos.lng);

        });
  
        // Reset unsaved marker styles if sidebar is closed after marker creation
        sidebar.on ('hide', function () {
            
            if (marker) {
                
                $(marker._icon).removeClass('marker-garbage');

                $(marker._icon).removeClass('marker-cleaning');

                $(marker._icon).removeClass(function (index, css) {

                    return (css.match(/(^|\s)marker-color-\S+/g) || []).join(' ');

                }).addClass('marker-generic');

                $(marker._icon).addClass('marker-color-gray');
                
                // Delete the marker on small screen else the mobile marker menu bugs
                if ($(window).width() <= 567) {

                    map.removeLayer(marker);

                }
                
            }

        });
        
        marker.on('click', onLocalMarkerClick);
    
    } else {
        
        if (e.target.getZoom() < 10) {
        
            showAlert("Zoom in closer to create features", "info", 1200);
        
        }            
        
        locationcontrol.stop();
        
        bottombar.hide();

        sidebar.hide();
        
        $('.dropdown').removeClass('open');

        $('.leaflet-control-layers').removeClass('leaflet-control-layers-expanded');

        $('.leaflet-control-search').removeClass('leaflet-control-search-expanded');
        
        // Reset the search container
        $('.leaflet-control-ocd-search').removeClass('leaflet-control-ocd-search-expanded');
        
        $('.leaflet-control-ocd-search-alternatives').addClass('leaflet-control-ocd-search-alternatives-minimized');
        
        $('.leaflet-control-ocd-search-icon').removeClass('fa-close').addClass('fa-search');
        
        // Hide the expanded atttributions by unchecking the control        
        $(".leaflet-compact-attribution-toggle").prop("checked", false);
              
    }
  
}

// Default behaviour for creating a marker
map.on('click', onMapClick);  

// onClick behavior for non-saved markers
function onLocalMarkerClick (e) {

    bottombar.hide();

    marker = this;
    
    $('.marker-latlng').val(marker._latlng.lat + ", " + marker._latlng.lng);
    
    if ($(window).width() <= 567) {
        
        map.addLayer(marker).panTo(marker._latlng);

        return;

    }
    
    if ($(window).width() > 567) {

        map.panToOffset(marker._latlng, getHorizontalOffset());
        
        $('#sidebar').scrollTop =0;
    
        $('.sidebar-content').hide();
    
        sidebar.show($("#create-marker-dialog").fadeIn());
        
        marker.on("dragend", function(event){
        
            var newPos = event.target.getLatLng();
        
            $('.marker-latlng').val(newPos.lat + ", " + newPos.lng);
                
        });
        
    }
    
};