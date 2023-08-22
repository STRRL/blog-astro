---
title: Surface Pro 重装系统
tags:
  - Life log
  - Surface
categories:
- Life log
abbrlink: 7581cc02
date: 2018-04-23 21:42:58
---

# 记录一次作死的经历

由于 Surface 自带的是 Home 版系统，淘了一个码子然后升到了 Pro。

# 作死开始

升级到 pro 后发现不能跑 wsl，然后去 msdn 下了个 win10。

导致了 **OEM 信息丢失**，触控笔无法调节力度，Surface 应用也都不到序列号

# 开始修复

只好又从官网用恢复镜像重新做。

过程中由于过于自信直接去 diskpart 执行了 clean。

官方的 1709 死活没有办法点重置，只好用 1703 版本。

1703 版本成功安装，升级到 1709，可以食用了。

再也没有烦人的补丁安装失败提示，WSL 也能用了。

PS: 最主要的还是 OEM 信息回来了，令人怀念的 Surface 标识。

前前后后折腾了两天一夜，心累。
