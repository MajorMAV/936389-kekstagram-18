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

  var formElement = document.querySelector('.img-upload__form');
  var uploadSubmitElement = formElement.querySelector('.img-upload__submit');
  var uploadCancelElement = document.querySelector('#upload-cancel');

  var clearEffects = function () {
    window.scale.clear();
    window.filter.clear();
    window.slider.setVisibility(false);
    textHashtagsElement.value = '';
    textDescriptionElement.value = '';
  };

  var openUploadWindow = function () {
    uploadOverlayElement.classList.remove('hidden');
    uploadCancelElement.addEventListener('click', uploadCancelClickHandler);
    clearEffects();
    setSubmitButtonActive(true);
    originRadioElement.focus();
  };

  var closeUploadWindow = function () {
    clearEffects();
    uploadOverlayElement.classList.add('hidden');
    uploadCancelElement.removeEventListener('click', uploadCancelClickHandler);
    chooser.clear();
  };

  var uploadFileChangeHandler = function () {
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
    var hashtags = checkHashtasExistence(element);
    if (!hashtags) {
      return false;
    }
    if (checkHashtagsLength(hashtags, element)) {
      return false;
    }
    if (checkHashtagsCount(hashtags, element)) {
      return false;
    }
    if (checkHashtagsRepeat(hashtags, element)) {
      return false;
    }
    return true;
  };

  var checkHashtasExistence = function (element) {
    var value = element.value;
    var hashtags = value.replace(/\s{2,}/gi, ' ').trim().split(' ');
    var errors = [];
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
      return null;
    }
    return hashtags;
  };

  var checkHashtagsLength = function (hashtags, element) {
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

  var checkHashtagsCount = function (hashtags, element) {
    if (hashtags.length > 5) {
      element.setCustomValidity('Строка содержит более 5 хэштегов');
      return true;
    }
    return false;
  };

  var checkHashtagsRepeat = function (hashtags, element) {
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
    if (!validateHashtags(textHashtagsElement)) {
      highlightElementError(textHashtagsElement);
      return;
    }
    if (formElement.checkValidity()) {
      evt.preventDefault();
      setSubmitButtonActive(false);
      window.interaction.upload(formElement, uploadSuccessHandler, uploadErrorHandler);
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

  var chooser = new window.FileChooser(uploadFileChangeHandler);

  window.util.trackFocus(textDescriptionElement);
  window.util.trackFocus(textHashtagsElement);

  window.scale.initialize(scaleElement, previewElement);
  window.filter.initialize(effectLevelElement, radioInputElements, previewElement);
  window.slider.initialize(window.filter.setEffect);

  document.addEventListener('keydown', documentKeydownHandler);
  uploadSubmitElement.addEventListener('click', uploadSubmitClickHandler);

})();
