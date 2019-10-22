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

  var createCommentElement = function (source) {
    var item = document.createElement('li');
    item.classList.add('social__comment');
    item.innerHTML = '<img class="social__picture" ' +
      'src="' + source.avatar + '" ' +
      'alt="' + source.name + '" ' +
      'width="35" height="35">' +
      '<p class="social__text">' + source.message + '</p>';
    return item;
  };

  var createCommentElements = function (comments) {
    var docFragment = document.createDocumentFragment();
    comments.forEach(function (item) {
      docFragment.appendChild(createCommentElement(item));
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

  var clearCommentsContainer = function (container) {
    container.innerHTML = '';
  };

  var fillComments = function (container, comments) {
    container.appendChild(createCommentElements(comments));
  };

  var createCommentIterator = function (comments) {
    var startViewCommentIndex = 0;
    var getCommentPortion = function () {
      var isEnd = startViewCommentIndex + VIEW_COMMENT_STEP >= comments.length;
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
    return getCommentPortion;
  };

  var showBigPicture = function (photo) {
    bigPhotoElement.src = photo.url;
    likesCountElement.textContent = photo.likes;
    socialCaptionElement.textContent = photo.description;
    commentsCountElement.textContent = photo.comments.length;
    commentIterator = createCommentIterator(photo.comments);
    clearCommentsContainer(socialCommentsElement);
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

  var hiddenBigPicture = function () {
    clearSocialFooterText();
    bigPictureElement.classList.add('hidden');
    pictureCancelElement.removeEventListener('click', pictureCancelClickHandler);
    commentsLoaderElement.removeEventListener('click', commentLoaderClickHandler);
    document.body.classList.remove('modal-open');
  };

  var clearSocialFooterText = function () {
    socialFooterTextElement.value = '';
  };

  var createFnc = function (photo) {
    return function () {
      showBigPicture(photo);
    };
  };

  var pictureCancelClickHandler = function () {
    hiddenBigPicture();
  };

  var documentKeydownHandler = function (evt) {
    if (window.keyboard.isEscPressed(evt)) {
      hiddenBigPicture();
    }
  };

  document.addEventListener('keydown', documentKeydownHandler);

  window.preview = {
    create: createFnc
  };

})();
