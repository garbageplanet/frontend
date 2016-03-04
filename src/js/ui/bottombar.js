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
  document.getElementById('bottombar').innerHTML = tmpl('tmpl-feature-info', featuredata);
  document.getElementById('social-links').innerHTML = tmpl("tmpl-social-links", templatedata);
  bottombar.show($('#feature-info').fadeIn());
  
  if (featuredata.image_url) {
    // Add an IMGUR api character to the url to fetch thumbnails to save bandwidth
    var image_url_insert = featuredata.image_url.insert(26, "t");
    $('#feature-info').find('.feature-image').attr('src', image_url_insert);
  }
  
  // Event listener for actions buttons (edit, cleaned join, confirm, play)
  $('#feature-info').find('.btn-edit').on('click', function() {editFeature(e);});
  $('#feature-info').find('.btn-cleaned').on('click', function() {cleanedGarbage(e);});
  $('#feature-info').find('.btn-confirm-garbage').on('click', function() {confirmGarbage(e);});
  $('#feature-info').find('.btn-join-cleaning').on('click', function() {joinCleaning(e);});
  $('#feature-info').find('.btn-participate-game').on('click', function() {participateGame(e);});
  
  // Event listener for delete button
  $('#feature-info').find('.btn-delete').one('click', function (e) {
    e.preventDefault();
    // Set the ajax type and url for deletion given the type of feature
    if (!featuredata.feature_type) {return;}
    
    if (featuredata.feature_type){
      switch (featuredata.feature_type) {
        case 'marker_cleaning':
          var deleteurl = api.deleteCleaning.method;
          var deletemethod = api.deleteCleaning.url(featuredata.id);
          break;
        case 'polyline_littr':
          var deleteurl = api.deleteLitter.method;
          var deletemethod = api.deleteLitter.url(featuredata.id);
          break;
        case 'polygon_area':
          var deleteurl = api.deleteArea.method;
          var deletemethod = api.deleteArea.url(featuredata.id);
          break;
        default:
          var deleteurl = api.deleteTrash.method;
          var deletemethod = api.deleteTrash.url(featuredata.id);
          break;
      }

      var useToken = localStorage.getItem('token') || window.token;
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
              showAlert("Failed to remove this feature.", "warning", 2000);
          }
      });
    }
  });
};