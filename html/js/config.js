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
    readTrashWithinBounds: {
    method: 'GET',
    url: function(allBounds) {
      return api.readTrash.url() + '/withinbounds?bounds=' + currentViewBounds;
    }
  },
  /* Monitoring Tiles */
  // TODO add new routes to API and replace '/monitoringtiles' route name by '/shapes'
    readShapesWithinBounds: {
    method: 'GET',
    url: function(allBounds) {
      return api.readShape.url() + '/withinbounds?bounds=' + currentViewBounds;
    }
  },
  createShape: {
    method: 'POST',
    url: function() {
      return api.readShape.url();
    }
  },
  readShape: {
    method: 'GET',
    url: function() {
      return api.server + '/monitoringtiles';
    }
  },
  deleteShape: {
    method: 'DELETE',
    url: function(id) {
      return api.readShape.url() + '/' + id;
    }
  },
};