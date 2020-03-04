---
layout: '[post]'
title: css之BFC
date: 2019-05-03 18:36:09
tags: css
---
## BFC定义
**BFC(Block formatting context)直译为"块级格式化上下文"。它是一个独立的渲染区域，只有Block-level box参与， 它规定了内部的Block-level Box如何布局，并且与这个区域外部毫不相干。**
<!-- more -->
### Box：css布局的基本单位
Box 是 CSS 布局的对象和基本单位， 直观点来说，就是一个页面是由很多个 Box 组成的。元素的类型和 display 属性，决定了这个 Box 的类型。 不同类型的 Box， 会参与不同的 Formatting Context（一个决定如何渲染文档的容器），因此Box内的元素会以不同的方式渲染。让我们看看有哪些盒子：

- block-level box:display 属性为 block, list-item, table 的元素，会生成 block-level box。并且参与 block fomatting context；
- inline-level box:display 属性为 inline, inline-block, inline-table 的元素，会生成 inline-level box。并且参与 inline formatting context；
- run-in box: css3

### Formatting Context
Formatting context 是 W3C CSS2.1 规范中的一个概念。它是页面中的一块渲染区域，并且有一套渲染规则，它决定了其子元素将如何定位，以及和其他元素的关系和相互作用。最常见的 Formatting context 有 Block fomatting context (简称BFC)和 Inline formatting context (简称IFC)。
> BFC是一个独立的布局环境，其中的元素布局是不受外界的影响，并且在一个BFC中，块盒与行盒（行盒由一行中所有的内联元素所组成）都会垂直的沿着其父元素的边框排列。

## BFC的布局规则
1. 内部的Box会在垂直方向，一个接一个地放置。
2. Box垂直方向的距离由margin决定。属于同一个BFC的两个相邻Box的margin会发生重叠。
3. 每个盒子（块盒与行盒）的margin box的左边，与包含块border box的左边相接触(对于从左往右的格式化，否则相反)。即使存在浮动也是如此。
4. BFC的区域不会与float box重叠。
5. BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之也如此。
6. 计算BFC的高度时，浮动元素也参与计算。
## 如何创建BFC
1. float的值不是none。
2. position的值不是static或者relative。
3. display的值是inline-block、table-cell、flex、table-caption或者inline-flex
4. overflow的值不是visible

## BFC的作用
1. 利用BFC避免margin重叠。
2. 自适应两栏布局。
3. 清除浮动。

## 总结
> BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之也如此。

因为BFC内部的元素和外部的元素绝对不会互相影响，因此， 当BFC外部存在浮动时，它不应该影响BFC内部Box的布局，BFC会通过变窄，而不与浮动有重叠。同样的，当BFC内部有浮动时，为了不影响外部元素的布局，BFC计算高度时会包括浮动的高度。避免margin重叠也是这样的一个道理。

## 代码展示
### 在无BFC时候

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title>css盒子模型</title>
		<style media="screen">
			html * {
				margin: 0;
				padding: 0;
			}
		</style>
	</head>

	<body>
		<!-- <section id="sec">
			<style media="screen">
				#sec {
					background: #f00;
					/* overflow: hidden; */
				}
				.child {
					height: 100px;
					margin-top: 10px;
					background: yellow;
				}
			</style>
			<article class="child"></article>
        </section> -->
		<section id="margin">
			<style>
				#margin {
					background: pink;
					overflow: hidden;
				}
				#margin > p {
					margin: 5px auto 25px;
					background: blue;
				}
			</style>
			<p>1</p>
			<p>2</p>
			<p>3</p>
		</section>
	</body>
</html>

```
![yasuo](wubfc.png)

### 使用BFC

```html
<section id="margin">
			<style>
				#margin {
					background: pink;
					overflow: hidden;
				}
				#margin > p {
					margin: 5px auto 25px;
					background: blue;
				}
			</style>
			<p>1</p>
			<div style="overflow: hidden;">
                <p>2</p>
            </div>
			<p>3</p>
		</section>
```
![yasuo](bfc.png)

### 不与float重叠

```html
  <section id="layout">
            <style media"screen">
                #layout{
                    background: red;
                }
                #layout .left{
                    float: left;
                    width: 100px;
                    height: 100px;
                    background: pink;
                }
                #layout .right{
                    height: 110px;
                    background: blue;
                    overflow: auto;
                }
            </style>
            <div class="left"></div>
            <div class="right"></div>
        </section>
```
![yasuo](margin.png)

### 清除浮动

```html
 <!-- BFC子元素即使是float，也会参与高度计算 -->
        <section id="float">
            <style media="screen">
                #float{
                    background: red;
                    overflow: hidden;
                }
                #float .float{
                    float: left;
                    font-size: 20px;
                }
            </style>
            <div class="float">
                我是浮动元素
            </div>
        </section>
```
![yasuo](float.png)


