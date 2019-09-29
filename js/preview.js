'use strict';
(function () {

  if (!window.preview) {
    window.preview = {};
  }

  // Создаем элемент для отображение комментария
  var createCommentElement = function (options) {
    var item = document.createElement('li');
    item.classList.add('social__comment');
    item.innerHTML = '<img class="social__picture" ' +
      'src="' + options.avatar + '" ' +
      'alt="' + options.name + '" ' +
      'width="35" height="35">' +
      '<p class="social__text">' + options.message + '</p>';
    return item;
  };

  // Создаем список элементов отображения комментариев
  var createCommentElements = function (comments) {
    var docFragment = document.createDocumentFragment();
    comments.forEach(function (value) {
      docFragment.appendChild(createCommentElement(value));
    });
    return docFragment;
  };

  // Наполняем контейнер комментариев
  var fillComments = function (container, comments) {
    container.innerHTML = '';
    container.appendChild(createCommentElements(comments));
  };

  // Показываем большую фотографию
  var showBigPicture = function (photo) {
    var bigPictureElement = document.querySelector('.big-picture');
    bigPictureElement.querySelector('.big-picture__img img').src = photo.url;
    bigPictureElement.querySelector('.likes-count').textContent = photo.likes;
    bigPictureElement.querySelector('.social__caption').textContent = photo.description;
    bigPictureElement.querySelector('.comments-count').textContent = photo.comments.length;
    fillComments(bigPictureElement.querySelector('.social__comments'), photo.comments);
    bigPictureElement.querySelector('.social__comment-count').classList.add('visually-hidden');
    bigPictureElement.querySelector('.comments-loader').classList.add('visually-hidden');
    bigPictureElement.classList.remove('hidden');
    bigPictureElement.querySelector('#picture-cancel').addEventListener('click', pictureCancelClickHandler);
  };

  // Закрывет окно с большой фоткой
  var hiddenBigPicture = function () {
    document.querySelector('.big-picture').classList.add('hidden');
    document.querySelector('#picture-cancel').removeEventListener('click', pictureCancelClickHandler);
  };

  // Обработчик onClick для открытия окна с большой фоткой
  window.preview.createPhotoElementHandler = function (photo) {
    return function () {
      showBigPicture(photo);
    };
  };

  // Обработчик onClick для закрытия окна с большой фоткой
  var pictureCancelClickHandler = function () {
    hiddenBigPicture();
  };

  // Обработчик onKeydown для документа
  var documentKeydownHandler = function (evt) {
    if (evt.keyCode === window.utils.ESC_KEY) {
      hiddenBigPicture();
    }
  };

  document.addEventListener('keydown', documentKeydownHandler);
})();
