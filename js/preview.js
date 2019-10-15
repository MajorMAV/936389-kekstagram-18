'use strict';
(function () {

  var VIEW_COMMENT_STEP = 5;

  var bigPictureElement = document.querySelector('.big-picture');
  var bigPhoto = bigPictureElement.querySelector('.big-picture__img img');
  var likesCount = bigPictureElement.querySelector('.likes-count');
  var socialCaption = bigPictureElement.querySelector('.social__caption');
  var commentsCount = bigPictureElement.querySelector('.comments-count');
  var socialComments = bigPictureElement.querySelector('.social__comments');
  var socialCommentCount = bigPictureElement.querySelector('.social__comment-count');
  var commentsLoader = bigPictureElement.querySelector('.comments-loader');
  var pictureCancel = bigPictureElement.querySelector('#picture-cancel');
  var commentLoader = bigPictureElement.querySelector('.comments-loader');
  var socialFooterText = bigPictureElement.querySelector('.social__footer-text');
  var commentIterator;

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

  var setCommentLoaderVisibility = function (isVisible) {
    if (isVisible) {
      commentLoader.classList.remove('visually-hidden');
    } else {
      commentLoader.classList.add('visually-hidden');
    }
  };

  // Наполняем контейнер комментариев
  var fillComments = function (container, comments) {
    container.innerHTML = '';
    container.appendChild(createCommentElements(comments));
  };

  var createCommentIterator = function (comments) {
    var startViewCommentIndex = 0;
    var getCommetPortion = function () {
      var isEnd = startViewCommentIndex + VIEW_COMMENT_STEP > comments.length;
      var result;
      if (isEnd) {
        result = comments.slice(startViewCommentIndex, comments.length);
      } else {
        result = comments.slice(startViewCommentIndex, startViewCommentIndex + VIEW_COMMENT_STEP);
        startViewCommentIndex += VIEW_COMMENT_STEP;
      }
      setCommentLoaderVisibility(!isEnd);
      return result;
    };
    return function () {
      return getCommetPortion(comments);
    };
  };

  // Показываем большую фотографию
  var showBigPicture = function (photo) {
    bigPhoto.src = photo.url;
    likesCount.textContent = photo.likes;
    socialCaption.textContent = photo.description;
    commentsCount.textContent = photo.comments.length;
    commentIterator = createCommentIterator(photo.comments);
    fillComments(socialComments, commentIterator());
    socialCommentCount.classList.add('visually-hidden');
    bigPictureElement.classList.remove('hidden');
    socialFooterText.focus();
    pictureCancel.addEventListener('click', pictureCancelClickHandler);
    commentLoader.addEventListener('click', commentLoaderClickHandler);
    document.body.classList.add('modal-open');
  };

  var commentLoaderClickHandler = function () {
    fillComments(socialComments, commentIterator());
  };

  // Закрывет окно с большой фоткой
  var hiddenBigPicture = function () {
    bigPictureElement.classList.add('hidden');
    pictureCancel.removeEventListener('click', pictureCancelClickHandler);
    commentsLoader.removeEventListener('click', commentLoaderClickHandler);
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
    if (evt.keyCode === window.utils.KeyCode.ESC) {
      hiddenBigPicture();
    }
  };

  document.addEventListener('keydown', documentKeydownHandler);
})();
