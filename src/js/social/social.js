/*jslint browser: true, white: true, sloppy: true, maxerr: 1000*/

/**
* Sharing map features from the bottom panel
*/

var social = (function() {
  
    'use strict';

    var network = [
          {
            'iconclass': 'fa-facebook',
            'btnclass': 'btn-facebook',
            'title': 'Share on Facebook',
            'targeturl': ''
          },
          {
            'iconclass': 'fa-twitter',
            'btnclass': 'btn-twitter',
            'title': 'Share on Twitter',
            'targeturl': ''
          },
          {
            'iconclass': 'fa-google-plus',
            'btnclass': 'btn-google-plus',
            'title': 'Share on Google+',
            'targeturl': ''
          },
          {
            'iconclass': 'fa-reddit fa-lg fa-icon-centered',
            'btnclass': 'btn-reddit',
            'title': 'Share on Reddit',
            'targeturl': ''
          },
          {
            'iconclass': 'fa-tumblr',
            'btnclass': 'btn-tumblr',
            'title': 'Share on Tumblr',
            'targeturl': ''
          },
          {
            'iconclass': 'fa-vk fa-icon-centered',
            'btnclass': 'btn-vk',
            'title': 'Share on V-Kontakti',
            'targeturl': ''
          },
          {
            'iconclass': 'fa-whatsapp fa-lg fa-icon-centered',
            'btnclass': 'btn-whatsapp',
            'title': 'Share on Whatsapp',
            'targeturl': ''
          },
          {
            'iconclass': 'fa-renren fa-lg fa-icon-centered',
            'btnclass': 'btn-renren',
            'title': 'Share on RenRen',
            'targeturl': ''
          }
        ],
        shareThisFeature = function(obj) {

            var encoded_url = encodeURIComponent(window.location),
                feature_image_url,
                feature_note,
                feature_tags;

            obj.image_url ? feature_image_url = obj.image_url : feature_image_url =  '';
            var feature_image_url_encoded = encodeURIComponent(feature_image_url);
            obj.note ? feature_note = obj.note : feature_note =  '';
            var feature_note_encoded = encodeURIComponent(feature_note);
            obj.tags ? feature_tags = obj.tags : feature_tags =  '';
            var feature_tags_encoded = encodeURIComponent(feature_tags);

            // Create the links in the templatedata object
            network[0].targeturl = 'https://www.facebook.com/dialog/feed?app_id=109950712685962&display=page&href=' + encoded_url + '&description=' + feature_note_encoded + '&link=' + encoded_url + '&picture=' + feature_image_url_encoded + '&name=Garbagepla.net&redirect_uri=https://garbagepla.net';
            network[1].targeturl = 'https://twitter.com/intent/tweet?text=Shared%20from%20www.garbagepla.net%20' + feature_note_encoded + '%20' + feature_tags_encoded + '%20' + encoded_url;
            network[2].targeturl = 'https://plus.google.com/share?url=' + encoded_url;
            network[3].targeturl = 'http://reddit.com/submit?url=' + encoded_url + '&title=Shared%20from%20www.garbagepla.net';
            network[4].targeturl = 'http://www.tumblr.com/share/link?url=' + encoded_url + '&amp;name=' + '&amp;description=' + feature_note_encoded;
            network[5].targeturl = 'https://vk.com/share.php?url=' + encoded_url;
            network[6].targeturl = 'whatsapp://send?text=Shared%20from%20www.garbagepla.net';
            network[7].targeturl = 'http://share.renren.com/share/buttonshare.do?link=' + encoded_url +  '&title=Share from Garbagepla.net';

        }/*,
        game = function() {

            var getPlayers = function(e) {

                // TODO make one get players and one getdata method for zones/tiles
                if (!localStorage.getItem('token')){

                    alerts.showAlert(3, 'info', 2000);
                }

                else {

                    setTimeout(function () {

                        var useToken = localStorage.getItem('token') || tools.token,
                            title = e;

                        $.ajax({

                            method: 'GET',
                            url: api.getPlayersList.url(id),
                            headers: {'Authorization': 'Bearer' + useToken},
                            success: function (response) {
                                // Make call to list zone data
                            },
                            error: function (err) {
                            }
                        });
                    }, 100);
                }
            },
            printGameData = function () {console.log(this)};

            return { 
                getPlayers: getPlayers,
                printGameData: printGameData
            }
        }*/;

    return {
        network: network,
        shareThisFeature: shareThisFeature,
        /*game: game*/
    }
}());
