/*jslint browser: true, white: true, sloppy: true, maxerr: 1000*/
// Check if the localStorage has token, if yes log the user in with data
$(document).ready(function() {
  var test1 = localStorage.getItem('token');
  console.log('token value', test1);
  if (test1 !== null ) {
      switchSession('login');
  }
  else {return;}
});

// Mobile display
// TODO only add swipe menu and remove navigation bar for very small screens
// TODO Leaflet isn't good at recognizing mobile
$(document).ready(function() {

/* jQuery.browser.mobile (http://detectmobilebrowser.com/)*/
(function(a){
  (jQuery.browser=jQuery.browser||{}).mobile=/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))})(navigator.userAgent||navigator.vendor||window.opera);

  // if (L.Browser.mobile || L.Browser.retina || L.Browser.android || L.Browser.android23 || L.Browser.mobileOpera || L.Browser.mobileWebkit)  {
  if (jQuery.browser) {
    $('#topbar').remove();
    $('body').append('<div class="swipe-area-right"></div>');

    showAlert("Drawing tools are not available on mobile.", "info", 4000);
    $('.draw-link').addClass('disabled');

    if(!window.location.hash) {

      if(document.height <= window.outerHeight + 10) {

        document.body.style.height = (window.outerHeight + 50) +'px';

        setTimeout( function() { window.scrollTo(0, 1); }, 100 );

      } else {

        setTimeout( function() { window.scrollTo(0, 1); }, 100 );

      }

    }

    // Activate swipe on the right border to show the mobile menu
    $(".swipe-area-right").touchwipe({
     wipeLeft: function() { sidebar.show(); },
     min_move_x: 15,
     preventDefaultEvents: true
    });

  }

});

// Swtch session function
// TODO destroy element instead of hiding them
function switchSession(sessionStatus) {

  var classicSessionType = localStorage.getItem('classic');

    if (sessionStatus === "logout") {

      $('#session-status a').text('Login').attr("href","#user-login-dialog");
      $('#session-status a').attr("id","");
      $('#session-status a').addClass('dropdown-link');
      $('#user-info-link').remove();
      $('#user-tools').dropdown();
      $('.user-email, .user-glome-key').removeClass('hidden');
      $(".session-link").removeClass('hidden');
    }

    if (sessionStatus === "login") {

      $("#session-status a").text("Logout").attr("href","#");
      $("#session-status a").attr("id","btn-logout");
      $("#session-status a").removeClass('dropdown-link');
      $("#session-status").on('click', '#btn-logout', function() {switchSession("logout"); logout();});
      $("#user-tools").prepend('<li id="user-info-link"><a class="dropdown-link" href="#account-info">User info</a></li>');
      $("#user-info-link a").on("click", function(e) {
                                      e.preventDefault();
                                      $('#sidebar').scrollTop = 0;
                                      $(this.hash).fadeIn().siblings().hide();
                                      sidebar.show();
                                    });
      $("#user-tools").dropdown();
      $(".session-link").addClass('hidden');

      // get the data from localStorage or sessionStorage and clear the other

      if (classicSessionType === "true") {

        $('#account-info').find('.user-email').removeClass('hidden');
        $('#account-info').find('.user-name').text(localStorage.getItem('username'));
        $('#account-info').find('.user-email p').html(localStorage.getItem('useremail'));
        $('#account-info').find('.user-glome-key').addClass('hidden');
        $('#account-info').find('.user-id').html(localStorage.getItem('userid'));
        $('.sidebar-content').hide();

        if (!sidebar.isVisible()) {
            sidebar.show();
        }

        $('#account-info').show();

      }

      if  (classicSessionType === "false") {

        $('#account-info').find('.user-name').text('anon (⌐■_■)');
        $('#account-info').find('.user-email').addClass('hidden');
        $('#account-info').find('.user-glome-key p').html( localStorage.getItem('glomekey') );
        $('#account-info').find('.user-id').html( localStorage.getItem('userid') );
        $('.sidebar-content').hide();

        if (!sidebar.isVisible()) {
            sidebar.show(('#mobile-menu-dialog').fadeIn().siblings().hide());
        }

        $('#account-info').show();

      }

    }

}

// Alerts by lgal http://stackoverflow.com/a/33662720/2842348
function showAlert(errorMessage, errorType, closeDelay) {

    // default to alert-info; other options include success, warning, danger
    if (!errorType || typeof errorType === 'undefined' ) {  var errorType = "info"; }

    var alert = $('<div class="alert alert-' + errorType + ' fade in">').append(errorMessage);
    // add the alert div to top of alerts-container, use append() to add to bottom
    $(".alert-container").prepend(alert);

    // if closeDelay was passed - set a timeout to close the alert
    if (closeDelay) {
        window.setTimeout(function() { alert.alert("close"); }, closeDelay);
    }
}

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
    osmTrashbinLayer = new L.OverPassLayer({
       query: '(node["amenity"="waste_basket"]({{bbox}});node["amenity"="recycling"]({{bbox}});node["amenity"="waste_disposal"]({{bbox}}););out;'
    });
    map.addLayer(osmTrashbinLayer);
  });

});

// Display the date and time picker and get the data in the cleaning form on change
$(document).ready(function() {

  $('.selectpicker').selectpicker({ style: 'btn-lg btn-default text-center', size: 6});

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
        $('form').each(function() { this.reset(); });
        $('input').val('');
        $('.selectpicker').selectpicker('render');
        $('.leaflet-draw-edit-edit').removeClass('visible');
        $('.leaflet-draw-edit-remove').removeClass('visible');
});

// Empty the bottom panel on call of this function
function clearBottomPanelContent() {
  //TODO ad methods depending on the type of object clicked
  $(".feature-info").empty();
  $(".feature-info-confirmed strong").text('0');
  $("#feature-info-image").attr("src", "");
  $("#feature-info").find('.feature-image-link').attr("href", "");
  $('#feature-info').find('.btn-share').each(function() {
    $(this).attr("data-url", "");
  });
};

// Confirm garbage function
// TODO bind this to the db
/*$('.btn-confirm').on('click', confirmGarbage );*/

// Confirmation for garage abd polylines
/*function confirmGarbage(obj){
  // TODO Finish this
  // TODO make session-dependant and allow once per user per marker
  if (!localStorage.getItem('token')){
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
              'confirm': counts // TODO how to do this?
          },
          success: function (data) {
              console.log('success data', data);
              // todo change the value in the UI
          },
          error: function (err) {
              console.log('err', err);
          }
      });
    }, 100);
};*/
