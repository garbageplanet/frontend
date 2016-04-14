// Display the date and time picker and get the data in the cleaning form on change
$(document).ready(function() {

    $('.selectpicker').selectpicker({ style: 'btn-lg btn-default text-center', size: 6});

    $(function () {
        
        $('#event-date-time-picker')
        
            .datetimepicker({
            
                minDate: new Date(2016, 04, 01),
            
                showClose: true,
            
                ignoreReadonly: true,
            
                focusOnShow: false,
            
                toolbarPlacement: 'top'
            
        });
        
    });

    // Separate tags by hitting space bar or right key
    // FIXME space key doesn't work with mobile keyboard
    $('.feature-tags').tagsinput({
        
        maxTags: 3,
        
        confirmKeys: [32, 39],

        maxChars: 16,

        trimValue: true
        
    });


    $("form").bind("keypress", function (e) {
        
        if (e.keyCode === 13) {

            $(".btn-save").attr('type');

            e.preventDefault();

        }
        
    });

});