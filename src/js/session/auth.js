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

            var account_info_link = document.getElementById('account-info-link');

            if ( window.isMobile ) {
                // Logout the anon login leaflet control so it is dusplayed again on the map
                maps.glomelogincontrol.logout();
                // var account_info_button_mobile = $('#account-info-mobile');
                document.querySelector('#account-info-mobile').remove();
                // $(account_info_button_mobile).remove();
            }

            // TODO make this with templates
            $(session_button).text('Login').attr("href","/auth/login");
            $(session_button).attr("id","");
            $(session_button).attr("data-navigo","");
            account_info_link.remove();
            $(user_tools).dropdown();
            $(session_link).removeClass('hidden');

            document.addEventListener("DOMContentLoaded", function() {

              console.log('RESETTING SESSION  LINKS')
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

      // TODO Object.freeze() or use set setAccount(...) to create a setter function

      return new Promise ((resolve, reject) => {

        console.log('Account data from setAccount() Promise', data)

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

      })

    }

    function _getAccount (classic) {
    // do this with get getAccount(){}
        var account = {};

        if ( classic ) {

            account.username = localStorage.getItem('username');
            account.email    = localStorage.getItem('email');
            account.id       = localStorage.getItem('id');

            return account;

        } else {

            account.username = localStorage.getItem('username');
            account.key      = localStorage.getItem('key');
            account.id       = localStorage.getItem('id');

            return account;
        }
    }

    function _logIn (o) {

        var login_call = $.ajax({

            type: api.createLogin.method,
            url : api.createLogin.url() + '/login',
            data: {
                  'email'   : o.email
                , 'password': o.password
            }
        });

        login_call.done(function (response) {

            console.log(response);
            console.log(response.token);

            localStorage.setItem('token', response.token);

            // Get the user data after Authorization
            $.ajax({

                method : api.readUser.method,
                url    : api.readUser.url(),
                headers: {'Authorization': 'Bearer ' + response.token},
                success: function (data) {

                    console.log(data)

                    // Log the user in the UI
                    _setAccount(true, data).then(() => {
                      _switchSession('login');
                      alerts.showAlert(13, 'success', 1500);
                    });
                }
            });
        });

        login_call.fail(function (err) {
            console.log(err);
            alerts.showAlert(10, 'danger', 3000);
            localStorage.clear();
            tools.states.loggedin = false;
        });
    }

    function _checkLogin (d) {

        console.log('checking login');

        return $.ajax({
              method : api.readUser.method
            , url    : api.readUser.url()
            , headers: {'Authorization': 'Bearer ' + d}
        });
    }

    function _logOut () {

        if ( !localStorage.token ) {

            alerts.showAlert(23, 'info', 2000);
            localStorage.clear();
            tools.states.loggedin = false;
        }

        else {

            var use_token = localStorage.getItem('token') || tools.token;

            var logout_call = $.ajax({

                method : api.logoutUser.method,
                url    : api.logoutUser.url(),
                headers: {'Authorization': 'Bearer ' + use_token},
                success: function (response) {
                    // console.log(response);
                },

                error: function (response) {
                    // console.log(response);
                }
            });

            logout_call.done(function (data) {

                // console.log('logout response: ', data);

                _switchSession('logout');
                alerts.showAlert(22, 'info', 2000);
                localStorage.clear();
                tools.states.loggedin = false;
            });

            logout_call.fail(function(){
                alerts.showAlert(10, 'danger', 2000);
                tools.states.loggedin = false;
            });
        }
    }

    function _registerAccount (o) {

            console.log('reigtser obj:', o);

            var register_call = $.ajax({

                type: api.createUser.method,
                url : api.createUser.url(),
                data: {
                    'email': o.email,
                    'password': o.password,
                    'name': o.username
                },
                success: function (response) {
                    console.log(response);
                },
                error: function (response) {
                    console.log(response);
                }
            });

            register_call.done(function (response) {

                localStorage.setItem('token', response.token);

                $.ajax({

                    method : api.readUser.method,
                    url    : api.readUser.url(),
                    headers: {'Authorization': 'Bearer ' + response.token},
                    success: function (data) {

                      // Log the user in the UI
                      _setAccount(true, data).then(() => {

                        _switchSession('login');
                        alerts.showAlert(13, 'success', 1500);
                      });
                    }
                });
            });

            register_call.fail( function () {
                alerts.showAlert(1, 'danger', 3500);
                localStorage.clear();
                tools.states.loggedin = false;
            });

        }

    function _glomeGo () {

            console.log('glomego clicked');

            var glome_call = $.ajax({

                type    : api.createSoftAccount.method,
                url     : api.createSoftAccount.url(),
                dataType: 'json',
                success : function (response) {
                    console.log(response);
                },
                error   : function (response) {
                    console.log(response);
                }
            });

            glome_call.done( function (response) {

                if ( !glomeid || typeof glomeid === 'undefined' ) {

                    alerts.showAlert(12, 'warning', 3000);
                    tools.states.loggedin = false;
                    return;
                }

                $.ajax({
                    method  : api.readSoftAccount.method,
                    url     : api.readSoftAccount.url(response.glomeid),
                    headers : {'Authorization': 'Bearer ' + response.token},
                    dataType: 'json',
                    success : function (data) {

                        if ( !data || typeof data === 'undefined' ) {
                            return;
                        }

                        if ( typeof authUser !== 'undefined' ) {

                          // Log the user in the UI
                          _setAccount(false, data).then(() => {

                            _switchSession('login');
                            alerts.showAlert(13, 'success', 1500);
                          });

                          tools.states.loggedin = true;
                        }
                    }
                });
            });

            glome_call.fail( function () {
                alerts.showAlert(12, 'warning', 3000);
                localStorage.clear();
                tools.states.loggedin = false;
            });

        }

    function _glomePair () {
      //
    }

    function _sessionSuccessEvents (t) {

      return function (t) {

        if (t) {

          alerts.showAlert(12, 'warning', 3000);
          switchSession('login');
          tools.states.loggedin = true;

        } else {

          alerts.showAlert(12, 'warning', 3000);
          switchSession('logout');
          localStorage.clear();
          tools.states.loggedin = false;
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

            var delete_account_call = $.ajax({

                method : api.removeUser.method,
                url    : api.removeUser.url(),
                headers: {'Authorization': 'Bearer ' + use_token},
                data   : {
                    'email': o.email,
                    'password': o.password
                },
                success: function (response) {
                    console.log(response);
                },
                error  : function (response) {
                    console.log(response);
                }
            });

            delete_account_call.done( function () {
                _switchSession('logout');
                alerts.showAlert(17, 'success', 2000);
                localStorage.clear();
            });

            delete_account_call.fail( function () {
                ui.sidebar.hide();
                alerts.showAlert(10, 'danger', 2000);
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

    function init (i) {

        /*
         * This function is called when visiting the router url "/auth/i"
         * @params i {String} defines what block to init ['logout','check','login']
         */

         switch (i) {

           case 'logout': _logOut(); break;

           case 'check':
               var token = localStorage.getItem('token');

               if (!token ) {

                   localStorage.clear();
                   return;

               } else {

                   var check_login_call = _checkLogin(token);

                   check_login_call.done(function (res) {
                       // console.log(res);
                       _switchSession('login');
                   });

                   check_login_call.fail(function (res) {
                       alerts.showAlert(21, 'danger', 2000);
                       // console.log(res);
                       _switchSession('logout');
                       localStorage.clear();
                   });
               }

               break;

           case 'view': _switchSession('view'); break;

           default:
              this.form = $('.form-auth');
              _bindEvents(this.form, i);
         }
      }

    return { init : init }
}());
