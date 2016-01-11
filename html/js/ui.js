// Make dropdown menu linuks works
$(document).ready(function() {
$('#user-tools').find('a').click( function(e) {
        e.preventDefault();
        bottombar.hide();
        sidebar.show();
        $(this.hash).fadeIn().siblings().hide();
    });
});

// Make collapsed menu button work
$(document).ready(function() {
$('#mobile-menu-button').click( function(e) {
        e.preventDefault();
        bottombar.hide();
        sidebar.show($('#mobile-menu-dialog').fadeIn().siblings().hide());
    });
});

// Actions for map-tools dropdown
$('#locate-button').on('click', function(){
  map.locate({setView: true, maxZoom: 17});
  // TODO add marker and timer to remove it
});

//  General Alerts
$(document).ready(function() {
   if($(window).width() < 1024){
       $('.alert-draw').removeClass('hidden');
       window.setTimeout(function() { $(".alert-draw").fadeOut('slow'); }, 4000);
   }
});

// Forms styling and basic actions
$(document).ready(function() {
   $(function () {
       $('#event-date-time-picker').datetimepicker();
   });
});

$(document).ready(function() {
   $('.selectpicker').selectpicker({
               style: 'btn-lg btn-default text-center',
               size: 5})
});

// Close button bottombar

$(document).ready(function() {
$('.bottombar-close').click( function(e) {
        e.preventDefault();
        bottombar.hide();
    });
});

// Range slider
var range = $('.input-range'),
    value = $('.range-value');
    
value.html(range.attr('value'));

range.on('input', function(){
    value.html(this.value);
}); 


