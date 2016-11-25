(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.YoxFinger = global.YoxFinger || {})));
}(this, (function (exports) { 'use strict';

var AlloyFinger = typeof require === 'function' ? require('alloyfinger') : window.AlloyFinger;

if (!AlloyFinger) {
  throw new Error('[yox-touch] cannot locate AlloyFinger.js.');
}

var Event = void 0;
var Emitter = void 0;

var TAP = 'tap';
var LONG_TAP = 'longTap';
var SINGLE_TAP = 'singleTap';
var DOUBLE_TAP = 'doubleTap';
var SWIPE = 'swipe';
var PINCH = 'pinch';
var ROTATE = 'rotate';
var PRESS_MOVE = 'pressMove';
var MULTIPOINT_START = 'multipointStart';
var MULTIPOINT_END = 'multipointEnd';

var directive = {
  attach: function attach(_ref) {
    var el = _ref.el,
        name = _ref.name,
        node = _ref.node,
        instance = _ref.instance,
        directives = _ref.directives;


    if (!el.$finger) {
      (function () {
        var emitter = new Emitter();
        var alloy = new AlloyFinger(el, {
          tap: function tap(e) {
            emitter.fire(TAP, e);
          },
          longTap: function longTap(e) {
            emitter.fire(LONG_TAP, e);
          },
          singleTap: function singleTap(e) {
            emitter.fire(SINGLE_TAP, e);
          },
          doubleTap: function doubleTap(e) {
            emitter.fire(DOUBLE_TAP, e);
          },
          swipe: function swipe(e) {
            emitter.fire(SWIPE, e);
          },
          pinch: function pinch(e) {
            emitter.fire(PINCH, e);
          },
          rotate: function rotate(e) {
            emitter.fire(MULTIPOINT_START, e);
          },
          pressMove: function pressMove(e) {
            emitter.fire(PRESS_MOVE, e);
          },
          multipointStart: function multipointStart(e) {
            emitter.fire(MULTIPOINT_START, e);
          },
          multipointEnd: function multipointEnd(e) {
            emitter.fire(MULTIPOINT_END, e);
          }
        });
        el.$finger = { emitter: emitter, alloy: alloy };
      })();
    }

    var listener = instance.compileAttr(node.keypath, node.getValue());
    el.$finger.emitter.on(name, function (event) {
      return listener.call(this, new Event(event));
    });
  },
  detach: function detach(name, el) {
    el.$finger.alloy.destroy();
    el.$finger.emitter.off();
    el.$finger = null;
  }
};

var version = '0.0.4';

function install(Yox) {
  var utils = Yox.utils;

  Event = utils.Event;
  Emitter = utils.Emitter;

  utils.array.each([TAP, LONG_TAP, SINGLE_TAP, DOUBLE_TAP, SWIPE, PINCH, ROTATE, PRESS_MOVE, MULTIPOINT_START, MULTIPOINT_END], function (name) {
    Yox.directive(name, directive);
  });
}

if (typeof Yox !== 'undefined' && Yox.use) {
  install(Yox);
}

exports.version = version;
exports.install = install;

Object.defineProperty(exports, '__esModule', { value: true });

})));
