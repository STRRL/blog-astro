---
title: Basic Paxos
tags:
- Distributed System
date: 2020-03-30 21:40:29
categories:
- Distributed System
---

最近可能需要自己实现分布式的系统了, 所以提前预习了下相关知识.

参考资料:

- [Wikipedia: Paxos#Basic Paxos](<https://en.wikipedia.org/wiki/Paxos_(computer_science)#Basic_Paxos>)
- [Basic Paxos](http://pages.cs.wisc.edu/~remzi/Classes/739/Fall2017/paxos.lecture.pdf)
- [Video:Paxos lecture (Raft user study)](https://www.youtube.com/watch?v=JEpsBg0AO6o)
- [Karan's Blog: Basic Paxos](https://karanchahal.github.io/2018/03/08/Basic-Paxos/)

## Basic Paxos 可以解决什么问题

假设一个分布式系统里的每个节点都是一个状态机, Basic Paxos 可以保证集群中的过半机器的状态机所在的状态是一样的 (replicated state machine).

> 就很有趣, 它只保证在某个时间点, 有半数以上的机器的状态是相同的, 却不一定是你想要的. (狗头
> 但是并不能保证状态变化的顺序一样, 那是 Multi Paxos 想做的, 做一个 replicated log.

## 怎么解决的

前提: 消息内容不会被篡改.

Paxos 中有三个角色, Proposer, Acceptor 和 Learner. 由于 Learner 的行为是被动学习, 所以我们先不考虑 Learner.

再假设一个情况, 每个节点上的程序既是 Proposer 又是 Acceptor.

> 疑问: 什么情况下 **需要** Proposer 和 Acceptor 分开呢?

逻辑图:

![Basic Paxos](https://i.imgur.com/WaeqbLe.jpg)

像这样的一个协议, 我们可以不从时间点的开始阐述问题, 而是从某个中间时间开始. 然后开始状态只是一个特殊情况处理.

> 不同的实现在细节上确实不一样. 而且 Basic Paxos 并不考虑集群之间是怎么发现的, 这是另外一个问题了. Basic Paxos 的前提是已经知道集群的 Nodes 已经在这里了, 而且 Node 之间"知道"怎么发送消息过去, 只是消息有可能会失败.

下面描述的过程都有可能在任意时刻有任意数量并发的发生.

如果用户想改变集群里的个状态, 需要使用 client 向任意一个 Proposer 发出请求, 想要设置状态为`newValue`. 然后 Proposer 会开始执行 Basic Paxos 过程.

Acceptor 需要维护 3 个状态:

- minProposal
- acceptedProposal
- acceptedValue

Proposal 需要维护 1 个状态

- Proposal number, 用于生成下一个新的 Proposal number

> 这里会用 Wikipedia 中的几个词: Prepare, Promise, Accept, Accepted 来代指 2 个 Phase 中的 4 次 RPC.

### Phase 1: Prepare

Proposer 选择一个 proposal number `n`.

> - 每个 Proposal 需要有唯一的 proposal number. 其中一个实现方案是这样: Proposal number 分为两部分, Round ID 和 Server ID. 比如说这是第 3 台 server 发起的第 5 次 proposal, 那这次 proposal number 为 `5.3`.
> - 如果 Proposer 和 Acceptor 一起, 那么 Proposer 就可以从 Acceptor 那里拿到最新的`minProposal`,然后用`minProposal + 1`作为新的 Round ID.

向所有的 Acceptor 发送请求 `Prepare(n)`. 等待 Acceptor 的回应.

> 实现细节区别: Wikipedia 上说只向一个 Acceptor 的 [Quorum](<https://en.wikipedia.org/wiki/Paxos_(computer_science)#Quorums>) 发送就可以了. 细节问题, 不同实现不一样.

---

对于某个收到`Prepare(n)`的 Acceptor:

- 如果 `n > minProposal`, 则 `minProposal = n`.
- 响应`Promise(acceptedProposal, acceptedValue)`

> 实现细节区别, 三种实现:
>
> - 若不满足`n > minProposal`, 不响应.
> - 若不满足`n > minProposal`, 响应 `Nack`.
> - 无论满足不满足, 都响应`Promise(acceptedProposal, acceptedValue)`. 会在 Accept 阶段替换为最新的值.
>
> 第二个实现相较于第一个可以更快速收敛, 让这次的 Basic Paxos 过程直接在 Prepare 阶段结束.
> 但这样看起来, 第三种实现是最稳妥的: 假设发生了网络故障, 而这个 Proposer 正好可以访问到某些部分网络分区中的 Acceptor, 那也会让他们执行 Accept 阶段. (这个例子也太极限了, 像是在强行解释, 应该还有别的好处.)

⬆️ 收到`Prepare(n)`的 Acceptor 都会这么做.、

---

然后对于刚才的 Proposer:

- 如果收到了半数以上的`Promise`, 在所有的 Acceptor 响应的 Promise `[Promise(acceptedProposal, acceptedValue), ...]`中, 取出 acceptedProposal 最大的 pair. 如果`Proposal number > 最大的 acceptedProposal`(注意是 **大于** 不是 **大于等于** ), 则使用`(proposal number, newValue)`, 否则为`(proposal number, acceptedValue)`

> 实现细节区别: 如果 Acceptor 是第二种实现, 收到了半数以上的`Nack`, 可以重头再来了.
> 如果是第一种实现, Acceptor 有可能永远收不到半数以上的 Promise. 整个过程其实客观上来看就停止了. 但是缺少一个显式的声明, 明确的告诉 Proposer 停止. 仍在疑惑, 这种实现下什么时候真正停止而且释放资源.

### Phase 2: Accept

Proposer 在 prepare 的最后一个阶段会确定一个 KV pair, Key 为 proposal number, V 为收到的`Promise`中`acceptedProposal`最大的值或者是`newValue`.

> 不记得`newValue`是啥的小伙伴, 快点`CTRL+F`在本文里搜一下`newValue`.

WIP...

## 其他细节问题

Q: 如果连续向 Proposer 发出新的请求, 第二个 Proposal 在第一个 Proposal 的 Prepare 阶段还未完成就发送了, 怎样处理.
A:
