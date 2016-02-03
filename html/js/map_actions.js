//MapToOffset//////////////////////////////////////////////////////////
//See license.md in this repo Copyright 2013 Code for America//////////
L.Map.prototype.panToOffset = function (latlng, offset, options) {
    var x = this.latLngToContainerPoint(latlng).x - offset[0],
        y = this.latLngToContainerPoint(latlng).y - offset[1],
        point = this.containerPointToLatLng([x, y]);
  return this.setView(point, this._zoom, { pan: options });
}

// Adapted functions
function _getVerticalOffset() {
  var vOffset = [0, 0];
  vOffset[1] = - $(window).height() / 4;
  vOffset[0] = 0;
  return vOffset;
}

function _getHorizontalOffset() {
  var hOffset = [0, 0];
  hOffset[0] = - $(window).height() / 4;
  hOffset[1] = 0;
  return hOffset;
}
//////////////////////////////////////////////////////////////////////

// Default behavior for map clicks
// FIXME layers control toggle behaviour on mobile
function onMapClick(e) {
  if (!sidebar.isVisible() && !bottombar.isVisible() && mapZoom >= 10 && !$('.dropdown').hasClass('open')  && !$('.leaflet-control-layers').hasClass('.leaflet-control-layers-expanded')) {
    marker = L.marker(e.latlng, {
      icon:genericMarker,
      draggable: true
      }).on('click', onLocalMarkerClick).addTo(map);
    
  $('.marker-lat').val(marker._latlng.lat);
  $('.marker-lng').val(marker._latlng.lng);

  if ($(window).height() >= 768) {
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
      // Get the color value from the select options
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
    
  marker.on("dragend", function (event){
    var newPos = event.target.getLatLng();

    console.log("dragged marker id:", event.target._leaflet_id );
    // TODO move this logic somehwere else
    $('.marker-lat').val(newPos.lat);
    $('.marker-lng').val(newPos.lng);
  });
    
  map.on('draw:drawstart', function (e) {
    map.removeLayer(marker);
  });
    
}
  
  else { 
        bottombar.hide();
        sidebar.hide();
        $('.dropdown').removeClass('open');
        $('.leaflet-control-layers').removeClass('.leaflet-control-layers-expanded');
       }
}

// Default behaviour for creating a marker
map.on('click', onMapClick);  

// onClick behavior for non-saved markers
function onLocalMarkerClick (e) {
    // console.log("local marker clicked");
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
}

// TODO edit marker by pushing the values of the currently viewed feature in the form fields upon edit
function editFeature (obj) {
  bottombar.hide();
  // TODO preset the values of the clicked marker

  if (obj.options.type === 'marker_garbage'){
    sidebar.show($('#create-garbage-dialog').show().siblings().hide());

  }
  if (obj.options.type === 'marker_cleaning'){
    sidebar.show($('#create-cleaning-dialog').show().siblings().hide());

  }
  if (obj.options.type === 'polyline_litter'){
    sidebar.show($('#create-litter-dialog').show().siblings().hide());

  }
  if (obj.options.type === 'polygon_area'){
    sidebar.show($('#create-area-dialog').show().siblings().hide());
  }
}

//Remove unsaved markers with class 'marker-generic' after a timeout
// Move this logic to onMapClick and onLocalMarkerClick ?
setTimeout(function() {
  $('div.marker-generic').remove();
  sidebar.hide();
}, 400000);