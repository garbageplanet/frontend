/**
  * Init Navigo with the website root and default #/
  * FIXME when inbound linking to a sidebar form it seems the listeners aren't set properly
  */
var router = new Navigo('@@root', true);

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
  '/feature/:type/:id/edit'   : { as: 'feature.edit'  , uses: function (params, query) {}, before: function (done, params) { if( !tools.states.login ) { done( false ) } else { done()}} },
  '/feature/:type/:id/:action': { as: 'feature.action', uses: function (params, query) {}, before: null }
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

      // TODO same using query params instead of route

      console.log('Sharing router', params);

      // First set and load the map center on the marker
      // FIXME
      maps.map.setView([parseFloat(params.lat), parseFloat(params.lng)], 17);
      maps.map.panToOffset([parseFloat(params.lat), parseFloat(params.lng)], tools.getVerticalOffset());

      // TODO wait for API call else this doesn't work on first load
      // FIXME make a loadOne() call for that single feature and load the rest in background
      // Dirty, dirty hack
      setTimeout(function () {

        console.log('Number of active ajax calls', $.active);

        var maplayer;
        // Check that the map already has the layer containing the feature
        switch (params.type) {
            case 'garbage'  : maplayer = maps.garbageLayerGroup;  break;
            case 'litter'   : maplayer = maps.litterLayerGroup;   break;
            case 'area'     : maplayer = maps.areaLayerGroup;     break;
            case 'cleaning' : maplayer = maps.cleaningLayerGroup; break;
            default         : maplayer = null;
        }

        // Then set the content of the feature info and show the data
        if ( maps.map.hasLayer(maplayer) ) {

          ui.setContent(params.type, params.id);

        } else {

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
      var tmplstring = 'tmpl-form-' + params.type;
      console.log(tmplstring);

      // Fill the form template and activate the widgets
      ui.sidebar.setContent( tmpl(tmplstring, id) );
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

      console.log('info router', params);

      var tmplstring = 'tmpl-info-' + params.target;

      console.log('tmpl string', tmplstring);

      ui.sidebar.setContent( tmpl( tmplstring, strings.credits) );
      ui.sidebar.show();

   }}
}).resolve();


/**
  * Router for session
  * TODO build the account data from localstorage and build an obj o pass to the login account view
  */
router.on({
  '/auth/:target': { as: 'auth', uses: function (params, query) {

      console.log('auth router', params);

      var tmplstring = 'tmpl-auth-' + params.target;

      if ( params.target === 'logout' ) {

          tmplstring = 'tmpl-auth-login';

      }

      // Fill the templates
      ui.sidebar.setContent( tmpl( tmplstring, strings) );
      ui.sidebar.show();

      // We init the auth methods passing the form string to discern between auth forms
      auth.init(params.target);

      // For the auth router, we need to check for the data-navigo links after each route is visited because the views contains router links
      router.updatePageLinks();
   }}
}).resolve();

/**
  * 404 - not found
  */
router.notFound(function (query) {
    console.log(query);
    console.log('error router');
    ui.sidebar.setContent('<h2>Something went wrong</h2></br><p>Close the sidebar and try again.</p>');
    ui.sidebar.show();
});
