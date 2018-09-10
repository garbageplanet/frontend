// authentication, login, and registering
// author: villeglad 6.11.2015
// modified by adriennn
// modified by feri

/* jslint browser: true, white: true, sloppy: true, maxerr: 1000 */
/* global $, tools, alerts, api, ui */

/**
  * Logins, logouts, account deletion and glome pairing
  */

var session = ( function () {

    'use strict';

    function _switchSession (o) {

        var classic_session = localStorage.getItem('classic');
        var user_tools      = $("#dropdown-user-tools");
        var session_button  = $("#user-tools-auth");
        var session_link    = $(".session-link");

        if ( o === "logout" ) {

            tools.states.loggedin = false;
            localStorage.clear();

            var account_info_link = document.querySelector('#account-info-link');

            if ( window.isMobile ) {
                // Logout the anon login leaflet control so it is dusplayed again on the map
                maps.glomelogincontrol.logout();
                // var account_info_button_mobile = $('#account-info-mobile');
                document.querySelector('#account-info-mobile').remove();
                // $(account_info_button_mobile).remove();
            }

            if ( account_info_link ) {
              account_info_link.remove();
            }

            // TODO make this with templates
            $(session_button).text('Login').attr("href","/auth/login");
            $(session_button).attr("id","");
            $(session_button).attr("data-navigo","");
            $(user_tools).dropdown();
            $(session_link).removeClass('hidden');

            document.addEventListener("DOMContentLoaded", function() {
              console.log('RESETTING SESSION LINKS')
              // manually activate tabs
              tools.activateTabs();
              // Scan newly create router links
              router.updatePageLinks();
            });
        }

        if ( o === "login" ) {

            tools.states.loggedin = true;

            if ( window.isMobile ) {

                var account_info_button_mobile_html = '<a id="account-info-mobile" ref="/info/account" class="btn btn-default btn-lg btn-block" data-navigo><span class="fa fa-fw fa-user"></span> Account info</a>';
                var mobile_menu = $("#mobile-menu");

                // Call login() method on leaflet glome control button so it is removed from the map
                maps.glomelogincontrol.login();
                $(mobile_menu).append(account_info_button_mobile_html);
            }

            var account_info_link_html = '<li id="account-info-link"><a href="/info/account" data-navigo>Account info</a></li>';

            $(session_button).text("Logout").attr("href","/auth/logout");
            // $(session_button).attr("data-navigo","");

            // Set the links to account info
            $(user_tools).prepend(account_info_link_html);

            // Must reload the dropdows in bootstrap to enable new event listeners
            $(user_tools).dropdown();

            // Manually activate tabs so we can use data-target instead of href which is incompatible with the routing
            tools.activateTabs();

            // Hide all the login elements
            $(session_link).addClass('hidden');

            // Push user data to the account view
            if ( classic_session === "true" ) {

                ui.sidebar.setContent( tmpl('tmpl-info-account', _getAccount(true)) );
                ui.sidebar.show();
            }

            // Change html to reflect anon login
            // Glome is not available anymore...
            if  ( classic_session === "false" ) {

                // FIXME non-mobile?
                if ( window.isMobile ) {

                    try {
                        maps.glomelogincontrol.login();

                    } catch (e) {
                        console.log (e);

                        try {
                            // Add a glome anonymous login button if there's none
                            maps.glomelogincontrol.addTo(maps.map);
                            maps.glomelogincontrol.login();

                        } catch (err) {
                          console.log (err);
                        }
                    }
                }
                ui.sidebar.setContent( tmpl('tmpl-info-account', _getAccount(false)) );
                ui.sidebar.show();
            }

            // Scan newly create router links
            router.updatePageLinks();
        }

        // If we only want to see the account info
        if ( o === 'view' ) {
            console.log('its a classic session:', classic_session);
            var account_data = classic_session ? _getAccount(true) : _getAccount(false);
            console.log(account_data);
            ui.sidebar.setContent( tmpl('tmpl-info-account', account_data) );
            // Scan newly create router links
            router.updatePageLinks();

            ui.sidebar.show()
        }
    }

    function _setAccount (classic, data) {

      return new Promise (function(resolve, reject) {

        if ( classic ) {

            localStorage.setItem('classic', 'true');
            localStorage.setItem('username', data.user.name);
            localStorage.setItem('id', data.user.id);
            localStorage.setItem('email', data.user.email);

        } else {

            localStorage.setItem('classic', 'false');
            localStorage.setItem('token', data.token);
            localStorage.setItem('key', data.user.name);
            localStorage.setItem('id', data.user.id);
            localStorage.setItem('authuser', data.user);
            localStorage.setItem('username', 'anon (⌐■_■)');
         }

         resolve();
      });
    }

    function _getAccount (classic) {

      return Object.freeze({
          username : localStorage.getItem('username')
        , email    : localStorage.getItem('email') || ''
        , id       : localStorage.getItem('id')
        , key      : localStorage.getItem('key') || ''
      });
    }

    function _logIn (o) {

      var params = {
        url: api.createLogin.url() + '/login',
        method: api.createLogin.method,
        data: {
              'email'   : o.email
            , 'password': o.password
        }
      };

      tools.makeApiCall(params, window.fetch)
      .then(function (res) {
          console.log(response);
          if (res) {
            localStorage.setItem('token', res.token);
            _setAccount(true, data).then(function() {
              _switchSession('login');
            });
          }
        })
        .catch(function (err) {
            console.log("login error:", err);
            // alerts.showAlert(10, 'danger', 3000);
            _switchSession('logout');
        });
    }

    function _readAccount (d) {

        console.log('checking login');

        var params = {
              method : api.readUser.method
            , url    : api.readUser.url()
            , auth: {'Authorization': 'Bearer ' + d}
        };

        return tools.makeApiCall(params, window.fetch);
    }

    function _logOut () {

        if ( !localStorage.token ) {
            //alerts.showAlert(23, 'info', 2000);
            _switchSession('logout');
        }

        else {

            var use_token = localStorage.getItem('token') || tools.token;

            var params = {
                  method : api.logoutUser.method
                , url    : api.logoutUser.url()
                , auth: {'Authorization': 'Bearer ' + use_token}
            };
            tools.makeApiCall(params, window.fetch)
            .then(function (res) {
                console.log('logout response: ', res);
                _switchSession('logout');
                //alerts.showAlert(22, 'info', 2000);
            })
            .catch(function(err){
                console.log("logout error: ", err);
                //alerts.showAlert(10, 'danger', 2000);
                _switchSession('logout');
            });
        }
    }

    function _registerAccount (o) {

        var params = {
          url: api.createUser.url(),
          method: api.createUser.method,
          data: {
                'email'   : o.email
              , 'password': o.password
              , 'name'    : o.username
          }
        };

        tools.makeApiCall(params, window.fetch)
        .then(function (response) {
            localStorage.setItem('token', response.token);
            tools.makeApiCall({
                method : api.readUser.method,
                url    : api.readUser.url(),
                auth: {'Authorization': 'Bearer ' + response.token}
              }
            , window.fetch).then(function (data) {
              // Log the user in the UI
              if (data ) {
                _setAccount(true, data).then(function(){
                  _switchSession('login');
              });
              }
            }).catch(function (err) {
              console.log("Error getting user after register: ", err);
            });
        })
        .catch( function (err) {
          console.log("regsiter error: ", err);
            _switchSession('logout');
        });
    }

    // function _glomeGo () {
    //
    //         console.log('glomego clicked');
    //
    //         var glome_call = $.ajax({
    //
    //             type    : api.createSoftAccount.method,
    //             url     : api.createSoftAccount.url(),
    //             dataType: 'json',
    //             success : function (response) {
    //                 console.log(response);
    //             },
    //             error   : function (response) {
    //                 console.log(response);
    //             }
    //         });
    //
    //         glome_call.done( function (response) {
    //
    //             if ( !glomeid || typeof glomeid === 'undefined' ) {
    //
    //                 alerts.showAlert(12, 'warning', 3000);
    //                 tools.states.loggedin = false;
    //                 return;
    //             }
    //
    //             $.ajax({
    //                 method  : api.readSoftAccount.method,
    //                 url     : api.readSoftAccount.url(response.glomeid),
    //                 headers : {'Authorization': 'Bearer ' + response.token},
    //                 dataType: 'json',
    //                 success : function (data) {
    //
    //                     if ( !data || typeof data === 'undefined' ) {
    //                         return;
    //                     }
    //
    //                     if ( typeof authUser !== 'undefined' ) {
    //
    //                       // Log the user in the UI
    //                       _setAccount(false, data).then(function() {
    //
    //                         _switchSession('login');
    //                         alerts.showAlert(13, 'success', 1500);
    //                       });
    //
    //                       tools.states.loggedin = true;
    //                     }
    //                 }
    //             });
    //         });
    //
    //         glome_call.fail( function () {
    //             alerts.showAlert(12, 'warning', 3000);
    //             _switchSession('logout');
    //         });
    //
    //     }

    function _glomePair () {
      //
    }

    function _sessionSuccessEvents (t) {
      return function (t) {
        if (t) {
          alerts.showAlert(12, 'warning', 3000);
          switchSession('login');
        } else {
          alerts.showAlert(12, 'warning', 3000);
          switchSession('logout');
        }
      }
    }

    function _resetPwd () {
      //
    }

    function _changePwd () {
        // Change password
    }

    function _deleteAccount (o) {

        var classic_session_type = localStorage.getItem('classic');
        if ( classic_session_type === 'true' ) {
            console.log('Deleting account');
            var use_token = localStorage.getItem('token');
            var params = {
                url: api.removeUser.url()
              , method: api.removeUser.method
              , auth: {'Authorization': 'Bearer ' + response.token}
              , data: {
                    'email'   : o.email
                  , 'password': o.password
              }
            };

            tools.makeApiCall(params, window.fetch)
            .then(function (response) {
              _switchSession('logout');
              localStorage.clear();
            })
            .catch(function ( error) {
              ui.sidebar.hide();
              _switchSession('logout');
            });
        } else {
            alerts.showAlert(18, 'warning', 2000);
        }
    }

    function _bindEvents (o, n) {

        console.log('form obj from auth _bindEvents()', o);

        o.validator().on('submit', function (e) {

            if ( e.isDefaultPrevented() ) {
                // isDefaultPrevented is the way the validator plugin tells sthg is wrong with the form
                alerts.showAlert(30, 'danger', 2000);
                return;
            }

            else {
                e.preventDefault();
                // Get the data from the form
                var obj = o.serializeObject();

                console.log('current form array: ', obj);

                switch ( n ) {
                    case 'login'    : _logIn(obj);
                    break;
                    case 'reset'    : _resetPwd(obj);
                    break;
                    case 'register' : _registerAccount(obj);
                    break;
                    case 'change'   : _changePwd(obj);
                    break;
                    case 'delete'   : _deleteAccount(obj);
                    break;
                    case 'glomego'  : _glomeGo(obj);
                    break;
                    case 'glomepair': _glomePair(obj);
                    break;
                }
            }
        });
    }

    /**
     * This function is called when visiting the router url "/auth/i"
     * @param {String} i - Defines what block to init ['logout','check','view']
     * @returns {Boolean} false if token check fails
     * @todo refactor this logic
     */
    function init (i) {

         switch (i) {

           case 'logout': _logOut(); break;

           case 'check':
               var token = localStorage.getItem('token');

               if (!token ) {
                   _switchSession('logout');
                   return false;
               } else {
                   _readAccount(token)
                   .then(function (res) {
                     console.log("readAccount() response: ", res);
                      if ( res.status === 200 ) {
                        _switchSession('login');
                      } else {
                        _switchSession('logout');
                      }
                   });
               }
               break;

           case 'view': _switchSession('view'); break;
           // Te default behavior for the auth namsepace is to init a formz
           default:
              this.form = $('.form-auth');
              _bindEvents(this.form, i);
         }
      }

    //return Object.freeze({ init : init });
    return { init : init };
}());
