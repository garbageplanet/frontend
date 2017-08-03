// TODO re-build the system as following:
function Feature ( layer, latlng, formid, type ) {
  
  this.featureid = layer.options._leaflet_id;
  this.type = '';
  this.latlng = new L.LatLng(latlng);
  this.marker = new L.Marker(this.latlng);
  this.data = this.marker.options;
  this.menuentry = {};
  this.binEvents = null;
  this.init = function () {};
  // ...
};

// Init forms for creating new features or editing current ones
Feature.prototype.initForm = function () {};

// Save the forms to the backend
Feature.prototype.saveToBackend = function () {};


function Garbage ( latlng, data, formid, featureid ) {
  
    Feature.call( this, latlng, data, formid, featureid );
}

Garbage.prototype = Object.create(Feature.prototype);
Garbage.prototype.constructor = Garbage;
Garbage.type = 'garbage';

function Cleaning ( latlng, data, formid, featureid ) {
  
    Feature.call( this, latlng, data, formid, featureid );
}

Cleaning.prototype = Object.create(Feature.prototype);
Cleaning.prototype.constructor = Cleaning;
Cleaning.type = 'cleaning';

function Litter ( latlng, data, formid, featureid ) {
  
    Feature.call( this, latlng, data, formid, featureid );
}

Litter.prototype = Object.create(Feature.prototype);
Litter.prototype.constructor = Litter;
Litter.type = 'litter';
Litter.prototype.latlngs = L.latlngs();
Litter.prototype.latlng = null;

gbpn.feature = Feature;