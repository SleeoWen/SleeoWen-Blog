---
layout: '[post]'
title: Vue模板编译
date: 2020-02-28 13:57:05
tags: Vue
---
## 模版编译

- 模版是vue开发中最常用的部分，即与使用相关的原理
- 不是html，有指令等
- 组件渲染和更新的过程

<!-- more -->
### js的with语法

 - 改变{}内自由变量的查找规则，当作obj的属性来查找
 - 如果找不到匹配的属性，则报错
 - with慎用，打破了作用域的规则，易读性差

### vue template complier将模版编译为render函数

```js
const compiler = require('vue-template-compiler')

// 插值
const template = `<p>{{message}}</p>`
// with(this){return createElement('p',[createTextVNode(toString(message))])}
// h -> vnode
// createElement -> vnode

// // 表达式
const template = `<p>{{flag ? message : 'no message found'}}</p>`
// // with(this){return _c('p',[_v(_s(flag ? message : 'no message found'))])}

// // 属性和动态属性
const template = `
    <div id="div1" class="container">
        <img :src="imgUrl"/>
    </div>
`
// with(this){return _c('div',
//      {staticClass:"container",attrs:{"id":"div1"}},
//      [
//          _c('img',{attrs:{"src":imgUrl}})])}

// // 条件
const template = `
    <div>
        <p v-if="flag === 'a'">A</p>
        <p v-else-if="flag === 'b'">C</p>
        <p v-else>B</p>
    </div>
`
// with(this){return _c('div',[(flag === 'a')?_c('p',[_v("A")]):_c('p',[_v("B")])])}

// 循环
const template = `
    <ul>
        <li v-for="item in list" :key="item.id">{{item.title}}</li>
    </ul>
`
// with(this){return _c('ul',_l((list),function(item){return _c('li',{key:item.id},[_v(_s(item.title))])}),0)}

// 事件
const template = `
    <button @click="clickHandler">submit</button>
`
// with(this){return _c('button',{on:{"click":clickHandler}},[_v("submit")])}

// v-model
const template = `<input type="text" v-model="name">`
// 主要看 input 事件
// with(this){return _c('input',{directives:[{name:"model",rawName:"v-model",value:(name),expression:"name"}],attrs:{"type":"text"},domProps:{"value":(name)},on:{"input":function($event){if($event.target.composing)return;name=$event.target.value}}})}

// render 函数
// 返回 vnode
// patch

// 编译
const res = compiler.compile(template)
console.log(res.render)

// ---------------分割线--------------

// // 从 vue 源码中找到缩写函数的含义
// function installRenderHelpers (target) {
//     target._o = markOnce;
//     target._n = toNumber;
//     target._s = toString;
//     target._l = renderList;
//     target._t = renderSlot;
//     target._q = looseEqual;
//     target._i = looseIndexOf;
//     target._m = renderStatic;
//     target._f = resolveFilter;
//     target._k = checkKeyCodes;
//     target._b = bindObjectProps;
//     target._v = createTextVNode;
//     target._e = createEmptyVNode;
//     target._u = resolveScopedSlots;
//     target._g = bindObjectListeners;
//     target._d = bindDynamicKeys;
//     target._p = prependModifier;
// }

```


### 执行render 生成 vnode

执行render函数生成vnode

### 总结

- 模版编译为render函数，执行render函数返回vnode
- 基于vonde再执行patch和diff
- 使用webpack vue-loader，会在开发环境下编译模版

### 可以使用render代替template









