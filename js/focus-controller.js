'use strict';
(function () {

  var focusableSelectors = ['a[href]', 'area[href]', 'input:not([disabled])', 'button:not([disabled])',
    'select:not([disabled])', 'textarea:not([disabled])', 'iframe', 'object', 'embed',
    '*[tabindex]', '*[contenteditable=true]'];

  var FocusController = function (parent) {
    this._parent = parent;
    this._elements = null;
  };

  FocusController.prototype.refresh = function () {
    this._elements = Array.from(this._parent.querySelectorAll(focusableSelectors.join(', ')));
  };
  FocusController.prototype.deactivate = function (excludeMap) {
    var forDeactivate = this._elements.slice();
    if (isIterable(excludeMap)) {
      excludeMap.forEach(function (value) {
        var index = forDeactivate.indexOf(value);
        if (index > 0) {
          forDeactivate.splice(index, 1);
        }
      });
    }
    forDeactivate.forEach(function (value) {
      value.tabIndex = -1;
    });
  };
  FocusController.prototype.activate = function () {
    this._elements.forEach(function (value) {
      value.tabIndex = 0;
    });
  };
  FocusController.prototype.getElements = function () {
    var result = this._elements ? this._elements : [];
    return result;
  };

  var isIterable = function (obj) {
    if (obj === null) {
      return false;
    }
    return typeof obj[window.Symbol.iterator] === 'function';
  };

  window.FocusController = FocusController;
})();
