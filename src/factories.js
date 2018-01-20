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
  loadFeature     : () => {}
    ...
})

const makeRequestOptionsObject = (state) => ({
  url: () => { return  },
  header: () => {},
  ...
})


maps.map.on('click', (e) => {

    let garbage_options = {
      name:'garbage',
      options: e.options,
      latlng: e.latlng
    }
    garbage(garbage_options).createOnMap()

})

// Make custom marker method
L.Marker.include({
  _prop1: '',
  _prop2: '',
  method1: '',
  method2; '',
  ...
})

// UTILS
function processStatus(response) {
  if (response.status === 200 || response.status === 0) {
    return Promise.resolve(response)
  }
  else {
    return Promise.reject(new Error(`Error loading: ${url}`))
  }
}

function parseJson(response) {
  return response.json()
}

function uploadImageToImgur(blob) {
  var formData = new FormData()
  formData.append('type', 'file')
  formData.append('image', blob)

  return fetch('https://api.imgur.com/3/upload.json', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: 'Client-ID dc708f3823b7756'// imgur specific
    },
    body: formData
  })
    .then(processStatus)
    .then(parseJson)
}
