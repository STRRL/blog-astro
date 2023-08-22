---
title: '[翻译] Zookeeper Internals'
abbrlink: 423bc513
date: 2020-03-31 20:22:25
tags:
  - Distributed System
  - Zookeeper
categories:
- Distributed System
---

[toc]

> 原文链接: <https://zookeeper.apache.org/doc/r3.2.2/zookeeperInternals.html>

## Introduction

这篇文档包含 Zookeeper 的内部工作机制的相关信息. 目前为止, 讨论了以下几个 topic:

- [Atomic Broadcast](#Atomic-Broadcast)
- [Logging](#Logging)

## Atomic Broadcast

Zookeeper 的核心是一个原子消息系统, 它可以使所有的 server 保持同步.

### Guarantees, Properties, and Definitions

Zookeeper 使用的消息系统可以提供如下保证:

_可靠的投递(Reliable delivery)_:

如果一条消息 m 投递到了某个 server, 它最终会被投递到所有的 server.

_全局有序(Total order)_:
如果在一台 server 上消息 a 在是早于 b 投递的, 拿在所有的服务器上 a 都会早于 b 投递. 如果 a 和 b 都是已被投递的 message, 那有可能 a 早于 b 投递也有可能 b 早于 a 投递.

_因果有序(Causal order)_:
如果消息 b 的 sender 在收到了 a 之后发送了消息 b, 那么 a 一定早于 b.如果同一个 sender 先发送 b 再发送 c, 那么 c 一定晚于 b.

Zookeeper 的消息系统同样需要高效, 可靠, 易于实现和维护. 我们会大量地使用消息, 所以我们需要系统能够处理每秒上千次的请求. 尽管我们需要至少 `k+1` 个正确的 server 才能发送新消息, 但我们必须能够从失败中恢复, 比如说断电. 当我们在实现系统时, 我们的时间和人力都很少, 所以我们需要一个工程师可以理解并且好实现的协议. 我们最终发现我们的协议满足所有的目标.

我们的协议假设我们能在 server 之间构建点对点的 FIFO channel. 尽管类似的服务通常会假设消息传递会丢失或者重新排序, 考虑到我们使用 TCP 进行通信, 我们对于 FIFO channel 的假设还是很实用的. 我们明确依赖了 TCP 的这些特性:

_顺序投递(Ordered delivery)_:
数据是和它被发送的一样的顺序被投递的, 消息 m 直到 m 之前的消息都投递成功了 (delivered) 才会发送. (它造成的结果是, 如果消息 m 丢失则 m 后面的消息都会丢失.)

_关闭后不会再有消息(No message after close)_:
一旦 FIFO chanel 关闭, 不会再从它这里收到新消息.

FLP 证明了如果在一个全异步的分布式系统中发生了故障, 是无法达成共识的. 为了确保再出现故障时我们能够达成共识, 我们会使用超时机制.(译者注: 可以达到部分同步) 然而, 我们依赖时间是为了保持存活(liveness), 而不是正确性(correctness). 所以如果如果超时机制出现了问题(比如说时钟出现了故障), 消息系统可能会挂起(hang), 但是不会违反它的保证.

> FLP 是一篇论文, 也是准备翻译的, 挺久前挖的坑, 还没填. (我 在 丢 人

在描述 ZooKeeper 消息传递协议时，我们将讨论数据包(packets), 提案(proposals)和消息(messages):

_数据包(Packet)_
是通过 FIFO channel 传递的一段 bytes 序列

_提案(Proposal)_
是 agreement 的最小单位. **提案**通过在 Zookeeper server 的一个 Quorum 之间传递**数据包**来达成 agreed 的. 大部分的的提案都会包含一个消息(Message), 但是 NEW_LEADER 提案是一个不含消息(Message)的例子.

_消息(Message)_
是一串 bytes, 会被自动地广播到所有的 Zookeeper server.

### Leader Activation

### Active Messaging

### Summary

### Comparisons

## Quorums

## Logging

### Developer Guidelines
