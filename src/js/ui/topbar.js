// Actions for map-tools dropdown
$(document).ready(function() {
  
  // Activate dropdown menu links in top panel
  $('#user-tools').on('click', 'a', function(e) {
    if ($(this).hasClass('dropdown-link')) {
          e.preventDefault();
          bottombar.hide();
          sidebar.show();
          $(this.hash).fadeIn().siblings().hide();
    }
  });

  // Locate the user on click
  $('.btn-locate').on('click', function(){
    sidebar.hide('slow');
    bottombar.hide();
    map.locate({setView: true, maxZoom: 20}).on('locationerror', onLocationError);

  });

  // Show nearby trashbins
  $('#btn-trashbins').on('click', function(){
    osmTrashbinLayer = new L.OverPassLayer({
       query: '(node["amenity"="waste_basket"]({{bbox}});node["amenity"="recycling"]({{bbox}});node["amenity"="waste_disposal"]({{bbox}}););out;'
    });
    map.addLayer(osmTrashbinLayer);
  });

});