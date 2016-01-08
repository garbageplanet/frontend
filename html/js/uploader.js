$(function () {
	$('.l-image-uploader').fileupload({
        headers: {"Authorization": "Client-ID 24642f1bed0f5a2"},
        url: "https://api.imgur.com/3/image",
        dataType: 'json',
        done: function (e, data) {
            $(e.target).parent().next().val(data.result.data.link);
        }
    });

	$('.trigger-image-uploader').click(function () {
		$(this).next().trigger('click');
	});
});
