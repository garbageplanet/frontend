// TODO fix the table template as it doesn't work (no search, pages tec...)
var makeModal = function (type, arr){
    
    console.log("array data: ", arr);
    
    if (typeof arr !== 'undefined' && arr.length > 0) {
        
        if (type == 'garbage') {
            this.template = '<div id="modal-data" class="modal" role="dialog"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close pull-right" data-dismiss="modal"><span class="fa fa-fw fa-times"></span></button><h4 class="modal-title">View and download data from garbagepla.net</h4></div><div class="modal-body"><table id="modal-garbage-table" class="table-striped table-condensed"><thead><tr><th>Feature id</th><th>Coordinates</th><th>Amount</th><th>Garbage types</th></tr></thead><tbody id="modal-garbage-table-body"></tbody></table></div><div class="modal-footer"><a class="disabled pull-left" href="#">Get the full data</a><form><button type="button" data-dismiss="modal" class="btn btn-danger pull-right ">Close</button><button id="modal-data-load-more" type="button" class="btn btn-default pull-right ">Zoom out and load more</button><a id="modal-download" href="" target="_blank" data-download="data.txt" type="button" class="btn btn-default pull-right">Download</a></form></div></div></div></div>';
        }
        
        if (type == 'cleaning') {
            this.template = '<div id="modal-calendar" class="modal" role="dialog"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close pull-right" data-dismiss="modal"><span class="fa fa-fw fa-times"></span></button><h4 class="modal-title">Cleaning events calendar</h4></div><div class="modal-body"><table id="modal-calendar-table" class="table-striped table-condensed"><thead><tr><th>Event id</th><th>Date</th><th>Coordinates</th><th>Address</th></tr></thead><tbody id="modal-calendar-table-body"></tbody></table></div><div class="modal-footer"><form><button type="button" data-dismiss="modal" class="btn btn-danger pull-right ">Close</button><button id="modal-calendar-load-more" type="button" class="btn btn-default pull-right ">Zoom out and load more</button><a id="modal-download" href="" target="_blank" data-download="data.txt" type="button" class="btn btn-default pull-right">Download</a></form></div></div></div></div>';
        }
        
        this.modaltmplclass      = 'tmpl-modal-' + type;
        this.modaltableclass     = 'modal-'      + type + '-table';
        this.modaltablebodyclass = 'modal-'      + type + '-table-body';
        
        console.log(modaltablebodyclass);
        
        $('body').append(this.template);
        document.getElementById(this.modaltablebodyclass).innerHTML = tmpl(this.modaltmplclass, arr);
        $("#modal-data").modal('show');
        $(this.modaltableclass).DataTable();

        $('#modal-data-load-more').on('click', function () {
            map.setZoom(map.getZoom() - 1);
            $('.modal-data-row').empty();
            // TODO reload the template with the new data after data has changed
            document.getElementById(this.modaltablebodyclass).innerHTML = tmpl(this.modaltmplclass, arr);
        });

        $('#modal-download').on('click', function (e) {
            console.log("DOWNLOAD BUTTON LCICKED");
            e.preventDefault;
            var stringdata = "text/json;charset=utf-8," + JSON.stringify(arr);
            this.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(stringdata));            
        });
        
    } else {
        alerts.showAlert(29,"warning", 2000)
    }
    
};
    
// Set the event listeners
$('.modal-link').on('click', function(e){
    
    if ($(this).hasClass('modal-list-garbage')){
        // Passing the garbage array in the current screen to the function
        makeModal('garbage', features.garbageArray());
    } 
    
    if ($(this).hasClass('modal-list-cleaning')) {
        makeModal('cleaning', features.cleaningArray());
    }
    
});