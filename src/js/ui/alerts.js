/* jslint browser: true, white: true, sloppy: true, maxerr: 1000 */
/* global $ */

/**
  * Alerts built on the idea by lgal
  * see http://stackoverflow.com/a/33662720/2842348
  * License MIT
  */

var alerts = ( function () {

    'use strict';

    var _strings = [
        "You cannot delete features you did not create", // 0
        "Sorry, something went wrong with the server",
        "The request was not handled properly by the server",
        "Please log in to do that",
        "Something went wrong, HTTP error ",
        "Something went wrong while fetching the data", // 5
        "Failed to remove this feature",
        "Feature deleted successfully",
        "You are not on the players list and can't look at this data",
        "You cannot edit feature created by others",
        "Sorry, something went wrong", // 10
        "The editing system isn't currently functional",
        "Failed to login anonymously. Reload the page and try again",
        "You are now logged in",
        "Drawing on mobile is still in development, expect issues",
        "Zoom in closer to create features", // 15
        "Couldn't find your position",
        'Account successfully deleted',
        'You cannot delete soft accounts',
        'Sorry. Key not recognized',
        'Welcome back, anonymous', // 20
        'Session expired. Please log in again',
        'You are logged out',
        'No active session',
        'Failed to log in',
        'Map feature saved successfully', // 25
        'Cleaning event saved successfully',
        'Litter saved successfully',
        'Area saved successfully',
        'No data in the current area',
        'Fill in all the required fields', // 30
        'Zoom in closer to do that',
        'Garbagepla.net uses cookies. By using this website you agree to our <a href="#privacy-policy" class="alert-link sidebar-link"> use of cookies </a>.',
        'Layer not found on the map',
        'Please provide a link'
    ];

     function showAlert(code, type, delay, text) {
       // default to alert-info
        var type = type || 'info';
        var message = text || _strings[code];
        var alert = $(`<div class="alert alert-${type} fade in">`);

        alert.append(`<button type="button" class="close" data-dismiss="alert"><span>&times;</span></button>`);
        alert.append(message);

        $(".alert-container").prepend(alert);

        if ( delay ) {
            window.setTimeout(function () { alert.alert("close"); }, delay);
        }
    }

    return Object.freeze({ showAlert : showAlert });
}());
