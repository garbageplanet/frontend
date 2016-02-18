/*jslint browser: true, white: true, sloppy: true, maxerr: 1000*/
//scrollBottom() function by Zephyr http://stackoverflow.com/a/30127031/2842348
$.fn.scrollBottom = function(scroll){
  if(typeof scroll === 'number'){
    window.scrollTo(0,$(document).height() - $(window).height() - scroll);
    return $(document).height() - $(window).height() - scroll;
  } else {
    return $(document).height() - $(window).height() - $(window).scrollTop();
  }
}

// Swtch session function
// TODO destroy/replace/append elements instead of hiding them
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
      $("#session-status").on('click', '#btn-logout', function() {switchSession("logout"); logout();});
      $("#user-tools").prepend('<li id="user-info-link"><a class="dropdown-link" href="#account-info">User info</a></li>');
      $(".btn-menu").append('<a href="#account-info" class="sidebar-link btn btn-default btn-lg btn-block"><span class="fa fa-fw fa-user"></span> User info</a>');
      $("#user-info-link a").on("click", function(e) {
                                      e.preventDefault();
                                      $('#sidebar').scrollTop = 0;
                                      $(this.hash).fadeIn().siblings().hide();
                                      sidebar.show();
                                    });
      $("#user-tools").dropdown();
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
        $('#account-info').find('.user-glome-key p').html( localStorage.getItem('glomekey') );
        $('#account-info').find('.user-id').html( localStorage.getItem('userid') );
        $('.sidebar-content').hide();

        if (!sidebar.isVisible()) {
            sidebar.show();
        }

        $('#account-info').show();

      }

    }

}

// Check if the localStorage has token, if yes log the user in with data
$(document).ready(function() {
  
  var tokenTest = localStorage.getItem('token');
  
  console.log('token value', tokenTest);
  
  if (tokenTest !== null ) {
    
      switchSession('login');
    
  }
  
  else {
    
    return;
  
  }
  
});

// Mobile display
// TODO use L.Browser once Leaflet 1.0 is in use
$(document).ready(function() {

  if (window.innerWidth < 768) {
    
    $('#topbar').remove();
    
    $('body').append('<div class="swipe-area-right"></div>');
    
    $('.draw-link').addClass('disabled');
    
    // TODO remove navigation on mobile

    // Activate swipe on the right border to show the mobile menu
    $(".swipe-area-right").touchwipe({
      
      wipeLeft: function() {
        
        sidebar.show($('#mobile-menu-dialog').show());
      
      },
      
      min_move_x: 15,
      
      preventDefaultEvents: true
      
    });
    // Hide the sidebar on right swipe
    $(".sidebar-container").touchwipe({
      
      wipeRight: function() {
        
        sidebar.hide();
      
      },
      
      wipeDown: function() {
        
       $('#sidebar').scrollTop;
      
      },
      
      wipeUp: function() {
        
       $('#sidebar').scrollTo(0, -100);
      
      },
      
      min_move_x: 100,
      
      min_move_y: 50,
      
      preventDefaultEvents: true
      
    });
    // Hide the bottombar on down swipe
    // FIXME to swipe down on Android you need wipeUp() (the controls are inverted)
    // if (L.Browser.retina) {wipeDown:}
    // if (L.Browser.android || L...) {wipeUp:}
    
    $(".bottombar-container").touchwipe({
      
      wipeUp: function() {
        
        bottombar.hide();
      
      },
      
      wipeDown: function() {
        
        $('#bottombar').scrollTo(0, -50);
      
      },
      
      min_move_y: 50,
      
      preventDefaultEvents: true
      
    });
    
    // TODO swipe events to navigate in panels

  }

});

// Activate dropdown menu links
$(document).ready(function() {

  $('#user-tools').on('click', 'a', function(e) {
    if ($(this).hasClass('dropdown-link')) {
          e.preventDefault();
          bottombar.hide();
          sidebar.show();
          $(this.hash).fadeIn().siblings().hide();
    }
  });

});

// Actions for map-tools dropdown
$(document).ready(function() {

  // Locate the user
  $('.btn-locate').on('click', function(){
    sidebar.hide('slow');
    bottombar.hide();
    map.locate({setView: true, maxZoom: 20}).on('locationerror', onLocationError);

  });

  // Show nearby trashbins
  $('#btn-trashbins').on('click', function(){
    osmTrashbinLayer = new L.OverPassLayer({
       query: '(node["amenity"="waste_basket"]({{bbox}});node["amenity"="recycling"]({{bbox}});node["amenity"="waste_disposal"]({{bbox}}););out;'
    });
    map.addLayer(osmTrashbinLayer);
  });

});

