---
layout: '[post]'
title: Vuex
date: 2019-12-06 21:29:06
tags: Vue
---
## Vuex是什么？
VueX 是一个专门为 Vue.js 应用设计的状态管理架构，统一管理和维护各个vue组件的可变化状态(你可以理解成 vue 组件里的某些 data )。

Vue有五个核心概念：
 - state：基本数据
 - getters：从基本数据派生的数据 
 - mutations：提交更改数据的方法，同步！ 
 - actions：像一个装饰器，包裹mutations，使之可以异步。 
 - modules：模块化Vuex
<!-- more -->

## State
state即Vuex中的基本数据
### 单一状态树
Vuex使用单一状态树，即用一个对象就包含了全部的状态数据。state作为构造器选项，定义了所有我们需要的基本状态参数。
### 在Vue组件中获得Vuex属性
我们可以通过Vue的Computed获得Vuex的state，如下：

```js
const store = new Vuex.Store({
    state: {
        count:0
    }
})
const app = new Vue({
    //..
    store,
    computed: {
        count: function(){
            return this.$store.state.count
        }
    },
    //..
})

```
每当 store.state.count 变化的时候, 都会重新求取计算属性，并且触发更新相关联的 DOM。
### mapState辅助函数
当一个组件需要获取多个状态时候，将这些状态都声明为计算属性会有些重复和冗余。为了解决这个问题，我们可以使用 mapState 辅助函数帮助我们生成计算属性，让你少按几次键。

```js
// 在单独构建的版本中辅助函数为 Vuex.mapState
import { mapState } from 'vuex'

export default {
  // ...
  computed: mapState({
    // 箭头函数可使代码更简练
    count: state => state.count,

    // 传字符串参数 'count' 等同于 `state => state.count`
    countAlias: 'count',

    // 为了能够使用 `this` 获取局部状态，必须使用常规函数
    countPlusLocalState (state) {
      return state.count + this.localCount
    }
  })
}
```
当映射的计算属性的名称与 state 的子节点名称相同时，我们也可以给 mapState 传一个字符串数组。

```js
computed: mapState([
  // 映射 this.count 为 store.state.count
  'count'
])
```
### 对象展开运算符
mapState 函数返回的是一个对象。我们如何将它与局部计算属性混合使用呢？通常，我们需要使用一个工具函数将多个对象合并为一个，以使我们可以将最终对象传给 computed 属性。但是自从有了对象展开运算符，我们可以极大地简化写法：

```js
computed: {
  localComputed () //本地计算属性
  //使用对象展开运算符将此对象混入到外部对象中
  ...mapState({
    //..
  })
}
```
... 展开运算符（spread operator）允许一个表达式在某处展开。展开运算符在多个参数（用于函数调用）或多个元素（用于数组字面量）或者多个变量（用于解构赋值）的地方可以使用。

展开运算符不能用在对象当中，因为目前展开运算符只能在可遍历对象（iterables）可用。iterables的实现是依靠[Symbol.iterator]函数，而目前只有Array,Set,String内置[Symbol.iterator]方法，而Object尚未内置该方法，因此无法使用展开运算符。不过ES7草案当中已经加入了对象展开运算符特性。
## getters
即从store的state中派生出的状态。

getters接收state作为其第一个参数，接受其他 getters 作为第二个参数，如不需要，第二个参数可以省略如下例子：

```js
const store = new Vuex.Store({
    state: {
        count:0
    }，
    getters: {
        // 单个参数
        countDouble: function(state){
            return state.count * 2
        },
        // 两个参数
        countDoubleAndDouble: function(state, getters) {
            return getters.countDouble * 2
        }
    }
})

```
与state一样，我们也可以通过Vue的Computed获得Vuex的getters。

```js
const app = new Vue({
    //..
    store,
    computed: {
        count: function(){
            return this.$store.state.count
        },
        countDouble: function(){
            return this.$store.getters.countDouble
        },
        countDoubleAndDouble: function(){
            return this.$store.getters.countDoubleAndDouble
        }
    },
    //..
})
```
### mapGetters 辅助函数
mapGetters 辅助函数仅仅是将 store 中的 getters 映射到局部计算属性，与state类似

```js
import { mapGetters } from 'vuex'

export default {
  // ...
  computed: {
  // 使用对象展开运算符将 getters 混入 computed 对象中
    ...mapGetters([
      'countDouble',
      'CountDoubleAndDouble',
      //..
    ])
  }
}

```
如果你想将一个 getter 属性另取一个名字，使用对象形式：

```js
mapGetters({
  // 映射 this.double 为 store.getters.countDouble
  double: 'countDouble'
})
```
## mutations
提交mutation是更改Vuex中的store中的状态的唯一方法。

mutation必须是同步的，如果要异步需要使用action。

