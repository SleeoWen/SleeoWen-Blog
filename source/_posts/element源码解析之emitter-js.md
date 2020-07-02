---
layout: '[post]'
title: element源码解析之emitter.js
date: 2020-06-29 15:31:45
tags: element
---
打开 emitter.js，发现该 js 是提供方法给其他组件做混入使用的。他对外有 dispatch 和 broadcast 两个接口，从命名和参数等方面，这两个方法应该大致是用来处理一些各层级之间事件的，也就是通信。我们先来看下 dispatch 方法。
<!-- more -->
### 一、dispatch

dispatch 方法有三个参数，

*   componentName，表示组件名称，用于匹配正确到正确的组件名。
*   eventName，事件名，需要触发的事件
*   params，参数，触发时带入的参数

前两行，用于查找到当前元素的父组件，如果没有就使用根节点，并取父组件的组件名用于后期匹配。

紧接着的是一个 while 循环，用于循环父组件，直到找到或者到达根元素，匹配不到。

```js
while (parent && (!name || name !== componentName)) {
    parent = parent.$parent;
 
    if (parent) {
        name = parent.$options.componentName;
    }
}
```

循环过程中不断记录组件名，用于判断是否找到。

最后一部分是，当有匹配到的父组件时，就去触发父组件的对应的事件函数。

```js
if (parent) {
    parent.$emit.apply(parent,[eventName].concat(params));
}
```

接下来看下 broadcast 函数。

### 二、broadcast

将 emitter 内部定义的一个 broadcast 函数利用 call 改变 this 指向。

broadcast 内直接对子组件进行遍历，当匹配到对应的组件名时，则去触发对应子组件的对应事件。如果没有，则递归继续查找子组件。

注：我们会发现每条向下传播的线路只要触发了一次对应的事件，就不会再向下传递了。

### 三、源码
```js
function broadcast(componentName, eventName, params) {
  // 开始遍历子组件
  this.$children.forEach(child => {
    var name = child.$options.componentName;
    // 匹配子组件的name
    if (name === componentName) {
      // 匹配到时，子组件触发对应的事件
      // 匹配到一个就over了，该子元素的子元素就忽略了
      child.$emit.apply(child, [eventName].concat(params));
    } else {
      // 继续查找该子组件的子元素
      broadcast.apply(child, [componentName, eventName].concat([params]));
    }
  });
}
export default {
  methods: {
    dispatch(componentName, eventName, params) {
      var parent = this.$parent || this.$root;
      var name = parent.$options.componentName;
      // 遍历父组件，查找并匹配name，直到找到对应的父组件或无
      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent;

        if (parent) {
          // 匹配到，则修改name，用于判断并推出循环
          name = parent.$options.componentName;
        }
      }
      if (parent) {
        // 有对应的父组件，则去触发对应的事件
        parent.$emit.apply(parent, [eventName].concat(params));
      }
    },
    broadcast(componentName, eventName, params) {
      // 调用broadcast函数，需要纠正this，因为broadcast函数的this并不指向调用者
      broadcast.call(this, componentName, eventName, params);
    }
  }
};
```

带注释的源码：[emitter.js](https://github.com/2fps/demo/blob/master/view/2019/00/element-ui%E6%BA%90%E7%A0%81%E5%AD%A6%E4%B9%A0/emitter.js)。

element-ui 中的事件传播就是这样的了，让我想到了 angular 中的 $broadcast 和 $emit 事件。

 原文地址 [www.jb51.cc](https://www.jb51.cc/webfrontend/454354.html)


