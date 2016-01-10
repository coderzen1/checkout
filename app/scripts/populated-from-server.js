/* jshint camelcase: false */
(function() {
  'use strict';

  window.HideMe = window.HideMe || {};

  HideMe.URLS = {
    promoValidationUrl: 'promoValidationUrl'
  };

  HideMe.translations = {
    FORM_ERRORS: {
      required: 'This field is required!',
      email: 'Please enter a valid email',
      cardName: 'Please enter the cardholder\'s name',
      cardNumber: 'Please enter a valid credit card number',
      cardMonth: 'Select month!',
      cardYear: 'Select year!',
      cardCvcNumber: 'CVC invalid',
      generic: 'A form field is incorrect',
      promoCode: 'Invalid promo code',
      standardServerError: 'Problems with server - please try again later'
    },
    MISC: {
      showPaymentMethods: 'Show Other Payment Methods',
      hidePaymentMethods: 'Hide Other Payment Methods',
      didYouMean: 'Did you mean {{0}}?',
      mustSelectPaymentMethod: 'Must select payment method to continue'
    }
  };

  // === mock server data === //  TO BE DELTED WHEN LINKED TO CLIENT API!!! ===== //
  window.initialValidationErrors = {
    errors: [{
      id: 'two-column-form-email',
      msg: 'Please add a correct email or something.'
    }, {
      id: 'two-column-form-name',
      msg: 'Please include the card holder name.'
    }, {
      id: 'two-column-form-card-number',
      msg: 'Please include your credit card number.'
    }, {
      id: 'two-column-form-cc-exp-month',
      msg: 'Please choose a valid month.'
    }, {
      id: 'two-column-form-cc-exp-year',
      msg: 'Please choose a valid year.'
    }, {
      id: 'two-column-form-cc-csc',
      msg: 'Please add a CVC number.'
    }]
  };
  // =========================================================================== //

  window.initialNotifications = [{
    type: 'info',
    message: 'this info message shows on page load and is soft',
    linger: 'soft'
  }, {
    type: 'error',
    message: 'this error message shows on page load and is hard',
    linger: 'hard'
  }];

}());