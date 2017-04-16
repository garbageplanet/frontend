/**
  * The necessary configurations that are used by the UI
  * TODO group routes and add middleware to cut the amount of routes
  */

var api = {
    // Backend
    // server: '@@server',
    server: 'https://garbagepla.net:8443/api',
    // server: 'http://garbageplanet.dist/api',  
    createUser: {
        method: 'POST',
        url: function() {
            return api.server + '/register';
        }
    },/* User */
    createLogin: {
        method: 'POST',
        url: function() {
            return api.server + '/authenticate';
        }
    },
    readUser: {
        method: 'GET',
        url: function() {
            return api.createLogin.url() + '/user';
        }
    },
    removeUser: {
        method: 'DELETE',
        url: function() {
            return api.createLogin.url() + '/delete';
        }
    },
    logoutUser: {
        method: 'GET',
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
    createTrash: {
        method: 'POST',
        url: function(id) {
            return api.readTrash.url();
        }
    },/* Trash */
    readTrash: {
        method: 'GET',
        url: function() {
            return api.server + '/trashes';
        }
    },
    showTrash: {
        method: 'GET',
        url: function(id) {
            return api.readTrash.url() + '/' + id;
        }
    },
    deleteTrash: {
        method: 'DELETE',
        url: function(id) {
            return api.readTrash.url() + '/' + id;
        }
    },
    confirmTrash: {
        url: function(id) {
            return api.readTrash.url()+'/confirm/' + id;
        }
    },
    readTrashWithinBounds: {
        method: 'GET',
        url: function(bounds) {
            return api.readTrash.url() + '/withinbounds?bounds=' + bounds;
        }
    },
    createCleaning: {
        method: 'POST',
        url: function(id) {
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