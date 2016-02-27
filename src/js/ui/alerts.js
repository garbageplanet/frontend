// Alerts by lgal http://stackoverflow.com/a/33662720/2842348 license MIT
function showAlert(errorMessage, errorType, closeDelay) {

    // default to alert-info
    if (!errorType || typeof errorType === 'undefined') {var errorType = "info";}

    var alert = $('<div class="alert alert-' + errorType + ' fade in">').append(errorMessage);
  
    $(".alert-container").prepend(alert);

    // if closeDelay was passed - set a timeout to close the alert
    if (closeDelay) {
      
      window.setTimeout(function() {alert.alert("close");}, closeDelay);
      
    }
};