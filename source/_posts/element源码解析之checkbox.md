---
layout: '[post]'
title: element源码解析之checkbox
date: 2020-07-01 10:24:56
tags: element
---


index.js
---------

```js
import ElCheckbox from './src/checkbox';
import ElCheckboxGroup from './src/checkbox-group.vue';

export default function install(Vue) {
  Vue.component(ElCheckboxGroup.name, ElCheckboxGroup);
  Vue.component(ElCheckbox.name, ElCheckbox);
};

export {
  ElCheckbox,
  ElCheckboxGroup
};
```
<!-- more -->
* * *

Checkbox-group
--------------

```html
<template>
  <div>
    <slot></slot>
  </div>
</template>
```

`checkbox-group`的`html`代码十分简单，就是一个`div.el-checkbox-group`包裹着一个`slot`，没有什么好说的，但是它在`script`里面做了许多处理。

### Watch

监听`value`的变化，然后会触发一个`change`事件，并且根据`mixin`中的`emitter`增加的`dispatch`来向父组件派发事件。

```js
watch: {
  value(value) {
    this.$emit('change', value);
    this.dispatch('ElFormItem', 'el.form.change', [value]);
  }
}
```

### dispatch

具体的讲解将在`mixin篇`进行讲解，简单的说是模拟`vue 1.0`中的`$dispatch`，来将事件一直向上传递。

Checkbox
--------

我们还是先分析其生命周期。

生命周期
----

### created

创建的时候根据`checked`这一`prop`来决定是否调用`addToStore`方法，

```
methods: {
  addToStore() {
    if (
      Array.isArray(this.model) &&
      this.model.indexOf(this.label) === -1
    ) {  
      this.model.push(this.label);
    } else {  
      this.model = this.trueLabel || true;
    }
  }
},
```

`checkbox`组件一共有三种`label`，这里先列一下官方的说明，具体使用在接下来的分析中会提及：

1.  `label`，选中状态的值（只有在`checkbox-group`或者绑定对象类型为`array`时有效），它的值是`string`；
2.  `true-label`，选中时的值，它的值是`string`或者`number`；
3.  `false-label`，没有选中时的值，它的值是`string`或者`number`。

而`model`是一个计算属性：

```js
computed: {
  model: {
    get() {  
      return this.isGroup
        ? this.store : this.value !== undefined  
        ? this.value : this.selfModel;  
    },

    set(val) {  
      if (this.isGroup) {  
        this.dispatch('ElCheckboxGroup', 'input', [val]);  
      } else if (this.value !== undefined) {  
        this.$emit('input', val);  
      } else {  
        this.selfModel = val;  
      }
    }
  },
```

其中`value`是一个`prop`，而`selfModel`是一个`data`上的属性，`store`是一个计算属性：

```js
computed: {
  store() {
    
    return this._checkboxGroup ? this._checkboxGroup.value : this.value;
  }
}
```

而`isGroup`是另一个计算属性，它将一直向父级查找到`el-checkbox-group`，如果有则返回`true`，否则返回`false`：

```js
computed: {
  isGroup() {
    let parent = this.$parent;
    while (parent) {
      if (parent.$options.componentName !== 'ElCheckboxGroup') {
        parent = parent.$parent;
      } else {
        this._checkboxGroup = parent;
        return true;
      }
    }
    return false;
  },
}
```

label
-----

多选最外面是一个`label`。

```html
<label>
</label>
```

然后是两个`span`，一个是`input`部分，另一个是`label`部分。

el-checkbox__input
------------------

`el-checkbox__input`最外层也是一个`span`，并在上面设置了动态的`class`：

```html
<span
  :class="{
    'is-disabled': disabled,  // 这是prop，控制是否可用
    'is-checked': isChecked,  // 这是一个计算属性
    'is-indeterminate': indeterminate,  // 这是prop，用来控制样式
    'is-focus': focus  // 这是data属性，用来控制是否聚焦
  }"
>
</span>
```

其中`isChecked`的设置如下：

```js
computed: {
  isChecked() {
    if ({}.toString.call(this.model) === '[object Boolean]') {  
      return this.model;  
    } else if (Array.isArray(this.model)) {  
      return this.model.indexOf(this.label) > -1;  
    } else if (this.model !== null && this.model !== undefined) {  
      return this.model === this.trueLabel;  
    }
  },
}
```

### el-checkbox__inner

然后是用来表示前面对勾的`span`，它 主要通过`css`来控制对勾的显示。

```html
<span></span>
```

### input

然后是传统的`input`，它的`type`是`checkbox`，但是这个`input`并不会显示，而且会根据传递的`prop`有两种不同的`input`。

```html
<input
  v-if="trueLabel || falseLabel"
 
  type="checkbox"
  :
  :disabled="disabled"
  :true-value="trueLabel"
  :false-value="falseLabel"
  v-model="model"
  @change="$emit('change', $event)"
  @focus="focus = true"
  @blur="focus = false">
<input
  v-else
 
  type="checkbox"
  :disabled="disabled"
  :value="label"
  :
  v-model="model"
  @change="$emit('change', $event)"
  @focus="focus = true"
  @blur="focus = false">
```

它们不同的地方是，前者使用了`trueLabel`和`falseLabel`，后者使用了`label`它们都通过`v-model`绑定了`model`，在`change`的时候都会派发`change`事件，聚焦的时候会设置`focus`为`true`，

el-checkbox__label
------------------

标签部分可以通过匿名`slot`或者`label`进行设置，前者具有优先权。

```html
<span v-if="$slots.default || label">
  <slot></slot>
  <template v-if="!$slots.default">{{label}}</template>
</span>
```

> 注：这里明显看出来，这和之前不是同一个人写的，这里值得注意的是`slot`内部的内容，在没有传入`slot`才会显示，因此不同特别做一个处理，也可能是有其他我没有考虑到的原因，如果以后发现了，会回来修正。
