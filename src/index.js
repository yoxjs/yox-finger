
let AlloyFinger = typeof require === 'function'
    ? require('alloyfinger')
    : window.AlloyFinger

if (!AlloyFinger) {
  throw new Error('[yox-touch] cannot locate AlloyFinger.js.')
}

let Event, Emitter

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

function directive({ el, node, instance }) {

  if (!el.$finger) {
    let emitter = new Emitter()
    let alloy = new AlloyFinger(el, {
      tap(e) {
        emitter.fire(TAP, e)
      },
      longTap(e) {
        emitter.fire(LONG_TAP, e)
      },
      singleTap(e) {
        emitter.fire(SINGLE_TAP, e)
      },
      doubleTap(e) {
        emitter.fire(DOUBLE_TAP, e)
      },
      swipe(e) {
        emitter.fire(SWIPE, e)
      },
      pinch(e) {
        emitter.fire(PINCH, e)
      },
      rotate(e) {
        emitter.fire(MULTIPOINT_START, e)
      },
      pressMove(e) {
        emitter.fire(PRESS_MOVE, e)
      },
      multipointStart(e) {
        emitter.fire(MULTIPOINT_START, e)
      },
      multipointEnd(e) {
        emitter.fire(MULTIPOINT_END, e)
      },
    })
    el.$finger = { emitter, alloy }
  }

  let result = instance.compileDirective(node)
  if (result) {
    el.$finger.emitter.on(
      node.name,
      function (event) {
        return result.listener(new Event(event))
      }
    )
  }

  return function () {
    el.$finger.alloy.destroy()
    el.$finger.emitter.off()
    el.$finger = null
  }

}

export const version = '0.6.1'

export function install(Yox) {

  Event = Yox.Event
  Emitter = Yox.Emitter

  Yox.array.each(
    [
      TAP, LONG_TAP, SINGLE_TAP, DOUBLE_TAP,
      SWIPE, PINCH, ROTATE, PRESS_MOVE,
      MULTIPOINT_START, MULTIPOINT_END
    ],
    function (name) {
      Yox.directive(name, directive)
    }
  )

}

// 如果全局环境已有 Yox，自动安装
if (typeof Yox !== 'undefined' && Yox.use) {
  install(Yox)
}
