---
layout: '[post]'
title: meta标签使用总结
date: 2019-03-02 08:06:54
tags: html
---
## Meta对象
Meta 对象代表 HTML 的 一个 <meta> 元素。

<meta> 元素可提供有关某个 HTML 元素的元信息 (meta-information)，比如描述、针对搜索引擎的关键词以及刷新频率。
<!-- more -->
## meta对象的属性

属性 | 描述
---|---
content |设置或返回 <meta> 元素的 content 属性的值。
httpEquiv| 把 content 属性连接到一个 HTTP 头部。
name|把 content 属性连接到某个名称。
scheme|设置或返回用于解释 content 属性的值的格式。

常用的包括 http-equiv搭配content和name搭配content两种。

## name
### **name可用参数有这些：**
###  keywords(关键字)
说明：用于告诉搜索引擎，你网页的关键字
```html
<meta name="keywords" content="前端,js,css">
```
### description(网站内容的描述)
说明：用于告诉搜索引擎，你网站的主要内容  
```html
<meta name="description" content="一个前端网站">
```

### viewport(移动端的窗口)
说明：在用bootstrap,AmazeUI等框架时候都有用过viewport。

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```
### robots(定义搜索引擎爬虫的索引方式)
说明：robots用来告诉爬虫哪些页面需要索引，哪些页面不需要索引。content的参数有all,none,index,noindex,follow,nofollow。默认是all。

```html
<meta name="robots" content="none">
```
具体参数如下：

1. none : 搜索引擎将忽略此网页，等价于noindex，nofollow。
2. noindex : 搜索引擎不索引此网页。
3. nofollow: 搜索引擎不继续通过此网页的链接索引搜索其它的网页。
4. all : 搜索引擎将索引此网页与继续通过此网页的链接索引，等价于index，follow。
5. index : 搜索引擎索引此网页。
6. follow : 搜索引擎继续通过此网页的链接索引搜索其它的网页。

### author(作者)
说明：用于标注网页作者

```html
<meta name="author" content="xxx">
```
### generator(网页制作软件)
说明：用于标明网页是什么软件做的

```html
<meta name="generator" content="Sublime Text3">
```
### copyright(版权)
说明：用于标注版权信息

```html
<meta name="copyright" content="xxx">
```
### revisit-after(搜索引擎爬虫重访时间)
说明：如果页面不是经常更新，为了减轻搜索引擎爬虫对服务器带来的压力，可以设置一个爬虫的重访时间。如果重访时间过短，爬虫将按它们定义的默认时间来访问。

```html
<meta name="revisit-after" content="7 days" >
```
### renderer(双核浏览器渲染方式)
说明：renderer是为双核浏览器准备的，用于指定双核浏览器默认以何种方式渲染页面。比如说360浏览器。

```html
<meta name="renderer" content="webkit"> //默认webkit内核
<meta name="renderer" content="ie-comp"> //默认IE兼容模式
<meta name="renderer" content="ie-stand"> //默认IE标准模式
```
## http-equiv
### content-Type(设定网页字符集)(推荐使用HTML5的方式)
说明：用于设定网页字符集，便于浏览器解析与渲染页面举例：
```html
<meta http-equiv="content-Type" content="text/html;charset=utf-8">  //旧的HTML，不推荐

<meta charset="utf-8"> //HTML5设定网页字符集的方式，推荐使用UTF-8
```
### X-UA-Compatible(浏览器采取何种版本渲染当前页面)
说明：用于告知浏览器以何种版本来渲染页面。（一般都设置为最新模式，在各大框架中这个设置也很常见。）举例：
```html
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/> //指定IE和Chrome使用最新版本渲染当前页面
```
### cache-control(指定请求和响应遵循的缓存机制)
说明：指导浏览器如何缓存某个响应以及缓存多长时间。

```html
<meta http-equiv="cache-control" content="no-cache">
```
共有以下几种用法：

1. no-cache: 先发送请求，与服务器确认该资源是否被更改，如果未被更改，则使用缓存。

2. no-store: 不允许缓存，每次都要去服务器上，下载完整的响应。（安全措施）

3. public : 缓存所有响应，但并非必须。因为max-age也可以做到相同效果

4. private : 只为单个用户缓存，因此不允许任何中继进行缓存。（比如说CDN就不允许缓存private的响应）

5. maxage : 表示当前请求开始，该响应在多久内能被缓存和重用，而不去服务器重新请求。例如：max-age=60表示响应可以再缓存和重用 60 秒。
用法2.(禁止百度自动转码)
说明：用于禁止当前页面在移动端浏览时，被百度自动转码。虽然百度的本意是好的，但是转码效果很多时候却不尽人意。所以可以在head中加入例子中的那句话，就可以避免百度自动转码了。举例：


```html
<meta http-equiv="Cache-Control" content="no-siteapp" />
```
### expires(网页到期时间)
说明:用于设定网页的到期时间，过期后网页必须到服务器上重新传输。

```html
<meta http-equiv="expires" content="Sunday 26 October 2016 01:00 GMT" />
```
### refresh(自动刷新并指向某页面)
说明：网页将在设定的时间内，自动刷新并调向设定的网址。

```html
<meta http-equiv="refresh" content="2；URL=http://www.baidu.com/"> //意思是2秒后跳转向baidu
```
### Set-Cookie(cookie设定)
说明：如果网页过期。那么这个网页存在本地的cookies也会被自动删除。

```html
<meta http-equiv="set-cookie" content="runoobcookie=myContent;expires=Fri, 30 Dec 2015 12:00:00 GMT; path=http://www.runoob.com">
```
