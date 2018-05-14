/* global document,window,Element,module,console */


/*
 * laxer
 * ©2018 David Miller
 * https://readmeansrun.com
 *
 * modal is licensed under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 *
 */

(() => {

  'use strict';

  const Laxer = function(config) {

    if (! config) {
      throw new Error('Invalid laxer config');
    }

    const
    getElement = function(arg) {
      if (typeof arg === 'string') {
        return document.querySelector(arg);
      }
      return arg;
    },
    getRect = function(node) {

      const
      rect = node.getBoundingClientRect(),
      ret = { top: rect.top, left: rect.left, bottom: rect.bottom, right: rect.right }; // create a new object that is not read-only

      ret.top += window.pageYOffset;
      ret.left += window.pageXOffset;

      ret.bottom += window.pageYOffset;
      ret.right += window.pageYOffset;

      ret.width = rect.right - rect.left;
      ret.height = rect.bottom - rect.top;

      return ret;
    };

    const
    node = getElement(config.node),
    factor = config.hasOwnProperty('factor') ? parseFloat(config.factor) : 1;

    if (! node) {
      throw new Error('Invalid laxer node');
    }
    if (isNaN(factor)) {
      throw new Error('Invalid laxer factor');
    }

    let rect = getRect(node);

    window.addEventListener('scroll', function() {
      const
      y = window.scrollY,
      height = window.innerHeight;

      let
      ratio = 1,
      scale = 1;

      // overlapping top of viewport
      if (y > rect.top && y < rect.bottom) {
        ratio = (y - rect.top) / rect.height;
        scale = (1 + ratio * factor);
      }
      // overlapping bottom of viewport
      else if (rect.bottom > y + height) {
        ratio = (rect.bottom - (y + height)) / rect.height;
        scale = (1 + ratio * factor);
      }

      node.style.transform =  'scale(' + scale + ')';
    });

    window.addEventListener('resize', function() {
      rect = getRect(node);
    });
  };

  module.exports =  Laxer;

})();
