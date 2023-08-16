# ease-note

一个不受设备限制，令人舒服的智能笔记本

## 设计

跨端，网页版支持框选创建，笔记本部分支持主题、一些常用写法，支持浏览器缓存、cache提升体验感，后续接入gpt服务助力写作

electron, ts, react, webpack, cache, indexDB


## 参考

- [快速开发一个锤子便签](https://juejin.cn/post/6944547426237677598)
- [前端实战:electron+vue3+ts开发桌面端便签应用](https://cloud.tencent.com/developer/article/1872298)
- [FeHelper：我的便签笔记 ](https://www.baidufe.com/fehelper/sticky-notes/index.html)
- [manifest.app](https://www.manifest.app/)

- [客户端存储](https://developer.mozilla.org/zh-CN/docs/Learn/JavaScript/Client-side_web_APIs/Client-side_storage)

## 从零自定义配置

### webpack

打包工具

### webpack-dev-server

### 支持ts,tsx,es6语法等

### 自动处理模板

### 支持样式

### 图标，图片等

## 本地调试

1. package.json中去掉"peerDependencies"

2. webpack.config.js中去掉 externals

3. 启动主站，登录一下。note和主站端口一样，可以复用主站cookie信息。

运行：
> npm run start

## FAQ

1. NPM, PNMP, YARN等安装失败（包括开启全局代理）

使用cnpm安装
```
npm install -g cnpm --registry=https://registry.npm.taobao.org
cnpm i electron
```

2. npm link联调报错：Cannot read properties of null (reading 'useState')...

https://github.com/facebook/react/issues/24928

删除ease-note/node_modules, 注意软链接会作用到原文件；或者使用“peerDependencies”
