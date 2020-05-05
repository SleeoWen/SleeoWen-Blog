---
layout: '[post]'
title: Vue基础一
date: 2019-10-20 00:03:47
tags: Vue
---
## 插值表达式
<!-- more -->
```html
<template>
    <div>
        <p>文本插值 {{message}}</p>
        <p>JS 表达式 {{ flag ? 'yes' : 'no' }} （只能是表达式，不能是 js 语句）</p>

        <p :id="dynamicId">动态属性 id</p>

        <hr/>
        <p v-html="rawHtml">
            <span>有 xss 风险</span>
            <span>【注意】使用 v-html 之后，将会覆盖子元素</span>
        </p>
        <!-- 其他常用指令后面讲 -->
    </div>
</template>
<script>
export default {
    data() {
        return {
            message: 'hello vue',
            flag: true,
            rawHtml: '指令 - 原始 html <b>加粗</b> <i>斜体</i>',
            dynamicId: `id-${Date.now()}`
        }
    }
}
</script>

```
## computed和watch
### computed
一个计算属性,类似于过滤器,对绑定到view的数据进行处理。

```js
 data: {
    firstName: 'Foo',
    lastName: 'Bar'
  },
  computed: {
    fullName: function () {
      return this.firstName + ' ' + this.lastName
    }
  }
```
**fullName不可在data里面定义**
#### get和set用法

```js
data: {
    firstName: 'Foo',
    lastName: 'Bar'
  },
  computed: {
  fullName：{
   get(){//回调函数 当需要读取当前属性值是执行，根据相关数据计算并返回当前属性的值
      return this.firstName + ' ' + this.lastName
    },
   set(val){//监视当前属性值的变化，当属性值发生变化时执行，更新相关的属性数据
       //val就是fullName的最新属性值
       console.log(val)
        const names = val.split(' ');
        console.log(names)
        this.firstName = names[0];
        this.lastName = names[1];
   }
   }
  }
```

**computed有缓存，data不变则不会重新计算**

### watch
watch是一个观察的动作

```js
data: {
    firstName: 'Foo',
    lastName: 'Bar',
    fullName: 'Foo Bar'
  },
  watch: {
     firstName: function (val) {
     this.fullName = val + ' ' + this.lastName
  },
  lastName: function (val) {
     this.fullName = this.firstName + ' ' + val
   }
}
```
#### 简单数据类型

```js
data(){
      return{
        'first':2
      }
    },
    watch:{
      first(){
        console.log(this.first)
      }
    },
```
#### 复杂数据类型

```js
data(){
      return{
        'first':{
          second:0
        }
      }
    },
    watch:{
      secondChange:{
        handler(oldVal,newVal){
          console.log(oldVal)
          console.log(newVal)
        },
        deep:true
      }
    },
```
 - **console.log打印的结果,发现oldVal和newVal值是一样的,所以深度监听虽然可以监听到对象的变化,但是无法监听到具体对象里面那个属性的变化（只针对引用类型）**

 - oldVal和newVal值一样的原因是它们索引同一个对象/数组。Vue **不会保留修改之前值的副本**

 - 深度监听对应的函数名必须为handler,否则无效果,因为watcher里面对应的是对handler的调用

#### 监听对象单个属性
##### 方法一
```js
  data() {
    return {
      first: {
        second: 0
      }
    };
  },
  watch: {
    "first.second": function(newVal, oldVal) {
      console.log(newVal, oldVal);
    }
  }
```
##### 方法二

用computed作为中间件转化,因为computed可以取到对应的属性值
```js
  data() {
    return {
      first: {
        second: 0
      }
    };
  },
  computed: {
    secondChange() {
      return this.first.second;
    }
  },
  watch: {
    secondChange() {
      console.log("second属性值变化了");
    }
  }
```

### computed和watch的区别
####  computed特性
1. 是计算值
2. 应用：就是简化tempalte里面双花括号计算和处理props或$emit的传值
3. 具有缓存性，页面重新渲染值不变化,计算属性会立即返回之前的计算结果，而不必再次执行函数

#### watch特性
1. 是观察的动作
2. 应用：监听props，$emit或本组件的值执行异步操作
3. 无缓存性，页面重新渲染时值不变化也会执行

## class和style
 - 使用动态属性
 - 使用驼峰式写法

```html
<template>
    <div>
        <p :class="{ black: isBlack, yellow: isYellow }">使用 class</p>
        <p :class="[black, yellow]">使用 class （数组）</p>
        <p :style="styleData">使用 style</p>
    </div>
</template>

<script>
export default {
    data() {
        return {
            isBlack: true,
            isYellow: true,

            black: 'black',
            yellow: 'yellow',

            styleData: {
                fontSize: '40px', // 转换为驼峰式
                color: 'red',
                backgroundColor: '#ccc' // 转换为驼峰式
            }
        }
    }
}
</script>

<style scoped>
    .black {
        background-color: #999;
    }
    .yellow {
        color: yellow;
    }
</style>
```

## 条件渲染

```html
<template>
    <div>
        <p v-if="type === 'a'">A</p>
        <p v-else-if="type === 'b'">B</p>
        <p v-else>other</p>

        <p v-show="type === 'a'">A by v-show</p>
        <p v-show="type === 'b'">B by v-show</p>
    </div>
</template>

<script>
export default {
    data() {
        return {
            type: 'a'
        }
    }
}
</script>
```

#### v-if和v-show
 - v-if是false时候不会渲染dom，v-show则是display:none
 - 频繁切换使用v-show,不会频繁渲染dom


