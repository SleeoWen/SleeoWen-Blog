---
layout: '[post]'
title: call、apply、bind
date: 2020-05-20 15:36:53
tags: javascript
---


bind 是返回对应函数，便于稍后调用；apply 、call 则是立即调用 。
 <!-- more -->
apply、call
----------

在 javascript 中，`call` 和 `apply` 都是为了改变某个函数运行时的上下文（context）而存在的，换句话说，就是为了改变函数体内部 `this` 的指向。  
JavaScript 的一大特点是，函数存在「定义时上下文」和「运行时上下文」以及「上下文是可以改变的」这样的概念。

```js
function fruits() {}
 
fruits.prototype = {
    color: "red",
    say: function() {
        console.log("My color is " + this.color);
    }
}
 
var apple = new fruits;
apple.say();
```

但是如果我们有一个对象`banana= {color : "yellow"}` , 我们不想对它重新定义 `say` 方法，那么我们可以通过 `call` 或 `apply` 用 `apple` 的 `say` 方法：

```js
banana = {
    color: "yellow"
}
apple.say.call(banana);     
apple.say.apply(banana);
```

所以，可以看出 `call` 和 `apply` 是为了动态改变 `this` 而出现的，当一个 `object` 没有某个方法（本栗子中`banana`没有`say`方法），但是其他的有（本栗子中`apple`有`say`方法），我们可以借助`call`或`apply`用其它对象的方法来操作。

apply、call 区别
-------------

对于 `apply`、`call` 二者而言，作用完全一样，只是接受参数的方式不太一样。例如，有一个函数定义如下：

```js
var func = function(arg1, arg2) {
     
};
```

就可以通过如下方式来调用：

```js
func.call(this, arg1, arg2);
func.apply(this, [arg1, arg2])
```

其中 `this` 是你想指定的上下文，他可以是任何一个 JavaScript 对象 (JavaScript 中一切皆对象)，`call` 需要把参数按顺序传递进去，而 `apply` 则是把参数放在数组里。　　  
为了巩固加深记忆，下面列举一些常用用法：

apply、call 实例
-------------

**数组之间追加**

```js
var array1 = [12 , "foo" , {name:"Joe"} , -2458]; 
var array2 = ["Doe" , 555 , 100]; 
Array.prototype.push.apply(array1, array2); 
// array1 值为  [12 , "foo" , {name:"Joe"} , -2458 , "Doe" , 555 , 100]
```

**获取数组中的最大值和最小值**

```js
var  numbers = [5, 458 , 120 , -215 ]; 
var maxInNumbers = Math.max.apply(Math, numbers),   
    maxInNumbers = Math.max.call(Math,5, 458 , 120 , -215);
```

number 本身没有 max 方法，但是 Math 有，我们就可以借助 call 或者 apply 使用其方法。

**验证是否是数组（前提是`toString()`方法没有被重写过）**

```js
functionisArray(obj){ 
    return Object.prototype.toString.call(obj) === '[object Array]' ;
}
```

**类（伪）数组使用数组方法**

```js
var domNodes = Array.prototype.slice.call(document.getElementsByTagName("*"));
```

Javascript 中存在一种名为伪数组的对象结构。比较特别的是 `arguments` 对象，还有像调用 `getElementsByTagName` , `document.childNodes` 之类的，它们返回`NodeList`对象都属于伪数组。不能应用 Array 下的 `push` , `pop` 等方法。  
但是我们能通过 `Array.prototype.slice.call` 转换为真正的数组的带有 `length` 属性的对象，这样 `domNodes` 就可以应用 Array 下的所有方法了。

**面试题**  
定义一个 `log` 方法，让它可以代理 `console.log` 方法，常见的解决方法是：

```js
function log(msg)　{
  console.log(msg);
}
log(1);    
log(1,2);
```

上面方法可以解决最基本的需求，但是当传入参数的个数是不确定的时候，上面的方法就失效了，这个时候就可以考虑使用 `apply` 或者 `call`，注意这里传入多少个参数是不确定的，所以使用`apply`是最好的，方法如下：

```js
function log(){
  console.log.apply(console, arguments);
};
log(1);    
log(1,2);
```

接下来的要求是给每一个 `log` 消息添加一个 "(app)" 的前辍，比如：

```js
log("hello world");
```

该怎么做比较优雅呢? 这个时候需要想到`arguments`参数是个伪数组，通过 `Array.prototype.slice.call` 转化为标准数组，再使用数组方法`unshift`，像这样：

```js
function log(){
  var args = Array.prototype.slice.call(arguments);
  args.unshift('(app)');
 
  console.log.apply(console, args);
};
```

bind
----

在讨论`bind()`方法之前我们先来看一道题目：

```js
var altwrite = document.write;
altwrite("hello");
```

