/*!
 * External js:
 * MoveTo https://github.com/hsnaydd/moveTo MIT
 * lite-youtube-embed https://github.com/paulirish/lite-youtube-embed MIT
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 530:
/***/ ((module) => {

/*
*  Accessible AccordionTabs, by Matthias Ott (@m_ott)
*
*  Based on the work of @stowball (https://codepen.io/stowball/pen/xVWwWe)
*
*/
(function () {

  'use strict';

  function AccordionTabs (el, options) {

    if (!el) {
      return;
    }

    this.el = el;
    this.tabTriggers = this.el.getElementsByClassName('js-tabs-trigger');
    this.tabPanels = this.el.getElementsByClassName('js-tabs-panel');
    this.accordionTriggers = this.el.getElementsByClassName('js-accordion-trigger');

    this.options = this._extend({
      breakpoint: 640,
      tabsAllowed: true,
      selectedTab: 0,
      startCollapsed: false
    }, options);

    if(el.getAttribute('data-tabs-allowed') == "true"){
      this.options.tabsAllowed = true;
    } else if (el.getAttribute('data-tabs-allowed') == "false") {
      this.options.tabsAllowed = false;
    }

    if(el.getAttribute('data-breakpoint')){
      this.options.breakpoint = parseInt(el.getAttribute('data-breakpoint'));
    }

    if(el.getAttribute('data-selected-tab')){
      this.options.selectedTab = parseInt(el.getAttribute('data-selected-tab'));
    }

    if(el.getAttribute('data-start-collapsed') == "true"){
      this.options.startCollapsed = true;
    } else if (el.getAttribute('data-start-collapsed') == "false") {
      this.options.startCollapsed = false;
    }

    if (this.tabTriggers.length === 0 || this.tabTriggers.length !== this.tabPanels.length) {
      return;
    }

    this._init();
  }

  AccordionTabs.prototype._init = function () {

    var _this = this;

    this.tabTriggersLength = this.tabTriggers.length;
    this.accordionTriggersLength = this.accordionTriggers.length;
    this.selectedTab = 0;
    this.prevSelectedTab = null;
    this.clickListener = this._clickEvent.bind(this);
    this.keydownListener = this._keydownEvent.bind(this);
    this.keys = {
      prev: 37,
      next: 39,
      space: 32,
      enter: 13
    };

    if(window.innerWidth >= this.options.breakpoint && this.options.tabsAllowed) {
        this.isAccordion = false;
    } else {
        this.isAccordion = true;
    }

    for (var i = 0; i < this.tabTriggersLength; i++) {
      this.tabTriggers[i].index = i;
      this.tabTriggers[i].addEventListener('click', this.clickListener, false);
      this.tabTriggers[i].addEventListener('keydown', this.keydownListener, false);

      if (this.tabTriggers[i].classList.contains('is-selected')) {
        this.selectedTab = i;
      }

      this._hide(i);
    }

    for (var i = 0; i < this.accordionTriggersLength; i++) {
      this.accordionTriggers[i].index = i;
      this.accordionTriggers[i].addEventListener('click', this.clickListener, false);
      this.accordionTriggers[i].addEventListener('keydown', this.keydownListener, false);

      if (this.accordionTriggers[i].classList.contains('is-selected')) {
        this.selectedTab = i;
      }
    }

    if (!isNaN(this.options.selectedTab)) {
      this.selectedTab = this.options.selectedTab < this.tabTriggersLength ? this.options.selectedTab : this.tabTriggersLength - 1;
    }

    this.el.classList.add('is-initialized');
    if (this.options.tabsAllowed) {
      this.el.classList.add('tabs-allowed');
    }

    // If the accordion should not start collapsed, open the first element
    if(!this.options.startCollapsed || !this.isAccordion){
      this.selectTab(this.selectedTab, false);
    }

    var resizeTabs = this._debounce(function() {
      // This gets delayed for performance reasons
      if(window.innerWidth >= _this.options.breakpoint && _this.options.tabsAllowed) {
        _this.isAccordion = false;
        if (_this.options.tabsAllowed) {
          _this.el.classList.add('tabs-allowed');
        }
        _this.selectTab(_this.selectedTab);
      } else {
        _this.isAccordion = true;
        _this.el.classList.remove('tabs-allowed');
        if(!_this.options.startCollapsed){
          _this.selectTab(_this.selectedTab);
        }
      }

    }, 50);

    window.addEventListener('resize', resizeTabs);

  };

  AccordionTabs.prototype._clickEvent = function (e) {

    e.preventDefault();

    var closestTrigger = this._getClosest(e.target, '.js-tabs-trigger');
    var closestTab = 0;

    if (closestTrigger == null) {
      closestTrigger = this._getClosest(e.target, '.js-accordion-trigger');
      closestTab = this._getClosest(closestTrigger, '.js-tabs-panel');
      this.isAccordion = true;
    } else {
      this.isAccordion = false;
    }

    var targetIndex = e.target.index != null ? e.target.index : closestTab.index;

    if (targetIndex === this.selectedTab && !this.isAccordion) {
      return;
    }

    this.selectTab(targetIndex, true);
  };

  AccordionTabs.prototype._keydownEvent = function (e) {

    var targetIndex;

    if (e.keyCode === this.keys.prev || e.keyCode === this.keys.next || e.keyCode === this.keys.space || e.keyCode === this.keys.enter) {
      e.preventDefault();
    }
    else {
      return;
    }

    if (e.keyCode === this.keys.prev && e.target.index > 0 && !this.isAccordion) {
      targetIndex = e.target.index - 1;
    }
    else if (e.keyCode === this.keys.next && e.target.index < this.tabTriggersLength - 1 && !this.isAccordion) {
      targetIndex = e.target.index + 1;
    }
    else if (e.keyCode === this.keys.space || e.keyCode === this.keys.enter) {
      targetIndex = e.target.index;
    }
    else {
      return;
    }

    this.selectTab(targetIndex, true);
  };

  AccordionTabs.prototype._show = function (index, userInvoked) {

    this.tabPanels[index].removeAttribute('tabindex');

    this.tabTriggers[index].removeAttribute('tabindex');
    this.tabTriggers[index].classList.add('is-selected');
    this.tabTriggers[index].setAttribute('aria-selected', true);

    this.accordionTriggers[index].setAttribute('aria-expanded', true);

    var panelContent = this.tabPanels[index].getElementsByClassName("content")[0];
    panelContent.setAttribute('aria-hidden', false);
    panelContent.classList.remove('is-hidden');
    panelContent.classList.add('is-open');

    this.tabPanels[index].classList.remove('is-hidden');
    this.tabPanels[index].classList.add('is-open');

    if (userInvoked) {
      this.tabTriggers[index].focus();
    }
  };

  AccordionTabs.prototype._hide = function (index) {

    this.tabTriggers[index].classList.remove('is-selected');
    this.tabTriggers[index].setAttribute('aria-selected', false);
    this.tabTriggers[index].setAttribute('tabindex', -1);

    this.accordionTriggers[index].setAttribute('aria-expanded', false);

    var panelContent = this.tabPanels[index].getElementsByClassName("content")[0];
    panelContent.setAttribute('aria-hidden', true);
    panelContent.classList.remove('is-open');
    panelContent.classList.add('is-hidden');

    this.tabPanels[index].classList.remove('is-open');
    this.tabPanels[index].classList.add('is-hidden');
    this.tabPanels[index].setAttribute('tabindex', -1);
  };

  AccordionTabs.prototype.selectTab = function (index, userInvoked) {

    if (index === null) {
      if(this.isAccordion) {
        return;
      } else {
        index = 0;
      }
    }

    if(!this.tabPanels[index].classList.contains('is-hidden') && userInvoked) {

      if (index === this.selectedTab) {
        this.selectedTab = null;
      } else {
        this.selectedTab = null;
        this.prevSelectedTab = index;
      }

      this._hide(index);

      return;
    }

    if (this.isAccordion) {

      this.prevSelectedTab = this.selectedTab;
      this.selectedTab = index;

    } else {
      if (this.prevSelectedTab === null || !this.isAccordion) {
        for (var i = 0; i < this.tabTriggersLength; i++) {
          if (i !== index) {
            this._hide(i);
          }
        }
      }
      else {
        this._hide(this.selectedTab);
      }

      this.prevSelectedTab = this.selectedTab;
      this.selectedTab = index;
    }

    this._show(this.selectedTab, userInvoked);

  };

  AccordionTabs.prototype.destroy = function () {

    for (var i = 0; i < this.tabTriggersLength; i++) {
      this.tabTriggers[i].classList.remove('is-selected');
      this.tabTriggers[i].removeAttribute('aria-selected');
      this.tabTriggers[i].removeAttribute('tabindex');

      this.tabPanels[i].classList.remove('is-hidden');
      this.tabPanels[i].removeAttribute('aria-hidden');
      this.tabPanels[i].removeAttribute('tabindex');

      this.tabTriggers[i].removeEventListener('click', this.clickListener, false);
      this.tabTriggers[i].removeEventListener('keydown', this.keydownListener, false);

      delete this.tabTriggers[i].index;
    }

    this.el.classList.remove('is-initialized');
  };

  /**
    * Get the closest matching element up the DOM tree.
    * @private
    * @param  {Element} elem     Starting element
    * @param  {String}  selector Selector to match against
    * @return {Boolean|Element}  Returns null if not match found
    */
  AccordionTabs.prototype._getClosest = function ( elem, selector ) {

    // Element.matches() polyfill
    if (!Element.prototype.matches) {
        Element.prototype.matches =
            Element.prototype.matchesSelector ||
            Element.prototype.mozMatchesSelector ||
            Element.prototype.msMatchesSelector ||
            Element.prototype.oMatchesSelector ||
            Element.prototype.webkitMatchesSelector ||
            function(s) {
                var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                    i = matches.length;
                while (--i >= 0 && matches.item(i) !== this) {}
                return i > -1;
            };
    }

    // Get closest match
    for ( ; elem && elem !== document; elem = elem.parentNode ) {
        if ( elem.matches( selector ) ) return elem;
    }

    return null;

  };

  // Pass in the objects to merge as arguments.
  // For a deep extend, set the first argument to `true`.
  AccordionTabs.prototype._extend = function () {

      // Variables
      var extended = {};
      var deep = false;
      var i = 0;
      var length = arguments.length;

      // Check if a deep merge
      if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
          deep = arguments[0];
          i++;
      }

      // Merge the object into the extended object
      var merge = function (obj) {
          for ( var prop in obj ) {
              if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
                  // If deep merge and property is an object, merge properties
                  if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
                      extended[prop] = extend( true, extended[prop], obj[prop] );
                  } else {
                      extended[prop] = obj[prop];
                  }
              }
          }
      };

      // Loop through each object and conduct a merge
      for ( ; i < length; i++ ) {
          var obj = arguments[i];
          merge(obj);
      }

      return extended;

  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  AccordionTabs.prototype._debounce = function (func, wait, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) { func.apply(context, args); };
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) { func.apply(context, args) };
    };
  };

  var slice = Array.prototype.slice;

  function $(expr, con) {
    return typeof expr === "string" ? (con || document).querySelector(expr) : expr || null;
  }

  function $$(expr, con) {
    return slice.call((con || document).querySelectorAll(expr));
  }

  // Initialization

  function init() {
    $$(".js-tabs").forEach(function (input) {
      new AccordionTabs(input);
    });
  }

  // Are we in a browser? Check for Document constructor
  if (typeof Document !== "undefined") {
    // DOM already loaded?
    if (document.readyState !== "loading") {
      init();
    }
    else {
      // Wait for it
      document.addEventListener("DOMContentLoaded", init);
    }
  }

  // Export on self when in a browser
  if (typeof self !== "undefined") {
    self.AccordionTabs = AccordionTabs;
  }

  // Expose as a CJS module
  if ( true && module.exports) {
    module.exports = AccordionTabs;
  }

  return AccordionTabs;

})();


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";

