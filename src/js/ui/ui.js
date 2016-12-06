/*jslint browser: true, white: true, sloppy: true, maxerr: 1000*/

/**
* User interface that don't happen directly on the map
*/
var ui = (function(){
    
    var templates  = {
            garbagetypes: [
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
                {short:"dogs",long:"Dog poop bags"},
            ],
            credits: [
                {
                    "title":"homepage",
                    "linkurl":"http://home.garbagepla.net/",
                    "text":"Project"
                },
                {
                    "title":"Let's Encrypt",
                    "linkurl":"https://letsencrypt.org/",
                    "text":"Secured with"
                },
                {
                    "title":"Mapbox",
                    "linkurl":"https://www.mapbox.com/",
                    "text":"Basemaps imagery ©"
                },
                {
                    "title":"Openstreetmap and contributors",
                    "linkurl":"http://www.openstreetmap.org/",
                    "text":"Maps and underlying data ©"
                },
                {
                    "title":"Overpass API",
                    "linkurl":"http://www.overpass-api.de/",
                    "text":"POIs retrieved using the"
                },
                {
                    "title":"OpenCage Geocoder",
                    "linkurl":"https://geocoder.opencagedata.com/",
                    "text":"Address search and geocoding using"
                },
                {
                    "title":"Leaflet 1.0",
                    "linkurl":"https://leafletjs.com/",
                    "text":"Mapping done with "
                },
                {
                    "title":"FontAwesome",
                    "linkurl":"http://fontawesome.io/",
                    "text":"Icons by"
                },
                {
                    "title":"Bootstrap 3",
                    "linkurl":"http://getbootstrap.com/",
                    "text":"Built with"
                },
                {
                    "title":"JQuery",
                    "linkurl":"https://jquery.com/",
                    "text":"Runs on"
                },
                {
                    "title":"Laravel 5.1",
                    "linkurl":"https://laravel.com/",
                    "text":"Backed by"
                },
                {
                    "title":"JavaScript-Templates",
                    "linkurl":"https://github.com/blueimp/JavaScript-Templates",
                    "text":"Templating with"
                },
                {
                    "title":"Github",
                    "linkurl":"https://github.com/garbageplanet",
                    "text":"Source code available on"
                }
            ],
        },
        sidebar = L.control.sidebar('sidebar', {position: 'right', closebutton: 'true'}),
        bottombar = L.control.sidebar('bottombar', {position: 'bottom', closebutton: 'true'}),
        pushDataToBottomPanel = function (obj){
            
            console.log("pushed data to bottom panel");
            
            // load the data from the options of the object
            var feature = obj,
                featuredata = obj.options;
            

            // if the data is passed from a server JSON response (attend, confirm ...) the actual data is in the direct object
            if (!featuredata) {
                featuredata = obj;
            }

            // Fill the template data
            document.getElementById('bottombar-content-container').innerHTML = tmpl('tmpl-feature-info', featuredata);

            // Create the templateData.social data dynamically before calling the template
            // The function shareThisFeature() is in the file /social/share.js
            social.shareThisFeature(featuredata);
            document.getElementById('social-links').innerHTML = tmpl("tmpl-social-links", social.network);

            // TODO use bottombar.getContent() in conjunction with template creation above
            ui.bottombar.show($('#feature-info').fadeIn());

            // Add an IMGUR api character to the url to fetch thumbnails to save bandwidth
            if (featuredata.image_url) {

                var image_url_insert = tools.insertString(featuredata.image_url, 26, 'b');
                $('#feature-info').find('.feature-image').attr('src', image_url_insert);
            }
            // Event listener for actions buttons (edit, cleaned join, confirm, play)
            // the functions called down here are inside the file /map/features_actions.js
            // TODO make on event listener and then dispatch, modify bottom bar template
            $('#feature-info').find('.btn-edit').on('click', function() {

                if (localStorage.getItem('token')) {

                    actions.editFeature(featuredata);

                } else {
                    alerts.showAlert(3, "warning", 2000);
                }
            });
            $('#feature-info').find('.btn-cleaned').on('click', function() {actions.cleanedGarbage(featuredata);});
            $('#feature-info').find('.btn-confirm-garbage').on('click', function() {actions.confirmGarbage(featuredata);});
            $('#feature-info').find('.btn-attend-cleaning').on('click', function() {actions.attendCleaning(featuredata);});
            $('#feature-info').find('.btn-participate-game').on('click', function() {actions.participateGame(featuredata);});

            // Event listener for share button and social links
            $('.btn-social').popover({
                html : true, 
                container: 'body',
                placement: function(pop){if (window.innerWidth < 560) {return 'top';} else {return 'right';}},
                content: function() {return $('#social-links').html();},
                template: '<div class="popover popover-share" role="tooltip"><div class="popover-content popover-share"></div></div>'
            });
            // Event listener to look at the game results
            // TODO if user_id isn't in result list, prevent action
            /* $('.game-results-modal-link').on('click', function () {

                var user_id = localStorage.getItem['userid'],
                    // TODO, query the api with credentials to generate the list of users for this game tile by retrieving the data with the tile's title
                    // the function called is in /social/game.js
                    game_list = game.getPlayers(featuredata.title);

                if (user_id in game_list) {
                    // call to the game api, check that user making request is in the list on the server
                    // build the results object (gamedata) and fill the template
                    var gameResults = tmpl('tmpl-game-results', gamedata);

                    $('body').append(gameResults);
                }

                else {

                    alerts.showAlert(8, "warning", 2000);
                    return;
                }
            });*/

            // Event listener for delete button
            $('#feature-info').find('.btn-delete').on('click', function (e) {
                e.preventDefault();
                // Pass the full leaflet object to delete method
                actions.deleteFeature(feature);
            });
        },
        makeModal = function(type, arr) {
        
            var template, 
                modaltmplclass, 
                modaltableclass, 
                modaltablebodyclass;

            console.log("array data: ", arr);

            if (typeof arr !== 'undefined' && arr.length > 0) {

                if (type == 'garbage') {
                    template = '<div id="modal-data" class="modal" role="dialog"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close pull-right" data-dismiss="modal"><span class="fa fa-fw fa-times"></span></button><h4 class="modal-title">View and download data from garbagepla.net</h4></div><div class="modal-body"><table id="modal-garbage-table" class="table-striped table-condensed"><thead><tr><th>Feature id</th><th>Coordinates</th><th>Amount</th><th>Garbage types</th></tr></thead><tbody id="modal-garbage-table-body"></tbody></table></div><div class="modal-footer"><a class="disabled pull-left" href="#">Get the full data</a><form><button type="button" data-dismiss="modal" class="btn btn-danger pull-right ">Close</button><button id="modal-data-load-more" type="button" class="btn btn-default pull-right ">Zoom out and load more</button><a id="modal-download" href="" target="_blank" data-download="data.txt" type="button" class="btn btn-default pull-right">Download</a></form></div></div></div></div>';
                }

                if (type == 'cleaning') {
                    template = '<div id="modal-calendar" class="modal" role="dialog"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close pull-right" data-dismiss="modal"><span class="fa fa-fw fa-times"></span></button><h4 class="modal-title">Cleaning events calendar</h4></div><div class="modal-body"><table id="modal-calendar-table" class="table-striped table-condensed"><thead><tr><th>Event id</th><th>Date</th><th>Coordinates</th><th>Address</th></tr></thead><tbody id="modal-calendar-table-body"></tbody></table></div><div class="modal-footer"><form><button type="button" data-dismiss="modal" class="btn btn-danger pull-right ">Close</button><button id="modal-calendar-load-more" type="button" class="btn btn-default pull-right ">Zoom out and load more</button><a id="modal-download" href="" target="_blank" data-download="data.txt" type="button" class="btn btn-default pull-right">Download</a></form></div></div></div></div>';
                }

                if (type == 'game') {
                    template = '<div id="modal-calendar" class="modal" role="dialog"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close pull-right" data-dismiss="modal"><span class="fa fa-fw fa-times"></span></button><h4 class="modal-title">Cleaning events calendar</h4></div><div class="modal-body"><table id="modal-calendar-table" class="table-striped table-condensed"><thead><tr><th>Event id</th><th>Date</th><th>Coordinates</th><th>Address</th></tr></thead><tbody id="modal-calendar-table-body"></tbody></table></div><div class="modal-footer"><form><button type="button" data-dismiss="modal" class="btn btn-danger pull-right ">Close</button><button id="modal-calendar-load-more" type="button" class="btn btn-default pull-right ">Zoom out and load more</button><a id="modal-download" href="" target="_blank" data-download="data.txt" type="button" class="btn btn-default pull-right">Download</a></form></div></div></div></div>';
                }

                modaltmplclass      = 'tmpl-modal-' + type;
                modaltableclass     = 'modal-'      + type + '-table';
                modaltablebodyclass = 'modal-'      + type + '-table-body';

                console.log(modaltablebodyclass);

                $('body').append(template);
                document.getElementById(modaltablebodyclass).innerHTML = tmpl(modaltmplclass, arr);
                $("#modal-data").modal('show');
                $(modaltableclass).DataTable();

                $('#modal-data-load-more').on('click', function () {
                    maps.map.setZoom(maps.map.getZoom() - 1);
                    $('.modal-data-row').empty();
                    // TODO reload the template with the new data after data has changed
                    document.getElementById(modaltablebodyclass).innerHTML = tmpl(modaltmplclass, arr);
                });

                $('#modal-download').on('click', function (e) {
                    console.log("DOWNLOAD BUTTON LCICKED");
                    e.preventDefault;
                    var stringdata = "text/json;charset=utf-8," + JSON.stringify(arr);
                    this.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(stringdata));            
                });

            } else {
                alerts.showAlert(29, "warning", 2000)
            }
        },    
        checkMobile = function() {
            
            var mobiledialog = $('#mobile-menu-dialog'),
                // swiperight = $(".swipe-area-right"),
                // swipeleft = $(".swipe-area-left"),
                // swipetop = $(".swipe-area-top"),
                topbar = $('#topbar'),
                sidebarcontainer = $('#sidebar'),
                bottombarcontainer = $('#bottombar'),
                selects = $('.garbage-type-select, .litter-type-select');
            
            // TODO append elements if mobile instead of removing if not mobile
            if (window.innerWidth >= 768) {
                $('#mobile-menu-dialog').remove();
            }

            if (window.innerWidth < 768) {
                // Remove menu bar
                topbar.remove();
                // Delete the zoom keys from map
                maps.map.removeControl(maps.zoomcontrol);
                // Add swipe areas
                $('body').append('<div class="swipe-area swipe-area-right"></div>');
                sidebarcontainer.append('<div class="swipe-area swipe-area-left"></div>');
                bottombarcontainer.prepend('<div class="swipe-area swipe-area-top"></div>');
                // Remove the search field from multiselect else the softkeyboard shows up on mobile
                selects.attr('data-live-search', 'false');
                // Activate swipe on the right border to show the mobile menu
                $(".swipe-area-right").touchwipe({

                    wipeLeft: function() {
                        sidebar.show($('#mobile-menu-dialog').show());
                  },
                    min_move_x: 15,
                    preventDefaultEvents: true
                });

                // Hide the sidebar on right swipe from the left border
                $(".swipe-area-left").touchwipe({

                    wipeRight: function() {
                        sidebar.hide();
                    },
                    min_move_x: 15,
                    preventDefaultEvents: true
                });

                // Hide the bottombar on down swipe
                // For apple stuff
                if (L.Browser.retina) {
                    
                    $(".swipe-area-top").touchwipe({
                        
                        wipeDown: function() {
                            bottombar.hide();
                        },
                        min_move_y: 20,
                        preventDefaultEvents: true
                    });
                }
                // For all other browsers
                if (!L.Browser.retina) {  
                    
                    $(".swipe-area-top").touchwipe({
                        
                        wipeUp: function() {
                            bottombar.hide();
                        },
                        min_move_y: 20,
                        preventDefaultEvents: true
                    });
                }
            }
        },
        activate = function() {
            
            // Add the Leaflet UI controls to the map
            this.sidebar.addTo(maps.map);
            this.bottombar.addTo(maps.map);
            // Fill the main sidebar template
            document.getElementById('sidebar').innerHTML = tmpl('tmpl-sidebar-main', templates);
            // Fill the credits

            // Fill the multiselect templates in the forms
            document.getElementById('garbage-select').innerHTML = tmpl('tmpl-form-garbage-type', templates.garbagetypes);
            document.getElementById('litter-select').innerHTML = tmpl('tmpl-form-garbage-type', templates.garbagetypes);
            document.getElementById('credits').innerHTML = tmpl('tmpl-credits', templates.credits);
            // check what ui to show
            ui.checkMobile();
        },
        bindEvents = $(function() {
            
            var sidebarlink = $('.sidebar-link'),
                menubacklink = $('.menu-backlink'),
                usertools = $('#user-tools'),
                trashbinbutton = $('#btn-trashbins'),
                modallink = $('.modal-link');
                
            // SIDEBAR ////////////////////////////////////////////////////
            // Navigation for sidebar links
            sidebarlink.click(function(e) {
                e.preventDefault();
                $(this.hash).fadeIn().siblings().hide();
                $('#sidebar').scrollTop = 0;
            });

            // Go back to the marker creation menu link
            menubacklink.click(function(e) {
                e.preventDefault();
                $('.panel-collapse').collapse('hide');
                $('#sidebar').scrollTop = 0;
                $(this.hash).fadeIn().siblings().hide();
            });

            // Empty the sidebar on hide, reset accordion and reset scroll
             ui.sidebar.on('hide', function () {

                $('.sidebar-content').hide();
                $('.sidebar-container', '.sidebar-content').scrollTop = 0;
                $('form').each(function() {this.reset();});
                $('input').val('');
                $('.selectpicker').selectpicker('render');
                $('.tab-default').tab('show');
                $('.leaflet-draw-edit-edit').removeClass('visible');
                $('.leaflet-draw-edit-remove').removeClass('visible');
                // TODO clear the tagsinput
                // $('.bootstrap-tagsinput').tagsinput(''); 
            });


            // TOPBAR //////////////////////////////////////////////////////
            // Activate dropdown menu links in topbar
            usertools.on('click', 'a', function(e) {

                if ($(this).hasClass('dropdown-link')) {
                    e.preventDefault();
                    ui.bottombar.hide();
                    ui.sidebar.show();
                    $(this.hash).fadeIn().siblings().hide();
                }
            });

            // Show nearby trashbins
            trashbinbutton.on('click', function(){
                if(maps.map.getZoom() < 15 ) {
                    
                    alerts.showAlert(31, 'info', 2000);
                    return;
                    
                } else {
                    maps.trashBins();
                }
            });

            // BOTTOMBAR //////////////////////////////////////////////////////////////////
            // Events to execute when the bottombar is hidden
            ui.bottombar.on('hide', function (e) {
                // force destroy the popup which hangs on certain tablets (tested on samsung w/ android) 
                $('.btn-social').popover('destroy');
                // reset any modals that was created
                $('.modal').modal('hide').data('bs.modal', null);
            });
            
            // Events to execute when the bottombat is shown
            // FIXME, need to use tools.checkOpenUiElement()
            ui.bottombar.on('show', function() {
                
                // hide the sidebar if it's visible
                if (ui.sidebar.isVisible()) {
                    ui.sidebar.hide();
                }
                
                if ($('.leaflet-control-ocd-search').hasClass('leaflet-control-ocd-search-expanded')) {
                    maps.geocodercontrol._collapse();
                }
            });

            // Set the event listeners for modal
            modallink.on('click', function(e){

                console.log("this from modal links clicked", this)

                if ($(this).hasClass('modal-list-garbage')){
                    // Passing the garbage array in the current screen to the function
                    makeModal('garbage', features.garbageArray());
                } 

                if ($(this).hasClass('modal-list-cleaning')) {
                    makeModal('cleaning', features.cleaningArray());
                }

            });

        });
    
    return {
        init: activate,
        sidebar: sidebar,
        templates: templates,
        bottombar: bottombar,
        pushDataToBottomPanel: pushDataToBottomPanel,
        makeModal: makeModal,
        checkMobile: checkMobile,
    };
    
}());

ui.init();