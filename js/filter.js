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
    previewElement.classList.add(effectToClassName[Effect.CHOME]);
    setEffectValue(ratio);
    previewElement.style.filter = 'grayscale(' + ratio + ')';
    currentEffect = Effect.CHOME;
  };

  // Устанавливает фильтр "Сепия"
  var setSepia = function (ratio) {
    previewElement.classList.add(effectToClassName[Effect.SEPIA]);
    setEffectValue(ratio);
    previewElement.style.filter = 'sepia(' + ratio + ')';
    currentEffect = Effect.SEPIA;
  };

  // Устанавливает фильтр "Марвин"
  var setInvert = function (ratio) {
    previewElement.classList.add(effectToClassName[Effect.MARVIN]);
    setEffectValue(ratio);
    previewElement.style.filter = 'invert(' + ratio + ')';
    currentEffect = Effect.MARVIN;
  };

  // Устанавливает фильтр "Фобос"
  var setBlur = function (ratio) {
    previewElement.classList.add(effectToClassName[Effect.PHOBOS]);
    var value = (BLUR_MIN_VALUE + ratio * (BLUR_MAX_VALUE - BLUR_MIN_VALUE)).toFixed(2);
    setEffectValue(value);
    previewElement.style.filter = 'blur(' + value + 'px)';
    currentEffect = Effect.PHOBOS;
  };

  // Устанавливает фильтр "Зной"
  var setBrightness = function (ratio) {
    previewElement.classList.add(effectToClassName[Effect.HEAT]);
    var value = (BRIGHTNESS_MIN_VALUE + ratio * (BRIGHTNESS_MAX_VALUE - BRIGHTNESS_MIN_VALUE)).toFixed(2);
    setEffectValue(value);
    previewElement.style.filter = 'brightness(' + value + ')';
    currentEffect = Effect.HEAT;
  };

  // Сбрасывает значения фильтра до оригинального изображения
  var setOrigin = function () {
    setEffectValue('');
    previewElement.style.filter = '';
    currentEffect = Effect.ORIGIN;
  };

  // Удаляет css класс фильтра с элемента превью
  var clearPerview = function () {
    if (currentEffect !== Effect.ORIGIN) {
      previewElement.classList.remove(effectToClassName[currentEffect]);
    }
  };

  // Обработчик события onChange для inputRadio
  var effectsRadioChangeHandler = function (evt) {
    var target = evt.target;
    if (!target.checked) {
      return;
    }
    var sliderVisibility = target.value !== Effect.ORIGIN;
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

  window.filter.init = function (effect, radios, preview) {
    effectElement = effect;
    radioElements = radios;
    previewElement = preview;
    initializeEffectsRadio();
  };

})();
