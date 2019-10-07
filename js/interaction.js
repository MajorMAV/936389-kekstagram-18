'use strict';
(function () {
  var TIMEOUT = 5000;
  var OK_STATUS = 200;
  var BAD_REQUEST_STATUS = 400;
  var UNAUTHORIZED_STATUS = 401;
  var NOT_FOUND_STATUS = 404;

  if (!window.interaction) {
    window.interaction = {};
  }

  var sendRequest = function (options) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = TIMEOUT;

    xhr.addEventListener('load', function () {
      var error;
      switch (xhr.status) {
        case OK_STATUS:
          options.onSuccess(xhr.response);
          break;
        case BAD_REQUEST_STATUS:
          error = 'Неверный запрос';
          break;
        case UNAUTHORIZED_STATUS:
          error = 'Пользователь не авторизован';
          break;
        case NOT_FOUND_STATUS:
          error = 'Ничего не найдено';
          break;
        default:
          error = 'Статус ответа: ' + xhr.status + ' ' + xhr.statusText;
      }

      if (error) {
        options.onError(error);
      }
    });

    xhr.addEventListener('error', function () {
      options.onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      options.onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.open(options.method, options.url);
    if (options.data) {
      xhr.send(options.data);
    } else {
      xhr.send();
    }
  };

  window.interaction.load = function (onSuccess, onError) {
    var options = {
      method: 'GET',
      url: window.utils.DATA_URL,
      onSuccess: onSuccess,
      onError: onError
    };
    sendRequest(options);
  };

  window.interaction.upload = function (form, onSuccess, onError) {
    var options = {
      method: form.method,
      url: form.action,
      data: new FormData(form),
      onSuccess: onSuccess,
      onError: onError
    };
    sendRequest(options);
  };
})();
