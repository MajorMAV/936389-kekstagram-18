'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var fileInputElement = document.querySelector('#upload-file');
  var previewElement = document.querySelector('.img-upload__preview');
  var previewImageElement = previewElement.querySelector('img');

  var FileChooser = function (changeHandler) {
    fileInputElement.addEventListener('change', function () {
      var file = fileInputElement.files[0];
      if (!file) {
        return;
      }
      var fileName = file.name.toLowerCase();

      var matches = FILE_TYPES.some(function (it) {
        return fileName.endsWith(it);
      });

      if (matches) {
        var reader = new FileReader();

        reader.addEventListener('load', function () {
          previewImageElement.src = reader.result;
        });
        reader.readAsDataURL(file);
        clearPreview();
        if (changeHandler && typeof (changeHandler) === 'function') {
          changeHandler();
        }
      } else {
        window.utils.showError('Допустимы только файлы следующих форматов:' + FILE_TYPES.toString());
        clearInput();
      }
    });

    var clearPreview = function () {
      previewImageElement.src = '';
    };

    var clearInput = function () {
      fileInputElement.value = '';
    };

    FileChooser.prototype.clear = function () {
      clearInput();
      clearPreview();
    };

  };

  window.FileChooser = FileChooser;
})();
