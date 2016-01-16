// authentication, login, and registering
//
// created by: ville glad 6.11.2015

$(function() {
    // login
    $("#login-btn").click( login );

    // logout
    $("#logout-btn").click( logout );

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
            $('.alert-login').css({"display":"none"});
            $.ajax({
                method: api.readUser.method,
                url: api.readUser.url(),
                headers: {"Authorization": "Bearer " + response.token},
                success: function (data) {
                    console.log('alreay logged in', data);
                    $('#account-info').find('.username').html(data.user.name);
                    $('#account-info').find('.user_name').html(data.user.name);
                    $('#account-info').find('.user_id').html(data.user.id);
                    $('#account-info').find('.user_email').html(data.user.email);
                    $('#account-info').find('.created_at').html(data.user.created_at);
                    $('#account-info').find('.updated_at').html(data.user.updated_at);
                    $('#account-info').show();
                }
            });
        },
        error: function(response) {
            console.log(response);
            alert('Login failed');
            localStorage.removeItem("token");
            // $('#user-login-dialog').find('.with-errors').html('<div class="alert alert-danger" role="alert"><span class="fa fa-fw fa-exclamation" aria-hidden="true"></span><strong>Login failed!</strong> Wrong username or password.</div>');
        }
    });
}

//logout
function logout() {
    if(!localStorage.token) {
        alert('User is not logged in');
        localStorage.clear();
    }
    localStorage.clear();
    $('#account-info').hide();
    $('#menu-dialog').show();
    $('.alert-login').css({"display":"block"});
    alert("User was signed out");
    return;

}

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
            $('#create-account-dialog').hide();
            $.ajax({
                method: api.readUser.method,
                url: api.readUser.url(),
                headers: {"Authorization": "Bearer " + response.token},
                success: function (data) {
                    console.log('succee data', data);
                    $('#account-info').find('.username').html(data.user.name);
                    $('#account-info').find('.glome-info').hide;
                    $('#account-info').find('.user_id').html(data.user.id);
                    $('#account-info').find('.user_name').html(data.user.name);
                    $('#account-info').find('.user_email').html(data.user.email);
                    $('#account-info').find('.created_at').html(data.user.created_at);
                    $('#account-info').find('.updated_at').html(data.user.updated_at);
                    $('#account-info').show();
                }
            });
        },
        error: function(response) {
            console.log(response);
            alert('Registration failed');
            localStorage.removeItem("token");
        }
    });

}

// TODO THE FUNCTIONS BELOW ARE MOCK
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

            $('#menu-dialog').hide();

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

                        $('#account-info').find('.username').html(authUser.name);
                        $('#account-info').find('.user_name').html(authUser.name);
                        $('#account-info').find('.user_id').html(authUser.id);
                        $('#account-info').find('.user_email').html(authUser.email);
                        $('#account-info').find('.created_at').html(authUser.created_at);
                        $('#account-info').find('.updated_at').html(authUser.updated_at);
                        $('#account-info').show();
                    }
                }
            });
        },
        error: function(response) {
            console.log(response);
            alert('Login failed');
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
            $.ajax({
              method: 'get',
              url: 'http://api.garbagepla.net/api/authenticate/glome',
              headers: {"Authorization": "Bearer " + response.token},
              success: function (data) {
                console.log('succee data', data);
                $('#account-info').find('.username').hide;
                $('#account-info').find('.glome-key-info').html(data.user.key);
                $('#account-info').find('.user_id').hide;
                $('#account-info').find('.user_name').hide;
                $('#account-info').find('.user_email').hide;
                $('#account-info').find('.created_at').html(data.user.created_at);
                $('#account-info').find('.updated_at').html(data.user.updated_at);
                $('#account-info').show();
              }
            });
        },
        error: function(response) {
            console.log(response);
            alert('Glome key not recognized');
            localStorage.removeItem("token");
            // $('#glome-dialog').find('.with-errors').html('<div class="alert alert-danger alert-dismissible" role="alert"><span class="fa fa-fw fa-exclamation"></span><strong>Login failed!</strong> Unknown key.</div>');
        }
    });
};

// Get own glome key function
function getGlomeKey(e) {
    e.preventDefault();
};
