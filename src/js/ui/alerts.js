// Alerts built on the idea by lgal http://stackoverflow.com/a/33662720/2842348 license MIT

var alerts = {
    
    texts : [
        // current items 0-30 add new fields at the end
        "You cannot delete features you did not create",
        "Sorry, something went wrong with the server",
        "The request was not handled properly by the server",
        "Please log in to do that",
        "Something went wrong, HTTP error ",
        "Something went wrong while fetching the data",
        "Failed to remove this feature",
        "Feature deleted successfully",
        "You are not on the players list and can't look at this data",
        "You cannot edit feature created by others",
        "Something went wrong",
        "The editing system isn't currently functional",
        "Failed to login anonymously. Reload the page and try again",
        "You are now logged in",
        "Drawing on mobile is still in development, expect issues",
        "Zoom in closer to create features",
        "Couldn't find your position",
        'Account successfully deleted',
        'You cannot delete soft accounts',
        'Sorry. Key not recognized',
        'Welcome back, anonymous',
        'Session expired. Please log in again',
        'You are logged out',
        'No active session',
        'Failed to log in',
        'Marker saved successfully',
        'Cleaning event saved successfully',
        'Litter saved successfully',
        'Area saved successfully',
        'No data in the current area',
        'Fill in all the required fields'
    ],
    // TODO merge showAlert and createAlertText so that Showalert is called with four params
    showAlert: function (errorCode, errorType, closeDelay) {

        // default to alert-info
        if (!errorType || typeof errorType === 'undefined') {
            var errorType = "info";
        }

        var errorMessage = this.texts[errorCode];
        var alertMessage = $('<div class="alert alert-' + errorType + ' fade in">').append(errorMessage);

        $(".alert-container").prepend(alertMessage);

        // if closeDelay was passed - set a timeout to close the alert
        if (closeDelay) {

            window.setTimeout(function() {alertMessage.alert("close");}, closeDelay);
        }

    },
    // Give a specific error in function of the http status
    showErrorType:function (e) {

        var errortype;

        if (e.status === 200) {
            errortype = this.showAlert(1, 'danger', 2500);

        } else if (e.status === 'error') {
            errortype = this.showAlert(2, 'danger', 2500);

        } else if (e.status === 401 || e.status === 400) {
            errortype = this.showAlert(3, 'danger', 2500);
            
        } else {
            errortype = this.showAlert(4 + e.status, 'danger', 2500);
        }

        return errortype;
    },
};