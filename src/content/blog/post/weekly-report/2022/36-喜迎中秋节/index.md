---
title: "2022-36: 喜迎中秋节"
date: 2022-09-12T16:48:53+08:00
lastmod: 2022-09-12T16:48:53+08:00
keywords: []
description: ""
tags:
- 生活
categories:
- 周报
author: ""
---

这里又是一份周报, 时间范围是`2022-09-05`到`2022-09-11`, 会记录一些工作及生活上有意思的事情.

## 工作/代码/计算机相关

### Nand2Tetris

本周没有进行 Nand2Tetris 的学习.

### Google UX

本周没有进行 Google UX 的学习.

> 啥也没学, 我是废物.

### 给 NAS 扩容

最开始搭建 NAS 的时候, 因为过于弱小买了 4 块 WD 的 SMR 2T 盘, 可以说是冤大头大队长了. 最近迫于用量要过 2 / 3 了, 开始考虑扩容的事情.

朋友给推荐了 WD HC550 16T 企业盘, 虽说是矿盘但是企业盘有 5 年质保也不错.

闲鱼上询问了几家低价的却都在成都, 发不出货来. 于是 fallback 到江浙沪地区, 买了四块 HC520 12T 的盘.

然后就开始了紧张刺激的扩容之旅.

之前建存储池的时候, 使用了群晖的 SHR(Synology Hybrid RAID), SHR 是软件 RAID5 + BTRFS. 而且 SHR 也没办法换成其他的 RAID 方式了.

而且俺的整个 NAS 只有一个存储池, 还吃掉了所有的 4 个盘位. 所以扩容的过程其实一块块地换盘, 然后 SHR / RAID5 修复重建的过程.

> 大家不要学我.

大约经历了 3 天左右, 存储它自己迁移好了.

稍微看了下 SHR 的做法:

- 之前 2T 的盘, 每个盘上都有 4 个分区, 然后各个分区分别用 mdadm 做了软 RAID
  - sda1, sdb1, sdc1, sdd1 是 `mdadm` 做了 `RAID1` 的 `/dev/md0`, 格式化成 `ext4`, 挂在了根上
  - sda2, sdb2, sdc2, sdc2 做了 `RAID1`, 是 `/dev/md1`, 是 swap(的一部分, 还有一部分是 zram; 分层 swap, 好.)
  - sda3, sdb3, sdc3, sdd3 是 `/dev/md2`, 做了 `RAID5`, 这才是 SHR 的数据
- 然后使用了 LVM, 将 `/dev/md2` 作为一个 PV, 加到 VG 里, 最后划了一个 LV, 格式化成 btrfs 挂上来.
- 换了 12T 的盘进行扩容, 迁移的方式是先建立一个之前一样的分区表, 按顺序恢复 `/dev/md0`, `/dev/md1`, `/dev/md2`.
- 然后将剩余空间建立了新分区, 并且创立了新的软 `RAID5` 设备 `/dev/md3`.
- 最后是将 `/dev/md3` 也作为 PV 加到 VG 里, 调整 LV 的大小, 调整 btrfs 的大小, 扩容完成.

不得不说还是非常妙的, 一开始我还以为是直接使用 btrfs 接了裸盘, 没想到是一层 md array, 再加一层 LVM.

设计真的很不错, 而且反正家用机, 性能要求不怎么样, 还算可以啦.

### 做个游戏玩玩

最近的 Survival / Survivor 游戏系列比较火:

- Vampire Survivors
- Nomad Survival
- SoulStone Survivors
- 还有一个手游 Survivor.io (换皮 Vampire Survivors)

手痒想自己也做一个类似的.

作为一个年老而且躁动的玩家, 只是遵循游戏制作者意图 / 设计进行游戏, 已经不能满足我的需求了. 有时候自己能够一些比较有趣的游戏机制, 然后就仅限于自己的脑海里了.

俺想做一个定制度高的游戏, 它既可以使玩家, 也可以使开发者对它进行较大的更改, 加入自己想要的角色, 技能, 机制, 特效以及地图.

> 把 Steam 创意工坊好好用起来.

总之整个东西还在慢慢地梭中, 不知道什么时候能有一个雏形出现.

### "What nobody tells you about documentation"

Ref:

- <https://www.youtube.com/watch?v=t4vKPhjcMZg>
- <https://documentation.divio.com/introduction/>

这是一篇将如何构建文档的 Talk. 提到我们应该构建 4 份内容, 而不是一个文档. 四个内容分别是:

- Tutorials
- How-to guides
- Discussion / Explanation
- Reference

![4 quadrants](https://documentation.divio.com/_images/overview.png)

每份内容都有自己的特点, 适合的读者, 以及适合的场景.

俺后面也会尝试跟随这个思路去更新文档.

## 生活相关

### 回老家过中秋

今年中秋回了躺山东家里, 然后今年中秋和教师节重合了嘛, 也给妈妈顺便庆祝了教师节.

把无人机也带回家给爸妈玩了, 爸妈表示好玩!

晚上出去散步, 县城里的环境还是不错的, 公园挺多, 活动中心小情侣也不少hhhhh.

### 又胖了

回到杭州上秤 175 斤了, 回家三天涨了 5 斤. 北方的食物是真的碳水多啊! 黄桥烧饼, 鸡蛋火烧, 煎饼果子, 菜卷子, 手擀面. 吃了个爽!!!

> 放假三天就胖了, 我是废物.

### 尝试把 Daily Notes 从 Notion 移动到 Dendron (然后又移回来了)

Dendron 是一个俺比较喜欢的 Knowledge Base 工具, 然后它的 Schema 和 Template 功能挺强大的, 像日记这种有规则而且需要管理的东西, 比较适合用 Dendron.

于是俺配置好了 Daily Notes 的 Schema 和 Template, 试着用了两天, 结果发现了大问题:

木有移动端! 木有办法在生活中记录随笔!

于是又回到了 Notion.

但是也是有好处的, 将 5MJ(5 Minutes Journal) 的模板迁移到了 Notion, 然后就可以在手机上记录了!
