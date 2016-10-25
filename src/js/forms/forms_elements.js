/**
* Forms elements that requires js activations and setting
*/

// Display the date and time picker and get the data in the cleaning form on change
var forms = (function () {

var garbagetypes = [
        {short:"plastic",long:"Plastic items"},
        {short:"bags",long:"Plastic bags"},
        {short:"foodpacks",long:"Plastic food containers"},
        {short:"pet",long:"PET bottles"},
        {short:"party",long:"Party leftovers"},
        {short:"fastfood",long:"Fastfood garbage"},
        {short:"poly",long:"Expanded plastic polymers"},
        {short:"butts",long:"Cigarette butts"},
        {short:"glassb",long:"Broken glass"},
        {short:"glass",long:"Glass"},
        {short:"bottles",long:"Glass bottles"},
        {short:"metal",long:"Metal"},
        {short:"tin",long:"Tin cans"},
        {short:"alu",long:"Aluminium cans"},
        {short:"wood",long:"Plywood and treated or painted wood"},
        {short:"chemicals",long:"Chemicals"},
        {short:"household",long:"Household garbage"},
        {short:"clothes",long:"Shoes and clothes"},
        {short:"fabric",long:"Carpets and fabrics"},
        {short:"matress",long:"Matresses"},
        {short:"tarp",long:"Tarps and other large covers"},
        {short:"electronic",long:"Electronics"},
        {short:"electric",long:"Electric appliances"},
        {short:"batt", long:"Batteries"},
        {short:"industrial",long:"Industrial wastes"},
        {short:"construction",long:"Construction wastes"},
        {short:"gas",long:"Gasoline and petroleum oil"},
        {short:"crude",long:"Crude oil"},
        {short:"vehicle",long:"Large vehicle"},
        {short:"bicycle",long:"Bicycles"},
        {short:"motorcyle",long:"Motorcycles"},
        {short:"tyres",long:"Tyres"},
        {short:"engine",long:"Engine parts"},
        {short:"parts",long:"Vehicles parts"},
        {short:"fishing",long:"Fishing gears"},
        {short:"commercial",long:"Commercial fishing equipment"},
        {short:"net",long:"Fishing net"},
        {short:"lines",long:"Fishing line"},
        {short:"boat",long:"Small boat"},
        {short:"vessel",long:"Large boat or wreck"},
        {short:"boating",long:"Boating equipment"},
        {short:"buoy",long:"Buoys and floats"},
        {short:"maritime",long:"Maritime equipment"},
        {short:"sew",long:"Sewage"},
        {short:"dogs",long:"Dog poop bags"}
    ];
    
    // Fill the multiselect templates
    document.getElementById('garbage-select').innerHTML = tmpl('tmpl-form-garbage-type', garbagetypes);
    document.getElementById('litter-select').innerHTML = tmpl('tmpl-form-garbage-type', garbagetypes);

    // force styling of multiselects
    // most of the options are already set in the html
    $('.selectpicker').selectpicker({ 
        style: 'btn-lg btn-default text-center', 
        size: 6
    });

    // Set the options on the time and date selects
    // $(function () {
        $('#event-date-time-picker')
            .datetimepicker({
                minDate: new Date(2016, 04, 01),
                showClose: true,
                ignoreReadonly: true,
                focusOnShow: false,
                toolbarPlacement: 'top'
        });
    //});

    // Separate tags by hitting space bar or right key
    // FIXME space key doesn't work with mobile keyboard
    $('.feature-tags').tagsinput({
        maxTags: 3,
        confirmKeys: [32, 39],
        maxChars: 16,
        trimValue: true
    });

    // Prevent sending the form with enter key
    $(".form-feature").bind("keypress", function (e) {
        
        if (e.keyCode === 13) {

            $(".btn-save").attr('type');
            e.preventDefault();
        }
    });
    
    // return {}
})();