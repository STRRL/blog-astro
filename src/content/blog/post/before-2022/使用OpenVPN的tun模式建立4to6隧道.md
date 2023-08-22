---
title: 使用OpenVPN建立4to6隧道
tags:
  - IPv6
categories:
- Other
abbrlink: 8b23f12f
date: 2018-05-24 14:35:09
---

# 背景

与朋友聊天时聊到了这个事情，然后根据他发给我的V2上的一个[帖子](http://v2ex.com/t/234182)小小操作了一下。

# 需要

一台有IPv6的机器，只需一个IPv6地址即可;
OpenVPN;

# 操作一下

我的手上有一台有v6地址的服务器，根据[文档](https://openvpn.net/index.php/open-source/documentation/howto.html#quick)安装并配置OpenVPN。

以下是custom的配置

需要在ip6tables上设置一条规则：

```bash
ip6tables -t nat -A POSTROUTING -j SNAT --to-source xxxx:xxxx:xxxx::xxxx:xxxx
```

这里的xxxx:xxxx:xxxx::xxxx:xxxx是本机的v6地址。

这里贴一下我的配置，与帖子中的配置还是有几出不通的：

server.conf:

```conf
server 10.0.8.0 255.255.255.0
topology subnet
server-ipv6 fc00:aaff:ffac::13:0/64
port 10666
proto tcp
dev tun
# 这里修改了这一条，要不v4老不通
push "redirect-gateway autolocal def1 bypass-dhcp"
push "topology subnet"
push "dhcp-option DNS 114.114.114.114"
push "dhcp-option DNS 8.8.8.8"
# 加入了v6的DNS
push "dhcp-option DNS 2001:da8::666"
push "dhcp-option DNS 2001:4860:4860::8888"
push "ping 5"
push "ping-restart 30"
keepalive 5 30
duplicate-cn
persist-key
persist-tun
group nogroup
user nobody
tls-auth ta.key
ca ca.crt
cert server.crt
key server.key
dh dh2048.pem
```

client.conf

```conf
clients
proto tcp
dev tun
verb 3
remote x.x.x.x 10666 tcp
keepalive 10 60
route 0.0.0.0 0.0.0.0 net_gateway
# 新加了这一条
route-ipv6 ::/0 net_gateway
script-security 2
ca ca.crt
cert client.crt
key client.key
tls-auth ta.key
```

# 效果

可以使用IPv6访问google, ytb, 网速感人。

tracert发现第一调是自己的server，而且通过[ip.sb](http://ip.sb/)查看到的IP也是server的IP。
