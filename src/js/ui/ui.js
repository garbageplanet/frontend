/*jslint browser: true, white: true, sloppy: true, maxerr: 1000*/

/**
* User interfaces that don't happen directly on the map
*/
var ui = (function() {
  
    var templates = {
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
                {short:"wood",long:"Recomposed wood"},
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
                {short:"commercial",long:"Commercial fishing gears"},
                {short:"net",long:"Fishing net"},
                {short:"lines",long:"Fishing line"},
                {short:"boat",long:"Small boat"},
                {short:"vessel",long:"Large boat or wreck"},
                {short:"boating",long:"Boating equipment"},
                {short:"buoy",long:"Buoys and floats"},
                {short:"maritime",long:"Maritime equipment"},
                {short:"sew",long:"Sewage"},
                {short:"dogs",long:"Dog poop bags"},
                {short:"stormwater",long:"Polluted stormwaters"},
            ],
            credits: [
                {
                    "title":"homepage",
                    "linkurl":"http://home.garbagepla.net/",
                    "text":"Project"
                },
                /*{
                    "title":"Let's Encrypt",
                    "linkurl":"https://letsencrypt.org/",
                    "text":"Secured with"
                },*/
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
                    "title":"Imgur",
                    "linkurl":"https://imgur.com",
                    "text":"Image storage courtesy of"
                },
                {
                    "title":"Github",
                    "linkurl":"https://github.com/garbageplanet",
                    "text":"Source code available on"
                },
                {
                  "title": "privacy policy",
                  "linkurl": "#privacy-policy",
                  "text": "Read our",
                  "extraclass": "sidebar-link"
                }
        ],
            version: '0.5.0'
    },
        sidebar = L.control.sidebar('sidebar', {position: 'right', closebutton: 'true'}),
        bottombar = L.control.sidebar('bottombar', {position: 'bottom', closebutton: 'true'}),
        pushDataToBottomPanel = function(obj) {

            // TODO get the leaflet_id of current marker as well
            console.log("pushed data to bottom panel");

            // load the data from the options of the object
            var feature = obj,
                featuredata = obj.options,
                featureinfo;

            // if the data is passed from a server JSON response (attend, confirm, join) the actual data is in the direct object
            if (!featuredata) {
                featuredata = obj;
            }

            // Fill the template data
            document.getElementById('bottombar').innerHTML = tmpl('tmpl-feature-info', featuredata);

            // Set the vars after loading the template
            featureinfo = $('#feature-info');

            // TODO use bottombar.getContent() in conjunction with template creation above
            ui.bottombar.show(featureinfo.fadeIn());

            // Add an IMGUR api character to the url to fetch thumbnails only
            if (featuredata.image_url) {

                var image_url_insert = tools.insertString(featuredata.image_url, 26, 'b');
                featureinfo.find('.feature-image').attr('src', image_url_insert);
            }

            // Create the templateData.social data dynamically before calling the template
            // TODO only call these once share button is clicked
            social.shareThisFeature(featuredata);
            document.getElementById('social-links').innerHTML = tmpl("tmpl-social-links", social.network);

            // Event listener for share button and social links
            $('.btn-social, fa-share-alt').popover({
                trigger: 'focus',
                html : true, 
                container: 'body',
                placement: function(pop) {
                    if (window.isMobile) {
                        return 'top';
                    } else {
                        return 'right';
                    }
                },
                content: function() {
                    return $('#social-links').html();
                },
                template: '<div class="popover popover-share" role="tooltip"><div class="popover-content popover-share"></div></div>'
            });

            // Event listener for actions buttons (edit, cleaned join, confirm, play)
            $('.btn-feature').on('click', function(e) {

                var ct = e.target.className;
                console.log(ct);

                if (ct.match(/(cleaned|check)/)) {
                    actions.cleanedGarbage(featuredata);
                    return;
                }
                if (ct.match(/(confirm|binoculars)/)) {
                    actions.confirmGarbage(featuredata);
                    return;
                }
                if (ct.match(/(group|attend)/)) {
                    actions.attendCleaning(featuredata);
                    return;
                }
                if(ct.match(/(join|play)/)) {
                    actions.joinGame(featuredata);
                    return;
                }
                if (ct.match(/(times|delete)/)) {
                    // Pass the full leaflet object to delete method
                    actions.deleteFeature(feature);
                    return;
                }
                if (ct.match(/(pencil|edit)/)) {
                    if (localStorage.getItem('token')) {

                        actions.editFeature(featuredata);
                        return;

                    } else {
                        alerts.showAlert(3, "warning", 2000);
                        return;
                    }
                }
                else return;
            });
        },
        makeModal = function(type, arr) {

            console.log('type of modal: ', type);
            console.log('value of array: ', arr);

            var template,
                typeobj,
                modaltmplname,
                modaltableid,
                modaltablebodyid,
                modalid,
                modalbodyid,
                datatableoptions = {
                    lengthMenu:     [[5, 10, 20, -1], [5, 10, 20, "All"]],
                    scrollY:        '50vh',
                    scrollCollapse: true,
                    paging:         false,
                    retrieve:       true
                };
            var modalid          = 'modal-'      + type,
                modaltmplname    = 'tmpl-modal-' + type,
                modaltableid     = '#modal-'     + type + '-table',
                modaltablebodyid = 'modal-'      + type + '-table-body';

            // Build an object to pass to the templating engine
            var typeobj = {};
            typeobj[type] = type;

            // Make the modal skeleton inside of which we'll load the templates
            template = '<div id="' + modalid + '" class="modal" role="dialog"></div>';
            $('body').append(template);

            // Handle what happens for the Open Graph scraper or if no data is passed
            if (!arr) {
                if (type.indexOf('og') > -1 ) {
                    document.getElementById(modalid).innerHTML = tmpl('tmpl-modal', typeobj);              
                    $('#' + modalid).modal('show');
                    $('#' + modalid).find('input').focus();
                }

                $('.btn-og-scrap').click(function() {
                    // Retrieve the value of the url
                    // TODO validate url
                    // $(this).siblings('button').html('Loading...');
                    var url = $('#modal-og').find('input').val();
                    var ogdata = tools.ogDotIoScraper(url);
                    // TODO do something with ogdata?
                });

                $('#modal-og-submit').on('click', function(e) {

                    forms.makeForm(null, 'og');

                });
                return;
            }

            // if it's a data modal check that the array contains data else warn user
            if (arr) {
                if (arr.length < 1 && (type != 'game' || type != 'og')) {
                    alerts.showAlert(29, "warning", 2000);
                    return;
                }
                else {
                    // Fill the template skeleton and the data
                    document.getElementById(modalid).innerHTML = tmpl('tmpl-modal', typeobj);              
                    document.getElementById(modaltablebodyid).innerHTML = tmpl(modaltmplname, arr);
                    // Activate the datatables
                    $(modaltableid).DataTable(datatableoptions);

                    // Show the modal
                    $('#' + modalid).modal('show');   

                    // Attach events for buttons
                    $('#modal-data-load-more').on('click', function() {
                        maps.map.setZoom(maps.map.getZoom() - 1);
                        $('.modal-data-row').empty();
                        // TODO use the api to add row dymagically
                        document.getElementById(modaltablebodyid).innerHTML = tmpl(modaltmplname, arr);
                        $(modaltableid).DataTable(datatableoptions);
                    });

                    $('#modal-download').on('click', function(e) {
                        e.preventDefault;
                        var stringdata = "text/json;charset=utf-8," + JSON.stringify(arr);
                        this.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(stringdata));            
                    });
                }
            }
        },    
        _activateMobileUi = function() {

            var mobiledialog = $('#mobile-menu-dialog'),
                // swiperight = $(".swipe-area-right"),
                // swipeleft = $(".swipe-area-left"),
                // swipetop = $(".swipe-area-top"),
                topbar = $('#topbar'),
                sidebarcontainer = $('#sidebar'),
                bottombarcontainer = $('#bottombar'),
                selects = $('.garbage-type-select, .litter-type-select');

            // TODO append elements if mobile instead of removing if not mobile
            if (!window.isMobile) {
                $('#mobile-menu-dialog').remove();
            }

            if (window.isMobile) {
                // Remove menu bar div
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
        _bindEvents = function() {

            var sidebarlink = $('.sidebar-link'),
                menubacklink = $('.menu-backlink'),
                usertools = $('#user-tools'),
                trashbinbutton = $('#btn-trashbins'),
                modallink = $('.modal-link'),
                // panelcollapse = $('.panel-collapse'),
                sidebarcontent = $('.sidebar-content');

            // SIDEBAR ////////////////////////////////////////////////////
            // Navigation for sidebar links
            // TODO actual routing
            // FIXME listeners not set when generating forms from templates
            $('.sidebar-link').click(function(e) {

                e.preventDefault();

                if(!ui.sidebar.isVisible()) {
                    ui.sidebar.show();
                }

                $(this.hash).fadeIn().siblings().hide();
                $('#sidebar').scrollTop = 0;
            });

            // Go back to the marker creation menu link
            menubacklink.click(function(e) {
                e.preventDefault();
                // panelcollapse.collapse('hide');
                $('#sidebar').scrollTop = 0;
                $(this.hash).fadeIn().siblings().hide();
                return;
            });

            // Empty the sidebar on hide, reset accordion and reset scroll
             ui.sidebar.on('hide', function() {

                $('.sidebar-content').hide();
                // $('.sidebar-container', '.sidebar-content').scrollTop = 0;
                // $('form').each(function() {this.reset();});
                // $('input').val('');
                // $('.selectpicker').selectpicker('render');
                $('.tab-default').tab('show');
                $('.leaflet-draw-edit-edit').removeClass('visible');
                $('.leaflet-draw-edit-remove').removeClass('visible');
                // FIXME this removes the placeholder as well ?
                // $('.bootstrap-tagsinput').tagsinput('removeAll');
               
                // Delete any feature form from the DOM
                $('.form-feature').remove();
               
                // Remove any unsaved marker on mobile else the mobile menu bugs
                if (window.isMobile) {
                    // Reset siebar close button visibility
                    if ($('.close-panel').hasClass('hidden')) {
                      $('.close-panel').removeClass('hidden');
                    }
                    maps.unsavedMarkersLayerGroup.clearLayers();
                }
            });

            ui.sidebar.on('show', function() {
                if (ui.bottombar.isVisible()) {
                    ui.bottombar.hide();
                }
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
            trashbinbutton.on('click', function() {
                if(maps.map.getZoom() < 15 ) {

                    alerts.showAlert(31, 'info', 2000);
                    return;

                } else {
                    maps.trashBins();
                }
            });

            // BOTTOMBAR //////////////////////////////////////////////////////////////////
            // Events to execute when the bottombar is hidden
            ui.bottombar.on('hide', function(e) {
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

            // Set the event listeners for modals in the topbar or elsewhere
            modallink.on('click', function(e) {

                e.preventDefault();

                if ($(this).hasClass('modal-list-garbage')) {
                    // Passing the garbage array in the current screen to the function
                    ui.makeModal('garbage', features.garbageArray());
                } 

                if ($(this).hasClass('modal-list-cleaning')) {
                    ui.makeModal('cleaning', features.cleaningArray());
                }

                if ($(this).hasClass('modal-link-og')) {
                    console.log('OG clicked');
                    ui.makeModal('og', null);
                }

                if ($(this).hasClass('btn-join-game')) {
                    ui.makeModal('game', null);
                }
            });

            // Destroy modals upon hiding them
            $('.modal').on('hidden.bs.modal', function() {
                $(body).find('.modal').remove();
            });

        },
        init = function() {

            // Add the Leaflet UI controls to the map
            sidebar.addTo(maps.map);
            bottombar.addTo(maps.map);
          
            // Fill the main topbar and sidebar template
            if (!window.isMobile) {
                document.getElementById('topbar').innerHTML = tmpl('tmpl-topbar-main', templates);
            }
            document.getElementById('sidebar').innerHTML = tmpl('tmpl-sidebar-main', templates);
            document.getElementById('credits').innerHTML = tmpl('tmpl-credits', templates.credits);
          
            // Check what ui to show
            if (window.isMobile) {
                _activateMobileUi();
            }
            // custom alerts at startup for cookies
            alerts.showAlert(32, 'warning', 5000);

            _bindEvents();
       };
    
    return {
        init: init,
        sidebar: sidebar,
        templates: templates,
        bottombar: bottombar,
        pushDataToBottomPanel: pushDataToBottomPanel,
        makeModal: makeModal,
    };    
}());
ui.init();