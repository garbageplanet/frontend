/**
  *
  * Init Navigo with the website root and default #/
  *
  */
var router = new Navigo('@@root', true);

// Hack to reset the router
router.on({
  '/' : { as: 'blank', uses: function () { return; }}
});

/**
  *
  * Router for showing map feature infos
  *
  */
router.on({
  '/feature/:type/:id/show'   : { as: 'feature.show'  , uses: function (params, query) { ui.setContent(params.type, params.id); }},
  '/feature/:type/:id/edit'   : { as: 'feature.edit'  , uses: function (params, query) {}, before: function (done, params) { if( !tools.states.login ) { done( false ) } else { done()}} },
  '/feature/:type/:id/:action': { as: 'feature.action', uses: function (params, query) {}, before: null }
}).resolve();

/**
  *
  * Router for forms
  *
  */
router.on({
  '/form/:type/:id': { as: 'form', uses: function (params, query) {

      console.log('auth router');

      // Pass the feature id as obj to the template
      var id = {};
      id['id'] = parseInt(params.id, 10);
      console.log(JSON.stringify(id));

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
  *
  * Router for info views (account, feature, project)
  *
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
  *
  * Router for session
  * TODO build the account data from localstorage and build an obj o pass to the login account view
  */
router.on({
  '/auth/:target': { as: 'auth', uses: function (params, query) {

      console.log('auth router', params);

      var tmplstring = 'tmpl-auth-' + params.target;

      // Fill the templates
      ui.sidebar.setContent( tmpl( tmplstring, strings) );
      ui.sidebar.show();

      // We init the auth methods passing false so we
      auth.init(false);

      // For the auth router, we need to check for the data-navigo links after each route is visited because the views contains router links
      router.updatePageLinks();
   }}
}).resolve();

/**
  *
  * 404 - not found
  *
  */
router.notFound(function (query) {
    console.log(query);
    console.log('error router');
    ui.sidebar.setContent('<h2>Something went wrong</h2></br><p>Close the sidebar and try again.</p>');
    ui.sidebar.show();
});