;// CONCATENATED MODULE: ./node_modules/body-scroll-lock/lib/bodyScrollLock.esm.js
function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// Older browsers don't support event options, feature detect it.

// Adopted and modified solution from Bohdan Didukh (2017)
// https://stackoverflow.com/questions/41594997/ios-10-safari-prevent-scrolling-behind-a-fixed-overlay-and-maintain-scroll-posi

var hasPassiveEvents = false;
if (typeof window !== 'undefined') {
  var passiveTestOptions = {
    get passive() {
      hasPassiveEvents = true;
      return undefined;
    }
  };
  window.addEventListener('testPassive', null, passiveTestOptions);
  window.removeEventListener('testPassive', null, passiveTestOptions);
}

var isIosDevice = typeof window !== 'undefined' && window.navigator && window.navigator.platform && (/iP(ad|hone|od)/.test(window.navigator.platform) || window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);


var locks = (/* unused pure expression or super */ null && ([]));
var documentListenerAdded = false;
var initialClientY = (/* unused pure expression or super */ null && (-1));
var previousBodyOverflowSetting = void 0;
var previousBodyPosition = void 0;
var previousBodyPaddingRight = void 0;

// returns true if `el` should be allowed to receive touchmove events.
var allowTouchMove = function allowTouchMove(el) {
  return locks.some(function (lock) {
    if (lock.options.allowTouchMove && lock.options.allowTouchMove(el)) {
      return true;
    }

    return false;
  });
};

