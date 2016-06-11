/*jslint browser: true, white: true, sloppy: true, maxerr: 1000*/

/**
* User actions on map features that are already present
*/

// Click actions on saved features
function featureClick(e) {
    
    featureClick:{
    
        if (window.innerWidth < 768) {

            if ($('.leaflet-marker-menu').is(':visible')) {

                marker.closeMenu();

                break featureClick;

            }

        }

        if (e.options) {

            // check if the feature is a shape
            if (e.options.shape) {

                setTimeout(function () {

                    map.panToOffset(e.getCenter(), getVerticalOffset());

                }, 100);

            }

            // if not a shape clicked it's a marker, bring it to the map center with panToOffset()
            else {

                var latlng = e.options.latlng.toString().replace(/,/g , "").split(' ');

                map.panToOffset([latlng[0], latlng[1]], getVerticalOffset());
                
            } 

            // then load data into bottom panel and show it
            pushDataToBottomPanel(e);
            
            // hide the sidebar if it's visible
            if (sidebar.isVisible()) {
                
                sidebar.hide();
                
            }
        }
    }
}

// TODO Push the data to the form on .btn-edit click
function editFeature(e) {
    
    // TODO fill the form templates with the current marker data
    // TODO more secure way to restrict edition, must match current session token with id in backend
    var userid = localStorage.getItem('userid');
    
    if (userid == e.marked_by) {
        
        bottombar.hide();
        
        showAlert("The editing system isn't currently functional.", "warning", 3000);

        if (e.feature_type === 'marker_garbage') {

            sidebar.show($('#create-garbage-dialog').fadeIn());

        }

        if (e.feature_type === 'marker_cleaning') {

            sidebar.show($('#create-cleaning-dialog').fadeIn());

        }

        if (e.feature_type === 'polyline_litter') {

            sidebar.show($('#create-litter-dialog').fadeIn());

        }

        if (e.feature_type === 'polygon_area') {

            sidebar.show($('#create-area-dialog').fadeIn());

        }

    }

    else {

        showAlert("You cannot edit feature created by others.", "danger", 3000);

    }   
}
           
// TODO Confirm garbage function
function confirmGarbage(e){

    if (!localStorage.getItem('token')){

        showAlert("You need to login to do that.", "info", 2000);

    } else {
        
        var callurl = null;
        
        if (e.feature_type === 'marker_garbage') {
            
            callurl = api.confirmTrash.url(e.id);
            
        }
        
        else if (e.feature_type === 'polyline_litter') {
            
            callurl = api.confirmLitter.url(e.id);
            
        }
        
        setTimeout(function () {

            var useToken = localStorage.getItem('token') || window.token;
            
            $.ajax({

                method: 'PUT',

                url: callurl,

                headers: {"Authorization": "Bearer" + useToken},

                success: function (response) {
                    
                    var message = response.data.message;
                    
                    pushDataToBottomPanel(response.data.data);
                    
                    // TODO add the possibility to call loadFeatures() with an id to retrive only one marker
                    
                    // update litters if we confirmed litter
                    if (message.indexOf('litter') === 0) {
                        
                        loadLitters();
                        
                    }
                    
                    // else update trash markers to reflect new data
                    else {
                        
                        loadGarbageMarkers();
                        
                    }
                                        
                },

                error: function (err) {

                  showAlert("Something went wrong.", "info", 2000);

                }

          });

        }, 100);
        
    }
    
}

// TODO Join cleaning event function
function attendCleaning(e){
    
    // TODO Finish this
    // TODO count function in the backend, not here
    // TODO make session-dependant and allow once per user per marker
    if (!localStorage.getItem('token')){
        
        showAlert("You need to login to do that.", "info", 2000);
        
    }
    
    else {
        
        setTimeout(function () {
        
            var useToken = localStorage.getItem('token') || window.token,
                id = e.id;

            $.ajax({
            
                method: 'PUT',

                url: api.attendCleaning.url(id),

                headers: {"Authorization": "Bearer" + useToken},

                success: function (response) {
                    // push the new data to the bottom bar
                    pushDataToBottomPanel(response.data.data);
                    
                    loadCleaningMarkers();

                },

                error: function (err) {

                    showAlert("Something went wrong.", "info", 2000);                
                
                }
            
            });
            
        }, 100);
        
    }
    
}

// TODO Take part in game function
function participateGame(e){
    // TODO Finish this
    // TODO make session-dependant and allow once per user per marker
    if (!localStorage.getItem('token')){
        
        showAlert("You need to login to do that.", "info", 2000);
        
    }
        
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
}

// TODO Cleaned garbage function
function cleanedGarbage(e){
    // TODO Finish this
    // TODO make session-dependant and allow once per user per marker
    if (!localStorage.getItem('token')){
        
        showAlert("You need to login to do that.", "info", 2000);
        
    }

    else {
        
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
        
    }
};
