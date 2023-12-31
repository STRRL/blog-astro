---
title: "开源与商业产品冲突吗"
date: 2022-01-28T02:34:46+08:00
lastmod: 2022-01-28T02:34:46+08:00
keywords:
- Open Source
description: ""
tags:
- Chaos Mesh
- Open Source
categories:
- 胡思乱想
author: "STRRL"
---

这其实是对于 Chaos Mesh 的一些"抱怨", 有些问题还不知道如何去解决, 这里是一些完全没有章法的胡思乱想.

## 对比之后不太自信

刚刚看了一个 [Chaos Carnival 2022](https://chaoscarnival.io/) 中的一个[演讲](https://www.youtube.com/watch?v=JJJF8s9fuGk), 涉及到了 Chaos Mesh 和 Litmus Chaos 之间的对比. 看完后内心还是有一些波澜. 跑到客厅吃完凉掉了的溜肉段, 想来想去还是需要记一下, 权当"沉淀" 下来.

## Chaos Mesh 是一个好产品吗?

这个问题的答案, 目前肯定是否定的. 因为算上即使我现在的认知, 带着现在的 Chaos Mesh Artifacts, "穿越" 回两年前做 SRE 的时候, 我也不太会将它用到我们的应用上, 因为 Chaos Mesh 还不够"成熟". 不够"成熟"仅表示, 有些重要的的特性, 我想到了但是你木有; 所以我不会用.

Chaos Mesh 在混沌注入的能力上异常强大, 基本是没有什么其他平台能够在注入的功能上能一战的. 但是在最近的 TiDB Hackathon 上, 有一组同学在使用 Chaos Mesh 的时候明确地指出 "太难用了!", "我注入了故障进去以后啥都看不到".

另外, 如何定义"产品".

> 此处应该去查阅一些项目管理相关的知识, 先挖个坑. 下面的内容暂时都是我的瞎想, 理解是肯定存在偏见与错误的.

目前我认为的"产品", 是指一个能够交付给 "End User" 的产物. 想 AZure Chaos Studio 这种将 Chaos Mesh 集成进去再提供服务的情况, Chaos Mesh 不算是产品, 它只能算是工具.

那么老老实实做一个强大的工具不好吗? 为什么一定要纠结产品呢?

因为不做产品就有可能意味着工具也有可能活不下去. 我(们)现在之所以能够靠写 Chaos Mesh 吃饭, 是因为资本认为它未来能够卖钱. 而"未来"是多久, 我并不明确知道, 我目前主观估测是 1 - 2 年. 如果资本放弃了它, 那它作为工具的未来可能会变得更加自由, 但是生长的速度与质量绝对不会比现在好.

> 此处应该去查阅一些开源项目的历史, 他们背后的公司在早期阶段是如何运作的.

由于 Chaos Mesh 是一个混沌工程平台, 它的特性决定了它几乎不会存在个人用户, 也就是说使用 Chaos Mesh 的绝大多数都是 B 端用户. 我不能确定我们是否还需要对于 B 端用户当作小白来看待, 对概念和交互方式的简化无所不用其极. 老实说, 在使用 [Gremlin](https://www.gremlin.com/) 的时候, 我确实能够感受到 Gremlin 在把我当作小白来指引:

- 不严谨但是亲切的实验类型
- 最后需要收入填写表单来记录试验结果(Pass or Failed)
- 简单但是能用的实验编排

如果我能算得上是一个"专业用户"的话, Gremlin 依旧能够带给我超越 Chaos Mesh 很多的使用体验.(这不废话嘛, 人家做 SaaS 不知道多少年了.)

因此, 虽然作为一个开源项目, 把它变得"好用"依旧是比较重要的.

## 人是如何感知到某个东西好用的?

我主观认为的"好用"要符合人的直觉, 而[直觉](https://en.wikipedia.org/wiki/Intuition)其实是一种行为模式, 不同的人会因为阅历和经验的不同, 产生不同的行为模式. 这也表明了人在依靠直觉进行动作时, 并没有使用现有的知识进行思考, 并产生新的知识.(懒惰?)

所以, 我的思路是, 先选定 Chaos Mesh 的目标用户, 假设他们有某种程度的经验, 再去揣测他们的直觉, 最后再设计出的 Chaos Mesh 交互方式才是好用的.

我主观认为的"好用"也要使它"可见"和"可理解":

- "可见" 指人看到了变化, 通过数据的对比 or 拟物的动画;
- "可理解"指即使某人没有前置知识, 他依旧能产生"我懂了"的感觉; (真玄乎了, 这怎么做到?)
- "可见"和"可理解"同时也要保证正确性, 绝对不能扭曲事实(错误的引用或改变定义), 尽量不隐藏细节;

"可见"和我们常说的"可观测性"又不是完全相同的一回事, "可见"指用户的双眼看到了 something changed, 这种"可见"需要依靠"可观测性"技术来实现.

> 我在向大家作"可见"相关 feature 介绍的时候, 用的是"混沌实验的可观测性", 引起了我们小组内部也有一部分分歧:
>
> - 一部分同学(好吧其实只有我)认为, 需要为 Chaos Mesh 所做的行为展示其影响, 需要为所有混沌实验类型提供直接影响到的 metrics 以"自证"混沌实验的效果;
> - 另一部分认为"自证"只会存在于刚接触 Chaos Mesh 时的探索阶段, 在上手后, 用户更关注的是应用的 metrics;
>
> 虽然实际上这两个事情毫不冲突, 实现起来也是毫不相干的两部分代码, 但在排期时有一个优先级的问题. 目前我们正在做后者, 而前者我并不知道如何再以何种方式引进来了. (这个时候我甚至有点希望自己是一个 contributor, 写些并不在 roadmap 里但是自己感兴趣/认为重要的代码.)

"可理解"看上去是在唬人, 因为我想做一件有些违背"常理"的事情: 对于一个即使没有前置知识的人, 依旧使他 make sense.

> 如何做到? 不知道.

## 额外瞎想: Chaos Mesh 是一个好的开源项目吗?

我主观认为 Chaos Mesh 目前算是一个好的开源项目, 因为:

- 它有硬核的部分
- 它有有趣的部分

但是它仍然有一些没有做好的地方:

- 受众小, 门槛高
- 决策不够透明

## 总结

冲突吗? 没有根本利益上的冲突, 但是商业产品要求开源项目"额外"地点一个技能点: 这个项目要卖产品的, 要考虑产品的种种设计, 比如说易用性. 但是这个技能点恐怕不太能吸引到社区 contributor, 因为它看上去不够 cool, 不够 hardcode, 也不够 funny. 当然这个假设是因为我不是研究 UX 的同学, 所以觉得它没啥意思. 🤣

话剧话说, 都可以整, 但是需要人来指路. 最后贴个广告, Chaos Mesh 团队正在招 PM, 如果你对它感兴趣, 可以联系俺内推.
