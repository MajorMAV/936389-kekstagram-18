'use strict';

(function () {
  if (!window.successWindow) {
    window.successWindow = {};
  }

  var template = document.querySelector('#success').content.querySelector('.success');
  var mainElement = document.querySelector('main');
  var element;
  var callbackAction;
  window.successWindow.show = function (callback) {
    element = template.cloneNode(true);
    element.style.zIndex = 5;
    callbackAction = callback;
    var button = element.querySelector('.success__button');
    button.addEventListener('click', function (evt) {
      closeSuccessWindow();
      evt.stopPropagation();
    });
    element.querySelector('.success__inner').addEventListener('click', function (evt) {
      evt.stopPropagation();
    });

    mainElement.insertBefore(element, mainElement.children[0]);
    button.focus();
    document.addEventListener('keydown', documentKeydownHandler);
    document.addEventListener('click', documentClickHandler);
  };

  var closeSuccessWindow = function () {
    element.remove();
    document.removeEventListener('keydown', documentKeydownHandler);
    document.removeEventListener('click', documentClickHandler);
    if (callbackAction && (typeof callbackAction) === 'function') {
      callbackAction();
    }
  };

  var documentKeydownHandler = function (evt) {
    if (evt.keyCode === window.utils.KeyCode.ESC) {
      closeSuccessWindow();
    }
  };

  var documentClickHandler = function () {
    closeSuccessWindow();
  };
})();
