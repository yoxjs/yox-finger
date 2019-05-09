
const AlloyFinger = typeof require === 'function'
    ? require('alloyfinger')
    : window.AlloyFinger

if (!AlloyFinger) {
  throw new Error('[yox-finger] cannot locate AlloyFinger.js.')
}

const events = [
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
  'touchCancel',
]

/**
 * 版本
 *
 * @type {string}
 */
export const version = process.env.NODE_VERSION

export function install(Yox) {

  Yox.array.each(
    events,
    function (name) {
      Yox.dom.addSpecialEvent(name, {
        on(node, listener) {
          const finger = node.$finger || (node.$finger = new AlloyFinger(node, {}))
          finger.on(name, listener)
        },
        off(node, listener) {

          const finger = node.$finger
          finger.off(name, listener)

          // 判断是否还有别的事件监听
          let hasEvent = false

          Yox.array.each(
            events,
            function (event) {
              const handlers = finger[event] && finger[event].handlers
              if (!Yox.array.falsy(handlers)) {
                hasEvent = true
                return false
              }
            }
          )

          if (!hasEvent) {
            finger.destroy()
            node.$finger = null
          }

        }
      })
    }
  )

}
