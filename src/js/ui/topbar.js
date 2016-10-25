// Actions for map-tools dropdown
// TODO build the top bar with L.Control.extend
// see http://blog.webkid.io/rarely-used-leaflet-features/
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

    // Show nearby trashbins
    $('#btn-trashbins').on('click', function(){
      osmTrashbinLayer = new L.OverPassLayer({
          query: '(node["amenity"="waste_basket"]({{bbox}});node["amenity"="recycling"]({{bbox}});node["amenity"="waste_disposal"]({{bbox}}););out;'
      });

    map.addLayer(osmTrashbinLayer);

  });

});