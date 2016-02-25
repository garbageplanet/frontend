/*jslint browser: true, white: true, sloppy: true, maxerr: 1000*/
// author: xr@github
// TODO make this more secure.
// TODO make non-anonymous
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
      
        if (!localStorage.getItem['token'] || localStorage.getItem['token'] === 'undefined') {

          showAlert("You need to be be authenticated to do that.", "warning", 2000);
          return;

        }
      
      else {
        
		$(this).next().trigger('click');
        
      }
      
	});
  
});
