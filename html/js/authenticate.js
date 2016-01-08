// authentication, login, and registering
//
// created by: ville glad 6.11.2015

$(function() {
    // login
    $("#login-form").submit( login );

    // logout
    $("#logout-btn").click( logout );

    // register
    $("#registration-form").submit( registerUser );
    
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
        type: "POST",
        url: "http://api.garbagepla.net/api/authenticate",
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
              url: 'http://api.garbagepla.net/api/authenticate/user',
              headers: {"Authorization": "Bearer " + response.token},
              method: 'get',
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
        type: "POST",
        url: "http://api.garbagepla.net/api/register",
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
              url: 'http://api.garbagepla.net/api/authenticate/user',
              headers: {"Authorization": "Bearer " + response.token},
              method: 'get',
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

// Submit glome key function
function sendGlomeKey(e) {
    e.preventDefault();
    var glomeKey = $("#glome-key").val();
    $.ajax({
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
              url: 'http://api.garbagepla.net/api/authenticate/glome',
              headers: {"Authorization": "Bearer " + response.token},
              method: 'get',
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