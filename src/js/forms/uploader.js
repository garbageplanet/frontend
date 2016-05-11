/*jslint browser: true, white: true, sloppy: true, maxerr: 1000*/
// author: xr@github
// FUTURE enable multiple uploads

/**
* Uploading images to imgur anonymously
*/

$(function () {
    
    $('.image-uploader').fileupload({

        headers: {'Authorization': 'Client-ID 6f050e213f46ba9'},
        
        type: 'POST',

        url: 'https://api.imgur.com/3/upload',

        dataType: 'json',
        
        paramName: 'image',

        progressall: function (e, data) {
                        
            var progress = parseInt(data.loaded / data.total * 100, 10);

            $('.progress').removeClass('hidden');

            $('.progress-bar').css('width', progress + '%');

        },
        
        fail: function (err) {
        
            console.log("upload error: ", err);
        
            $('.progress').addClass('hidden').delay(400);

        },
        
        error: function (err) {
        
            console.log("upload error: ", err);
        
            $('.progress').addClass('hidden').delay(400);

        },

        done: function (e, data) {
            
            console.log("IMGUR DATA OBJ: ", data);
            
            $(e.target).parent().next().val(data.result.data.link);

            $('.progress').addClass('hidden').delay(200);
        
/*            $.ajax({
            
                method: "PUT",

                url:  	'https://api.imgur.com/3/album/pWW73/add',

                headers: {'Authorization': 'Client-ID 6f050e213f46ba9'},

                dataType: 'json',
                
                data: {ids: data.result.data.id},
                
                success: function (data) {
              
                    console.log('success data', data);
                
                },
            
                error: function (err) {
              
                    console.log('err', err);

                }

            });*/

        }

    });

	$('.btn-image-uploader').on('click', function () {
        
        if (localStorage.getItem('token')) {

            $(this).next().trigger('click');

        }
        
        // TODO this needs to be more secure
        else {

            showAlert('You need to be be authenticated to do that.', 'warning', 2000);
        
            return;

        }
      
	});
  
});