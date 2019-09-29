'use strict';
(function () {
  // #region Свободный код
  var photos = window.data.createPhotos(window.data.PHOTO_COUNT);
  var photoTemplate = document.querySelector('#picture')
    .content
    .querySelector('.picture');
  document.querySelector('.pictures')
    .appendChild(window.picture.createPictures(photoTemplate, photos));
  // #endregion
})();
