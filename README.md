# yox-finger

基于 [AlloyFinger](https://github.com/AlloyTeam/AlloyFinger)，实现超小的手势库。

`yox-finger` 没有 `yox-touch` 强大，比如鼠标点击不会触发 `tap` 事件。

如果完全不考虑网页出现在 PC 场景，建议使用此库，而不是 `yox-touch`。

## Install

NPM

```shell
npm install yox
npm install yox-finger
```

```js
import Yox from 'yox'
import * as YoxFinger from 'yox-finger'
Yox.use(YoxFinger)
```

CDN

```html
<script src="https://unpkg.com/alloyfinger@latest"></script>
<script src="https://unpkg.com/yox@latest"></script>
<script src="https://unpkg.com/yox-finger@latest"></script>
<script>
  Yox.use(YoxFinger)
</script>
```

## Usage

```js
{
  methods: {
    tap: function () {

    },
    pinch: function () {

    },
    longTap: function () {

    }
  }
}
```

```html
<div>
  <button on-tap="tap()">
    Tap
  </button>
  <button on-pinch="pinch()">
    Pinch
  </button>
  <button on-long-tap="longTap()">
    Long Tap
  </button>
</div>
```
