'use strict';

(function () {
  var MOVE_STEP = 3;

  var callbackAction;
  var effectLevelElement = document.querySelector('.effect-level');
  var effectPinElement = effectLevelElement.querySelector('.effect-level__pin');
  var effectLineElement = effectLevelElement.querySelector('.effect-level__line');
  var effectDepthElement = effectLevelElement.querySelector('.effect-level__depth');

  if (!window.slider) {
    window.slider = {};
  }

  var getRatio = function () {
    var effectLineRect = effectLineElement.getBoundingClientRect();
    var effectPinRect = effectPinElement.getBoundingClientRect();
    return ((effectPinRect.left - effectLineRect.left + effectPinRect.width / 2) / effectLineRect.width).toFixed(2);
  };

  var getPinMoveRect = function () {
    var rect = {};
    rect.minX = 0;
    rect.maxX = effectLineElement.offsetWidth;
    return rect;
  };

  window.slider.setVisibility = function (visible) {
    if (visible) {
      effectLevelElement.classList.remove('hidden');
    } else {
      effectLevelElement.classList.add('hidden');
    }
    movePin();
  };

  window.slider.initialize = function (callback) {
    callbackAction = callback;
  };

  window.slider.clear = function () {
    movePin();
  };

  var effectPinMouseDownHandler = function (evt) {
    var startPosition = {
      x: evt.clientX
    };

    var mouseMoveHandler = function (moveEvt) {
      moveEvt.preventDefault();
      var shift = {
        x: startPosition.x - moveEvt.x
      };

      startPosition.x = moveEvt.x;
      movePin(shift.x);
    };
    var mouseUpHandler = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  };

  var effectPinKeydownHandler = function (downEvt) {
    if (window.keyboard.isArrowLeftPressed(downEvt)) {
      movePin(MOVE_STEP);
      return;
    }
    if (window.keyboard.isArrowRightPressed(downEvt)) {
      movePin(-MOVE_STEP);
      return;
    }
  };

  var movePin = function (shiftX) {
    var pinMoveRect = getPinMoveRect();
    if (arguments.length > 0) {
      var positionX = effectPinElement.offsetLeft - shiftX;
      if (positionX >= pinMoveRect.minX && positionX <= pinMoveRect.maxX) {
        effectPinElement.style.left = (effectPinElement.offsetLeft - shiftX) + 'px';
        effectDepthElement.style.width = effectPinElement.offsetLeft + 'px';
      }
    } else {
      effectPinElement.style.left = pinMoveRect.maxX + 'px';
      effectDepthElement.style.width = effectPinElement.offsetLeft + 'px';
    }
    if (typeof (callbackAction) === 'function') {
      callbackAction(getRatio());
    }
  };

  effectPinElement.addEventListener('mousedown', effectPinMouseDownHandler);
  effectPinElement.addEventListener('keydown', effectPinKeydownHandler);
})();
