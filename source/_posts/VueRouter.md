---
layout: '[post]'
title: VueRouter
date: 2020-01-01 21:30:12
tags: Vue
---
## 路由模式
- hash
- history
<!-- more -->

### hash
带＃
### history
需要server支持

## 动态路由

```js
const User = {
    template:'<div>{{$route.params.id}}</div>'
}
const router = new VueRouter({
    routes:[
        // 动态路径参数 以冒号开头。命中/user/10等格式路由
        {path:'/user/:id',component:User}
    ]
})
```
## 懒加载

```js
import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
export default new VueRouter({
 routes: [
 {
 path: '/',
 name: 'Navigator',
 component: () => import(/* webpackChunkName: "navigator" */ './../components/Navigator')
 },
 {
 path: '/tucao',
 name: 'Tucao',
 component: () => import(/* webpackChunkName: "tucao" */ './../components/Tucao')
 }
 ]
```
## 路由守卫
路由钩子函数有三种：
1. 全局钩子： beforeEach、 afterEach

2. 单个路由里面的钩子： beforeEnter、 beforeLeave

3. 组件路由：beforeRouteEnter、 beforeRouteUpdate、 beforeRouteLeave

### 全局守卫
无论访问哪一个路径，都会触发全局的钩子函数，位置是调用router的方法

**router.beforeEach() 进入之前触发**

**router.afterEach() 进入之后触发**

#### beforeEach（全局前置守卫）
使用 router.beforeEach 注册一个全局前置守卫

```js
const router = new VueRouter({
    。。。
})
router.beforeEach((to,from,next)=>{
    ...
})
```
每个守卫方法接收三个参数：
- to: Route: 即将要进入的目标路由对象（to是一个对象，是将要进入的路由对象，可以用to.path调用路由对象中的属性）
- from: Route: 当前导航正要离开的路由
- next: Function: 这是一个必须需要调用的方法，执行效果依赖 next 方法的调用参数。

##### next参数
 - next(): 进行管道中的下一个钩子。如果全部钩子执行完了，则导航的状态就是confirmed (确认的)。
 - next(false): 中断当前的导航。如果浏览器的 URL 改变了 (可能是用户手动或者浏览器后退按 钮)，那么 URL 地址会重置到 from 路由对应的地址。
 - next('/') 或者 next({ path: '/' }): 跳转到一个不同的地址。当前的导航被中断，然后进行一个新的导航。你可以向 next 传递任意位置对象，且允许设置诸如 replace: true、name: 'home' 之类的选项以及任何用在router-link 的 to prop或router.push中的选项。
 - next(error): (2.4.0+) 如果传入 next 的参数是一个 Error 实例，则导航会被终止且该错误会被传递给router.onError()注册过的回调。

> 确保要调用 next 方法，否则钩子就不会被 resolved。

#### afterEach（全局后置钩子）

```js
const router = new VueRouter({
    。。。
})
router.afterEach((to,from)=>{
    ...
})
```
和守卫不同的是，这些钩子不会接受 next 函数也不会改变导航本身
#### 路由独享的守卫(单个路由独享的)

```js
export default new VueRouter({
 routes: [
 {
 path: '/',
 name: 'Navigator',
 router.beforeEnter((to,from,next)=>{
    ...
 }),
 component: () => import(/* webpackChunkName: "navigator" */ './../components/Navigator')
 }
 ]
```
#### 组件级路由钩子

```js
{

data,

methods

beforeRouteEnter(){

   // this 不指向实例 组件还没创建

    next((vm) =>{

        // vm就是实例

    })

}

beforeRouteUpdate(){}

beforeRouteLeave(){}

}

```

![image](luyou1.png)
beforeRouteEnter 守卫 不能 访问 this，因为守卫在导航确认前被调用,因此即将登场的新组件还没被创建。不过，你可以通过传一个回调给 next来访问组件实例。在导航被确认的时候执行回调，并且把组件实例作为回调方法的参数。

![image](luyou2.png)

注意~ ： beforeRouteEnter 是支持给 next 传递回调的唯一守卫。对于 beforeRouteUpdate 和 beforeRouteLeave 来说，this 已经可用了，所以不支持传递回调，因为没有必要了。

这个离开守卫beforeRouteLeave()通常用来禁止用户在还未保存修改前突然离开。该导航可以通过 next(false) 来取消。

![image](luyou3.png)

#### 完整的导航解析流程：

1. 导航被触发。

2. 在失活的组件里调用离开守卫。

3. 调用全局的 beforeEach 守卫。

4. 在重用的组件里调用 beforeRouteUpdate 守卫 (2.2+)。

5. 在路由配置里调用 beforeEnter。

6. 解析异步路由组件。

7. 在被激活的组件里调用 beforeRouteEnter。

8. 调用全局的 beforeResolve 守卫 (2.5+)。

9. 导航被确认。

10. 调用全局的 afterEach 钩子。

11. 触发 DOM 更新。

12. 用创建好的实例调用 beforeRouteEnter 守卫中传给 next 的回调函数。


