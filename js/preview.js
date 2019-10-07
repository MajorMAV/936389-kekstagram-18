'use strict';
(function () {

  var bigPictureElement = document.querySelector('.big-picture');
  var bigPhoto = bigPictureElement.querySelector('.big-picture__img img');
  var likesCount = bigPictureElement.querySelector('.likes-count');
  var socialCaption = bigPictureElement.querySelector('.social__caption');
  var commentsCount = bigPictureElement.querySelector('.comments-count');
  var socialComments = bigPictureElement.querySelector('.social__comments');
  var socialCommentCount = bigPictureElement.querySelector('.social__comment-count');
  var commentsLoader = bigPictureElement.querySelector('.comments-loader');
  var pictureCancel = bigPictureElement.querySelector('#picture-cancel');

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
    bigPhoto.src = photo.url;
    likesCount.textContent = photo.likes;
    socialCaption.textContent = photo.description;
    commentsCount.textContent = photo.comments.length;
    fillComments(socialComments, photo.comments);
    socialCommentCount.classList.add('visually-hidden');
    commentsLoader.classList.add('visually-hidden');
    bigPictureElement.classList.remove('hidden');
    pictureCancel.addEventListener('click', pictureCancelClickHandler);
    document.body.classList.add('modal-open');
  };

  // Закрывет окно с большой фоткой
  var hiddenBigPicture = function () {
    bigPictureElement.classList.add('hidden');
    pictureCancel.removeEventListener('click', pictureCancelClickHandler);
    document.body.classList.remove('modal-open');
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
