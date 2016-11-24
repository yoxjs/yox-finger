(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.YoxFinger = global.YoxFinger || {})));
}(this, (function (exports) { 'use strict';

function getLen(v) {
    return Math.sqrt(v.x * v.x + v.y * v.y);
}

function dot(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y;
}

function getAngle(v1, v2) {
    var mr = getLen(v1) * getLen(v2);
    if (mr === 0) return 0;
    var r = dot(v1, v2) / mr;
    if (r > 1) r = 1;
    return Math.acos(r);
}

function cross(v1, v2) {
    return v1.x * v2.y - v2.x * v1.y;
}

function getRotateAngle(v1, v2) {
    var angle = getAngle(v1, v2);
    if (cross(v1, v2) > 0) {
        angle *= -1;
    }

    return angle * 180 / Math.PI;
}

var FALSE = false;
var NULL = null;

function noop() {}

var AlloyFinger = function AlloyFinger(el, option) {

    var me = this;
    me.el = el;
    me.startHandler = me.start.bind(me);
    me.moveHandler = me.move.bind(me);
    me.endHandler = me.end.bind(me);
    me.cancelHandler = me.cancel.bind(me);

    el.addEventListener("touchstart", me.startHandler, FALSE);
    el.addEventListener("touchmove", me.moveHandler, FALSE);
    el.addEventListener("touchend", me.endHandler, FALSE);
    el.addEventListener("touchcancel", me.cancelHandler, FALSE);

    me.preV = { x: NULL, y: NULL };
    me.pinchStartLen = NULL;
    me.scale = 1;
    me.isDoubleTap = FALSE;
    me.rotate = option.rotate || noop;
    me.touchStart = option.touchStart || noop;
    me.multipointStart = option.multipointStart || noop;
    me.multipointEnd = option.multipointEnd || function () {};
    me.pinch = option.pinch || noop;
    me.swipe = option.swipe || noop;
    me.tap = option.tap || noop;
    me.doubleTap = option.doubleTap || noop;
    me.longTap = option.longTap || noop;
    me.singleTap = option.singleTap || noop;
    me.pressMove = option.pressMove || noop;
    me.touchMove = option.touchMove || noop;
    me.touchEnd = option.touchEnd || noop;
    me.touchCancel = option.touchCancel || noop;

    me.delta = me.last = me.now = me.tapTimeout = me.touchTimeout = me.longTapTimeout = me.swipeTimeout = me.x1 = me.x2 = me.y1 = me.y2 = NULL;

    me.preTapPosition = { x: NULL, y: NULL };
};

AlloyFinger.prototype = {
    start: function start(evt) {
        var me = this;
        if (!evt.touches) return;
        me.now = Date.now();
        me.x1 = evt.touches[0].pageX;
        me.y1 = evt.touches[0].pageY;
        me.delta = me.now - (me.last || me.now);
        me.touchStart(evt);
        if (me.preTapPosition.x !== NULL) {
            me.isDoubleTap = me.delta > 0 && me.delta <= 250 && Math.abs(me.preTapPosition.x - me.x1) < 30 && Math.abs(me.preTapPosition.y - me.y1) < 30;
        }
        me.preTapPosition.x = me.x1;
        me.preTapPosition.y = me.y1;
        me.last = me.now;
        var preV = me.preV,
            len = evt.touches.length;
        if (len > 1) {
            var v = { x: evt.touches[1].pageX - me.x1, y: evt.touches[1].pageY - me.y1 };
            preV.x = v.x;
            preV.y = v.y;
            me.pinchStartLen = getLen(preV);
            me.multipointStart(evt);
        }
        me.longTapTimeout = setTimeout(function () {
            me.longTap(evt);
        }.bind(me), 750);
    },
    move: function move(evt) {
        var me = this;
        if (!evt.touches) return;
        var preV = me.preV,
            len = evt.touches.length,
            currentX = evt.touches[0].pageX,
            currentY = evt.touches[0].pageY;
        me.isDoubleTap = FALSE;
        if (len > 1) {
            var v = { x: evt.touches[1].pageX - currentX, y: evt.touches[1].pageY - currentY };

            if (preV.x !== NULL) {
                if (me.pinchStartLen > 0) {
                    evt.scale = getLen(v) / me.pinchStartLen;
                    me.pinch(evt);
                }

                evt.angle = getRotateAngle(v, preV);
                me.rotate(evt);
            }
            preV.x = v.x;
            preV.y = v.y;
        } else {
            if (me.x2 !== NULL) {
                evt.deltaX = currentX - me.x2;
                evt.deltaY = currentY - me.y2;
            } else {
                evt.deltaX = 0;
                evt.deltaY = 0;
            }
            me.pressMove(evt);
        }

        me.touchMove(evt);

        me._cancelLongTap();
        me.x2 = currentX;
        me.y2 = currentY;
        if (evt.touches.length > 1) {
            evt.preventDefault();
        }
    },
    end: function end(evt) {
        var me = this;
        if (!evt.changedTouches) return;
        me._cancelLongTap();
        var self = me;
        if (evt.touches.length < 2) {
            me.multipointEnd(evt);
        }
        me.touchEnd(evt);

        if (me.x2 && Math.abs(me.x1 - me.x2) > 30 || me.y2 && Math.abs(me.preV.y - me.y2) > 30) {
            evt.direction = me._swipeDirection(me.x1, me.x2, me.y1, me.y2);
            me.swipeTimeout = setTimeout(function () {
                self.swipe(evt);
            }, 0);
        } else {
            me.tapTimeout = setTimeout(function () {
                self.tap(evt);

                if (self.isDoubleTap) {
                    self.doubleTap(evt);
                    clearTimeout(self.touchTimeout);
                    self.isDoubleTap = FALSE;
                } else {
                    self.touchTimeout = setTimeout(function () {
                        self.singleTap(evt);
                    }, 250);
                }
            }, 0);
        }

        me.preV.x = 0;
        me.preV.y = 0;
        me.scale = 1;
        me.pinchStartLen = NULL;
        me.x1 = me.x2 = me.y1 = me.y2 = NULL;
    },
    cancel: function cancel(evt) {
        var me = this;
        clearTimeout(me.touchTimeout);
        clearInterval(me.tapTimeout);
        clearInterval(me.longTapTimeout);
        clearInterval(me.swipeTimeout);
        me.touchCancel(evt);
    },
    _cancelLongTap: function _cancelLongTap() {
        clearTimeout(this.longTapTimeout);
    },
    _swipeDirection: function _swipeDirection(x1, x2, y1, y2) {
        return Math.abs(x1 - x2) >= Math.abs(y1 - y2) ? x1 - x2 > 0 ? 'Left' : 'Right' : y1 - y2 > 0 ? 'Up' : 'Down';
    },
    destory: function destory() {
        var me = this;
        var el = me.el;
        el.removeEventListener("touchstart", me.startHandler, FALSE);
        el.removeEventListener("touchmove", me.moveHandler, FALSE);
        el.removeEventListener("touchend", me.endHandler, FALSE);
        el.removeEventListener("touchcancel", me.cancelHandle, FALSE);
    }

};

var utils = void 0;

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
        var emitter = new utils.Emitter();
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
      return listener.call(this, new utils.Event(event));
    });
  },
  detach: function detach(name, el) {
    el.$finger.alloy.destroy();
    el.$finger.emitter.off();
    el.$finger = null;
  }
};

var version = '0.0.2';

function install(Yox) {
  utils = Yox.utils;
  utils.array.each([TAP, LONG_TAP, SINGLE_TAP, DOUBLE_TAP, SWIPE, PINCH, ROTATE, PRESS_MOVE, MULTIPOINT_START, MULTIPOINT_END], function (name) {
    Yox.directive(name, directive);
  });
}

if (typeof Yox !== 'undefined' && Yox.use) {
  Yox.use(Router);
}

exports.version = version;
exports.install = install;

Object.defineProperty(exports, '__esModule', { value: true });

})));
