/*jslint browser: true, white: true, sloppy: true, maxerr: 1000*/

// Warn user once if zoom is too far
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
function _getVerticalOffset() {
    
  var vOffset = [0, 0];
  
  vOffset[1] = - $(window).height() / 4;
    
  vOffset[0] = 0;
  
  return vOffset;
    
}

function _getHorizontalOffset() {
    
  var hOffset = [0, 0];
  
  hOffset[0] = - $(window).width() / 5;
    
  hOffset[1] = 0;
  
  return hOffset;
}
//////////////////////////////////////////////////////////////////////

// Default behavior for map clicks
function onMapClick(e) {
    
    if (!sidebar.isVisible() && !bottombar.isVisible() && e.target.getZoom() >= 10 && !$('.dropdown').hasClass('open') && !$('.leaflet-control-layers').hasClass('leaflet-control-layers-expanded') && !$('.leaflet-control-search').hasClass('leaflet-control-search-expanded')) {
        
        marker = L.marker(e.latlng, {
            
        icon: genericMarker,
            
        draggable: true
            
        }).on('click', onLocalMarkerClick).addTo(map);
    
    $('.marker-lat').val(marker._latlng.lat);

    $('.marker-lng').val(marker._latlng.lng);

    if ($(window).width() >= 567) {
        
        map.panToOffset(marker._latlng, _getHorizontalOffset());
        
    } 
      
    $('.sidebar-content').hide();

    $('#sidebar').scrollTop = 0;

    sidebar.show($("#create-marker-dialog").show());

    // Range slider for amount of garbage on marker icon
    $('.garbage-range-input').on('change', function () {
        
        // Remove the generic marker class
        $(marker._icon).removeClass('marker-generic').addClass('marker-garbage');
        
        $('.garbage-range-value').html(this.value);
        
        // Get the color value from the select options and add corresponding class to the icon
        var selectedValue = parseInt($(this).val(), 10);
        
        switch (selectedValue) {
                
            case 1:
                $(marker._icon).removeClass(function (index, css) {
                  return (css.match(/(^|\s)marker-color-\S+/g) || []).join(' ');
                }).addClass('marker-color-green');
                break;
                
            case 2:
                $(marker._icon).removeClass(function (index, css) {
                  return (css.match(/(^|\s)marker-color-\S+/g) || []).join(' ');
                }).addClass('marker-color-limegreen');
                break;
                
            case 3:
                $(marker._icon).removeClass(function (index, css) {
                 return (css.match(/(^|\s)marker-color-\S+/g) || []).join(' ');
                }).addClass('marker-color-yellow');
                break;
                
            case 4:
                $(marker._icon).removeClass(function (index, css) {
                 return (css.match(/(^|\s)marker-color-\S+/g) || []).join(' ');
                }).addClass('marker-color-gold');
                break;
                
            case 5:
                $(marker._icon).removeClass(function (index, css) {
                  return (css.match(/(^|\s)marker-color-\S+/g) || []).join(' ');
                }).addClass('marker-color-orange');
                break;
                
            case 6:
                $(marker._icon).removeClass(function (index, css) {
                 return (css.match(/(^|\s)marker-color-\S+/g) || []).join(' ');
                }).addClass('marker-color-orangered');
                break;
                
            case 7:
                $(marker._icon).removeClass(function (index, css) {
                 return (css.match(/(^|\s)marker-color-\S+/g) || []).join(' ');
                }).addClass('marker-color-red');
                break;
                
            case 8:
                $(marker._icon).removeClass(function (index, css) {
                 return (css.match(/(^|\s)marker-color-\S+/g) || []).join(' ');
                }).addClass('marker-color-darkred');
                break;
                
            case 9:
                $(marker._icon).removeClass(function (index, css) {
                  return (css.match(/(^|\s)marker-color-\S+/g) || []).join(' ');
                }).addClass('marker-color-purple');
                break;
                
            case 10:
                $(marker._icon).removeClass(function (index, css) {
                 return (css.match(/(^|\s)marker-color-\S+/g) || []).join(' ');
                }).addClass('marker-color-black');
                break;
                
            default:
                $(marker._icon).removeClass(function (index, css) {
                  return (css.match(/(^|\s)marker-color-\S+/g) || []).join(' ');
                }).addClass('marker-color-unknown');
                break;
                
          }
        
    });
        
    // Change the cleaning event icon if a time is set
    $('#event-date-time-picker').on('dp.change', function (e) {
        
        var eventDateTime = e.date.format('DD/MM/YYYY HH:MM');
        
        $('.date-time-value').val(eventDateTime);
        
        // Change the icon of the marker if a time is set
        $(marker._icon).removeClass('marker-color-gray marker-generic').addClass('marker-cleaning marker-color-coral');

    });
    
    // Allow unsaved markers to be dragged and get new coordinates after drag
    marker.on("dragend", function (event){
        
        var newPos = event.target.getLatLng();

        console.log("dragged marker id:", event.target._leaflet_id );

        $('.marker-lat').val(newPos.lat);

        $('.marker-lng').val(newPos.lng);
        
    });

    // Remove the point marker if the user wants to draw
    map.on('draw:drawstart', function (e) {
        
        map.removeLayer(marker);
        
    });
  
    // Reset unsaved marker styles if sidebar is closed after marker creation
    sidebar.on ('hide', function () {

        $(marker._icon).removeClass('marker-garbage');
        
        $(marker._icon).removeClass('marker-cleaning');

        $(marker._icon).removeClass(function (index, css) {
            
            return (css.match(/(^|\s)marker-color-\S+/g) || []).join(' ');
            
        }).addClass('marker-generic');

        $(marker._icon).addClass('marker-color-gray');

    });
    
    } else {
        
        if (e.target.getZoom() < 10) {
        
            showAlert("Zoom in closer to create features", "info", 1200);
        
        }
      
        bottombar.hide();

        sidebar.hide();

        $('.dropdown').removeClass('open');

        $('.leaflet-control-layers').removeClass('leaflet-control-layers-expanded');

        $('.leaflet-control-search').removeClass('leaflet-control-search-expanded');
      
    }
  
    // Remove unsaved markers with class 'marker-generic' after a timeout
    setTimeout(function() {

        $('div.marker-generic').remove();

        sidebar.hide();
        
    }, 400000);
  
}

// Default behaviour for creating a marker
map.on('click', onMapClick);  
// map.on('longclick', onMapClick);  

// onClick behavior for non-saved markers
function onLocalMarkerClick (e) {

    bottombar.hide();

    marker = this;

    map.panToOffset(marker._latlng, _getHorizontalOffset());

    console.log("clicked marker id:", marker._leaflet_id );

    marker.on("dragend", function(event){
        
        var newPos = event.target.getLatLng();
        
        $('.marker-lat').val(newPos.lat);
        
        $('.marker-lng').val(newPos.lng);
        
    });

    $('#sidebar').scrollTop =0;
    
    $('.sidebar-content').hide();
    
    sidebar.show($("#create-marker-dialog").fadeIn());
    
};

// FIXME Reload the features from the backend when a layer is re-added from leaflet-layers-control menu 