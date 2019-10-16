'use strict';
(function () {

  var VIEW_COMMENT_STEP = 5;

  var bigPictureElement = document.querySelector('.big-picture');
  var bigPhotoElement = bigPictureElement.querySelector('.big-picture__img img');
  var likesCountElement = bigPictureElement.querySelector('.likes-count');
  var socialCaptionElement = bigPictureElement.querySelector('.social__caption');
  var commentsCountElement = bigPictureElement.querySelector('.comments-count');
  var socialCommentsElement = bigPictureElement.querySelector('.social__comments');
  var socialCommentCountElement = bigPictureElement.querySelector('.social__comment-count');
  var commentsLoaderElement = bigPictureElement.querySelector('.comments-loader');
  var pictureCancelElement = bigPictureElement.querySelector('#picture-cancel');
  var socialFooterTextElement = bigPictureElement.querySelector('.social__footer-text');
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
      commentsLoaderElement.classList.remove('visually-hidden');
    } else {
      commentsLoaderElement.classList.add('visually-hidden');
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
    bigPhotoElement.src = photo.url;
    likesCountElement.textContent = photo.likes;
    socialCaptionElement.textContent = photo.description;
    commentsCountElement.textContent = photo.comments.length;
    commentIterator = createCommentIterator(photo.comments);
    fillComments(socialCommentsElement, commentIterator());
    socialCommentCountElement.classList.add('visually-hidden');
    bigPictureElement.classList.remove('hidden');
    socialFooterTextElement.focus();
    pictureCancelElement.addEventListener('click', pictureCancelClickHandler);
    commentsLoaderElement.addEventListener('click', commentLoaderClickHandler);
    document.body.classList.add('modal-open');
  };

  var commentLoaderClickHandler = function () {
    fillComments(socialCommentsElement, commentIterator());
  };

  // Закрывет окно с большой фоткой
  var hiddenBigPicture = function () {
    bigPictureElement.classList.add('hidden');
    pictureCancelElement.removeEventListener('click', pictureCancelClickHandler);
    commentsLoaderElement.removeEventListener('click', commentLoaderClickHandler);
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
