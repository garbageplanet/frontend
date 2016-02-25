
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
  
};

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
