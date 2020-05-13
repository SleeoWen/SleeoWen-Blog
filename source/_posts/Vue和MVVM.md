---
layout: '[post]'
title: Vue和MVVM
date: 2020-01-12 23:48:50
tags: Vue
---
## Vue.js

### Vue.js是什么
 - Vue.js 是一个轻巧、高性能、可组件化的 MVVM 库，拥有非常容易上手的 API；
 - Vue.js是一个构建数据驱动的 Web 界面的库。

<!-- more -->
### Vue.js 的特性
1. 轻量级的框架
2. 双向数据绑定
3. 指令
4. 插件化（组件化）

### MVVM 框架
 - MVVM（Model-View-ViewModel）是对 MVC（Model-View-Control）和 MVP（Model-View-Presenter）的进一步改进。
> 『View』：视图层（UI 用户界面）

> 『ViewModel』：业务逻辑层（一切 js 可视为业务逻辑）

> 『Model』：数据层（存储数据及对数据的处理如增删改查）

- MVVM 将数据双向绑定（data-binding）作为核心思想，View 和 Model 之间没有联系，它们通过 ViewModel 这个桥梁进行交互。
- Model 和 ViewModel 之间的交互是双向的，因此 View 的变化会自动同步到 Model，而 Model 的变化也会立即反映到 View 上显示。
- 当用户操作 View，ViewModel 感知到变化，然后通知 Model 发生相应改变；反之当 Model 发生改变，ViewModel 也能感知到变化，使 View 作出相应更新。
- Angular 和 Ember 都采用这种模式。

### Vue 的开发模式
 - 通过 script 标签直接引入 vue.js
 - 通过 Vue 的脚手架工具 vue-cli 来进行一键项目搭建

### Vue.js 的优点
 - 简单轻巧，功能强大，拥有非常容易上手的 API；
 - 可组件化 和 响应式设计；
 - 实现数据与结构分离，高性能，易于浏览器的加载速度；
 - MVVM 模式，数据双向绑定，减少了 DOM 操作，将更多精力放在数据和业务逻辑上。

### Vue的优点
 - 低耦合。视图（View）可以独立于 Model 变化和修改，一个 ViewModel 可以绑定到不同的 "View" 上，当 View 变化的时候 Model 可以不变，当 Model 变化的时候 View 也可以不变。
 - 可重用性。你可以把一些视图逻辑放在一个 ViewModel 里面，让很多 View 重用这段视图逻辑。
 - 独立开发。开发人员可以专注于业务逻辑和数据的开发（ViewModel），设计人员可以专注于页面设计。
 - 方便测试。界面素来是比较难于测试的，开发中大部分 Bug 来至于逻辑处理，由于 ViewModel 分离了许多逻辑，可以对 ViewModel 构造单元测试。
 - 易用 灵活 高效。

## MVVM

### JQuery和MVVM的区别
 - 数据和视图的分离，解耦（开放封闭原则）
 - 以数据驱动视图，只关心数据变化，DOM操作被封装

### 什么是MVVM
 - MVVM 是 Model-View-ViewModel 的缩写。MVVM 是一种设计思想。Model 层代表数据模型，也可以在 Model 中定义数据修改和操作的业务逻辑；View 代表 UI 组件，它负责将数据模型转化成 UI 展现出来，ViewModel 是一个同步 View 和 Model 的对象。
 - 在 MVVM 架构下，View 和 Model 之间并没有直接的联系，而是通过 ViewModel 进行交互，Model 和 ViewModel 之间的交互是双向的， 因此 View 数据的变化会同步到 Model 中，而 Model 数据的变化也会立即反应到 View 上。
 - ViewModel 通过双向数据绑定把 View 层和 Model 层连接了起来，而View 和 Model 之间的同步工作完全是自动的，无需人为干涉，因此开发者只需关注业务逻辑，不需要手动操作DOM, 不需要关注数据状态的同步问题，复杂的数据状态维护完全由 MVVM 来统一管理。

## Vue和MVVM

 - 响应式：vue如何监听到data的每个属性变化？
 - 模板引擎：vue的模板如何被解析，指令如何处理？
 - 渲染：vue的模板如何被渲染成html？以及渲染过程

### vue中如何实现响应式

#### 什么是响应式
 - 修改data属性后，vue立刻监听到
 - data属性被代理到vm上

### Object.defineProperty(obj, prop, desc)
**实现响应式的核心函数**
> Object.defineProperty(obj, prop, desc)的作用就是直接在一个对象上定义一个新属性，或者修改一个已经存在的属性  
模板中没有的数据，不会走get监听，所以也不会走set监听，Object.defineProperty的原则是走get才会走set,防止无用的数据重复渲染。

```js
var vm = {}
var data = {
    name: 'zhangsan',
    age: 20
}

var key, value
for (key in data) {
    (function (key) {
        Object.defineProperty(vm, key, {
            get: function () {
                console.log('get', data[key]) // 监听
                return data[key]
            },
            set: function (newVal) {
                console.log('set', newVal) // 监听
                data[key] = newVal
            }
        })
    })(key)
}
```
### vue中如何解析模板
#### 模板是什么？
 - 本质：字符串
 - 有逻辑，如v-if v-for等
 - 与html很像，但有很大区别
 - 最终还要转化成html来显示
 - 模板最终要装换成js代码（render函数）


```js
//模板
    <div id="app">
        <p>{{price}}</p>
    </div>
//render函数
        function render() {
            with(this) {  // this 就是 vm
                return _c(
                    'div',
                    {
                        attrs: {'id': 'app'}
                    },
                    [
                        _c('p', [_v(_s(price))])
                    ]
                )
            }
        }
//在vue源码中搜索code.render，然后alert(code.render)可以看render函数
```

 - h函数生成vdom
 - patch函数渲染成dom

---

- h函数就是vue中的createElement方法，这个函数作用就是创建虚拟dom，追踪dom变化的

### vue的整个实现流程
1. 解析模板成render函数
2. 响应式开始监听
3. 首次渲染，显示页面，且绑定依赖
4. data属性变化，触发rerender
