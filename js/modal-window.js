'use strict';

(function () {
  var successTemplateElement = document.querySelector('#success').content.querySelector('.success');
  var errorTemplateElement = document.querySelector('#error').content.querySelector('.error');
  var mainElement = document.querySelector('main');
  var element;
  var callbackAction;

  var showSuccessFnc = function (callback) {
    createElement(successTemplateElement);
    callbackAction = callback;
    var buttons = initializeButtons('.success__button');
    initializeInactiveRect('.success__inner');
    initializeWindow(buttons[0]);
  };

  var showErrorFnc = function (message) {
    createElement(errorTemplateElement);
    element.querySelector('.error__title').textContent = message;
    var buttons = initializeButtons('.error__button');
    initializeInactiveRect('.error__inner');
    initializeWindow(buttons[0]);
  };

  var createElement = function (template) {
    element = template.cloneNode(true);
    element.style.zIndex = 5;
  };

  var initializeButtons = function (selector) {
    var buttonElements = element.querySelectorAll(selector);
    buttonElements.forEach(function (item) {
      item.addEventListener('click', function (evt) {
        closeWindow();
        evt.stopPropagation();
      });
    });
    return buttonElements;
  };

  var initializeInactiveRect = function (selector) {
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

  window.modalWindow = {
    showError: showErrorFnc,
    showSuccess: showSuccessFnc
  };

})();
