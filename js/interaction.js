'use strict';
(function () {
  if (!window.interaction) {
    window.interaction = {};
  }
  var sendRequest = function (options) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = 1000;

    xhr.addEventListener('load', function () {
      var error;
      switch (xhr.status) {
        case 200:
          options.onSuccess(xhr.response);
          break;
        case 400:
          error = 'Неверный запрос';
          break;
        case 401:
          error = 'Пользователь не авторизован';
          break;
        case 404:
          error = 'Ничего не найдено';
          break;
        default:
          error = 'Статус ответа: ' + xhr.status + ' ' +xhr.statusText;
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
  }
})();
