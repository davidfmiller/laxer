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

    const
    node = config.node,
    factor = config.hasOwnProperty('factor') ? config.factor : 1;

    if (! node) {
      throw new Error('Invalid laxer node');
    }

    const
    getElement = function(arg) {
      if (typeof arg === 'string') {
        return document.querySelector(arg);
      }
      return arg;
    },
    getRect = function(node) {

      node = getElement(node);
      if (!node) {
        return { top: 0, left: 0, right: 0, width: 0, height: 0 };
      }

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

    let rect = getRect(node);

    window.addEventListener('scroll', function() {
      const
      y = window.scrollY,
      height = window.innerHeight;

      let
      ratio = 1,
      scale = 1;

      if (y > rect.top && y < rect.bottom) {
        ratio = (y - rect.top) / rect.height;
        scale = (1 + ratio * factor);
      }
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

  module.exports = {
    Laxer: Laxer
  };

})();
