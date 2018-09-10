document.addEventListener("DOMContentLoaded", function () {

  var showtour = @@production;

  // Init these blocks in order

  // Load maps and plugins
  maps.init();

  // Load map events
  actions.init();

  // Load ui amd session
  ui.init();

  // Do a session check to see if the user has cached data
  session.init('check');

  if ( showtour )  {
      touring.init();
  }
  // Load map features
  features.init()

});
