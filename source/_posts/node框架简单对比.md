---
layout: '[post]'
title: node框架简单对比
date: 2020-08-10 17:10:30
tags: node
---
## 起因
最近一直想学点什么，想来想去，决定学习下node的实际作为后台应用的使用吧，狠狠心买了个云服务器o(╥﹏╥)o。  

但是目前nodejs的框架很多，都是很优秀，那么该选择哪种好一些呢？
<!-- more -->
## Express.js
Express 是 node 环境中非常流行的Web服务端框架，有很大比例的 Node Web应用 采用了 Express。

 Node.JS 诞生之初，最早出现的一款框架，现在仍然很流行，作者是TJ。
 
 支持0.1.0以上的node，有非常多的插件提供给用户使用。  
 [github](https://github.com/expressjs/express)
##  Koa.js
TJ在Express.js之后推出的新的框架，相比Express.js更为精简。 

Koa 是一个比Express更精简，使用node新特性的中间件框架。其提供的是一个架子，而几乎所有的功能都需要由第三方中间件完成，比如koa-router, koa-view等。（我的理解就是需要什么，去下载什么就好）  

最开始使用generator进行异步的编写，后来在Koa2中使用了新的ES规范的await和async的形式进行开发。

[github](https://github.com/koajs/koa)
## Egg.js
> Egg.js 为企业级框架和应用而生，我们希望由 Egg.js 孕育出更多上层框架，帮助开发团队和开发人员降低开发和维护成本。(官网的说明)


Egg.js 是基于 Koa.js，解决了上述问题，将社区最佳实践整合进了 Koa.js，另取名叫 Egg.js，并且将多进程启动，开发时的热更新等问题一并解决了。这对开发者很友好，开箱即用。  

[github](https://github.com/eggjs/egg)

## MidwayJS
实际上就是Egg的TS支持版本。

淘宝团队在 Egg.js 基础上，引入了 TypeScript 支持。

[github](https://github.com/midwayjs/pandora)

## Nest.js
基于 Express.js 的全功能框架 Nest.js

生态不错也比较推荐。