---
layout: '[post]'
title: vue3学习
date: 2022-02-22 09:54:24
tags: Vue
---
>  原文地址 [juejin.cn](https://juejin.cn/post/7057325585705467918)*   Composition Api (最核心)

Vue3.0 新特性
----------
* v-model 更改
* v-for 的 key 节点上的使用情况更改
* v-if 和 v-for 对同一元素的优先级更高
* ref 内部 v-for 不再注册引用数组
* 功能组件只能使用普通函数创建
* 异步组件需要使用`defineAsyncComponent`创建方法
* 所有插槽都通过`$slots`
* 在`destroyed`生命周期的选项已更名为`unmounted`
* 在`beforeDestroy`生命周期的选项已更名为`beforeUnmount`
* ...

Vue3.0 优缺点
----------

**优点**：

1.  将 Vue 内部的绝大部分 api 对外暴露，使 Vue 具备开发大型项目的能力，例如 compile 编译 api 等
2.  webpack 的 treeshaking(tree shaking 是 DCE 的一种方式，它可以在打包时忽略没有用到的代码。) 支持度友好
3.  使用 Proxy 进行响应式变量定义，性能提高 1.2~2 倍
4.  ssr 快了 2~3 倍
5.  可在 Vue2.0 中单独使用 composition-api 插件，或者直接用它开发插件
6.  对 typescript 支持更加友好
7.  面向未来：对于尤雨溪最近创新的 vite 开发服务器（舍弃 webpack、底层为 Koa 框架的高性能开发服务器）, 直接使用的 Vue3.0 语法

**缺点**：

1.  vue3 将不再支持 IE11，Vue 在 2.X 版本仍然支持 IE11，如果你想使用类似 Vue 3 的新特性，可以等等 Vue 2.7 版本。这次的 RFC 宣布，将会对 2.7 版本做向后兼容，移植 3.x 的部分新功能，以保证两个版本之间相似的开发体验。
2.  对于习惯了 Vue2.0 开发模式的开发者来说，增加了心智负担，对开发者代码组织能力有体验

> 同时也是能力提升的机会吧，特别喜欢 Vue 作者的而设计初心：让开发者随着框架一起成长

体验 Vue3.0 的四种姿势
---------------

现在来说，体验 Vue3.0 有四种姿势 [传送门](https://link.juejin.cn?target=https%3A%2F%2Fv3.cn.vuejs.org%2Fguide%2Finstallation.html%23%25E5%258F%2591%25E5%25B8%2583%25E7%2589%2588%25E6%259C%25AC%25E8%25AF%25B4%25E6%2598%258E "https://v3.cn.vuejs.org/guide/installation.html#%E5%8F%91%E5%B8%83%E7%89%88%E6%9C%AC%E8%AF%B4%E6%98%8E")

*   通过 CDN:`<script src="https://unpkg.com/vue@next"></script>`

*   通过 [Codepen](https://link.juejin.cn?target=https%3A%2F%2Fcodepen.io%2Fyyx990803%2Fpen%2FOJNoaZL "https://codepen.io/yyx990803/pen/OJNoaZL") 的浏览器 playground

*   脚手架 [Vite](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fvitejs%2Fvite "https://github.com/vitejs/vite")：

    ```
    npm init vite-app hello-vue3 # OR yarn create vite-app hello-vue3
    复制代码
    
    ```


> 尤大开发的新工具，目的是以后取代 webpack，原来就是利用浏览器现在已经支持 ES6 的 import；遇到 import 会发送一个 http 请求去加载对应的文件，vite 拦截这些请求，做预编译，就省去了 webpack 冗长的打包事件，提升开发体验。

*   脚手架 [vue-cli](https://link.juejin.cn?target=https%3A%2F%2Fcli.vuejs.org%2F "https://cli.vuejs.org/")

    ```
    npm install -g @vue/cli # OR yarn global add @vue/cli
    vue create hello-vue3
    # select vue 3 preset
    复制代码
    
    ```


全局 API
------

新的全局 api：`createApp`

调用`createApp`返回一个应用实例，这是 Vue3.0 的新概念：

打开`src/main.js`

```js
import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App)
app.mount('#app')
复制代码

```

应用程序实例暴露当前全局 API 的子集，经验法则是，任何全局改变 Vue 行为的 API 现在都会移动到应用实例上 app 上，以下是当前全局 API 及其相应实例 API 的表：

<table><thead><tr><th>2.x 全局 API</th><th>3.x 实例 API (<code>app</code>)</th></tr></thead><tbody><tr><td>Vue.config</td><td>app.config</td></tr><tr><td>Vue.config.productionTip</td><td><em>removed</em> 已移除</td></tr><tr><td>Vue.config.ignoredElements</td><td>app.config.isCustomElement</td></tr><tr><td>Vue.component</td><td>app.component</td></tr><tr><td>Vue.directive</td><td>app.directive</td></tr><tr><td>Vue.mixin</td><td>app.mixin</td></tr><tr><td>Vue.use</td><td>app.use</td></tr></tbody></table>

composition API 学习
------------------

[官方网站](https://link.juejin.cn?target=https%3A%2F%2Fcomposition-api.vuejs.org%2Fzh%2Fapi.html "https://composition-api.vuejs.org/zh/api.html")

### [setup](https://link.juejin.cn?target=https%3A%2F%2Fcomposition-api.vuejs.org%2Fzh%2Fapi.html%23setup "https://composition-api.vuejs.org/zh/api.html#setup")

setup 函数是一个新的组件选项。作为组件内使用 Composition API 的入口点

创建组件实例，然后初始化 props，紧接着调用`setup`函数。它会在`beforeCreate`钩子之前调用。

setup 返回一个对象。则对象的所有属性 (**它是响应式的数据**) 都可以直接在模板中使用。相当于 vue2.0 中 data 函数返回的对象。

`App.vue`

```js
<script>
export default {
  setup () {
    return {}
  }
}
</script>
复制代码

```

### 响应式数据

*   ref：可传入任意类型的值并返回一个响应式且可改变的 ref 对象。ref 对象拥有一个指向内部值的单一属性`.value`, 改变值的时候必须使用其 value 属性
*   reactive: 接受一个普通对象然后返回该普通对象的响应式代理。等同于 2.x 的`Vue.obserable()`

> 简写之：reactive 负责复杂数据结构，ref 可以把基本的数据结构包装成响应式

#### reactive

```html
<template>
  <div>
    <h2>{{state.count}}</h2>
    <button @click="add">计算</button>
  </div>
</template>

<script>
import { reactive } from "vue";
export default {
  setup(){
    // 响应式变量声明 reactive负责复杂数据结构，
    const state = reactive({
      count: 1
    });
    function add() {
      state.count++;
    }
    return { state, add};
  }
};
</script>
复制代码

```

#### ref

```html
<template>
  <div>
    <h2>{{state.count}}</h2>
    <h3>{{num}}</h3>
    <button @click="add">计算</button>
  </div>
</template>
<script>
import { reactive, ref } from "vue";
export default {

  setup(){
    const state = reactive({
      count: 1
    });
    const num = ref(0);
    function add() {
      state.count++;
      num.value+=2
    }
    return { state, add, num };
  }
};
</script>
复制代码

```

ref 包装的 num, 模板里可以直接用，但 js 中修改的时候操作`.value`属性。

#### toRefs

将响应式对象转换为普通对象，其中结果对象的每个 property 都是指向原始对象相应的 property

从合成函数返回响应式对象时，toRefs 非常有用，这样消费组件就可以在不丢失响应式的情况下对返回的对象进行分解 / 扩散:

`useFeatureX.js`

```js
import {reactive} from 'vue';
export function userFeatureX(){
  const state = reactive({
    foo: 1,
    bar: 2
  })

  // 逻辑运行状态

  // 返回时转换为ref
  return state;
}
复制代码

```

`App.vue`

```js
import {toRefs} from 'vue'
export default {
  setup(){
    const state = useFeatureX();
    return {
      ...toRefs(state)
    }
  }
}
复制代码

```

#### computed

传入一个 getter 函数，返回一个默认不可手动修改的 ref 对象。

```js
import { reactive, ref, computed } from "vue";
export default {

  setup() {
    // 1.响应式变量声明 reactive负责复杂数据结构，
    const state = reactive({
      count: 1
    });
    // 2.ref可以把基本的数据结构包装成响应式
    const num = ref(0);
    // 3.创建只读的计算属性
    const computedEven1 = computed(() => state.count % 2);
    // 4.创建可读可写的计算属性
    const computedEven2 = computed({
      get:()=>{
        return state.count % 2;
      },
      set: newVal=>{
        state.count = newVal;
      }
    })

    // 事件的声明
    function add() {
      state.count++;
      num.value += 2;
    }

    function handleClick() {
      computedEven2.value = 10;
    }



    return { state, add, num, computedEven1,computedEven2,handleClick };
  }
};
复制代码

```

#### watchEffect

立即执行传入的一个函数，并响应式追踪其依赖，并在其依赖变更时重新运行该函数。

```js
const num = ref(0)

watchEffect(() => console.log(count.value))
// -> 打印出 0

setTimeout(() => {
  count.value++
  // -> 打印出 1
}, 100)
复制代码

```

1.  停止监听

    **隐式停止**

    当 `watchEffect` 在组件的 `setup()` 函数或生命周期钩子被调用时， 侦听器会被链接到该组件的生命周期，并在组件卸载时自动停止

    **显示停止**

    在一些情况下，也可以显示调用返回值来停止侦听

    ```
    const stop = watchEffect(()=>{
      /*...*/
    })
    //停止侦听
    stop()
    复制代码
    
    ```

2.  清除副作用

    有时候副作用函数会执行一些异步的副作用，这些响应需要在其失效时来清除 (即完成之前状态已改变了)。可以在侦听副作用传入的函数中接受一个`onInvalidate`函数作为参数，用来注册清理失效时的回调。当以下情况发生时，这个**失效回调**会被触发：

    *   副作用即将重新执行时
    *   侦听器被停止 (如果在`setup()`或生命周期钩子函数中使用了`watchEffect`, 则在卸载组件时)

    官网的例子：

    ```
    watchEffect((onInvalidate) => {
      const token = performAsyncOperation(id.value)
      onInvalidate(() => {
        // id 改变时 或 停止侦听时
        // 取消之前的异步操作
        token.cancel()
      })
    })
    复制代码
    
    ```


案例：实现对用户输入 “防抖” 效果

```html
<template>
  <div>
    <input type="text"
           v-model="keyword">
  </div>
</template>

<script>
  import { ref, watchEffect } from 'vue'

  export default {
    setup() {
      const keyword = ref('')
      const asyncPrint = val => {
        return setTimeout(() => {
          console.log('user input: ', val)
        }, 1000)
      }
      watchEffect(
        onInvalidate => {
          //用户输入的时间间隔小于1秒，都会立刻清除掉定时，不输入结果。正因为这个，实现了用户防抖的功能，只在用户输入时间间隔大于1秒，才做打印
          const timer = asyncPrint(keyword.value)
          onInvalidate(() => clearTimeout(timer))
          console.log('keyword change: ', keyword.value)
        },
        // flush: 'pre'  watch() 和 watchEffect() 在 DOM 挂载或更新之前运行副作用，所以当侦听器运行时，模板引用还未被更新。
        //flush: 'post' 选项来定义，这将在 DOM 更新后运行副作用，确保模板引用与 DOM 保持同步，并引用正确的元素。
        {
          flush: 'post' // 默认'pre'，同步'sync'，'pre'组件更新之前
        }
      )

      return {
        keyword
      }
    }
  }
  // 实现对用户输入“防抖”效果
</script>
复制代码

```

#### watch

`watch` API 完全等效于 2.x `this.$watch` （以及 `watch` 中相应的选项）。`watch` 需要侦听特定的数据源，并在回调函数中执行副作用。默认情况是懒执行的，也就是说仅在侦听的源变更时才执行回调。

watch() 接收的第一个参数被称作 "数据源", 它可以是：

*   一个返回任意值的 getter 函数
*   一个包装对象 (可以是 ref 也可以是 reactive 包装的对象)
*   一个包含上述两种数据源的数组

第二个参数是回调函数。回调函数只有当数据源发生变动时才会被触发：

1.  侦听单个数据源

    ```js
    const state = reactive({count: 1});
    
    //侦听一个reactive定义的数据,修改count值时会触发 watch的回调
    watch(()=>state.count,(newCount,oldCount)=>{
      console.log('newCount:',newCount);  
      console.log('oldCount:',oldCount);
    })
    //侦听一个ref
    const num = ref(0);
    watch(num,(newNum,oldNum)=>{
      console.log('newNum:',newNum);  
      console.log('oldNum:',oldNum);
    })
    复制代码
    
    ```

2.  侦听多个数据源 (数组)

    ```js
    const state = reactive({count: 1});
    const num = ref(0);
    // 监听一个数组
    watch([()=>state.count,num],([newCount,newNum],[oldCount,oldNum])=>{
      console.log('new:',newCount,newNum);
      console.log('old:',oldCount,oldNum);
    })
    复制代码
    
    ```

3.  侦听复杂的嵌套对象

    我们实际开发中，复杂数据随处可见， 比如：

    ```js
    const state = reactive({
      person: {
        name: '张三',
        fav: ['帅哥','美女','音乐']
      },
    });
    watch(
      () => state.person,
      (newType, oldType) => {
        console.log("新值:", newType, "老值:", oldType);
      },
      { deep: true }, // 立即监听
    );
    复制代码
    
    ```


> 如果不使用第三个参数`deep:true`， 是无法监听到数据变化的。 前面我们提到，**默认情况下，watch 是惰性的**, 那什么情况下不是惰性的， 可以立即执行回调函数呢？其实使用也很简单， 给第三个参数中设置`immediate: true`即可
>
> 同时，watch 和 watchEffect 在停止侦听，清除副作用 (相应地 onInvalidate 会作为回调的第三个参数传入) 等方面行为一致。

```html
<template>
  <div>
    <input type="text"
      v-model="keyword">
  </div>
</template>

<script>
import { ref, watch } from 'vue'

export default {
  setup() {
    const keyword = ref('')
    const asyncPrint = val => {
      return setTimeout(() => {
        console.log('user input: ', val)
      })
    }

    watch(
      keyword,
      (newVal, oldVal, onCleanUp) => {
        const timer = asyncPrint(keyword)
        onCleanUp(() => clearTimeout(timer))
      },
      {
        lazy: true // 默认false，即初始监听回调函数执行了
      }
    )
    return {
      keyword
    }
  }
}
</script>
复制代码

```

### 生命周期钩子

与 2.x 版本生命周期相对应的组合式 API

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/957656d7fef647f9ac1fc2d034fd5259~tplv-k3u1fbpfcp-watermark.awebp?)

新建测试组件`/components/Test.vue`

```html
<template>
  <div id="test">
    <h3>{{a}}</h3>
    <button @click="handleClick">更改</button>
  </div>
</template>

<script>
import {
  ref,
  onMounted,
  onBeforeMount,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
} from "vue";
export default {
  // 初始化数据阶段的生命周期，介于beforeCreate和created之间
  setup() {
    const a = ref(0);
    console.log("👌");
    function handleClick() {
      a.value += 1;
    }
    onBeforeMount(() => {
      console.log("组件挂载之前");
    });
    onMounted(() => {
      console.log("DOM挂载完成");
    });
    onBeforeUpdate(() => {
      console.log("DOM更新之前", document.getElementById("test").innerHTML);
    });
    onUpdated(() => {
      console.log("DOM更新完成", document.getElementById("test").innerHTML);
    });
    onBeforeUnmount(() => {
      console.log("实例卸载之前");
    });
    onUnmounted(() => {
      console.log("实例卸载之后");
    });
    return { a, handleClick };
  }
};
</script>
复制代码

```

按照官方上说的那样，你不需要立马弄明白所有的东西，不过随着你的不断学习和使用，它的参考价值会越来越高。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8302e34e27544c99a04209a0a3ddec12~tplv-k3u1fbpfcp-watermark.awebp)

### 依赖注入

`provide`和`inject`提供依赖注入，功能类似 2.x 的`provide/inject`。两者都只能在当前组件的`setup()`中调用

`App.vue`provide 数据源

```html
<template>
  <div>
    <Article></Article>
  </div>
</template>

<script>
import {
  ref,
  provide
} from "vue";
import Article from "./components/Article";
export default {
  setup() {
    const articleList = ref([
      { id: 1, title: "Vue3.0学习", author: "小马哥" },
      { id: 2, title: "componsition api", author: "尤大大" },
      { id: 3, title: "Vue-router最新", author: "vue官方" }
    ]);
    /* 
      provide 函数允许你通过两个参数定义 property：
      property 的 name (<String> 类型)
      property 的 value
    */
    provide("list",articleList);
    return {
      articleList
    };
  },
  components: {
    Article
  }
};
</script>
复制代码

```

`Article.vue`注入数据

```html
<template>
  <div>
    {{articleList[0].title}}
  </div>
</template>

<script>
import { inject } from "vue";
export default {
  setup() {
    const articleList = inject('list',[]);
    return {articleList};
  },
};
</script>
复制代码

```

### 模板引用 refs

当使用组合式 API 时，`reactive refs`和`template refs`的概念已经是统一了。为了获得对模板内元素或者组件实例的引用，可以直接在`setup()`中声明一个 ref 并返回它

```html
<template>
  <div>
    <div ref='wrap'>hello vue3.0</div>
    <Article ref='articleComp'></Article>
  </div>
</template>

<script>
import {
  ref,
  onMounted,
  provide
} from "vue";
import Article from "./components/Article";
export default {
  setup() {
    const isShow = ref(true);
    const wrap = ref(null);
    const articleComp = ref(null);

    const articleList = ref([
      { id: 1, title: "Vue3.0学习", author: "小马哥" },
      { id: 2, title: "componsition api", author: "尤大大" },
      { id: 3, title: "Vue-router最新", author: "vue官方" }
    ]);
    /* 
      provide 函数允许你通过两个参数定义 property：
      property 的 name (<String> 类型)
      property 的 value
    */
    provide("list", articleList);

    onMounted(() => {
      console.log(wrap.value); //获取div元素
      console.log(articleComp.value); //获取的article组件实例对象
      
    });
    return {
      articleList,
      wrap,
      articleComp
    };
  },
  components: {

    Article
  }
};
</script>

<style scoped>
</style>
复制代码

```

效果图：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2cf8bd35760842a9b4662cb67e8cceec~tplv-k3u1fbpfcp-watermark.awebp)

### 组件通信

*   props
*   $emit
*   expose /ref
*   attrs
*   v-model
*   provide/inject
*   vuex
*   mitt

#### props

```
// Parent.vue 传送
<child :msg1="msg1" :msg2="msg2"></child>
<script>
import child from "./child.vue"
import { ref, reactive } from "vue"
export default {
    setup(){
        // 创建一个响应式数据
        const msg1 = ref("这是传级子组件的信息1")
        const msg2 = reactive(["这是传级子组件的信息2"])
        return {
            msg1
            msg2
        }
    }
}
</script>

// Child.vue 接收
<script>
export default {
  props: ["msg1", "msg2"],// 如果这行不写，下面就接收不到
  setup(props) {
    console.log(props) // { msg1:"这是传给子组件的信息1", msg2:"这是传给子组件的信息2" }
  },
}
</script>
复制代码

```

#### $emit

```html
// Child.vue 派发
<template>
  // 写法一
  <button @click="$emit('myClick',123)">按钮</buttom>
</template>
<script> 
 export default {
	emits:['myClick']
	//emits:{
  //myClick:null
  //}
}

</script>

// Parent.vue 响应
<template>
    <child @myClick="onMyClick"></child>
</template>
<script setup>
  import child from "./child.vue"
const onMyClick = (msg) => {
  console.log(msg) // 这是父组件收到的信息 123
}
</script>
复制代码

```

重大改变
----

### Teleport

Teleport 就像是哆啦 A 梦中的「任意门」，任意门的作用就是可以将人瞬间传送到另一个地方。有了这个认识，我们再来看一下为什么需要用到 Teleport 的特性呢，看一个小例子： 在子组件`Header`中使用到`Dialog`组件，我们实际开发中经常会在类似的情形下使用到 `Dialog` ，此时`Dialog`就被渲染到一层层子组件内部，处理嵌套组件的定位、`z-index`和样式都变得困难。 `Dialog`从用户感知的层面，应该是一个独立的组件，从 dom 结构应该完全剥离 Vue 顶层组件挂载的 DOM；同时还可以使用到 Vue 组件内的状态（`data`或者`props`）的值。简单来说就是, **即希望继续在组件内部使用`Dialog`, 又希望渲染的 DOM 结构不嵌套在组件的 DOM 中**。 此时就需要 Teleport 上场，我们可以用`<Teleport>`包裹`Dialog`, 此时就建立了一个传送门，可以将`Dialog`渲染的内容传送到任何指定的地方。 接下来就举个小例子，看看 Teleport 的使用方式。

我们希望 Dialog 渲染的 dom 和顶层组件是兄弟节点关系, 在`index.html`文件中定义一个供挂载的元素:

```html
<body>
  <div id="app"></div>
  <div id="dialog"></div>
</body>
复制代码

```

定义一个`Dialog`组件`Dialog.vue`, 留意 `to` 属性， 与上面的`id`选择器一致：

```html
<template>
  <teleport to="#dialog">
    <!-- 即希望继续在组件内部使用Dialog, 又希望渲染的 DOM 结构不嵌套在组件的 DOM 中。 此时就需要 Teleport 上场，
      我们可以用<Teleport>包裹Dialog, 此时就建立了一个传送门，可以将Dialog渲染的内容传送到任何指定的地方 -->
    <div class="dialog">
      <div class="dialog_wrapper">
        <div class="dialog_header">
          <h3>我是弹框 {{ count }}</h3>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script>
import { reactive, toRefs } from 'vue'

export default {
  setup() {
    const state = reactive({
      count: 0,
    })

    return {
      ...toRefs(state),
    }
  },
}
</script>

<style lang="less" scoped></style>

复制代码

```

### Suspense

> 试验性
>
> Suspense 是一个试验性的新特性，其 API 可能随时会发生变动。特此声明，以便社区能够为当前的实现提供反馈。
>
> 生产环境请勿使用

该 `<suspense>` 组件提供了另一个方案，允许将等待过程提升到组件树中处理，而不是在单个组件中。

自带两个 `slot` 分别为 `default、fallback`。顾名思义，当要加载的组件不满足状态时,`Suspense` 将回退到 `fallback`状态一直到加载的组件满足条件，才会进行渲染。

Suspense.vue

```html
<template>
  <button @click="loadAsyncComponent">点击加载异步组件</button>
  <Suspense v-if="loadAsync">
    <template #default>
      <!-- 加载对应的组件 -->
      <MAsynComp></MAsynComp>
    </template>
    <template #fallback>
      <div class="loading"></div>
    </template>
  </Suspense>
</template>

<script>
import { ref, defineAsyncComponent } from 'vue'

export default {
  components: {
    MAsynComp: defineAsyncComponent(() => import('./AsynComp.vue')),
  },
  setup() {
    const loadAsync = ref(false)
    const loadAsyncComponent = () => {
      loadAsync.value = true
    }
    return {
      loadAsync,
      loadAsyncComponent,
    }
  },
}
</script>

<style lang="less" scoped>

button {
  padding: 12px 12px;
  background-color: #1890ff;
  outline: none;
  border: none;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
}
.loading {
  position: absolute;
  width: 36px;
  height: 36px;
  top: 50%;
  left: 50%;
  margin: -18px 0 0 -18px;
  background-image: url('../assets/loading.png');
  background-size: 100%;
  animation: rotate 1.4s linear infinite;
}
@keyframes rotate {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>

复制代码

```

AsynComp.vue

```html
<template>
  <h1>this is async component</h1>
</template>

<script>
import { setup } from 'vue'
export default {
  name: 'AsyncComponent',
  async setup() {
    const sleep = (time) => {
      return new Promise((reslove, reject) => {
        setTimeout(() => {
          reslove()
        }, time)
      })
    }
    await sleep(3000) //模拟数据请求
  },
}
</script>

复制代码

```

Fragments

Vue3.0 组件中可以允许有多个根组件，避免了多个没必要的 div 渲染

```html
<template>
  <div>头部</div>
  <div>内容</div>
</template>
复制代码

```

这样做的好处：

*   少了很多没有意义的 div
*   可以实现平级递归，对实现 tree 组件有很大帮助

### emits

*   emits 可以是数组或对象
*   触发自定义事件
*   如果 emits 是对象，则允许我们配置和事件验证。验证函数应返回布尔值，以表示事件参数是否有效。

`Emits.vue`

```html
<template>
<div>
  <button @click="$emit('submit',{username:'xiaomage',password:'123'})">自定义事件</button>
  </div>
</template>

<script>
  export default {
    // emits:['submit'],//可以是数组
    emits: {
      submit: payload => {
        if(payload.username && payload.password){
          return true;
        }else{
          console.warn('无效的payload，请检查submit事件');
          return false
        }
      }
    },
    setup() {
      return {};
    }
  };
</script>

<style scoped>
</style>
复制代码

```

`App.vue`

```html
<Emits @submit="submitHandle"></Emits>
<script>
  import Emits from "./components/Emits";
  export default{
    components:{
      Emits
    },
    setup(){
      function submitHandle(payload) {
        console.warn("自定义事件触发",payload);
      }
      return {

      }
    }
  }

</script>
复制代码

```

效果展示：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dfe623b08b244da7bf5f37b0864e2490~tplv-k3u1fbpfcp-watermark.awebp)

### 全局 Vue API 更改为应用程序实例

上面已经讲过了，不做一一赘述了。

### API 可做 Tree shakable 优化

在 vue2.0 有不少的全局 api 是作为静态函数直接挂在在 Vue 构造函数上的，你应该手动操作过 DOM, 会遇到如下模式。如果我们未是在代码中用过它们，就会形成我们所谓的 "死代码", 这类全局 api 造成的 "死代码" 无法使用 webapck 的`tree-shaking`进行'死代码消除'。

```js
import Vue from 'vue'
Vue.nextTick(()=>{
  //一些和DOM相关的东西
})
复制代码

```

因此，vue3.0 做了相应的改变，将它们抽离成为独立的函数，这样打包工具的摇树优化可以将这些 "死代码" 排除掉。全局 API 现在只能作为 ES 模块构建的命名导出进行访问。例如，我们之前的片段现在应该如下所示

```js
import {nextTick} from 'vue'
nextTick(()=>{
  //一些和DOM相关的东西
})
复制代码

```

受影响的 API

Vue2.x 中这些全局 API 受此更改的影响：

*   Vue.nextTick
*   Vue.observable(用 Vue.reactive 替换)
*   Vue.version
*   Vue.compile(仅完全构建时)
*   Vue.set(仅兼容版本)
*   Vue.delete(仅兼容版本)

`TreeShaking.vue`

```html
<template>
<div >
  <hr />摇树优化，把没引入的不必要的代码进行优化
  <div id='name'>小马哥</div>
  <h3 ref='myMsg'>{{msg}}</h3>
  <button @click="changeMsg('hai!')">改变</button>
  </div>
</template>

<script>
  import { ref, nextTick } from "vue";
  export default {
    setup() {
      const msg = ref("hello!");
      const myMsg = ref(null);
      async function changeMsg(newV) {
        msg.value = newV;
        // console.log(myMsg.value.innerText); //直接获取DOM还是以前的
        // nextTick返回了promise对象
        await nextTick();
        console.log(myMsg.value.innerText);
      }
      return {
        msg,
        myMsg,
        changeMsg
      };
    }
  };
</script>
复制代码

```

### Slot 具名插槽语法

在 Vue2.x 中， 具名插槽的写法：

```html
<!--  子组件中：-->
<slot ></slot>
复制代码

```

在父组件中使用：

```html
<template slot="title">
    <h1>歌曲：《孤勇者》</h1>
<template>
复制代码

```

如果我们要**在 slot 上面绑定数据，可以使用作用域插槽**，实现如下：

```
// 子组件
<slot ></slot>
export default {
    data(){
        return{
            data:["走过来人来人往","不喜欢也得欣赏","陪伴是最长情的告白"]
        }
    }
}
复制代码

```

```html
<!-- 父组件中使用 -->
<template slot="content" slot-scope="scoped">
    <div v-for="item in scoped.data">{{item}}</div>
<template>
复制代码

```

在 Vue2.x 中具名插槽和作用域插槽分别使用`slot`和`slot-scope`来实现， 在 Vue3.0 中将`slot`和`slot-scope`进行了合并同意使用。 Vue3.0 中`v-slot`：

```html
<!-- 父组件中使用 -->
 <template v-slot:content="scoped">
   <div v-for="item in scoped.data">{{item}}</div>
</template>

<!-- 也可以简写成： -->
<template #content="{data}">
    <div v-for="item in data">{{item}}</div>
</template>
复制代码

```

### 组件上 v-model 用法

在 Vue 2.0 发布后，开发者使用 `v-model` 指令必须使用为 `value` 的 prop。如果开发者出于不同的目的需要使用其他的 prop，他们就不得不使用 `v-bind.sync`。此外，由于`v-model` 和 `value` 之间的这种硬编码关系的原因，产生了如何处理原生元素和自定义元素的问题。

在 Vue 2.2 中，我们引入了 `model` 组件选项，允许组件自定义用于 `v-model` 的 prop 和事件。但是，这仍然只允许在组件上使用一个 `model`。

在 Vue 3 中，双向数据绑定的 API 已经标准化，减少了开发者在使用 `v-model` 指令时的混淆并且在使用 `v-model` 指令时可以更加灵活。

**2.x 语法**

在 2.x 中，在组件上使用 `v-model` 相当于绑定 `value` prop 和 `input` 事件：

```html
<ChildComponent v-model="pageTitle" />

<!-- 简写: -->

<ChildComponent :value="pageTitle" @input="pageTitle = $event" />
复制代码

```

如果要将属性或事件名称更改为其他名称，则需要在 `ChildComponent` 组件中添加 `model` 选项：

```html
<!-- ParentComponent.vue -->

<ChildComponent v-model="pageTitle" />
复制代码

```

```js
// ChildComponent.vue

export default {
  model: {
    prop: 'title',
    event: 'change'
  },
  props: {
    // 这将允许 `value` 属性用于其他用途
    value: String,
    // 使用 `title` 代替 `value` 作为 model 的 prop
    title: {
      type: String,
      default: 'Default title'
    }
  }
}
复制代码

```

所以，在这个例子中 `v-model` 的简写如下：

```html
<ChildComponent :title="pageTitle" @change="pageTitle = $event" />
复制代码

```

**使用 `v-bind.sync`**

在某些情况下，我们可能需要对某一个 prop 进行 “双向绑定”(除了前面用 `v-model` 绑定 prop 的情况)。为此，我们建议使用 `update:myPropName` 抛出事件。例如，对于在上一个示例中带有 `title` prop 的 `ChildComponent`，我们可以通过下面的方式将分配新 value 的意图传达给父级：

```
this.$emit('update:title', newValue)
复制代码

```

如果需要的话，父级可以监听该事件并更新本地 data property。例如：

```html
<ChildComponent :title="pageTitle" @update:title="pageTitle = $event" />
复制代码

```

为了方便起见，我们可以使用 `.sync` 修饰符来缩写，如下所示：

```html
<ChildComponent :title.sync="pageTitle" />
复制代码

```

**3.x 语法**

在 3.x 中，自定义组件上的 `v-model` 相当于传递了 `modelValue` prop 并接收抛出的 `update:modelValue` 事件：

```html
<ChildComponent v-model="pageTitle" />

<!-- 简写: -->

<ChildComponent
  :modelValue="pageTitle"
  @update:modelValue="pageTitle = $event"
/>
复制代码

```

### 渲染函数 API 改变

*   `h`现在全局导入，而不是作为参数传递给渲染函数
*   渲染函数参数更为在有状态组件和函数组件之间更加一致
*   vnode 现在是一个有扁平的 prop 结构

`render`函数将自动接收`h`函数 (它是 createElement 的别名) 作为参数

```js
//vue2.x
export default{
  render(h){
    return h('div')
  }
}
//vue3 渲染
import { h } from 'vue'

export default {
  render() {
    return h('div')
  }
}
复制代码

```

举个例子：

```html
<template>
  <div>
    <RenderComp v-model='title'>
      <template v-slot:default>
        <!-- 默认插槽 -->
        头部
      </template>
      <template v-slot:content>
        <!-- 具名插槽 -->
        内容
      </template>
  </RenderComp>
  </div>
</template>
<script>
  import {
    ref,
    h
  } from "vue";
  export default {
    components: {
      RenderComp: {
        props: {
          modelValue: {
            type: String,
            default: ''
          },
        },
        setup(props,{attrs,slots,emit}) {
          // 以前得通过$scopedSlots获取对应的插槽
          console.log(slots.default()); //获取默认插槽
          console.log(slots.content()); //获取名字为content的插槽
          function changeTitle(newV) {
            emit('update:modelValue','哈哈哈');
          }
          return () => h("div", {}, [h("div", {
            onClick:changeTitle,
          },[
            `渲染函数api:${props.modelValue}`,
            slots.default(),
            slots.content()
          ])]);
        }
      }
    },
    setup(props) {
      const title = ref("双向数据绑定");
      return {
        title
      };
    }
  };
</script>

复制代码

```

同时，演示了`$scopedSlots`property 已删除，所有插槽都通过`$slots`作为函数暴露

### 使用普通函数创建功能组件

*   在 3.x 中，功能性组件 2.x 的性能提升可以忽略不计，因此我们建议只使用有状态的组件
*   功能组件只能使用接收 `props` 和 `context` 的普通函数创建 (即：`slots`，`attrs`，`emit`)。
*   **重大变更：**`functional` attribute 在单文件组件 (SFC) `<template>` **已被移除**
*   **重大变更：**`{ functional: true }` 选项在通过函数创建组件已**被移除**

在 vue2.0 中，功能组件有两个主要用途：

*   性能优化提高，因为它们的初始化速度比有状态组件快
*   可以返回多个根节点

然而，在 Vue 3 中，有状态组件的性能已经提高到可以忽略不计的程度。此外，有状态组件现在还包括返回多个根节点的能力。

因此，功能组件剩下的唯一用例就是简单组件，比如创建动态标题的组件。否则，建议你像平常一样使用有状态组件。

> 总结：非特殊情况下，官网还是建议我们使用有状态的组件

`Functional.vue`

```js
import { h } from 'vue'

const DynamicHeading = (props, context) => {
  return h(`h${props.level}`, context.attrs, context.slots)
}

DynamicHeading.props = ['level']

export default DynamicHeading
复制代码

```

```html
<Functional level='3'>动态标题</Functional>
复制代码

```

可以传入不同的 level 定制不同的 h 系列标题。

### 异步组件的更改

*   新`defineAsyncComponent`助手方法，它显示定义异步组件
*   `componnet`选项命名为`loader`
*   加载程序函数被本身不接受`resolve`和`reject`参数，必须返回一个 Promise

**2.x**

以前，异步组件是通过将组件定义为返回 promise 的函数来创建的，例如：

```
const asyncPage = () => import('./NextPage.vue')
复制代码

```

对于带有选项的更高阶组件语法：

```js
const asyncPage = {
  component: () => import('./NextPage.vue'),
  delay: 200,
  timeout: 3000,
  error: ErrorComponent,
  loading: LoadingComponent
}
复制代码

```

**3.x**

在 vue3 中，由于功能组件被定义为纯函数，因为需要通过将异步组件定义包装在新的`defineAsyncComponent`助手来显式定义组件

```js
import { defineAsyncComponent } from 'vue'
import ErrorComponent from './components/ErrorComponent.vue'
import LoadingComponent from './components/LoadingComponent.vue'

// 不带选项的异步组件
const asyncPage = defineAsyncComponent(() => import('./NextPage.vue'))

// 带选项的异步组件
const asyncPageWithOptions = defineAsyncComponent({
  loader: () => import('./NextPage.vue'),
  delay: 200,
  timeout: 3000,
  errorComponent: ErrorComponent,
  loadingComponent: LoadingComponent
})
复制代码

```

### 自定义指令

API 已重命名，以便更好地与组件生命周期保持一致

*   bind → **beforeMount**
*   inserted → **mounted**
*   **beforeUpdate**: 新的！这是在元素本身更新之前调用的，很像组件生命周期钩子
*   update → 移除！有太多的相似之处要更新，所以这是多余的，请改用 `updated`
*   componentUpdated → **updated**
*   **beforeUnmount ** `新的`与组件生命周期钩子类似，它将在卸载元素之前调用。
*   unbind -> **unmounted**

举个例子：

`main.js`

```js
const app = createApp(App);
// 创建自定义指令
app.directive('highlight',{
  // 指令 也拥有一组生命周期钩子
  // 1.在绑定元素的父组件挂载之前调用
  beforeMount(el,binding,vnode){
    el.style.background = binding.value;
  },
})
复制代码

```

`App.vue`

```html
<p v-highlight="'red'">自定义指令</p>
复制代码

```

### 动画 transion 改变

*   v-enter->v-enter-from
*   v-leave->v-leave-from

vue2.x 版本中

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5cd72aee50d14c1c90f163e8271f4afe~tplv-k3u1fbpfcp-watermark.awebp)

