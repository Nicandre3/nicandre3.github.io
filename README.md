# 拾遗 · A Cabinet of Curiosities

拾遗使用 Jekyll 和 GitHub Pages。收藏存放在 `_items/`，首页与抽屉自动生成；目前没有导入个人藏品，所以收藏室显示为空。原有文章保留在 `_posts/`，可从抽屉页面进入归档。

## 新增一件藏品

1. 从 `templates/` 复制相应类型的模板到 `_items/`。模板仅供参考，不会作为藏品发布。
2. 给文件起一个独一无二的英文短名，例如 `morning-light.md`；将 `item_id` 设置为相同的 `morning-light`。
3. 填写类型、分类、日期与正文，保存为 UTF-8，然后提交到 GitHub。工作流会先校验再构建。

```markdown
---
item_id: morning-light
type: text
category: text
date: 2026-11-05
title: 窗边
tags: [生活]
---

在这里写下正文。
```

`item_id` 只能使用小写英文字母、数字和连字符，且必须与文件名一致。它决定 `/items/morning-light/` 链接；发布后不要改名或重复使用。标题、标签、封面、来源和个人备注均可省略；日期与正文必填。

`type` 决定卡片样式，支持 `text`、`image`、`media`、`link`、`daily`、`other`。`category` 指向 `_drawers/` 中的分类 key；默认同名，但可以独立选择。要增加分类，复制一个 `_drawers/*.md` 文件，调整文件名、`key`、`title`、`label`、`description` 和数字 `order`；key 必须与文件名相同。分类页面和计数自动更新。

## 图片与链接

将图片放在 `assets/images/`，封面例如 `cover: /assets/images/photo.jpg`，并填写 `cover_alt`。正文可写 `![说明](/assets/images/photo.jpg)`。构建校验会检查封面文件存在；正文图片请自行检查。来源填写完整的 `https://` 或 `http://` 地址。附加的类型专属字段可以写入 Frontmatter；要在页面展示新字段时，再扩展模板。

## 修改、删除与预览

修改正文或元数据并提交即可；修改日期会改变排序。删除文件后藏品和详情页会消失，原链接也将失效。请保留文件名和编号以维持链接。

安装 Ruby、Bundler 后运行：

```powershell
bundle install
ruby scripts/validate.rb
bundle exec jekyll serve
```

GitHub Pages 使用 `.github/workflows/pages.yml`，发布来源为 GitHub Actions。校验失败时工作流会停止，修正错误后重新提交。导航中的搜索支持标题、正文、标签和备注；随机取物可进入任一藏品，首页旧物重见优先从较早的三分之一中选取。主题可设为浅色、深色或跟随系统；详情页图片可点击放大，并支持方向键、Esc 和触屏滑动。搜索索引由构建自动生成，不需要后台。
