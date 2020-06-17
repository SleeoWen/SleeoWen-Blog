---
layout: '[post]'
title: for循环全家桶
date: 2020-06-15 17:07:58
tags: javascript
---
抵达战场的 5 方势力分别是`for` , `foreach` , `map` , `for...in` , `for...of`

自我介绍环节
------
<!-- more -->
### for

我是遍历界最早出现的一方诸侯，在座的各位需称我一声爷爷。我能满足开发人员的绝大多数的需求。

```js
// 遍历数组
let arr = [1,2,3];
for(let i = 0;i < arr.length;i++){
    console.log(i)          // 索引，数组下标
    console.log(arr[i])     // 数组下标所对应的元素
}

// 遍历对象
let profile = {name:"April",nickname:"二十七刻",country:"China"};
for(let i = 0, keys=Object.keys(profile); i < keys.length;i++){
    console.log(keys[i])            // 对象的键值
    console.log(profile[keys[i]])   // 对象的键对应的值
}

// 遍历字符串
let str = "abcdef";
for(let i = 0;i < str.length ;i++){
    console.log(i)          // 索引 字符串的下标
    console.log(str[i])     // 字符串下标所对应的元素
}

// 遍历DOM 节点
let articleParagraphs = document.querySelectorAll('.article > p');
for(let i = 0;i<articleParagraphs.length;i++){
    articleParagraphs[i].classList.add("paragraph");
    // 给class名为“article”节点下的 p 标签添加一个名为“paragraph” class属性。
}
```

### forEach

我是 ES5 版本发布的。按升序为数组中含有效值的每一项执行一次 callback 函数，那些已删除或者未初始化的项将被跳过（例如在稀疏数组上）。我是 for 循环的加强版。

```js
// 遍历数组
let arr = [1,2,3];
arr.forEach(i => console.log(i))

// logs 1
// logs 2
// logs 3
// 直接输出了数组的元素

//遍历对象
let profile = {name:"April",nickname:"二十七刻",country:"China"};
let keys = Object.keys(profile);
keys.forEach(i => {
    console.log(i)              // 对象的键值
    console.log(profile[i])     // 对象的键对应的值
})
```

### map

我也是 ES5 版本发布的，我可以创建一个新数组，新数组的结果是原数组中的每个元素都调用一次提供的函数后的返回值。

```js
let arr = [1,2,3,4,5];
let res = arr.map(i => i * i);

console.log(res) // logs [1, 4, 9, 16, 25]
```

### for...in 枚举

我是 ES5 版本发布的。以任意顺序遍历一个对象的除 Symbol 以外的可枚举属性。

```js
// 遍历对象
let profile = {name:"April",nickname:"二十七刻",country:"China"};
for(let i in profile){
    let item = profile[i];
    console.log(item)   // 对象的键值
    console.log(i)      // 对象的键对应的值

// 遍历数组
let arr = ['a','b','c'];
for(let i in arr){
    let item = arr[i];
    console.log(item)   // 数组下标所对应的元素
    console.log(i)      // 索引，数组下标

// 遍历字符串
let str = "abcd"
for(let i in str){
    let item = str[i];
    console.log(item)   // 字符串下标所对应的元素
    console.log(i)      // 索引 字符串的下标
}
复制代码
```

### for...of 迭代

我是 ES6 版本发布的。在可迭代对象（包括 Array，Map，Set，String，TypedArray，arguments 对象等等）上创建一个迭代循环，调用自定义迭代钩子，并为每个不同属性的值执行语句。

```js
// 迭代数组数组
let arr = ['a','b','c'];
for(let item of arr){
    console.log(item)     
}
// logs 'a'
// logs 'b'
// logs 'c'

// 迭代字符串
let str = "abc";
for (let value of str) {
    console.log(value);
}
// logs 'a'
// logs 'b'
// logs 'c'

// 迭代map
let iterable = new Map([["a", 1], ["b", 2], ["c", 3]]
for (let entry of iterable) {
    console.log(entry);
}
// logs ["a", 1]
// logs ["b", 2]
// logs ["c", 3]

//  迭代map获取键值
for (let [key, value] of iterable) {
    console.log(key)
    console.log(value);
}


// 迭代set
let iterable = new Set([1, 1, 2, 2, 3, 3,4]);
for (let value of iterable) {
    console.log(value);
}
// logs 1
// logs 2
// logs 3
// logs 4

// 迭代 DOM 节点
let articleParagraphs = document.querySelectorAll('.article > p');
for (let paragraph of articleParagraphs) {
    paragraph.classList.add("paragraph");
    // 给class名为“article”节点下的 p 标签添加一个名为“paragraph” class属性。
}

// 迭代arguments类数组对象
(function() {
  for (let argument of arguments) {
    console.log(argument);
  }
})(1, 2, 3);
// logs：
// 1
// 2
// 3


// 迭代类型数组
let typeArr = new Uint8Array([0x00, 0xff]);
for (let value of typeArr) {
  console.log(value);
}
// logs：
// 0
// 255
```

经过第一轮的自我介绍和技能展示后，我们了解到:

