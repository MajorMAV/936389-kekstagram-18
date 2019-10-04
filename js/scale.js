'use strict';
(function () {
  var SCALE_MAX_VALUE = 100;
  var SCALE_MIN_VALUE = 25;
  var SCALE_STEP = 25;

  var scaleElement;
  var previewElement;
  var scaleInput;

  if (!window.scale) {
    window.scale = {};
  }

  // Возвращает установленное заначение масштаба для передачи на сервер
  var getScaleValue = function () {
    var scaleValue = Number(scaleInput.value.replace('%', ''));
    if (!scaleValue) {
      scaleValue = SCALE_MAX_VALUE;
      scaleInput.value = SCALE_MAX_VALUE + '%';
    }
    return scaleValue;
  };

  // Устанавливает значение масштаба для передачи на сервер
  var setScaleValue = function (value) {
    scaleInput.value = value + '%';
  };

  // Устанавливает масштабирование
  var setScale = function (value) {
    if (value < SCALE_MIN_VALUE || value > SCALE_MAX_VALUE) {
      return;
    }
    setScaleValue(value);
    previewElement.style.transform = 'scale(' + (getScaleValue() / 100) + ')';
  };

  // Обработчик onClick для кнопки увеличения изображения
  var scaleBiggerClickHandler = function () {
    var value = getScaleValue();
    setScale(value + SCALE_STEP);
  };

  // Обработчик onClick для кнопки уменьшения изображения
  var scaleSmallerClickHandler = function () {
    var value = getScaleValue();
    setScale(value - SCALE_STEP);
  };

  window.scale.init = function (element, preview) {
    scaleElement = element;
    previewElement = preview;
    scaleInput = scaleElement.querySelector('.scale__control--value');
    scaleElement.querySelector('.scale__control--bigger').addEventListener('click', scaleBiggerClickHandler);
    scaleElement.querySelector('.scale__control--smaller').addEventListener('click', scaleSmallerClickHandler);
    setScale(SCALE_MAX_VALUE);
  };

  window.scale.clear = function () {
    setScale(SCALE_MAX_VALUE);
  };

})();