结果：`Uncaught TypeError: Illegal invocation`  
`altwrite()`函数改变`this`的指向`global`或`window`对象，导致执行时提示非法调用异常，正确的方案就是使用`bind()`方法：

```js
altwrite.bind(document)("hello")
```

当然也可以使用`call()`方法：

```js
altwrite.call(document, "hello")
```

**绑定函数**

`bind()`最简单的用法是创建一个函数，使这个函数不论怎么调用都有同样的 this 值。常见的错误就像上面的例子一样，将方法从对象中拿出来，然后调用，并且希望`this`指向原来的对象。如果不做特殊处理，一般会丢失原来的对象。使用`bind()`方法能够很漂亮的解决这个问题：

```js
this.num = 9; 
var mymodule = {
  num: 81,
  getNum: function() { 
    console.log(this.num);
  }
};

mymodule.getNum(); 

var getNum = mymodule.getNum;
getNum(); 

var boundGetNum = getNum.bind(mymodule);
boundGetNum();
```

`bind()` 方法与 `apply` 和 `call` 很相似，也是可以改变函数体内 `this` 的指向。

MDN 的解释是：`bind()`方法会创建一个新函数，称为绑定函数，当调用这个绑定函数时，绑定函数会以创建它时传入 `bind()`方法的第一个参数作为 `this`，传入 `bind()` 方法的第二个以及以后的参数加上绑定函数运行时本身的参数按照顺序作为原函数的参数来调用原函数。

直接来看看具体如何使用，在常见的单体模式中，通常我们会使用 `_this` , `that` , `self` 等保存 `this` ，这样我们可以在改变了上下文之后继续引用到它。 像这样：

```js
var foo = {
    bar : 1,
    eventBind: function(){
        var _this = this;
        $('.someClass').on('click',function(event) {
            
            console.log(_this.bar);     
        });
    }
}
```

由于 Javascript 特有的机制，上下文环境在 `eventBind:function(){ }` 过渡到 `$('.someClass').on('click',function(event) { })` 发生了改变，上述使用变量保存 `this` 这些方式都是有用的，也没有什么问题。当然使用 `bind()` 可以更加优雅的解决这个问题：

```js
var foo = {
    bar : 1,
    eventBind: function(){
        $('.someClass').on('click',function(event) {
            
            console.log(this.bar);      
        }.bind(this));
    }
}
```

在上述代码里，`bind()` 创建了一个函数，当这个`click`事件绑定在被调用的时候，它的 `this` 关键词会被设置成被传入的值（这里指调用`bind()`时传入的参数）。因此，这里我们传入想要的上下文 `this`(其实就是 `foo` )，到 `bind()` 函数中。然后，当回调函数被执行的时候， `this` 便指向 `foo` 对象。再来一个简单的栗子：

```js
var bar = function(){
console.log(this.x);
}
var foo = {
x:3
}
bar(); 
var func = bar.bind(foo);
func();
```

这里我们创建了一个新的函数 `func`，当使用 `bind()` 创建一个绑定函数之后，它被执行的时候，它的 `this` 会被设置成 `foo` ， 而不是像我们调用 `bar()` 时的全局作用域。

**偏函数（Partial Functions）**

`Partial Functions`也叫`Partial Applications`，这里截取一段关于偏函数的定义：

```js
Partial application can be described as taking a function that accepts some number of arguments, binding values to one or more of those arguments, and returning a new function that only accepts the remaining, un-bound arguments.
```

这是一个很好的特性，使用`bind()`我们设定函数的预定义参数，然后调用的时候传入其他参数即可：

```js
function list() {
  return Array.prototype.slice.call(arguments);
}

var list1 = list(1, 2, 3); 


var leadingThirtysevenList = list.bind(undefined, 37);

var list2 = leadingThirtysevenList(); 
var list3 = leadingThirtysevenList(1, 2, 3);
```

**和 setTimeout 一起使用**

```js
function Bloomer() {
  this.petalCount = Math.ceil(Math.random() * 12) + 1;
}


Bloomer.prototype.bloom = function() {
  window.setTimeout(this.declare.bind(this), 100);
};

Bloomer.prototype.declare = function() {
  console.log('我有 ' + this.petalCount + ' 朵花瓣!');
};

var bloo = new Bloomer();
bloo.bloom();
```

注意：对于事件处理函数和`setInterval`方法也可以使用上面的方法

**绑定函数作为构造函数**

绑定函数也适用于使用`new`操作符来构造目标函数的实例。当使用绑定函数来构造实例，注意：`this`会被忽略，但是传入的参数仍然可用。

```js
function Point(x, y) {
  this.x = x;
  this.y = y;
}

Point.prototype.toString = function() { 
  console.log(this.x + ',' + this.y);
};

var p = new Point(1, 2);
p.toString(); 


var emptyObj = {};
var YAxisPoint = Point.bind(emptyObj, 0);


var YAxisPoint = Point.bind(null, 0);

var axisPoint = new YAxisPoint(5);
axisPoint.toString(); 

axisPoint instanceof Point; 
axisPoint instanceof YAxisPoint; 
new Point(17, 42) instanceof YAxisPoint;
```

