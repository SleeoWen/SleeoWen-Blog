---
layout: '[post]'
title: DOM级别与DOM事件
date: 2019-06-01 10:58:39
tags: html
---
事件是javascript和HTML交互基础, 任何文档或者浏览器窗口发生的交互, 都要通过绑定事件进行交互;比如鼠标点击事件、敲击键盘事件等。这样的事件行为都是前端DOM事件的组成部分，不同的DOM事件会有不同的触发条件和触发效果。
<!-- more -->
## DOM级别与DOM事件
DOM级别一共可以分为四个级别：DOM0级、DOM1级、DOM2级和DOM3级。而DOM事件分为3个级别：DOM0级事件处理，DOM2级事件处理和DOM3级事件处理。

有人可能会疑惑，为什么没有DOM1级事件处理呢？因为1级DOM标准并没有定义事件相关的内容，所以没有所谓的1级DOM事件模型。

### HTML的事件处理程序
HTML事件处理程序，也是最早的一种事件处理方式。

```js
 <button type="button" onclick="showFn()"></button>
  function showFn() {
      alert('Hello World');
  }
```
以上的代码，我们通过直接在HTML代码里面定义了一个 onclick属性触发showfu这样的事件处理程序最大的缺点就是HTML和JS耦合太强，我们如果需要修改函数名就必须修改两个地方，优点是不需要操作DOM来完成事件的绑定。

### DOM0级事件
DOM0级处理事件就是将一个函数赋值给一个事件处理属性。

```js
 <button id="btn" type="button"></button>
    var btn = document.getElementById('btn');
    btn.onclick = function() {
        console.log('Hello World');
    }
```
以上的代码我们给button定义了一个id 通过js原生的api获取按钮
将一个函数赋值给了一个事件处理属性onclick 这样的方法就是DOM0级
处理事件的体现。我们可以通过给事件处理属性赋值null来解绑事件。

**DOM0级事件处理程序的缺点在于一个处理程序无法同时绑定多个处理函数，比如我还想再点击按钮事件上加上另外一个函数。**

### DOM2级事件
DOM2级事件在DOM0级时间段额基础上弥补了一个处理处理程序
无法同时绑定多个处理函数的缺点。允许给一个程序添加多个处理函数。

```js
 <button id="btn" type="button"></button>
    var btn = document.getElementById('btn');    
    function showFn() {
        alert('Hello World');
    }    
    btn.addEventListener('click', showFn, false);
    // btn.removeEventListener('click', showFn, false); 解绑事件 
```
DOM2级事件定义了addEventListener 和 removeEventListener两个方法，分别用来绑定和解绑事件，方法中包含三个参数，分别是绑定的事件处理的属性名称（没有on）处理函数和是否在捕获时候执行事件处理函数如果我们还需要添加一个鼠标的移入的方法，只需要：


```js
 btn.addEventlistener('mouseover',showfn,false)
```
这样，点击按钮和鼠标移入时候都将触发showfn的方法。

需要注意的是IE8以下版本不支持 addEventlistener 和 removeEventListerner
需要使用attachEvent和detachEvent实现：

```js
    btn.attachEvent('onclick', showFn); // 绑定事件 
    btn.detachEvent('onclick', showFn); // 解绑事件
```
这里我们不需要传入第三个参数，因为IE8以下版本只支持冒泡型事件。
### DOM3级事件

```
DOM3级事件是在DOM2级事件的基础上添加很多事件类型。
UI事件，当用户与页面上的元素交互时触发，如：load、scroll
焦点事件，当元素获得或失去焦点时触发，如：blur、focus
鼠标事件，当用户通过鼠标在页面执行操作时触发如：dbclick、mouseup
滚轮事件，当使用鼠标滚轮或类似设备时触发，如：mousewheel
文本事件，当在文档中输入文本时触发，如：textInput
键盘事件，当用户通过键盘在页面上执行操作时触发，如：keydown、keypress
合成事件，当为IME（输入法编辑器）输入字符时触发，如：compositionstart
变动事件，当底层DOM结构发生变化时触发，如：DOMsubtreeModified
同时DOM3级事件也允许使用者自定义一些事件。
```
转载链接:[DOM级别与DOM事件](https://www.jianshu.com/p/622d994906f7)