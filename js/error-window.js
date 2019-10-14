'use strict';

(function () {
  if (!window.errorWindow) {
    window.errorWindow = {};
  }

  var template = document.querySelector('#error').content.querySelector('.error');
  var main = document.querySelector('main');
  var element;

  window.errorWindow.show = function (message) {
    element = template.cloneNode(true);
    element.style.zIndex = 5;
    element.querySelector('.error__title').textContent = message;
    var buttons = element.querySelectorAll('.error__button');

    buttons.forEach(function (item) {
      item.addEventListener('click', function (evt) {
        closeErrorWindow();
        evt.preventDefault();
      });
    });
    element.querySelector('.error__inner').addEventListener('click', function (evt) {
      evt.stopPropagation();
    });


    main.insertBefore(element, main.children[0]);
    document.addEventListener('keydown', keydownHandler);
    document.addEventListener('click', clickHandler);
  };

  var closeErrorWindow = function () {
    element.remove();
    document.removeEventListener('keydown', keydownHandler);
    document.removeEventListener('click', clickHandler);
  };

  var keydownHandler = function (evt) {
    if (evt.keyCode === window.utils.KeyCode.ESC) {
      closeErrorWindow();
    }
  };

  var clickHandler = function () {
    closeErrorWindow();
  };

})();
