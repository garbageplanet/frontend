// Get data from the feature object into the bottom panel
function pushDataToBottomPanel(e) {
  
    var featuredata = e.options;

    console.log("feature data content: ", featuredata);

    // Add character into strings
    String.prototype.insert = function (index, string) {
        
        if (index > 0) {
          
            return this.substring(0, index) + string + this.substring(index, this.length);
          
        } else {
          
            return string + this;
          
        }
        
    }

    // Fill the template data
    document.getElementById('bottombar-content-container').innerHTML = tmpl('tmpl-feature-info', featuredata);

    // Create the templateData.social data dynamically before calling the template
    // The function shareThisFeature() is in the file /social/share.js
    shareThisFeature(featuredata);

    document.getElementById('social-links').innerHTML = tmpl("tmpl-social-links", templatedata);
    
    // TODO use bottombar.getContent() in conjunction with template creation above
    bottombar.show($('#feature-info').fadeIn());

    // Add an IMGUR api character to the url to fetch thumbnails to save bandwidth
    if (featuredata.image_url) {
        
        var image_url_insert = featuredata.image_url.insert(26, "b");
        
        $('#feature-info').find('.feature-image').attr('src', image_url_insert);
        
    }

    // Event listener for actions buttons (edit, cleaned join, confirm, play)
    // the functions called are inside the file /map/features_actions.js
    $('#feature-info').find('.btn-edit').on('click', function() {
        
        if (localStorage.getItem('token')) {
                
            editFeature(featuredata);

        } else {
            
            showAlert("Please login to do that.", "warning", 2000);

        }
    
    });
    
    $('#feature-info').find('.btn-cleaned').on('click', function() {cleanedGarbage(featuredata);});
    
    $('#feature-info').find('.btn-confirm-garbage').on('click', function() {confirmGarbage(featuredata);});
    
    $('#feature-info').find('.btn-join-cleaning').on('click', function() {joinCleaning(featuredata);});
    
    $('#feature-info').find('.btn-participate-game').on('click', function() {participateGame(featuredata);});

    // Event listener for share button and social links
    $('.btn-social').popover({
        
        html : true, 

        container: 'body',

        placement: function(pop){

            if (window.innerWidth < 560) {
                
                return 'top'
                
            } else {
                
                return 'right'
                
            }
            
        },

        content: function() {

            return $('#social-links').html();

        },

        template: '<div class="popover popover-share" role="tooltip"><div class="popover-content popover-share"></div></div>'

        });

    // Event listener to look at the game results
    // TODO if user_id isn't in result list, prevent action
    $('.game-results-modal-link').on('click', function () {
        
        var user_id = localStorage.getItem['userid'],
            game_list = {};

        if (user_id in game_list) {
            // call to the game api, check that user making request is in the list on the server
            // build the results object (gamedata) and fill the template
            var gameResults = tmpl('tmpl-game-results', gamedata);

            $('body').append(gameResults);

        }

        else {

            showAlert("Sorry. You are not on the players list, you can't look at this data.", "warning", 2000);
            
            return;

        }

    });

    // Event listener for delete button
    $('#feature-info').find('.btn-delete').on('click', function (e) {
        
        console.log(featuredata);
                
        e.preventDefault();
        // Set the ajax type and url for deletion given the type of feature
        if (featuredata.feature_type) {
            
            switch (featuredata.feature_type) {
                  
                case 'marker_cleaning':
                  var deletemethod = api.deleteCleaning.method;
                  var deleteurl = api.deleteCleaning.url(featuredata.id);
                  break;

                case 'polyline_litter':
                  var deletemethod = api.deleteLitter.method;
                  var deleteurl = api.deleteLitter.url(featuredata.id);
                  break;

                case 'polygon_area':
                  var deletemethod = api.deleteArea.method;
                  var deleteurl = api.deleteArea.url(featuredata.id);
                  break;

                case 'marker_garbage':
                  var deletemethod = api.deleteTrash.method;
                  var deleteurl = api.deleteTrash.url(featuredata.id);
                  break;
            
            }
                    
            var useToken = localStorage.getItem('token') || window.token;
            
            if ((featuredata.marked_by || featuredata.created_by)  == localStorage.getItem('userid')) {
                
                $.ajax({

                    type: deletemethod,

                    url: deleteurl,

                    headers: {"Authorization": "Bearer " + useToken},

                    success: function(response) {

                        bottombar.hide();

                        loadGarbageMarkers();

                        loadCleaningMarkers();

                        loadLitters();

                        loadAreas();

                        showAlert("Feature deleted successfully!", "success", 1500);

                    },

                    error: function(response) {

                        console.log("DELETE ERROR: ", response);

                        showAlert("Failed to remove this feature.", "warning", 2000);

                    }

                });
                
            }
            
            else {
                
                bottombar.hide();
                
                showAlert("You cannot delete features you did not create.", "danger", 2500);
                
            }

        }
        
    });
    
};

// Events to execute when the bottombar is hidden
bottombar.on('hide', function () {
    
    // force destroy the popup which hangs on certain tablets (tested on samsung w/ android) 
    $('.btn-social').popover('destroy');

    // reset any modals that was created
    $('.modal').modal('hide').data('bs.modal', null);
    
});