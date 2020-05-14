---
layout: '[post]'
title: ES6中的Proxy、Reflect以及Vue3.0中的应用原理
date: 2020-04-02 01:18:35
tags: Vue
---


## 使用`Object.defineProperty`的一些劣势：

1.  `Object.defineProperty`监听的是对象的属性，如果对象比较复杂，需要逐个深层遍历他的属性来实现监听，耗费性能
2.  `Object.defineProperty`无法监听数组的变化，使 Vue 不得不对数组做了额外的 hack。

相比之下`Proxy`就更强大，接下来我们就来了解他。
<!-- more -->
参考资料：

*   [MDN-Proxy](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
*   [MDN-Reflect](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect)
*   [面试官: 实现双向绑定 Proxy 比 defineproperty 优劣如何?](https://juejin.im/post/5acd0c8a6fb9a028da7cdfaf#heading-3)

### Proxy 简介

MDN 上是这么描述的——Proxy对象用于定义基本操作的自定义行为（如属性查找，赋值，枚举，函数调用等）。

官方的描述总是言简意赅，以至于不明觉厉...

其实就是在对目标对象的操作之前提供了拦截，可以对外界的操作进行过滤和改写，修改某些操作的默认行为，这样我们可以不直接操作对象本身，而是通过操作对象的代理对象来间接来操作对象，达到预期的目的~


> Proxy 对象用于定义基本操作的自定义行为（如属性查找，赋值，枚举，函数调用等）。使用方法如下：

```js
// 语法
let p = new Proxy(target, handler);
// 用例
let p = {a: 1};
let proxyP = new Proxy(p, {
	get() {
		// 获取proxyP对象属性时的自定义逻辑
	},
	set() {
		// 设置proxyP对象属性时的自定义逻辑
	}
})
```

上边的代码中：

*   target：用 Proxy 包装的目标对象（可以是任何类型的对象，包括原生数组，函数，甚至另一个代理）。
*   handler：一个对象，其属性是当执行一个操作时定义代理的行为的函数。
*   p/proxyP：是一个被代理后的新对象, 它拥有 target 的一切属性和方法. 只不过其行为和结果是在 handler 中自定义的.

> 这里重点说一下`handler`：`handler`本身就是 ES6 所新设计的一个对象. 它的作用就是用来自定义代理对象的各种可代理操作。它本身一共有 13 中方法, 每种方法都可以代理一种操作，常用的几种方法如下:

```js
// 在定义代理对象某个属性时的属性描述时触发该操作，比如在执行 Object.defineProperty(proxy, "foo", {}) 时。
handler.defineProperty()

// 在判断代理对象是否拥有某个属性时触发该操作，比如在执行 "foo" in proxy 时。
handler.has()

// 在读取代理对象的某个属性时触发该操作，比如在执行 proxy.foo 时。
handler.get()

// 在给代理对象的某个属性赋值时触发该操作，比如在执行 proxy.foo = 1 时。
handler.set()

// 在删除代理对象的某个属性时触发该操作，比如在执行 delete proxy.foo 时。
handler.deleteProperty()

// 在获取代理对象的所有属性键时触发该操作，比如在执行 Object.getOwnPropertyNames(proxy) 时。
handler.ownKeys()

// 在调用一个目标对象为函数的代理对象时触发该操作，比如在执行 proxy() 时。
handler.apply()

// 在给一个目标对象为构造函数的代理对象构造实例时触发该操作，比如在执行new proxy() 时。
handler.construct()
```

Proxy 对于代理模式 Proxy 的作用主要体现在三个方面:

1.  拦截和监视外部对对象的访问
2.  降低函数或类的复杂度
3.  在复杂操作前对操作进行校验或对所需资源进行管理

### Proxy 在 Vue3.0 中的应用原理

上边已经说过了`Object.defineProperty`的劣势。相应的`Proxy`的优势就很明显了：

*   Proxy 可以直接监听对象而非属性
*   Proxy 可以直接监听数组的变化
*   Proxy 有 13 中拦截方法，功能更强大。

Proxy 的劣势： 兼容性问题, 而且无法用 polyfill 磨平, 因此 Vue 要到 3.0 版本才能用 Proxy 重写。

简单例子：

```js
const input = document.getElementById('input');
const p = document.getElementById('p');
const obj = {};

const newObj = new Proxy(obj, {
  get: function(target, key, receiver) {
    console.log(`getting ${key}!`);
    return Reflect.get(target, key, receiver);
  },
  set: function(target, key, value, receiver) {
    console.log(target, key, value, receiver);
    if (key === 'text') {
      input.value = value;
      p.innerHTML = value;
    }
    return Reflect.set(target, key, value, receiver);
  },
});

input.addEventListener('keyup', function(e) {
  newObj.text = e.target.value;
});
```

### Reflect

> Reflect 是一个内置的对象，它提供拦截 JavaScript 操作的方法。这些方法与处理器对象的方法相同。Reflect 不是一个函数对象，因此它是不可构造 (即不可`new Reflect`) 的。

`Reflect`对象的方法与`Proxy`对象的方法一一对应，只要是`Proxy`对象的方法，就能在`Reflect`对象上找到对应的方法。这就让`Proxy`对象可以方便地调用对应的 Reflect 方法，完成默认行为，作为修改行为的基础。也就是说，不管`Proxy`怎么修改默认行为，你总可以在`Reflect`上获取默认行为。

**也就是说，Reflect.fn 表示 handler 中的 fn 的默认行为。**

这里我们看两段代码：

```js
// 这里是get/set方法打印log之后，再执行默认行为
var obj = new Proxy({}, {
  get: function (target, key, receiver) {
    console.log(`getting ${key}!`);
    // 在浏览器console中，get方法会默认打印出值
    // 如果没有Reflect.get执行默认行为，就无法正确打印出值，而会打印undefined
    return Reflect.get(target, key, receiver);
  },
  set: function (target, key, value, receiver) {
    console.log(`setting ${key}!`);
    return Reflect.set(target, key, value, receiver);
  }
});

// 这里是先执行默认的set确保默认行为执行，set成功之后在打印log，然后返回
var obj = new Proxy({}, {
  set: function(target, name, value, receiver) {
    var success = Reflect.set(target,name, value, receiver);
    if (success) {
      console.log('property ' + name + ' on ' + target + ' set to ' + value);
    }
    return success;
  }
});
```

[原文地址 ](https://blog.csdn.net/Creabine/article/details/87811207
)