/* jslint browser: true, white: true, sloppy: true, maxerr: 1000 */
/* global $, Tour */

/**
  * Touring the app
  */

var touring = (function () {

    'use strict';

    var _devTour = new Tour({
            name: "dev-tour",
            template: "<div class='popover tour'><div class='arrow'></div><div class='popover-content'></div><div class='popover-navigation'><a class='close btn-tour' data-role='end'>x&nbsp</a></div></div>",
            // template: "<div class='popover tour'><div class='arrow'></div><div class='popover-content'></div></div>",
            steps: [
              {
                content: 'Note that this platform is currently under active development but all the basic functions are available and can be used to save markers and images. Please see the repository on github for current issues.',
                duration: 16000,
                orphan: true
              }
            ]
        }),
        _mobileTour = new Tour({
            name: "mobile-tour",
            template: "<div class='popover tour'><div class='arrow'></div><div class='popover-content'></div><div class='popover-navigation'><a class='close btn-tour' data-role='end'>x&nbsp</a></div></div>",
            steps: [
              {
                element: ".leaflet-control-login",
                placement: 'right',
                content: "One-click anonymous login!",
                duration: 3000
              },
              {
                content: 'You can use this platform in fullscreen mode by accessing the "save this website to your homepage" function in your mobile browser.',
                duration: 7000,
                orphan: true
              }
            ]
        }),
        init = function () {

            _bindEvents();

            setTimeout(function () {

                if (!window.isMobile) {

                    if (!localStorage.getItem('token')) {
                        _devTour.init();
                        _devTour.start(true);
                    }
                }

                if (window.isMobile) {
                    _mobileTour.init();
                    _mobileTour.start(true);
                }
            }, 5000);
        },
        _bindEvents = function () {

            $('.start-tour').on('click', function () {

                setTimeout(touring.init, 2000);
            });
        };

    return { init: init };

}());
