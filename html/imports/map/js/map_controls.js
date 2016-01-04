// GPLv2 by humitos@github
var tileLayerData = {
    std: {
    name: 'Basic',
    url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    },
    mapbox_od: {
    name: 'Outdoors',
    url: 'https://api.tiles.mapbox.com/v4/adriennn.9da931dd/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYWRyaWVubm4iLCJhIjoiNWQ5ZTEwYzE0MTY5ZjcxYjIyNmExZDA0MGE2MzI2YWEifQ.WGCZQzbVhF87_Z_Yo1aMIQ',
    },
    mapbox_sat: {
    name: 'Satellite',
    url: 'https://api.tiles.mapbox.com/v4/adriennn.nej0l93m/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYWRyaWVubm4iLCJhIjoiNWQ5ZTEwYzE0MTY5ZjcxYjIyNmExZDA0MGE2MzI2YWEifQ.WGCZQzbVhF87_Z_Yo1aMIQ',
    }
};

var tileLayers = {};
    for (tile in tileLayerData) {
        var tileAttribution;
        var subdomains = tileLayerData[tile].subdomains ? tileLayerData[tile].subdomains : 'abc';
            if (tileLayerData[tile].attribution) {
                tileAttribution = tileLayerData[tile].attribution + ' &mdash; ' + attribution;
            }
            else tileAttribution = attribution;
                tileLayers[tileLayerData[tile].name] = L.tileLayer(
                tileLayerData[tile].url,
                {attribution: tileAttribution, subdomains: subdomains}
            )
};

tileLayers['Outdoors'].addTo(map);
// end of GPLv2 by humitos@github

// Side panel creation and placement
var sidebar = L.control.sidebar('sidebar', {
        position: 'right',
        closebutton: 'true',
        });
map.addControl(sidebar);

// Top panel creation and placement
var topbar = L.control.bar('topbar',{
    position:'top',
    visible:true
});
map.addControl(topbar);

// Bottom panel creation and placement
var bottombar = L.control.bar('bottombar',{
    position:'bottom',
    visible:false
});
map.addControl(bottombar);


// Make the layer groups and add them to the map
garbageLayer = new L.LayerGroup();
siteLayer = new L.LayerGroup();
coastLayer = new L.LayerGroup();
eventLayer = new L.LayerGroup();
osmTrashbinLayer = new L.LayerGroup();
// hexbinLayer = new L.LayerGroup();

map.addLayer(garbageLayer,siteLayer,coastLayer,eventLayer, osmTrashbinLayer);

var overlayGroups = {
"Garbage markers": garbageLayer,
"Cleaning events": eventLayer,
"Polluted sites": siteLayer,
"Dirty coastal areas": coastLayer,
"Nearby trashbins": osmTrashbinLayer
};

// Add the layer control
L.control.layers(tileLayers, overlayGroups).setPosition('topright').addTo(map);

// Add zoom controls above scale
map.addControl( L.control.zoom({position: 'bottomleft'}) );

// Add a scale
new L.control.scale({
    metric: true,
    imperial: false
}).addTo(map);

// Make the Roska menu button with L.EasyButton
roskaButton = L.easyButton({
    id: 'roska-button',
    states: [{
        icon: '<i class="fa fa-2x fa-fw fa-bars fa-icon-white"></i>',
        title: 'Main menu',
        stateName: 'bag',
        onClick: function(btn,map) {
            btn.state('menubars');
            $('.sidebar-content').hide();
            $('#sidebar').scrollTop = 0;
            sidebar.show($('#menu-dialog').fadeIn('slow'));
            sidebar.on('hide', function(){
                btn.state('bag');
            });
            if (localStorage.token) {
                $('#menu-dialog').hide();
                $.ajax({
                  url: 'http://api.garbagepla.net/api/authenticate/user',
                  headers: {"Authorization": "Bearer " + localStorage.token},
                  method: 'get',
                  success: function (data) {
                    console.log('alreay logged in', data);
                    $('#account-info').find('.username').html(data.user.name);
                    $('#account-info').find('.user_name').html(data.user.name);
                    $('#account-info').find('.user_id').html(data.user.id);
                    $('#account-info').find('.user_email').html(data.user.email);
                    $('#account-info').find('.created_at').html(data.user.created_at);
                    $('#account-info').find('.updated_at').html(data.user.updated_at);
                    $('#account-info').show();
                  },
                  error: function (data) {
                    console.log('token expired');
                    $('#menu-dialog').show();
                  }
                });
            }
        },
    }, {
        icon: '<i class="fa fa-fa fa-2x fa-bars fa-rotate-90 fa-icon-white"></i>',
        stateName: 'menubars',
        title: 'Main menu',
        onClick: function(btn,map) {
            btn.state('bag');
            $('.sidebar-content').hide();
            sidebar.hide();
        },
    }]
});
roskaButton.addTo(map);

