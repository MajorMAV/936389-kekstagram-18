'use strict';

(function () {

  var KeyCode = {
    ESC: 27,
    ARROW_LEFT: 37,
    ARROW_RIGHT: 39
  };

  if (!window.keyboard) {
    window.keyboard = {};
  }

  window.keyboard.isEscPressed = function (pressEvt) {
    return pressEvt.keyCode === KeyCode.ESC;
  };

  window.keyboard.isArrowLeftPressed = function (pressEvt) {
    return pressEvt.keyCode === KeyCode.ARROW_LEFT;
  };

  window.keyboard.isArrowRightPressed = function (pressEvt) {
    return pressEvt.keyCode === KeyCode.ARROW_RIGHT;
  };

})();
