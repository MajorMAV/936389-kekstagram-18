'use strict';
(function () {

  var TIMEOUT = 500;
  var RANDOM_COUNT = 10;
  var FilterId = {
    POPULAR: 'filter-popular',
    RANDOM: 'filter-random',
    DISCUSSED: 'filter-discussed'
  };

  var template = document.querySelector('#picture').content.querySelector('.picture');
  var pictures = document.querySelector('.pictures');
  var filters = document.querySelector('.img-filters');
  var filterButtons = filters.querySelectorAll('.img-filters__button');
  var photoObjects;
  var timeoutId;

  var activeFilter = Array.prototype.find.call(filterButtons, function (item) {
    return item.classList.contains('img-filters__button--active');
  });
  var backup = document.querySelectorAll('.pictures > *');

  var loadPhotos = function (photos) {
    photoObjects = photos;
    filterButtons.forEach(function (item) {
      item.addEventListener('click', function (evt) {
        deactivateFilter();
        activeFilter = evt.target;
        activeFilter.classList.add('img-filters__button--active');
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(setFilter, TIMEOUT);
      });
    });
    filters.classList.remove('img-filters--inactive');
    setFilter();
  };

  var deactivateFilter = function () {
    if (activeFilter) {
      activeFilter.classList.remove('img-filters__button--active');
    }
  };

  var setFilter = function () {
    clearPhotos();
    var backupFragment = restoreBackup();
    switch (activeFilter.id) {
      case FilterId.POPULAR:
        viewPopularPhotos(backupFragment);
        break;
      case FilterId.RANDOM:
        viewRandnomPhotos(backupFragment);
        break;
      case FilterId.DISCUSSED:
        viewDiscussedPhotos(backupFragment);
        break;
    }
  };

  var clearPhotos = function () {
    pictures.innerHTML = '';
  };

  var restoreBackup = function () {
    var fragment = document.createDocumentFragment();
    backup.forEach(function (item) {
      fragment.appendChild(item);
    });
    return fragment;
  };

  var viewPopularPhotos = function (fragment) {
    pictures.appendChild(window.picture.createPictures(template, photoObjects, fragment));
  };

  var viewRandnomPhotos = function (fragment) {
    var selection = getRandomPhotos(photoObjects, RANDOM_COUNT);
    pictures.appendChild(window.picture.createPictures(template, selection, fragment));
  };

  var viewDiscussedPhotos = function (fragment) {
    var sortedPhotos = photoObjects.slice().sort(function (a, b) {
      return b.comments.length - a.comments.length;
    });
    pictures.appendChild(window.picture.createPictures(template, sortedPhotos, fragment));
  };

  var getRandomPhotos = function (photos, count) {
    var result = photos.slice();
    // Метод генерации случайной перестановки, алгоритм Фишера-Йетса
    for (var i = result.length - 1; i > 0; i--) {
      var randomIndex = Math.round(Math.random() * i);
      swapItems(result, i, randomIndex);
    }
    return result.slice(0, result.length < count ? result.length : count);
  };

  var swapItems =function (source, indexA, indexB) {
    var tempItem = source[indexA];
    source[indexA] = source[indexB];
    source[indexB] = tempItem;
  }
  window.interaction.load(loadPhotos, window.errorWindow.show);
})();