// Display the date and time picker and get the data in the cleaning form on change
$(document).ready(function() {

  
  $('.selectpicker').selectpicker({ style: 'btn-lg btn-default text-center', size: 6});

  // TODO start mobile and non-mobile instance to be able to customize the display
  
  $(function () { $('#event-date-time-picker')
    .datetimepicker( {
        minDate: new Date(2015, 11, 31),
        showClose: true,
        ignoreReadonly: true,
        focusOnShow: false,
        toolbarPlacement: 'top'
    });
  });

  $('#event-date-time-picker').on('dp.change', function(e) {
     var eventDateTime = e.date.format('DD/MM/YYYY HH:MM');
    $('.date-time-value').val(eventDateTime);
  });

});

// Hide all the siblings of the clicked link in the sidebar when linking internally and reset sidebar scroll
$('.sidebar-link').click(function(e) {
    e.preventDefault();
    $(this.hash).fadeIn().siblings().hide();
    $('#sidebar').scrollTop = 0;
});

// Go back to the marker creation menu link
$('.menu-backlink').click(function(e) {
    $('.panel-collapse').collapse('hide');
    $('#sidebar').scrollTop = 0;
    $(this.hash).fadeIn().siblings().hide();
    e.preventDefault();
});

// Close sidebar if cancel button clicked
$(".btn-cancel").on('click', function (){
    sidebar.hide();
    map.removeLayer(marker);
});

// Empty the sidebar on hide, reset accordion and reset scroll
sidebar.on('hide', function () {
        $('.sidebar-content').hide();
        $('.sidebar-container', '.sidebar-content').scrollTop = 0;
        $('form').each(function() { this.reset(); });
        $('input').val('');
        $('.selectpicker').selectpicker('render');
        $('.tab-default').tab('show');
        $('.leaflet-draw-edit-edit').removeClass('visible');
        $('.leaflet-draw-edit-remove').removeClass('visible');
});

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

// Push the data to the form on .btn-edit click
// TODO Finish this
function editFeature(e) {
    bottombar.hide();
    console.log('value of object from editFeature()', e);
    showAlert("The editing system isn't currently functional.", "warning", 3000);

  // if (e.options.featuretype === 'marker_garbage') {
  if (typeof e.options.featuretype === 'undefined') {
    sidebar.show($('#create-garbage-dialog').fadeIn());
    e.dragging.enable();
  }
  
  
  if (e.options.featuretype === 'marker_cleaning') {
    sidebar.show($('#create-cleaning-dialog').fadeIn());
    e.dragging.enable();

  }
  
  if (e.options.featuretype === 'polyline_litter') {
    sidebar.show($('#create-litter-dialog').fadeIn());

  }
  
  if (e.options.featuretype === 'polygon_area') {
    sidebar.show($('#create-area-dialog').fadeIn());

  }
  
}

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

// Confirm garbage function
// TODO bind this to the db

// Confirmation for garage abd polylines
/*function confirmGarbage(obj){
  // TODO Finish this
  // TODO make session-dependant and allow once per user per marker
  if (!localStorage.getItem('token')){
    showAlert("You need to login to do that.", "info", 2000);
  }

  var counts = parseInt($(".feature-info-confirmed strong").val, 10);
  counts = isNaN(counts) ? 0 : value;
  counts++;
  $(".feature-info-confirmed strong").val = counts;

    setTimeout(function () {
      // var useToken = localStorage["token"] || window.token;
      var useToken = localStorage.getItem('token') || window.token;

      $.ajax({
          method: api.confirmTrash.method,
          url: api.confirmTrash.url(),
          headers: {"Authorization": "Bearer" + useToken},
          data: {
              'confirm': counts // TODO how to do this?
          },
          success: function (data) {
              console.log('success data', data);
              // todo change the value in the UI
          },
          error: function (err) {
              console.log('err', err);
          }
      });
    }, 100);
};*/

// TODO Join cleaning event function
/*function joinCleaning(obj){
  // TODO Finish this
  // TODO make session-dependant and allow once per user per marker
  if (!localStorage.getItem('token')){
    showAlert("You need to login to do that.", "info", 2000);
  }

  var counts = parseInt($(".feature-info-confirmed strong").val, 10);
  counts = isNaN(counts) ? 0 : value;
  counts++;
  $(".cleaning-info-confirmed strong").val = counts;

    setTimeout(function () {
      // var useToken = localStorage["token"] || window.token;
      var useToken = localStorage.getItem('token') || window.token;

      $.ajax({
          method: api.joinCleaning.method,
          url: api.readCleaning.url(),
          headers: {"Authorization": "Bearer" + useToken},
          data: {
              'confirm': counts // TODO how to do this?
          },
          success: function (data) {
              console.log('success data', data);
              // todo change the value in the UI
          },
          error: function (err) {
              console.log('err', err);
          }
      });
    }, 100);
};*/

// TODO Take part in game function
// function joinGame(e){}

// $('btn-participate-game').on('click', joinGame)
//$('.btn-confirm-garbage').on('click', confirmGarbage );
//$('.btn-join-cleaning').on('click', joinCleaning );
