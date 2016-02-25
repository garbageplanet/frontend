
// Get data from the feature object into the bottom panel
function pushDataToBottomPanel(e) {
  console.log('value of e.options: ', e.options);
  // Start by emptying and resetting the panel
  resetBottomPanel();

  // Common vars
  var _id = e.options.id,
      _createdby = e.options.marked_by,
      _note = e.options.note,
      _tags = e.options.tags;
  
  if (e.options.types) {
    var _types = e.options.types,
        _todo = e.options.todo,
        _confirm = e.options.confirm,
        _size = e.options.size,
        _embed = e.options.embed;
    }

  if (e.options.date) {
    var _date = e.options.date,
        _recurrence = e.options.recurrence,
        _participants = e.options.participants;
  }
  
  if (e.options.latlngs) {
    var _latlngs = e.layer.options.latlngs,
        _length = e.layer.options.length,
        _contact = e.layer.options.contact,
        _title = e.layer.options.title,
        _players = e.layer.options.players;
  }
  
  if (e.options.amount) {
    // Amount mapping
    switch (e.options.amount) {
      case 0:
        $('#feature-info').find('.feature-info-garbage-amount').html('Are you sure about that?');
        break;
      case 1:
        $('#feature-info').find('.feature-info-garbage-amount').html('You are seeing ghosts');
        break;
      case 2:
        $('#feature-info').find('.feature-info-garbage-amount').html('Here and there');
        break;
      case 3:
        $('#feature-info').find('.feature-info-garbage-amount').html('Quite some');
        break;
      case 4:
        $('#feature-info').find('.feature-info-garbage-amount').html('Already too much');
        break;
      case 5:
        $('#feature-info').find('.feature-info-garbage-amount').html('What happened here?');
        break;
      case 6:
        $('#feature-info').find('.feature-info-garbage-amount').html('This is getting out of hand');
        break;
      case 7:
        $('#feature-info').find('.feature-info-garbage-amount').html('Dude...');
        break;
      case 8:
        $('#feature-info').find('.feature-info-garbage-amount').html('What the what?');
        break;
      case 9:
        $('#feature-info').find('.feature-info-garbage-amount').html('Cant touch this');
        break;
      case 10:
        $('#feature-info').find('.feature-info-garbage-amount').html('Oh my God Becky');
        break;
      default:
        $('#feature-info').find('.feature-info-garbage-amount').html('Undefined');
        break;
    }
  }
          
  // Add character into strings
  String.prototype.insert = function (index, string) {
      if (index > 0) {
          return this.substring(0, index) + string + this.substring(index, this.length);
      } else {
        return string + this;
      }
  };
  
  // Put a placeholder if the media is empty
  if (!e.options.imageurl) {
    $('#feature-info').find('.feature-image').attr('src', 'http://placehold.it/160x120');
    $('#feature-info').find('.feature-image-link').attr('href', '');
  }

  if (e.options.imageurl) {
    // Add an IMGUR api character to the url to fetch thumbnails to save bandwidth
    var imageurl_insert = e.options.imageurl.insert(26, "t");
    $('#feature-info').find('.feature-image').attr('src', imageurl_insert);
    $('#feature-info').find('.feature-image-link').attr('href', e.options.imageurl);
  }
  
  // Event listener for edit button
  $('#feature-info').find('.btn-edit').on('click', function() {editFeature(e);});

  // Event listener for delete button
  $('#feature-info').find('.btn-delete').one('click', function (e) {
    // TODO only allow if session is valid and userid matches
    console.log('trigger delete on id', e.options.id);
    e.preventDefault();
    
    // Set the ajax type and url for deletion given the type of feature
    switch (e.options.featuretype) {
      case 'marker_cleaning':
        var deleteurl = api.deleteCleaning.method;
        var deletemethod = api.deleteCleaning.url(e.options.id);
        break;
      case 'polyline_littr':
        var deleteurl = api.deleteLitter.method;
        var deletemethod = api.deleteLitter.url(e.options.id);
        break;
      case 'polygon_area':
        var deleteurl = api.deleteArea.method;
        var deletemethod = api.deleteArea.url(e.options.id);
        break;
      default:
        var deleteurl = api.deleteTrash.method;
        var deletemethod = api.deleteTrash.url(e.options.id);
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
  });
  
  // Push the common data
  $('#feature-info').find('.feature-info-garbage-type').html(_types.join(", "));
  $("#feature-info-created-by").html(_createdby);
  $('#feature-info').find('.feature-info-confirmed p strong').html(_confirm);
  
  // push the url to the href of share buttons
  $('#feature-info').find('.btn-share').each(function() {
      $(this).attr("data-url", _sharetargetlink);
  });
  
  // If there's only a lat or long it's a garbage or cleaning marker
  // TODO Finish this
  if (e.options.lat) {
    
    var _sharetargetlink = "http://garbagepla.net/#15/"+e.options.lat+"/"+e.options.lng+"string";
    
    // if (e.options.featuretype === 'marker_garbage') {
    if (typeof e.options.featuretype === 'undefined') {
      console.log('getting data from garbage marker');

    }

    if (e.options.featuretype === 'marker_cleaning') {
      console.log('getting data from cleaning marker');

      }
    
  }
  
  // If there are latlngs then it's either polyline or polygon
  // TODO Finish this
  if (e.options.latlngs) {
    
    var _sharetargetlink = "http://garbagepla.net/#15/"+e.options.lat[0]+"/"+e.options.lng[0]+"string";
    
    if (e.options.featuretype === 'polyline_litter') {
      console.log('getting data from litter');
    
    }
  
    if (e.options.featuretype === 'polygon_area') {
      console.log('getting data from area');
    
      if (e.options.game) {
      // TODO add button to join game instead of .card-media
      // TODO body.append('modal') with secret input to join game area
      }
    }  
  }
}

// Empty the bottom panel on call of this function
function resetBottomPanel() {
  //TODO add methods depending on the type of object clicked
  $(".feature-info").empty();
  $(".feature-info-confirmed strong").text('0');
  $("#feature-info-image").attr("src", "");
  $("#feature-info").find('.feature-image-link').attr("href", "");
  $('#feature-info').find('.btn-share').each(function() {
    $(this).attr("data-url", "");
  });
}
// Reset the bottom paenl each time it's being hidden
bottombar.on('hide', resetBottomPanel);
