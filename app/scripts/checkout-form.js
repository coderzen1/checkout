/* jshint camelcase: false */

window.HideMe = window.HideMe || {};

$(function() {
  'use strict';

  var PAYMENT_TYPES = {
    PLAN: 'plan',
    OPTION: 'option'
  };

  var SERVER_FORM_SUBMIT_URL = $('#checkout-form').attr('action');

  // ========================= INITS AND VARIABLES ============================= //
  // === Initialize CVC tooltips === //
  $('.__csc-icon').tooltip();
  $('.__csc-icon--left').tooltip();

  // === set up credit card formatting with jquery-payment plugin === //
  $('input.cc-number').payment('formatCardNumber');
  $('input.cc-csc').payment('formatCardCVC');

  // === variables === //
  var formType = '.two-column-form'; // base form on initial page load
  var $paymentPlan = $('.payment-plan'); // payment plan type at top of page
  var $paymentOption = $('.payment-option'); // payment option type that selects formType
  var expanded = false;
  var $activeForm = $(formType);

  // ============================ END VARIABLES ================================ //


  // ============================ FORM FUNCTIONS =============================== //

  // === seriliazes form data for posting to server === //
  function serializeForm() {
    var data = {};
    var checked = true;

    $activeForm.find('.js-field').each(function() {
      var $this = $(this);

      if ($this.attr('type') === 'checkbox') {
        if ($this.is(':checked') === false) {
          checked = false;
        }
        data[$this.attr('name')] = checked;
      } else {
        data[$this.attr('name')] = $this.val();
      }
    });

    $('.plans').find('.js-field').each(function() {
      var $this = $(this);
      if ($this.attr('type') === 'radio') {
        if ($this.is(':checked') === true) {
          data[$this.attr('name')] = $this.data('duration');
        }
      }
    });

    $('.payments').find('.js-field').each(function() {
      var $this = $(this);
      var $autoRenew = $('.' + $this.parent().data('form-type')).find('.js-auto-renew');
      if ($this.attr('type') === 'radio') {
        if ($this.is(':checked') === true) {
          data[$this.attr('name')] = $this.data('payment-id');
          if ($this.parent().data('payment-auto-renew') === false ||
            $autoRenew.is(':checked') === false) {
            data[$autoRenew.attr('name')] = false;
          } else {
            data[$autoRenew.attr('name')] = true;
          }
        }
      }
    });

    $('.hidden-inputs').find('input').each(function() {
      var $this = $(this);

      if ($this.attr('type') === 'hidden') {
        data[$this.attr('name')] = $this.attr('value');
      }
    });

    var $promoCodeInput = $('#promo-code');
    if ($promoCodeInput) {
      data[$promoCodeInput.attr('name')] = $promoCodeInput.val();
    }

    data['displayed-price'] = $('.js-total-price').text();

    return data;
  }

  // === on form submit validation and ajax call === //
  function onSubmitClick() {
    //don't submit form if there is no payment method selected
    if (!$('.payment-option.data-box--selected').length) {
      window.HideMe.showNotification('error', HideMe.translations.MISC.mustSelectPaymentMethod, 'soft');
      return;
    }

    //    console.log(getOptionData());
    clientSideFormCheck().then(function() {
      var formData = serializeForm();
      var $loadingEl = $('.loading');
      $.ajax({
          url: SERVER_FORM_SUBMIT_URL,
          method: 'POST',
          data: formData,
          beforeSend: function() {
            $loadingEl.addClass('show');
          }
        })
        .done(function(data) {
          if (data.serverError) {
            window.HideMe.showNotification('error', data.serverError, 'soft');
            return;
          }

          var isValid = serverSideFormCheck(data);
          if (isValid) {
            location.href = data.go_to_link;
          }
          $loadingEl.removeClass('show');
        })
        .fail(function() {
          window.HideMe.showNotification('error', HideMe.translations.FORM_ERRORS.standardServerError);
          $loadingEl.removeClass('show');
        });
    });
  }

  function scrollTo(el) {
    $('html,body').animate({
        scrollTop: $(el).offset().top
      },
      'fast');
  }

  function scrollToFirstError() {
    scrollTo($('.error')[0]);
  }

  function enableClickEvent() {
    if ($('.checkout-button').hasClass('disable')) {
      setTimeout(function() {
        $('.checkout-button').removeClass('disable');
      }, 500);
    }
  }

  // === check for data errors returned by the server === //
  function serverSideFormCheck(data) {
    if (data.errors) {
      for (var i = 0; i < data.errors.length; i++) {
        window.setMsgToField($('#' + data.errors[i].id), 'error', data.errors[i].msg);

      }
      scrollToFirstError();
      enableClickEvent();

      return false;
    }
    return true;
  }

  window.setMsgToField = function($field, msgType, msg) {
    var $parentDiv = $($field.parent());
    $parentDiv.addClass(msgType);
    $parentDiv.find('.__form-label-' + msgType).text(msg);
  };

  window.removeMsgField = function($field, msgType) {
    var $parentDiv = $($field.parent());
    $parentDiv.removeClass(msgType);
    $parentDiv.find('.__form-label-' + msgType).text('');
  };

  function validateField(el) {
    var $field = $(el);
    var validatorNameArray = $field.data('validator').split(' ');
    var validatorName;

    var validators = [];
    for (var valI = 0; valI <= validatorNameArray.length; valI++) {
      validatorName = validatorNameArray[valI];
      var validator = window.FORM_VALIDATORS[validatorName];
      if (validator) {
        validators.push(validator($field));
      }
    }
    return $.when.apply($, validators).fail(function() {
      $.each(arguments, function(index, errorMsg) {
        if (errorMsg) {
          window.setMsgToField($field, 'error', errorMsg);
          return false; // Interrupt the $.each loop
        }
      });
    });
  }

  // === client side form validation check === //
  function clientSideFormCheck() {
    var DONT_CHECK_VALIDATORS = [];

    var fieldValidators = [];
    $activeForm.find('.js-field[data-validator]').each(function(idx, el) {
      var $el = $(el);
      if (DONT_CHECK_VALIDATORS.indexOf($el.data('validator')) === -1) {
        fieldValidators.push(validateField(el));
      }
    });

    return $.when.apply($, fieldValidators).fail(function() {
      scrollToFirstError();
      enableClickEvent();
      HideMe.showNotification('error', HideMe.translations.FORM_ERRORS.generic, 'soft');
    });
  }
  var planSelectedPreviously = false;
  var optionSelectedPreviously = false;

  function paymentSelection($this, $option, type, dontAnimate) {
    $option.removeClass('data-box--selected');
    $option.children('.__checkbox').prop('checked', false);
    $this.children('.__checkbox').prop('checked', true);
    $this.addClass('data-box--selected');
    $('.js-total-price').text($this.data('plan-price'));
    $('.js-billing-plan-period').text($this.data('billing-period'));

    if (type === PAYMENT_TYPES.PLAN) {
      if ($this.data('plan-original-price')) {
        $('.bill .__original-price').removeClass('hidden');
        $('.js-plan-original-price').text($this.data('plan-original-price'));
      } else {
        $('.bill .__original-price').addClass('hidden');
      }
    }

    if (type === PAYMENT_TYPES.OPTION && !optionSelectedPreviously) {
      if (!dontAnimate) {
        optionSelectedPreviously = true;
        scrollTo('.js-fillable-forms-scrolltop');
      }
    } else if (type === PAYMENT_TYPES.PLAN && !planSelectedPreviously) {
      if (!dontAnimate) {
        planSelectedPreviously = true;
        scrollTo('.js-payments-scrolltop');
      }
    }
  }

  function selectPaymentPlan() {
    var $this = $(this);
    paymentSelection($this, $paymentPlan, PAYMENT_TYPES.PLAN);
  }

  function selectPaymentOption(ev, dontAnimate) {
    var $this = $(this);
    paymentSelection($this, $paymentOption, PAYMENT_TYPES.OPTION, dontAnimate);

    $('.fillable-forms').css('display', 'none');
    formType = '.' + $this.data('form-type');
    $activeForm = $(formType);
    console.log($activeForm);
    $activeForm.css('display', 'block');
    if ($this.data('payment-auto-renew') === false) {
      $('.__checkbox-wrapper').addClass('hidden');
    } else {
      $('.__checkbox-wrapper').removeClass('hidden');
    }
  }

  function expandPaymentOptions() {
    if (expanded) {
      $('.payments-bottom-row').slideUp();
      $('.expand-payment-methods').text(HideMe.translations.MISC.showPaymentMethods);
    } else {
      $('.payments-bottom-row').slideDown();
      $('.expand-payment-methods').text(HideMe.translations.MISC.hidePaymentMethods);
    }
    expanded = !expanded;
  }

  function getOptionData() {
    return {
      plan: $('.data-box--selected[data-plan-id]').data('plan-id'),
      payment: $('.data-box--selected[data-payment-id]').data('payment-id')
    };
  }
  // ========================= END FORM FUNCTIONS ============================= //


  // ========================= EVENTS ================================= //
  $('.checkout-button').on('click', function(e) {
    var $button = $('.checkout-button');

    e.preventDefault();
    $button.addClass('disable');
    onSubmitClick();
    setTimeout(function() {
      $button.removeClass('disable');
    }, 10000);
  });

  $('.form-fill-section input, .form-fill-section select').on('keyup change input', function() {
    var $el = $(this);
    $el.parent().removeClass('error');
    $el[$el.val() ? 'addClass' : 'removeClass']('not-empty');
  });

  $paymentPlan.on('click', selectPaymentPlan);
  $paymentOption.on('click', selectPaymentOption);
  $('.expand-payment-methods').on('click', expandPaymentOptions);

  $('.__code-verification').on('click', function() {
    var promoCode = $('#promo-code').val();
    var queryString = window.location.search;
    var newQueryString;

    if (queryString) {
      if (queryString.indexOf('coupon=') === -1) {
        newQueryString = queryString + '&coupon=' + promoCode;
      } else {
        newQueryString = queryString.replace(/(coupon=)[^\&]+/, '$1' + promoCode);
      }

    } else {
      newQueryString = '?coupon=' + promoCode;
    }

    if (!promoCode) {
      return false;
    } else {
      window.location.search = newQueryString;
    }
  });

  // === inline validation === //
  $('.js-field').on('blur', function(ev) {
    validateField(ev.target);
  });
  // ========================= END EVENTS ===================================== //

  // ========================= RESETS ========================================= //
  // === Reset input elements to their HTML attributes (value, checked) === //
  $('input').each(function() {
    this.value = this.getAttribute('value') || '';
  });
  // Select the option that is set by the HTML attribute (selected)
  $('select').each(function() {
    var opts = $('option', this),
      selected = 0;

    for (var i = 0; i < opts.length; i++) {
      if (opts[i].getAttribute('selected') !== null) {
        selected = i;
      }
    }
    this.selectedIndex = selected || 0;
  });



  // === run validation of any server filled fields on page load === //
  var $promoCode = $('#promo-code');
  var $loadedPlan = $('.payment-plan.data-box--selected');
  var $originalPrice = $('.js-plan-original-price');

  $(document).on('ready', function() {
    if ($promoCode.val()) {
      $promoCode.addClass('not-empty');
    }

    if ($loadedPlan.data('plan-original-price')) {
      $('.bill .__original-price').removeClass('hidden');
      $originalPrice.text($loadedPlan.data('plan-original-price'));
    }

  });

  if (window.initialValidationErrors) {
    serverSideFormCheck(window.initialValidationErrors);
  }

  if (window.initialNotifications) {
    for (var i = 0; i < window.initialNotifications.length; i++) {
      window.HideMe.showNotification(window.initialNotifications[i].type, window.initialNotifications[i].message, window.initialNotifications[
        i].linger);
    }
  }

  //initilzation of the form
  if ($('.payment-option.data-box--selected').length) {
    //select and don't animate
    selectPaymentOption.apply($('.payment-option.data-box--selected'), [{}, true]);
  }


  $('.js-total-price').text($('.payment-plan.data-box--selected').data('plan-price'));

});
