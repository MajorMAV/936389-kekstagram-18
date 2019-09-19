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
var createComments = function () {
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
      comments: createComments()
    });
  }
  return photos;
};

// Заполняет элемент, отображающий фото, данными
var fillPhotoElement = function (element, data) {
  element.querySelector('.picture__img').src = data.url;
  element.querySelector('.picture__comments').innerText = data.comments.length;
  element.querySelector('.picture__likes').innerText = data.likes;
  return element;
};

// Создает и заполняет DocumentFragment
var createDocumentFragment = function (template, photos) {
  var docFragment = document.createDocumentFragment();
  for (var i = 0; i < photos.length; i++) {
    var clone = template.cloneNode(true);
    docFragment.appendChild(fillPhotoElement(clone, photos[i]));
  }
  return docFragment;
};

var photos = createPhotos(PHOTO_COUNT);
var photoTemplate = document.querySelector('#picture')
  .content
  .querySelector('.picture');
document.querySelector('.pictures')
  .appendChild(createDocumentFragment(photoTemplate, photos));
