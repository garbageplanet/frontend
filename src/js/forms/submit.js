/*jslint browser: true, white: true, sloppy: true, maxerr: 1000*/

/**
* Saving forms data to the backend
*/

// Save features on the map
 var saving = (function() {
  
    // TODO prototype and allow chaining to newmarker i.e something like newmarker.Save()   
    var _saveFeature = function(fo, ft) {

        // NOTE ft = formtype, fo = formobj
        var useToken = localStorage.getItem('token') || tools.token;
        var postrequest;
      
        // Prepare a submission object (so) to send to backend by checking if the form has any arrayed keys
        var so = {};

        console.log("fo: ", fo);
        console.log("ft: ", ft);
  
        for(var k in fo) {
            var o = fo[k];
            
            if (o.join) {
              so[k] = o.join();
            }
            else {
                so[k] = fo[k];
            }
        }
      
        // Default to mid value
        if (so.amount === '' || !so.amount) {
            so.amount = 3;
        }
                   
        console.log('------------------------------')
        console.log('prepared submission obj: ', so);
            
        if (ft === 'garbage') {
            
            postrequest = $.ajax({
                method: api.createTrash.method,
                url: api.createTrash.url(),
                headers: {
                    'Authorization': 'Bearer ' + useToken
                },                            
                data: {
                  'latlng': so.latlng,
                  'amount': so.amount,
                  'types': so.type,
                  'todo': so.todo,
                  'image_url': so.image,
                  'tag': so.tags,
                  // 'sizes': so.size,
                  // 'embed': so.environ,
                  'note': so.note                    
                },
                success: function(data) {
                    features.loadGarbageMarkers();
                },
                error: function(response) {
                    console.log(response);
                }
            });       
        }

        if (ft === 'cleaning') {
          
            console.log("saving cleaning form: ", fo);

            postrequest= $.ajax({

                method: api.createCleaning.method,
                url: api.createCleaning.url(),
                headers: {'Authorization': 'Bearer ' + useToken},
                dataType: 'json',
                data: {

                    'latlng': so.latlng,
                    'datetime': so.hour,
                    'note': so.note,
                    'recurrence': so.recurrence,
                    'tag': so.tags
                },
                success: function (data) {
                    features.loadCleaningMarkers();
                },
                error: function (response) {
                    console.log(response);
                }
          });          
        }

        if (ft === 'litter') {
          
            console.log("saving litter form: ", fo);
          
            postrequest = $.ajax({

                method: api.createLitter.method,
                url: api.createLitter.url(),
                headers: {'Authorization': 'Bearer ' + useToken},
                dataType: 'json',
                data: {

                    'latlngs': so.latlngs,
                    'amount': so.amount,
                    'types': so.type,
                    'image_url': so.image,
                    'tag': so.tags,
                    'physical_length': so.lengthm,
                    'amount_quantitative': so.quantitative
                },
                success: function (data) {
                    console.log('success data', data);
                    features.loadLitters(); 
                },

                error: function (response) {

    
                }
            });               
        }

        if (ft === 'area') {
          
            console.log("saving area form: ", fo);

            // Generate a random id if the user didn't set a title
            if (so.title.length < 1) {
                so.title = tools.randomString(12);
                // console.log('randomly generated area title', so.title);
                // console.log(so);
            }

            postrequest = $.ajax({

                method: api.createArea.method,
                url: api.createArea.url(),
                headers: {'Authorization': 'Bearer ' + useToken},
                dataType: 'json',
                data: {
                    'latlngs': so.latlngs,
                    'note': so.note,
                    'contact': so.contact,
                    // 'secret': so.secret,
                    'title': so.title,
                    // 'tag': so.tags,
                    // 'game' : so.game,
                    'max_players': so.players
                },
                success: function (data) {
                    console.log('success data', data);
                    features.loadAreas(); 
                },
                error: function (response) {

                }
          });
          
        }
      
        postrequest.done(function() {
            if (ft === 'garbage' || ft === 'cleaning') {
                maps.unsavedMarkersLayerGroup.clearLayers();
            }
            alerts.showAlert(25, 'success', 1500);
            ui.sidebar.hide('slow');
            // $('.btn-draw').removeClass('disabled');    
        });
      
        postrequest.fail(function(response) {
            console.log(response);
            if (response.responseText.indexOf('token_invalid')) {
                alerts.showAlert(3, 'warning', 2000);
            }
          
            else { alerts.showAlert(10, 'danger', 1500); }
            
            ui.sidebar.hide();
            tools.resetIconStyle();
            // TODO stop the drawing listeners if any
        });          
    },
        _bindEvents = function(obj) {

            console.log('current formobj: ', obj);
            var currentform = obj;
          
            currentform.on('keyup change', function(e) {
                currentform.validator('validate');
            });
          
            currentform.validator().on('submit', function(e) {

                if (e.isDefaultPrevented()) {
                    alerts.showAlert(30, 'danger', 2000);
                    // FIXME if we call return here the validator exits/bugs?
                    return;
                }

                else {
                  
                    e.preventDefault();
                    // Get the data from the form
                    var formname = currentform[0].className,
                        formobj = currentform.serializeObject();

                    // extract the form type from the classname
                    var formtype = formname.substr(formname.lastIndexOf('-') + 1);
                    
                    /*console.log('------------------------------');
                    console.log('current form array: ', formobj);
                    console.log('current form ype: ', formtype);
                    console.log('------------------------------')*/;    
                  
                    // Save the data with ajax
                    _saveFeature(formobj, formtype);                
                }  
            });
        },
        init = function() {
          // empty the placeholder
          this.form = null;
          // Cache the current form
          this.form = $('.form-feature');
          _bindEvents(this.form);
        }

    return {
        init: init,
    };
}());