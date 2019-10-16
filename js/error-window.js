'use strict';

(function () {
  if (!window.errorWindow) {
    window.errorWindow = {};
  }

  var template = document.querySelector('#error').content.querySelector('.error');
  var mainElement = document.querySelector('main');
  var element;

  window.errorWindow.show = function (message) {
    element = template.cloneNode(true);
    element.style.zIndex = 5;
    element.querySelector('.error__title').textContent = message;
    var buttonElements = element.querySelectorAll('.error__button');

    buttonElements.forEach(function (item) {
      item.addEventListener('click', function (evt) {
        closeErrorWindow();
        evt.preventDefault();
      });
    });
    element.querySelector('.error__inner').addEventListener('click', function (evt) {
      evt.stopPropagation();
    });

    mainElement.insertBefore(element, mainElement.children[0]);
    buttonElements[0].focus();
    document.addEventListener('keydown', documetKeydownHandler);
    document.addEventListener('click', documentClickHandler);
  };

  var closeErrorWindow = function () {
    element.remove();
    document.removeEventListener('keydown', documetKeydownHandler);
    document.removeEventListener('click', documentClickHandler);
  };

  var documetKeydownHandler = function (evt) {
    if (window.keyboard.isEscPressed(evt)) {
      closeErrorWindow();
    }
  };

  var documentClickHandler = function () {
    closeErrorWindow();
  };

})();
