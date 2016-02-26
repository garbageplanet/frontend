// Mobile display
// TODO use L.Browser once Leaflet 1.0 is in use
$(document).ready(function() {

  if (window.innerWidth < 768) {
    
    $('#topbar').remove();
    
    $('body').append('<div class="swipe-area-right"></div>');
    
    $('.draw-link').addClass('disabled');
    
    // TODO remove navigation on mobile

    // Activate swipe on the right border to show the mobile menu
    $(".swipe-area-right").touchwipe({
      
      wipeLeft: function() {
        
        sidebar.show($('#mobile-menu-dialog').show());
      
      },
      
      min_move_x: 15,
      
      preventDefaultEvents: true
      
    });
    // Hide the sidebar on right swipe
    $(".sidebar-container").touchwipe({
      
      wipeRight: function() {
        
        sidebar.hide();
      
      },
      
      // FIXME this doesn't scroll
      wipeDown: function() {
        
       $('#sidebar').scrollTo(200);
      
      },
      
      // FIXME this doesn't scroll
      wipeUp: function() {
        
       $('#sidebar').scrollTo(200);
      
      },
      
      min_move_x: 100,
      
      min_move_y: 50,
      
      preventDefaultEvents: true
      
    });
    // Hide the bottombar on down swipe
    // FIXME to swipe down on Android you need wipeUp() (the controls are inverted)
    // if (L.Browser.retina) {wipeDown:}
    // if (L.Browser.android || L...) {wipeUp:}
    
    $(".bottombar-container").touchwipe({
      
      wipeUp: function() {
        
        bottombar.hide();
      
      },
      
      wipeRight: function() {
        
        $('#bottombar').scrollLeft(200);
      
      },
      
      wipeLeft: function() {
        
        $('#bottombar').scrollLeft(0);
      
      },
      
      min_move_y: 50,
      
      preventDefaultEvents: true
      
    });
    
    // TODO swipe events to navigate in panels

  }

});