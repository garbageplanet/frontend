// TODO check if the localStorage has token, if yes log the user in with data
/*
$('document').ready(function () {
  var classicSessionType = localStorage.getItem('classic')

  if ( classicSessionType ) {
    
    if ( classicSessionType === "true" ) {
        sessionStorage.clear();
        $('#account-info').find('.user-email').removeClass('hidden');
        $('#account-info').find('.user-name').text( localStorage.getItem('username') );
        $('#account-info').find('.user-email p').html( localStorage.getItem('useremail') );
        $('#account-info').find('.user-glome-key').addClass('hidden');
        $('#account-info').find('.user-id').html( localStorage.getItem('userid') );
        $('#account-info').show(); 
      }
      
      if ( classicSessionType === "false" ) {
        localStorage.clear();
        $('#account-info').find('.user-name').text('anon (⌐■_■)');
        $('#account-info').find('.user-email').addClass('hidden');
        $('#account-info').find('.user-glome-key p').html( sessionStorage.getItem('username') );
        $('#account-info').find('.user-id').html( sessionStorage.getItem('userid') );
        $('#account-info').show();
      }
  }
});
*/
// Alert mobile phone user (check if this appears on tablets)
if (L.Browser.mobile) {
    showAlert("Drawing tools are not available on mobile.", "info", 4000);
};

// Swtch session function
// TODO add hooks for the mobile menu
function switchSession(sessionStatus) {
  
  var classicSessionType = localStorage.getItem('classic')
  
    if (sessionStatus === "logout") {
      
      $('#session-status a').text('Login').attr("href","#user-login-dialog");
      $('#session-status a').attr("id","");
      $('#session-status a').addClass('dropdown-link');
      $('#user-info-lnk').remove();
      $('#user-tools').dropdown();
      $('.user-email, .user-glome-key').removeClass('hidden');
      $('.glome-lnk', '.btn-glome-mobile').removeClass('hidden');
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
      $('.glome-lnk', '.btn-glome-mobile').addClass('hidden');
      
      // get the data from localStorage or sessionStorage and clear the other
      
      if ( classicSessionType === "true" ) {
        
        $('#account-info').find('.user-email').removeClass('hidden');
        $('#account-info').find('.user-name').text( localStorage.getItem('username') );
        $('#account-info').find('.user-email p').html( localStorage.getItem('useremail') );
        $('#account-info').find('.user-glome-key').addClass('hidden');
        $('#account-info').find('.user-id').html( localStorage.getItem('userid') );
        $('.sidebar-content').hide();
        
        if ( !sidebar.isVisible() ) {
            sidebar.show();
        }
          
        $('#account-info').show();
        
      }
      
      if  ( classicSessionType === "false" ) {
        
        $('#account-info').find('.user-name').text('anon (⌐■_■)');
        $('#account-info').find('.user-email').addClass('hidden');
        $('#account-info').find('.user-glome-key p').html( localStorage.getItem('glomekey') );
        $('#account-info').find('.user-id').html( localStorage.getItem('userid') );
        $('.sidebar-content').hide();
          
        if ( !sidebar.isVisible() ) {
            sidebar.show();
        }
          
        $('#account-info').show();
        
      }
      
    } 
  
};

// Alerts by lgal http://stackoverflow.com/a/33662720/2842348
function showAlert(errorMessage, errorType, closeDelay) {

    // default to alert-info; other options include success, warning, danger
    var errorType = errorType || "info";

    // create the alert div
       var alert = $('<div class="alert alert-' + errorType + ' fade in">').append(errorMessage);
    // add the alert div to top of alerts-container, use append() to add to bottom
    $(".alert-container").prepend(alert);

    // if closeDelay was passed - set a timeout to close the alert
    if (closeDelay)
        window.setTimeout(function() { alert.alert("close") }, closeDelay);     
};

// Activate dropdown menu links
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
        sidebar.toggle($('#mobile-menu-dialog').fadeIn().siblings().hide());
  });
  
});

// Actions for map-tools dropdown
$(document).ready(function() {
  
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
  
});

// Display all the select pickers
$(document).ready(function() {
  $('.selectpicker').selectpicker({ style: 'btn-lg btn-default text-center', size: 5});
});

// Display the date and time picker and get the data in the cleaning form on change
$(document).ready(function() {
  
  $(function () { $('#event-date-time-picker')
    .datetimepicker( {minDate: new Date(2015, 11, 31)});
  }); 

  $('#event-date-time-picker').on('dp.change', function(e) {
     var eventDateTime = e.date.format('DD/MM/YYYY HH:MM');
    $('.date-time-value').val(eventDateTime);
  });

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

// Close sidebar if cancel button clicked
$(".btn-cancel").on('click', function (){
    sidebar.hide();
    map.removeLayer(marker);
});

// Empty the sidebar on hide, reset accordion and reset scroll
sidebar.on('hide', function () {
        $('.sidebar-content').hide();
        $('#sidebar').scrollTop = 0;
        $('form').each(function() { this.reset() });
        $('input').val('');
        $('.selectpicker').selectpicker('render');
        $('.leaflet-draw-edit-edit').removeClass('visible');
        $('.leaflet-draw-edit-remove').removeClass('visible');
});

// Empty the bottom panel on call of this function
function clearBottomPanelContent(){
  //TODO ad methods depending on the type of object clicked
  $(".feature-info").empty();
  $(".feature-info-confirmed strong").text('0');
  $("#feature-info-image").attr("src", "");
  $("#feature-info").find('.feature-image-link').attr("href", "");
};

// Confirm garbage function
// TODO bind this to the db
$('.btn-confirm').on('click', confirmGarbage );

// Confirmation for garage abd polylines
function confirmGarbage(obj){
  // TODO make session-dependant and allow once per user per marker
  if (! localStorage.getItem('token') || ! sessionStorage.getItem('token')){ 
    showAlert("You need to login to do that.", "info", 2000);
  }
  
  var counts = parseInt($(".feature-info-confirmed strong").val, 10);
  counts = isNaN(counts) ? 0 : value;
  counts++;
  $(".feature-info-confirmed strong").val = counts;
    
    setTimeout(function () {
      // var useToken = localStorage["token"] || window.token;
      var useToken = localStorage.getItem('token') || window.token;

      $.ajax({
          method: api.confirmTrash.method,
          url: api.confirmTrash.url(),
          headers: {"Authorization": "Bearer" + useToken},
          data: {
              'confirm': counts // ow how to do this?
          },
          success: function (data) {
              console.log('success data', data);
              // todo change the value in the UI
          },
          error: function (err) {
              console.log('err', err);                  
          }
      })
    }, 100);
};

function editFeature(obj, featureType) {
    // TODO handle edit shapes with L.Editable (https://github.com/Leaflet/Leaflet.Editable)
    if(featureType === "garbage"){
        // load data into the form
    }
    if(featureType === "cleaning"){
        // load data into the form
    }
    
    if(featureType === "litter" || eatureType === "area" ){
        // do stuff related to both types of shape then do shape-specific actions
        // NOTE make sure to fix the draw:events in draw.js
            if(featureType === "litter"){}
            if(featureType === "area" ){}
    }

};
