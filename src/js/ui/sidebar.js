
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
        $('form').each(function() { this.reset(); });
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