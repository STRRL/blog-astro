---
title: 解决git-flow 在 zsh 下没有 completions
abbrlink: 9575a282
date: 2018-11-28 18:41:40
tags:
categories:
---

当初用 Homebrew 安装 git-flow 时遇到过。  
网上流传的

```bash
brew remove git
brew install git --without-completions
```

已经不管用了，这个参数会被直接忽略掉。

解决方法：删除`/usr/local/share/zsh/site-functions/_git`
