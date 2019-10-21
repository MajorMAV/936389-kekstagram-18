'use strict';
(function () {
  var TIMEOUT = 5000;
  var DATA_URL = ' https://js.dump.academy/kekstagram/data';
  var Code = {
    SUCCESS: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404
  };

  var sendRequest = function (request) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = TIMEOUT;

    xhr.addEventListener('load', function () {
      var error;
      switch (xhr.status) {
        case Code.SUCCESS:
          request.successHandler(xhr.response);
          break;
        case Code.BAD_REQUEST:
          error = 'Неверный запрос';
          break;
        case Code.UNAUTHORIZED:
          error = 'Пользователь не авторизован';
          break;
        case Code.NOT_FOUND:
          error = 'Ничего не найдено';
          break;
        default:
          error = 'Статус ответа: ' + xhr.status + ' ' + xhr.statusText;
      }

      if (error) {
        request.errorHandler(error);
      }
    });

    xhr.addEventListener('error', function () {
      request.errorHandler('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      request.errorHandler('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.open(request.method, request.url);
    if (request.data) {
      xhr.send(request.data);
    } else {
      xhr.send();
    }
  };

  var loadFnc = function (successHandler, errorHandler) {
    var loadingRequest = {
      method: 'GET',
      url: DATA_URL,
      successHandler: successHandler,
      errorHandler: errorHandler
    };
    sendRequest(loadingRequest);
  };

  var uploadFnc = function (form, successHandler, errorHandler) {
    var uploadingRequest = {
      method: form.method,
      url: form.action,
      data: new FormData(form),
      successHandler: successHandler,
      errorHandler: errorHandler
    };
    sendRequest(uploadingRequest);
  };

  window.interaction = {
    load: loadFnc,
    upload: uploadFnc
  };
})();
