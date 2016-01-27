// authentication, login, and registering
// author: ville glad 6.11.2015
// modified by adriennn
// modified by ferencszekely

// Why do these calls sit inside an anon function?
$(function() {
    // logout, there are two places where user can click to logout ('button' and 'a')
    $(".btn-logout").on('click', logout );
  
    // login
    $("#login-btn").click( login )

    // register
    $("#registration-form").submit( registerUser );

    // glome go
    $("#glome-go-btn").click( glomego );

    // TODO get a glome key
    $("#get-glome-key-btn").click( getGlomeKey );

    // TODO send glome key
    $("#send-glome-key-btn").click( sendGlomeKey );
});

//login function
function login(e) {
    e.preventDefault();
    var email = $("#login-email").val();
    var password = $("#login-password").val();
    $.ajax({
        type: api.createLogin.method,
        url: api.createLogin.url(),
        data: {
            "email":email,
            "password":password
        },
        success: function(response) {
            localStorage["token"] = response.token;
            console.log('logged in')
            $('#user-login-dialog').hide();
            showAlert("Login successful", "success", 1500);
            switchSession("login");
            $.ajax({
                method: api.readUser.method,
                url: api.readUser.url(),
                headers: {"Authorization": "Bearer " + response.token},
                success: function (data) {
                    console.log('alreay logged in', data);
                    $('#account-info').find('.user-name').html(data.user.name);
                    $('#account-info').find('.user-id').html(data.user.id);
                    $('#account-info').find('.user-glome-key').addClass('hidden');
                    $('#account-info').find('.user-email p').html(data.user.email);
                    $('#account-info').find('.created-at').html(data.user.created_at);
                    $('#account-info').find('.updated-at').html(data.user.updated_at);
                    $('#account-info').show();
                }
            });
        },
        error: function(response) {
            console.log(response);
            showAlert("Failed to log in.", "danger", 2000);
            localStorage.removeItem("token");
        }
    });
}

//logout
function logout() {
    if(!localStorage.token) {
        showAlert("User is already logged out.", "info", 2000);
        localStorage.clear();
    }
    localStorage.clear();
    sidebar.hide();
    switchSession("logout");
    showAlert("You are logged out.", "info", 2000);
    return;
};

//register
function registerUser(e) {
    e.preventDefault();
    var email = $("#register-email").val();
    var name = $("#register-name").val();
    var password = $("#register-password").val();
    $.ajax({
        type: api.createUser.method,
        url: api.createUser.url(),
        data: {
            "email":email,
            "password":password,
            "name":name
        },
        success: function(response) {
            localStorage["token"] = response.token;
            console.log('registered and logged in');
            showAlert("Registration successful, you are now logged in.", "success", 2000);
            switchSession("login");
            $('#create-account-dialog').hide();
            $.ajax({
                method: api.readUser.method,
                url: api.readUser.url(),
                headers: {"Authorization": "Bearer " + response.token},
                success: function (data) {
                    console.log('success data', data);
                    $('#account-info').find('.username').html(data.user.name);
                    $('#account-info').find('.glome-key-info').addClass('hidden');
                    $('#account-info').find('.user_id').html(data.user.id);
                    $('#account-info').find('.user_name').html(data.user.name);
                    $('#account-info').find('.user_email').html(data.user.email);
                    $('#account-info').find('.created_at').html(data.user.created_at);
                    $('#account-info').find('.updated_at').html(data.user.updated_at);
                    $('#account-info').show();
                }
            });
        },
        error: function(response, responseJSON) {
            console.log(response);
            showAlert("Something went wrong. Failed to register.", "danger", 2000);
            showAlert(responseJSON, "danger", 2000);
            localStorage.removeItem("token");
        }
    });

};

// Glome authentification
// TODO fix glome token useage in window
function glomego(e) {
    console.log('glomego clicked');
    e.preventDefault();
    $.ajax({
        type: api.createSoftAccount.method,
        url: api.createSoftAccount.url(),
        dataType: 'json',
        success: function(response) {
            console.log('createSoftAccount response: ');
            console.log(response);
            console.log('------------------------------------------------------------');

            var glomeid = response.user.name;

            if (! glomeid || typeof glomeid == 'undefined') {
                console.log('bad luck with soft account creation');
                showAlert("Failed to login anonymously. Reload the page and try again.", "warning", 3000);
                return;
            }

            var authUser = response.user;
            var token = response.token;
            localStorage["glomeid"] = glomeid;
            localStorage["token"] = token;

            console.log('created soft account: ' + glomeid);
            console.log('local authUser: ');
            console.log(authUser);
            console.log('------------------------------------------------------------');
            switchSession("login");
            $('#user-login-dialog').hide();
            showAlert("You are now logged in anonymously.", "success", 2000);

            $.ajax({
                method: api.readSoftAccount.method,
                url: api.readSoftAccount.url(glomeid),
                headers: {"Authorization": "Bearer " + token},
                dataType: 'json',
                success: function (data) {
                    console.log('glome softaccount read: ', data);

                    if (! data || typeof data == 'undefined') {
                        return;
                    }

                    if (typeof authUser !== 'undefined') {
                        console.log('authUser: ', authUser);
                        $('#account-info').find('.user-name').text('anon (⌐■_■)');
                        $('#account-info').find('.user-email').addClass('hidden');
                        $('#account-info').find('.user-glome-key p').html(authUser.name);
                        $('#account-info').find('.user-id').html(authUser.id);
                        $('#account-info').find('.created-at').html(authUser.created_at);
                        $('#account-info').find('.updated-at').html(authUser.updated_at);
                        $('#account-info').show();
                    }
                }
            });
        },
        error: function(response) {
            console.log(response);
            // alert('Login failed');
            showAlert("Failed to login anonymously. Reload the page and try again.", "warning", 3000);
            localStorage.removeItem("token");
        }
    });
};

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
            "key":glomeKey,
        },
        success: function(response) {
            localStorage["token"] = response.token;
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
        error: function(response) {
            console.log(response);
            // alert('Glome key not recognized');
            showAlert("Sorry. Key not recognized.", "danger", 3000);
            localStorage.removeItem("token");
        }
    });
};

// Get own glome key function
function getGlomeKey(e) {
    e.preventDefault();
};