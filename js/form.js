'use strict';
(function () {
  var EMPTY_STRING = '';
  var effectLevelElement = document.querySelector('.effect-level');
  var originRadioElement = document.querySelector('input[type=radio][checked]');
  var radioInputElements = document.querySelectorAll('.effects__radio');
  var textHashtagsElement = document.querySelector('.text__hashtags');
  var textDescriptionElement = document.querySelector('.text__description');
  var previewElement = document.querySelector('.img-upload__preview');
  var scaleElement = document.querySelector('.scale');
  var uploadOverlayElement = document.querySelector('.img-upload__overlay');

  var form = document.querySelector('.img-upload__form');
  var uploadSubmitElement = form.querySelector('.img-upload__submit');
  var uploadCancelElement = document.querySelector('#upload-cancel');

  var claerEffects = function () {
    window.scale.clear();
    window.filter.clear();
    window.slider.setVisibility(false);
    textHashtagsElement.value = '';
    textDescriptionElement.value = '';
  };

  var openUploadWindow = function () {
    uploadOverlayElement.classList.remove('hidden');
    uploadCancelElement.addEventListener('click', uploadCancelClickHandler);
    claerEffects();
    setSubmitButtonActive(true);
    originRadioElement.focus();
  };

  var closeUploadWindow = function () {
    claerEffects();
    uploadOverlayElement.classList.add('hidden');
    uploadCancelElement.removeEventListener('click', uploadCancelClickHandler);
    chooser.clear();
  };

  var uplaodFileChangeHandler = function () {
    openUploadWindow();
  };

  var uploadCancelClickHandler = function () {
    closeUploadWindow();
  };

  var documentKeydownHandler = function (evt) {
    if (window.keyboard.isEscPressed(evt) && checkClosingCondition()) {
      closeUploadWindow();
    }
  };

  var checkClosingCondition = function () {
    return !textHashtagsElement.hasFocus && !textDescriptionElement.hasFocus;
  };

  var validateHashtags = function (element) {
    var value = element.value;
    var hashtags = value.replace(/\s{2,}/gi, ' ').trim().split(' ');
    var errors = [];
    var errorExistence = false;
    element.setCustomValidity('');
    if (hashtags[0] !== EMPTY_STRING) {
      hashtags.forEach(function (hash) {
        var re = /(^#+)([\wА-Яа-я-=+*&^%$@!~`/#|(){}№;:?\.,<>_"'\\]+$)/;
        if (!re.test(hash)) {
          errors.push(hash);
        }
      });
    }
    if (errors.length > 0) {
      element.setCustomValidity('Строка содержит невалидные заначения: ' + errors.join(', '));
      errorExistence = true;
    } else {
      errorExistence = checkLengthHashtags(hashtags, element, errorExistence);
      errorExistence = checkCountHashtags(hashtags, element, errorExistence);
      errorExistence = checkRepeatHashtags(hashtags, element, errorExistence);
    }
    return errorExistence;
  };

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

  var highlightElementError = function (element) {
    element.style.outline = '3px solid red';
  };

  var extinguishElementError = function (element) {
    element.style.outline = '';
  };

  var formatTextDescription = function () {
    textDescriptionElement.value = textDescriptionElement.value.replace(/\n/g, ' ');
  };

  var uploadSubmitClickHandler = function (evt) {
    extinguishElementError(textHashtagsElement);
    formatTextDescription();
    var invalid = validateHashtags(textHashtagsElement);
    if (invalid) {
      highlightElementError(textHashtagsElement);
      return;
    }
    if (form.checkValidity()) {
      evt.preventDefault();
      setSubmitButtonActive(false);
      window.interaction.upload(form, uploadSuccessHandler, uploadErrorHandler);
    }
  };

  var uploadSuccessHandler = function () {
    window.modalWindow.showSuccess(closeUploadWindow);
  };

  var uploadErrorHandler = function () {
    window.modalWindow.showError();
    setSubmitButtonActive(true);
  };

  var setSubmitButtonActive = function (isActive) {
    uploadSubmitElement.disabled = !isActive;
  };

  var chooser = new window.FileChooser(uplaodFileChangeHandler);

  window.util.trackFocus(textDescriptionElement);
  window.util.trackFocus(textHashtagsElement);

  window.scale.initialize(scaleElement, previewElement);
  window.filter.initialize(effectLevelElement, radioInputElements, previewElement);
  window.slider.initialize(window.filter.setEffect);

  document.addEventListener('keydown', documentKeydownHandler);
  uploadSubmitElement.addEventListener('click', uploadSubmitClickHandler);

})();
