'use strict';
(function () {
  if (!window.utils) {
    window.utils = {};
  }

  window.utils.KeyCode = {
    ESC: 27,
    ARROW_LEFT: 37,
    ARROW_RIGHT: 39
  };

  window.utils.DATA_URL = ' https://js.dump.academy/kekstagram/data';

  window.utils.trackFocus = function (element) {
    element.addEventListener('focus', function (evt) {
      evt.target.hasFocus = true;
    });
    element.addEventListener('blur', function (evt) {
      evt.target.hasFocus = false;
    });
  };

  window.utils.showError = function (message) {
    var errorElement = document.createElement('p');
    errorElement.style.position = 'fixed';
    errorElement.style.top = '0';
    errorElement.style.width = '100%';
    errorElement.style.textAlign = 'center';
    errorElement.style.backgroundColor = 'red';
    errorElement.style.zIndex = '20';
    errorElement.textContent = message;

    var clearHandlers = function () {
      document.removeEventListener('mousedown', documentMousedownHandler);
      document.removeEventListener('keydown', documentKeydownHandler);
    };

    var removeErrorElement = function () {
      clearHandlers();
      errorElement.remove();
      errorElement = null;
    };

    var documentMousedownHandler = function () {
      removeErrorElement();
    };

    var documentKeydownHandler = function () {
      removeErrorElement();
    };

    document.addEventListener('mousedown', documentMousedownHandler);
    document.addEventListener('keydown', documentKeydownHandler);
    document.body.insertBefore(errorElement, document.body.childNodes[0]);
  };

})();
