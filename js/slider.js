'use strict';

(function () {
  var INIT_FLAG = true;
  if (!window.slider) {
    window.slider = {};
  }

  // Вычисляет соотношение положения Pin по отношению к слайдеру
  var getRatio = function () {
    var effectLineRect = effectLine.getBoundingClientRect();
    var effectPinRect = effectPin.getBoundingClientRect();
    return ((effectPinRect.left - effectLineRect.left + effectPinRect.width / 2) / effectLineRect.width).toFixed(2);
  };

  // Выдает min/max  значение для перемещения pin в слайдере
  var getPinMoveRect = function () {
    var rect = {};
    rect.minX = 0;
    rect.maxX = effectLine.offsetWidth;
    return rect;
  };

  // Управляет видимостью слайдера
  window.slider.setVisibilityEffectSlider = function (visible) {
    if (visible) {
      effectLevel.classList.remove('hidden');
    } else {
      effectLevel.classList.add('hidden');
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

  // Устанавливает позицию pin в слайдере
  var movePin = function (shiftX) {
    var pinMoveRect = getPinMoveRect();
    var positionX = effectPin.offsetLeft - shiftX;
    if (typeof (shiftX) !== 'boolean') {
      if (positionX >= pinMoveRect.minX && positionX <= pinMoveRect.maxX) {
        effectPin.style.left = (effectPin.offsetLeft - shiftX) + 'px';
        effectDepth.style.width = effectPin.offsetLeft + 'px';
      }
    } else {
      effectPin.style.left = pinMoveRect.maxX + 'px';
      effectDepth.style.width = effectPin.offsetLeft + 'px';
    }
    if (typeof (callbackAction) === 'function') {
      callbackAction(getRatio());
    }
  };

  var callbackAction;
  var effectLevel = document.querySelector('.effect-level');
  var effectPin = effectLevel.querySelector('.effect-level__pin');
  var effectLine = effectLevel.querySelector('.effect-level__line');
  var effectDepth = effectLevel.querySelector('.effect-level__depth');
  effectPin.addEventListener('mousedown', effectPinMouseDownHandler);
})();
