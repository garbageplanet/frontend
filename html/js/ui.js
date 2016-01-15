// Make dropdown menu linuks works
$(document).ready(function() {
$('#user-tools').find('a').click( function(e) {
        e.preventDefault();
        bottombar.hide();
        sidebar.show();
        $(this.hash).fadeIn().siblings().hide();
    });
});

// Make collapsed menu button work
$(document).ready(function() {
$('#mobile-menu-button').click( function(e) {
        e.preventDefault();
        bottombar.hide();
        sidebar.show($('#mobile-menu-dialog').fadeIn().siblings().hide());
    });
});

// Login and logout classes

// Show an alert if zoom if
map.on('zoomend', function(e){
    var myZoom = e.target.getZoom();
  
    if ( myZoom < 10) { $('.alert-zoom').removeClass('hidden'); }
    else { $('.alert-zoom').addClass('hidden'); }
});

// Actions for map-tools dropdown
// Locate the user
$('.btn-locate').on('click', function(){
  map.locate({setView: true, maxZoom: 20});
});

// Show nearby trashbins
$('#btn-locate').on('click', function(){
  sidebar.hide();
  bottombar.hide();
  map.locate({setView: true, maxZoom: 20});
});


$('#btn-trashbins').on('click', function(){

  osmTrashbinLayer = new L.OverPassLayer({
     query: '(node["amenity"="waste_basket"]({{bbox}});node["amenity"="recycling"]({{bbox}});node["amenity"="waste_disposal"]({{bbox}}););out;'
  });
  map.addLayer(osmTrashbinLayer);
  
});

// Hide all the siblings of the clicked link in the sidebar when linking internally and reset sidebar scroll
$('.sidebar-link').click(function(e) {
    e.preventDefault();
    $(this.hash).fadeIn().siblings().hide();
    $('#sidebar').scrollTop = 0;
});

// Go back to the marker creation menu link
$('.menu-backlink').click(function(e) {
    $('.panel-collapse').collapse('hide');
    $('#sidebar').scrollTop = 0;
    $(this.hash).fadeIn().siblings().hide();
    e.preventDefault();
});

$(".btn-save-cleaning").on('click', function (){
     $(marker._icon).removeClass('marker-color-gray marker-generic').addClass('marker-cleaning marker-color-coral');
});

// Sidbar reset functions
// Delete marker if button is clicked
$(".btn-delete-marker").on('click', function (){
     map.removeLayer(marker);
});

// Close sidebar and reset forms if cancel button clicked
$(".btn-cancel").on('click', function (){
    sidebar.hide();
});

// Empty the sidebar on hide, reset accordion and reset scroll
sidebar.on('hide', function () {
        $('.panel-collapse').collapse('hide');
        $('.sidebar-content').hide();
        $('#sidebar').scrollTop = 0;
        $('form').each(function() { this.reset() });
        $("textarea").val('');
        $("input").val('');
        $('.selectpicker').selectpicker('render');
        // $('#user-login-dialog').find('.with-errors').hide();
        // $('#glome-dialog').find('.with-errors').hide();
    });

//  General Alerts
/* $(document).ready(function() {
   if($(window).width() < 1024){
       $('.alert-draw').removeClass('hidden');
       window.setTimeout(function() { $(".alert-draw").fadeOut('slow'); }, 4000);
   }
}); */

// Forms styling and basic actions
$(document).ready(function() {
   $(function () {
       $('#event-date-time-picker').datetimepicker();
   });
});

$(document).ready(function() {
   $('.selectpicker').selectpicker({
               style: 'btn-lg btn-default text-center',
               size: 5})
});

// Close button bottombar
$(document).ready(function() {
$('.bottombar-close').click( function(e) {
        e.preventDefault();
        bottombar.hide();
    });
});

