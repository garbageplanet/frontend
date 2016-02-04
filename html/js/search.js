// Custom L.geosearch control in the top panel
// FIXME the a elements cannot catch the clicks in the navbar

$(document).ready(function() {
  
  $('.search-filter').find('a').on('click', function (e) {
        debugger;

    e.preventDefault();
    var filter = $(this).text();
    console.log(filter);
	$('.search-filter button span:nth-child(1)').text(filter);
  });
  
  var searchBar = new L.GeoSearch.Provider.OpenStreetMap(),
      query = $('input .search-query').val();

  $(',btn-search').on('click', function () {

    searchBar.GetLocations( query, function ( data ) {
      // in data are your results with x, y, label and bounds (currently availabel for google maps provider only)
      
      //TOOD add results to <ul><li> and add onclick events
      // if (filter === 'value') {}
      
    });    
    
  });
  
});