### 移除 API

*   [`keyCode` 支持作为 `v-on` 的修饰符](https://link.juejin.cn?target=https%3A%2F%2Fwww.vue3js.cn%2Fdocs%2Fzh%2Fguide%2Fmigration%2Fkeycode-modifiers.html "https://www.vue3js.cn/docs/zh/guide/migration/keycode-modifiers.html")
*   [on，off 和 $once 实例方法](https://link.juejin.cn?target=https%3A%2F%2Fwww.vue3js.cn%2Fdocs%2Fzh%2Fguide%2Fmigration%2Fevents-api.html "https://www.vue3js.cn/docs/zh/guide/migration/events-api.html")
*   [过滤](https://link.juejin.cn?target=https%3A%2F%2Fwww.vue3js.cn%2Fdocs%2Fzh%2Fguide%2Fmigration%2Ffilters.html "https://www.vue3js.cn/docs/zh/guide/migration/filters.html")

2.x, 支持`keyCodes`作为修改`v-on`方法的方法

```html
<!-- 键码版本 -->
<input v-on:keyup.13="submit" />

<!-- 别名版本 -->
<input v-on:keyup.enter="submit" />
复制代码

```

vue3.x

在建议对任何要用作修饰符的键使用 kebab-cased (短横线) 大小写名称。

```html
<!-- Vue 3 在 v-on 上使用 按键修饰符 -->
<input v-on:keyup.delete="confirmDelete" />
复制代码

```

因此，这意味着 `config.keyCodes` 现在也已弃用，不再受支持。

`$on`，`$off` 和 `$once` 实例方法已被移除，应用实例不再实现事件触发接口。

Filters 已从 Vue 3.0 中删除，不再受支持。相反，我们建议用方法调用或计算属性替换它们。