// Add find me button if the geolocation doesn't work @L.EasyButtons examples
L.easyButton({
    id: 'locate-button',
  states:[
    {
      stateName: 'unloaded',
      icon: 'fa-location-arrow fa-2x fa-fw fa-icon-darkgray',
      title: 'Find accurate location',
      onClick: function(control){
        control.state("loading");
        control._map.on('locationfound', function(e){
          this.setView(e.latlng, 17);
          control.state('loaded');
        });
        control._map.on('locationerror', function(){
          control.state('error');
        });
        control._map.locate()
      }
    }, {
      stateName: 'loading',
      icon: 'fa-spinner fa-spin fa-fw- fa-2x fa-icon-darkgray'
    }, {
      stateName: 'loaded',
      icon: 'fa-check fa-2x fa-fw fa-icon-darkgray'
    }, {
      stateName: 'error',
      icon: 'fa-frown-o fa-2x fa-fw fa-icon-darkgray',
      title: 'Location not found'
    }
  ]
}).addTo(map);

// Make an attribution button instead of the default text
attributionsButton = L.easyButton({
    id: 'attributions-button',
    position: 'bottomright',
    states: [{
        icon: '<i class="fa fa-2x fa-fw fa-info fa-icon-darkgray"></i>',
        title: 'Attributions',
        stateName: 'hidden',
        onClick: function(btn,map) {
            btn.state('visible');
            $('.sidebar-content').hide();
            $('#sidebar').scrollTop = 0;
            sidebar.show($('#menu-dialog').fadeIn('slow'));
            sidebar.on('hide', function(){
                btn.state('hidden');
            });
        },
    }]
});
attributionsButton.addTo(map);

// Button to search tags and stuff and TODO bind to L.geocoding plugin
var locateStuff = L.easyButton({
        id: 'search-button',
        states: [{
            icon: '<i class="fa fa-2x fa-fw fa-search fa-icon-darkgray"></i>',
            title: 'Search tags, users, tiles, locations and stuff',
            onClick: function() {
                $('.sidebar-content').hide();
                sidebar.show($("#search-dialog").fadeIn());
                },
            }]
        });
 locateStuff.addTo(map);

// Button to locate nearby places to bring garbage
var locateTrashbin = L.easyButton({
        id: 'search-nearby-trashbin',
        states: [{
            icon: '<i class="fa fa-2x fa-fw fa-trash fa-icon-darkgray"></i>',
            title: 'Look for nearby places to bring garbage',
            onClick: function createOsmTrashbinQuery () {
                //stop the function on drag, pan or zoom
                // map.on('zoomlevelschange dragend', ... );
                    var osmTrashbinLayer = new L.OverPassLayer({
                        query: "(node(BBOX)['amenity'='waste_basket'];node(BBOX)['amenity'='recycling'];node(BBOX)['amenity'='waste_disposal']);out;",
                          callback:
                                    function(data) {
                                        for(var i=0;i<data.elements.length;i++) {
                                          var e = data.elements[i];
                                          var pos = new L.LatLng(e.lat, e.lon);
                                          var markerIcon = L.divIcon({
                                                className: 'marker-nearby-trashbin',
                                                iconSize: [25,25],
                                                html:'<i class="fa fa-2x fa-fw fa-trash-o fa-icon-darkgray"></i>'
                                                    });
                                          var marker = L.marker(pos, {
                                                icon: markerIcon,
                                            });
                                          this.instance.addLayer(marker);
                                        }
                                    },
                    });
                map.addLayer(osmTrashbinLayer);
            }
        }
    ]
});
locateTrashbin.addTo(map);

// TODO Nearby place:name/city/village...
/*
    function findNearestLocality () {
    var opClosestLocality = new L.OverPassLayer({
                query: "(node['place'](around:500,(BBOX));out center;",
    });
*/
