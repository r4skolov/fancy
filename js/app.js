/*!
 * External js:
 * MoveTo https://github.com/hsnaydd/moveTo MIT
 * lite-youtube-embed https://github.com/paulirish/lite-youtube-embed MIT
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

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
  burgerEl?.addEventListener('click', () => {
    burgerEl?.classList.add('burger--active');
    menu?.classList.add('active');
    // disableBodyScroll(targetElement);
    disableScroll();
  });
  close?.addEventListener('click', () => {
    burgerEl?.classList.remove('burger--active');
    menu?.classList.remove('active');
    // enableBodyScroll(targetElement);
    enableScroll();
  });
  const mediaQuery = window.matchMedia('(max-width: 744px)');
  if (mediaQuery.matches) {
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
;// CONCATENATED MODULE: ./source/js/index.js






// Init
function init() {
  input();
  components_burger();
  components_tabs();
}
(function () {
  init();
})();
/******/ })()
;
//# sourceMappingURL=app.js.map