// Range slider for amount of garbage
$('.garbage-range-input').on('change', function() {
    // Remove the generic marker class
    $(marker._icon).removeClass('marker-generic').addClass('marker-garbage');
    $('.garbage-range-value').html(this.value);
    // Get the color value from the select options
    var selectedValue = parseInt(jQuery(this).val());
      switch(selectedValue){
              // so much cringe here, let's try to do this with ternaries
                case 1:
                    $(marker._icon).removeClass(function (index, css) {
                      return (css.match (/(^|\s)marker-color-\S+/g) || []).join(' ');
                    }).addClass('marker-color-green');
                    break;
                case 2:
                    $(marker._icon).removeClass(function (index, css) {
                      return (css.match (/(^|\s)marker-color-\S+/g) || []).join(' ');
                    }).addClass('marker-color-limegreen');
                    break;
                case 3:
                    $(marker._icon).removeClass(function (index, css) {
                     return (css.match (/(^|\s)marker-color-\S+/g) || []).join(' ');
                    }).addClass('marker-color-yellow');
                    break;
                case 4:
                    $(marker._icon).removeClass(function (index, css) {
                     return (css.match (/(^|\s)marker-color-\S+/g) || []).join(' ');
                    }).addClass('marker-color-gold');
                    break;
                case 5:
                    $(marker._icon).removeClass(function (index, css) {
                      return (css.match (/(^|\s)marker-color-\S+/g) || []).join(' ');
                    }).addClass('marker-color-orange');
                    break;
                case 6:
                    $(marker._icon).removeClass(function (index, css) {
                     return (css.match (/(^|\s)marker-color-\S+/g) || []).join(' ');
                    }).addClass('marker-color-orangered');
                    break;
                case 7:
                    $(marker._icon).removeClass(function (index, css) {
                     return (css.match (/(^|\s)marker-color-\S+/g) || []).join(' ');
                    }).addClass('marker-color-red');
                    break;
                case 8:
                    $(marker._icon).removeClass(function (index, css) {
                     return (css.match (/(^|\s)marker-color-\S+/g) || []).join(' ');
                    }).addClass('marker-color-darkred');
                    break;
                case 9:
                    $(marker._icon).removeClass(function (index, css) {
                      return (css.match (/(^|\s)marker-color-\S+/g) || []).join(' ');
                    }).addClass('marker-color-purple');
                    break;
                case 10:
                    $(marker._icon).removeClass(function (index, css) {
                     return (css.match (/(^|\s)marker-color-\S+/g) || []).join(' ');
                    }).addClass('marker-color-black');
                    break;
                default:
                    $(marker._icon).removeClass(function (index, css) {
                      return (css.match (/(^|\s)marker-color-\S+/g) || []).join(' ');
                    }).addClass('marker-color-unknown');
                    break;
        }
});

//Remove unsaved markers with class 'marker-generic' after a timeout
// Move this logic to onMapClick and onLocalMarkerClick
setTimeout(function() {
  $('div.marker-generic').remove();
  $('div.marker-unsaved').remove();
  sidebar.hide();
}, 200000);

// Show marker creation dialog on button click
$('.btn-edit').on('click', function(marker, e) {
  bottombar.hide();
  sidebar.show($('#create-garbage-dialog').show());
  // TODO preset the values of the clicked marker
});

// Activate Summarizing Tile part
/*
$('#l-active-tile-btn').click(function () {
    var r = 0.01
    var lat = Number($('#activate-tile-dialog').find('.tile-center-lat').text());
    var lng = Number($('#activate-tile-dialog').find('.tile-center-lng').text());
    var bottom_left = [lat-r, lng-r];
    var top_right = [lat+r, lng+r];

    console.log('lat', lat);
    console.log('lng', lng);
    console.log('bottom_left', bottom_left);
    console.log('top_right', top_right);

    var rectangleBounds = [bottom_left, top_right];
    var rectangle = L.rectangle(rectangleBounds);
    rectangle.addTo(map);
    rectangle.editing.enable();
    window.rectangle = rectangle;
    rectangle.on('edit', function(data) {
        window.ne_lat = data.target._latlngs[1].lat;
        window.ne_lng = data.target._latlngs[1].lng;
        window.sw_lat = data.target._latlngs[3].lat;
        window.sw_lng = data.target._latlngs[3].lng;
        $('#activate-tile-dialog').find('.tile-ne-lat').text(ne_lat);
        $('#activate-tile-dialog').find('.tile-ne-lng').text(ne_lng);
        $('#activate-tile-dialog').find('.tile-sw-lat').text(sw_lat);
        $('#activate-tile-dialog').find('.tile-sw-lng').text(sw_lng);
    });
});*/