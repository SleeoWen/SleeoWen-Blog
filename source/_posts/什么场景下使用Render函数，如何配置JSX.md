---
layout: '[post]'
title: 什么场景下使用Render函数，如何配置JSX
date: 2021-06-08 20:28:50
tags: Vue
---


Render 函数
---------

`render`函数是组件渲染的重要核心，它跟`template`模板开发一样，只不过这种形式开发，它 (`render`) 更接近底层，这样能让`Vue`编译时少转换一次。

让我们来看一下哪里能用到`render`函数。
 <!-- more -->
我们都知道`Vue`项目入口文件`main.js`里面有个`render`函数长下面这样，将项目的`App`根组件，挂载到根实例上通过`render`渲染。

```js
new Vue({
  render: h => h(App)
}).$mount('#app')
复制代码
```

我们来解刨一下`render`函数身体。

*   render 函数返回值是一个`VNode` -> "virtual node" 虚拟节点

*   render 函数的参数是一个`createElement`函数

    *   `createElement`返回值也是一个`VNode`节点
    *   `createElement`函数的参数有三个
        *   第一个 标签名称
        *   第二个 属性值
        *   第三个 标签子级元素

**代码演示：**

index.js

```js
export default {
    data() {
        return {
            name: '蛙人'
        }
    },
    render(createElement) {
       	return createElement(
            "div", 
            { attrs: {title: "蛙人"} }, 
            [
                createElement("span", null, "蛙人")
            ]
        )
    }
}
复制代码
```

main.js

```js
import config from "./index.js"
Vue.component("test", config)
复制代码
```

上面会调用标签会创建出一个`div`带有`span`子级的内容，注意`createElement`第二个参数属性这里，这里不能乱写，必须遵守官网风格[点击这里](https://cn.vuejs.org/v2/guide/render-function.html#%E6%B7%B1%E5%85%A5%E6%95%B0%E6%8D%AE%E5%AF%B9%E8%B1%A1)。

当然这里肯定有人会问，这样写有什么用，跟`template`写不一样嘛，`render`函数这样写还麻烦可读性不强。

分情况，有时候用`render`更加灵活，咱就拿官网最典型的案例来**举个例子**。

封装一个组件，进行传入数字参数，就显示数字参数的标签，你肯定会先想到这样。

```html
<template>
    <div>
        <h1 v-if="num == 1"></h1>
        <h2 v-if="num == 2"></h2>
        <h3 v-if="num == 3"></h3>
        <h4 v-if="num == 4"></h4>
        <h5 v-if="num == 5"></h5>
        <h6 v-if="num == 6"></h6>
    </div>
</template>
复制代码
```

上面这样实现是没问题的，但是代码会冗余，一堆判断。我们再来看一下`render函数`的实现

```html
<script>
  render: function (createElement) {
    return createElement(
      'h' + this.num,
    )
  },
  props: {
    num: {
      type: Number,
      required: true
    }
  }
</script>
复制代码
```

上面两种都实现了同样的功能，是不是`render函数`这种方式看起来要简洁的多。所以一般用`render函数`封装东西是比较灵活的，尤其是配置和模板分离。深入理解配置[这里](https://cn.vuejs.org/v2/guide/render-function.html#%E6%B7%B1%E5%85%A5%E6%95%B0%E6%8D%AE%E5%AF%B9%E8%B1%A1)。

什么是 JSX
-------

`JSX`是`JavScript`和`XML`结合一种的格式，是`JavaScript`的扩展语法。说白了就是可以在`JavaScript`代码中使用`JSX`。`JavaScript`在解析`JSX`时会先创建虚拟`DOM`，`JSX`最后会被编译为`JavaScript`代码执行。

为什么要用 JSX
---------

有的人肯定觉得用`render`函数写如果嵌套子级太多层看着太别扭了，可读性太差。

```js
export default {
    render(createElement) {
       	return createElement(
            "div", 
            { attrs: {title: "蛙人"} }, 
            [
                createElement(
                    "span", 
                    null, 
                    "蛙人"
                ),
                createElement(
                    "span", 
                    null, 
                    createElement(
                        "b", 
                        null, 
                        "前端娱乐圈"
                    )
                ),
                createElement(
                    "span", 
                    null, 
                    createElement(
                        "b", 
                        null, 
                        createElement(
                            "i", 
                            null, 
                            "关注前端娱乐圈"
                        )
                    )
                )
            ]
        )
    }
}
复制代码
```

比如上面这种，嵌套多层，可读性太差，时间一长自己还得捋半天。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1f6fac23ec51446dbc81d8450f2adbe2~tplv-k3u1fbpfcp-zoom-1.image)

所以为了解决这问题，`JSX`就登场了，`JSX`相当于就是`createElement`的语法糖，这种形式可以直接使用`template`模板那种格式在`render`函数里写。

我们用这种形式来还原一下上面的`createElement`写的，是不是这种很简洁易读。

```js
export default {
    render() {
        return (<div>
            <span>蛙人</span>
            <span>
                <b>前端娱乐圈</b>
            </span>
            <span>
                <b>
                    <i>关注前端娱乐圈</i>
                </b>
            </span>
        </div>)
    }
}
复制代码
```

JSX 和 Render 函数有什么不同
--------------------

除了写法不一样外，没什么不同，属性都是遵循 Vue 文档上的。

我们来使用 JSX 语法，看看怎么使用，这里玩过 React 的同学估计都会使用。

```js
export default {
	data() {
		return {
			name: "前端娱乐圈",
			dataList: {
				title: "前端娱乐圈",
				href: "www.baidu.com"
			}
		}
	},
    render() {
        return <div onClick={this.xxx} {...{attrs: this.dataList}}>{ this.name }</div>
    }
}
复制代码
```

使用
--

**如果你的项目是`Webpack`搭建，babel@6 的情况**

```
npm i @babel/core @vue/babel-preset-jsx babel-loader
复制代码
```

根目录`.babelrc`文件

```
{
	"plugins": ["transform-vue-jsx"]
}
复制代码
```

webpack.config.js

```
{
    test: /\.js/,
    use: "babel-loader"
}
复制代码
```

**如果你的项目是`Webpack`搭建，babel@7 的情况**

```
npm i @babel/core @vue/babel-preset-jsx babel-loader @vue/babel-preset-jsx @vue/babel-helper-vue-jsx-merge-props
复制代码
```

根目录`.babelrc`文件

[文档说明 babel7 兼容 JSX 问题](https://github.com/vuejs/jsx)

```
{
	"presets": ["@vue/babel-preset-jsx"]
}
复制代码
```

webpack.config.js

```
{
    test: /\.js/,
    use: "babel-loader"
}
复制代码
```

**如果你的项目是`Vue-cli`**

最新版本的 cli 是会默认支持 JSX 语法的，如果你的版本较老请跟上面一样的配置。

```
npm i @vue/babel-preset-jsx @vue/babel-helper-vue-jsx-merge-props
复制代码
```

babel.config.js

```
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ]
}
复制代码
```

结语
--




--


----

原文地址 [juejin.cn](https://juejin.cn/post/6977237451660066853?utm_source=gold_browser_extension)
参考
--

[blog.csdn.net/sansan_7957…](https://blog.csdn.net/sansan_7957/article/details/83014838)

[cn.vuejs.org/v2/guide/re…](https://cn.vuejs.org/v2/guide/render-function.html#%E5%9F%BA%E7%A1%80)
