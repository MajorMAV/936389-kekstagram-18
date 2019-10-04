'use strict';
(function () {
  if (!window.utils) {
    window.utils = {};
  }
  window.utils.ESC_KEY = 27;
  window.utils.DATA_URL = ' https://js.dump.academy/kekstagram/data';

  window.utils.trackFocus = function (element) {
    element.addEventListener('focus', function (evt) {
      evt.target.hasFocus = true;
    });
    element.addEventListener('blur', function (evt) {
      evt.target.hasFocus = false;
    });
  };
})();
