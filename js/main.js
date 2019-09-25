'use strict';

var COMMENTS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];
var PHOTO_COUNT = 25;
var MIN_LIKE_COUNT = 15;
var MAX_LIKE_COUNT = 200;
var AVATAR_COUNT = 6;
var USER_NAMES = [
  'Артем',
  'Руслан',
  'Светлана',
  'Александра',
  'Олег',
  'Любовь'
];
var ESC_KEY = 27;

// Возвращает функцию-генератор url фото
var getUrlGenerator = function (maxNumber) {
  var index = 0;
  return function () {
    if (index >= maxNumber) {
      index = 0;
    }
    index++;
    return 'photos/' + index + '.jpg';
  };
};

// Выдает случайный элемент массива
var getRandomElement = function (array) {
  var index = Math.round(Math.random() * (array.length - 1));
  return array[index];
};

// Выдает случайный url аватара
var getAvatar = function (maxNumber) {
  var avatarNumber = Math.ceil(Math.random() * maxNumber);
  return 'img/avatar-' + avatarNumber + '.svg';
};

// Генерирует массив случайных комментариев
var createRandomComments = function () {
  var commentCount = Math.ceil(Math.random() * AVATAR_COUNT);
  var comments = [];
  for (var i = 0; i < commentCount; i++) {
    comments.push({
      avatar: getAvatar(AVATAR_COUNT),
      message: getRandomElement(COMMENTS),
      name: getRandomElement(USER_NAMES)
    });
  }
  return comments;
};

// Генерирует массив фото
var createPhotos = function (count) {
  var photos = [];
  var createUrl = getUrlGenerator(count);
  for (var i = 0; i < count; i++) {
    photos.push({
      url: createUrl(),
      description: 'описание фотографии',
      likes: MIN_LIKE_COUNT + Math.round(Math.random() * (MAX_LIKE_COUNT - MIN_LIKE_COUNT)),
      comments: createRandomComments()
    });
  }
  return photos;
};

var createPhotoElementHandler = function (photo) {
  return function () {
    showBigPicture(photo);
  };
};

// Заполняет элемент, отображающий фото, данными
var fillPhotoElement = function (element, data) {
  element.querySelector('.picture__img').src = data.url;
  element.querySelector('.picture__comments').innerText = data.comments.length;
  element.querySelector('.picture__likes').innerText = data.likes;
  element.addEventListener('click', createPhotoElementHandler(data));
  return element;
};

// Создает и заполняет DocumentFragment
var createDocumentFragment = function (template, photos) {
  var docFragment = document.createDocumentFragment();
  photos.forEach(function (value) {
    var clone = template.cloneNode(true);
    docFragment.appendChild(fillPhotoElement(clone, value));
  });
  return docFragment;
};

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

// Создаем список елементов отображения комментариев
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

var hiddenBigPicture = function () {
  document.querySelector('.big-picture').classList.add('hidden');
  document.querySelector('#picture-cancel').removeEventListener('click', pictureCancelClickHandler);
};

var pictureCancelClickHandler = function () {
  hiddenBigPicture();
};
// #region Свободный код
var photos = createPhotos(PHOTO_COUNT);
var photoTemplate = document.querySelector('#picture')
  .content
  .querySelector('.picture');
document.querySelector('.pictures')
  .appendChild(createDocumentFragment(photoTemplate, photos));
// #endregion

var getScaleValue = function () {
  var scaleInput = document.querySelector('.scale__control--value');
  var scaleValue = Number(scaleInput.value.replace('%', ''));
  if (!scaleValue) {
    scaleValue = 100;
    scaleInput.value = '100%';
  }
  return scaleValue;
};

var setScaleValue = function (value) {
  document.querySelector('.scale__control--value').value = value + '%';
};

var setScale = function (value) {
  if (value < 25 || value > 100) {
    return;
  }
  setScaleValue(value);
  document.querySelector('.img-upload__preview').style.transform = 'scale(' + (getScaleValue() / 100) + ')';
};

var claerEffects = function () {
  setScale(100);
};

var openUploadWindow = function () {
  document.querySelector('.img-upload__overlay').classList.remove('hidden');
  document.querySelector('#upload-cancel').addEventListener('click', closeUploadWindow);
  claerEffects();
};

var closeUploadWindow = function () {
  document.querySelector('.img-upload__overlay').classList.add('hidden');
  document.querySelector('#upload-cancel').removeEventListener('click', closeUploadWindow);
  document.querySelector('#upload-file').value = '';
};

var uplaodFileChangeHandler = function () {
  openUploadWindow();
};

var documentKeydownHandler = function (evt) {
  if (evt.keyCode === ESC_KEY) {
    closeUploadWindow();
    hiddenBigPicture();
  }
};

var scaleBiggerClickHandler = function () {
  var value = getScaleValue();
  setScale(value + 25);
};

var scaleSmallerClickHandler = function () {
  var value = getScaleValue();
  setScale(value - 25);
};

document.querySelector('#upload-file').addEventListener('change', uplaodFileChangeHandler);
document.addEventListener('keydown', documentKeydownHandler);
document.querySelector('.scale__control--bigger').addEventListener('click', scaleBiggerClickHandler);
document.querySelector('.scale__control--smaller').addEventListener('click', scaleSmallerClickHandler);
