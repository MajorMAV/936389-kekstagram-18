'use strict';

(function () {
  var INIT_FLAG = true;
  var MOVE_STEP = 3;

  var callbackAction;
  var effectLevelElement = document.querySelector('.effect-level');
  var effectPinElement = effectLevelElement.querySelector('.effect-level__pin');
  var effectLineElement = effectLevelElement.querySelector('.effect-level__line');
  var effectDepthElement = effectLevelElement.querySelector('.effect-level__depth');

  if (!window.slider) {
    window.slider = {};
  }

  // Вычисляет соотношение положения Pin по отношению к слайдеру
  var getRatio = function () {
    var effectLineRect = effectLineElement.getBoundingClientRect();
    var effectPinRect = effectPinElement.getBoundingClientRect();
    return ((effectPinRect.left - effectLineRect.left + effectPinRect.width / 2) / effectLineRect.width).toFixed(2);
  };

  // Выдает min/max  значение для перемещения pin в слайдере
  var getPinMoveRect = function () {
    var rect = {};
    rect.minX = 0;
    rect.maxX = effectLineElement.offsetWidth;
    return rect;
  };

  // Управляет видимостью слайдера
  window.slider.setVisibilityEffectSlider = function (visible) {
    if (visible) {
      effectLevelElement.classList.remove('hidden');
    } else {
      effectLevelElement.classList.add('hidden');
    }
    movePin(INIT_FLAG);
  };

  window.slider.init = function (callback) {
    callbackAction = callback;
  };

  window.slider.clear = function () {
    movePin(INIT_FLAG);
  };

  // Обработчик события onMouseup слайдера
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
    switch (downEvt.keyCode) {
      case window.utils.KeyCode.ARROW_LEFT:
        movePin(MOVE_STEP);
        break;
      case window.utils.KeyCode.ARROW_RIGHT:
        movePin(-MOVE_STEP);
        break;
    }
  };

  // Устанавливает позицию pin в слайдере
  var movePin = function (shiftX) {
    var pinMoveRect = getPinMoveRect();
    var positionX = effectPinElement.offsetLeft - shiftX;
    if (typeof (shiftX) !== 'boolean') {
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
