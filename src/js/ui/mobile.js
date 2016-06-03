// Mobile display
// TODO use L.Browser once Leaflet 1.0 is in use
// TODO use an init function instead of .ready()
// $(document).ready(function() {
$(document).ready(function() {
    
    if (window.innerWidth < 768) {

        $('#topbar').remove();

        // Add swipe areas
        $('body').append('<div class="swipe-area swipe-area-right"></div>');
        
        $('#sidebar').append('<div class="swipe-area swipe-area-left"></div>');
        
        $('#bottombar').prepend('<div class="swipe-area swipe-area-top"></div>');
        
        $('.draw-link').addClass('disabled');
            
        // Remove the search field from multiselect else the softkeyboard shows up on mobile
        $('.garbage-type-select, .litter-type-select').attr('data-live-search', 'false');

        // Activate swipe on the right border to show the mobile menu
        $(".swipe-area-right").touchwipe({

            wipeLeft: function() {

                sidebar.show($('#mobile-menu-dialog').show());

          },

            min_move_x: 15,

            preventDefaultEvents: true

        });
        
        // Hide the sidebar on right swipe from the left border
        $(".swipe-area-left").touchwipe({

            wipeRight: function() {

                sidebar.hide();

            },

            min_move_x: 15,

            preventDefaultEvents: true

        });
        
        // Hide the bottombar on down swipe
        // FIXME to swipe down on Android you need wipeUp() (the controls are inverted)
        // if (L.Browser.retina) {wipeDown:}
        // if (L.Browser.android || L...) {wipeUp:}

        $(".swipe-area-top").touchwipe({

            wipeUp: function() {

                bottombar.hide();

            },

            min_move_y: 20,

            preventDefaultEvents: true

        });

    }
    
});

