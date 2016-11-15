
import AlloyFinger from './AlloyFinger'

let utils

const TAP = 'tap'
const LONG_TAP = 'longTap'
const SINGLE_TAP = 'singleTap'
const DOUBLE_TAP = 'doubleTap'
const SWIPE = 'swipe'
const PINCH = 'pinch'
const ROTATE = 'rotate'
const PRESS_MOVE = 'pressMove'
const MULTIPOINT_START = 'multipointStart'
const MULTIPOINT_END = 'multipointEnd'

const directive = {
  attach: function ({ el, name, node, instance, directives }) {

    if (!el.$finger) {
      let emitter = new utils.Emitter()
      let alloy = new AlloyFinger(el, {
        tap: function (e) {
          emitter.fire(TAP, e)
        },
        longTap: function (e) {
          emitter.fire(LONG_TAP, e)
        },
        singleTap: function (e) {
          emitter.fire(SINGLE_TAP, e)
        },
        doubleTap: function (e) {
          emitter.fire(DOUBLE_TAP, e)
        },
        swipe: function (e) {
          emitter.fire(SWIPE, e)
        },
        pinch: function (e) {
          emitter.fire(PINCH, e)
        },
        rotate: function (e) {
          emitter.fire(MULTIPOINT_START, e)
        },
        pressMove: function (e) {
          emitter.fire(PRESS_MOVE, e)
        },
        multipointStart: function (e) {
          emitter.fire(MULTIPOINT_START, e)
        },
        multipointEnd: function (e) {
          emitter.fire(MULTIPOINT_END, e)
        },
      })
      el.$finger = { emitter, alloy }
    }

    let listener = instance.compileAttr(node.keypath, node.getValue())
    el.$finger.emitter.on(
      name,
      function (event) {
        return listener.call(this, new utils.Event(event))
      }
    )

  },
  detach: function (name, el) {
    el.$finger.alloy.destroy()
    el.$finger.emitter.off()
    el.$finger = null
  }
}

export function install(Yox) {
  utils = Yox.utils
  utils.array.each(
    [ TAP, LONG_TAP, SINGLE_TAP, DOUBLE_TAP, SWIPE, PINCH, ROTATE, PRESS_MOVE, MULTIPOINT_START, MULTIPOINT_END ],
    function (name) {
      Yox.directive(name, directive)
    }
  )
}
