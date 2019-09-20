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

// Создаем список комментариев
var fillComments = function (comments) {
  var docFragment = document.createDocumentFragment();
  comments.forEach(function (value) {
    docFragment.appendChild(createCommentElement(value));
  });
  return docFragment;
};

// Показываем большую фотографию
var showBigPicture = function (photo) {
  var bigPictureElement = document.querySelector('.big-picture');
  bigPictureElement.querySelector('.big-picture__img img').src = photo.url;
  bigPictureElement.querySelector('.likes-count').textContent = photo.likes;
  bigPictureElement.querySelector('.social__caption').textContent = photo.description;
  bigPictureElement.querySelector('.comments-count').textContent = photo.comments.length;
  var socialComments = bigPictureElement.querySelector('.social__comments');
  var itemCount = socialComments.childNodes.length;
  for (var i = 0; i < itemCount; i++) {
    socialComments.removeChild(socialComments.firstChild);
  }
  socialComments.appendChild(fillComments(photo.comments));
  bigPictureElement.querySelector('.social__comment-count').classList.add('visually-hidden');
  bigPictureElement.querySelector('.comments-loader').classList.add('visually-hidden');
  bigPictureElement.classList.remove('hidden');
};

var photos = createPhotos(PHOTO_COUNT);
var photoTemplate = document.querySelector('#picture')
  .content
  .querySelector('.picture');
document.querySelector('.pictures')
  .appendChild(createDocumentFragment(photoTemplate, photos));
showBigPicture(photos[0]);
