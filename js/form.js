'use strict';
(function () {

  var effectLevel = document.querySelector('.effect-level');
  var originRadio = document.querySelector('input[type=radio][checked]');
  var radioInputs = document.querySelectorAll('.effects__radio');
  var textHashtags = document.querySelector('.text__hashtags');
  var textDescription = document.querySelector('.text__description');
  var previewElement = document.querySelector('.img-upload__preview');
  var scaleElement = document.querySelector('.scale');
  var uploadOverlay = document.querySelector('.img-upload__overlay');

  var form = document.querySelector('.img-upload__form');
  var uploadSubmit = form.querySelector('.img-upload__submit');
  var uploadCancel = document.querySelector('#upload-cancel');

  // Сбрасывает примененые эфеккты до начального значения
  var claerEffects = function () {
    window.scale.clear();
    window.slider.setVisibilityEffectSlider(false);
    textHashtags.value = '';
    textDescription.value = '';
  };

  // Открывет окно редактирования изображения
  var openUploadWindow = function () {
    uploadOverlay.classList.remove('hidden');
    uploadCancel.addEventListener('click', closeUploadWindow);
    claerEffects();
    setSubmitButtonActive(true);
    originRadio.focus();
  };

  // Закрывает окно редактирования изображения
  var closeUploadWindow = function () {
    claerEffects();
    uploadOverlay.classList.add('hidden');
    uploadCancel.removeEventListener('click', closeUploadWindow);
    chooser.clear();
  };

  // Обработчик onChange поля загрузки файла
  var uplaodFileChangeHandler = function () {
    openUploadWindow();
  };

  // Обработчик onKeydown для документа
  var documentKeydownHandler = function (evt) {
    if (evt.keyCode === window.utils.KeyCode.ESC && checkClosingCondition()) {
      closeUploadWindow();
    }
  };

  // Проверяет возмозность закрытия окна формы
  var checkClosingCondition = function () {
    return !textHashtags.hasFocus && !textDescription.hasFocus;
  };

  // Валидирует строку с хэштегами
  var validateHashtags = function (element) {
    var value = element.value;
    var hashtags = value.replace(/\s{2,}/gi, ' ').trim().split(' ');
    var errors = [];
    var haveError = false;
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
      haveError = true;
    } else {
      haveError = checkLengthHashtags(hashtags, element, haveError);
      haveError = checkCountHashtags(hashtags, element, haveError);
      haveError = checkRepeatHashtags(hashtags, element, haveError);
    }
    return haveError;
  };

  // Проверяет длину хэштегов
  var checkLengthHashtags = function (hashtags, element, error) {
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

  var highlightElementError = function (element) {
    element.style.outline = '3px solid red';
  };

  var extinguishElementError = function (element) {
    element.style.outline = '';
  };

  var formatTextDescription = function () {
    textDescription.value = textDescription.value.replace(/\n/g, ' ');
  };

  // Обработчик события Submit
  var uploadSubmitClickHandler = function (evt) {
    extinguishElementError(textHashtags);
    formatTextDescription();
    var invalid = validateHashtags(textHashtags);
    if (invalid) {
      highlightElementError(textHashtags);
      return;
    }
    if (form.checkValidity()) {
      evt.preventDefault();
      setSubmitButtonActive(false);
      window.interaction.upload(form, uploadSuccessHandler, uploadErrorHandler);
    }
  };

  var uploadSuccessHandler = function () {
    window.successWindow.show(closeUploadWindow);
  };

  var uploadErrorHandler = function () {
    window.errorWindow.show();
    setSubmitButtonActive(true);
  };

  var setSubmitButtonActive = function (isActive) {
    uploadSubmit.disabled = !isActive;
  };

  var chooser = new window.FileChooser(uplaodFileChangeHandler);

  window.utils.trackFocus(textDescription);
  window.utils.trackFocus(textHashtags);

  window.scale.init(scaleElement, previewElement);
  window.filter.init(effectLevel, radioInputs, previewElement);
  window.slider.init(window.filter.setFilter);

  document.addEventListener('keydown', documentKeydownHandler);
  uploadSubmit.addEventListener('click', uploadSubmitClickHandler);

})();
