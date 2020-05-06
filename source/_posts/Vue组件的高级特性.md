---
layout: '[post]'
title: Vue组件的高级特性
date: 2019-11-21 17:52:51
tags: Vue
---
## 自定义v-model
#### model.vue
<!-- more -->
```html
<template>
    <!-- 例如：vue 颜色选择 -->
    <input type="text"
        :value="text1"
        @input="$emit('change1', $event.target.value)"
    >
    <!--
        1. 上面的 input 使用了 :value 而不是 v-model
        2. 上面的 change1 和 model.event1 要对应起来
        3. text1 属性对应起来
    -->
</template>

<script>
export default {
    model: {
        prop: 'text1', // 对应 props text1
        event: 'change1'
    },
    props: {
        text1: String,
        default() {
            return ''
        }
    }
}
</script>
```
使用
```html
   <p>{{name}}</p>
   <CustomVModel v-model="name"/>
```

## $nextTick

```html
<template>
  <div id="app">
    <ul ref="ul1">
        <li v-for="(item, index) in list" :key="index">
            {{item}}
        </li>
    </ul>
    <button @click="addItem">添加一项</button>
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
      return {
        list: ['a', 'b', 'c']
      }
  },
  methods: {
    addItem() {
        this.list.push(`${Date.now()}`)
        this.list.push(`${Date.now()}`)
        this.list.push(`${Date.now()}`)

        // 1. 异步渲染，$nextTick 待 DOM 渲染完再回调
        // 2. 页面渲染时会将 data 的修改做整合，多次 data 修改只会渲染一次
        this.$nextTick(() => {
          // 获取 DOM 元素
          const ulElem = this.$refs.ul1
          // eslint-disable-next-line
          console.log( ulElem.childNodes.length )
        })
    }
  }
}
</script>


```

## slot（插槽）
### slot
#### 子组件
```html
<template>
    <a :href="url">
        <slot>
            默认内容，即父组件没设置内容时，这里显示
        </slot>
    </a>
</template>

<script>
export default {
    props: ['url'],
    data() {
        return {}
    }
}
</script>
```
#### 父组件使用时

```html
 <SlotDemo :url="website.url">
    {{website.title}}
 </SlotDemo>
```
### scope slot
#### 子组件

```html
<template>
    <a :href="url">
        <slot :slotData="website">
            {{website.subTitle}} <!-- 默认值显示 subTitle ，即父组件不传内容时 -->
        </slot>
    </a>
</template>

<script>
export default {
    props: ['url'],
    data() {
        return {
            website: {
                url: 'http://wangEditor.com/',
                title: 'wangEditor',
                subTitle: '轻量级富文本编辑器'
            }
        }
    }
}
</script>
```
#### 父组件

```html
        <ScopedSlotDemo :url="website.url">
            <template v-slot="slotProps">
                {{slotProps.slotData.title}}
            </template>
        </ScopedSlotDemo>
```

## 动态、异步组件
### 动态组件
#### 用法

```html
<component :is="xxxx(组件名称)"/>
// 此处需要写动态的名字（在data中绑定）
```
### 异步组件
#### 使用
```js
  components: {
        FormDemo: () => {
            return import('../BaseUse/FormDemo')
        }
    },
```
或者

```js
  components: {
        FormDemo: () => import('../BaseUse/FormDemo')
    },
```

## keep-alive
 - vue内置组件，能在组件切换过程中将状态保留在内存中，防止重复渲染DOM
 - keep-alive是用在一个直属子组件被开关的情形，同时只有一个子组件在渲染，若有v-for则不会工作

注：keep-alive是一个抽象组件，自身不会渲染一个DOM元素，也不会出现在父组件链中

```html
        <keep-alive> <!-- tab 切换 -->
            <KeepAliveStageA v-if="state === 'A'"/> <!-- v-show -->
            <KeepAliveStageB v-if="state === 'B'"/>
            <KeepAliveStageC v-if="state === 'C'"/>
        </keep-alive>
```
区别：
- v-if在切换过程中会销毁并创建
- v-show在首次加载组件时，会三个同时创建
- keep-alive会在在切换时候创建，但是不会销毁


## mixin
混入 (mixin) 提供了一种非常灵活的方式，来分发 Vue 组件中的可复用功能。一个混入对象可以包含任意组件选项。当组件使用混入对象时，所有混入对象的选项将被“混合”进入该组件本身的选项。
### mixin.js
```js
export default {
    data() {
        return {
            city: '北京'
        }
    },
    methods: {
        showName() {
            // eslint-disable-next-line
            console.log(this.name)
        }
    },
    mounted() {
        // eslint-disable-next-line
        console.log('mixin mounted', this.name)
    }
}

```
### 使用

```html
<template>
    <div>
        <p>{{name}} {{major}} {{city}}</p>
        <button @click="showName">显示姓名</button>
    </div>
</template>

<script>
import myMixin from './mixin'

export default {
    mixins: [myMixin], // 可以添加多个，会自动合并起来
    data() {
        return {
            name: '双越',
            major: 'web 前端'
        }
    },
    methods: {
    },
    mounted() {
        // eslint-disable-next-line
        console.log('component mounted', this.name)
    }
}
</script>
```
### 注意
- mixin对象则local对象覆盖mixin对象
- 生命周期钩子函数则是合并执行，先执行mixin后执行local

### mixin的问题
- 变量来源不明确，不利于阅读
- 多mixin可能造成命名冲突
- mixin和组件可能出现多对多的关系，复杂度高