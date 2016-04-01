// Get rid of the mobile menu on larger screens
// TODO add as template if mobile so there's no need to load by default
$(document).ready(function() {

    if (window.innerWidth >= 768) {

        $('#mobile-menu-dialog').remove();
        
    }
    
});

// Easily add ellipses to long strings credit: http://stackoverflow.com/questions/1199352/smart-way-to-shorten-long-strings-with-javascript/1199420#1199420
String.prototype.ellipsis = function(n){
    
          return this.substr(0,n-1)+(this.length>n?'&hellip;':'');
    
}

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
$(".btn-cancel").on('click', function (){
    
    sidebar.hide();
    
    map.removeLayer(marker);
    
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
document.getElementById('credits').innerHTML = tmpl("tmpl-credits", templatedata);