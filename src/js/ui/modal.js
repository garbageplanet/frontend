// TODO make the modals with a function
$('#modal-list-garbage').on('click', function () {
    
    $('body').append('<div id="modal-data" class="modal" role="dialog"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close pull-right" data-dismiss="modal"><span class="fa fa-fw fa-times"></span></button><h4 class="modal-title">View and download data from garbagepla.net</h4></div><div class="modal-body"><table id="modal-garbage-table" class="table-striped table-condensed"><thead><tr><th>Feature id</th><th>Coordinates</th><th>Amount</th><th>Garbage types</th></tr></thead><tbody id="modal-garbage-table-body"></tbody></table></div><div class="modal-footer"><a class="disabled pull-left" href="#">Get the full data</a><form><button type="button" data-dismiss="modal" class="btn btn-danger pull-right ">Close</button><button id="modal-data-load-more" type="button" class="btn btn-default pull-right ">Zoom out and load more</button><a id="modal-garbage-download" href="" target="_blank" data-download="data.txt" type="button" class="btn btn-default pull-right">Download</a></form></div></div></div></div>');
    
    document.getElementById('modal-garbage-table-body').innerHTML = tmpl('tmpl-modal-garbage', garbageArray);
        
    $("#modal-data").modal('show');
    
    $('#modal-garbage-table').DataTable();
    
    $('#modal-data-load-more').on('click', function () {
                
        map.setZoom(map.getZoom() - 1);
        
        $('.modal-data-row').empty();
    
        // TODO reload the template with the new data after data has changed       
        document.getElementById('modal-garbage-table-body').innerHTML = tmpl('tmpl-modal-garbage', garbageArray);

    });
    
    $('#modal-garbage-download').on('click', function () {
        
        var stringdata = "text/json;charset=utf-8," + JSON.stringify(garbageArray);

        this.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(stringdata));            

    });

});

$('#modal-list-cleaning').on('click', function () {
    
    $('body').append('<div id="modal-calendar" class="modal" role="dialog"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close pull-right" data-dismiss="modal"><span class="fa fa-fw fa-times"></span></button><h4 class="modal-title">Cleaning events calendar</h4></div><div class="modal-body"><table id="modal-calendar-table" class="table-striped table-condensed"><thead><tr><th>Event id</th><th>Date</th><th>Coordinates</th><th>Address</th></tr></thead><tbody id="modal-calendar-table-body"></tbody></table></div><div class="modal-footer"><form><button type="button" data-dismiss="modal" class="btn btn-danger pull-right ">Close</button><button id="modal-calendar-load-more" type="button" class="btn btn-default pull-right ">Zoom out and load more</button><a id="modal-calendar-download" href="" target="_blank" data-download="data.txt" type="button" class="btn btn-default pull-right">Download</a></form></div></div></div></div>');
    
    document.getElementById('modal-calendar-table-body').innerHTML = tmpl('tmpl-modal-cleaning', cleaningArray);

    $("#modal-calendar").modal('show');
    
    $('#modal-calendar-table').DataTable();
    
    $('#modal-calendar-load-more').on('click', function () {
                
        map.setZoom(map.getZoom() - 1);
        
        $('.modal-calendar-row').empty();
    
        // Todo reload the template with the new data after data has changed       
        document.getElementById('modal-calendar-table-body').innerHTML = tmpl('tmpl-modal-cleaning', cleaningArray);
        
    });
    
    $('#modal-calendar-download').on('click', function () {
        
        var stringdata = "text/json;charset=utf-8," + JSON.stringify(cleaningArray);

        this.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(stringdata));            

    });

});