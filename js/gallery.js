'use strict';
(function () {

  var loadPhotos = function (photos) {
    var photoTemplate = document.querySelector('#picture')
      .content
      .querySelector('.picture');
    document.querySelector('.pictures')
      .appendChild(window.picture.createPictures(photoTemplate, photos));
  };

  var showError = function (message) {
    console.log(message);
  };

  window.interaction.load(loadPhotos, showError);
})();
