'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var fileInput = document.querySelector('#upload-file');
  var previewElement = document.querySelector('.img-upload__preview');
  var previewImg = previewElement.querySelector('img');

  var FileChooser = function (changeHandler) {
    fileInput.addEventListener('change', function () {
      var file = fileInput.files[0];
      var fileName = file.name.toLowerCase();

      var matches = FILE_TYPES.some(function (it) {
        return fileName.endsWith(it);
      });

      if (matches) {
        var reader = new FileReader();

        reader.addEventListener('load', function () {
          previewImg.src = reader.result;
        });

        reader.readAsDataURL(file);
      }

      clearPreview();

      if (changeHandler && typeof (changeHandler) === 'function') {
        changeHandler();
      }
    });

    var clearPreview = function () {
      previewImg.src = '';
    };

    var clearInput = function () {
      fileInput.value = '';
    };

    FileChooser.prototype.clear = function () {
      clearInput();
      clearPreview();
    };

  };

  window.FileChooser = FileChooser;
})();
