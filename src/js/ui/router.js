/**
  * Init Navigo with the website root and default #/
  * FIXME when inbound linking to a sidebar form it seems the listeners aren't set properly
  * TODO encapsulate router methods
  */

// var navigohash = new RegExp(/^([-+]?\d{1,2}[.]\d+)\s*\/\s*([-+]?\d{1,3}[.]\d+)$/)
var router = new Navigo('@@root', true);
// var router = new Navigo(navigohash, false);

// Hack to reset the router
router.on({
  '/' : { as: 'blank', uses: function () { return; }}
});

/**
  * In-app router for showing map feature infos
  * FIXME when jumping from a form to a saved feature on the map the url gets stripped from location because the reset route get hits after the feature route has been resolved
  */
router.on({
  '/feature/:type/:id/show'   : { as: 'feature.show'  , uses: function (params, query) { ui.setContent(params.type, params.id); }},
  '/feature/:type/:id/edit'   : { as: 'feature.edit'  , uses: function (params, query) {}, before: function (done, params) { if( !tools.states.loggedin ) { done( false ) } else { done()}} },
  '/feature/:type/:id/:action': { as: 'feature.action', uses: function (params, query) {
      // NOTE We need to fetch the leaflet obj if we pass by the router
      actions.act(params.type, params.id, params.action);
  }, before: function (done, params) {

      // Warn user here
      if( !tools.states.loggedin ) {

          alerts.showAlert(3, "info", 2000);
          done(false)

     } else { done() }} }
}).resolve();

/**
  * Inbound router. This router loads the map with given latlng as center and open feature info panel
  * @params type {String} - Of value 'garbage', 'litter', 'area', 'cleaning', '...'
  * @params id   {int}    - Database feature id
  * @params lat  {float}  - Decimal latitude value
  * @params lng  {float}  - Decimal longitude value
  */
router.on({
  '/shared/:type/:id/:lat/:lng': { as: 'shared', uses: function (params, query) {

      console.log('Sharing router', params);

      // First set and load the map center on the marker
      maps.map.setView([parseFloat(params.lat), parseFloat(params.lng)], 16);
      // maps.map.panToOffset([parseFloat(params.lat), parseFloat(params.lng)], tools.getVerticalOffset());

      // FIXME wait for feature load api call to finish else this doesn't work on first load
      // FIXME make a loadOne() call for that single feature and load the rest in background
      // HACK For now we use a timeout after the loadFeature is called, use Promise once loadFeature() is Promisified

      features.loadFeature(params.type);

      setTimeout(function () {

        var maplayer = maps[params.type + 'LayerGroup'];

        try {

          var feature = tools.getLeafletObj(params.type, params.id);
          // featureClick() is expecting a leaflet layer object
          actions.featureClick.call(null, {'layer': feature});

        } catch (error) {

          console.log('Error in share router: ', error)
          alerts.showAlert(33, "danger", 2500);

        }

      }, 3000);

   }}
}).resolve();

/**
  * Router for forms
  */
router.on({
  '/form/:type/:id': { as: 'form', uses: function (params, query) {

      // Pass the feature id as obj to the template
      var id = {};
      id['id'] = parseInt(params.id, 10);

      // Build the template string (menu, garbage, litter...)
      var tmpl_string = 'tmpl-form-' + params.type;
      console.log(tmpl_string);

      // Fill the form template and activate the widgets
      ui.sidebar.setContent( tmpl(tmpl_string, id) );
      // If routing the menu, we must read the router links again because we create hrefs dynamically
      if ( params.type === 'menu' ) {
        router.updatePageLinks();
      }

      ui.sidebar.show();

      if ( params.type !== 'menu' ) {
          forms.makeForm(params.id, params.type);
      }
    }
}}).resolve();

/**
  * Router for info views (account, feature, project)
  */
router.on({
  '/info/:target': { as: 'info', uses: function (params, query) {

      console.log('Info router', params);

      switch ( params.target ) {

        case 'account'   : session.init('view'); break;
        case 'trashbins' : tools.getTrashBins(maps.map); break;
        // Modal for getting garbage data and cleaning calendar
        case 'garbage'   :
        case 'cleaning'  :
        // Only get the dataTable code if the user wants to views the data
        tools.getScript('https://cdn.datatables.net/v/dt/dt-1.10.16/fh-3.1.3/r-2.2.1/datatables.min.js')
            .catch(err => { console.log('Error fetching Datatables script');})
            .then(() => { ui.makeModal(params.target, tools.listMarkersInView(params.target)); });
            break;
        default:
          ui.sidebar.setContent( tmpl( 'tmpl-info-' + params.target, ui.strings.credits) );
          ui.sidebar.show();
          break;
      }
   }}
}).resolve();


/**
  * Router for session
  */
router.on({
  '/auth/:target': { as: 'auth', uses: function (params, query) {

      console.log('auth router', params);

      var tmpl_string = 'tmpl-auth-' + params.target;

      // Show the login view when logging out
      if ( params.target === 'logout' ) {

          console.log('LOGOUT ROUTER');

          tmpl_string = 'tmpl-auth-login';

      }

      // Fill the templates
      ui.sidebar.setContent( tmpl( tmpl_string, ui.strings) );

      // Init the desired auth method
      session.init(params.target);

      // Initialize the data-navigo links after each route is visited to set the links in the views
      router.updatePageLinks();
      ui.sidebar.show();
   }}
}).resolve();

/**
  * 404 - not found
  */
router.notFound(function (query) {
    console.log(query);
    console.log('Hit error router');
    ui.sidebar.setContent('<h2>Something went wrong</h2></br><p>Close the sidebar and try again.</p>');
    ui.sidebar.show();
});
