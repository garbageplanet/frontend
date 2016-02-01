/**
 * The necessary configurations that are used by the UI
 * PLEASE BE CAREFUL CHANGING THE SETTINGS BELOW!
 */
var api = {
  // Backend
  server: 'http://dev.garbagepla.net:8080/api',

  // API entry points
  /* User */
  createUser: {
    method: 'POST',
    url: function() {
      return api.server + '/register';
    }
  },
  readUser: {
    method: 'GET',
    url: function() {
      return api.createLogin.url() + '/user';
    }
  },
  createLogin: {
    method: 'POST',
    url: function() {
      return api.server + '/authenticate';
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
  /* Trash */
  createTrash: {
    method: 'POST',
    url: function(id) {
      return api.readTrash.url();
    }
  },
  readTrash: {
    method: 'GET',
    url: function() {
      return api.server + '/trashes';
    }
  },
    deleteTrash: {
    method: 'DELETE',
    url: function(id) {
      return api.readTrash.url() + '/' + id;
    }
  },
  readTrashWithinBounds: {
    method: 'GET',
    url: function(allBounds) {
      return api.readTrash.url() + '/withinbounds?bounds=' + currentViewBounds;
    }
  },
    /* Cleaning */
  createCleaning: {
    method: 'POST',
    url: function(id) {
      return api.readCleaning.url();
    }
  },
  readCleaning: {
    method: 'GET',
    url: function() {
      return api.server + '/cleanings';
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
    url: function(allBounds) {
      return api.readCleaning.url() + '/withinbounds?bounds=' + currentViewBounds;
    }
  },
  /* Litter */
  readLitterWithinBounds: {
    method: 'GET',
    url: function(allBounds) {
      return api.readLitter.url() + '/withinbounds?bounds=' + currentViewBounds;
    }
  },
  createLitter: {
    method: 'POST',
    url: function() {
      return api.readLitter.url();
    }
  },
  editLitter: {
    method: 'PUT',
    url: function() {
      return api.readLitter.url();
    }
  },
  readLitter: {
    method: 'GET',
    url: function() {
      return api.server + '/litter';
    }
  },
  deleteLitter: {
    method: 'DELETE',
    url: function(id) {
      return api.readLitter.url() + '/' + id;
    }
  },
  /* Area */
  readAreaWithinBounds: {
    method: 'GET',
    url: function(allBounds) {
      return api.readArea.url() + '/withinbounds?bounds=' + currentViewBounds;
    }
  },
  createArea: {
    method: 'POST',
    url: function() {
      return api.readArea.url();
    }
  },
  editArea: {
    method: 'PUT',
    url: function() {
      return api.readArea.url();
    }
  },
  readArea: {
    method: 'GET',
    url: function() {
      return api.server + '/area';
    }
  },
  deleteArea: {
    method: 'DELETE',
    url: function(id) {
      return api.readArea.url() + '/' + id;
    }
  },
};