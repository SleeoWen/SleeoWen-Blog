---
layout: '[post]'
title: 初次使用hexo
date: 2019-01-14 09:57:01
tags: hexo
---

偶然间发现了hexo这个博客搭建工具，于是决定将使用多年的云笔记的内容搬迁至这个博客上，分享我的搬迁经历以及踩过的坑吧~。
<!-- more -->

## 我们开始吧

### 新建仓库

在github新建仓库，如果想要部署在github上，要仓库名为 ==<user-name>.github.io== 而不是user-name ，其中 ==<user-name>== 是你 ==github== 的昵称，要是问为什么，都是眼泪的教训。
### 安装hexo

```
npm install -g hexo-cli
```
或者
```linux
npm install hexo
```
### 初始化项目
初始化命令
```
hexo init
```
运行
```
hexo server
```
大功告成，访问 ==localhost:4000== 我们就能看到建的博客的效果了！
### 将Hexo部署到GitHub Pages上
1. 将[Travis CI](https://github.com/marketplace/travis-ci) 添加到你的 GitHub 账户中。
2. 前往 GitHub 的 [Applications settings](https://github.com/settings/installations)，配置 Travis CI 权限，使其能够访问你的 repository。
3. 你应该会被重定向到 Travis CI 的页面。如果没有，请 [手动前往](https://travis-ci.com/)。
4. 在浏览器新建一个标签页，前往 GitHub [新建 Personal Access Token](https://github.com/settings/tokens) ，只勾选 repo 的权限并生成一个新的 Token。Token 生成后请复制并保存好。
5. 回到 Travis CI，前往你的 repository 的设置页面，在 **Environment Variables** 下新建一个环境变量，**Name** 为 GH_TOKEN，**Value** 为刚才你在 GitHub 生成的 Token。确保 **DISPLAY VALUE IN BUILD LOG** 保持 **不被勾选** 避免你的 Token 泄漏。点击 Add 保存。
6. 在你的 Hexo 站点文件夹中新建一个 ==.travis.yml== 文件：

```
sudo: false
language: node_js
node_js:
  - 10 # use nodejs v10 LTS
cache: npm
branches:
  only:
    - master # build master branch only
script:
  - hexo generate # generate static files
deploy:
  provider: pages
  skip-cleanup: true
  github-token: $GH_TOKEN
  keep-history: true
  on:
    branch: master
  local-dir: public
```

7. 将.travis.yml 推送到 repository 中。Travis CI 应该会自动开始运行，并将生成的文件推送到同一 repository 下的 gh-pages 分支下

8. 在GitHub中前往你的repository 的设置页面，修改 GitHub Pages 的部署分支为 gh-pages。
9.  完成以上步骤，我们就能在<user-name>.github.io上看到自己建设的博客了。
### 其他配置项
请参考[hexo文档](https://hexo.io/zh-cn/docs)。


