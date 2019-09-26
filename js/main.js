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
var SCALE_MAX_VALUE = 100;
var SCALE_MIN_VALUE = 25;
var SCALE_STEP = 25;
var BLUR_MAX_VALUE = 3;
var BLUR_MIN_VALUE = 0;
var BRIGHTNESS_MAX_VALUE = 3;
var BRIGHTNESS_MIN_VALUE = 1;

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
    scaleValue = SCALE_MAX_VALUE;
    scaleInput.value = SCALE_MAX_VALUE + '%';
  }
  return scaleValue;
};

var setScaleValue = function (value) {
  document.querySelector('.scale__control--value').value = value + '%';
};

var setScale = function (value) {
  if (value < SCALE_MIN_VALUE || value > SCALE_MAX_VALUE) {
    return;
  }
  setScaleValue(value);
  document.querySelector('.img-upload__preview').style.transform = 'scale(' + (getScaleValue() / 100) + ')';
};

var claerEffects = function () {
  setScale(SCALE_MAX_VALUE);
  setFilter('origin', true);
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
  setScale(value + SCALE_STEP);
};

var scaleSmallerClickHandler = function () {
  var value = getScaleValue();
  setScale(value - SCALE_STEP);
};
var getRatio = function (levelElement) {
  var effectLineRect = levelElement.querySelector('.effect-level__line').getBoundingClientRect();
  var effectPinRect = levelElement.querySelector('.effect-level__pin').getBoundingClientRect();
  return ((effectPinRect.x - effectLineRect.x + effectPinRect.width / 2) / effectLineRect.width).toFixed(2);
};

var setEffectValue = function (levelElement, value) {
  levelElement.querySelector('.effect-level__value').value = value;
};

var setGrayscale = function (levelElement, previewElement, init) {
  var ratio = 1;
  if (!init) {
    ratio = getRatio(levelElement);
  }
  setEffectValue(levelElement, ratio);
  previewElement.style.filter = 'grayscale(' + ratio + ')';
};

var setSepia = function (levelElement, previewElement, init) {
  var ratio = 1;
  if (!init) {
    ratio = getRatio(levelElement);
  }
  setEffectValue(levelElement, ratio);
  previewElement.style.filter = 'sepia(' + ratio + ')';
};

var setInvert = function (levelElement, previewElement, init) {
  var ratio = 1;
  if (!init) {
    ratio = getRatio(levelElement);
  }
  setEffectValue(levelElement, ratio);
  previewElement.style.filter = 'invert(' + ratio + ')';
};

var setBlur = function (levelElement, previewElement, init) {
  var ratio = 1;
  if (!init) {
    ratio = getRatio(levelElement);
  }
  var value = (BLUR_MIN_VALUE + ratio * (BLUR_MAX_VALUE - BLUR_MIN_VALUE)).toFixed(2);
  setEffectValue(levelElement, value);
  previewElement.style.filter = 'blur(' + value + 'px)';
};

var setBrightness = function (levelElement, previewElement, init) {
  var ratio = 1;
  if (!init) {
    ratio = getRatio(levelElement);
  }
  var value = (BRIGHTNESS_MIN_VALUE + ratio * (BRIGHTNESS_MAX_VALUE - BRIGHTNESS_MIN_VALUE)).toFixed(2);
  setEffectValue(levelElement, value);
  previewElement.style.filter = 'brightness(' + value + ')';
};

var setOrigin = function (levelElement, previewElement) {
  setEffectValue(levelElement, '');
  previewElement.style.filter = '';
};

var setVisibilityEffectSlider = function (visible) {
  if (visible) {
    document.querySelector('.effect-level').classList.remove('hidden');
  } else {
    document.querySelector('.effect-level').classList.add('hidden');
  }
};

var setFilter = function (filterName, init) {
  var effectLevelElement = document.querySelector('.effect-level');
  var previewElement = document.querySelector('.img-upload__preview');
  switch (filterName) {
    case 'chrome': {
      setGrayscale(effectLevelElement, previewElement, init);
      setVisibilityEffectSlider(true);
      return;
    }
    case 'sepia': {
      setSepia(effectLevelElement, previewElement, init);
      setVisibilityEffectSlider(true);
      return;
    }
    case 'marvin': {
      setInvert(effectLevelElement, previewElement, init);
      setVisibilityEffectSlider(true);
      return;
    }
    case 'phobos': {
      setBlur(effectLevelElement, previewElement, init);
      setVisibilityEffectSlider(true);
      return;
    }
    case 'heat': {
      setBrightness(effectLevelElement, previewElement, init);
      setVisibilityEffectSlider(true);
      return;
    }
    default:
      setOrigin(effectLevelElement, previewElement, init);
      setVisibilityEffectSlider(false);
  }
};

var effectLevelMouseupHandler = function () {
  setFilter(document.querySelector('.effects__radio:checked').value, false);
};

var effectsRadioChangeHandler = function (evt) {
  var target = evt.target;
  if (target.checked) {
    setFilter(target.value, true);
  }
};

var initializeEffectsRadio = function () {
  document.querySelectorAll('.effects__radio').forEach(function (value) {
    value.addEventListener('change', effectsRadioChangeHandler);
  });
};

document.querySelector('#upload-file').addEventListener('change', uplaodFileChangeHandler);
document.addEventListener('keydown', documentKeydownHandler);
document.querySelector('.scale__control--bigger').addEventListener('click', scaleBiggerClickHandler);
document.querySelector('.scale__control--smaller').addEventListener('click', scaleSmallerClickHandler);
var effectLevel = document.querySelector('.effect-level');
effectLevel.addEventListener('mouseup', effectLevelMouseupHandler);
initializeEffectsRadio();