var preventDefault = function preventDefault(rawEvent) {
  var e = rawEvent || window.event;

  // For the case whereby consumers adds a touchmove event listener to document.
  // Recall that we do document.addEventListener('touchmove', preventDefault, { passive: false })
  // in disableBodyScroll - so if we provide this opportunity to allowTouchMove, then
  // the touchmove event on document will break.
  if (allowTouchMove(e.target)) {
    return true;
  }

  // Do not prevent if the event has more than one touch (usually meaning this is a multi touch gesture like pinch to zoom).
  if (e.touches.length > 1) return true;

  if (e.preventDefault) e.preventDefault();

  return false;
};

var setOverflowHidden = function setOverflowHidden(options) {
  // If previousBodyPaddingRight is already set, don't set it again.
  if (previousBodyPaddingRight === undefined) {
    var _reserveScrollBarGap = !!options && options.reserveScrollBarGap === true;
    var scrollBarGap = window.innerWidth - document.documentElement.clientWidth;

    if (_reserveScrollBarGap && scrollBarGap > 0) {
      var computedBodyPaddingRight = parseInt(window.getComputedStyle(document.body).getPropertyValue('padding-right'), 10);
      previousBodyPaddingRight = document.body.style.paddingRight;
      document.body.style.paddingRight = computedBodyPaddingRight + scrollBarGap + 'px';
    }
  }

  // If previousBodyOverflowSetting is already set, don't set it again.
  if (previousBodyOverflowSetting === undefined) {
    previousBodyOverflowSetting = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }
};

