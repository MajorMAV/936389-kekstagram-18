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
})();
