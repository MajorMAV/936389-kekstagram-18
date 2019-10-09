'use strict';
(function () {

  var TIMEOUT = 500;
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
    switch (activeFilter.id) {
      case FilterId.POPULAR:
        viewPopularPhotos();
        break;
      case FilterId.RANDOM:
        viewRandnomPhotos();
        break;
      case FilterId.DISCUSSED:
        viewDiscussedPhotos();
        break;
    }
  };

  var viewPopularPhotos = function () {
    pictures.appendChild(window.picture.createPictures(template, photoObjects));
  };

  var viewRandnomPhotos = function () {
    console.log('Random');
  };

  var viewDiscussedPhotos = function () {
    console.log('Discussed');
  };

  window.interaction.load(loadPhotos, window.errorWindow.show);
})();
