/*jslint browser: true, white: true, sloppy: true, maxerr: 1000*/

/**
* Saving forms data to the backend
*/

// Save features on the map
 var saving = (function () {
   
    'use strict';
  
    var _saveFeature = function _saveFeature (fo, ft) {

        // NOTE ft = formtype, fo = formobj
        var ft = ft.trim();
        var useToken = localStorage.getItem('token') || tools.token;
        var auth = 'Bearer ' + useToken;
        var postrequest;
      
        // Prepare a submission object (so) to send to backend by checking if the form has any arrayed keys
        var so = {};

        for(var k in fo) {
            var o = fo[k];
            
            if (o.join) {
              so[k] = o.join();
            }
            else {
                so[k] = fo[k];
            }
        }
                   
        console.log('------------------------------')
        console.log('prepared submission obj: ', so);
        console.log('form type: ', ft);
        console.log("form object: ", fo);
      
        switch (ft) {
            
            case 'garbage' :
                postrequest = $.ajax({
                    method: api.createTrash.method,
                    url: api.createTrash.url(),
                    headers: {'Authorization': auth},
                    dataType: 'json',
                    data: {
                        'latlng': so.latlng,
                        'amount': so.amount,
                        'types': so.type,
                        'todo': so.todo,
                        'image_url': so.image,
                        'tag': so.tags,
                        'sizes': so.size,
                        'embed': so.environ,
                        'note': so.note                    
                      }
                }); 
                break;
            
            case 'cleaning' :
                postrequest = $.ajax({
                    method: api.createCleaning.method,
                    url: api.createCleaning.url(),
                    headers: {'Authorization': auth},
                    dataType: 'json',
                    data: {
                        'latlng': so.latlng,
                        'datetime': so.datetime,
                        'note': so.note,
                        'recurrence': so.recurrence,
                        'tag': so.tags
                    }
                }); 
                break;
            
            case 'litter' :
                postrequest = $.ajax({

                    method: api.createLitter.method,
                    url: api.createLitter.url(),
                    headers: {'Authorization': auth},
                    dataType: 'json',
                    data: {
                        'latlngs': so.latlngs,
                        'amount': so.amount,
                        'types': so.type,
                        'image_url': so.image,
                        'tag': so.tags,
                        'physical_length': so.lengthm,
                        'amount_quantitative': so.quantitative
                    }
                });
                break;
            
            case 'area' :
                // Generate a random id if the user didn't set a title
                if (!so.title) {
                    so.title = tools.randomString(12);
                    console.log('randomly generated area title', so.title);
                    console.log(so);
                }

                postrequest = $.ajax({
                    method: api.createArea.method,
                    url: api.createArea.url(),
                    headers: {'Authorization': auth },
                    dataType: 'json',
                    data: {
                        'latlngs': so.latlngs,
                        'note': so.note,
                        'contact': so.contact,
                        'secret': so.secret,
                        'title': so.title,
                        'tag': so.tags,
                        'game' : so.game,
                        'max_players': !so.players ? 0 : so.players
                    }
                });
                break;
            
            case 'opengraph' :
                postrequest = $.ajax({

                    method: api.createOg.method,
                    url: api.createOg.url(),
                    headers: {'Authorization': auth},
                    dataType: 'json',
                    data: {
                        'latlng'      : so.latlng,
                        'url'         : so.url,
                        'site_name'   : so.site_name,
                        'title'       : so.title,
                        'description' : so.description,
                        'image'       : so.image
                    }
                }); 
                break;
        };
      
        /*if (ft === 'garbage') {
                      
            var postrequest = $.ajax({
                method: api.createTrash.method,
                url: api.createTrash.url(),
                headers: {'Authorization': auth},
                dataType: 'json',
                data: {
                    'latlng': so.latlng,
                    'amount': so.amount,
                    'types': so.type,
                    'todo': so.todo,
                    'image_url': so.image,
                    'tag': so.tags,
                    'sizes': so.size,
                    'embed': so.environ,
                    'note': so.note                    
                  }
            });       
        }
        else if (ft === 'cleaning') {

            var postrequest = $.ajax({
                method: api.createCleaning.method,
                url: api.createCleaning.url(),
                headers: {'Authorization': auth},
                dataType: 'json',
                data: {
                    'latlng': so.latlng,
                    'datetime': so.datetime,
                    'note': so.note,
                    'recurrence': so.recurrence,
                    'tag': so.tags
                }
            });          
        } 
        else if (ft === 'litter') {
                    
            var postrequest = $.ajax({

                method: api.createLitter.method,
                url: api.createLitter.url(),
                headers: {'Authorization': auth},
                dataType: 'json',
                data: {
                    'latlngs': so.latlngs,
                    'amount': so.amount,
                    'types': so.type,
                    'image_url': so.image,
                    'tag': so.tags,
                    'physical_length': so.lengthm,
                    'amount_quantitative': so.quantitative
                }
            });               
        }
        else if (ft === 'area') {
          
            // Generate a random id if the user didn't set a title
            if (!so.title) {
                so.title = tools.randomString(12);
                console.log('randomly generated area title', so.title);
                console.log(so);
            }

            var postrequest = $.ajax({

                method: api.createArea.method,
                url: api.createArea.url(),
                headers: {'Authorization': auth },
                dataType: 'json',
                data: {
                    'latlngs': so.latlngs,
                    'note': so.note,
                    'contact': so.contact,
                    'secret': so.secret,
                    'title': so.title,
                    'tag': so.tags,
                    'game' : so.game,
                    'max_players': !so.players ? 0 : so.players
                }
          });
          
        }
        else if (ft === 'opengraph') {
          
            var postrequest = $.ajax({

                method: api.createOg.method,
                url: api.createOg.url(),
                headers: {'Authorization': auth},
                dataType: 'json',
                data: {
                    'latlng'      : so.latlng,
                    'url'         : so.url,
                    'site_name'   : so.site_name,
                    'title'       : so.title,
                    'description' : so.description,
                    'image'       : so.image
                }
          });      
        }*/
      
        postrequest.done(function(data) {
          
            console.log(data);
          
            if (ft === 'garbage' || ft === 'cleaning') {
                maps.unsavedMarkersLayerGroup.clearLayers();
                actions.tempmarkers = [];
            }
          
            // Reload map features after an item is saved
            features.loadFeature(ft);
            
            alerts.showAlert(25, 'success', 1500);
            ui.sidebar.hide('slow');
        });
        postrequest.fail(function(data) {
            console.log(data);
            if (data.responseText.indexOf('token_invalid')) {
                alerts.showAlert(3, 'warning', 2000);
            } else { 
                alerts.showAlert(10, 'danger', 1500);
            }
            
            ui.sidebar.hide();
            tools.resetIconStyle();
            // TODO stop the drawing listeners if any
        });          
        },
        _bindEvents = function _bindEvents (obj) {

            console.log('current formobj: ', obj);
            var currentform = obj;
          
            // Hack to immediatley validate opengraph form
            // FIXME really needed?
            if (obj[0].className.indexOf('opengraph')) {
                currentform.validator('validate');
            }
          
            currentform.on('keyup change', function(e) {
                currentform.validator('validate');
            });
          
            // Form submission
            currentform.validator().on('submit', function(e) {

                if (e.isDefaultPrevented()) {
                    // isDefaultPrevented is the way the validator plugin tells sthg is wrong with the form
                    alerts.showAlert(30, 'danger', 2000);
                    // FIXME if we call return here the validator exits/bugs?
                    return;
                }

                else {
                  
                    e.preventDefault();
                    // Get the data from the form
                    var formname = currentform[0].className,
                        formobj = currentform.serializeObject();

                    // extract the form type from the classname and trim the string
                    var formtype = formname.substr(formname.lastIndexOf('-') + 1).trim();
                                      
                    /*console.log('------------------------------');
                    console.log('current form array: ', formobj);
                    console.log('current form type:', formtype);
                    console.log('current form type: ', formtype);
                    console.log('------------------------------');*/   
                  
                    // Save the data with ajax
                    _saveFeature(formobj, formtype);                
                }  
            });
        },
        init = function init () {
            // we init this code only when a form is created in forms._bindEvents() in src/js/forms/forms.js
            // empty the placeholder
            this.form = null;
            // Cache the current form, there's always only one .form-feature in the DOM
            this.form = $('.form-feature');
            _bindEvents(this.form);
        };

    return { init: init };
}());