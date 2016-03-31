/*jslint browser: true, white: true, sloppy: true, maxerr: 1000*/
// TODO Push the data to the form on .btn-edit click
// add ajax calls to check if user owns feature
// TODO finish this
function editFeature(e) {
    
    bottombar.hide();
    
    console.log('value of object from editFeature()', e);
    
    showAlert("The editing system isn't currently functional.", "warning", 3000);
    
    // var useToken = localStorage["token"] || window.token;
    var useToken = localStorage.getItem('token') || window.token;

    $.ajax({
        
        method: api.editFeature.method,

        url: api.editFeature.url(),

        headers: {"Authorization": "Bearer" + useToken},

        data: {

            // TODO Send the user_id to check if it belongs to created_by in db
            'user_id': user_id 

        },

        success: function (data) {
            
            // FIXME
            if (user_id === this.user_id) {
                
                // if (e.options.featuretype === 'marker_garbage') {
                if (typeof e.options.feature_type === 'undefined') {

                    sidebar.show($('#create-garbage-dialog').fadeIn());

                    e.dragging.enable();

                }


                if (e.options.feature_type === 'marker_cleaning') {

                    sidebar.show($('#create-cleaning-dialog').fadeIn());

                    e.dragging.enable();

                }

                if (e.options.feature_type === 'polyline_litter') {

                    sidebar.show($('#create-litter-dialog').fadeIn());

                }

                if (e.options.feature_type === 'polygon_area') {

                    sidebar.show($('#create-area-dialog').fadeIn());

                }
                
            }
            
            else {
                
                showAlert("You cannot edit feature created by others.", "warning", 2000);
                
            }

        },

        error: function (err) {
                
                showAlert("Please login to do that.", "warning", 2000);
                
        }
  
    });
    
}
           

// TODO Confirm garbage function
function confirmGarbage(e){
    // TODO count function in the backend, not here
    // TODO make session-dependant and allow once per user per marker
    if (!localStorage.getItem('token')){

        showAlert("You need to login to do that.", "info", 2000);

    }

    var counts = parseInt($(".badge-notify-confirm").val, 10);
    
    counts = isNaN(counts) ? 0 : value; counts++;
    
    $(".badge-notify-confirm").val = counts;

    setTimeout(function () {
        
        var useToken = localStorage.getItem('token') || window.token;

        $.ajax({
            
            method: api.confirmTrash.method,
            
            url: api.confirmTrash.url(),
            
            headers: {"Authorization": "Bearer" + useToken},
            
            data: {
                // TODO how to do this?
                'confirm': counts 
                
            },
            
            success: function (data) {
                
                // TODO change the value in the UI
                console.log('success data', data);
            },
            
            error: function (err) {
                
              console.log('err', err);
                
            }
            
      });
        
    }, 100);
    
};

// TODO Join cleaning event function
function joinCleaning(e){
    
    // TODO Finish this
    // TODO count function in the backend, not here
    // TODO make session-dependant and allow once per user per marker
    if (!localStorage.getItem('token')){
        
        showAlert("You need to login to do that.", "info", 2000);
        
    }

    var counts = parseInt($(".badge-notify-join").val, 10);
    
    counts = isNaN(counts) ? 0 : value; counts++;
    
    $(".badge-notify-join").val = counts;

    setTimeout(function () {
        
      // var useToken = localStorage["token"] || window.token;
        var useToken = localStorage.getItem('token') || window.token;

        $.ajax({
            
            method: api.joinCleaning.method,
            
            url: api.readCleaning.url(),
            
            headers: {"Authorization": "Bearer" + useToken},
            
            data: {
                
                // TODO how to do this?
                'confirm': data 
                
            },
            success: function (data) {
                            
                // TODO reload the markers to display change and reload the template
                console.log('success data', data);
                
            },
            
            error: function (err) {
                
                console.log('err', err);
            }
            
        });
    }, 100);
};

// TODO Take part in game function
function participateGame(e){
    // TODO Finish this
    // TODO count function in the backend, not here
    // TODO make session-dependant and allow once per user per marker
    if (!localStorage.getItem('token')){
        
        showAlert("You need to login to do that.", "info", 2000);
        
    }

    var counts = parseInt($(".badge-notify-participate").val, 10);
    
    counts = isNaN(counts) ? 0 : value; counts++;
    
    $(".badge-notify-join").val = counts;

    setTimeout(function () {
        
        var useToken = localStorage.getItem('token') || window.token;

        $.ajax({
            
            method: api.joinCleaning.method,
            
            url: api.readCleaning.url(),
            
            headers: {"Authorization": "Bearer" + useToken},
            
            data: {
                
              'confirm': data // TODO how to do this?
                
            },
            
            success: function (data) {
                
                // TODO reload the markers to display change
                console.log('success data', data);
                
            },
            
            error: function (err) {
                
                console.log('err', err);
                
            }
            
        });
        
    }, 100);
};

// TODO Cleaned garbage function
function cleanedGarbage(e){
    // TODO Finish this
    // TODO make session-dependant and allow once per user per marker
    if (!localStorage.getItem('token')){
        
        showAlert("You need to login to do that.", "info", 2000);
        
    }

    setTimeout(function () {
        
        var useToken = localStorage.getItem('token') || window.token;

        $.ajax({
            
            method: api.confirmTrash.method,
            
            url: api.confirmTrash.url(),
            
            headers: {"Authorization": "Bearer" + useToken},
            
            data: {
                
                // TODO finish this
                'clean': 1 
                
            },
            
            success: function (data) {
                
                // TODO reload the markers to display change
                console.log('success data', data);
                
            },
            
            error: function (err) {
                
              console.log('err', err);
                
          }
            
      });
        
    }, 100);
};