var restoreOverflowSetting = function restoreOverflowSetting() {
  if (previousBodyPaddingRight !== undefined) {
    document.body.style.paddingRight = previousBodyPaddingRight;

    // Restore previousBodyPaddingRight to undefined so setOverflowHidden knows it
    // can be set again.
    previousBodyPaddingRight = undefined;
  }

  if (previousBodyOverflowSetting !== undefined) {
    document.body.style.overflow = previousBodyOverflowSetting;

    // Restore previousBodyOverflowSetting to undefined
    // so setOverflowHidden knows it can be set again.
    previousBodyOverflowSetting = undefined;
  }
};

var setPositionFixed = function setPositionFixed() {
  return window.requestAnimationFrame(function () {
    // If previousBodyPosition is already set, don't set it again.
    if (previousBodyPosition === undefined) {
      previousBodyPosition = {
        position: document.body.style.position,
        top: document.body.style.top,
        left: document.body.style.left
      };

      // Update the dom inside an animation frame 
      var _window = window,
          scrollY = _window.scrollY,
          scrollX = _window.scrollX,
          innerHeight = _window.innerHeight;

      document.body.style.position = 'fixed';
      document.body.style.top = -scrollY;
      document.body.style.left = -scrollX;

      setTimeout(function () {
        return window.requestAnimationFrame(function () {
          // Attempt to check if the bottom bar appeared due to the position change
          var bottomBarHeight = innerHeight - window.innerHeight;
          if (bottomBarHeight && scrollY >= innerHeight) {
            // Move the content further up so that the bottom bar doesn't hide it
            document.body.style.top = -(scrollY + bottomBarHeight);
          }
        });
      }, 300);
    }
  });
};

