---
layout: '[post]'
title: js的面向对象
date: 2019-07-25 18:54:57
tags: javascript
---
## 类和实例
<!-- more -->

### 类的声明

```js
	// 类的声明
	function Animal() {
		this.name = 'animal';
	}
	// es6中的声明
	class Animals {
		constructor() {
		this.name = 'animal';
		}
	}
```
### 类的实例化

```js
    // 实例化类
    //在没有参数时，构造函数的括号可以省略
	console.log(new Animal(), new Animals());
```
## 类和继承
### 使用构造函数进行继承

```js
//	使用构造函数进行继承（es5）
function Parent1() {
    this.name = 'name';
}
Parent1.prototype.say = function () {
    console.log('say');
}
// 这种方式不会继承父类原型对象上的方法
function Child1() {
    Parent1.call(this); // apply;
    this.type = 'chilid1';
}
console.log(new Child1);
```
**这种方式不会继承父类原型对象上的方法**
### 借助原型链实现继承

```js
//	借助原型链实现继承
function Parent2() {
    this.name = 'name2';
    this.play = [1, 2, 3];
}
function Child2() {
    this.type = 'chilid2';
}
Child2.prototype = new Parent2();
console.log(new Child2());
var s1 = new Child2();
var s2 = new Child2();
console.log(s1.play, s2.play);	//[1,2,3] [1,2,3]
s1.play.push(4);
console.log(s1.play, s2.play);	//[1,2,3,4] [1,2,3,4]
```
**多个实例化对象，共用一个原型链，修改对象中原型链上的属性，会导致其他对象的原型链上的属性也发生变化。**

### 组合方式

```js
// 组合方式
function Parent3() {
    this.name = 'name3';
    this.play = [1, 2, 3];
}
function Child3() {
    Parent3.call(this);
    this.type = 'chilid3';
}
Child3.prototype = new Parent3();
var s3 = new Child3();
var s4 = new Child3();
s3.play.push(4);
console.log(s3.play, s4.play);
```
**有缺点，父类的构造函数执行了两次。**
### 组合继承的优化1

```js
function Parent4() {
    this.name = '4';
    this.play = [1, 2, 3];
}
function Child4() {
    Parent4.call(this);
    this.type = 'chilid4';
}
Child4.prototype = Parent4.prototype;
var s5 = new Child4();
var s6 = new Child4();
s5.play.push(4);
console.log(s5.play, s6.play);
console.log(s5 instanceof Child4, s5 instanceof Parent4);	// true true
console.log(s5.constructor);	// Parent4
// 因为子类的prototype就是父类的实例，他的constructor是从父类直接拿过来的
```
父类只在子类实例化时执行一次，将父类的prototype赋给子类。

### 组合继承的优化2

```js
function Parent5() {
    this.name = '5';
    this.play = [1, 2, 3];
}
function Child5() {
    Parent5.call(this);
    this.type = 'chilid5';
}
Child5.prototype = Object.create(Parent5.prototype);
Child5.prototype.constructor = Child5;
var s5 = new Child5();
var s6 = new Child5();
s5.play.push(4);
console.log(s5.play, s6.play);
console.log(s5 instanceof Child5, s5 instanceof Parent5); // true true
console.log(s5.constructor); // Child5
```
### ES6的继承

```js
// es6继承
  class Animal {
    //构造函数，里面写上对象的属性
    constructor(props) {
      this.name = props.name || 'Unknown';
    }
    //方法写在后面
    eat() {//父类共有的方法
      console.log(this.name + " will eat pests.");
    }
  }

  //class继承
  class Bird extends Animal {
    //构造函数
    constructor(props,myAttribute) {//props是继承过来的属性，myAttribute是自己的属性
      //调用实现父类的构造函数
      super(props)//相当于获得父类的this指向
      this.type = props.type || "Unknown";//父类的属性，也可写在父类中
      this.attr = myAttribute;//自己的私有属性
    }

    fly() {//自己私有的方法
      console.log(this.name + " are friendly to people.");
    }
    myattr() {//自己私有的方法
      console.log(this.type+'---'+this.attr);
    }
  }

//通过new实例化
  var myBird = new Bird({
    name: '小燕子',
    type: 'Egg animal'//卵生动物
  },'Bird class')
  myBird.eat()
  myBird.fly()
  myBird.myattr()
```
