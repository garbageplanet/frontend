/*jslint browser: true, white: true, sloppy: true, maxerr: 1000*/
// FUTURE ADAPT https://github.com/bradvin/social-share-urls
// TODO catch the obj.options from the marker instead of getting the data from the bottom panel
function shareThisFeature(e) {
  // TODO enable sharing for other features in get_features.js      
  var feature_image_url = $('#feature-info').find('.feature-image-link').attr('href') || "";
      var feature_note = $('#feature-info').find('.feature-info-note').val() || "";
      var feature_note_encoded = feature_note.replace(/ /g, "%20");
      var feature_tags = $('#feature-info').find('.feature-info-tags').val() || "";
      var sharedText = "Shared from Garbagepla.net";
      var encoded_url = $(e.target).parent().attr("data-url").replace(/#/g, "%23").replace(/:/g, "%3A").replace(/\//g, "%2F");
      console.log("encoded URL", encoded_url);
  
  if ($(e.target).hasClass('fa-facebook')) {
    // var encoded_url_fb = $(e.target).parent().attr("data-url").replace(/\//g, "%2F").replace(/:/g, "%3A");
    var feature_image_url_fb = feature_image_url.replace(/\//g, "%2F").replace(/:/g, "%3A");           
    var share_link_fb = "https://www.facebook.com/dialog/feed?app_id=109950712685962&amp;display=page&amp;description=" + sharedText + feature_note_encoded + "&amp;link=" + encoded_url + "&amp;picture=" + feature_image_url_fb + "&amp;name=Garbagepla.net&amp;redirect_uri=http://www.garbagepla.net/#15";
    // For production build purpose var share_link_fb = "https://www.facebook.com/dialog/feed?app_id=" + "@@facebookToken" + "&amp;display=page&amp;description=" + sharedText + feature_note_encoded + "&amp;link=" + encoded_url + "&amp;picture=" + feature_image_url_fb + "&amp;name=Garbagepla.net&amp;redirect_uri=http://www.garbagepla.net/#15";
    $(e.target).parent().attr('href', share_link_fb).trigger('click');
  }
  
  if ($(e.target).hasClass('fa-twitter')) {
    // TODO test with tags and note
    var feature_tags_tw = feature_tags.replace(/, /g, "%20%23");
    // var encoded_url_tw = $(e.target).parent().attr("data-url").replace(/#/g, "%23").replace(/:/g, "%3A");
    var share_link_tw = "https://twitter.com/home?status=" + sharedText + "%20" + feature_note_encoded + "%20" + feature_tags_tw + "%20" + encoded_url;
    $(e.target).parent().attr('href', share_link_tw).trigger('click');
  }
  
  if ($(e.target).hasClass('fa-tumblr')) {
    console.log('tumblr button click');
    // http://www.tumblr.com/share/link?url=[uri encoded URL]&amp;name=[title]&amp;description=[description]
    // var encoded_url_tb = $(e.target).parent().attr("data-url").replace(/#/g, "%23").replace(/:/g, "%3A");
    var share_link_tb = "http://www.tumblr.com/share/link?url=" + encoded_url + "&amp;name=" + sharedText + "&amp;description=" + feature_note_encoded;
    $(e.target).parent().attr('href', share_link_tb).trigger('click');
  }
  
  if ($(e.target).hasClass('fa-reddit-alien')) {
    var share_link_rd = "http://reddit.com/submit?url=" + encoded_url + "&title=" + sharedText;
    $(e.target).parent().attr('href', share_link_rd).trigger('click');
  }
  
  if ($(e.target).hasClass('fa-google-plus')) {
    var share_link_g = "https://plus.google.com/share?url=" + encoded_url;
    console.log("google plus share link", share_link_g);
    $(e.target).parent().attr('href', share_link_g).trigger('click');
  }
  
  if ($(e.target).hasClass('fa-whatsapp')) {
    var share_link_w = "whatsapp://send?text=Shared from www.garbagepla.net";
    console.log("whatsapp share link", share_link_w);
    $(e.target).parent().attr('href', share_link_w).trigger('click');
  }
}

$('.btn-share').on('click', function (e) {
    e.preventDefault;
    shareThisFeature(e);
});

// FIXME the dynamics attributes are not passed to the popover content
$('.btn-social').popover({
  html : true, 
  container: 'body',
  content: function() {
    return $('.social-links').html();
  },
  template: '<div class="popover popover-share" role="tooltip"><div class="popover-content popover-share"></div></div>'
});