var restorePositionSetting = function restorePositionSetting() {
  if (previousBodyPosition !== undefined) {
    // Convert the position from "px" to Int
    var y = -parseInt(document.body.style.top, 10);
    var x = -parseInt(document.body.style.left, 10);

    // Restore styles
    document.body.style.position = previousBodyPosition.position;
    document.body.style.top = previousBodyPosition.top;
    document.body.style.left = previousBodyPosition.left;

    // Restore scroll
    window.scrollTo(x, y);

    previousBodyPosition = undefined;
  }
};

// https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight#Problems_and_solutions
var isTargetElementTotallyScrolled = function isTargetElementTotallyScrolled(targetElement) {
  return targetElement ? targetElement.scrollHeight - targetElement.scrollTop <= targetElement.clientHeight : false;
};

var handleScroll = function handleScroll(event, targetElement) {
  var clientY = event.targetTouches[0].clientY - initialClientY;

  if (allowTouchMove(event.target)) {
    return false;
  }

  if (targetElement && targetElement.scrollTop === 0 && clientY > 0) {
    // element is at the top of its scroll.
    return preventDefault(event);
  }

  if (isTargetElementTotallyScrolled(targetElement) && clientY < 0) {
    // element is at the bottom of its scroll.
    return preventDefault(event);
  }

  event.stopPropagation();
  return true;
};

var bodyScrollLock_esm_disableBodyScroll = function disableBodyScroll(targetElement, options) {
  // targetElement must be provided
  if (!targetElement) {
    // eslint-disable-next-line no-console
    console.error('disableBodyScroll unsuccessful - targetElement must be provided when calling disableBodyScroll on IOS devices.');
    return;
  }

  // disableBodyScroll must not have been called on this targetElement before
  if (locks.some(function (lock) {
    return lock.targetElement === targetElement;
  })) {
    return;
  }

  var lock = {
    targetElement: targetElement,
    options: options || {}
  };

  locks = [].concat(_toConsumableArray(locks), [lock]);

  if (isIosDevice) {
    setPositionFixed();
  } else {
    setOverflowHidden(options);
  }

  if (isIosDevice) {
    targetElement.ontouchstart = function (event) {
      if (event.targetTouches.length === 1) {
        // detect single touch.
        initialClientY = event.targetTouches[0].clientY;
      }
    };
    targetElement.ontouchmove = function (event) {
      if (event.targetTouches.length === 1) {
        // detect single touch.
        handleScroll(event, targetElement);
      }
    };

    if (!documentListenerAdded) {
      document.addEventListener('touchmove', preventDefault, hasPassiveEvents ? { passive: false } : undefined);
      documentListenerAdded = true;
    }
  }
};

var clearAllBodyScrollLocks = function clearAllBodyScrollLocks() {
  if (isIosDevice) {
    // Clear all locks ontouchstart/ontouchmove handlers, and the references.
    locks.forEach(function (lock) {
      lock.targetElement.ontouchstart = null;
      lock.targetElement.ontouchmove = null;
    });

    if (documentListenerAdded) {
      document.removeEventListener('touchmove', preventDefault, hasPassiveEvents ? { passive: false } : undefined);
      documentListenerAdded = false;
    }

    // Reset initial clientY.
    initialClientY = -1;
  }

  if (isIosDevice) {
    restorePositionSetting();
  } else {
    restoreOverflowSetting();
  }

  locks = [];
};

