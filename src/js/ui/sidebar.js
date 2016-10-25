/* Sidebar behaviors and events listeners */

$(document).ready(function () {
    
    // Hide all the siblings of the clicked link in the sidebar when linking internally and reset sidebar scroll
    $('.sidebar-link').click(function(e) {
        e.preventDefault();
        $(this.hash).fadeIn().siblings().hide();
        $('#sidebar').scrollTop = 0;
    });

    // Go back to the marker creation menu link
    $('.menu-backlink').click(function(e) {
        $('.panel-collapse').collapse('hide');
        $('#sidebar').scrollTop = 0;
        $(this.hash).fadeIn().siblings().hide();
        e.preventDefault();
    });

    // Close sidebar if cancel button clicked
    $('.btn-cancel').on('click', function (){
        sidebar.hide();
        map.removeLayer(marker);
    });

});

// Empty the sidebar on hide, reset accordion and reset scroll
sidebar.on('hide', function () {
    
        $('.sidebar-content').hide();
        $('.sidebar-container', '.sidebar-content').scrollTop = 0;
        $('form').each(function() {
            this.reset(); 
        });
        $('input').val('');
        $('.selectpicker').selectpicker('render');
        $('.tab-default').tab('show');
        $('.leaflet-draw-edit-edit').removeClass('visible');
        $('.leaflet-draw-edit-remove').removeClass('visible');
        // TODO clear the tagsinput
        // $('.bootstrap-tagsinput').tagsinput(''); 
});

// Fill the templates
var credits = (function () {
    
    var content = [
        {
            "title":"homepage",
            "linkurl":"http://home.garbagepla.net/",
            "text":"Project"
        },
        {
            "title":"Let's Encrypt",
            "linkurl":"https://letsencrypt.org/",
            "text":"Secured with"
        },
        {
            "title":"Mapbox",
            "linkurl":"https://www.mapbox.com/",
            "text":"Basemaps imagery ©"
        },
        {
            "title":"Openstreetmap and contributors",
            "linkurl":"http://www.openstreetmap.org/",
            "text":"Maps and underlying data ©"
        },
        {
            "title":"Overpass API",
            "linkurl":"http://www.overpass-api.de/",
            "text":"POIs retrieved using the"
        },
        {
            "title":"OpenCage Geocoder",
            "linkurl":"https://geocoder.opencagedata.com/",
            "text":"Address search and geocoding"
        },
        {
            "title":"Leaflet",
            "linkurl":"http://leafletjs.com/",
            "text":"Mapping done with "
        },
        {
            "title":"FontAwesome",
            "linkurl":"http://fontawesome.io/",
            "text":"Icons by"
        },
        {
            "title":"Bootstrap 3",
            "linkurl":"http://getbootstrap.com/",
            "text":"Built with"
        },
        {
            "title":"JQuery",
            "linkurl":"https://jquery.com/",
            "text":"Runs on"
        },
        {
            "title":"Laravel 5.1",
            "linkurl":"https://laravel.com/",
            "text":"Backed by"
        },
        {
            "title":"JavaScript-Templates",
            "linkurl":"https://github.com/blueimp/JavaScript-Templates",
            "text":"Templating with"
        },
        {
            "title":"Github",
            "linkurl":"https://github.com/garbageplanet",
            "text":"Source code available on"
        }
    ];
    
    document.getElementById('credits').innerHTML = tmpl('tmpl-credits', content);

})();
