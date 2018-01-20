/* jslint browser: true, white: true, sloppy: true, maxerr: 1000 */
/* global L, $, tools, alerts, api, ui */

/**
  * The necessary configurations that are used by the UI  *
  */

// TODO leaner api
// feature: {
//   type: 'feature_type',
//   options: {
//     latlngs: '',
//     todo: '',
//     ...
//   }
// }

var api = {
    server: '@@server',
    createLogin: {
        method: 'POST',
        url: function() {
            return api.server + '/auth';
        }
    },
    createUser: {
        method: 'POST',
        url: function() {
            return api.createLogin.url() + '/register';
        }
    },
    readUser: {
        method: 'GET',
        url: function() {
            return api.createLogin.url() + '/user';
        }
    },
    removeUser: {
        method: 'POST',
        url: function() {
            return api.createLogin.url() + '/delete';
        }
    },
    logoutUser: {
        method: 'POST',
        url: function() {
            return api.createLogin.url() + '/logout';
        }
    },
    createSoftAccount: {
        method: 'POST',
        url: function() {
            return api.server + '/glome/create';
        }
    },
    readSoftAccount: {
        method: 'GET',
        url: function(id) {
            return api.server + '/glome/show/' + id;
        }
    },
    createGarbage: {
        method: 'POST',
        url: function() {
            return api.readGarbage.url();
        }
    },/* Garbage */
    readGarbage: {
        method: 'GET',
        url: function() {
            return api.server + '/trashes';
        }
    },
    showGarbage: {
        method: 'GET',
        url: function(id) {
            return api.readGarbage.url() + '/' + id;
        }
    },
    deleteGarbage: {
        method: 'DELETE',
        url: function(id) {
            return api.readGarbage.url() + '/' + id;
        }
    },
    confirmGarbage: {
        url: function(id) {
            return api.readGarbage.url()+'/confirm/' + id;
        }
    },
    cleanGarbage: {
        url: function(id) {
            return api.readGarbage.url()+'/clean/' + id;
        }
    },
    readGarbageWithinBounds: {
        method: 'GET',
        url: function(bounds) {
            return api.readGarbage.url() + '/withinbounds?bounds=' + bounds;
        }
    },
    createCleaning: {
        method: 'POST',
        url: function() {
            return api.readCleaning.url();
        }
    },/* Cleaning */
    readCleaning: {
        method: 'GET',
        url: function() {
            return api.server + '/cleanings';
        }
    },
    showCleaning: {
        method: 'GET',
        url: function(id) {
            return api.readCleaning.url() + '/' + id;
        }
    },
    deleteCleaning: {
        method: 'DELETE',
        url: function(id) {
            return api.readCleaning.url() + '/' + id;
        }
    },
    readCleaningWithinBounds: {
        method: 'GET',
        url: function(bounds) {
            return api.readCleaning.url() + '/withinbounds?bounds=' + bounds;
        }
    },
    attendCleaning: {
        url: function(id) {
            return api.readCleaning.url()+'/attend/' + id;
        }
    },
    readLitterWithinBounds: {
        method: 'GET',
        url: function(bounds) {
            return api.readLitter.url() + '/withinbounds?bounds=' + bounds;
        }
    },/* Litter */
    createLitter: {
        method: 'POST',
        url: function() {
            return api.readLitter.url();
        }
    },
    readLitter: {
        method: 'GET',
        url: function() {
            return api.server + '/litters';
        }
    },
    showLitter: {
        method: 'GET',
        url: function(id) {
            return api.readLitter.url() + '/' + id;
        }
    },
    deleteLitter: {
        method: 'DELETE',
        url: function(id) {
            return api.readLitter.url() + '/' + id;
        }
    },
    confirmLitter: {
        url: function(id) {
            return api.readLitter.url()+'/confirm/' + id;
        }
    },
    cleanLitter: {
        url: function(id) {
            return api.readLitter.url()+'/clean/' + id;
        }
    },
    readAreaWithinBounds: {
        method: 'GET',
        url: function(bounds) {
            return api.readArea.url() + '/withinbounds?bounds=' + bounds;
        }
    },/* Area */
    createArea: {
        method: 'POST',
        url: function() {
            return api.readArea.url();
        }
    },
    readArea: {
        method: 'GET',
        url: function() {
            return api.server + '/areas';
        }
    },
    showArea: {
        method: 'GET',
        url: function(id) {
            return api.readArea.url() + '/' + id;
        }
    },
    deleteArea: {
        method: 'DELETE',
        url: function(id) {
            return api.readArea.url() + '/' + id;
        }
    }
};
