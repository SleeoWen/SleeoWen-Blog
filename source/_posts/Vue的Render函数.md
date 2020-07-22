---
layout: '[post]'
title: Vue的Render函数
date: 2020-07-12 20:48:42
tags: Vue
---
前几天想学学 Vue 中怎么编写可复用的组件，提到要对 Vue 的`render`函数有所了解。可仔细一想，对于 Vue 的`render`函数自己只是看了官方的一些介绍，并未深入一点去了解这方面的知识。为了更好的学习后续的知识，又折回来了解 Vue 中的`render`函数，这一切主要都是为了后续能更好的学习 Vue 的知识。
<!-- more -->
回忆 Vue 的一些基本概念
--------------

今天我们学习的目的是了解和学习 Vue 的`render`函数。如果想要更好的学习 Vue 的`render`函数相关的知识，我们有必要重温一下 Vue 中的一些基本概念。那么先上一张图，这张图从宏观上展现了 Vue 整体流程：

![](http://upload-images.jianshu.io/upload_images/13429147-32832d6b08b108c4.jpg)

image

从上图中，不难发现一个 Vue 的应用程序是如何运行起来的，模板通过编译生成 AST，再由 AST 生成 Vue 的`render`函数（渲染函数），渲染函数结合数据生成 Virtual DOM 树，Diff 和 Patch 后生成新的 UI。从这张图中，可以接触到 Vue 的一些主要概念：

*   **模板**：Vue 的模板基于纯 HTML，基于 Vue 的模板语法，我们可以比较方便地声明数据和 UI 的关系。
*   **AST**：AST 是 **Abstract Syntax Tree** 的简称，Vue 使用 HTML 的 Parser 将 HTML 模板解析为 AST，并且对 AST 进行一些优化的标记处理，提取最大的静态树，方便 Virtual DOM 时直接跳过 Diff。
*   **渲染函数**：渲染函数是用来生成 Virtual DOM 的。Vue 推荐使用模板来构建我们的应用界面，在底层实现中 Vue 会将模板编译成渲染函数，当然我们也可以不写模板，直接写渲染函数，以获得更好的控制 （这部分是我们今天主要要了解和学习的部分）。
*   **Virtual DOM**：虚拟 DOM 树，Vue 的 Virtual DOM Patching 算法是基于 **[Snabbdom](https://github.com/snabbdom/snabbdom)** 的实现，并在些基础上作了很多的调整和改进。
*   **Watcher**：每个 Vue 组件都有一个对应的`watcher`，这个`watcher`将会在组件`render`的时候收集组件所依赖的数据，并在依赖有更新的时候，触发组件重新渲染。你根本不需要写`shouldComponentUpdate`，Vue 会自动优化并更新要更新的 UI。

上图中，`render`函数可以作为一道分割线，`render`函数的左边可以称之为**编译期**，将 Vue 的模板转换为**渲染函数**。`render`函数的右边是 Vue 的运行时，主要是基于渲染函数生成 Virtual DOM 树，Diff 和 Patch。

渲染函数的基础
-------

Vue 推荐在绝大多数情况下使用`template`来创建你的 HTML。然而在一些场景中，需要使用 JavaScript 的编程能力和创建 HTML，这就是**`render`函数**，它比`template`更接近编译器。

```html
<h1>
    <a >
        Hello world!
    </a>
</h1>
```

在 HTML 层，我们决定这样定义组件接口：

```html
<anchored-heading :level="1">Hello world!</anchored-heading>
```

当我们开始写一个通过`level`的`prop`动态生成`heading`标签的组件，你可能很快想到这样实现：

```js
<script type="text/x-template">
    <h1 v-if="level === 1">
        <slot></slot>
    </h1>
    <h2 v-else-if="level === 2">
        <slot></slot>
    </h2>
    <h3 v-else-if="level === 3">
        <slot></slot>
    </h3>
    <h4 v-else-if="level === 4">
        <slot></slot>
    </h4>
    <h5 v-else-if="level === 5">
        <slot></slot>
    </h5>
    <h6 v-else-if="level === 6">
        <slot></slot>
    </h6>
</script>


Vue.component('anchored-heading', {
    template: '#anchored-heading-template',
    props: {
        level: {
            type: Number,
            required: true
        }
    }
})
```

在这种场景中使用 `template` 并不是最好的选择：首先代码冗长，为了在不同级别的标题中插入锚点元素，我们需要重复地使用 `<slot></slot>`。

虽然模板在大多数组件中都非常好用，但是在这里它就不是很简洁的了。那么，我们来尝试使用 `render` 函数重写上面的例子：

```js
Vue.component('anchored-heading', {
    render: function (createElement) {
        return createElement(
            'h' + this.level,   
            this.$slots.default 
        )
    },
    props: {
        level: {
            type: Number,
            required: true
        }
    }
})
```

简单清晰很多！简单来说，这样代码精简很多，但是需要非常熟悉 Vue 的实例属性。在这个例子中，你需要知道当你不使用 `slot` 属性向组件中传递内容时，比如 `anchored-heading` 中的 `Hello world!`，这些子元素被存储在组件实例中的 `$slots.default`中。

节点、树以及虚拟 DOM
------------

对 Vue 的一些概念和渲染函数的基础有一定的了解之后，我们需要对一些浏览器的工作原理有一些了解，这样对我们学习`render`函数是很重要的。比如下面的这段 HTML 代码：

```html
<div>
    <h1>My title</h1>
    Some text content
    
</div>
```

当浏览器读到这些代码时，它会建立一个 **[DOM 节点树](https://javascript.info/dom-nodes)**来保持追踪，如果你会画一张家谱树来追踪家庭成员的发展一样。

HTML 的 DOM 节点树如下图所示：

![](http://upload-images.jianshu.io/upload_images/13429147-53f54999b1bc18e9.png)

image

每个元素都是一个节点。每片文字也是一个节点。甚至注释也都是节点。一个节点就是页面的一个部分。就像家谱树一样，每个节点都可以有孩子节点 (也就是说每个部分可以包含其它的一些部分)。

高效的更新所有这些节点会是比较困难的，不过所幸你不必再手动完成这个工作了。你只需要告诉 Vue 你希望页面上的 HTML 是什么，这可以是在一个模板里：

或者一个渲染函数里：

```js
render: function (createElement) {
    return createElement('h1', this.blogTitle)
}
```

在这两种情况下，Vue 都会自动保持页面的更新，即便 `blogTitle` 发生了改变。

虚拟 DOM
------

在 Vue 2.0 中，渲染层的实现做了根本性改动，那就是引入了虚拟 DOM。

![](http://upload-images.jianshu.io/upload_images/13429147-4eb2a73597a2a9aa.png)

image

Vue 的编译器在编译模板之后，会把这些模板编译成一个渲染函数。而函数被调用的时候就会渲染并且返回一个**虚拟 DOM 的树**。

当我们有了这个虚拟的树之后，再交给一个 **Patch 函数**，负责把这些虚拟 DOM 真正施加到真实的 DOM 上。在这个过程中，Vue 有自身的响应式系统来侦测在渲染过程中所依赖到的数据来源。在渲染过程中，侦测到数据来源之后就可以精确感知数据源的变动。到时候就可以根据需要重新进行渲染。当重新进行渲染之后，会生成一个新的树，将新的树与旧的树进行对比，就可以最终得出应施加到真实 DOM 上的改动。最后再通过 Patch 函数施加改动。

简单点讲，在 Vue 的底层实现上，Vue 将模板编译成虚拟 DOM 渲染函数。结合 Vue 自带的响应系统，在应该状态改变时，Vue 能够智能地计算出重新渲染组件的最小代价并应到 DOM 操作上。

![](http://upload-images.jianshu.io/upload_images/13429147-4c7f8bdf4b804bd9.png)

image

Vue 支持我们通过`data`参数传递一个 JavaScript 对象做为组件数据，然后 Vue 将遍历此对象属性，使用 [`Object.defineProperty`方法](https://www.w3cplus.com/vue/vue-two-way-binding-object-defineproperty.html)设置描述对象，通过存取器函数可以追踪该属性的变更，Vue 创建了一层`Watcher`层，在组件渲染的过程中把属性记录为依赖，之后当依赖项的`setter`被调用时，会通知`Watcher`重新计算，从而使它关联的组件得以更新, 如下图：

![](http://upload-images.jianshu.io/upload_images/13429147-e5ab233db6c73c31.png)

image

有关于 Vue 的响应式相关的内容，可以阅读下列文章：

*   [深入理解 Vue.js 响应式原理](https://www.w3cplus.com/vue/understanding-vue-js-reactivity-depth-object-defineproperty.html)
*   [Vue 双向绑定的实现原理`Object.defineproperty`](https://www.w3cplus.com/vue/vue-two-way-binding-object-defineproperty.html)
*   [Vue 的双向绑定原理及实现](https://www.w3cplus.com/vue/vue-two-way-binding.html)
*   [Vue 中的响应式](https://www.w3cplus.com/vue/vue-reactivity.html)
*   [从 JavaScript 属性描述器剖析 Vue.js 响应式视图](https://www.w3cplus.com/vue/reactive.html)

对于 Vue 自带的响应式系统，并不是咱们今天要聊的东西。我们还是回到 Vue 的虚拟 DOM 中来。对于虚拟 DOM，咱们来看一个简单的实例，就是下图所示的这个，详细的阐述了`模板 → 渲染函数 → 虚拟DOM树 → 真实DOM`的一个过程

![](http://upload-images.jianshu.io/upload_images/13429147-54ee24bdb630fb55.png)

image

其实 Vue 中的虚拟 DOM 还是很复杂的，我也是一知半解，如果你想深入的了解，可以阅读 @JoeRay61 的《[Vue 原理解析之 Virtual DOM](https://segmentfault.com/a/1190000008291645)》一文。

通过前面的学习，我们初步了解到 Vue 通过建立一个**虚拟 DOM** 对真实 DOM 发生的变化保持追踪。比如下面这行代码：

```js
return createElement('h1', this.blogTitle)
```

`createElement` 到底会返回什么呢？其实不是一个实际的 DOM 元素。它更准确的名字可能是 `createNodeDescription`，因为它所包含的信息会告诉 Vue 页面上需要渲染什么样的节点，及其子节点。我们把这样的节点描述为 “虚拟节点 (Virtual Node)”，也常简写它为“VNode”。“虚拟 DOM” 是我们对由 Vue 组件树建立起来的整个 VNode 树的称呼。

Vue 组件树建立起来的整个 VNode 树是唯一的。这意味着，下面的**`render`函数是无效**的：

```js
render: function (createElement) {
    var myParagraphVNode = createElement('p', 'hi')
    return createElement('div', [
        
        myParagraphVNode, myParagraphVNode
    ])
}
```

如果你真的需要重复很多次的元素 / 组件，你可以使用工厂函数来实现。例如，下面这个例子 `render` 函数完美有效地渲染了 `20` 个重复的段落：

```js
render: function (createElement) {
    return createElement('div',
        Array.apply(null, { length: 20 }).map(function () {
            return createElement('p', 'hi')
        })
    )
}
```

Vue 的渲染机制
---------

![](http://upload-images.jianshu.io/upload_images/13429147-b34d3ed28b6eccb6.png)

image

上图展示的是独立构建时的一个渲染流程图。

继续使用上面用到的模板到真实 DOM 过程的一个图：

![](http://upload-images.jianshu.io/upload_images/13429147-3466e87621454e79.png)

image

这里会涉及到 Vue 的另外两个概念：

*   **独立构建**：包含模板编译器，渲染过程`HTML字符串 → render函数 → VNode → 真实DOM节点`
*   **运行时构建**：不包含模板编译器，渲染过程`render函数 → VNode → 真实DOM节点`

运行时构建的包，会比独立构建少一个模板编译器。在`$mount`函数上也不同。而`$mount`方法又是整个渲染过程的起始点。用一张流程图来说明：

![](http://upload-images.jianshu.io/upload_images/13429147-7f193c6cb2e36da0.png)

image

由此图可以看到，在渲染过程中，提供了三种渲染模式，自定义`render`函数、`template`、`el`均可以渲染页面，也就是对应我们使用 Vue 时，三种写法：

### 自定义`render函数`

```js
Vue.component('anchored-heading', {
    render: function (createElement) {
        return createElement (
            'h' + this.level,   
            this.$slots.default 
        )
    },
    props: {
        level: {
            type: Number,
            required: true
        }
    }
})
```

### `template`写法

```js
let app = new Vue({
    template: `<div>{{ msg }}</div>`,
    data () {
        return {
            msg: ''
        }
    }
})
```

### `el`写法

```js
let app = new Vue({
    el: '#app',
    data () {
        return {
            msg: 'Hello Vue!'
        }
    }
})
```

这三种渲染模式最终都是要得到`render`函数。只不过用户自定义的`render`函数省去了程序分析的过程，等同于处理过的`render`函数，而普通的`template`或者`el`只是字符串，需要解析成 AST，再将 AST 转化为`render`函数。

> **记住一点，无论哪种方法，都要得到`render`函数。**

我们在使用过程中具体要使用哪种调用方式，要根据具体的需求来。

如果是比较简单的逻辑，使用`template`和`el`比较好，因为这两种都属于声明式渲染，对用户理解比较容易，但灵活性比较差，因为最终生成的`render`函数是由程序通过 AST 解析优化得到的; 而使用自定义`render`函数相当于人已经将逻辑翻译给程序，能够胜任复杂的逻辑，灵活性高，但对于用户的理解相对差点。

理解`createElement`
-----------------

在使用`render`函数，其中还有另一个需要掌握的部分，那就是`createElement`。接下来我们需要熟悉的是如何在`createElement`函数中生成模板。那么我们分两个部分来对`createElement`进行理解。

### `createElement`参数

`createElement`可以是接受多个参数：

#### 第一个参数：`{String | Object | Function}`

第一个参数对于`createElement`而言是一个必须的参数，这个参数可以是字符串`string`、是一个对象`object`，也可以是一个函数`function`。

```js
<div>
    <custom-element></custom-element>
</div>

Vue.component('custom-element', {
    render: function (createElement) {
        return createElement('div')
    }
})

let app = new Vue({
    el: '#app'
})
```

上面的示例，给`createElement`传了一个`String`参数`'div'`，即传了一个 HTML 标签字符。最后会有一个`div`元素渲染出来：

![](http://upload-images.jianshu.io/upload_images/13429147-eb35f142664bda0c.png)

image

接着把上例中的`String`换成一个`Object`，比如：

```js
Vue.component('custom-element', {
    render: function (createElement) {
        return createElement({
            template: `<div>Hello Vue!</div>`
        })
    }
})
```

上例传了一个`{template: '<div>Hello Vue!</div>'}`对象。此时`custom-element`组件渲染出来的结果如下：

![](http://upload-images.jianshu.io/upload_images/13429147-cafcbeeddcfda7e4.png)

image

除此之外，还可以传一个`Function`，比如：

```js
Vue.component('custom-element', {
    render: function (createElement) {
        var eleFun = function () {
            return {
                template: `<div>Hello Vue!</div>`
            }
        }
        return createElement(eleFun())
    }
})
```

最终得到的结果和上图是一样的。这里传了一个`eleFun()`函数给`createElement`，而这个函数返回的是一个对象。

#### 第二个参数:`{Object}`

`createElement`是一个可选参数，这个参数是一个`Object`。来看一个小示例：

```js
<div>
    <custom-element></custom-element>
</div>

Vue.component('custom-element', {
    render: function (createElement) {
        var self = this

        
        
        return createElement('div', {
            'class': {
                foo: true,
                bar: false
            },
            style: {
                color: 'red',
                fontSize: '14px'
            },
            attrs: {
                id: 'boo'
            },
            domProps: {
                innerHTML: 'Hello Vue!'
            }
        })
    }
})

let app = new Vue({
    el: '#app'
})
```

最终生成的 DOM，将会带一些属性和内容的`div`元素，如下图所示：

![](http://upload-images.jianshu.io/upload_images/13429147-bef18523b2d62e16.png)

image

#### 第三个参数：{String | Array}

`createElement`还有第三个参数，这个参数是可选的，可以给其传一个`String`或`Array`。比如下面这个小示例：

```js
<div>
    <custom-element></custom-element>
</div>

Vue.component('custom-element', {
    render: function (createElement) {
        var self = this

        return createElement(
            'div', 
            {
                class: {
                    title: true
                },
                style: {
                    border: '1px solid',
                    padding: '10px'
                }
            }, 
            [
                createElement('h1', 'Hello Vue!'),
                createElement('p', '开始学习Vue!')
            ] 
        )
    }
})

let app = new Vue({
    el: '#app'
})
```

最终的效果如下：

![](http://upload-images.jianshu.io/upload_images/13429147-1c69ce736a29a3c1.png)

image

其实从上面这几个小例来看，不难发现，以往我们使用`Vue.component()`创建组件的方式，都可以用`render`函数配合`createElement`来完成。你也会发现，使用`Vue.component()`和`render`各有所长，正如文章开头的一个示例代码，就不适合`Vue.component()`的`template`，而使用`render`更方便。

接下来看一个小示例，看看`template`和`render`方式怎么创建相同效果的一个组件:

```js
<div>
    <custom-element></custom-element>
</div>

Vue.component('custom-element', {
    template: `<div :class="{show: show}" @click="handleClick">Hello Vue!</div>`,
    data () {
        return {
            show: true
        }
    },
    methods: {
        handleClick: function () {
            console.log('Clicked!')
        }
    }
})
```

上面`Vue.component()`中的代码换成`render`函数之后，可以这样写：

```js
Vue.component('custom-element', {
    render: function (createElement) {
        return createElement('div', {
            class: {
                show: this.show
            },
            attrs: {
                id: 'box'
            },
            on: {
                click: this.handleClick
            }
        }, 'Hello Vue!')
    },
    data () {
        return {
            show: true
        }
    },
    methods: {
        handleClick: function () {
            console.log('Clicked!')
        }
    }
})
```

最后声明一个 Vue 实例，并挂载到`id`为`#app`的一个元素上：

```js
let app = new Vue({
    el: '#app'
})
```

### `createElement`解析过程

简单的来看一下`createElement`解析的过程，这部分需要对 JS 有一些功底。不然看起来有点蛋疼：

```js
const SIMPLE_NORMALIZE = 1
const ALWAYS_NORMALIZE = 2

function createElement (context, tag, data, children, normalizationType, alwaysNormalize) {

    
    if (Array.isArray(data) || isPrimitive(data)) {
        normalizationType = children
        children = data
        data = undefined
    }

    
    
    if (alwaysNormalize) normalizationType = ALWAYS_NORMALIZE
        
        return _createElement(context, tag, data, children, normalizationType)
    }

    function _createElement (context, tag, data, children, normalizationType) {
        
        if (data && data.__ob__) {
            process.env.NODE_ENV !== 'production' && warn(
            `Avoid using observed data object as vnode data: ${JSON.stringify(data)}\n` +
            'Always create fresh vnode data objects in each render!',
            context
            )
            return createEmptyVNode()
        }

        
        
        
        if (!tag) {
            return createEmptyVNode()
        }

        
        if (Array.isArray(children) && typeof children[0] === 'function') {
            data = data || {}
            data.scopedSlots = { default: children[0] }
            children.length = 0
        }

        
        if (normalizationType === ALWAYS_NORMALIZE) {
            children = normalizeChildren(children)
        } else if (normalizationType === SIMPLE_NORMALIZE) {
            children = simpleNormalizeChildren(children)
        }
        let vnode, ns

        
        if (typeof tag === 'string') {
            let Ctor
            
            ns = config.getTagNamespace(tag)

            
            if (config.isReservedTag(tag)) {
                
                vnode = new VNode(
                    config.parsePlatformTagName(tag), data, children,
                    undefined, undefined, context
                )

                
            } else if ((Ctor = resolveAsset(context.$options, 'components', tag))) {
                
                vnode = createComponent(Ctor, data, context, children, tag)
            } else {
                
                vnode = new VNode(
                    tag, data, children,
                    undefined, undefined, context
                )
            }

        
        
        } else {
            vnode = createComponent(tag, data, context, children)
        }

        
        if (vnode) {
            
            if (ns) applyNS(vnode, ns)
            return vnode
        
        } else {
            return createEmptyVNode()
        }
    }
}
```

简单的梳理了一个流程图，可以参考下

![](http://upload-images.jianshu.io/upload_images/13429147-e0558045f83150dd.png)

image

> 这部分代码和流程图来自于 @JoeRay61 的《[Vue 原理解析之 Virtual DOM](https://segmentfault.com/a/1190000008291645)》一文。

使用 JavaScript 代替模板功能
--------------------

在使用 Vue 模板的时候，我们可以在模板中灵活的使用 [`v-if`](https://www.w3cplus.com/vue/v-if-vs-v-show.html)、[`v-for`](https://www.w3cplus.com/vue/v-for.html)、[`v-model`](https://www.w3cplus.com/vue/v-model.html)和 [`<slot>`](https://www.w3cplus.com/vue/vue-slot.html)之类的。但在`render`函数中是没有提供专用的 API。如果在`render`使用这些，需要使用原生的 JavaScript 来实现。

### `v-if`和`v-for`

在`render`函数中可以使用`if/else`和`map`来实现`template`中的`v-if`和`v-for`。

```html
<ul v-if="items.length">
    <li v-for="item in items">{{ item }}</li>
</ul>
<p v-else>No items found.</p>
```

换成`render`函数，可以这样写：

```js
Vue.component('item-list',{
    props: ['items'],
    render: function (createElement) {
        if (this.items.length) {
            return createElement('ul', this.items.map((item) => {
                return createElement('item')
            }))
        } else {
            return createElement('p', 'No items found.')
        }
    }
})

<div>
    <item-list :items="items"></item-list>
</div>

let app = new Vue({
    el: '#app',
    data () {
        return {
            items: ['大漠', 'W3cplus', 'blog']
        }
    }
})
```

得到的效果如下：

![](http://upload-images.jianshu.io/upload_images/13429147-b4d9489c6fd49ab6.gif)

image

### `v-model`

`render`函数中也没有与`v-model`相应的 API，如果要实现`v-model`类似的功能，同样需要使用原生 JavaScript 来实现。

```js
<div>
    <el-input : @input="val => name = val"></el-input>
</div>

Vue.component('el-input', {
    render: function (createElement) {
        var self = this
        return createElement('input', {
            domProps: {
                value: self.name
            },
            on: {
                input: function (event) {
                    self.$emit('input', event.target.value)
                }
            }
        })
    },
    props: {
        name: String
    }
})

let app = new Vue({
    el: '#app',
    data () {
        return {
            name: '大漠'
        }
    }
})
```

刷新你的浏览器，可以看到效果如下：

![](http://upload-images.jianshu.io/upload_images/13429147-a59263e3580b34ee.png)

image

这就是深入底层要付出的，尽管麻烦了一些，但相对于 `v-model` 来说，你可以更灵活地控制。

### 插槽

你可以从`this.$slots`获取 VNodes 列表中的静态内容：

```js
render: function (createElement) {
    
    return createElement('div', this.$slots.default)
}
```

还可以从`this.$scopedSlots`中获得能用作函数的作用域插槽，这个函数返回 VNodes:

```js
props: ['message'],
render: function (createElement) {
    
    return createElement('div', [
        this.$scopedSlots.default({
            text: this.message
        })
    ])
}
```

如果要用渲染函数向子组件中传递作用域插槽，可以利用 VNode 数据中的`scopedSlots`域：

```js
<div>
    <custom-ele></custom-ele>
</div>

Vue.component('custom-ele', {
    render: function (createElement) {
        return createElement('div', [
            createElement('child', {
                scopedSlots: {
                    default: function (props) {
                        return [
                            createElement('span', 'From Parent Component'),
                            createElement('span', props.text)
                        ]
                    }
                }
            })
        ])
    }
})

Vue.component('child', {
    render: function (createElement) {
        return createElement('strong', this.$scopedSlots.default({
            text: 'This is Child Component'
        }))
    }
})

let app = new Vue({
    el: '#app'
})
```

JSX
---

如果写习惯了`template`，然后要用`render`函数来写，一定会感觉好痛苦，特别是面对复杂的组件的时候。不过我们在 Vue 中使用 JSX 可以让我们回到更接近于模板的语法上。

```js
import AnchoredHeading from './AnchoredHeading.vue'

new Vue({
    el: '#demo',
    render: function (h) {
        return (
            <AnchoredHeading level={1}>
                <span>Hello</span> world!
            </AnchoredHeading>
        )
    }
})
```

> 将 `h` 作为 `createElement` 的别名是 Vue 生态系统中的一个通用惯例，实际上也是 JSX 所要求的，如果在作用域中 `h` 失去作用，在应用中会触发报错。

总结
--

回过头来看，Vue 中的渲染核心关键的几步流程还是非常清晰的：

*   `new Vue`，执行初始化
*   挂载`$mount`方法，通过自定义`render`方法、`template`、`el`等生成`render`函数
*   通过`Watcher`监听数据的变化
*   当数据发生变化时，`render`函数执行生成 VNode 对象
*   通过`patch`方法，对比新旧 VNode 对象，通过 DOM Diff 算法，添加、修改、删除真正的 DOM 元素

至此，整个`new Vue`的渲染过程完毕。

而这篇文章，主要把精力集中在`render`函数这一部分。学习了怎么用`render`函数来创建组件，以及了解了其中`createElement`。

最后要说的是，上文虽然以学习`render`函数，但文中涉及了 Vue 不少的知识点，也有点零乱。初学者自己根据自己获取所要的知识点。由于本人也是初涉 Vue 相关的知识点，如果文章中有不对之处，烦请路过的大神拍正。

原文地址 [www.jianshu.com](https://www.jianshu.com/p/7508d2a114d3)