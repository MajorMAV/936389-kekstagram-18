'use strict';

(function () {

  var BLUR_MAX_VALUE = 3;
  var BLUR_MIN_VALUE = 0;
  var BRIGHTNESS_MAX_VALUE = 3;
  var BRIGHTNESS_MIN_VALUE = 1;

  var ORIGIN_PICTURE = 'none';

  var effectElement;
  var radioElements;
  var previewElement;

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
  };

  // Устанавливает фильтр "Сепия"
  var setSepia = function (ratio) {
    previewElement.classList.add('effects__preview--sepia');
    setEffectValue(ratio);
    previewElement.style.filter = 'sepia(' + ratio + ')';
  };

  // Устанавливает фильтр "Марвин"
  var setInvert = function (ratio) {
    previewElement.classList.add('effects__preview--marvin');
    setEffectValue(ratio);
    previewElement.style.filter = 'invert(' + ratio + ')';
  };

  // Устанавливает фильтр "Фобос"
  var setBlur = function (ratio) {
    previewElement.classList.add('effects__preview--phobos');
    var value = (BLUR_MIN_VALUE + ratio * (BLUR_MAX_VALUE - BLUR_MIN_VALUE)).toFixed(2);
    setEffectValue(value);
    previewElement.style.filter = 'blur(' + value + 'px)';
  };

  // Устанавливает фильтр "Зной"
  var setBrightness = function (ratio) {
    previewElement.classList.add('effects__preview--heat');
    var value = (BRIGHTNESS_MIN_VALUE + ratio * (BRIGHTNESS_MAX_VALUE - BRIGHTNESS_MIN_VALUE)).toFixed(2);
    setEffectValue(value);
    previewElement.style.filter = 'brightness(' + value + ')';
  };

  // Сбрасывает значения фильтра до оригинального изображения
  var setOrigin = function () {
    setEffectValue('');
    previewElement.style.filter = '';
  };

  // Удаляет css класс фильтра с элемента превью
  var clearPerview = function () {
    previewElement.classList.remove('effects__preview--chrome');
    previewElement.classList.remove('effects__preview--sepia');
    previewElement.classList.remove('effects__preview--marvin');
    previewElement.classList.remove('effects__preview--phobos');
    previewElement.classList.remove('effects__preview--heat');
  };

  // Обработчик события onChange для inputRadio
  var effectsRadioChangeHandler = function (evt) {
    var target = evt.target;
    if (target.checked) {
      if (target.value === ORIGIN_PICTURE) {
        window.slider.setVisibilityEffectSlider(false);
      } else {
        window.slider.setVisibilityEffectSlider(true);
      }
    }
  };

  // Добавлеят обработчик onChange для каждого inputRadio
  var initializeEffectsRadio = function () {
    radioElements.forEach(function (value) {
      value.addEventListener('change', effectsRadioChangeHandler);
    });
  };

  // Устанавлиет текущий фильтер
  window.filter.setFilter = function (ratio) {
    var checkedIndex = [].findIndex.call(radioElements, function (item) {
      return item.checked;
    });
    var filterName = radioElements[checkedIndex].value;
    clearPerview();
    switch (filterName) {
      case 'chrome': {
        setGrayscale(ratio);
        return;
      }
      case 'sepia': {
        setSepia(ratio);
        return;
      }
      case 'marvin': {
        setInvert(ratio);
        return;
      }
      case 'phobos': {
        setBlur(ratio);
        return;
      }
      case 'heat': {
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
