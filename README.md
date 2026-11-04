# 留白之间

一个基于 GitHub Pages 和 Jekyll 的个人文字空间。

## 写一篇文章

在 _posts 目录新建 YYYY-MM-DD-英文短链接.md，例如：

```markdown
---
layout: post
title: 今天的记录
date: 2026-11-05
category: 日记
summary: 可选的简短摘要。
---

在这里写正文。
```

分类可以填写日记、随笔、读书、碎碎念，也可以直接添加新分类。首页、归档和分类会自动更新。文件名决定文章链接；发布后尽量不要修改。图片可放在 assets/images/，正文中使用 ![图片说明](/assets/images/文件名.jpg)。

## 本地预览

安装 Ruby 和 Bundler 后，运行：

```powershell
bundle install
bundle exec jekyll serve
```

打开终端给出的本地地址。

## 发布

将修改提交到 GitHub 仓库的 main 分支。在仓库 Settings → Pages 中选择 GitHub Actions。推送到 main 后，部署工作流会自动构建并发布网站；也可在 Actions 页面手动运行。

