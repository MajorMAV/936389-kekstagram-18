'use strict';

(function () {

  var BLUR_MAX_VALUE = 3;
  var BLUR_MIN_VALUE = 0;
  var BRIGHTNESS_MAX_VALUE = 3;
  var BRIGHTNESS_MIN_VALUE = 1;

  var ORIGIN_PICTURE = 'none';
  var CHOME_EFFECT = 'chrome';
  var SEPIA_EFFECT = 'sepia';
  var MARVIN_EFFECT = 'marvin';
  var PHOBOS_EFFECT = 'phobos';
  var HEAT_EFFECT = 'heat';

  var effectElement;
  var radioElements;
  var previewElement;
  var currentEffect;

  if (!window.filter) {
    window.filter = {};
  }

  // Устанавливает значение фильтра для передачи на сервер
  var setEffectValue = function (value) {
    effectElement.querySelector('.effect-level__value').value = value;
  };

  // Устанавливает фтльтр "Хром"
  var setGrayscale = function (ratio) {
    previewElement.classList.add('effects__preview--chrome');
    setEffectValue(ratio);
    previewElement.style.filter = 'grayscale(' + ratio + ')';
    currentEffect = CHOME_EFFECT;
  };

  // Устанавливает фильтр "Сепия"
  var setSepia = function (ratio) {
    previewElement.classList.add('effects__preview--sepia');
    setEffectValue(ratio);
    previewElement.style.filter = 'sepia(' + ratio + ')';
    currentEffect = SEPIA_EFFECT;
  };

  // Устанавливает фильтр "Марвин"
  var setInvert = function (ratio) {
    previewElement.classList.add('effects__preview--marvin');
    setEffectValue(ratio);
    previewElement.style.filter = 'invert(' + ratio + ')';
    currentEffect = MARVIN_EFFECT;
  };

  // Устанавливает фильтр "Фобос"
  var setBlur = function (ratio) {
    previewElement.classList.add('effects__preview--phobos');
    var value = (BLUR_MIN_VALUE + ratio * (BLUR_MAX_VALUE - BLUR_MIN_VALUE)).toFixed(2);
    setEffectValue(value);
    previewElement.style.filter = 'blur(' + value + 'px)';
    currentEffect = PHOBOS_EFFECT;
  };

  // Устанавливает фильтр "Зной"
  var setBrightness = function (ratio) {
    previewElement.classList.add('effects__preview--heat');
    var value = (BRIGHTNESS_MIN_VALUE + ratio * (BRIGHTNESS_MAX_VALUE - BRIGHTNESS_MIN_VALUE)).toFixed(2);
    setEffectValue(value);
    previewElement.style.filter = 'brightness(' + value + ')';
    currentEffect = HEAT_EFFECT;
  };

  // Сбрасывает значения фильтра до оригинального изображения
  var setOrigin = function () {
    setEffectValue('');
    previewElement.style.filter = '';
    currentEffect = ORIGIN_PICTURE;
  };

  // Удаляет css класс фильтра с элемента превью
  var clearPerview = function () {
    switch (currentEffect) {
      case CHOME_EFFECT:
        previewElement.classList.remove('effects__preview--chrome');
        break;
      case SEPIA_EFFECT:
        previewElement.classList.remove('effects__preview--sepia');
        break;
      case MARVIN_EFFECT:
        previewElement.classList.remove('effects__preview--marvin');
        break;
      case PHOBOS_EFFECT:
        previewElement.classList.remove('effects__preview--phobos');
        break;
      case HEAT_EFFECT:
        previewElement.classList.remove('effects__preview--heat');
        break;
      default:
        break;
    }
  };

  // Обработчик события onChange для inputRadio
  var effectsRadioChangeHandler = function (evt) {
    var target = evt.target;
    if (!target.checked) {
      return;
    }
    var sliderVisibility = target.value !== ORIGIN_PICTURE;
    window.slider.setVisibilityEffectSlider(sliderVisibility);
  };

  // Добавлеят обработчик onChange для каждого inputRadio
  var initializeEffectsRadio = function () {
    radioElements.forEach(function (value) {
      value.addEventListener('change', effectsRadioChangeHandler);
    });
  };

  // Устанавлиет текущий фильтер
  window.filter.setFilter = function (ratio) {
    var checkedIndex = Array.prototype.findIndex.call(radioElements, function (item) {
      return item.checked;
    });
    var filterName = radioElements[checkedIndex].value;
    clearPerview();
    switch (filterName) {
      case CHOME_EFFECT: {
        setGrayscale(ratio);
        return;
      }
      case SEPIA_EFFECT: {
        setSepia(ratio);
        return;
      }
      case MARVIN_EFFECT: {
        setInvert(ratio);
        return;
      }
      case PHOBOS_EFFECT: {
        setBlur(ratio);
        return;
      }
      case HEAT_EFFECT: {
        setBrightness(ratio);
        return;
      }
      default:
        setOrigin();
        return;
    }
  };

  window.filter.init = function (effect, radios, preview) {
    effectElement = effect;
    radioElements = radios;
    previewElement = preview;
    initializeEffectsRadio();
  };

})();
