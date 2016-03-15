/*jslint browser: true, white: true, sloppy: true, maxerr: 1000*/
// Custom L.geosearch control in the top panel
// FIXME the a elements cannot catch the clicks in the navbar

/*$(document).ready(function () {
  
  $('.search-filter').find('a').on('click', function (e) {

    e.preventDefault();
    var filter = $(this).text();
    console.log(filter);
	$('#search-filter-value').text(filter);
  });
  
  var searchBar = new L.GeoSearch.Provider.OpenStreetMap(),
    query = $('input .search-query').val();

  $('.btn-search').on('click', function () {

    searchBar.GetLocations( query, function (data) {
      // in data are your results with x, y, label and bounds (currently availabel for google maps provider only)
      
      //TOOD add results to <ul><li> and add onclick events
      // if (filter === 'value') {}
    });
    
  });
  
});*/

var searchOptions = {};
    searchOptions.address = {
        // container: 'search',
        layer: garbageLayerGroup,
        zoom: 15,
        minLength: 4,
        buildTip: function(text, val) {}
    },
    searchOptions.garbage = {
        // container: 'search',
        layer: garbageLayerGroup,
        zoom: 15,
        minLength: 4,
        // buildTip: function(text, val) {}
    },
    searchOptions.cleaning = {
        container: 'search',
        layer: cleaningLayerGroup,
        zoom: 15,
        minLength: 4,
        buildTip: function(text, val) {}
    },
      searchOptions.litter = {
        container: 'search',
        layer: litterLayerGroup,
        zoom: 12,
        minLength: 4,
        buildTip: function(text, val) {}
    },
    searchOptions.area = {
        layer: areaLayerGroup,
        container: 'search',
        zoom: 10,
        minLength: 4,
        buildTip: function(text, val) {}
    },
    searchOptions.all = {
        layer: allLayers,
        container: 'search',
        zoom: 10,
        minLength: 4,
        buildTip: function(text, val) {}
    },
    searchOptions.tags = {
        url: 'https://www.garbagepla.net/api/tags',
        container: 'search',
        zoom: 10,
        minLength: 4,
        buildTip: function(text, val) {}
    };
      

// Create the search control and add it to the document
var searchControl = new L.Control.Search(searchOptions.garbage);
// map.addControl(searchControl);

// Google geocoding Copyright (c) 2013 Stefano Cudini MIT https://github.com/stefanocudini/leaflet-search/blob/master/examples/google-geocoding.html
// Add event listener if the general address search is selected
/*$('#search select').on ('change', function () {
 
  if ($(this).find(":selected").val() === 'address') {

      $.getScript('https://maps.googleapis.com/maps/api/js?v=3&sensor=false', success(response,status));

      if (status === 'error' || 'timeout' || 'parserror') {

          showAlert("Failed to connect to Google API.", "danger", 2000);

      }
  }
});

var geocoder = new google.maps.Geocoder();
function googleGeocoding(text, callResponse)
{
    geocoder.geocode({address: text}, callResponse);
}
function formatJSON(rawjson)
{
    var json = {},
        key, loc, disp = [];
    for(var i in rawjson)
    {
        key = rawjson[i].formatted_address;

        loc = L.latLng( rawjson[i].geometry.location.lat(), rawjson[i].geometry.location.lng() );

        json[ key ]= loc;	//key,value format
    }
    return json;
};*/