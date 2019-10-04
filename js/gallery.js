'use strict';
(function () {

  var loadPhotos = function (photos) {
    var photoTemplate = document.querySelector('#picture')
      .content
      .querySelector('.picture');
    document.querySelector('.pictures')
      .appendChild(window.picture.createPictures(photoTemplate, photos));
  };

  window.interaction.load(loadPhotos, window.errorWindow.show);
})();
