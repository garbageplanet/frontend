// Alerts by lgal http://stackoverflow.com/a/33662720/2842348 license MIT
function showAlert(errorMessage, errorType, closeDelay) {

    // default to alert-info
    if (!errorType || typeof errorType === 'undefined') {
        
        var errorType = "info";
    
    }

    var alert = $('<div class="alert alert-' + errorType + ' fade in">').append(errorMessage);
  
    $(".alert-container").prepend(alert);

    // if closeDelay was passed - set a timeout to close the alert
    if (closeDelay) {
      
        window.setTimeout(function() {alert.alert("close");}, closeDelay);
      
    }
    
}

// Give a specific error in function of the http status
function showErrorType(e) {
        
    var errortype;
    
    if (e.status === 200) {

        errortype = showAlert('Sorry, something went wrong with the server', 'danger', 2500);

    } else if (e.status === 'error') {

        errortype =showAlert('The request was not handled properly by the server', 'danger', 2500);

    } else if (e.status === 401 || e.status === 400) {

        errortype =showAlert('Sorry, are you logged in?', 'danger', 2500);

    }

    else {

        errortype = showAlert('Something went wrong, HTTP error ' + e.status, 'danger', 2500);

    }
    
    return errortype;
    
};