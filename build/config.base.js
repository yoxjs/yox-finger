// 替换代码中的变量
import replace from 'rollup-plugin-replace'
// 输出打包后的文件大小
import filesize from 'rollup-plugin-filesize'
// ES6 转 ES5
import buble from 'rollup-plugin-buble'
// 压缩
import { terser } from 'rollup-plugin-terser'
// 本地服务器
import serve from 'rollup-plugin-serve'

import { name, version, author, license } from '../package.json'

const banner =
  `${'/**\n' + ' * '}${name}.js v${version}\n` +
  ` * (c) 2017-${new Date().getFullYear()} ${author}\n` +
  ` * Released under the ${license} License.\n` +
  ` */\n`;

const sourcemap = true

export default function (env, minify = false, port = 0) {

  let plugins = [
    replace({
      'process.env.NODE_ENV': JSON.stringify(env),
      'process.env.NODE_VERSION': JSON.stringify(version),
    }),
    // buble 比 typescript 直接转 ES5 效果更好
    buble()
  ]

  if (minify) {
    plugins.push(
      terser()
    )
  }

  plugins.push(
    filesize()
  )

  if (port) {
    plugins.push(
      serve({
        port,
        contentBase: ['']
      })
    )
  }

  let fileName = name
  if (minify) {
    fileName += '.min'
  }

  return [
    {
      input: 'src/index.js',
      output: [
        {
          file: `dist/${fileName}.js`,
          format: 'umd',
          name: 'YoxFinger',
          banner,
          sourcemap,
        }
      ],
      plugins
    }
  ]
}