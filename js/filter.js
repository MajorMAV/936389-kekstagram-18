'use strict';

(function () {

  var BLUR_MAX_VALUE = 3;
  var BLUR_MIN_VALUE = 0;
  var BRIGHTNESS_MAX_VALUE = 3;
  var BRIGHTNESS_MIN_VALUE = 1;

  var Effect = {
    ORIGIN: 'none',
    CHOME: 'chrome',
    SEPIA: 'sepia',
    MARVIN: 'marvin',
    PHOBOS: 'phobos',
    HEAT: 'heat'
  };

  var effectToClassName = {
    'none': '',
    'chrome': 'effects__preview--chrome',
    'sepia': 'effects__preview--sepia',
    'marvin': 'effects__preview--marvin',
    'phobos': 'effects__preview--phobos',
    'heat': 'effects__preview--heat'
  };

  var effectElement;
  var radioElements;
  var previewElement;
  var originRadioElement;
  var currentEffect;

  if (!window.filter) {
    window.filter = {};
  }

  var setEffectValue = function (value) {
    effectElement.querySelector('.effect-level__value').value = value;
  };

  var setGrayscale = function (ratio) {
    previewElement.classList.add(effectToClassName[Effect.CHOME]);
    setEffectValue(ratio);
    previewElement.style.filter = 'grayscale(' + ratio + ')';
    currentEffect = Effect.CHOME;
  };

  var setSepia = function (ratio) {
    previewElement.classList.add(effectToClassName[Effect.SEPIA]);
    setEffectValue(ratio);
    previewElement.style.filter = 'sepia(' + ratio + ')';
    currentEffect = Effect.SEPIA;
  };

  var setInvert = function (ratio) {
    previewElement.classList.add(effectToClassName[Effect.MARVIN]);
    setEffectValue(ratio);
    previewElement.style.filter = 'invert(' + ratio + ')';
    currentEffect = Effect.MARVIN;
  };

  var setBlur = function (ratio) {
    previewElement.classList.add(effectToClassName[Effect.PHOBOS]);
    var value = (BLUR_MIN_VALUE + ratio * (BLUR_MAX_VALUE - BLUR_MIN_VALUE)).toFixed(2);
    setEffectValue(value);
    previewElement.style.filter = 'blur(' + value + 'px)';
    currentEffect = Effect.PHOBOS;
  };

  var setBrightness = function (ratio) {
    previewElement.classList.add(effectToClassName[Effect.HEAT]);
    var value = (BRIGHTNESS_MIN_VALUE + ratio * (BRIGHTNESS_MAX_VALUE - BRIGHTNESS_MIN_VALUE)).toFixed(2);
    setEffectValue(value);
    previewElement.style.filter = 'brightness(' + value + ')';
    currentEffect = Effect.HEAT;
  };

  var setOrigin = function () {
    setEffectValue('');
    previewElement.style.filter = '';
    currentEffect = Effect.ORIGIN;
  };

  var clearPerview = function () {
    if (currentEffect !== Effect.ORIGIN) {
      previewElement.classList.remove(effectToClassName[currentEffect]);
    }
  };

  var effectsRadioChangeHandler = function (evt) {
    var target = evt.target;
    if (!target.checked) {
      return;
    }
    var sliderVisibility = target.value !== Effect.ORIGIN;
    window.slider.setVisibility(sliderVisibility);
  };

  var initializeEffectsRadio = function () {
    radioElements.forEach(function (item) {
      item.addEventListener('change', effectsRadioChangeHandler);
      if (item.value === Effect.ORIGIN) {
        originRadioElement = item;
      }
    });

  };

  window.filter.setEffect = function (ratio) {
    var checkedIndex = radioElements.findIndex(function (item) {
      return item.checked;
    });
    var filterName = radioElements[checkedIndex].value;
    clearPerview();
    switch (filterName) {
      case Effect.CHOME: {
        setGrayscale(ratio);
        return;
      }
      case Effect.SEPIA: {
        setSepia(ratio);
        return;
      }
      case Effect.MARVIN: {
        setInvert(ratio);
        return;
      }
      case Effect.PHOBOS: {
        setBlur(ratio);
        return;
      }
      case Effect.HEAT: {
        setBrightness(ratio);
        return;
      }
      default:
        setOrigin();
        return;
    }
  };

  window.filter.initialize = function (effect, radios, preview) {
    effectElement = effect;
    radioElements = Array.from(radios);
    previewElement = preview;
    initializeEffectsRadio();
  };

  window.filter.clear = function () {
    originRadioElement.checked = true;
  };

})();
