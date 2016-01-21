// TODO Arrange functions in group in this file

// Alert mobile phone user (check if this appears on tablets)
if (L.Browser.mobile) {
    showAlert("Drawing tools are not available on mobile.", "info", 2000);
};

// Swtch session function
function switchSession(sessionStatus) {  
  
    if (sessionStatus == "logout") {
      
      $('#session-status a').text('Login').attr("href","#user-login-dialog");
      $('#session-status a').attr("id","");
      $('#session-status a').addClass('dropdown-link');
      $('#user-info-lnk').remove();
      $('#user-tools').dropdown();
      
    }
  
    if (sessionStatus == "login") {
      
      $("#session-status a").text("Logout").attr("href","#");
      $("#session-status a").attr("id","btn-logout");
      $("#session-status a").removeClass('dropdown-link');
      $("#session-status").on('click', '#btn-logout', function(){ switchSession("logout"); logout(); });
      $("#user-tools").prepend('<li id="user-info-lnk"><a class="dropdown-link" href="#account-info">User info</a></li>');
      $("#user-info-lnk a").on("click", function(e) {
                                      e.preventDefault();
                                      $('#sidebar').scrollTop = 0;
                                      $(this.hash).fadeIn().siblings().hide();
                                      sidebar.show();                          
                                    });
      $("#user-tools").dropdown();
    } 
  
};

// Alerts by lgal http://stackoverflow.com/a/33662720/2842348
function showAlert(errorMessage, errorType, closeDelay) {

    // default to alert-info; other options include success, warning, danger
    var errorType = errorType || "info";

    // create the alert div
       var alert = $('<div class="alert alert-' + errorType + ' fade in">')
        .append(errorMessage);
    // add the alert div to top of alerts-container, use append() to add to bottom
    $(".alert-container").prepend(alert);

    // if closeDelay was passed - set a timeout to close the alert
    if (closeDelay)
        window.setTimeout(function() { alert.alert("close") }, closeDelay);     
};

// Make dropdown menu linuks works
// Make collapsed menu button work
$(document).ready(function() {
  $('#user-tools').on('click', 'a', function(e) {
    if ($(this).hasClass('dropdown-link')) {
          e.preventDefault();
          bottombar.hide();
          sidebar.show();
          $(this.hash).fadeIn().siblings().hide();
    }
  });
  
  $('#btn-mobile-menu').click( function(e) {
        e.preventDefault();
        bottombar.hide();
        sidebar.show($('#mobile-menu-dialog').fadeIn().siblings().hide());
  });
  
});


$(document).ready(function() {
  // Actions for map-tools dropdown
  // Locate the user
  $('.btn-locate').on('click', function(){
    sidebar.hide();
    bottombar.hide();
    map.locate({setView: true, maxZoom: 20});
  });
  
  // Show nearby trashbins
  $('#btn-trashbins').on('click', function(){
    debugger;
    osmTrashbinLayer = new L.OverPassLayer({
       query: '(node["amenity"="waste_basket"]({{bbox}});node["amenity"="recycling"]({{bbox}});node["amenity"="waste_disposal"]({{bbox}}););out;'
    });
    map.addLayer(osmTrashbinLayer);
  });
  
  // Show marker creation dialog on button click
  // TODO edit needs to send to different forms given the marker type
  $('.btn-edit').on('click', function(marker, e) {
    bottombar.hide();
    sidebar.show($('#create-garbage-dialog').show());
    // TODO preset the values of the clicked marker
  });
  
  // Display the date and time picker and get the data in the cleaning form on change
  $(function () { $('#event-date-time-picker')
    .datetimepicker(
                    {
                    format: 'DD-MM-YYYY',
                    minDate: new Date(2015, 0, 1),
                    showTodayButton: true
                    }
    )
  });
  
  $('#event-date-time-picker').on('dp.change', function(e) {
    console.log('e.date=', e.date);
  });
  
  // Display all the select pickers
  $('.selectpicker').selectpicker({ style: 'btn-lg btn-default text-center', size: 5})

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
  
});

$(".btn-save-cleaning").on('click', function (){
     $(marker._icon).removeClass('marker-color-gray marker-generic').addClass('marker-cleaning marker-color-coral');
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
        $('textarea').val('');
        $('input').val('');
        $('.selectpicker').selectpicker('render');
        $('.leaflet-draw-edit-edit').removeClass('visible');
});

// Range slider for amount of garbage on marker icon
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
  sidebar.hide();
}, 400000);