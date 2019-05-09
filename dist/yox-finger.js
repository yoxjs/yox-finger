/**
 * yox-finger.js v0.8.1
 * (c) 2017-2019 musicode
 * Released under the MIT License.
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.YoxFinger = {}));
}(this, function (exports) { 'use strict';

  var AlloyFinger = typeof require === 'function'
      ? require('alloyfinger')
      : window.AlloyFinger;

  if (!AlloyFinger) {
    throw new Error('[yox-finger] cannot locate AlloyFinger.js.')
  }

  var events = [
    'tap',
    'doubleTap',
    'longTap',
    'singleTap',

    'pinch',
    'swipe',
    'multipointStart',
    'multipointEnd',

    'rotate',
    'pressMove',
    'twoFingerPressMove',

    'touchStart',
    'touchMove',
    'touchEnd',
    'touchCancel' ];

  /**
   * 版本
   *
   * @type {string}
   */
  var version = "0.8.1";

  function install(Yox) {

    Yox.array.each(
      events,
      function (name) {
        Yox.dom.addSpecialEvent(name, {
          on: function on(node, listener) {
            var finger = node.$finger || (node.$finger = new AlloyFinger(node, {}));
            finger.on(name, listener);
          },
          off: function off(node, listener) {

            var finger = node.$finger;
            finger.off(name, listener);

            // 判断是否还有别的事件监听
            var hasEvent = false;

            Yox.array.each(
              events,
              function (event) {
                var handlers = finger[event] && finger[event].handlers;
                if (!Yox.array.falsy(handlers)) {
                  hasEvent = true;
                  return false
                }
              }
            );

            if (!hasEvent) {
              finger.destroy();
              node.$finger = null;
            }

          }
        });
      }
    );

  }

  exports.install = install;
  exports.version = version;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=yox-finger.js.map
