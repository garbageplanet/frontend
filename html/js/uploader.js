// Image upload to Imgur
// author: xr@github

// TODO make this available only to logged in users.
$(function () {
	$('.image-uploader').fileupload({
        headers: {"Authorization": "Client-ID " + "Imgur Client ID"},
        url: "https://api.imgur.com/3/image",
        dataType: 'json',
        progressall: function (e, data) {
          var progress = parseInt(data.loaded / data.total * 100, 10);
          $('.progress').removeClass('hidden');
          $('.progress-bar').css('width', progress + '%');
        },
        done: function (e, data) {
            $(e.target).parent().next().val(data.result.data.link);
            //$('.progress').hide().delay(500);
            $('.progress').addClass('hidden').delay(200);
        }
    });

	$('.btn-image-uploader').click(function () {
		$(this).next().trigger('click');
	});
});