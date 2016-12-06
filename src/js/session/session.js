// authentication, login, and registering
// author: villeglad 6.11.2015
// modified by adriennn
// modified by feri
/*jslint browser: true, white: true, sloppy: true, maxerr: 1000*/

/**
* Logins, logouts, account deletion and glome pairing
*/

var session = (function () {
    
    var switchSession = function(sessionStatus) {

        var classicSessionType = localStorage.getItem('classic');

        if (sessionStatus === "logout") {

            // Change display of custom login button on mobile
            if (window.innerWidth < 768) { 
                // this is the leaflet plugin for the custom glome anonymous login button
                maps.glomelogincontrol.logout();
            }

            $('#session-status a').text('Login').attr("href","#user-login-dialog");
            $('#session-status a').attr("id","");
            $('#session-status a').addClass('dropdown-link');
            $('#user-info-link').remove();
            $('#user-info-mobile-link').remove();
            $('#user-tools').dropdown();
            $('.user-email, .user-glome-key').removeClass('hidden');
            $(".session-link").removeClass('hidden');

        }

        if (sessionStatus === "login") {
            
            if (window.innerWidth < 768) {
                // remove the anonymous login button
                maps.glomelogincontrol.login();
            }

            $("#session-status a").text("Logout").attr("href","#");
            $("#session-status a").attr("id","btn-logout");
            $("#session-status a").removeClass('dropdown-link');
            // Reset the event listener for the modified button
            $("#session-status").on('click', '#btn-logout', function() {
                // change the UI
                switchSession("logout");
                // server-side logout
                logout();
            });

            // Reset the event listeners
            $("#user-tools").prepend('<li id="user-info-link"><a class="dropdown-link" href="#account-info">User info</a></li>');
            $("#user-info-link a").on("click", function(e) {

                                          e.preventDefault();
                                          $('#sidebar').scrollTop = 0;
                                          $(this.hash).fadeIn().siblings().hide();
                                          ui.sidebar.show();
                                        });

            $(".mobile-menu").append('<a href="#account-info" id="user-info-mobile-link" class="sidebar-link btn btn-default btn-lg btn-block"><span class="fa fa-fw fa-user"></span> User info</a>');
            $("#user-info-mobile-link").on("click", function(e) {

                                          e.preventDefault();
                                          $('#sidebar').scrollTop = 0;
                                          $(this.hash).fadeIn().siblings().hide();
                                        });

            // Must reload the dropdows in bootstrap to enable new event listeners
            $("#user-tools").dropdown();
            // Hide all the login elements
            $(".session-link").addClass('hidden');

            // Push user data to the UI
            // get the data from localStorage or sessionStorage and clear the other
            if (classicSessionType === "true") {

                $('#account-info').find('.user-email').removeClass('hidden');
                $('#account-info').find('.user-name').text(localStorage.getItem('username'));
                $('#account-info').find('.user-email p').html(localStorage.getItem('useremail'));
                $('#account-info').find('.user-glome-key').addClass('hidden');
                $('#account-info').find('.user-id').html(localStorage.getItem('userid'));
                $('.sidebar-content').hide();

                // Make sure the sidebar is visible before displaying the user info
                if (!ui.sidebar.isVisible()) {
                    ui.sidebar.show();
                }

                $('#account-info').show();
            }

            // FIXME that's a literal false
            // Change html to reflect anon login
            if  (classicSessionType === "false") {
                
                if (window.innerWidth < 768) {
                    if (!map.glomelogincontrol) {
                        // Add a glome anonymous login button
                        maps.glomelogincontrol.addTo(map);
                        maps.glomelogincontrol.login();
                    }
                    // this is the leaflet plugin for the custom glome anonymous login button
                    maps.glomelogincontrol.login();
                }

                $('#account-info').find('.user-name').text('anon (⌐■_■)');
                $('#account-info').find('.user-email').addClass('hidden');
                $('#account-info').find('.user-glome-key p').html(tools.makeEllipsis(localStorage.getItem('glomekey'), 25));
                $('#account-info').find('.user-id').html(localStorage.getItem('userid'));
                $('.sidebar-content').hide();

                if (!ui.sidebar.isVisible()) {
                    ui.sidebar.show();
                }

                $('#account-info').show();
            }
        }
    },
        login = function(e) {

            e.preventDefault();

            var email = $('#login-email').val();
            var password = $('#login-password').val();

            $.ajax({

                type: api.createLogin.method,
                url: api.createLogin.url(),
                data: {
                    'email': email,
                    'password': password
                },

                success: function (response) {

                    localStorage.setItem('token', response.token);

                    $.ajax({

                        method: api.readUser.method,
                        url: api.readUser.url(),
                        headers: {'Authorization': 'Bearer ' + response.token},
                        success: function (data) {

                            $('#user-login-dialog').hide();

                            // Push the data into localStorage
                            localStorage.setItem('classic', 'true');
                            localStorage.setItem('username', data.user.name);
                            localStorage.setItem('userid', data.user.id);
                            localStorage.setItem('useremail', data.user.email);
                            console.log('session type is classic', localStorage.getItem('classic'));
                            console.log('username value: ', localStorage.getItem('username'));
                            switchSession('login');
                            alerts.showAlert(13, 'success', 1500);
                        }
                    });
                },

                error: function (response) {

                    console.log(response);
                    alerts.showAlert(24, 'danger', 2000);
                    localStorage.removeItem('token');
                }
            });
        },
        checkLogin = function() {
        
            // TODO checklogin for glome key as well
            var useToken = localStorage.getItem('token') || window.token;

            $.ajax({

                method: api.readUser.method,
                url: api.readUser.url(),
                headers: {'Authorization': 'Bearer ' + useToken},
                success: function () {

                    // double-check the localStorage still has the token
                    // TODO add a condition with a paramaeter passed to the function if we only wanna check that the session is valid
                    // or use 'return true' and work from there so that we can simply call 'checkLogin()'
                    if (useToken) {
                        switchSession('login');
                    }
                },

                error: function() {

                    if (useToken) {

                        alerts.showAlert(21, 'danger', 2000);
                        switchSession('logout');
                        localStorage.clear();
                        ui.sidebar.show($('#user-login-dialog').show().siblings().hide());
                    }
                }
            });
        },
        logout = function() {
            // FIXME serverside logout backend replies 401
            if (!localStorage.token) {
                alerts.showAlert(23, 'info', 2000);
                localStorage.clear();
            }

            else {

                var useToken = localStorage.getItem('token') || window.token;

                $.ajax({

                    method: api.logoutUser.method,
                    url: api.logoutUser.url(),
                    headers: {'Authorization': 'Bearer ' + useToken},
                    success: function () {

                        switchSession('logout');
                        alerts.showAlert(22, 'info', 2000);
                        localStorage.clear();

                        if (ui.sidebar.isVisible()) {
                            ui.sidebar.hide();
                        } 
                    },

                    error: function () {
                        alerts.showAlert(10, 'danger', 2000);
                    }
                });
            }
        },
        register = function(e) {

            e.preventDefault();

            var email = $('#register-email').val();
            var name = $('#register-name').val();
            var password = $('#register-password').val();

            $.ajax({

                type: api.createUser.method,
                url: api.createUser.url(),
                data: {
                    'email': email,
                    'password': password,
                    'name': name
                },
                success: function (response) {

                    localStorage.setItem('token', response.token);
                    $('#create-account-dialog').hide();

                    $.ajax({

                        method: api.readUser.method,
                        url: api.readUser.url(),
                        headers: {'Authorization': 'Bearer ' + response.token},
                        success: function (data) {

                            console.log(data);
                            // Push the data into localStorage
                            localStorage.setItem('classic', 'true');
                            localStorage.setItem('username', data.user.name);
                            localStorage.setItem('userid', data.user.id);
                            localStorage.setItem('useremail', data.user.email);
                            switchSession('login');
                            alerts.showAlert(13, 'success', 2000);
                        }

                    });

                },

                error: function (response) {

                    alerts.showAlert(1, 'danger', 3500);
                    localStorage.removeItem('token');
                }

            });

        },
        glomeGo = function() {
    
            console.log('glomego clicked');

            // e.preventDefault();
            $.ajax({

                type: api.createSoftAccount.method,
                url: api.createSoftAccount.url(),
                dataType: 'json',
                success: function (response) {

                    var glomeid = response.user.name,
                        authUser = response.user,
                        token = response.token;

                    if (!glomeid || typeof glomeid === 'undefined') {

                        alerts.showAlert(12, 'warning', 3000);
                        return;
                    }

                    localStorage.setItem('token', token);
                    localStorage.setItem('glomekey', glomeid);
                    localStorage.setItem('userid', response.user.id);
                    $('#user-login-dialog').hide();

                    $.ajax({
                        method: api.readSoftAccount.method,
                        url: api.readSoftAccount.url(glomeid),
                        headers: {'Authorization': 'Bearer ' + token},
                        dataType: 'json',
                        success: function (data) {

                            console.log('glome softaccount read: ', data);

                            if (!data || typeof data === 'undefined') {
                                return;
                            }

                            if (typeof authUser !== 'undefined') {

                              localStorage.setItem('classic', 'false');
                              switchSession('login');
                              alerts.showAlert(13, 'success', 2000);
                            }
                        }
                    });
                },

                error: function (response) {

                    console.log(response);
                    alerts.showAlert(12, 'warning', 3000);
                    localStorage.removeItem('token');
                }
            });
        },
        deleteAccount = function(e) {
            // FIXME backend replies 405 method not allowed

            var classicSessionType = localStorage.getItem('classic');

            if (classicSessionType === 'true') {

                console.log('DELETING ACCOUNT');

                e.preventDefault();

                var useToken = localStorage.getItem('token'),
                    email = localStorage.getItem('useremail'),           
                    password = $('#delete-password').val();

                $.ajax({

                    method: api.removeUser.method,
                    url: api.removeUser.url(/*userid*/),
                    headers: {'Authorization': 'Bearer ' + useToken},
                    data: {
                        'email': email,
                        'password': password
                    },

                    success: function () {
                        switchSession('logout');
                        alerts.showAlert(17, 'success', 2000);
                        localStorage.clear();
                    },

                    error: function () {
                        ui.sidebar.hide();
                        alerts.showAlert(10, 'danger', 2000);
                    }

                });

            } else {
                alerts.showAlert(18, 'warning', 2000);
            }

        },
        sendKey = function (e) {
    
            e.preventDefault();

            // TODO parse the field
            var glomeKey = $('#glome-key').val();

            $.ajax({

                type: api.checkGlomeKey.method,
                url: api.receiveGlomeKey.url(),
                data: {
                    'key': glomeKey
                },

                success: function (response) {

                    localStorage.setItem('token', response.token);
                    console.log('registered and logged in with glome');
                    $('#create-account-dialog').hide();
                    switchSession('login');
                    alerts.showAlert(20, 'success', 2000);

                    $.ajax({

                        method: 'get',
                        url: 'http://api.garbagepla.net/api/authenticate/glome',
                        headers: {'Authorization': 'Bearer ' + response.token},
                        success: function (data) {

                            console.log('succee data', data);
                            $('#account-info').find('.user-glome-key p').html(data.user.key);
                            $('#account-info').find('.user-email').addClass('hidden');
                            $('#account-info').find('.created-at').html(data.user.created_at);
                            $('#account-info').find('.updated-at').html(data.user.updated_at);
                            $('#account-info').show();
                        }

                    });

                },

                error: function (response) {

                    console.log(response);
                    alerts.showAlert(19, 'danger', 3000);
                    localStorage.removeItem('token');
                }

            });

        }, 
        bindEvents = $(function(){
            // logout, there are two places where user can click to logout ('button' and 'a')
            $('.btn-logout').on('click', session.logout);
            // login
            $('.btn-login').on('click', session.login);
            // register
            $('#registration-form').submit(session.register);
            // glome go
            $('.btn-glome-go').on('click', session.glomego);
            // TODO send glome key
            $('.btn-glome-key-send').on('click', session.sendkey);
            // delete account
            $('.btn-delete-account').one('click', session.deleteaccount);

            // Check if the localStorage has token, if yes log the user in with data
            if (localStorage.getItem('token')) {
                // Check the current session with the backend
                session.checklogin();
            }
        });
    
    return {
        login: login,
        checklogin:checkLogin,
        logout: logout,
        register: register,
        glomego: glomeGo,
        deleteaccount: deleteAccount,
        sendkey: sendKey
    };
    
}());