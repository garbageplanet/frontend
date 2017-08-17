/* jslint browser: true, white: true, sloppy: true, maxerr: 1000 */
/* global $, L, maps */

/**
* User interfaces that don't happen directly on the map
*/

var ui = ( function () {

    // 'use strict';

    // TODO move versioning to package.json and add during build

    var templates = {
            garbagetypes: [
                {short:"plastic",long:"Plastic items"},
                {short:"bags",long:"Plastic bags"},
                {short:"foodpacks",long:"Plastic food containers"},
                {short:"pet",long:"PET bottles"},
                {short:"party",long:"Party leftovers"},
                {short:"poly",long:"Expanded plastic polymers"},
                {short:"butts",long:"Cigarette butts"},
                {short:"toys",long:"Kids beach toys"},
                {short:"syringe",long:"Syringes and needles"},
                {short:"glassbroken",long:"Broken glass"},
                {short:"glass",long:"Glass"},
                {short:"bottles",long:"Glass bottles"},
                {short:"metal",long:"Metal"},
                {short:"fastfood",long:"Fastfood garbage"},
                {short:"tin",long:"Tin cans"},
                {short:"alu",long:"Aluminium cans"},
                {short:"wood",long:"Recomposed wood"},
                {short:"chemicals",long:"Chemicals"},
                {short:"canister",long:"Oil canister"},
                {short:"barrel",long:"Barrel"},
                {short:"household",long:"Household garbage"},
                {short:"clothes",long:"Shoes and clothes"},
                {short:"fabric",long:"Carpets and fabrics"},
                {short:"matress",long:"Matresses"},
                {short:"tarp",long:"Tarps and other large covers"},
                {short:"electronic",long:"Electronics"},
                {short:"electric",long:"Electric appliances"},
                {short:"battery", long:"Batteries"},
                {short:"industrial",long:"Industrial wastes"},
                {short:"construction",long:"Construction wastes"},
                {short:"gas",long:"Gasoline and petroleum oil"},
                {short:"crude",long:"Crude oil"},
                {short:"vehicle",long:"Large vehicle"},
                {short:"bicycle",long:"Bicycles"},
                {short:"motorcyle",long:"Motorcycles"},
                {short:"tyres",long:"Tyres"},
                {short:"engine",long:"Engine parts"},
                {short:"vehicleparts",long:"Vehicles parts"},
                {short:"fishing",long:"Fishing gears"},
                {short:"commercial",long:"Commercial fishing gears"},
                {short:"net",long:"Fishing net"},
                {short:"lines",long:"Fishing line"},
                {short:"boat",long:"Small boat"},
                {short:"vessel",long:"Large boat or wreck"},
                {short:"boating",long:"Boating equipment"},
                {short:"buoy",long:"Buoys and floats"},
                {short:"navigation",long:"Navigation aid buoy"},
                {short:"pontoon",long:"Pontoon"},
                {short:"maritime",long:"Maritime equipment"},
                {short:"sewage",long:"Sewage"},
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
                    "title":"Leaflet",
                    "linkurl":"https://leafletjs.com/",
                    "text":"Mapping done with "
                },
                {
                    "title":"FontAwesome",
                    "linkurl":"http://fontawesome.io/",
                    "text":"Icons by"
                },
                {
                    "title":"Bootstrap",
                    "linkurl":"http://getbootstrap.com/",
                    "text":"Built with"
                },
                {
                    "title":"JQuery",
                    "linkurl":"https://jquery.com/",
                    "text":"Runs on"
                },
                {
                    "title":"Laravel",
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
            version: '0.5.65'
        },
        sidebar = L.control.sidebar('sidebar', {position: 'right', closebutton: 'true'}),
        bottombar = L.control.sidebar('bottombar', {position: 'bottom', closebutton: 'true'}),
        pushDataToBottomPanel = function pushDataToBottomPanel (obj) {

            // TODO get the leaflet_id of current marker as well
            console.log("pushed data to bottom panel");

            // load the data from the options of the object
            var feature = obj,
                featuredata = obj.options,
                featureinfo;

            // if the data is passed from a server JSON response (attend, confirm, join) the actual data is in the obj var
            if ( !featuredata ) {
                featuredata = obj;
            }

            console.log('feature obj from pushDataToBottomPanel()',feature);
            console.log('feature data from pushDataToBottomPanel()',featuredata);

            // Fill the template data
            document.getElementById('bottombar').innerHTML = tmpl('tmpl-feature-info', featuredata);
            // Set the vars after loading the template
            featureinfo = $('#feature-info');

            // TODO use bottombar.getContent() in conjunction with template creation above
            ui.bottombar.show(featureinfo.fadeIn());

            // Add an imgur api character to the url to fetch thumbnails only and change the link to https
            if ( featuredata.image_url ) {

                var img_api_char = tools.insertString(featuredata.image_url, 26, 'b');
                var img_https = tools.insertString(img_api_char, 4, 's');
                featureinfo.find('.feature-image').attr('src', img_https);
            }

            // if there's a datetime field it's a cleaning event, we fetch the address from the reverse geocoder
            if ( featuredata.datetime ) {

                console.log('calling reverse geocoder');

                $.when(tools.reverseGeocode(featuredata.latlng)).then(function (data) {
                    console.log('data from Promise resolved:', data.results[0].formatted);
                    featureinfo.find('.feature-info-location').html(data.results[0].formatted);
                });
            }

            // Create the templateData.social data dynamically before calling the template
            social.shareThisFeature(featuredata);
            // document.getElementById('social-links').innerHTML = tmpl("tmpl-social-links", social.network);
            _bindBottombarFeatureEvents(feature);
        },
        makeModal = function makeModal (type, arr) {
            // TODO extract function to make the datatable
            // TODO extract event listeners
            console.log('type of modal: ', type);
            console.log('data for table: ', arr);

            var template,
                typeobj,
                modaltmplname,
                modaltableid,
                modaltablebodyid,
                modalid,
                modalbodyid;

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

            // If there's no data passed to the function, we're making a modal for scraping an url
            // handle what happens for the Open Graph scraper
            // TODO move this to the sidebar
            if ( !arr ) {
                if ( type.indexOf('opengraph') > -1 ) {

                    document.getElementById(modalid).innerHTML = tmpl('tmpl-modal', typeobj);

                    $('#' + modalid).modal('show');
                    $('#' + modalid).find('input').focus();
                }
                // Bind the action to launch the scraper
                $('.btn-opengraph-fetch').click( function () {

                    // Retrieve the value of the url
                    var url = $('#opengraph-url').val();

                    $('.btn-opengraph-fetch').text('...');
                    $('.btn-opengraph-fetch').attr('disabled', 'disabled');

                    // Start the scraper promise
                    $.when( tools.openGraphScraper(url) ).then( function (data) {

                        console.log('data from openGraph Promise resolved:', data);

                        // Load the data into the template
                        var ogcontent = document.getElementById('opengraph-content').innerHTML = tmpl('tmpl-modal-opengraph', data);
                        // Remove input styles
                        $('#opengraph-content input, #opengraph-content textarea').css('border','none').css('background','transparent').css('box-shadow', 'none');
                        // TODO allow saving only if request return meaningful data
                        $('.btn-save-opengraph').removeClass('hidden');
                        // Replace button text and disable nutil request has finished
                        $('.btn-opengraph-fetch').text('Fetch');
                        $('.btn-opengraph-fetch').removeAttr('disabled');
                    }).catch( function () {
                        // If the promise returns any error reset the form field
                        $('.btn-opengraph-fetch').text('Fetch');
                        $('.btn-opengraph-fetch').removeAttr('disabled');
                    });
                });
            }

            // if it's a data modal check that the array contains data else warn user
            if ( arr ) {
                if ( arr.length < 1 && ( type != 'game' || type != 'opengraph' ) ) {
                    alerts.showAlert(29, 'warning', 2000);
                    return;
                }
                else {

                   var datatableoptions = {  lengthMenu:     [[5, 10, 20, -1], [5, 10, 20, "All"]],
                                             scrollY:        '50vh',
                                             scrollCollapse: true,
                                             paging:         false,
                                             retrieve:       true,
                                             bFilter:        false };

                    // Fill the template skeleton and the data
                    document.getElementById(modalid).innerHTML = tmpl('tmpl-modal', typeobj);
                    document.getElementById(modaltablebodyid).innerHTML = tmpl(modaltmplname, arr);

                    // Activate the datatables in the modal
                    $(modaltableid).DataTable(datatableoptions);

                    // Show the modal
                    $('#' + modalid).modal('show');

                    // Force sort the columns to fix thead width bug
                    $(modaltableid).DataTable().order([0, 'desc']).draw();

                    // Attach events for buttons
                    $('#modal-data-load-more').on('click', function () {

                        maps.map.setZoom(tools.currentZoom - 1);

                        $('.modal-data-row').empty();

                        var newmarkers = tools.listMarkersInView(type);

                        document.getElementById(modaltablebodyid).innerHTML = tmpl(modaltmplname, newmarkers);
                        $(modaltableid).DataTable(datatableoptions);
                    });

                    $('#data-download').on('click', function (e) {

                        // FIXME event listener worksonly once?
                        e.preventDefault;
                        tools.downloadDataAsJSON(arr);

                    });
                }
            }
        },
        _bindSidebarEvents = function _bindSidebarEvents () {
            // Navigation for sidebar links
            $('.sidebar-link').click(function (e) {

                e.preventDefault();

                if( !ui.sidebar.isVisible() ) {
                    ui.sidebar.show();
                }

                $(this.hash).fadeIn().siblings().hide();
                $('#sidebar').scrollTop = 0;
            });

            // Empty the sidebar on hide, reset accordion and reset scroll
            ui.sidebar.on('hide', function () {

                // $('.tab-default').tab('show');
                $('.sidebar-content').hide();
                // $('.sidebar-container', '.sidebar-content').scrollTop = 0;
                // $('form').each(function() {this.reset();});
                // $('input').val('');
                // $('.selectpicker').selectpicker('render');

                $('.leaflet-draw-edit-edit').removeClass('visible');
                $('.leaflet-draw-edit-remove').removeClass('visible');
                // FIXME this removes the placeholder as well ?
                // $('.bootstrap-tagsinput').tagsinput('removeAll');

                // Delete any feature form from the DOM
                $('.form-feature').remove();

                // Remove any unsaved marker on mobile else the mobile menu bugs
                if ( window.isMobile ) {
                    // Reset sidebar close button visibility
                    if ($('.close-right').hasClass('hidden')) {
                      $('.close-right').removeClass('hidden');
                    }
                    maps.unsavedMarkersLayerGroup.clearLayers();
                }
            });

            ui.sidebar.on('show', function () {
                if ( ui.bottombar.isVisible() ) {
                    ui.bottombar.hide();
                }
            });
        },
        _bindBottombarEvents = function _bindBottombarEvents () {

            // Events to execute when the bottombar is hidden
            ui.bottombar.on('hide', function () {
                // force destroy the popup which hangs on certain tablets (tested on samsung w/ android)
                $('.btn-social').popover('destroy');
                // reset any modals that was created
                $('.modal').modal('hide').data('bs.modal', null);
                // empty any content
                $('#feature-info').empty();
            });

            // Events to execute when the bottombat is shown
            // FIXME, need to use tools.checkOpenUiElement()
            ui.bottombar.on('show', function () {

                // hide the sidebar if it's visible
                if ( ui.sidebar.isVisible() ) {
                    ui.sidebar.hide();
                }

                if ( $('.leaflet-control-ocd-search').hasClass('leaflet-control-ocd-search-expanded') ) {
                    maps.geocodercontrol._collapse();
                }
            });

            // Destroy modals upon hiding them
            $('.modal').on('hidden.bs.modal', function () {
                $(body).find('.modal').remove();
            });
        },
        _bindTopbarEvents = function _bindTopbarEvents () {

            var usertools = $('#topbar').find('#user-tools'),
                trashbinbutton = $('#topbar').find('#btn-trashbins'),
                modallink = $('#topbar').find('.modal-link');

            // Activate dropdown menu links in topbar
            usertools.on('click', 'a', function (e) {

                if ( $(this).hasClass('dropdown-link') ) {
                    e.preventDefault();
                    ui.bottombar.hide();
                    ui.sidebar.show();
                    $(this.hash).fadeIn().siblings().hide();
                }
            });

            // Show nearby trashbins
            trashbinbutton.on('click', function () {
                if( maps.map.getZoom() < 15 ) {

                    alerts.showAlert(31, 'info', 2000);
                    return;

                } else {
                    maps.getTrashBins();
                }
            });

            // Set the event listeners for modals in the topbar or elsewhere
            modallink.on('click', function (e) {

                e.preventDefault();

                var type = $(this).attr('name');
                var currentmarkers = tools.listMarkersInView(type);

                makeModal(type, currentmarkers);
            });
        },
        _bindBottombarFeatureEvents = function _bindBottombarFeatureEvents (obj) {

            var btnfeature = $('#bottombar').find('.btn-feature');

            // Event listener for share button and social links
            $('.btn-social, fa-share-alt').popover({
                trigger: 'focus',
                html : true,
                container: 'body',
                placement: function (pop) {
                    if ( window.isMobile ) { return 'top'; } else { return 'right'; }
                },
                content: function () {
                    return $('#social-links').html();
                },
                template: '<div class="popover popover-share" role="tooltip"><div class="popover-content popover-share"></div></div>'
            });

            // Event listener for actions buttons (edit, cleaned join, confirm, play)
            btnfeature.on('click', function (e) {

                var ct = $(this).attr('name');
                console.log(ct);

                // Send the full leaflet object to actions dispatch function
                actions.act(ct, obj);
            });


        },
        init = function init () {

            // Add the Leaflet ui controls to the map
            sidebar.addTo(maps.map);
            bottombar.addTo(maps.map);

            // Fill the main topbar and set non-mobile listeners
            if ( !window.isMobile ) {
                document.getElementById('topbar').innerHTML = tmpl('tmpl-topbar-main', templates);
                _bindTopbarEvents();
            }

            // Fill other templates
            document.getElementById('sidebar').innerHTML = tmpl('tmpl-sidebar-main', templates);
            document.getElementById('credits').innerHTML = tmpl('tmpl-credits', templates.credits);

            // Set the rest of the listeners
            _bindSidebarEvents();
            _bindBottombarEvents();

            // custom alerts at startup for cookies
            alerts.showAlert(32, 'warning', 5000);
       };

    return {   bottombar             : bottombar
             , init                  : init
             , makeModal             : makeModal
             , pushDataToBottomPanel : pushDataToBottomPanel
             , sidebar               : sidebar
             , templates             : templates
            };
}());
