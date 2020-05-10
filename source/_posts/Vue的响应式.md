---
layout: '[post]'
title: Vue的响应式
date: 2020-01-23 23:50:02
tags: Vue
---
## Object.defineProperty(obj, prop, desc)
**核心的API**
<!-- more -->
### 监听对象（简单）
```js
const data = {}
const name = 'zhangsan'
Object.defineProperty(data, 'name' ,{
    get: function(){
        console.log('get '+name)
        return name
    },
    set: function (value){
        console.log('set '+value)
        name = value 
    }
})
```
### 复杂对象监听
#### 线程上的代码
```js
// 准备数据
const data = {
    name: 'zhangsan',
    age: 20,
    info: {
        address: '北京' // 需要深度监听
    },
    nums: [10, 20, 30]
}

// 监听数据
observer(data)

// 测试
data.name = 'lisi'
data.age = 21
```
#### observer方法
```js
// 监听对象属性
function observer(target) {
    if (typeof target !== 'object' || target === null) {
        // 不是对象或数组
        return target
    }

    // 重新定义各个属性（for in 也可以遍历数组）
    for (let key in target) {
        defineReactive(target, key, target[key])
    }
}
```
#### defineReactive方法

```js
// 重新定义属性，监听起来
function defineReactive(target, key, value) {
    // 深度监听
    observer(value)

    // 核心 API
    Object.defineProperty(target, key, {
        get() {
            return value
        },
        set(newValue) {
            if (newValue !== value) {
                // 深度监听
                observer(newValue)

                // 设置新值
                // 注意，value 一直在闭包中，此处设置完之后，再 get 时也是会获取最新的值
                value = newValue

                // 触发更新视图
                updateView()
            }
        }
    })
}
```
> 此处使用递归的形式，进行对象的向下遍历

####  Object.defineProperty的缺点
- 深度监听，需要一次性递归到底，计算量大
- 无法监听新增/删除属性（所以使用Vue的set和delete方法）
- 无法监听原生数组，需要特殊处理

### 数组监听
#### 对数组进行重新定义

```js
// 重新定义数组原型
const oldArrayProperty = Array.prototype
// 创建新对象，原型指向 oldArrayProperty ，再扩展新的方法不会影响原型
const arrProto = Object.create(oldArrayProperty);
['push', 'pop', 'shift', 'unshift', 'splice'].forEach(methodName => {
    arrProto[methodName] = function () {
        updateView() // 触发视图更新
        // 在执行updateView后，任然能够继续执行数组对象原有的方法
        oldArrayProperty[methodName].call(this, ...arguments)
        // 污染全局
        // Array.prototype.push.call(this, ...arguments)
    }
})
```
#### 修改observer

```js
// 监听对象属性
function observer(target) {
    if (typeof target !== 'object' || target === null) {
        // 不是对象或数组
        return target
    }

    // 污染全局的 Array 原型
    // Array.prototype.push = function () {
    //     updateView()
    //     ...
    // }

    if (Array.isArray(target)) {
        target.__proto__ = arrProto
    }

    // 重新定义各个属性（for in 也可以遍历数组）
    for (let key in target) {
        defineReactive(target, key, target[key])
    }
}
```




