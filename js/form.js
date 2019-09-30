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
    setFilter('origin', 0, true);
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
      effectLevel.classList.remove('hidden');
    } else {
      effectLevel.classList.add('hidden');
    }
  };

  // Устанавлиет текущий фильтер
  var setFilter = function (filterName, shift, init) {
    var previewElement = document.querySelector('.img-upload__preview');
    switch (filterName) {
      case 'chrome': {
        setGrayscale(effectLevel, previewElement, init);
        setVisibilityEffectSlider(true);
        movePin(shift, init);
        return;
      }
      case 'sepia': {
        setSepia(effectLevel, previewElement, init);
        setVisibilityEffectSlider(true);
        movePin(shift, init);
        return;
      }
      case 'marvin': {
        setInvert(effectLevel, previewElement, init);
        setVisibilityEffectSlider(true);
        movePin(shift, init);
        return;
      }
      case 'phobos': {
        setBlur(effectLevel, previewElement, init);
        setVisibilityEffectSlider(true);
        movePin(shift, init);
        return;
      }
      case 'heat': {
        setBrightness(effectLevel, previewElement, init);
        setVisibilityEffectSlider(true);
        movePin(shift, init);
        return;
      }
      default:
        setOrigin(effectLevel, previewElement, init);
        setVisibilityEffectSlider(false);
        movePin(shift, init);
    }
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
      setFilter(document.querySelector('.effects__radio:checked').value, shift.x, false);
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
  var movePin = function (shiftX, init) {
    var pinMoveRect = getPinMoveRect();
    var positionX = effectPin.offsetLeft - shiftX;
    if (!init) {
      if (positionX >= pinMoveRect.minX && positionX <= pinMoveRect.maxX) {
        effectPin.style.left = (effectPin.offsetLeft - shiftX) + 'px';
        effectDepth.style.width = effectPin.offsetLeft + 'px';
      }
    } else {
      effectPin.style.left = pinMoveRect.maxX + 'px';
      effectDepth.style.width = effectPin.offsetLeft + 'px';
    }
  };


  // Обработчик события onChange для inputRadio
  var effectsRadioChangeHandler = function (evt) {
    var target = evt.target;
    if (target.checked) {
      setFilter(target.value, 0, true);
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
  // Проверяет длину хэштегов
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
  // Проверяет количество хэштегов
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
  // Проверяет повторение хэштегов
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
  // Обработчик события Submit
  var uploadSubmitClickHandler = function () {
    validateHashtags();
  };

  var effectLevel = document.querySelector('.effect-level');
  var effectPin = effectLevel.querySelector('.effect-level__pin');
  var effectLine = effectLevel.querySelector('.effect-level__line');
  var effectDepth = effectLevel.querySelector('.effect-level__depth');
  document.querySelector('#upload-file').addEventListener('change', uplaodFileChangeHandler);
  document.addEventListener('keydown', documentKeydownHandler);
  document.querySelector('.scale__control--bigger').addEventListener('click', scaleBiggerClickHandler);
  document.querySelector('.scale__control--smaller').addEventListener('click', scaleSmallerClickHandler);
  effectPin.addEventListener('mousedown', effectPinMouseDownHandler);
  initializeEffectsRadio();
  document.querySelector('.img-upload__submit').addEventListener('click', uploadSubmitClickHandler);

})();
