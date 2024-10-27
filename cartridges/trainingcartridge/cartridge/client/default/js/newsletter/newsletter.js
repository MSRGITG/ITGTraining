'use strict';

var formValidation = require('../../../../../../app_storefront_base/cartridge/client/default/js/components/formValidation');

module.exports = {
    submitNewsletter: function () {
        $('form.newsletter-form').submit(function (e) {
            var $form = $(this);
            e.preventDefault();
            var url = $form.attr('action');
            $form.spinner().start();
            $('form.newsletter-form').trigger('newsletter:submit', e);
            $.ajax({
                url: url,
                type: 'post',
                dataType: 'json',
                data: $form.serialize(),
                success: function (data) {
                    $form.spinner().stop();
                    if (!data.success) {
                        formValidation($form, data);
                    } else {
                        window.location.href = data.continueUrl;
                    }
                },
                error: function (err) {
                    if (err.responseJSON.continueUrl) {
                        window.location.href = err.responseJSON.continueUrl;
                    }
                    $form.spinner().stop();
                }
            });
            return false;
        });
    }
};