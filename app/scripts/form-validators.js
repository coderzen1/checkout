/* jshint camelcase: false */
(function() {
  'use strict';

  var emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  var nameRegex = /^[a-zA-Z ]+$/;

  window.FORM_VALIDATORS = window.FORM_VALIDATORS || {};

  $.support.cors = true;

  window.validatorFactory = function(config) {
    return function($field) {
      var dfd = $.Deferred();
      config.clb($field, function(response) {
        //console.log(response);
        if (typeof response === 'object') {
          response.then(dfd.resolve, dfd.reject);
        } else if (response) {
          dfd.resolve();
        } else {
          dfd.reject(config.msg);
        }
      });
      return dfd.promise();
    };
  };

  $.extend(window.FORM_VALIDATORS, {

    isRequired: window.validatorFactory({
      clb: function($field, validationResponse) {
        validationResponse(!!$field.val());
      },
      msg: HideMe.translations.FORM_ERRORS.required
    }),

    isEmail: window.validatorFactory({
      clb: function($field, validationResponse) {
        $.ajax({
          url: 'https://api.mailgun.net/v2/address/validate?callback=?',
          data: {
            address: $field.val(),
            api_key: 'pubkey-4nhpob4lsiz4ecghcjscug7pawc00q78'
          },
          dataType: 'jsonp',
          crossDomain: true,
          success: function(response) {
            if (response.is_valid) {
              window.removeMsgField($field, 'info');
              validationResponse(true);
              if (response.did_you_mean) {
                window.setMsgToField($field, 'info', HideMe.translations.MISC.didYouMean.replace('{{0}}', response.did_you_mean));
              }
            } else {
              window.removeMsgField($field, 'info');
              validationResponse(false);
            }
          },
          error: function() {
            validationResponse(false);
          }
        });
      },
      msg: HideMe.translations.FORM_ERRORS.email
    }),

    isName: window.validatorFactory({
      clb: function($field, validationResponse) {
        validationResponse(nameRegex.test($field.val()));
      },
      msg: HideMe.translations.FORM_ERRORS.cardName
    })
  });

}());