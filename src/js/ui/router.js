/**
  *
  * Init Navigo with the root and default #/
  *
  */
var router = new Navigo('@@root', true);

/**
  *
  * Router for showing map feature infos
  * TODO check that the id is present in current mapview, else user can browse to non-existent markers
  */
router.on({
  '/feature/:type/:id?show'   : { as: 'feature.show'  , uses: function (params, query) { ui.pushDataToBottomPanel(params.type, params.id); }},
  '/feature/:type/:id?edit'   : { as: 'feature.edit'  , uses: function (params, query) {}, before: function (done, params) { if( !tools.states.login ) { done( false ) } else { done()}} },
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

      // FIll the form template and activate the widgets
      ui.sidebar.setContent( tmpl(tmplstring, id) );
      forms.makeForm(params.id, params.type);
      ui.sidebar.show();
    }
}}).resolve();

/**
  *
  * Router for info views and other actions
  *
  */
router.on({
  '/info/:target': { as: 'info', uses: function (params, query) {

      console.log('info router', params);

      switch ( params.target ) {

          case 'credits'   : ui.sidebar.setContent( tmpl('tmpl-info-credits', ui.templates.credits) );
          break;
          case 'privacy'   : ui.sidebar.setContent( tmpl('tmpl-info-privacy', ui.templates) );
          break;
          case 'tour'      : tour.init();
          break;
          case 'trashbins' : maps.getTrashBins();
          break;
          default          : ui.sidebar.setContent( '<h2>Something went wrong</h2></br><p>Close the sidebar and try again.</p>' );
      }
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

      switch ( params.target ) {

          case 'account'  : ui.sidebar.setContent( tmpl('tmpl-auth-account', userobj) ); // account infos view
          break;
          case 'login'    : ui.sidebar.setContent( tmpl('tmpl-auth-login', userobj) ); // login / logout form
          break;
          case 'register' : ui.sidebar.setContent( tmpl('tmpl-auth-register', userobj) ); // register new account view
          break;
          case 'recover'  : ui.sidebar.setContent( tmpl('tmpl-auth-recover', userobj) ); // recover forgottenpassword
          break;
          case 'delete'   : ui.sidebar.setContent( tmpl('tmpl-auth-delete', userobj) ); // Delete account
          break;
          case 'glome'   : ui.sidebar.setContent( tmpl('tmpl-auth-glome', userobj) ); // Glome account pairing
          break;
          default         : ui.sidebar.setContent( '<h2>Something went wrong</h2></br><p>Close the sidebar and try again.</p>' );
      }
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
