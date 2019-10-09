'use strict';
(function () {

  if (!window.picture) {
    window.picture = {};
  }

  // Заполняет элемент, отображающий фото, данными
  var fillPhotoElement = function (element, data) {
    element.querySelector('.picture__img').src = data.url;
    element.querySelector('.picture__comments').textContent = data.comments.length;
    element.querySelector('.picture__likes').textContent = data.likes;
    element.addEventListener('click', window.preview.createPhotoElementHandler(data));
    return element;
  };

  // Создает и заполняет DocumentFragment
  window.picture.createPictures = function (template, photos, fragment) {
    photos.forEach(function (value) {
      var clone = template.cloneNode(true);
      fragment.appendChild(fillPhotoElement(clone, value));
    });
    return fragment;
  };
})();
