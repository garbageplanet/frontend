document.addEventListener("DOMContentLoaded", function () {

  var showtour = @@production;

  // Init these blocks in order

  // Maps

  maps.init();

  features.init();

  actions.init();

  // Ui

  ui.init();

  auth.init('check');

  if ( showtour )  {
      touring.init();
  }

});
