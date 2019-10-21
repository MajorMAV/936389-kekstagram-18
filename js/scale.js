'use strict';
(function () {
  var SCALE_MAX_VALUE = 100;
  var SCALE_MIN_VALUE = 25;
  var SCALE_STEP = 25;

  var scaleElement;
  var previewElement;
  var scaleInputElement;

  var getScaleValue = function () {
    var scaleValue = Number(scaleInputElement.value.replace('%', ''));
    if (!scaleValue) {
      scaleValue = SCALE_MAX_VALUE;
      scaleInputElement.value = SCALE_MAX_VALUE + '%';
    }
    return scaleValue;
  };

  var setScaleValue = function (value) {
    scaleInputElement.value = value + '%';
  };

  var setScale = function (value) {
    if (value < SCALE_MIN_VALUE || value > SCALE_MAX_VALUE) {
      return;
    }
    setScaleValue(value);
    previewElement.style.transform = 'scale(' + (getScaleValue() / 100) + ')';
  };

  var scaleBiggerClickHandler = function () {
    setScale(getScaleValue() + SCALE_STEP);
  };

  var scaleSmallerClickHandler = function () {
    setScale(getScaleValue() - SCALE_STEP);
  };

  var setScaleDefaultValue = function (value) {
    scaleInputElement.defaultValue = value + '%';
  };

  var initializeScale = function (element, preview) {
    scaleElement = element;
    previewElement = preview;
    scaleInputElement = scaleElement.querySelector('.scale__control--value');
    scaleElement.querySelector('.scale__control--bigger').addEventListener('click', scaleBiggerClickHandler);
    scaleElement.querySelector('.scale__control--smaller').addEventListener('click', scaleSmallerClickHandler);
    setScaleDefaultValue(SCALE_MAX_VALUE);
    setScale(SCALE_MAX_VALUE);
  };

  var clearScale = function () {
    setScale(SCALE_MAX_VALUE);
  };

  window.scale = {
    initialize: initializeScale,
    clear: clearScale
  };
})();
