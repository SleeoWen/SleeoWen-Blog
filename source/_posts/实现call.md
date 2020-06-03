---
layout: '[post]'
title: 实现call
date: 2020-05-21 13:23:36
tags: javascript
---


### call

> call() 方法在使用一个指定的 this 值和若干个指定的参数值的前提下调用某个函数或方法。  
> 举个栗子：
 <!-- more -->
```js
var foo ={
  value:1
}
function bar(){
  console.log(this.value)
}
bar.call(foo);
```

**需要注意两点：**

*   call 改变了 this 的指向，指向到 foo；
*   调用了 bar 函数

### 模拟实现第一步

试想当调用 call 的时候，把 foo 对象改造成如下：

```js
var foo = {
    value: 1,
    bar: function() {
        console.log(this.value)
    }
};
foo.bar();
```

这样我们就实现了 this 指向 foo；  
但是我们给 foo 添加了一个属性才实现了这个效果，那我们用完可以删除掉这个属性。  
模拟步骤可分为：

```js
foo.fn = bar

foo.fn()

delete foo.fn
```

根据这个思路，我们可以尝试着去写第一版的 call2 函数：

```js
Function.Prototype.call2 = function(context){
  
  context.fn = this;
  context.fn();
  delete context.fn;

}

var foo = {
    value: 1
};

function bar() {
    console.log(this.value);
}

bar.call2(foo);
```

这样我们就轻松模拟了 call 指定 this 指向的功能；

### 模拟实现第二步

call 函数还能给定参数执行函数。  
举个例子：

```js
var foo = {
    value: 1
};

function bar(name, age) {
    console.log(name)
    console.log(age)
    console.log(this.value);
}

bar.call(foo, 'Cherry', 18);
```

注意：传入的参数并不确定，这可咋办？

不急，我们可以从 Arguments 对象中取值，取出第二个到最后一个参数，然后放到一个数组里。

比如这样：

```js
var args = [];
for(var i = 1, len = arguments.length; i < len; i++) {
    args.push('arguments[' + i + ']');
}
```

不定长的参数问题解决了，我们接着要把这个参数数组放到要执行的函数的参数里面去。

```js
eval('context.fn(' + args +')')
```

所以我们的第二版克服了两个大问题，代码如下：

```js
Function.prototype.call2 = function(context) {
    context.fn = this;
    var args = [];
    for(var i = 1, len = arguments.length; i < len; i++) {
        args.push('arguments[' + i + ']');
    }
    eval('context.fn(' + args +')');
    delete context.fn;
}


var foo = {
    value: 1
};

function bar(name, age) {
    console.log(name)
    console.log(age)
    console.log(this.value);
}

bar.call2(foo, 'Cherry', 18);
```

### 模拟实现第三步

模拟代码已经完成 80%，还有两个小点要注意：

**1.this 参数可以传 null，当为 null 的时候，视为指向 window**  
**2. 函数是可以有返回值的！**  
解决方法：

```js
Function.prototype.call2 = function (context) {
    var context = context || window;
    context.fn = this;

    var args = [];
    for(var i = 1, len = arguments.length; i < len; i++) {
        args.push('arguments[' + i + ']');
    }

    var result = eval('context.fn(' + args +')');

    delete context.fn
    return result;
}


var value = 2;

var obj = {
    value: 1
}

function bar(name, age) {
    console.log(this.value);
    return {
        value: this.value,
        name: name,
        age: age
    }
}

bar.call(null); 

console.log(bar.call2(obj, 'Cherry', 18));
```

到此，我们完成了 call 的模拟实现。

文章非原创，有侵权请告知，文章出处：  
[https://github.com/mqyqingfeng/Blog/issues/11](https://link.jianshu.com/?t=https://github.com/mqyqingfeng/Blog/issues/11)

