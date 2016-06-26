/**
 * The necessary configurations that are used by the UI
 * PLEASE BE CAREFUL CHANGING THE SETTINGS BELOW!
 */
var api = {
    // Backend
    server: 'https://garbagepla.net:8443/api',
    // server: 'http://www.homestead.app:8080/api',  

    // API entry points
    /* User */
    createUser: {
        method: 'POST',
        url: function () {
            return api.server + '/register';
        }
    },
    
    createLogin: {
        method: 'POST',
        url: function () {
            return api.server + '/authenticate';
        }
    },

    readUser: {
        method: 'GET',
        url: function () {
            return api.createLogin.url() + '/user';
        }
    },

    removeUser: {
        method: 'DELETE',
        url: function () {
            return api.createLogin.url() + '/delete';
        }
    },
    
    logoutUser: {
        method: 'GET',
        url: function () {
            return api.createLogin.url() + '/logout';
        }
    },

    createSoftAccount: {
        method: 'POST',
        url: function () {
            return api.server + '/glome/create';
        }
    },

    readSoftAccount: {
        method: 'GET',
        url: function (id) {
            return api.server + '/glome/show/' + id;
        }
    },

    /* Trash */
    createTrash: {
        method: 'POST',
        url: function (id) {
            return api.readTrash.url();
        }
    },

    readTrash: {
        method: 'GET',
        url: function () {
            return api.server + '/trashes';
        }
    },
    
    showTrash: {
        method: 'GET',
        url: function (id) {
            return api.readTrash.url() + '/' + id;
        }
    },
    
    editTrash: {
        method: 'PUT',
        url: function () {
            return api.readTrash.url();
        }
    },

    deleteTrash: {
        method: 'DELETE',
        url: function (id) {
            return api.readTrash.url() + '/' + id;
        }
    },
    
    confirmTrash: {
        url: function (id) {
            return api.readTrash.url()+'/confirm/' + id;
        }
    },

    readTrashWithinBounds: {
        method: 'GET',
        url: function (currentBounds) {
            return api.readTrash.url() + '/withinbounds?bounds=' + currentBounds;
        }
    },

    /* Cleaning */
    createCleaning: {
        method: 'POST',
        url: function (id) {
            return api.readCleaning.url();
        }
    },

    readCleaning: {
        method: 'GET',
        url: function () {
            return api.server + '/cleanings';
        }
    },
    
    showCleaning: {
        method: 'GET',
        url: function (id) {
            return api.readCleaning.url() + '/' + id;
        }
    },
    
    editCleaning: {
        method: 'PUT',
        url: function (id) {
            return api.readCleaning.url() + '/' + id;
        }
    },

    deleteCleaning: {
        method: 'DELETE',
        url: function (id) {
            return api.readCleaning.url() + '/' + id;
        }
    },

    readCleaningWithinBounds: {
        method: 'GET',
        url: function (currentBounds) {
            return api.readCleaning.url() + '/withinbounds?bounds=' + currentBounds;
        }
    },
    
    attendCleaning: {
        url: function (id) {
            return api.readCleaning.url()+'/attend/' + id;
        }
    },

    /* Litter */
    readLitterWithinBounds: {
        method: 'GET',
        url: function (currentBounds) {
            return api.readLitter.url() + '/withinbounds?bounds=' + currentBounds;
        }
    },

    createLitter: {
        method: 'POST',
        url: function () {
            return api.readLitter.url();
        }
    },

/*    editLitter: {
        method: 'PUT',
        url: function (id) {
            return api.readLitter.url() + '/' + id;
        }
    },*/

    readLitter: {
        method: 'GET',
        url: function () {
            return api.server + '/litters';
        }
    },
    
    showLitter: {
        method: 'GET',
        url: function (id) {
            return api.readLitter.url() + '/' + id;
        }
    },

    deleteLitter: {
        method: 'DELETE',
        url: function (id) {
            return api.readLitter.url() + '/' + id;
        }
    },
    
    confirmLitter: {
        url: function (id) {
            return api.readLitter.url()+'/confirm/' + id;
        }
    },

    /* Area */
    readAreaWithinBounds: {
        method: 'GET',
        url: function (currentBounds) {
            return api.readArea.url() + '/withinbounds?bounds=' + currentBounds;
        }
    },

    createArea: {
        method: 'POST',
        url: function () {
            return api.readArea.url();
        }
    },

/*    editArea: {
        method: 'PUT',
        url: function (id) {
            return api.readArea.url() + '/' + id;
        }
    },*/

    readArea: {
        method: 'GET',
        url: function () {
            return api.server + '/areas';
        }
    },
    
    showArea: {
        method: 'GET',
        url: function (id) {
            return api.readArea.url() + '/' + id;
        }
    },

    deleteArea: {
        method: 'DELETE',
        url: function (id) {
            return api.readArea.url() + '/' + id;
        }
    }
};
