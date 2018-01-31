// factories allows for easy extension and feature addition

const feature = (state) => ({
  method1         : () => {},
  authtoken       : () => { localStorage.get('token')},
  icon            : () => { return new L.Icon(state.name) },
  createOnMap     : () => { return new L.Marker(state.latlng, this.icon) },
  setDomEvents    : () => { document.queryselector('marker-' + state.name).addEventListener('click'), (e) => { e.preventDefault(); console.log(e); }},
  saveToBackend   : () => { fetch('https://gpbn.com/api/'+ state.name, method: state.fetchmethod, data: state.options, headers: state.headers) },
  setMapEvents    : () => {},
  setFeatureEvents: () => {},
  editFeature     : () => {},
  loadFeature     : () => {},
    ...
})

const makeRequestOptionsObject = (state) => ({
  url: () => { return  },
  header: () => {},
  ...
})


maps.map.on('click', (e) => {

    let params = {
      name:'garbage',
      options: e.options,
      latlng: e.latlng
    }
    garbage(params).createOnMap()

})

// Make custom marker method
L.Marker.include({
  _prop1: '',
  _prop2: '',
  method1: '',
  method2; '',
  ...
})