**捷径**

`bind()`也可以为需要特定`this`值的函数创造捷径。

例如要将一个类数组对象转换为真正的数组，可能的例子如下：

```js
var slice = Array.prototype.slice;



slice.call(arguments);
```

如果使用`bind()`的话，情况变得更简单：

```js
var unboundSlice = Array.prototype.slice;
var slice = Function.prototype.call.bind(unboundSlice);



slice(arguments);
```

**实现**

上面的几个小节可以看出`bind()`有很多的使用场景，但是`bind()`函数是在 ECMA-262 第五版才被加入；它可能无法在所有浏览器上运行。这就需要我们自己实现`bind()`函数了。

首先我们可以通过给目标函数指定作用域来简单实现`bind()`方法：

```js
Function.prototype.bind = function(context){
  self = this;  
  return function(){
      return self.apply(context,arguments);
  };
};
```

考虑到函数柯里化的情况，我们可以构建一个更加健壮的`bind()`：

```js
Function.prototype.bind = function(context){
  var args = Array.prototype.slice.call(arguments, 1),
  self = this;
  return function(){
      var innerArgs = Array.prototype.slice.call(arguments);
      var finalArgs = args.concat(innerArgs);
      return self.apply(context,finalArgs);
  };
};
```

这次的`bind()`方法可以绑定对象，也支持在绑定的时候传参。

继续，Javascript 的函数还可以作为构造函数，那么绑定后的函数用这种方式调用时，情况就比较微妙了，需要涉及到原型链的传递：

```js
Function.prototype.bind = function(context){
  var args = Array.prototype.slice(arguments, 1),
  F = function(){},
  self = this,
  bound = function(){
      var innerArgs = Array.prototype.slice.call(arguments);
      var finalArgs = args.concat(innerArgs);
      return self.apply((this instanceof F ? this : context), finalArgs);
  };

  F.prototype = self.prototype;
  bound.prototype = new F();
  return bound;
};
```

这是《JavaScript Web Application》一书中对`bind()`的实现：通过设置一个中转构造函数 F，使绑定后的函数与调用`bind()`的函数处于同一原型链上，用 new 操作符调用绑定后的函数，返回的对象也能正常使用`instanceof`，因此这是最严谨的`bind()`实现。

对于为了在浏览器中能支持`bind()`函数，只需要对上述函数稍微修改即可：

```js
Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var aArgs = Array.prototype.slice.call(arguments, 1), 
        fToBind = this, 
        fNOP = function () {},
        fBound = function () {
          return fToBind.apply(
              this instanceof fNOP && oThis ? this : oThis || window,
              aArgs.concat(Array.prototype.slice.call(arguments))
          );
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
```

有个有趣的问题，如果连续 `bind()` 两次，亦或者是连续 `bind()` 三次那么输出的值是什么呢？像这样：

```js
var bar = function(){
    console.log(this.x);
}
var foo = {
    x:3
}
var sed = {
    x:4
}
var func = bar.bind(foo).bind(sed);
func(); //?
 
var fiv = {
    x:5
}
var func = bar.bind(foo).bind(sed).bind(fiv);
func(); //?
```

答案是，两次都仍将输出 3 ，而非期待中的 4 和 5 。原因是，在 Javascript 中，多次 `bind()` 是无效的。更深层次的原因， `bind()` 的实现，相当于使用函数在内部包了一个 `call / apply` ，第二次 `bind()` 相当于再包住第一次 `bind()` , 故第二次以后的 `bind` 是无法生效的。

apply、call、bind 比较
------------------

那么 `apply、call、bind` 三者相比较，之间又有什么异同呢？何时使用 `apply、call`，何时使用 `bind` 呢。简单的一个栗子：

```js
var obj = {
    x: 81,
};
 
var foo = {
    getX: function() {
        return this.x;
    }
}
 
console.log(foo.getX.bind(obj)());  
console.log(foo.getX.call(obj));    
console.log(foo.getX.apply(obj));
```

三个输出的都是 81，但是注意看使用 `bind()` 方法的，他后面多了对括号。

也就是说，区别是，当你希望改变上下文环境之后并非立即执行，而是回调执行的时候，使用 bind() 方法。而 apply/call 则会立即执行函数。

再总结一下：

`apply` 、 `call` 、`bind` 三者都是用来改变函数的 this 对象的指向的；  
`apply` 、 `call` 、`bind` 三者第一个参数都是 this 要指向的对象，也就是想指定的上下文；  
`apply` 、 `call` 、`bind` 三者都可以利用后续参数传参；  
`bind` 是返回对应函数，便于稍后调用；`apply` 、`call` 则是立即调用 。