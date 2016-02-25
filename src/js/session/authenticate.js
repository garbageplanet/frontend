// authentication, login, and registering
// author: villeglad 6.11.2015
// modified by adriennn
// modified by feri
/*jslint browser: true, white: true, sloppy: true, maxerr: 1000*/

//login function
function login(e) {
    e.preventDefault();
    var email = $("#login-email").val(),
        password = $("#login-password").val();
    $.ajax({
        type: api.createLogin.method,
        url: api.createLogin.url(),
        data: {
            "email": email,
            "password": password
        },
        success: function (response) {
            localStorage.setItem('token', response.token);
            console.log('logged in');
            $('#user-login-dialog').hide();
            
            $.ajax({
                method: api.readUser.method,
                url: api.readUser.url(),
                headers: {"Authorization": "Bearer " + response.token},
                success: function (data) {
                  
                    // Push the data into localStorage
                    localStorage.setItem('classic', 'true');
                    localStorage.setItem('username', data.user.name);
                    localStorage.setItem('userid', data.user.id);
                    localStorage.setItem('useremail', data.user.email);
                  
                    console.log('session type is classic', localStorage.getItem('classic'));
                    console.log('username value: ', localStorage.getItem('username'));
                  
                    switchSession("login");
                    showAlert("Login successful", "success", 1500);
                  
                }
            });
        },
        error: function (response) {
            console.log(response);
            showAlert("Failed to log in.", "danger", 2000);
            localStorage.removeItem("token");
        }
    });
}

//logout
function logout() {
    if (!localStorage.token) {
        showAlert("User is already logged out.", "info", 2000);
        localStorage.clear();
    }
    
    localStorage.clear();
    sidebar.hide();
    switchSession("logout");
    showAlert("You are logged out.", "info", 2000);
    return;
}

//register
function registerUser(e) {
    e.preventDefault();
    var email = $("#register-email").val(),
        name = $("#register-name").val(),
        password = $("#register-password").val();
    $.ajax({
        type: api.createUser.method,
        url: api.createUser.url(),
        data: {
            "email": email,
            "password": password,
            "name": name
        },
        success: function (response) {
            localStorage.setItem('token', response.token);

            console.log('registered and logged in');
            $('#create-account-dialog').hide();
            $.ajax({
                method: api.readUser.method,
                url: api.readUser.url(),
                headers: {"Authorization": "Bearer " + response.token},
                success: function (data) {
                    
                    // Push the data into localStorage
                    localStorage.setItem('classic', 'true');
                    localStorage.setItem('username', data.user.name);
                    localStorage.setItem('userid', data.user.id);
                    localStorage.setItem('useremail', data.user.email);
                  
                    switchSession("login");
                    showAlert("Registration successful, you are now logged in.", "success", 2000);
                }
            });
        },
        error: function (response) {
            console.log(response);
            showAlert(response.responseText.substring(2, 30), "danger", 3500);
            localStorage.removeItem("token");
        }
    });

}

// Glome authentification
function glomego(e) {
    console.log('glomego clicked');
    e.preventDefault();
    $.ajax({
        type: api.createSoftAccount.method,
        url: api.createSoftAccount.url(),
        dataType: 'json',
        success: function (response) {
            console.log('createSoftAccount response: ');
            console.log(response);
            console.log('------------------------------------------------------------');

            var glomeid = response.user.name,
                authUser = response.user,
                token = response.token;

          
            if (!glomeid || typeof glomeid === 'undefined') {
                console.log('bad luck with soft account creation');
                showAlert("Failed to login anonymously. Reload the page and try again.", "warning", 3000);
                return;
            }

            localStorage.setItem('token', token);
            localStorage.setItem('glomekey', glomeid);
            localStorage.setItem('userid', response.user.id);

            console.log('created soft account: ' + glomeid);
            console.log('local authUser: ', authUser);
            console.log('------------------------------------------------------------');
            $('#user-login-dialog').hide();
          
            $.ajax({
                method: api.readSoftAccount.method,
                url: api.readSoftAccount.url(glomeid),
                headers: {"Authorization": "Bearer " + token},
                dataType: 'json',
                success: function (data) {
                    console.log('glome softaccount read: ', data);

                    if (!data || typeof data === 'undefined') {
                        return;
                    }

                    if (typeof authUser !== 'undefined') {
                        
                      localStorage.setItem('classic', 'false');
                      switchSession("login");
                      showAlert("You are now logged in anonymously.", "success", 2000);

                    }
                }
            });
        },
        error: function (response) {
            console.log(response);
            // alert('Login failed');
            showAlert("Failed to login anonymously. Reload the page and try again.", "warning", 3000);
            localStorage.removeItem("token");
        }
    });
}

// Submit glome key function
function sendGlomeKey(e) {
    e.preventDefault();
    var glomeKey = $("#glome-key").val();
    $.ajax({
        // TODO: add proper entries to config.js
        // and add support to the backend
        type: "POST",
        url: "http://api.garbagepla.net/api/glome/",
        data: {
            "key": glomeKey
        },
        success: function (response) {
            localStorage.setItem('token', response.token);
            console.log('registered and logged in with glome');
            $('#create-account-dialog').hide();
            switchSession("login");
            showAlert("Welcome back, anonymous!.", "success", 2000);
            $.ajax({
                method: 'get',
                url: 'http://api.garbagepla.net/api/authenticate/glome',
                headers: {"Authorization": "Bearer " + response.token},
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
            // alert('Glome key not recognized');
            showAlert("Sorry. Key not recognized.", "danger", 3000);
            localStorage.removeItem("token");
        }
    });
}

// Remove user account
function deleteUser(e) {
  var classicSessionType = localStorage.getItem('classic');
  // TODO push user id / session auth
  
  if (classicSessionType === 'true' ) {
  
  e.preventDefault();

  $.ajax({
      method: api.removeUser.method,
      url: api.readUser.url(),
      headers: {"Authorization": "Bearer " + response.token},
      success: function (data) {

          switchSession("logout");
          showAlert("Farewell, old friend.", "success", 1500);

      },
      error: function (response) {
      sidebar.hide();
      }
  });

  } else {

    showAlert("You cannot delete soft accounts.", "warning", 2000);

  }
  
  
}

$(function () {
    // logout, there are two places where user can click to logout ('button' and 'a')
    $(".btn-logout").on('click', logout);
  
    // login
    $(".btn-login").click(login);

    // register
    $("#registration-form").submit(registerUser);

    // glome go
    $(".btn-glome-go").click(glomego);

    // TODO send glome key
    $(".btn-glome-key-send").click(sendGlomeKey);
  
    // delete account
    $(".btn-delete-account").one('click', deleteUser);
});