# yox-finger

封装 [AlloyFinger](https://github.com/AlloyTeam/AlloyFinger)，实现超小的手势库。

没有 `yox-touch` 强大，比如鼠标点击不会触发 `tap` 事件。

如果完全不考虑网页出现在 PC 场景，建议使用此库，而不是 `yox-touch`。

## Install

NPM

```shell
npm install yox-finger
```

```javascript
import Yox from 'yox'
import YoxFinger from 'yox-finger'
Yox.use(YoxFinger)
```

CDN

```html
<script src="https://unpkg.com/yox@latest"></script>
<script src="https://unpkg.com/yox-finger@latest"></script>
```

## Usage

```html
<button o-tap="tap()">
  Tap
</button>
<button o-pinch="pinch()">
  Pinch
</button>
```

```javascript
{
    methods: {
        tap: function () {

        },
        pinch: function () {

        }
    }
}
```
