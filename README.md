# zhc425 的动态空间

使用 Jekyll 和 GitHub Pages，所有内容保存在 `_posts` 中。

## 发布短动态

新建 `_posts/2026-11-05-a-small-note.md`。短动态不需要标题，正文支持 Markdown 和图片：

```markdown
---
type: note
date: 2026-11-05
category: 碎碎念
---

今天想记录的一句话。

也可以写第二段。
```

日期也可写成 `2026-11-05 14:30:00 +0800`。默认分类是碎碎念，日期必须与文件名的日期一致；文件名末尾使用唯一的英文短链接。

## 发布长文章

```markdown
---
title: 一本书读完之后
date: 2026-11-05
category: 读书
summary: 这里写一段简短摘要。
---

这里是文章正文。
```

不设置 `type: note` 即按长文章展示。已有文章不受影响。发布后保留文件名，永久链接即可保持稳定。分类可以自由添加，首页 Tab 固定显示常用分类，其他分类可在分类页面查找。图片放在 `assets/images/`，写作 `![图片说明](/assets/images/example.jpg)`。

## 预览与发布

安装 Ruby 和 Bundler 后运行 `bundle install`、`bundle exec jekyll serve`。将变更推送到 GitHub 的 `main` 分支后，GitHub Actions 会构建并部署；Pages 发布来源应选择 GitHub Actions。工作流位于 `.github/workflows/pages.yml`。
