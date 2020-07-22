---
layout: '[post]'
title: vue兄弟组件间传数据的方法-事件
date: 2020-07-20 19:45:53
tags: Vue
---


vm.$on(event, callback)[vue API](https://cn.vuejs.org/v2/api/#vm-on)
--------------------------------------------------------------------
<!-- more -->
**用法：** 监听当前实例上的自定义事件。事件可以由 `vm.$emit` 触发。回调函数会接收所有传入事件触发函数的额外参数。

```js
vm.$on('test', function (msg) {
  console.log(msg)
})
vm.$emit('test', 'hi')
// => "hi"
```

vm.$once(event, callback) [vue API](https://cn.vuejs.org/v2/api/#vm-once)
-------------------------------------------------------------------------

**用法：** 监听一个自定义事件，但是只触发一次。一旦触发之后，监听器就会被移除。

vm.$off([event, callback] ) [vue API](https://cn.vuejs.org/v2/api/#vm-off)
--------------------------------------------------------------------------

**用法：**

*   移除自定义事件监听器。
    1.  如果没有提供参数，则移除所有的事件监听器；
        
    2.  如果只提供了事件，则移除该事件所有的监听器；
        
    3.  如果同时提供了事件与回调，则只移除这个回调的监听器。
        

vm.$emit(eventName, […args] ) [vue API](https://cn.vuejs.org/v2/api/#vm-emit)
-----------------------------------------------------------------------------

**用法：** 触发当前实例上的事件。附加参数都会传给监听器回调。  
示例：只配合一个事件名使用 $emit：

```html
<div>
  <welcome-button v-on:welcome="sayHi"></welcome-button>
</div>
Vue.component('welcome-button', {
  template: `
    <button v-on:click="$emit('welcome')">
      Click me to be welcomed
    </button>
  `
})
new Vue({
  el: '#emit-example-simple',
  methods: {
    sayHi: function () {
      alert('Hi!')
    }
  }
})
```

配合额外的参数使用 `$emit`：

```html
<div>
					<!-- 添加事件侦听器  -->
  <magic-eight-ball v-on:give-advice="showAdvice"></magic-eight-ball>
</div>

Vue.component('magic-eight-ball', {
  data: function () {
    return {
      possibleAdvice: ['Yes', 'No', 'Maybe']
    }
  },
  methods: {
    giveAdvice: function () {
    	//根据数组长度 随机取数
      var randomAdviceIndex = Math.floor(Math.random() * this.possibleAdvice.length)
      	//触发示例事件  从数组中随机取一元素传参
      this.$emit('give-advice', this.possibleAdvice[randomAdviceIndex])
    }
  },
  template: `
    <button v-on:click="giveAdvice">
      Click me for advice
    </button>
  `
})

new Vue({
  el: '#emit-example-argument',
  methods: {
    showAdvice: function (advice) {
      alert(advice)
    }
  }
})
```

兄弟组件传数据
-------

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<meta >
		<title>兄弟组件数据交互</title>
	</head>
	<body>
		<div>
			<button @click='handle'>销毁事件</button>
			<aaa></aaa>
			<bbb></bbb>
		</div>
		<script src="js/vue.js" type="text/javascript" charset="utf-8"></script>
		<script type="text/javascript">
			// 提供事件中心
			var hub=new Vue();
			
			// 组件  aaa
			Vue.component('aaa',{
				data:function(){
					return{
						content:'这里是a',
						txt:'我是a被给到兄弟的数据~~~',
						test:'这里的数据会变化的！！！'
					}
				},
				template:"<div>\
					<p>{{content}}</p>\
					<p>{{test}}</p>\
					<button @click='changes'>数据给b</button>\
				</div>",
				methods:{
					changes:function(){
						hub.$emit('aaaData',this.txt);
					}
				},
				mounted:function(){
					hub.$on('bbbData',(val)=>{
						this.test=val;
					});
				}
			});
			// 组件  bbb
			Vue.component('bbb',{
				data:function(){
					return{
						content:'这里是b',
						txt:'我是b给到a兄弟下的数据',
						test:'这里的数据会变化的！！！'
					}
				},
				template:"<div>\
					<p>{{content}}</p>\
					<p>{{test}}</p>\
					<button @click='changes'>数据给a</button>\
				</div>",
				methods:{
					changes(){
						hub.$emit('bbbData',this.txt);
					}
				},
				mounted() {
					hub.$on('aaaData',(val)=>{
						this.test=val;
					})
				}
			})
			// 实例化 Vue
			var vm = new Vue({
				el: "#app",
				data: {
					
				},
				methods: {
					//移除自定义事件监听器。
					handle(){
						hub.$off('aaaData');
						hub.$off('bbbData');
					}
				}
			});
		</script>
	</body>
</html>
```