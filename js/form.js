'use strict';
(function () {

  var SCALE_MAX_VALUE = 100;
  var SCALE_MIN_VALUE = 25;
  var SCALE_STEP = 25;
  var BLUR_MAX_VALUE = 3;
  var BLUR_MIN_VALUE = 0;
  var BRIGHTNESS_MAX_VALUE = 3;
  var BRIGHTNESS_MIN_VALUE = 1;

  // Возвращает установленное заначение масштаба для передачи на сервер
  var getScaleValue = function () {
    var scaleInput = document.querySelector('.scale__control--value');
    var scaleValue = Number(scaleInput.value.replace('%', ''));
    if (!scaleValue) {
      scaleValue = SCALE_MAX_VALUE;
      scaleInput.value = SCALE_MAX_VALUE + '%';
    }
    return scaleValue;
  };

  // Устанавливает значение масштаба для передачи на сервер
  var setScaleValue = function (value) {
    document.querySelector('.scale__control--value').value = value + '%';
  };

  // Устанавливает масштабирование
  var setScale = function (value) {
    if (value < SCALE_MIN_VALUE || value > SCALE_MAX_VALUE) {
      return;
    }
    setScaleValue(value);
    document.querySelector('.img-upload__preview').style.transform = 'scale(' + (getScaleValue() / 100) + ')';
  };

  // Сбрасывает примененые эфеккты до начального значения
  var claerEffects = function () {
    setScale(SCALE_MAX_VALUE);
    setFilter('origin', true);
  };

  // Открывет окно редактирования изображения
  var openUploadWindow = function () {
    document.querySelector('.img-upload__overlay').classList.remove('hidden');
    document.querySelector('#upload-cancel').addEventListener('click', closeUploadWindow);
    claerEffects();
  };

  // Закрывает окно редактирования изображения
  var closeUploadWindow = function () {
    document.querySelector('.img-upload__overlay').classList.add('hidden');
    document.querySelector('#upload-cancel').removeEventListener('click', closeUploadWindow);
    document.querySelector('#upload-file').value = '';
  };

  // ОБработчик onChenge поля загрузки файла
  var uplaodFileChangeHandler = function () {
    openUploadWindow();
  };

  // Обработчик onKeydown для документа
  var documentKeydownHandler = function (evt) {
    if (evt.keyCode === window.utils.ESC_KEY) {
      closeUploadWindow();
    }
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

  // Вычисляет соотношение положения Pin по отношению к слайдеру
  var getRatio = function (levelElement) {
    var effectLineRect = levelElement.querySelector('.effect-level__line').getBoundingClientRect();
    var effectPinRect = levelElement.querySelector('.effect-level__pin').getBoundingClientRect();
    return ((effectPinRect.x - effectLineRect.x + effectPinRect.width / 2) / effectLineRect.width).toFixed(2);
  };

  // Устанавливает значение фильтра для передачи на сервер
  var setEffectValue = function (levelElement, value) {
    levelElement.querySelector('.effect-level__value').value = value;
  };

  // Устанавливает фтльтр "Хром"
  var setGrayscale = function (levelElement, previewElement, init) {
    var ratio = 1;
    if (!init) {
      ratio = getRatio(levelElement);
    }
    setEffectValue(levelElement, ratio);
    previewElement.style.filter = 'grayscale(' + ratio + ')';
  };

  // Устанавливает фильтр "Сепия"
  var setSepia = function (levelElement, previewElement, init) {
    var ratio = 1;
    if (!init) {
      ratio = getRatio(levelElement);
    }
    setEffectValue(levelElement, ratio);
    previewElement.style.filter = 'sepia(' + ratio + ')';
  };

  // Устанавливает фильтр "Марвин"
  var setInvert = function (levelElement, previewElement, init) {
    var ratio = 1;
    if (!init) {
      ratio = getRatio(levelElement);
    }
    setEffectValue(levelElement, ratio);
    previewElement.style.filter = 'invert(' + ratio + ')';
  };

  // Устанавливает фильтр "Фобос"
  var setBlur = function (levelElement, previewElement, init) {
    var ratio = 1;
    if (!init) {
      ratio = getRatio(levelElement);
    }
    var value = (BLUR_MIN_VALUE + ratio * (BLUR_MAX_VALUE - BLUR_MIN_VALUE)).toFixed(2);
    setEffectValue(levelElement, value);
    previewElement.style.filter = 'blur(' + value + 'px)';
  };

  // Устанавливает фильтр "Зной"
  var setBrightness = function (levelElement, previewElement, init) {
    var ratio = 1;
    if (!init) {
      ratio = getRatio(levelElement);
    }
    var value = (BRIGHTNESS_MIN_VALUE + ratio * (BRIGHTNESS_MAX_VALUE - BRIGHTNESS_MIN_VALUE)).toFixed(2);
    setEffectValue(levelElement, value);
    previewElement.style.filter = 'brightness(' + value + ')';
  };

  // Сбрасывает значения фильтра до оригинального изображения
  var setOrigin = function (levelElement, previewElement) {
    setEffectValue(levelElement, '');
    previewElement.style.filter = '';
  };

  // Управляет видимостью слайдера
  var setVisibilityEffectSlider = function (visible) {
    if (visible) {
      document.querySelector('.effect-level').classList.remove('hidden');
    } else {
      document.querySelector('.effect-level').classList.add('hidden');
    }
  };

  // Устанавлиет текущий фильтер
  var setFilter = function (filterName, init) {
    var effectLevelElement = document.querySelector('.effect-level');
    var previewElement = document.querySelector('.img-upload__preview');
    switch (filterName) {
      case 'chrome': {
        setGrayscale(effectLevelElement, previewElement, init);
        setVisibilityEffectSlider(true);
        return;
      }
      case 'sepia': {
        setSepia(effectLevelElement, previewElement, init);
        setVisibilityEffectSlider(true);
        return;
      }
      case 'marvin': {
        setInvert(effectLevelElement, previewElement, init);
        setVisibilityEffectSlider(true);
        return;
      }
      case 'phobos': {
        setBlur(effectLevelElement, previewElement, init);
        setVisibilityEffectSlider(true);
        return;
      }
      case 'heat': {
        setBrightness(effectLevelElement, previewElement, init);
        setVisibilityEffectSlider(true);
        return;
      }
      default:
        setOrigin(effectLevelElement, previewElement, init);
        setVisibilityEffectSlider(false);
    }
  };

  // Обработчик события onMouseup слайдера
  var effectLevelMouseupHandler = function () {
    setFilter(document.querySelector('.effects__radio:checked').value, false);
  };

  // Обработчик события onChange для inputRadio
  var effectsRadioChangeHandler = function (evt) {
    var target = evt.target;
    if (target.checked) {
      setFilter(target.value, true);
    }
  };

  // Добавлеят обработчик onChange для каждого inputRadio
  var initializeEffectsRadio = function () {
    document.querySelectorAll('.effects__radio').forEach(function (value) {
      value.addEventListener('change', effectsRadioChangeHandler);
    });
  };

  // Валидирует строку с хэштегами
  var validateHashtags = function () {
    var element = document.querySelector('.text__hashtags');
    var value = element.value;
    var hashtags = value.replace(/\s{2,}/, ' ').trim().split(' ');
    var errors = [];
    element.setCustomValidity('');
    if (hashtags[0]) {
      hashtags.forEach(function (hash) {
        var re = /(^#+)([\wА-Яа-я-=+*&^%$@!~`/#|(){}№;:?\.,<>_"'\\]+$)/;
        if (!re.test(hash)) {
          errors.push(hash);
        }
      });
    }
    if (errors.length > 0) {
      element.setCustomValidity('Строка содержит невалидные заначения: ' + errors.join(', '));
    } else {
      var error = checkLenghtHashtags(hashtags, element, false);
      error = checkCountHashtags(hashtags, element, error);
      checkRepeatHashtags(hashtags, element, error);
    }
  };

  var checkLenghtHashtags = function (hashtags, element, error) {
    if (error) {
      return error;
    }
    var errors = [];
    hashtags.forEach(function (tag) {
      if (tag.length > 20) {
        errors.push(tag);
      }
    });
    if (errors.length > 0) {
      element.setCustomValidity('Следующие хэштеги превышают длину в 20 символов: ' + errors.join(', '));
      return true;
    }
    return false;
  };

  var checkCountHashtags = function (hashtags, element, error) {
    if (error) {
      return error;
    }
    if (hashtags.length > 5) {
      element.setCustomValidity('Строка содержит более 5 хэштегов');
      return true;
    }
    return false;
  };

  var checkRepeatHashtags = function (hashtags, element, error) {
    if (error) {
      return error;
    }
    var errors = [];
    var upperCaseTags = hashtags.map(function (value) {
      return value.toUpperCase();
    });
    upperCaseTags.forEach(function (tag, index, tags) {
      if (index + 1 < tags.length) {
        var foundIndex = tags.indexOf(tag, index + 1);
        if (foundIndex > 0) {
          errors.push(hashtags[index]);
        }
      }
    });
    if (errors.length > 0) {
      element.setCustomValidity('Строка содержит повторяющиеся хэштеги: ' + errors.join(', '));
      return true;
    }
    return false;
  };

  var uploadSubmitClickHandler = function () {
    validateHashtags();
  };

  document.querySelector('#upload-file').addEventListener('change', uplaodFileChangeHandler);
  document.addEventListener('keydown', documentKeydownHandler);
  document.querySelector('.scale__control--bigger').addEventListener('click', scaleBiggerClickHandler);
  document.querySelector('.scale__control--smaller').addEventListener('click', scaleSmallerClickHandler);
  var effectLevel = document.querySelector('.effect-level');
  effectLevel.addEventListener('mouseup', effectLevelMouseupHandler);
  initializeEffectsRadio();
  document.querySelector('.img-upload__submit').addEventListener('click', uploadSubmitClickHandler);

})();
