(function() {
    var Saving = {
        init: function() {
                this.form.garbage = $('.form-garbage');
                this.form.cleaning = $('.form-cleaning');
                this.form.litter = $('.form-litter');
                this.form.area = $('.form-area');
                this.bindEvents();
            },
            bindEvents: function() {

             this.form.on('submit', $.proxy(this.showName, this));
        },

    };
}())