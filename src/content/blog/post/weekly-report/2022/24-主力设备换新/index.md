---
title: "2022-24: 主力设备换新"
date: 2022-06-18T13:45:25+08:00
lastmod: 2022-06-18T13:45:25+08:00
keywords: []
description: ""
tags:
- 生活
categories:
- 周报
author: ""
---

## 工作/代码/计算机相关

### NAND2Tetris

本周没有进行 NAND2Tetris 的学习;

### Macbook Pro 2018 -> Macbook Air 2020

mba 到手了. 因为从 intel 机器通过迁移助手初始化的新机器, 所以花了点时间清理 intel 架构的 binary 和 app.

整体来说, 体验还是不错的. 俺终于有了一个安静, 流畅, 清凉, 便携, 长续航的终端设备.

非要说有什么缺点的话:

- 屏幕变小了, 还不太适应;
- 音响真的垃圾;
- 右侧没有 IO 口, 也不太适应;

试用了一下 Asahi Linux, 整体体验还是比较不错的. 我需要用到的大部分的编程工具链都可以直接试用.

目前遇到一些问题:

- telegram 和 chromium 由于分发时 jemalloc 还没有支持 16K Page Size 的原因不能用. (这也意味着 Electron App 也不能用)
- AUR 上 feishu-bin 没有打 arm64 的包

还不能成为主力的办公环境. 如果有 arm 的开发需求还是可以切过来用的.

> 附上个关于类似问题的链接: https://github.com/AsahiLinux/docs/wiki/Broken-Software

### 尝试重写 Kubernetes ipset 部分代码

issue: https://github.com/kubernetes/kubernetes/issues/109034

原因是 ipset 相关 API 里暴露了太多细节, 导致使用的时候, 需要额外再去了解更多 ipset 相关的知识才能正确地使用 API, 不太不方便.

因为使用到这部分功能的代码并不多(貌似只有 kube-proxy), 所以前人提了这个 issue, 对相关代码进行重写.

俺倾向对不同类型 ipset 相关的 API 最起码做到 schema 上的严格, 但是由于 go 语言的一些限制, 最后的 API 可能还是比较丑.(但是使用上更安全, 理解压力也会变小.)

其实 Chaos Mesh 也有对 ipset 操作的需求, 如果能和进去, Chaos Mesh 也能复用这部分代码.

> 但是社区同学貌似并不关心这个问题, 也不回复俺. (可能是没有 at 正确的人?

## 生活相关

### 被团建摧残了

昨天公司团建, 斗胆报名了 ATV 越野车的项目.

体验十分糟糕.

刹车油门都在右手上, 龙头的方向操控也非常不灵敏; 开了一会我就决定放弃了.

在教练的指引下, 搭乘可靠伙伴 tmgg 的车继续了我剩下的的旅程.

但是接下来的路程里也比较艰难, 路上全部都是故意挖的坑, 还有故意放的水. 然后由于我本身比较重, 感觉 tmgg 操作的也比较吃力. 🙈

总之下次我不会再去报名这个项目了.

团建因为在一个山里, 各个项目之间的距离也很远, 由于我缺乏运动过于弱小, 第二天肩膀, 大腿, 屁股都比较痛.

> 需要锻炼身体!
