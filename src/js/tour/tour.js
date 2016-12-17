/*jshint maxerr: 1000*/
// Touring the app
var touring = (function(){
    
    var devTour = new Tour({
            name: "dev-tour",
            template: "<div class='popover tour'><div class='arrow'></div><div class='popover-content'></div><div class='popover-navigation'><a class='btn-tour' data-role='end'><i class='fa fa-fw fa-times close'></i></a></div></div>",
            // template: "<div class='popover tour'><div class='arrow'></div><div class='popover-content'></div></div>",
            steps: [
            /*     {
                content: 'One-click anonymous login',
                duration: 4000,
                element: '#glome-tour',
                placement: 'bottom',
              },*/
              {
                content: 'Note that this platform is currently under active development but all the basic functions are available and can be used to save markers and images. Please see the repository on github for current issues.',
                duration: 16000,
                orphan: true
              }
            ]
        }),
        mobileTour = new Tour({
            name: "mobile-tour",
            template: "<div class='popover tour'><div class='arrow'></div><div class='popover-content'></div></div>",
            steps: [
              {
                element: ".swipe-area-right",
                placement: 'left',
                content: "Access the main menu by swiping from the right border of the screen.",
                duration: 3000
              },
              {
                element: ".leaflet-control-login",
                placement: 'right',
                content: "One-click anonymous login!",
                duration: 3000
              }
            ]
        }),
        startTour = function() {
            
            if($(window).width() >= 768){

                if (!localStorage.getItem('token')) {
                  devTour.init();
                  devTour.start(true);
                }
            }

            if($(window).width() < 768){
                mobileTour.init();
                mobileTour.start(true);
            }
        },
        bindEvents = $(function() {
            $('.start-tour').on('click', function() {
                setTimeout(touring.startTour, 2000)
            });
        });
    
    return {
        startTour: startTour,
    }
    
}());
// Only launch the tour once Pace has finised
Pace.on('done', touring.startTour);