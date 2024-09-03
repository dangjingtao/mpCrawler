# mpCrawler

一个简易的公众号爬虫

## 前置准备

1. 安装最新版 google Chrome.
2. 离线安装 Tampermonkey
   - 在浏览器的地址栏中输入 `chrome://extensions/`, 然后回车
   - 右上角打开开发者模式
     ![image-20240810142335265](/Users/tao/Desktop/微信公众号/微信公众号爬虫.assets/image-20240810142335265.png)
   - 把 crx 文件拖拽进 Chrome

This template should help get you started developing Tampermonkey UserScript.

- Support ESNext and ES Modules
- Support CSS Modules and sass, scss, less, stylus
- Support SVG Sprite
- Support deal with static resources
- Support international languages
- It's build with rollup, thus you can add external plugins to achieve needed helpers

## Settings

### How to use CSS Processor(sass, scss, less, stylus)?

Install corresponding dependency:

- For Sass install node-sass: yarn add node-sass --dev
- For Stylus Install stylus: yarn add stylus --dev
- For Less Install less: yarn add less --dev

That's it, you can now import .styl .scss .sass .less files in your library.

([Follow this guide](https://www.npmjs.com/package/rollup-plugin-postcss/v/2.4.1#with-sassstylusless))

### How to add SVG to Sprite?

Settle the svg file to + `src/svg`folder, and import it to sprite.js.

### How to add plugins to rollup?

Config it in `src/rollup_configs/default.js`.

## Project Setup

```sh
yarn
```

### Watch and Compile for Development

```sh
yarn dev
```

### Type-Check, Compile and Minify for Production

```sh
yarn build
```
