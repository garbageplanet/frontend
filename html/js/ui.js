// Make dropdown menu linuks works
$(document).ready(function() {
$('#user-tools, #map-tools').find('a').click( function(e) {
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

// Setup the calendar
// https://github.com/Serhioromano/bootstrap-calendar
/*var cleaningCalendar = $("#calendar").calendar(
    {
        tmpl_path: "/tmpls/",
        events_source: function () { return []; }
});*/


