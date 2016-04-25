function pushDataToModal () {
    
    return "Hello"
    
};

$('#modal-list-features').on('click', function () {
        
    document.getElementById('bottombar-content-container').innerHTML = tmpl('tmpl-feature-info', featuredata);

    
    $("#modal-data").modal();
    $("#modal-data").modal('show');
    
    
        $('#modal-data-list-more').on('click', function () {
        
        // TODO get the bounds and add 1km or more on each side in POSTGIS request
        console.log("list more data...");
        
    });
    
});