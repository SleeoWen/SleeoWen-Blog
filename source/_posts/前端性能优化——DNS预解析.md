---
layout: '[post]'
title: 前端性能优化——DNS预解析
date: 2019-02-21 16:39:49
tags: 前端性能优化
---
## 什么是DNS预解析？
我们在进行前端性能优化时，涉及到DNS方面的优化一般有两点： 一个是减少DNS的请求次数，另一个就是进行DNS预解析 。

DNS 实现域名到IP的映射。通过域名访问站点，每次请求都要做DNS解析。目前每次DNS解析，通常在200ms以下。针对DNS解析耗时问题，一些浏览器通过DNS Prefetch 来提高访问的流畅性。  

**DNS Prefetch** 是一种DNS 预解析技术，当浏览网页时，浏览器会在加载网页时对网页中的域名进行解析缓存，这样在单击当前网页中的连接时就无需进行DNS的解析，减少用户等待时间，提高用户体验。
#### **DNS Prefetch，即DNS预解析。**  
<!-- more -->

## 为什么使用DNS预解析？
DNS 作为互联网的基础协议，其解析的速度似乎很容易被网站优化人员忽视。现在大多数新浏览器已经针对DNS解析进行了优化，典型的一次DNS解析需要耗费 20-120 毫秒，减少DNS解析时间和次数是个很好的优化方式。DNS预解析 是让具有此属性的域名不需要用户点击链接就在后台解析，而域名解析和内容载入是串行的网络操作，所以这个方式能 减少用户的等待时间，提升用户体验 。
#### DNS解析的运行顺序
浏览器对网站第一次的域名DNS解析查找流程依次为：  
**浏览器缓存-系统缓存-路由器缓存-ISP DNS缓存-递归搜索**  
## 支持DNS Prefetch的浏览器
- Chrome
- IE:9+
- Firefox:3.5+
- Safari:5+
- Edge  

## 如何在网站中使用DNS预解析
因为浏览器的html解析是顺序的，所以DNS Prefetch 应该尽量的放在网页的前面，推荐放在 <meta charset="UTF-8"> 后面：  
```html
<meta http-equiv="x-dns-prefetch-control" content="on">
<!--打开和关闭DNS预预解析-->
<link rel="dns-prefetch" href="//www.baidu.com">
<!--解析的DNS的地址-->
```
注：dns-prefetch需慎用，多页面重复DNS预解析会增加重复DNS查询次数。