var bodyScrollLock_esm_enableBodyScroll = function enableBodyScroll(targetElement) {
  if (!targetElement) {
    // eslint-disable-next-line no-console
    console.error('enableBodyScroll unsuccessful - targetElement must be provided when calling enableBodyScroll on IOS devices.');
    return;
  }

  locks = locks.filter(function (lock) {
    return lock.targetElement !== targetElement;
  });

  if (isIosDevice) {
    targetElement.ontouchstart = null;
    targetElement.ontouchmove = null;

    if (documentListenerAdded && locks.length === 0) {
      document.removeEventListener('touchmove', preventDefault, hasPassiveEvents ? { passive: false } : undefined);
      documentListenerAdded = false;
    }
  }

  if (isIosDevice) {
    restorePositionSetting();
  } else {
    restoreOverflowSetting();
  }
};


;// CONCATENATED MODULE: ./source/js/components/MainMenu.js

class MainMenu {
  constructor() {
    let {
      container,
      trigger,
      openClass,
      animationClass,
      bodyClass,
      onOpen,
      onClose
    } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    this.trigger = document.querySelector(trigger) || document.querySelector('[data-mobile-menu="trigger"]');
    this.container = document.querySelector(container) || document.querySelector('[data-mobile-menu="wrapper"]');
    this.options = {
      openClass: openClass || 'is-open',
      animationClass: animationClass || 'is-animation',
      bodyClass: bodyClass || 'is-overflow',
      onOpen: onOpen || null,
      onClose: onClose || null
    };
    this._init();
  }
  _init() {
    if (!this.trigger && !this.container) {
      return;
    }
    this.trigger.addEventListener('click', this._click.bind(this));
  }
  _click(e) {
    e.preventDefault();
    if (!this.trigger.classList.contains(this.options.openClass)) {
      this._open();
    } else {
      this._close();
    }
    return false;
  }
  _open() {
    this.trigger.classList.add(this.options.openClass);
    document.body.classList.add(this.options.bodyClass);
    this.container.classList.add(this.options.openClass);
    this.container.classList.add(this.options.animationClass);
    disableBodyScroll(this.container);
  }
  _close() {
    const self = this;
    this.container.classList.remove(this.options.animationClass);
    this.trigger.classList.remove(this.options.openClass);
    this.container.addEventListener('animationend', function handler() {
      document.body.classList.remove(self.options.bodyClass);
      enableBodyScroll(self.container);
      self.container.classList.remove(self.options.openClass);
      self.container.removeEventListener('animationend', handler, false);
    }, false);
  }
  closeMainMenu() {
    this._close();
  }
}
;// CONCATENATED MODULE: ./source/js/components/input.js
const inputAnimate = () => {
  const inputs = document?.querySelectorAll('input');
  const btnInput = document?.querySelector('.form__btn');
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      if (input.value) {
        input.classList.add('form__input--active');
        btnInput.classList.add('form__btn--active');
      } else {
        input.classList.remove('form__input--active');
        btnInput.classList.remove('form__btn--active');
      }
    });
  });
};
/* harmony default export */ const input = (inputAnimate);
;// CONCATENATED MODULE: ./source/js/components/burger.js

