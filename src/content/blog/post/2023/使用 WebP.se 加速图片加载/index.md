---
title: "使用 WebP Cloud Services 加速图片加载"
date: 2023-06-16T09:52:29+08:00
lastmod: 2023-06-16T09:52:29+08:00
keywords:
 - WebP Cloud Services
 - webp.se
 - webp
 - images
description: ""
tags:
  - webp.se
  - webp
  - images
categories: []
author: ""
---

这篇文章是由Notion AI协助完成的.

你可能已经注意到了, 我博客上的所有图片都是从`webp.strrl.dev`加载的.那么, 它到底是什么呢?

## 我的故事

我在`strrl.dev`上写作和发布文章.为了使故事更加生动有趣, 我经常包含图片、画布或贴纸.

然而, 我的手机上的原始图片可能有几兆字节大小.此外, 我有时会录制GIF来介绍交互, 这也可能导致文件大小过大的问题.

Nova告诉我他们提供的一项服务可以作为中间层来缩小图像大小.

## 什么是 WebP Cloud Services?

这是一项云服务, 可以通过提供现代图像格式的图片来加速网站的加载时间.

## WebP Cloud Services 可以在哪些地方使用?

这项服务可以用于任何关心以下问题的网站：

- 加载速度, 和/或
- 减少网络数据流量使用.

## 为什么使用 WebP Cloud Services?

因为它可以真正减少图片的大小和加载时间.

对比

之前:

![Untitled](./webp.se-before.png)

之后:

![Untitled](./webp.se-after.png)

完整报告：

- [https://pagespeed.web.dev/analysis/https-strrl-dev-post-weekly-recap-2023-21-selfdrivinglongtrip/i4gxdepubp](https://pagespeed.web.dev/analysis/https-strrl-dev-post-weekly-recap-2023-21-selfdrivinglongtrip/i4gxdepubp?form_factor=mobile)
- [https://pagespeed.web.dev/analysis/https-strrl-dev-post-weekly-recap-2023-21-selfdrivinglongtrip/z04jigvyme](https://pagespeed.web.dev/analysis/https-strrl-dev-post-weekly-recap-2023-21-selfdrivinglongtrip/z04jigvyme?form_factor=desktop)

## 如何使用 WebP Cloud Services?

我使用hugo生成我的博客, 通过Hugo“Markdown Render Hooks”, 我可以自定义渲染图像的方式.所以我只需替换图像的URL.

请按照 https://docs.webp.se/webp-cloud/access/ 上的文档, 以各种方式将其与您的网站集成.
