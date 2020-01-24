---
layout: '[post]'
title: Promise原理和实现
date: 2019-02-05 09:57:01
tags: Promise
---
### 什么是Promise
Promise 对象用于表示一个异步操作的最终完成 (或失败), 及其结果值.
<!-- more -->
### Promise规范
- ES6中使用[Promise/A+](https://juejin.im/post/5c4b0423e51d4525211c0fbc)规范。
- Promise的标准理解
  - promise对象有三种状态**pending**、**fulfilled**和**rejected**。
  - promise对象的状态必须有并且只有上述三种当中的一种。
  - 状态的改变只能是从pending到fulfilled或者pending到rejected。
  - then方法返回一个promise。then 方法可以被同一个 promise 调用多次。
```
promise.then(onFulfilled, onRejected)
```
### Promise实现
1. 构造函数
```js
function Promise(resolver) {}
```
2. 原型链
```js
Promise.prototype.then = function() {}
Promise.prototype.catch = function() {}
```
3. 静态方法
```js
Promise.resolve = function() {}
Promise.reject = function() {}
Promise.all = function() {}
Promise.race = function() {}
```
### Promise基本结构

```js
let promise=new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('FULFILLED')
  }, 1000)
})
promise.then(a=> alert(a));
promise.then(a => alert(a+1));
```
### Promise构造函数
构造函数用法总结：
1. 构造函数接收一个**executor**立即执行函数
2. **executor**立即执行函数接收一个**resolve**函数
3. **promise**对象的**then**方法绑定状态变为**fulfilled**时的回调
4. **resolve**函数被调用时会触发**then**方法中的回调
#### 构造函数的初步实现

```js
function Promise(executor) {
    var self = this;
    self.status = 'pending'; //promise当前的状态
    self.data = undefined; //promise的值
    self.onResolvedCallback = [];
    //promise状态变为resolve时的回调函数集，可能有多个
   function resolve(value) {
       if(self.status === 'pending') {
           self.status = 'resolved';
           self.data = value;
           for(var i = 0; i < self.onResolvedCallback.length; i++) {
               self.onResolvedCallback[i](value);
           }
       }
   }
   executor(resolve);
};
Promise.prototype.then = function (resolve) {
    this.onResolvedCallback.push(resolve);
};
```
#### 添加reject结果

```js
function Promise(executor) {
    var self = this;
    self.status = 'pending'; //promise当前的状态
    self.data = undefined; //promise的值
    self.onResolvedCallback = [];
    //promise状态变为resolve时的回调函数集，可能有多个
    self.onRejectedCallback = [];
    //promise状态变为reject时的回调函数集，可能有多个
   function resolve(value) {
       if(self.status === 'pending') {
           self.status = 'resolved';
           self.data = value;
           for(var i = 0; i < self.onResolvedCallback.length; i++) {
               self.onResolvedCallback[i](value);
           }
       }
   }

   function reject(reason) {
        if(self.status === 'pending') {
            self.status = 'rejected';
            self.data = reason;
            for(var i = 0; i < self.onRejectedCallback.length; i++) {
                self.onRejectedCallback[i](reason);
            }
        }
   }

   try {
       executor(resolve, reject);
   } catch (e){
       reject(e);
   }
};
Promise.prototype.then = function (onResolve, onReject) {
    this.onResolvedCallback.push(onResolve);
    this.onRejectedCallback.push(onReject);
};
```
小结：
1. **executor**函数作为实参在创建**Promise**对象时传入**Promise**构造函数。
2. **resolve**和**reject**函数作为实参传入**executor**函数。
3. **value**作为实参传入**resolve**和**reject**函数。
#### 如果executor自执行函数中的resolve函数立即触发时，发现Promise失效

```js
const promise = new Promise((resolve) => {
    resolve(1);
});
promise.then((a) => alert(a));

```
将promise的resolve和reject异步执行

```js
function resolve(value) {
    setTimeout(function () {
        if(self.status === 'pending') {
            self.status = 'resolved';
            self.data = value;
            for(var i = 0; i < self.onResolvedCallback.length; i++) {
                self.onResolvedCallback[i](value);
            }
        }
    })
}

function reject(reason) {
    setTimeout(function () {
        if(self.status === 'pending') {
            self.status = 'rejected';
            self.data = reason;
            for(var i = 0; i < self.onRejectedCallback.length; i++) {
                self.onRejectedCallback[i](reason);
            }
        }
    })
}
```
### then方法

```js
promise.then(onFulfilled, onRejected)
```
1.  **then**方法返回一个新的**promise**对象。
1.  **executor**自执行函数中的**resolve**参数调用时执行**then**方法的第一个回调函数**onResolved**。
1.  **executor**自执行函数中的**reject**参数调用时执行**then**方法的第二个回调函数**onRejected**。

```js
Promise.prototype.then = function (onResolved, onRejected) {
    var self = this;
    var promise2;
    onResolved = typeof onResolved === 'function' 
                ? onResolved 
                : function (value) {return value};
    onRejected = typeof onRejected === 'function' 
                ? onRejected 
                : function (reason) {throw reason};
    //promise对象当前状态为resolved
    if(self.status === 'resolved') {
        return promise2 = new Promise(function (resolve, reject) {
            try {
                //调用onResolve回调函数
                var x = onResolved(self.data);
                //如果onResolve回调函数返回值为一个promise对象
                if(x instanceof  Promise) {
                    //将它的结果作为promise2的结果
                    x.then(resolve, reject);
                } else {
                    resolve(x);//执行promise2的onResolve回调
           }        
            } catch (e) {
                reject(e); //执行promise2的onReject回调
            }
        })
    }
    //promise对象当前状态为rejected
    if(self.status === 'rejected') {
        return promise2 = new Promise(function (resolve, reject) {
            try {
                var x = onRejected(self.data);
                if (x instanceof Promise) {
                    x.then(resolve, reject)
                } else {
                    resolve(x)
                }
            } catch (e) {
                reject(e)
            }
        })
    }
    //promise对象当前状态为pending
    //此时并不能确定调用onResolved还是onRejected，需要等当前Promise状态确定。
    //所以需要将callBack放入promise1的回调数组中
    if(self.status === 'pending') {
        return promise2 = new Promise(function (resolve, reject) {
            self.onResolvedCallback.push(function (value) {
                try {
                    var x = onResolved(self.data);
                    if (x instanceof Promise) {
                        x.then(resolve, reject);
                    } else {
                        resolve(x);
          }
                } catch (e) {
                    reject(e);
                }
            })
            self.onRejectedCallback.push(function(reason) {
                try {
                    var x = onRejected(self.data);
                    if (x instanceof Promise) {
                        x.then(resolve, reject)
                    } else {
                        resolve(x);
                    }
                } catch (e) {
                    reject(e)
                }
            })
        })
    }
};
```
### 完整代码

```js
var Promise = (function() {
    function Promise(resolver) {
        if (typeof resolver !== 'function') { //resolver必须是函数
            throw new TypeError('Promise resolver ' + resolver + ' is not a function')
        }
        if (!(this instanceof Promise)) return new Promise(resolver)

        var self = this //保存this
        self.callbacks = [] //保存onResolve和onReject函数集合
        self.status = 'pending' //当前状态

        function resolve(value) {
            setTimeout(function() { //异步调用
                if (self.status !== 'pending') {
                    return
                }
                self.status = 'resolved' //修改状态
                self.data = value

                for (var i = 0; i < self.callbacks.length; i++) {
                    self.callbacks[i].onResolved(value)
                }
            })
        }

        function reject(reason) {
            setTimeout(function(){ //异步调用
                if (self.status !== 'pending') {
                    return
                }
                self.status = 'rejected' //修改状态
                self.data = reason

                for (var i = 0; i < self.callbacks.length; i++) {
                    self.callbacks[i].onRejected(reason)
                }
            })
        }

        try{
            resolver(resolve, reject) //执行resolver函数
        } catch(e) {
            reject(e)
        }
    }

    function resolvePromise(promise, x, resolve, reject) {
        var then
        var thenCalledOrThrow = false

        if (promise === x) {
            return reject(new TypeError('Chaining cycle detected for promise!'))
        }

        if ((x !== null) && ((typeof x === 'object') || (typeof x === 'function'))) {
            try {
                then = x.then
                if (typeof then === 'function') {
                    then.call(x, function rs(y) {
                        if (thenCalledOrThrow) return
                        thenCalledOrThrow = true
                        return resolvePromise(promise, y, resolve, reject)
                    }, function rj(r) {
                        if (thenCalledOrThrow) return
                        thenCalledOrThrow = true
                        return reject(r)
                    })
                } else {
                    return resolve(x)
                }
            } catch(e) {
                if (thenCalledOrThrow) return
                thenCalledOrThrow = true
                return reject(e)
            }
        } else {
            return resolve(x)
        }
    }

    Promise.prototype.then = function(onResolved, onRejected) {
        //健壮性处理，处理点击穿透
        onResolved = typeof onResolved === 'function' ? onResolved : function(v){return v}
        onRejected = typeof onRejected === 'function' ? onRejected : function(r){throw r}
        var self = this
        var promise2

        //promise状态为resolved
        if (self.status === 'resolved') {
            return promise2 = new Promise(function(resolve, reject) {
                setTimeout(function() {
                    try {
                        //调用then方法的onResolved回调
                        var x = onResolved(self.data)
                        //根据x的值修改promise2的状态
                        resolvePromise(promise2, x, resolve, reject)
                    } catch(e) {
                        //promise2状态变为rejected
                        return reject(e)
                    }
                })
            })
        }

        //promise状态为rejected
        if (self.status === 'rejected') {
            return promise2 = new Promise(function(resolve, reject) {
                setTimeout(function() {
                    try {
                        //调用then方法的onReject回调
                        var x = onRejected(self.data)
                        //根据x的值修改promise2的状态
                        resolvePromise(promise2, x, resolve, reject)
                    } catch(e) {
                        //promise2状态变为rejected
                        return reject(e)
                    }
                })
            })
        }

        //promise状态为pending
        //需要等待promise的状态改变
        if (self.status === 'pending') {
            return promise2 = new Promise(function(resolve, reject) {
                self.callbacks.push({
                    onResolved: function(value) {
                        try {
                            //调用then方法的onResolved回调
                            var x = onResolved(value)
                            //根据x的值修改promise2的状态
                            resolvePromise(promise2, x, resolve, reject)
                        } catch(e) {
                            //promise2状态变为rejected
                            return reject(e)
                        }
                    },
                    onRejected: function(reason) {
                        try {
                            //调用then方法的onResolved回调
                            var x = onRejected(reason)
                            //根据x的值修改promise2的状态
                            resolvePromise(promise2, x, resolve, reject)
                        } catch(e) {
                            //promise2状态变为rejected
                            return reject(e)
                        }
                    }
                })
            })
        }
    }

    //获取当前Promise传递的值
    Promise.prototype.valueOf = function() {
        return this.data
    }

    //由then方法实现catch方法
    Promise.prototype.catch = function(onRejected) {
        return this.then(null, onRejected)
    }

    //finally方法
    Promise.prototype.finally = function(fn) {
        return this.then(function(v){
            setTimeout(fn)
            return v
        }, function(r){
            setTimeout(fn)
            throw r
        })
    }

    Promise.prototype.spread = function(fn, onRejected) {
        return this.then(function(values) {
            return fn.apply(null, values)
        }, onRejected)
    }

    Promise.prototype.inject = function(fn, onRejected) {
        return this.then(function(v) {
            return fn.apply(null, fn.toString().match(/\((.*?)\)/)[1].split(',').map(function(key){
                return v[key];
            }))
        }, onRejected)
    }

    Promise.prototype.delay = function(duration) {
        return this.then(function(value) {
            return new Promise(function(resolve, reject) {
                setTimeout(function() {
                    resolve(value)
                }, duration)
            })
        }, function(reason) {
            return new Promise(function(resolve, reject) {
                setTimeout(function() {
                    reject(reason)
                }, duration)
            })
        })
    }

    Promise.all = function(promises) {
        return new Promise(function(resolve, reject) {
            var resolvedCounter = 0
            var promiseNum = promises.length
            var resolvedValues = new Array(promiseNum)
            for (var i = 0; i < promiseNum; i++) {
                (function(i) {
                    Promise.resolve(promises[i]).then(function(value) {
                        resolvedCounter++
                        resolvedValues[i] = value
                        if (resolvedCounter == promiseNum) {
                            return resolve(resolvedValues)
                        }
                    }, function(reason) {
                        return reject(reason)
                    })
                })(i)
            }
        })
    }

    Promise.race = function(promises) {
        return new Promise(function(resolve, reject) {
            for (var i = 0; i < promises.length; i++) {
                Promise.resolve(promises[i]).then(function(value) {
                    return resolve(value)
                }, function(reason) {
                    return reject(reason)
                })
            }
        })
    }

    Promise.resolve = function(value) {
        var promise = new Promise(function(resolve, reject) {
            resolvePromise(promise, value, resolve, reject)
        })
        return promise
    }

    Promise.reject = function(reason) {
        return new Promise(function(resolve, reject) {
            reject(reason)
        })
    }

    Promise.fcall = function(fn){
        // 虽然fn可以接收到上一层then里传来的参数，但是其实是undefined，所以跟没有是一样的，因为resolve没参数啊
        return Promise.resolve().then(fn)
    }

    Promise.done = Promise.stop = function(){
        return new Promise(function(){})
    }

    Promise.deferred = Promise.defer = function() {
        var dfd = {}
        dfd.promise = new Promise(function(resolve, reject) {
            dfd.resolve = resolve
            dfd.reject = reject
        })
        return dfd
    }

    try { // CommonJS compliance
        module.exports = Promise
    } catch(e) {}

    return Promise
})()
```
### 参考
[Promise实现原理](https://www.jianshu.com/p/43de678e918a)  
[Promise原理与实现](https://www.jianshu.com/p/b4f0425b22a1)







