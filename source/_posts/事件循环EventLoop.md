---
layout: '[post]'
title: 事件循环EventLoop
date: 2019-10-07 11:27:31
tags: javascript
---
## 什么是Event Loop
**event loop是一个执行模型，在不同的地方有不同的实现。浏览器和NodeJS基于不同的技术实现了各自的Event Loop。**

 - 浏览器的Event Loop是在html5的规范中明确定义。
 - NodeJS的Event Loop是基于libuv实现的。可以参考Node的官方文档以及libuv的官方文档。
 - libuv已经对Event Loop做出了实现，而HTML5规范中只是定义了浏览器中Event Loop的模型，具体的实现留给了浏览器厂商。
 <!-- more -->
##  宏队列和微队列
### 宏队列
**宏队列，macrotask，也叫tasks。**

一些异步任务的回调会依次进入macro task queue，等待后续被调用，这些异步任务包括：
- setTimeout
- setInterval
- setImmediate (Node独有)
- requestAnimationFrame (浏览器独有)
- I/O
- UI rendering (浏览器独有)
### 微队列
**微队列，microtask，也叫jobs。**

另一些异步任务的回调会依次进入micro task queue，等待后续被调用，这些异步任务包括：
- process.nextTick (Node独有)
- Promise
- Object.observe
- MutationObserver

## 浏览器的Event Loop
![image](eventloop1.png)
这张图将浏览器的Event Loop完整的描述了出来，我来讲执行一个JavaScript代码的具体流程：

1. 执行全局Script同步代码，这些同步代码有一些是同步语句，有一些是异步语句（比如setTimeout等）；
2. 全局Script代码执行完毕后，调用栈Stack会清空；
3. 从微队列microtask queue中取出位于队首的回调任务，放入调用栈Stack中执行，执行完后microtask queue长度减1；
4. 继续取出位于队首的任务，放入调用栈Stack中执行，以此类推，直到直到把microtask queue中的所有任务都执行完毕。注意，如果在执行microtask的过程中，又产生了microtask，那么会加入到队列的末尾，也会在这个周期被调用执行；
5. microtask queue中的所有任务都执行完毕，此时microtask queue为空队列，调用栈Stack也为空；
6. 取出宏队列macrotask queue中位于队首的任务，放入Stack中执行；
7. 执行完毕后，调用栈Stack为空；
8. 重复第3-7个步骤；
9. 重复第3-7个步骤；
10. ...

**可以看到，这就是浏览器的事件循环Event Loop**
这里归纳3个重点：

1. 宏队列macrotask一次只从队列中取一个任务执行，执行完后就去执行微任务队列中的任务；
2. 微任务队列中所有的任务都会被依次取出来执行，知道microtask queue为空；
3. 图中没有画UI rendering的节点，因为这个是由浏览器自行判断决定的，但是只要执行UI rendering，它的节点是在执行完所有的microtask之后，下一个macrotask之前，紧跟着执行UI render。

### 例子
#### 例1
```js
console.log(1);

setTimeout(() => {
  console.log(2);
  Promise.resolve().then(() => {
    console.log(3)
  });
});

new Promise((resolve, reject) => {
  console.log(4)
  resolve(5)
}).then((data) => {
  console.log(data);
})

setTimeout(() => {
  console.log(6);
})

console.log(7);
```
#### 结果

```js
// 正确答案
1
4
7
5
2
3
6
```

#### 例2

```js
console.log(1);

setTimeout(() => {
  console.log(2);
  Promise.resolve().then(() => {
    console.log(3)
  });
});

new Promise((resolve, reject) => {
  console.log(4)
  resolve(5)
}).then((data) => {
  console.log(data);
  
  Promise.resolve().then(() => {
    console.log(6)
  }).then(() => {
    console.log(7)
    
    setTimeout(() => {
      console.log(8)
    }, 0);
  });
})

setTimeout(() => {
  console.log(9);
})

console.log(10);
```
#### 结果

```js
// 正确答案
1
4
10
5
6
7
2
3
9
8
```
**在执行微队列microtask queue中任务的时候，如果又产生了microtask，那么会继续添加到队列的末尾，也会在这个周期执行，直到microtask queue为空停止。
**
注：当然如果你在microtask中不断的产生microtask，那么其他宏任务macrotask就无法执行了，但是这个操作也不是无限的，拿NodeJS中的微任务process.nextTick()来说，它的上限是1000个，后面我们会讲到。

浏览器的Event Loop就说到这里，下面我们看一下NodeJS中的Event Loop，它更复杂一些，机制也不太一样。

## NodeJS中的Event Loop
NodeJS的Event Loop中，执行宏队列的回调任务有6个阶段，如下图：

![image](eventloop2.png)

