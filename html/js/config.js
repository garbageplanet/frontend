/**
 * The necessary configurations that are used by the UI
 * PLEASE BE CAREFUL CHANGING THE SETTINGS BELOW!
 */
var api = {
  // Backend
  server: 'http://api.garbagepla.net/api',

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
      return api.readTrash.url() + '/' + id;
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
    url: function(bounds) {
      return api.readTrash.url() + '/withinbounds?bounds=' + bounds;
    }
  },
  /* Monitoring Tiles */
  createMonitoringTiles: {
    method: 'POST',
    url: function() {
      return api.readMonitoringTiles.url();
    }
  },
  readMonitoringTiles: {
    method: 'GET',
    url: function() {
      return api.server + '/monitoringtiles';
    }
  }
};