'use strict';
(function () {

  var SCALE_MAX_VALUE = 100;
  var SCALE_MIN_VALUE = 25;
  var SCALE_STEP = 25;
  var BLUR_MAX_VALUE = 3;
  var BLUR_MIN_VALUE = 0;
  var BRIGHTNESS_MAX_VALUE = 3;
  var BRIGHTNESS_MIN_VALUE = 1;

  var ORIGIN_PICTURE = 'none';

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
    window.slider.setVisibilityEffectSlider(false);
  };

  // Открывет окно редактирования изображения
  var openUploadWindow = function () {
    document.querySelector('.img-upload__overlay').classList.remove('hidden');
    document.querySelector('#upload-cancel').addEventListener('click', closeUploadWindow);
    claerEffects();
    textHashtags.focus();
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
    if (evt.keyCode === window.utils.ESC_KEY && checkClosingCondition()) {
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

  // Устанавливает значение фильтра для передачи на сервер
  var setEffectValue = function (value) {
    effectLevel.querySelector('.effect-level__value').value = value;
  };

  // Устанавливает фтльтр "Хром"
  var setGrayscale = function (ratio, previewElement) {
    previewElement.classList.add('effects__preview--chrome');
    setEffectValue(ratio);
    previewElement.style.filter = 'grayscale(' + ratio + ')';
  };

  // Устанавливает фильтр "Сепия"
  var setSepia = function (ratio, previewElement) {
    previewElement.classList.add('effects__preview--sepia');
    setEffectValue(ratio);
    previewElement.style.filter = 'sepia(' + ratio + ')';
  };

  // Устанавливает фильтр "Марвин"
  var setInvert = function (ratio, previewElement) {
    previewElement.classList.add('effects__preview--marvin');
    setEffectValue(ratio);
    previewElement.style.filter = 'invert(' + ratio + ')';
  };

  // Устанавливает фильтр "Фобос"
  var setBlur = function (ratio, previewElement) {
    previewElement.classList.add('effects__preview--phobos');
    var value = (BLUR_MIN_VALUE + ratio * (BLUR_MAX_VALUE - BLUR_MIN_VALUE)).toFixed(2);
    setEffectValue(value);
    previewElement.style.filter = 'blur(' + value + 'px)';
  };

  // Устанавливает фильтр "Зной"
  var setBrightness = function (ratio, previewElement) {
    previewElement.classList.add('effects__preview--heat');
    var value = (BRIGHTNESS_MIN_VALUE + ratio * (BRIGHTNESS_MAX_VALUE - BRIGHTNESS_MIN_VALUE)).toFixed(2);
    setEffectValue(value);
    previewElement.style.filter = 'brightness(' + value + ')';
  };

  // Сбрасывает значения фильтра до оригинального изображения
  var setOrigin = function (previewElement) {
    setEffectValue('');
    previewElement.style.filter = '';
  };

  // Устанавлиет текущий фильтер
  var setFilter = function (ratio) {
    var filterName = document.querySelector('.effects__radio:checked').value;
    clearPerview();
    switch (filterName) {
      case 'chrome': {
        setGrayscale(ratio, previewElement);
        return;
      }
      case 'sepia': {
        setSepia(ratio, previewElement);
        return;
      }
      case 'marvin': {
        setInvert(ratio, previewElement);
        return;
      }
      case 'phobos': {
        setBlur(ratio, previewElement);
        return;
      }
      case 'heat': {
        setBrightness(ratio, previewElement);
        return;
      }
      default:
        setOrigin(previewElement);
        return;
    }
  };

  // Удаляет css класс фильтра с элемента превью
  var clearPerview = function () {
    previewElement.classList.remove('effects__preview--chrome');
    previewElement.classList.remove('effects__preview--sepia');
    previewElement.classList.remove('effects__preview--marvin');
    previewElement.classList.remove('effects__preview--phobos');
    previewElement.classList.remove('effects__preview--heat');
  };

  // Проверяет возмозность закрытия окна формы
  var checkClosingCondition = function () {
    return !textHashtags.hasFocus && !textDescription.hasFocus;
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
    document.querySelectorAll('.effects__radio').forEach(function (value) {
      value.addEventListener('change', effectsRadioChangeHandler);
    });
  };

  // Валидирует строку с хэштегами
  var validateHashtags = function (element) {
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
    validateHashtags(textHashtags);
  };

  // Обработчик события focus
  var elementFocusHandler = function (evt) {
    evt.target.hasFocus = true;
  };

  // Обработчик события blur
  var elementBlurHandler = function (evt) {
    evt.target.hasFocus = false;
  };

  // Инициализирует обработчики текстовых полей ввода
  var initTextElement = function (element) {
    element.addEventListener('focus', elementFocusHandler);
    element.addEventListener('blur', elementBlurHandler);
  };

  var effectLevel = document.querySelector('.effect-level');
  var textHashtags = document.querySelector('.text__hashtags');
  initTextElement(textHashtags);
  var textDescription = document.querySelector('.text__description');
  initTextElement(textDescription);
  var previewElement = document.querySelector('.img-upload__preview');
  document.querySelector('#upload-file').addEventListener('change', uplaodFileChangeHandler);
  document.addEventListener('keydown', documentKeydownHandler);
  document.querySelector('.scale__control--bigger').addEventListener('click', scaleBiggerClickHandler);
  document.querySelector('.scale__control--smaller').addEventListener('click', scaleSmallerClickHandler);

  window.slider.init(setFilter);
  initializeEffectsRadio();
  document.querySelector('.img-upload__submit').addEventListener('click', uploadSubmitClickHandler);

})();
