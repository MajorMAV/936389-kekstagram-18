'use strict';

(function () {
  if (!window.successWindow) {
    window.successWindow = {};
  }

  var template = document.querySelector('#success').content.querySelector('.success');
  var main = document.querySelector('main');
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

    main.insertBefore(element, main.children[0]);
    document.addEventListener('keydown', keydownHandler);
    document.addEventListener('click', clickHandler);
  };

  var closeSuccessWindow = function () {
    element.remove();
    document.removeEventListener('keydown', keydownHandler);
    document.removeEventListener('click', clickHandler);
    if (callbackAction && (typeof callbackAction) === 'function') {
      callbackAction();
    }
  };

  var keydownHandler = function (evt) {
    if (evt.keyCode === window.utils.ESC_KEY) {
      closeSuccessWindow();
    }
  };

  var clickHandler = function () {
    closeSuccessWindow();
  };
})();
