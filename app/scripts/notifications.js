(function() {
  'use strict';

  window.HideMe = window.HideMe || {};

  var types = {
    success: {
      containerSelector: '.notice',
      text: '',
      theme: 'customTheme',
      closeWith: ['click'],
      type: 'success',
      dismissQueue: true,
      template: '<div class="noty_message"><p class="__icon"></p><span class="noty_text"></span><div class="noty_close"></div></div>'
    },
    info: {
      containerSelector: '.notice',
      text: '',
      theme: 'customTheme',
      closeWith: ['click'],
      type: 'information',
      dismissQueue: true,
      template: '<div class="noty_message"><p class="__icon-info">!</p><span class="noty_text"></span><div class="noty_close"></div></div>'
    },
    error: {
      containerSelector: '.notice',
      text: '',
      theme: 'customTheme',
      closeWith: ['click'],
      type: 'error',
      dismissQueue: true,
      template: '<div class="noty_message"><p class="__icon-error">X</p><span class="noty_text"></span><div class="noty_close"></div></div>'
    }
  };

  function showNotification(type, message, linger) {
    //linger is "hard" or "soft" - soft means it dissapers after 5seconds
    var notification = types[type];
    notification.text = message;
    if (linger === 'soft') {
      notification.timeout = 5 * 1000; //5 seconds
    }

    return $(notification.containerSelector).noty(notification);
  }

  // The Notifications options and function are set above.
  // There are three notifications set to your site's custom theme: 1. Success/Promo code message (green), 2. Info message (blue), 3. Error message (red).
  // To add a notification, use the showNotification function. The function's arguments use the desired notification type and message you wish to display.

  window.HideMe.showNotification = showNotification;
})();
