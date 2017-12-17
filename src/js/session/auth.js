// authentication, login, and registering
// author: villeglad 6.11.2015
// modified by adriennn
// modified by feri

/* jslint browser: true, white: true, sloppy: true, maxerr: 1000 */
/* global $, tools, alerts, api, ui */

/**
  * Logins, logouts, account deletion and glome pairing
  */

var auth = ( function () {

    'use strict';

    function _switchSession (o) {

        // TODO Mobile menu
        // FIXME FIXME FIXME FIXME UI DOESN WORK

        // UI changes when user logs in or out
        var classic_session = localStorage.getItem('classic');

        var session_button = $(".session-button-topbar>a");
        var user_tools     = $("#user-tools");
        var session_link   = $(".session-link");
        var mobile_menu    = $(".mobile-menu");

        var account_info_link_html     = '<li id="account-info-link"><a href="#/info/account" data-navigo>Account info</a></li>';
        var account_info_button        = '<a id="account-info-mobile" ref="#/info/account" class="btn btn-default btn-lg btn-block" data-navigo><span class="fa fa-fw fa-user"></span> Account info</a>';
        var account_info_button_mobile = $('#account-info-mobile');
        var account_info_link          = $('#account-info-link');

        if ( o === "logout" ) {

            // this is the leaflet plugin for the custom glome anonymous login button
            if ( window.isMobile ) {
                maps.glomelogincontrol.logout();
            }

            // TODO make this with templates
            $(session_button).text('Login').attr("href","/auth/login");
            $(session_button).attr("id","");
            $(session_button).attr("data-navigo","");
            // (session_status).addClass('dropdown-link');
            $(account_info_link).remove();
            $(account_info_button_mobile).remove();
            $(user_tools).dropdown();
            $(session_link).removeClass('hidden');

            // Scan newly create router links
            router.updatePageLinks();
        }

        if ( o === "login" ) {

            if ( window.isMobile ) {
                // Call login() method on leaflet glome control button so it is removed from the map
                maps.glomelogincontrol.login();
                $(mobile_menu).append(account_info_button_mobile);
            }

            $(session_button).text("Logout").attr("href","#/auth/logout");
            // $(session_button).removeClass('dropdown-link');
            $(session_button).attr("data-navigo","");

            // Reset the event listener for the modified button
            // $(session_status).on('click', '#btn-logout', function() {
            //     // change the UI
            //     _switchSession("logout");
            //     // server-side logout
            //     _logOut();
            // });

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
    }

    function _setAccount (classic, data) {

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

        var logincall = $.ajax({

            type: api.createLogin.method,
            url : api.createLogin.url() + '/login',
            data: {
                  'email'   : o.email
                , 'password': o.password
            }
        });

        logincall.done(function (response) {

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

        logincall.fail(function (err) {
            console.log(err);
            alerts.showAlert(10, 'danger', 3000);
            localStorage.clear();
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
        // FIXME serverside logout backend replies 401
        if ( !localStorage.token ) {

            alerts.showAlert(23, 'info', 2000);
            localStorage.clear();
        }

        else {

            var useToken = localStorage.getItem('token') || tools.token;

            var logoutcall = $.ajax({

                method : api.logoutUser.method,
                url    : api.logoutUser.url(),
                headers: {'Authorization': 'Bearer ' + useToken},
                success: function (response) {
                    console.log(response);
                },

                error: function (response) {
                    console.log(response);
                }
            });

            logoutcall.done(function (data) {

                console.log('logout response: ', data);

                _switchSession('logout');
                alerts.showAlert(22, 'info', 2000);
                localStorage.clear();
            });

            logoutcall.fail(function(){
                alerts.showAlert(10, 'danger', 2000);
            });
        }
    }

    function _registerAccount (o) {

            console.log('reigtser obj:', o);

            var registercall = $.ajax({

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

            registercall.done(function(response) {

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

            registercall.fail( function () {
                alerts.showAlert(1, 'danger', 3500);
                localStorage.clear();
            });

        }

    function _glomeGo () {

            console.log('glomego clicked');

            var glomecall = $.ajax({

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

            glomecall.done( function (data) {

                if ( !glomeid || typeof glomeid === 'undefined' ) {

                    alerts.showAlert(12, 'warning', 3000);
                    return;
                }

                $.ajax({
                    method  : api.readSoftAccount.method,
                    url     : api.readSoftAccount.url(glomeid),
                    headers : {'Authorization': 'Bearer ' + token},
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
                        }
                    }
                });
            });

            glomecall.fail( function () {
                alerts.showAlert(12, 'warning', 3000);
                localStorage.clear();
            });

        }

    function _glomePair () {
      //
    }

    function _resetPwd () {
      //
    }

    function _changePwd () {
        // Change password
    }

    function _deleteAccount (o) {

        var classicSessionType = localStorage.getItem('classic');

        if ( classicSessionType === 'true' ) {

            console.log('Deleting account');

            var useToken = localStorage.getItem('token');

            var deleteaccountcall = $.ajax({

                method : api.removeUser.method,
                url    : api.removeUser.url(),
                headers: {'Authorization': 'Bearer ' + useToken},
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

            deleteaccountcall.done(function() {
                _switchSession('logout');
                alerts.showAlert(17, 'success', 2000);
                localStorage.clear();
            });

            deleteaccountcall.fail(function() {
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
         * TODO make this a pure function or make it return promise from ajax api calls
         */

        if ( i === 'logout' ) {

            _logOut();

        } else if ( i === 'check' ) {

            var token = localStorage.getItem('token');

            if (!token ) {

                localStorage.clear();
                return;

            } else {

                var checklogincall = _checkLogin(token);

                checklogincall.done(function (res) {
                    // console.log(res);
                    _switchSession('login');
                });

                checklogincall.fail(function (res) {
                    alerts.showAlert(21, 'danger', 2000);
                    // console.log(res);
                    _switchSession('logout');
                    localStorage.clear();
                });
            }

          } else {

              try {

                this.form = $('.form-auth');
                _bindEvents(this.form, i);

              } catch (e) {

                console.log('error initiating auth:', e)
              }
          }
      }

    return { init : init }
}());
