---
layout: '[post]'
title: Vue组件渲染过程
date: 2020-03-11 13:58:06
tags:
---
## 初次渲染过程

1. 解析模版为render函数（编译打包时已经完成，开发环境下完成）（vue-loader）
2. 触发响应式，监听data属性，getter setter
3. 执行render函数，生成vnode，patch（elem,vnode）

<!-- more -->
## 更新过程

1. 修改data，触发setter（此前在getter中已经被监听）
2. 重新执行render函数，生成newVnode
3. patch(vnode,newVnode)

## 异步渲染过程

1. $nextTick
2. 汇总data的修改一次性更新视图
3. 修改DOM操作次数，提升性能


