---
layout: '[post]'
title: Event事件常见应用
date: 2019-06-25 17:20:41
tags: html
---
## Event 对象
W3C的说法是：

Event 对象代表事件的状态，比如事件在其中发生的元素、键盘按键的状态、鼠标的位置、鼠标按钮的状态。

事件通常与函数结合使用，函数不会在事件发生前被执行！
<!-- more -->
## 几种常见事件
**event.preventDefault()** :阻止默认事件  

**event.stopPropagation()**:阻止冒泡  

**event.stopImmediatePropagation()**:按优先级阻止执行

```html
<!DOCTYPE html>
<html>
    <head>
        <style>
            p { height: 30px; width: 150px; background-color: #ccf; }
            div {height: 30px; width: 150px; background-color: #cfc; }
        </style>
    </head>
    <body>
        <div>
            <p>paragraph</p>
        </div>
        <script>
            const p = document.querySelector('p')
            p.addEventListener("click", (event) => {
              alert("我是p元素上被绑定的第一个监听函数");
            }, false);

            p.addEventListener("click", (event) => {
              alert("我是p元素上被绑定的第二个监听函数");
              event.stopImmediatePropagation();
              // 执行stopImmediatePropagation方法,阻止click事件冒泡,并且阻止p元素上绑定的其他click事件的事件监听函数的执行.
            }, false);

            p.addEventListener("click",(event) => {
              alert("我是p元素上被绑定的第三个监听函数");
              // 该监听函数排在上个函数后面，该函数不会被执行
            }, false);

            document.querySelector("div").addEventListener("click", (event) => {
              alert("我是div元素,我是p元素的上层元素");
              // p元素的click事件没有向上冒泡，该函数不会被执行
            }, false);
        </script>
    </body>
</html>
```

**event.currentTarget**:当前绑定的事件（父级元素）

**event.target**:绑定的事件

以上两者主要用于事件委托中。  
**事件委托就是利用冒泡的原理，将事件加到 父元素 或 祖先元素上，触发执行效果。**

```html
<ul id="myLinks">
  <li id="goSomewhere">Go somewhere</li>
  <li id="doSomething">Do something</li>
  <li id="sayHi">Say hi</li>
</ul>
```
正常情况下添加点击事件

```js
var item1 = document.getElementById("goSomewhere");
    var item2 = document.getElementById("doSomething");
    var item3 = document.getElementById("sayHi");
 
    item1.onclick = function() {
      location.href = "http://www.baidu.com";
    };
    item2.onclick = function() {
      document.title = "事件委托";
    };
    item3.onclick = function() {
      alert("hi");
    };

```
使用事件委托

```js
 document.addEventListener("click", function (event) {
      var target = event.target;
      switch (target.id) {
        case "doSomething":
          document.title = "事件委托";
          break;
        case "goSomewhere":
          location.href = "http://www.baidu.com";
          break;
        case "sayHi": alert("hi");
          break;
      }
    })
```
## 自定义事件

```js
var eventCus = new Event('custome');
ev.addEventListener('custome',function(){
    console.log('自定义事件');
});
ev.dispatchEvent(eve);
```
自定义事件也可以使用```customEvent```

区别在于能够传递数据


```js
function createEvent(params, eventName = 'mock-event') {
    return new CustomEvent(eventName, { detail: params });
}

const event = createEvent({ id: '0010' });
```
这里值得注意，需要把想要传递的参数包裹在一个包含detail属性的对象，否则传递的参数不会被挂载？（这里不太确定，我试过传id和params都不会生效）

```js
 window.addEventListener('mock-event', ({ detail: { id } }) => {
            console.log('id',id) // 会在控制台打印0010
        });
```
## DOM事件流的补充

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title>DOM事件流</title>
	</head>

	<body>
		<div id="ev">
			<style>
				#ev {
					width: 300px;
					height: 100px;
					background-color: red;
					color: #fff;
					text-align: center;
					line-height: 100px;
				}
			</style>
			目标元素
		</div>
		<script type="text/javascript">
			var ev = document.getElementById('ev');
			window.addEventListener(
				'click',
				function() {
					console.log('window捕获阶段');
				},
				true
			);
			document.addEventListener(
				'click',
				function() {
					console.log('doc捕获阶段');
				},
				true
			);
			document.documentElement.addEventListener(
				'click',
				function() {
					console.log('html捕获阶段');
				},
				true
			);
			document.body.addEventListener(
				'click',
				function() {
					console.log('body捕获阶段');
				},
				true
			);
			ev.addEventListener(
				'click',
				function() {
					console.log('div捕获阶段');
				},
				true
            );
            var eve=new Event('test');
            ev.addEventListener('test',function(){
                console.log('自定义事件');
            });
            ev.dispatchEvent(eve);
		</script>
	</body>
</html>

```