const burger = () => {
  const burgerEl = document?.querySelector('[data-burger]');
  const menu = document?.querySelector('[data-menu]');
  const targetElement = document.querySelector('body');
  const close = document?.querySelector('[data-close]');
  function disableScroll() {
    const pagePosition = window.scrollY;
    document.body.classList.add('scroll');
    document.body.dataset.position = pagePosition;
  }
  function enableScroll() {
    document.body.classList.remove('scroll');
    document.body.removeAttribute('data-position');
  }
  const mediaQueryTablet = window.matchMedia('(max-width: 1280px)');
  if (mediaQueryTablet.matches) {
    burgerEl?.addEventListener('click', () => {
      burgerEl?.classList.toggle('burger--active');
      menu?.classList.toggle('active');
    });
  }
  const mediaQuery = window.matchMedia('(max-width: 744px)');
  if (mediaQuery.matches) {
    burgerEl?.addEventListener('click', () => {
      burgerEl?.classList.add('burger--active');
      menu?.classList.add('active');
      // disableBodyScroll(targetElement);
      disableScroll();
    });
    close?.addEventListener('click', () => {
      menu?.classList.remove('active');
      // enableBodyScroll(targetElement);
      enableScroll();
    });
    const dropDown = document.querySelectorAll('.nav__item');
    dropDown.forEach(el => {
      el.addEventListener('click', e => {
        const self = e.currentTarget;
        const control = self.querySelector('.nav__link');
        const content = self?.querySelector('.nav__submenu');
        self.classList.toggle('open');
        if (self.classList.contains('open')) {
          content.style.maxHeight = `${content.scrollHeight}px`;
        } else {
          content.style.maxHeight = null;
        }
      });
    });
  }
  const appHeight = () => {
    const doc = document.documentElement;
    doc.style.setProperty('--app-height', `${window.innerHeight}px`);
  };
  window.addEventListener('resize', appHeight);
  appHeight();
};
/* harmony default export */ const components_burger = (burger);
;// CONCATENATED MODULE: ./source/js/components/tabs.js
const tabs = () => {
  let tabLinks = document.querySelectorAll(".tabs__button");
  let tabContent = document.querySelectorAll(".tabs__content");
  tabLinks.forEach(function (el) {
    el.addEventListener("click", openTabs);
  });
  function openTabs(el) {
    let btnTarget = el.currentTarget;
    let country = btnTarget.dataset.country;
    tabContent.forEach(function (el) {
      el.classList.remove("active");
    });
    tabLinks.forEach(function (el) {
      el.classList.remove("active");
    });
    document.querySelector("#" + country).classList.add("active");
    btnTarget.classList.add("active");
  }
  const optionMenu = document?.querySelector('.tabs__head');
  const selectBtn = optionMenu?.querySelector('.tabs__text');
  const options = optionMenu?.querySelectorAll('.tabs__item');
  const selected = optionMenu?.querySelector('.tabs__selected');
  if (selectBtn) {
    selectBtn.addEventListener('click', () => optionMenu.classList.toggle('active'));
    options.forEach(option => {
      option.addEventListener("click", () => {
        let selectedOption = option.querySelector('.tabs__button').innerHTML;
        selected.innerHTML = selectedOption;
        optionMenu.classList.remove('active');
      });
    });
  }
};
/* harmony default export */ const components_tabs = (tabs);
// EXTERNAL MODULE: ./node_modules/a11y-accordion-tabs/a11y-accordion-tabs.js
var a11y_accordion_tabs = __webpack_require__(530);
var a11y_accordion_tabs_default = /*#__PURE__*/__webpack_require__.n(a11y_accordion_tabs);
;// CONCATENATED MODULE: ./source/js/components/tabstoacord.js

const according = () => {
  new (a11y_accordion_tabs_default())();
};
/* harmony default export */ const tabstoacord = (according);
;// CONCATENATED MODULE: ./source/js/components/smoothscroll.js
const smoothScroll = () => {
  const scroll = function (targetEl, duration) {
    const targets = document.querySelector(targetEl);
    const targetsPosition = targets.getBoundingClientRect().top;
    const startsPosition = window.pageYOffset;
    let startTime = null;
    const ease = function (t, b, c, d) {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t + b;
      t -= 1;
      return -c / 2 * (t * (t - 2) - 1) + b;
    };
    const animation = function (currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = ease(timeElapsed, startsPosition, targetsPosition, duration);
      window.scrollTo(120, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    };
    requestAnimationFrame(animation);
  };
  const scrollTo = function () {
    const links = document.querySelectorAll('.js-smooth-scroll');
    links.forEach(each => {
      each.addEventListener('click', function () {
        const currentTarget = this.getAttribute('href');
        scroll(currentTarget, 1000);
      });
    });
  };
  scrollTo();
};
/* harmony default export */ const smoothscroll = (smoothScroll);
;// CONCATENATED MODULE: ./source/js/index.js








// Init
function init() {
  input();
  components_burger();
  components_tabs();
  tabstoacord();
  smoothscroll();
}
(function () {
  init();
})();
})();

/******/ })()
;
//# sourceMappingURL=app.js.map