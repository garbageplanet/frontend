/*jslint browser: true, white: true, sloppy: true, maxerr: 1000*/
// author: xr@github
$(function () {
  
    $('.image-uploader').fileupload({

        headers: {"Authorization": "Client-ID " + "@@imgurToken"},

        url: "https://api.imgur.com/3/image",

        dataType: 'json',

        progressall: function (e, data) {

            var progress = parseInt(data.loaded / data.total * 100, 10);

            $('.progress').removeClass('hidden');

            $('.progress-bar').css('width', progress + '%');

        },

        done: function (e, data) {

            $(e.target).parent().next().val(data.result.data.link);

            $('.progress').addClass('hidden').delay(200);

        }

    });

	$('.btn-image-uploader').on('click', function () {
        
        // FIXME, this doesn't work
        var checkToken = localStorage.getItem['token'];

        if (checkToken || typeof checkToken !== 'undefined') {

            $(this).next().trigger('click');

        }

        else {

            showAlert("You need to be be authenticated to do that.", "warning", 2000);
        
            return;

        }
      
	});
  
});