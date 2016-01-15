// Instance the tour
var tour = new Tour({
  name: "roska-tourxx",
 template: "<div class='popover tour'><div class='arrow'></div><div class='popover-content'></div><div class='popover-navigation'><a class='btn-tour' data-role='end'><i class='fa fa-fw fa-times-circle'></i></a></div></div>",
  steps: [
  { 
    content: "Discover the platform by following this quick introductory tour.",
    duration: 4000,
    orphan: true,
  },
  {
    element: "#roska-button",
    content: "Access the main user menu by clicking here. This will open the sidebar and allow you to login or register with us. ",
    onShown: function (tour) { $("#roska-button").trigger('click'); },
    onNext: function (tour) { sidebar.hide(); $('.sidebar-content').hide(); $('#sidebar').scrollTop = 0;  },
    duration: 7000
  },
  {
    element: "#locate-button",
    content: "If the automatic geolocation fails, click here to identify your position.",
    duration: 7000
  },
  {
    element: "#search-button",
    content: "Use the search function to look for features and information across the whole platform.",
    onShown: function (tour) { sidebar.show($('#search-dialog').fadeIn('slow')); },
    onNext: function (tour) { sidebar.hide(); $('.sidebar-content').hide(); $('#sidebar').scrollTop = 0;  },
    duration: 7000
  },
  {
    element: "#search-nearby-trashbin",
    content: "If you need a place to bring garbage that you have collected outdoors, click this button to locate all the recycling and garbage amenities around you.",
    duration: 8000,
  },
  {
    element: ".leaflet-control-zoom-in",
    content: "Use your peripherals or these buttons to control the map. Zooming in will allow more interactions with the map. Different features of the platform are accessible and visible at different zoom factors.",
    onShown: function (tour) { map.setZoom(17); map.setZoom(20) },
    onNext: function (tour) { setTimeout($("#map").trigger('click'), 1000); },
    duration: 12000,
  },
  {
    element: ".marker-generic",
    content: "Clicking on the map will add a marker and show the sidebar with feature creation options.",
    duration: 8000,
    placement: 'top',
  },
  { 
    element: ".actions-panel",
    content: "Select any of these options to interact with the map and add the desired features.",
    onNext: function (tour) { $('.sidebar-content').hide(); sidebar.show($('#create-highlight-dialog').fadeIn('slow')); },
    duration: 12000,
    placement: 'left',
    container: 'body',
  },
  {
    element: ".coastal-tour",
    content: "Once you have selected an action, you will be presented with a short help text and a form where you can specify the features options.",
    duration: 12000,
    placement: 'left',
    container: 'body',
  },
  {
    element: ".evos-data-example",
    content: "For certain features, you can also view specific example of historical pollution events. Depending on the size of the data and speed of your connection, the map may take some time to load, so don't walk away just yet.",
    onNext: function (tour) { $('.sidebar-content').hide(); $('#sidebar').scrollTop = 0; $(".exxon-valdez-geojson").trigger('click'); sidebar.show($('#exxon-valdez-example').fadeIn('slow')); },
    duration: 15000,
    placement: 'left',
    container: 'body',
  },
  {
    element: ".legend",
    content: "Additional map elements, such as legends, images and videos will be shown along historical examples.",
    duration: 16000,
    placement: 'left',
    container: 'body',
  },
  {
    element: ".dismiss-example",
    content: "Examples will always be accompanied by links to allow you to remove the example data and restore the default map view.",
    onNext: function (tour) { $(".dismiss-example").trigger('click'); },
    duration: 8000,
    placement: 'left',
    container: 'body',
  }, 
  {
    content: "That's it! Just remember this platform is still a prototype and many features aren't functional yet. Click on the title above the map to get in touch with us about coding some improvements!",
    duration: 12000,
    container: 'body',
    orphan: true
  }
]});


// Start the tour if the screen is large enough

window.startRoskaTour = function() {
        if($(window).width() >= 768){
            $('.sidebar-content').hide();
            sidebar.hide();
            $('#sidebar').scrollTop = 0;
            tour.init();
            tour.start( true );
            } 
  
        };

$(document).ready(function() {
    setTimeout(startRoskaTour, 4000)
    });

$('.start-tour').on('click', function() {
    setTimeout(startRoskaTour, 2000)
    });
