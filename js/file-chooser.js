'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var fileInputElement = document.querySelector('#upload-file');
  var previewElement = document.querySelector('.img-upload__preview');
  var previewImageElement = previewElement.querySelector('img');

  var fileChooserChangeHandler;

  var FileChooser = function (callback) {
    fileChooserChangeHandler = callback;
    fileInputElement.addEventListener('change', function () {
      var file = fileInputElement.files[0];
      if (!file) {
        return;
      }
      if (checkFileExtention(file.name)) {
        readFile(file);
      } else {
        window.util.showError('Допустимы только файлы следующих форматов:' + FILE_TYPES.toString());
        clearInput();
      }
    });
  };

  var checkFileExtention = function (fileName) {
    fileName = fileName.toLowerCase();
    return FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });
  };

  var readFile = function (source) {
    var reader = new FileReader();
    reader.addEventListener('load', function () {
      previewImageElement.src = reader.result;
    });
    reader.readAsDataURL(source);
    clearPreview();
    if (fileChooserChangeHandler && typeof (fileChooserChangeHandler) === 'function') {
      fileChooserChangeHandler();
    }
  };

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

  window.FileChooser = FileChooser;
})();
