---
layout: '[post]'
title: webp在项目中的应用
date: 2019-03-22 11:11:26
tags: html
---
## 什么是webp？
WebP格式，谷歌开发的一种旨在加快图片加载速度的图片格式。图片压缩体积大约只有JPEG的2/3，并能节省大量的服务器宽带资源和数据空间。
<!-- more -->

## 为什么要用webp
1. 减小图片加载资源的大小、节省用户流量资源
2. 降低服务器流量资源  
### 压缩率
![yasuo](yasuo.webp)

## webp兼容性情况
![yasuo](jianrong.webp)  
结果：谷歌全面支持、安卓浏览器从4.2开始支持。那么在页面中对于安卓用户中图片资源加载大小会有大幅度下降。

## webp在各大网站的使用
淘宝中大量使用webp。  
![yasuo](taobao.webp)  
各大cdn也是支持webp图片格式输出。

## 项目中的实践
![yasuo](liucheng.webp) 
### 技术实现
#### webp兼容性如何检测？
1. 通过js浏览器端判断是否支持webp
```js
function check_webp_feature(feature, callback) {
    var kTestImages = {
        lossy: "UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA",
        lossless: "UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==",
        alpha: "UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==",
        animation: "UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA"
    };
    var img = new Image();
    img.onload = function () {
        var result = (img.width > 0) && (img.height > 0);
        callback(feature, result);
    };
    img.onerror = function () {
        callback(feature, false);
    };
    img.src = "data:image/webp;base64," + kTestImages[feature];
}
```
2. 浏览器向服务端发起请求的时候accept 会带上image/webp 信息，在服务端判断是否支持webp。

```js
map $http_accept $webp_suffix {
        default   "";
        "~*webp"  ".webp";
}
```
通过nginx中map方法，查找是否有webp字段，如果有设置$webp_suffix 为.webp值。通过该值就可以来判断是否支持webp。如果支持写入cookie，前端通过检测cookie做判断，是否加载webp图片。

nginx 中设置cookie代码

```java
location / {
  if ($webp_suffix ~* webp) {
    add_header Set-Cookie 'webpAvaile=true; path= /; expires=3153600';
  }
}
```

### 在开发中使用  
#### sass中使用

```scss
@mixin webpbg($url) {
    background-image: url($url);
    @at-root .webpa & {
        background-image: url($url+'.webp');
    }
}
```
scss文件使用  

```scss
@include webpbg('../image/header.jpg');
```

#### html中使用

```html
<picture class="img" >
    <source class="img" srcset="images/banner.jpg.webp" type="image/webp">
    <img class="img" id="headImg" src="images/banner.jpg"/>
</picture>
```

#### 生成webp资源
使用webpack的loader

```js
var imagemin = require('imagemin');
var imageminWebp = require('imagemin-webp');
var loaderUtils = require('loader-utils');
 
module.exports = function (content) {
    this.cacheable && this.cacheable();
    if (!this.emitFile) throw new Error("emitFile is required from module system");
    var callback = this.async();
    var options = loaderUtils.getOptions(this);
 
    // 写入原文件
    var url = loaderUtils.interpolateName(this, options.name || "[hash].[ext]", {
        content: content,
        regExp: options.regExp
    });
    this.emitFile(url, content);
 
    // 如果源文件比较小，则没必要转换为webp格式的图片，直接使用callback传递给下一个loader处理
    var limit;
    if (options.limit) {
        limit = parseInt(options.limit, 10);
    }
    if (limit <= 0 || content.length < limit) {
        callback(null, { buffer: content, url })
        return;
    }
 
    // 根据options内容生成webpOptions
    var webpOptions = {
        preset: options.preset || 'default',
        quality: options.quality || 75,
        alphaQuality: options.alphaQuality || 100,
        method: options.method || 1,
        sns: options.sns || 80,
        autoFilter: options.autoFilter || false,
        sharpness: options.sharpness || 0,
        lossless: options.lossless || false,
    };
    if (options.size) {
        webpOptions.size = options.size;
    }
    if (options.filter) {
        webpOptions.filter = options.filter;
    }
 
    // 生成的webp图片的名称为原图片的名称后面追加.webp,
    // 例如：xxx.jpg.webp, 方便在css预处理器中的使用
    var webpUrl = url + '.webp';
    // 原图片异步转换为webp的图片
    imagemin.buffer(content, { plugins: [imageminWebp(webpOptions)] }).then(file => {
        // 写入webp图片并调用callback
        this.emitFile(webpUrl, file);
        // 传递给svg-placrholder-loader，继续处理成placeholder
        callback(null, { buffer: content, url, webpUrl });
 
        /* 如果要单独使用的话，可以使用该注释部分的代码
        const exportJson = 'module.exports = { ' +
            '"originSrc": __webpack_public_path__ + "' + url +
            '" , "webpSrc": __webpack_public_path__ + "' + webpUrl +
            '"' +
            ' };';
        callback(null, exportJson);   
        */  
    }).catch(err => {
        callback(err);
    });
 
};
 
// 要求webpack传入原始的buffer，方便处理图片
module.exports.raw = true;
```

nginx生成  
实现过程，对支持webp的请求设置cookies。利用nginx检测图片请求是否存在，如果不存在通过lua调用imageMagic创建webp图片并返回。需要注意的是nginx需要安装lua支持的模块。


```java
user  root; # nginx 用户权限 执行lua创建图片命令需要读写权限
# ...
http {
    include       mime.types;
    server {
        listen       80;
        server_name  webp.leewr.com;
        root         /home/leewr/mono/app/public/december;
        location / {
            if ($webp_suffix ~* webp) {
                add_header Set-Cookie 'webpAvaile=true; path= /;';
            }
        }
        location ~* ^(.+\.(jpg|png|jpeg|gif))(.webp)$ { # 正则匹配图片 paht/name.jpg.webp 格式的图片请求
            if (!-f $request_filename) { # 如果图片不存在
                access_log /usr/local/nginx/logs/december.log main; # 设置日志文件
                set $request_filepath /home/leewr/mono/app/public/december/$1; # 图片真实路径变量
                set $ext $3; # 设置图片扩展名$ext变量
                content_by_lua_file lua/webp.lua; # 调用nginx/lua目录下的webp.lua文件
            }
        }
    }
}
```

下面看lua, lua 中代码非常简单。定义command命令，调用系统os.execute(command)执行convert图片转换命令。convert是ImageMagic的命令。.. lua 中字符串连接。ngx.var.ext是nginx中定义的变量。


```nginx
local command
command = "convert " ..ngx.var.request_filepath.. " " ..ngx.var.request_filepath..ngx.var.ext
os.execute(command)
ngx.exec(ngx.var.request_uri)
```

[原文地址](https://www.jianshu.com/p/73ca9e8b986a)
