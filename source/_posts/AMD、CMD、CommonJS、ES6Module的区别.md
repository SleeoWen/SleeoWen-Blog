---
layout: '[post]'
title: AMD、CMD、CommonJS、ES6Module的区别
date: 2020-05-11 18:18:39
tags: javascript
---


### 前言

回想起之前的一次面试， 第一轮面试官问我 AMD 和 CMD 的区别，我只回答说 AMD 是提前加载，CMD 是按需加载。第二轮面试官又问了我 CommonJS 和 ES6 Module 的区别，emmm...，我大致回答说新的比旧的好~~，虽然面试官并没有说什么，不过显然这样的答案并不是有助于面试、有助于自己的技术积累的。

所以有必要进行一次梳理，以便更清晰地了解它们的特点及差异。
<!-- more -->
### AMD

AMD 一开始是 CommonJS 规范中的一个草案，全称是 Asynchronous Module Definition，即异步模块加载机制。后来由该草案的作者以 RequireJS 实现了 AMD 规范，所以一般说 AMD 也是指 RequireJS。

#### RequireJS 的基本用法

通过`define`来定义一个模块，使用`require`可以导入定义的模块。

```js
//a.js
//define可以传入三个参数，分别是字符串-模块名、数组-依赖模块、函数-回调函数
define(function(){
    return 1;
})

// b.js
//数组中声明需要加载的模块，可以是模块名、js文件路径
require(['a'], function(a){
    console.log(a);// 1
});
复制代码
```

#### RequireJS 的特点

对于依赖的模块，AMD 推崇**依赖前置，提前执行**。也就是说，在`define`方法里传入的依赖模块 (数组)，会在一开始就下载并执行。

### CMD

CMD 是 SeaJS 在推广过程中生产的对模块定义的规范，在 Web 浏览器端的模块加载器中，SeaJS 与 RequireJS 并称，SeaJS 作者为阿里的玉伯。

#### SeaJS 的基本用法

```js
//a.js
/*
* define 接受 factory 参数，factory 可以是一个函数，也可以是一个对象或字符串，
* factory 为对象、字符串时，表示模块的接口就是该对象、字符串。
* define 也可以接受两个以上参数。字符串 id 表示模块标识，数组 deps 是模块依赖.
*/
define(function(require, exports, module) {
  var $ = require('jquery');

  exports.setColor = function() {
    $('body').css('color','#333');
  };
});

//b.js
//数组中声明需要加载的模块，可以是模块名、js文件路径
seajs.use(['a'], function(a) {
  $('#el').click(a.setColor);
});
复制代码
```

#### SeaJS 的特点

对于依赖的模块，CMD 推崇**依赖就近，延迟执行**。也就是说，只有到`require`时依赖模块才执行。

### CommonJS

CommonJS 规范为 CommonJS 小组所提出，目的是弥补 JavaScript 在服务器端缺少模块化机制，NodeJS、webpack 都是基于该规范来实现的。

#### CommonJS 的基本用法

```js
//a.js
module.exports = function () {
  console.log("hello world")
}

//b.js
var a = require('./a');

a();//"hello world"

//或者

//a2.js
exports.num = 1;
exports.obj = {xx: 2};

//b2.js
var a2 = require('./a2');

console.log(a2);//{ num: 1, obj: { xx: 2 } }
复制代码
```

#### CommonJS 的特点

*   所有代码都运行在模块作用域，不会污染全局作用域；
*   模块是同步加载的，即只有加载完成，才能执行后面的操作；
*   模块在首次执行后就会缓存，再次加载只返回缓存结果，如果想要再次执行，可清除缓存；
*   CommonJS 输出是值的拷贝 (即，`require`返回的值是被输出的值的拷贝，模块内部的变化也不会影响这个值)。

### ES6 Module

ES6 Module 是 ES6 中规定的模块体系，相比上面提到的规范， ES6 Module 有更多的优势，有望成为浏览器和服务器通用的模块解决方案。

#### ES6 Module 的基本用法

```js
//a.js
var name = 'lin';
var age = 13;
var job = 'ninja';

export { name, age, job};

//b.js
import { name, age, job} from './a.js';

console.log(name, age, job);// lin 13 ninja

//或者

//a2.js
export default function () {
  console.log('default ');
}

//b2.js
import customName from './a2.js';
customName(); // 'default'
复制代码
```

#### ES6 Module 的特点 (对比 CommonJS)

*   CommonJS 模块是运行时加载，ES6 Module 是编译时输出接口；
*   CommonJS 加载的是整个模块，将所有的接口全部加载进来，ES6 Module 可以单独加载其中的某个接口；
*   CommonJS 输出是值的拷贝，ES6 Module 输出的是值的引用，被输出模块的内部的改变会影响引用的改变；
*   CommonJS `this`指向当前模块，ES6 Module `this`指向`undefined`;

目前浏览器对 ES6 Module 兼容还不太好，我们平时在 webpack 中使用的`export`/`import`，会被打包为`exports`/`require`。

### 写在后面

这里比较宽泛地把 JavaScript 中的几大模块化规范列举出来，希望借此对 JavaScript 模块化有大致的认识，而未对细节展开具体分析，感兴趣的可以自行探索。

原文地址 https://juejin.im/post/5db95e3a6fb9a020704bcd8d
