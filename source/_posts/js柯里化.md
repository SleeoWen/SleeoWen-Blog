---
layout: '[post]'
title: js柯里化
date: 2020-05-01 16:21:12
tags: javascript
---
### 前言

我们在各种算法题以及技术文档中经常会看到柯里化这个词，那么，柯里化到底是什么？它在 js 中如何运用？对我们的编程有什么作用？都 9102 年了，如果你还不知道这些，那么你在面试过程中很可能会被面试官 diss🙄
<!-- more -->
* * *

### 什么是柯里化（Currying）

*维基百科*的[解释](https://links.jianshu.com/go?to=https%3A%2F%2Fzh.wikipedia.org%2Fwiki%2F%25E6%259F%25AF%25E9%2587%258C%25E5%258C%2596)是：把接收多个参数的函数变换成接收一个单一参数（最初函数的第一个参数）的函数，并返回接受剩余的参数而且返回结果的新函数的技术。其由数学家 Haskell Brooks Curry 提出，并以 curry 命名。

简单的说，柯里化函数持续地返回一个新函数直到所有的参数用尽为止。这些参数全部保持 “活着” 的状态（通过闭包），然后当柯里化链中的最后一个函数被返回和执行时会全部被用来执行。

这和[高阶组件](https://links.jianshu.com/go?to=https%3A%2F%2Freact.docschina.org%2Fdocs%2Fhigher-order-components.html)（Higher-order functions）如出一辙。前者返回一个新函数，后者返回一个新组件。

### 举个简单的栗子

本例使用到的部分 ES6 知识：[const](https://links.jianshu.com/go?to=http%3A%2F%2Fes6.ruanyifeng.com%2F%23docs%2Flet)，[arrow function](https://links.jianshu.com/go?to=http%3A%2F%2Fes6.ruanyifeng.com%2F%23docs%2Ffunction)。不了解的同学可先行查看。  
写一个计算三个参数相乘的函数：

```js
function multiply (a, b, c) {
  return a * b * c
}
multiply(1, 2, 3)
```

这是我们第一反应写出来的 demo，也是看起来最简单的实现方法。再来创建一个柯里化版本的函数：

```js
function multiply (a) {
  return (b) => {
    return (c) => {
      return a * b * c
    }
  }
}
multiply(1)(2)(3)
```

这里我们将 multiply(1，2，3) 调用变成了 multiply (1) (2) (3) 调用。  
单独一个函数被转换成了一系列函数。为了得到数字 1、2、3 相乘的结果，这些数字被一个接一个地传递，每个数字预填了下一个函数内联调用。

我们把 multiply (1) (2) (3) 分割一下来帮助理解：

```js
const mul1 = multiply(1)
const mul2 = mul1(2)
const result = mul2(3)
console.log(result)
```

当 mul2 使用 3 作为参数调用时，它一起使用了之前已拿到的参数 a=1 和 b=2 进行运算并返回结果 6。

作为一个嵌套函数，mul2 能够访问到外部的两个函数 multiply 和 mul1 的作用域。这就是为什么 mul2 能利用定义在已经‘离场’的函数中的参数来进行乘法操作的原因。即使这些函数早已返回并且从内存中垃圾回收了，但其变量仍然保持‘活着’([闭包](https://links.jianshu.com/go?to=https%3A%2F%2Fwww.liaoxuefeng.com%2Fwiki%2F001434446689867b27157e896e74d51a89c25cc8b43bdb3000%2F00143449934543461c9d5dfeeb848f5b72bd012e1113d15000))。你可以看到 3 个数字每次只有 1 个提供给函数，并且同一时间里一个新函数会被返回，直到所有的数字用尽为止。

**柯里化背后的逻辑就是获取一个函数并派生出一个返回特殊函数的函数**，它实际上是一种思想，或者说是一种程序设计模式。

### 柯里化的应用

#### 1. 编写可以轻松复用和配置的小代码块，就像我们使用 npm 一样：

举个例子，你有一家商店，然后你想给你的优惠顾客 10% 的折扣：

```js
function discount (price, discount) {
  return price * discount
}

const price = discount(500, 0.1) 


const price = discount(1500, 0.1) 
const price = discount(2000, 0.1) 
const price = discount(50, 0.1) 
const price = discount(300, 0.1) 


function discount (discount) {
  return (price) => {
    return price * discount
  }
}
const tenPercentDiscount = discount(0.1)


tenPercentDiscount(500) 


const twentyPercentDiscount = discount(0.2)


twentyPercentDiscount(500) 
twentyPercentDiscount(3000) 
twentyPercentDiscount(80000)
```

这个例子说明，使用柯里化思想能让我们在遇到只能确定一个参数而无法确定另一个参数时，代码设计编的变得更方便与高效，达到提升性能的目的。

#### 2. 避免频繁调用具有相同参数的函数：

比如我们有个用来计算体积的函数:

```js
function volume (l, w, h) {
  return l * w * h
}


volume(200, 30, 100) 
volume(32, 45, 100) 
volume(2322, 232, 100) 


function volume (h) {
  return (w) => {
    return (l) => {
      return l * w * h
    }
  }
}


const hCylinderHeight = volume(100)
hCylinderHeight(200)(30) 
hCylinderHeight(2322)(232)
```

### 通用的柯里函数

让我们建立一个函数来接受任何函数并且返回柯里化版本的函数：

```js
function curry (fn, ...args) {
  return (..._args) => {
    return fn(...args, ..._args)
  }
}
```

我们在这里做了什么？我们的 curry 函数接受一个我们想要柯里化的函数（fn）和一个变量（...args）。这里的 rest 操作符用来将参数聚集成一个...args。接下来我们返回一个函数，该函数将其余参数收集为..._args。此函数通过 spread 运算符将... args 和..._ args 作为参数解构传入来调用原始函数 fn，然后将值返回给用户。

让我们使用我们的 curry 函数用之前的例子来创建一个特殊的函数（一个专门用来计算 100m 长度的物品体积）：

```js
function volume (l, h, w) {
  return l * h * w
}
const hCy = curry(volume, 100)
hCy(200, 900) 
hCy(70, 60)
```

将类似回调函数的参数传入柯里化函数，能使复杂的问题变得简单！

### 使用递归实现 curry 函数

JS 柯里化作为函数式编程的重要一环，频繁在算法题中出现。以上的通用柯里化函数还不够完善，我们希望只给 curry 函数传递一个 fn 就能达到目的，现在我们使用递归来实现：

```js
function curry (fn) {
  const c = (...args) => (args.length === fn.length) ?
          fn(...args) : (..._args) => c(...args, ..._args)
  return c
}
```

该方法几乎为最简洁、代码行数最少的实现方法了。  
首先我们能确定，实现柯里化的核心就是要确定传入参数的个数，并通通取到。  
其次，我们得知道，`fn.length`为 fn 函数接受的参数个数，那么该实现方法就能解读为：  
**不断递归获取传入参数，直到取到的参数个数等于 fn 的参数个数为止，最终将获取到的所有参数传给 fn 并返回执行结果**。

### 结语

柯里化作为一种重要的程序思想，已经广为应用，它使我们应对复杂问题时能提升效率，增强可读性。希望读者都能体会这种思想并运用于实践，相信在提升技术的路上能越走越远，成为一名优秀的工程师！

[原文地址](https://www.jianshu.com/p/7fa99a4bee8b)