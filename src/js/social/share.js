/*jslint browser: true, white: true, sloppy: true, maxerr: 1000*/
function shareThisFeature(obj) {
    
    var featuredata = obj,
      encoded_url = encodeURIComponent(window.location),
      feature_image_url,
      feature_note,
      feature_tags;

    featuredata.image_url ? feature_image_url = featuredata.image_url : feature_image_url =  "";

    feature_image_url_encoded = encodeURIComponent(feature_image_url);

    featuredata.note ? feature_note = featuredata.note : feature_note =  "";

    feature_note_encoded = encodeURIComponent(feature_note);

    featuredata.tags ? feature_tags = featuredata.tags : feature_tags =  "";

    feature_tags_encoded = encodeURIComponent(feature_tags);

    console.log("value of feature data: ", featuredata);

    console.log("encoded URL", encoded_url);

    console.log("encoded image link", feature_image_url_encoded);

    console.log("encoded note", feature_note_encoded);

    console.log("encoded tags", feature_tags_encoded);

    // Create the links dynamically in the templatedata objects
    templatedata.social.network[0].targeturl = "https://www.facebook.com/dialog/feed?app_id=109950712685962&display=page&href=" + encoded_url + "&description=" + feature_note_encoded + "&link=" + encoded_url + "&picture=" + feature_image_url_encoded + "&name=Garbagepla.net&redirect_uri=http://garbagepla.net";

    templatedata.social.network[1].targeturl = "https://twitter.com/intent/tweet?text=Shared%20from%20www.garbagepla.net%20" + feature_note_encoded + "%20" + feature_tags_encoded + "%20" + encoded_url;

    templatedata.social.network[2].targeturl = "https://plus.google.com/share?url=" + encoded_url;

    templatedata.social.network[3].targeturl = "http://reddit.com/submit?url=" + encoded_url + "&title=Shared%20from%20www.garbagepla.net";

    templatedata.social.network[4].targeturl = "http://www.tumblr.com/share/link?url=" + encoded_url + "&amp;name=" + "&amp;description=" + feature_note_encoded;

    templatedata.social.network[5].targeturl = "whatsapp://send?text=Shared%20from%20www.garbagepla.net";

    templatedata.social.network[5].targeturl = "https://vk.com/share.php?url=" + encoded_url;
};