每个 mutation 都有一个字符串的 事件类型 (type) 和 一个 回调函数 (handler)。这个回调函数就是我们实际进行状态更改的地方，并且它会接受 state 作为第一个参数，提交载荷作为第二个参数。（提交荷载在大多数情况下应该是一个对象）,提交荷载也可以省略的。

```js
const store = new Vuex.Store({
  state: {
    count: 1
  },
  mutations: {
    //无提交荷载
    increment(state) {
        state.count++
    }
    //提交荷载
    incrementN(state, obj) {
      state.count += obj.n
    }
  }
})
```
你不能直接调用一个 mutation handler。这个选项更像是事件注册：“当触发一个类型为 increment 的 mutation 时，调用此函数。”要唤醒一个 mutation handler，你需要以相应的 type 调用 store.commit 方法：

```js
//无提交荷载
store.commit('increment')
//提交荷载
store.commit('incrementN', {
    n: 100
    })
```
我们也可以使用这样包含 type 属性的对象的提交方式。
```js
store.commit({
  type: 'incrementN',
  n: 10
})
```
### Mutations 需遵守 Vue 的响应规则
 - 最好提前在你的 store 中初始化好所有所需属性。
 - 当需要在对象上添加新属性时，你应该 
使用 Vue.set(obj, 'newProp', 123), 或者
以新对象替换老对象。例如，利用对象展开运算符我们可以这样写state.obj = {...state.obj, newProp: 123 }

### mapMutations 辅助函数
与其他辅助函数类似，你可以在组件中使用 this.$store.commit(‘xxx’) 提交 mutation，或者使用 mapMutations 辅助函数将组件中的 methods 映射为 store.commit 调用（需要在根节点注入 store）。

```js
import { mapMutations } from 'vuex'

export default {
  //..
  methods: {
    ...mapMutations([
      'increment' // 映射 this.increment() 为 this.$store.commit('increment')
    ]),
    ...mapMutations({
      add: 'increment' // 映射 this.add() 为 this.$store.commit('increment')
    })
  }
}
```
## actions
Action 类似于 mutation，不同在于：

 - Action 提交的是 mutation，而不是直接变更状态。
 - Action 可以包含任意异步操作。


```js
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  },
  actions: {
    increment (context) {
      setInterval(function(){
        context.commit('increment')
      }, 1000)
    }
  }
})
```
注意：Action 函数接受一个与 store 实例具有相同方法和属性的 context 对象，因此你可以调用 context.commit 提交一个 mutation，或者通过 context.state 和 context.getters 来获取 state 和 getters。
### 分发actions
Action 通过 store.dispatch 方法触发：

```js
store.dispatch('increment')
```
### 其他与mutations类似的地方
Actions 支持同样的载荷方式和对象方式进行分发：

```js
// 以载荷形式分发
store.dispatch('incrementN', {
  n: 10
})

// 以对象形式分发
store.dispatch({
  type: 'incrementN',
  n: 10
})
```
### mapActions辅助函数
你在组件中使用 this.$store.dispatch('xxx') 分发 action，或者使用 mapActions 辅助函数将组件的 methods 映射为 store.dispatch 调用（需要先在根节点注入 store）:

```js
import { mapActions } from 'vuex'

export default {
  //..
  methods: {
    ...mapActions([
      'incrementN' //映射 this.incrementN() 为 this.$store.dispatch('incrementN')
    ]),
    ...mapActions({
      add: 'incrementN' //映射 this.add() 为 this.$store.dispatch('incrementN')
    })
  }
}

```
## Modules
使用单一状态树，导致应用的所有状态集中到一个很大的对象。但是，当应用变得很大时，store 对象会变得臃肿不堪。

为了解决以上问题，Vuex 允许我们将 store 分割到模块（module）。每个模块拥有自己的 state、mutation、action、getters、甚至是嵌套子模块——从上至下进行类似的分割：

```js
const moduleA = {
  state: { ... },
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}

const moduleB = {
  state: { ... },
  mutations: { ... },
  actions: { ... }
}

const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
  }
})

store.state.a // -> moduleA 的状态
store.state.b // -> moduleB 的状态
```
### 模块的局部状态
对于模块内部的 mutation 和 getter，接收的第一个参数是模块的局部状态,对于模块内部的 getter，根节点状态会作为第三个参数:

```
const moduleA = {
  state: { count: 0 },
  mutations: {
    increment (state) {
      // state 模块的局部状态
      state.count++
    }
  },

  getters: {
    doubleCount (state) {
      return state.count * 2
    },
    sumWithRootCount (state, getters, rootState) {
      return state.count + rootState.count
    }
  }
}

```
同样，对于模块内部的 action，context.state 是局部状态，根节点的状态是 context.rootState:

```js
const moduleA = {
  // ...
  actions: {
    incrementIfOddOnRootSum (context) {
      if ((context.state.count + context.rootState.count) % 2 === 1) {
        commit('increment')
      }
    }
  }
}

```
[原文链接](https://blog.csdn.net/weixin_35955795/article/details/57412181)

