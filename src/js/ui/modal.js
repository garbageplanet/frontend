$('#modal-list-features').on('click', function () {
    
    $('body').append('<div id ="modal-data" class="modal" role="dialog"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close pull-right" data-dismiss="modal"><span class="fa fa-fw fa-times"></span></button><h4 class="modal-title">View and download data from garbagepla.net</h4></div><div class="modal-body"><table id="modal-data-table" class="table-striped table-condensed"><tr><th>Feature type</th><th>Coordinates</th><th>Amount</th></tr></table></div><div class="modal-footer"><a class="disabled pull-left" href="#">Get the full data</a><form><button type="button" data-dismiss="modal" class="btn btn-danger pull-right ">Close</button><button id="modal-data-load-more" type="button" class="btn btn-default pull-right ">Load more</button><a id="modal-data-download" href="" target="_blank" data-download="data.txt" type="button" class="btn btn-default pull-right">Download</a></form></div></div></div></div>');
    
    document.getElementById('modal-data-table').innerHTML = tmpl('tmpl-modal', featurearray);

    $("#modal-data").modal('show');
    
    $('#modal-data-load-more').on('click', function () {
                
        map.setZoom(map.getZoom() - 1);
        
        $('.modal-data-row').empty();
    
        // Todo reload the template with the new data after data has changed       
        document.getElementById('modal-data-table').innerHTML = tmpl('tmpl-modal', featurearray);
        
    });
    
    $('#modal-data-download').on('click', function () {
        
        var stringdata = "text/json;charset=utf-8," + JSON.stringify(featurearray);

        this.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(stringdata));            

    });

});