'use strict';

(function () {

  var KeyCode = {
    ESC: 27,
    ARROW_LEFT: 37,
    ARROW_RIGHT: 39
  };

  var isEscPressedFnc = function (pressEvt) {
    return pressEvt.keyCode === KeyCode.ESC;
  };

  var isArrowLeftPressedFnc = function (pressEvt) {
    return pressEvt.keyCode === KeyCode.ARROW_LEFT;
  };

  var isArrowRightPressedFnc = function (pressEvt) {
    return pressEvt.keyCode === KeyCode.ARROW_RIGHT;
  };

  window.keyboard = {
    isEscPressed: isEscPressedFnc,
    isArrowLeftPressed: isArrowLeftPressedFnc,
    isArrowRightPressed: isArrowRightPressedFnc
  };
})();