*   `for语句`是最原始的循环语句。定义一个变量`i`(数字类型，表示数组的下标), 按照一定的条件，对`i`进行循环累加。条件通常为循环对象的长度，当超过长度就停止循环。因为对象无法判断长度，所以搭配`Object.keys()`使用。
*   `forEach` ES5 提出。自称是`for语句`的加强版，可以发现它比`for语句`在写法上简单了很多。但是本质上也是数组的循环。`forEach`每个数组元素执行一次 callback 函数。也就是调用它的数组，因此，不会改变原数组。返回值是`undefine`。
*   `map` ES5 提出。给原数组中的每个元素都按顺序调用一次 callback 函数。生成一个新数组，不修改调用它的原数组本身。返回值是新的数组。
*   `for...in` ES5 提出。遍历对象上的可枚举属性，包括原型对象上的属性，且按任意顺序进行遍历，也就是顺序不固定。遍历数组时把数组的下标当作键值，此时的 i 是个字符串型的。它是为遍历对象属性而构建的，不建议与数组一起使用。
*   `for...of` ES6 提出。只遍历可迭代对象的数据。

能力甄别
----

作为一个程序员，仅仅认识他们是远远不够的，在实际开发中鉴别他们各自的优缺点。因地制宜的使用他们，扬长避短。从而提高程序的整体性能才是能力之所在。

### 关于跳出循环体

在循环中满足一定条件就跳出循环体，或者跳过不符合条件的数据继续循环其它数据。是经常会遇到的需求。常用的语句是`break` 与 `continue`。

简单的说一下二者的区别，就当复习好了。

*   `break`语句是跳出当前循环，并执行当前循环之后的语句；
*   `continue`语句是终止当前循环，并继续执行下一次循环;

**注意**：`forEach` 与`map` 是不支持跳出循环体的，其它三种方法均支持。

**原理** ：查看`forEach`实现原理，就会理解这个问题。

```js
Array.prototype.forEach（callbackfn [，thisArg]{
    
}
```

传入的 function 是这里的回调函数。在回调函数里面使用 break 肯定是非法的，因为 break 只能用于跳出循环，回调函数不是循环体。

在回调函数中使用 return，只是将结果返回到上级函数，也就是这个 for 循环中，并没有结束 for 循环，所以 return 也是无效的。

`map()` 同理。

### `map()`链式调用

`map()` 方法是可以链式调用的，这意味着它可以方便的结合其它方法一起使用。例如：`reduce()`, `sort()`, `filter()` 等。但是其它方法并不能做到这一点。`forEach()`的返回值是`undefined`，所以无法链式调用。

```js
// 将元素乘以本身，再进行求和。
let arr = [1, 2, 3, 4, 5];
let res1 = arr.map(item => item * item).reduce((total, value) => total + value);

console.log(res1) // logs 55 undefined"
```

### `for...in`会遍历出原型对象上的属性

```js
Object.prototype.objCustom = function() {};
Array.prototype.arrCustom = function() {};
var arr = ['a', 'b', 'c'];
arr.foo = 'hello
for (var i in arr) {
    console.log(i);
}
// logs
// 0
// 1
// 2
// foo
// arrCustom
// objCustom
```

然而在实际的开发中，我们并不需要原型对象上的属性。这种情况下我们可以使用`hasOwnProperty()` 方法，它会返回一个布尔值，指示对象自身属性中是否具有指定的属性（也就是，是否有指定的键）。如下：

```js
Object.prototype.objCustom = function() {};
Array.prototype.arrCustom = function() {};
var arr = ['a', 'b', 'c'];
arr.foo = 'hello
for (var i in arr) {
    if (arr.hasOwnProperty(i)) {
        console.log(i);
    }
}
// logs
// 0
// 1
// 2
// foo

// 可见数组本身的属性还是无法摆脱。此时建议使用 forEach
```

对于纯对象的遍历，选择`for..in`枚举更方便；对于数组遍历，如果不需要知道索引`for..of`迭代更合适，因为还可以中断；如果需要知道索引，则`forEach()`更合适；对于其他字符串，类数组，类型数组的迭代，`for..of`更占上风更胜一筹。但是注意低版本浏览器的是配性。

### 性能

有兴趣的读者可以找一组数据自行测试，文章就直接给出结果了，并做相应的解释。

```js
for > for-of > forEach  > map > for-in
```

*   `for` 循环当然是最简单的，因为它没有任何额外的函数调用栈和上下文；
*   `for...of`只要具有 Iterator 接口的数据结构，都可以使用它迭代成员。它直接读取的是键值。
*   `forEach`，因为它其实比我们想象得要复杂一些，它实际上是`array.forEach(function(currentValue, index, arr), thisValue)`它不是普通的 for 循环的语法糖，还有诸多参数和上下文需要在执行的时候考虑进来，这里可能拖慢性能；
*   `map()` 最慢，因为它的返回值是一个等长的全新的数组，数组创建和赋值产生的性能开销很大。
*   `for...in`需要穷举对象的所有属性，包括自定义的添加的属性也能遍历到。且`for...in`的 key 是`String`类型，有转换过程，开销比较大。

总结
--

在实际开发中我们要结合语义话、可读性和程序性能，去选择究竟使用哪种方案。

如果你需要将数组按照某种规则映射为另一个数组，就应该用 map。

如果你需要进行简单的遍历，用 forEach 或者 for of。

如果你需要对迭代器进行遍历，用 for of。

如果你需要过滤出符合条件的项，用 filterr。

如果你需要先按照规则映射为新数组，再根据条件过滤，那就用一个 map 加一个 filter。

总之，因地制宜，因时而变。千万不要因为过分追求性能，而忽略了语义和可读性。在实际开发中，让他们扬长避短，优势互补，让程序趋近最优才是我们要做的。

原文地址 https://juejin.im/post/5ee6e7c4f265da76e46e6bb7