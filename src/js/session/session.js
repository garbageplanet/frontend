// Swtch session function
// TODO destroy/replace/append elements instead of hiding them
// TODO add direct logout button to mobile menu
function switchSession(sessionStatus) {

    var classicSessionType = localStorage.getItem('classic');

    if (sessionStatus === "logout") {

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

        $("#session-status a").text("Logout").attr("href","#");
        
        $("#session-status a").attr("id","btn-logout");
        
        $("#session-status a").removeClass('dropdown-link');
        
        $("#session-status").on('click', '#btn-logout', function() {
            
            switchSession("logout"); logout();
        
        });
        
        $("#user-tools").prepend('<li id="user-info-link"><a class="dropdown-link" href="#account-info">User info</a></li>');
        
        $("#user-info-link a").on("click", function(e) {
            
                                      e.preventDefault();
            
                                      $('#sidebar').scrollTop = 0;
            
                                      $(this.hash).fadeIn().siblings().hide();
            
                                      sidebar.show();
            
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

        // get the data from localStorage or sessionStorage and clear the other
        if (classicSessionType === "true") {

            $('#account-info').find('.user-email').removeClass('hidden');
            
            $('#account-info').find('.user-name').text(localStorage.getItem('username'));
            
            $('#account-info').find('.user-email p').html(localStorage.getItem('useremail'));
            
            $('#account-info').find('.user-glome-key').addClass('hidden');
            
            $('#account-info').find('.user-id').html(localStorage.getItem('userid'));
            
            $('.sidebar-content').hide();

            if (!sidebar.isVisible()) {
                
                sidebar.show();
                
            }

            $('#account-info').show();

        }

        if  (classicSessionType === "false") {

            $('#account-info').find('.user-name').text('anon (⌐■_■)');
            
            $('#account-info').find('.user-email').addClass('hidden');
            
            $('#account-info').find('.user-glome-key p').html(localStorage.getItem('glomekey').ellipsis(30));
                        
            $('#account-info').find('.user-id').html(localStorage.getItem('userid'));
            
            $('.sidebar-content').hide();

            if (!sidebar.isVisible()) {
                
                sidebar.show();
                
            }

            $('#account-info').show();
            
        }

    }

}

// Check if the localStorage has token, if yes log the user in with data
// TODO check token with backend if still valid
$(document).ready(function() {
  
    if (localStorage.getItem('token')) {

        switchSession('login');

    }
  
    else {
    
        return;
  
    }
  
});