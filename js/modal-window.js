'use strict';

(function () {
  if (!window.modalWindow) {
    window.modalWindow = {};
  }

  var successTemplate = document.querySelector('#success').content.querySelector('.success');
  var errorTemplate = document.querySelector('#error').content.querySelector('.error');
  var mainElement = document.querySelector('main');
  var element;
  var callbackAction;

  window.modalWindow.showSuccess = function (callback) {
    createElement(successTemplate);
    callbackAction = callback;
    var buttons = initButtons('.success__button');
    initInactiveRect('.success__inner');
    initializeWindow(buttons[0]);
  };

  window.modalWindow.showError = function (message) {
    createElement(errorTemplate);
    element.querySelector('.error__title').textContent = message;
    var buttons = initButtons('.error__button');
    initInactiveRect('.error__inner');
    initializeWindow(buttons[0]);
  };

  var createElement = function (template) {
    element = template.cloneNode(true);
    element.style.zIndex = 5;
  };

  var initButtons = function (selector) {
    var buttonElements = element.querySelectorAll(selector);
    buttonElements.forEach(function (item) {
      item.addEventListener('click', function (evt) {
        closeWindow();
        evt.stopPropagation();
      });
    });
    return buttonElements;
  };

  var initInactiveRect = function (selector) {
    element.querySelector(selector).addEventListener('click', function (evt) {
      evt.stopPropagation();
    });
  };

  var initializeWindow = function (focusingElement) {
    mainElement.insertBefore(element, mainElement.children[0]);
    focusingElement.focus();
    document.addEventListener('keydown', documentKeydownHandler);
    document.addEventListener('click', documentClickHandler);
  };

  var closeWindow = function () {
    element.remove();
    document.removeEventListener('keydown', documentKeydownHandler);
    document.removeEventListener('click', documentClickHandler);
    if (callbackAction && (typeof callbackAction) === 'function') {
      callbackAction();
      callbackAction = null;
    }
    element = null;
  };

  var documentKeydownHandler = function (evt) {
    if (window.keyboard.isEscPressed(evt)) {
      closeWindow();
    }
  };

  var documentClickHandler = function () {
    closeWindow();
  };
})();