各个阶段执行的任务如下：
 - **timers阶段**：这个阶段执行setTimeout和setInterval预定的callback
 - **I/O callback阶段**：执行除了close事件的callbacks、被timers设定的callbacks、setImmediate()设定的callbacks这些之外的callbacks
 - **idle, prepare阶段**：仅node内部使用
 - **poll阶段**：获取新的I/O事件，适当的条件下node将阻塞在这里
 - **check阶段**：执行setImmediate()设定的callbacks
 - **close callbacks阶段**：执行socket.on('close', ....)这些callbacks

#### NodeJS中宏队列主要有4个
由上面的介绍可以看到，回调事件主要位于4个macrotask queue中：
1. Timers Queue
2. IO Callbacks Queue
3. Check Queue
4. Close Callbacks Queue

这4个都属于宏队列，但是在浏览器中，可以认为只有一个宏队列，所有的macrotask都会被加到这一个宏队列中，但是在NodeJS中，不同的macrotask会被放置在不同的宏队列中。

#### NodeJS中微队列主要有2个：
1. Next Tick Queue：是放置process.nextTick(callback)的回调任务的
2. Other Micro Queue：放置其他microtask，比如Promise等

在浏览器中，也可以认为只有一个微队列，所有的microtask都会被加到这一个微队列中，但是在NodeJS中，不同的microtask会被放置在不同的微队列中。

具体可以通过下图加深一下理解：

![image](eventloop3.png)

大体解释一下NodeJS的Event Loop过程：

1. 执行全局Script的同步代码
2. 执行microtask微任务，先执行所有Next Tick Queue中的所有任务，再执行Other Microtask Queue中的所有任务
3. 开始执行macrotask宏任务，共6个阶段，从第1个阶段开始执行相应每一个阶段macrotask中的所有任务，注意，这里是所有每个阶段宏任务队列的所有任务，在浏览器的Event Loop中是只取宏队列的第一个任务出来执行，每一个阶段的macrotask任务执行完毕后，开始执行微任务，也就是步骤2
4. Timers Queue -> 步骤2 -> I/O Queue -> 步骤2 -> Check Queue -> 步骤2 -> Close Callback Queue -> 步骤2 -> Timers Queue ......
5. 这就是Node的Event Loop

#### 关于NodeJS的macrotask queue和microtask queue
![image](eventloop4.png)

![image](eventloop5.png)
#### 例子

```js
console.log('start');

setTimeout(() => {          // callback1
  console.log(111);
  setTimeout(() => {        // callback2
    console.log(222);
  }, 0);
  setImmediate(() => {      // callback3
    console.log(333);
  })
  process.nextTick(() => {  // callback4
    console.log(444);  
  })
}, 0);

setImmediate(() => {        // callback5
  console.log(555);
  process.nextTick(() => {  // callback6
    console.log(666);  
  })
})

setTimeout(() => {          // callback7              
  console.log(777);
  process.nextTick(() => {  // callback8
    console.log(888);   
  })
}, 0);

process.nextTick(() => {    // callback9
  console.log(999);  
})

console.log('end');

```
#### 结果

```js
// 正确答案
start
end
999
111
777
444
888
555
333
666
222
```
### setTimeout 对比 setImmediate
 - setTimeout(fn, 0)在Timers阶段执行，并且是在poll阶段进行判断是否达到指定的timer时间才会执行
 - setImmediate(fn)在Check阶段执行

两者的执行顺序要根据当前的执行环境才能确定：


 - 如果两者都在主模块(main module)调用，那么执行先后取决于进程性能，顺序随机
 - 如果两者都不在主模块调用，即在一个I/O Circle中调用，那么setImmediate的回调永远先执行，因为会先到Check阶段

### setImmediate 对比 process.nextTick

 - setImmediate(fn)的回调任务会插入到宏队列Check Queue中
 - process.nextTick(fn)的回调任务会插入到微队列Next Tick Queue中
 - process.nextTick(fn)调用深度有限制，上限是1000，而setImmedaite则没有


## 总结
1. 浏览器的Event Loop和NodeJS的Event Loop是不同的，实现机制也不一样，不要混为一谈。
2. 浏览器可以理解成只有1个宏任务队列和1个微任务队列，先执行全局Script代码，执行完同步代码调用栈清空后，从微任务队列中依次取出所有的任务放入调用栈执行，微任务队列清空后，从宏任务队列中只取位于队首的任务放入调用栈执行，注意这里和Node的区别，只取一个，然后继续执行微队列中的所有任务，再去宏队列取一个，以此构成事件循环。
3. NodeJS可以理解成有4个宏任务队列和2个微任务队列，但是执行宏任务时有6个阶段。先执行全局Script代码，执行完同步代码调用栈清空后，先从微任务队列Next Tick Queue中依次取出所有的任务放入调用栈中执行，再从微任务队列Other Microtask Queue中依次取出所有的任务放入调用栈中执行。Node 在新版本中，也是每个 Macrotask 执行完后，就去执行 Microtask 了，和浏览器的模型一致。
4. MacroTask包括： setTimeout、setInterval、 setImmediate(Node)、requestAnimation(浏览器)、IO、UI rendering
5. Microtask包括： process.nextTick(Node)、Promise、Object.observe、MutationObserver
