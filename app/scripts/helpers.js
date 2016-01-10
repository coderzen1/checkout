/* jshint camelcase: false */
(function() {
  'use strict';

  window.HELPERS = window.HELPERS || {};

  window.HELPERS = {

    verifyPromoCode: function($field, cbls) {
      cbls = cbls || {};

      function handleFailure() {
        $field.prop('disabled', false);
        $field.parent().removeClass('disabled');
        $field.parent().addClass('error');
        $field.siblings('.__form-label-error').text(HideMe.translations.FORM_ERRORS.promoCode);
        if (cbls.fail) {
          cbls.fail();
        }
      }

      $.ajax({
        url: HideMe.URLS.promoValidationUrl,
        data: $field.val(),
        success: function(response) {
          if ($field.val() === response.is_valid) {
            $field.prop('disabled', true);
            $field.parent().addClass('disabled');
            if (cbls.success) {
              cbls.success();
            }
          } else {
            handleFailure();
          }
        },
        error: function() {
          handleFailure();
        }
      });
    },

    isPromo: window.validatorFactory({
      clb: function($field, validationResponse) {

        window.HELPERS.verifyPromoCode($field, {
          success: function() {
            validationResponse(true);
          },
          fail: function() {
            validationResponse(false);
          }
        });
      }
    })
  };

}());