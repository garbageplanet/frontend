/*jslint browser: true, white: true, sloppy: true, maxerr: 1000*/
// Mobile display
// TODO use L.Browser once Leaflet 1.0 is in use
// TODO modularize this
var mobile = (function () {
    
    // TODO append if mobile instead of removing if not mobile
    if (window.innerWidth >= 768) {
        $('#mobile-menu-dialog').remove();
    }
    
    if (window.innerWidth < 768) {
        // Remove menu bar
        $('#topbar').remove();
        
        // Add a glome anonymous login button
        glomelogincontrol.addTo(map);
        
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
        
        // Create the context menu for mobile / small screens
        var featuremenu = L.markerMenu({

            radius: 100,
            size: [50, 50],                    
            animate: true,                     
            duration: 200,                    
            items: [
                {   title: "Mark garbage",
                    className: "fa fa-fw fa-2x fa-marker-menu fa-map-marker",
                    // className: "icon-trashbag",
                    click: function () {
                        sidebar.show($("#create-garbage-dialog").show());
                        setTimeout(function () {marker.closeMenu();}, 400);
                    }
                },
                {   title: "Create a cleaning event",
                    className: "fa fa-fw fa-2x fa-marker-menu fa-calendar-o",
                    click: function () {
                        sidebar.show($("#create-cleaning-dialog").show());
                        setTimeout(function () {marker.closeMenu();}, 400);
                    }
                },
                {   title: "Mark litter",
                    className: "fa fa-fw fa-2x fa-marker-menu fa-ellipsis-h",
                    click: function () {
                        sidebar.show($("#create-litter-dialog").show());
                        setTimeout(function () {marker.closeMenu();}, 400);
                    }
                },
                {   title: "Add an area",
                    className: "fa fa-fw fa-2x fa-marker-menu fa-ellipsis-h",
                    click: function () {
                        sidebar.show($("#create-area-dialog").show());
                        setTimeout(function () {marker.closeMenu();}, 400);
                    }
                }
            ],
        });
        
        return {
            
            featuremenu: featuremenu,
        };

    }
    
})();

