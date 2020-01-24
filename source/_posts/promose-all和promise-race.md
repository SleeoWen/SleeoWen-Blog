---
layout: '[post]'
title: promise.all和promise.race
date: 2019-02-17 09:57:01
tags: Promise
---
## Promise.all和Promise.race的功能
### Promise.all
**Promise.all可以将多个Promise实例包装成一个新的Promise实例。同时，成功和失败的返回值是不同的，成功的时候返回的是一个结果数组，而失败的时候则返回最先被reject失败状态的值。**
<!-- more -->
```js
let p1 = new Promise((resolve, reject) => {
  resolve('p1完成')
})

let p2 = new Promise((resolve, reject) => {
  resolve('p2完成')
})

let p3 = Promse.reject('p3失败')

Promise.all([p1, p2]).then((result) => {
  console.log(result)               //['p1完成', 'p2完成']
}).catch((error) => {
  console.log(error)
})

Promise.all([p1,p3,p2]).then((result) => {
  console.log(result)
}).catch((error) => {
  console.log(error)      // 失败了，打出 ''p3失败'
})
```
### Promise.race
**Promise.race可以将多个Promise实例包装成一个新的Promise实例。同时，成功和失败的返回值是不同的，成功的时候返回的是第一个返回的resolve，而失败的时候则返回最先被reject失败状态的值。（换句话说就是返回最快的那个）**

```js
let p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('success')
  },1000)
})

let p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject('failed')
  }, 500)
})

Promise.race([p1, p2]).then((result) => {
  console.log(result)
}).catch((error) => {
  console.log(error)  // 打开的是 'failed'
})
```
## 简易实现
### Promise.all
```js
Promise.all = (arr) => {
    let resultList = [];
    return new Promise((resolve, reject) => {
        let i = 0;
        next();
        next = () => {
            arr[i].then((res, rej) => {
                if (!rej) {
                    resultList.push(res);
                    i++;
                } else {
                    reject(rej);
                }
                if (i == arr.length) {
                    resolve(resultList);
                } else {
                    next();
                }
            })
        }
    })
};
```
### Promise.race
```js
Promise.race = (arr) => {
    let resultList = [];
    return new Promise((resolve, reject) => {
        let i = 0;
        next();
        next = () => {
            arr[i].then((res, rej) => {
                if (!rej) {
                    resultList.push(res);
                    i++;
                } else {
                    reject(rej);
                }
                if (i == arr.length) {
                    resolve(resultList);
                } else {
                    next();
                }
            })
        }
    })
};
```
## Promise.all的问题
**在上面的代码中，Promise.all使用的是循环调用的方式，也就算是链式调用（Promise链），事实上Promise.all是并发，同时进行所有的promise方法。**

```js
Promise.all = (arr) => {
    let resultList = new Array(arr.length);
    return new Promise((resolve, reject) => {
        let temp = 0;
        for (let i = 0, len = arr.length; i < len; i++) {
            arr[i].then((res, rej) => {
                if (!rej) {
                    resultList[i] = (res);
                    if (temp == arr.length) {
                        resolve(resultList);
                    }
                    temp++;
                } else {
                    reject(rej);
                }
            })
        }
    })
};
```

