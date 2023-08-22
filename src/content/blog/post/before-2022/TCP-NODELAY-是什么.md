---
title: TCP_NODELAY 是什么
abbrlink: c838d0ca
date: 2019-10-02 10:58:54
tags:
categories:
---

## 引言

最近在使用 `curl` 的时候经常注意到:

```text
# strrl @ eiu in ~ [11:02:50]
$ curl -v google.com
* Rebuilt URL to: google.com/
*   Trying 127.0.0.1...
* TCP_NODELAY set
* Connected to 127.0.0.1 (127.0.0.1) port 6152 (#0)
> GET http://google.com/ HTTP/1.1
> Host: google.com
> User-Agent: curl/7.54.0
> Accept: */*
> Proxy-Connection: Keep-Alive
>
< HTTP/1.1 301 Moved Permanently
< Location: http://www.google.com/
< Content-Type: text/html; charset=UTF-8
< Date: Wed, 02 Oct 2019 03:02:53 GMT
< Expires: Fri, 01 Nov 2019 03:02:53 GMT
< Cache-Control: public, max-age=2592000
< Server: gws
< Content-Length: 219
< X-XSS-Protection: 0
< X-Frame-Options: SAMEORIGIN
<
<HTML><HEAD><meta http-equiv="content-type" content="text/html;charset=utf-8">
<TITLE>301 Moved</TITLE></HEAD><BODY>
<H1>301 Moved</H1>
The document has moved
<A HREF="http://www.google.com/">here</A>.
</BODY></HTML>
* Connection #0 to host 127.0.0.1 left intact
```

会有一个 TCP_NODELAY set 的日志打出来, 然鹅已经不是很记得大学计网里关于这个特性了, 所以自己又翻一番资料去了解这个.

这件事涉及到 TCP 的两个机制: 纳格算法(Nagle's algorithm)与延迟确认(Delayed ACK).

## Nagle's algorithm

有这么一种情况, 在某种场景下, 我会以某种恒定的速度往 TCP 流中塞 1 byte 的数据. 那这种情况下其实会浪费很多资源, 因为一个 TCP packet 中, 光是 header 就在 20-60 byte, payload 才 1 byte.
所以为了减少这种情况,就加入了一个 write buffer.

伪代码:

```text
if there is new data to send then
    if the window size ≥ MSS and available data is ≥ MSS then
        send complete MSS segment now
    else
        if there is unconfirmed data still in the pipe then
            enqueue data in the buffer until an acknowledge is received
        else
            send data immediately
        end if
    end if
end if
```

这样通过引入了一个 buffer, 减少了不必要的传输.

## TCP Delayed ACK

Delayed ACK 是为了避免发送只为了 ACK 而发的 packet. 但是也有限制, delay 的长度不能超过 500ms.

## 化学反应

由于发送端一直收不到 ACK, 就会一直卡在为代码中的 `enqueue data in the buffer until an acknowledge is received`处. 可能一直到 500ms 过了, 收到了 ACK 才真正的发送接下来的数据.

但是为什么基于 HTTP 的 curl 需要这么一个东西, 还是暂时没有挖清楚, 猜测和 HTTPS 有关.

## 总结

如果自己需要开发一个 rpc 框架, 记得使用 TCP_NODELAY.

参考资料:

1. <https://en.wikipedia.org/wiki/Transmission_Control_Protocol>
1. <https://en.wikipedia.org/wiki/Nagle%27s_algorithm>
1. <https://en.wikipedia.org/wiki/TCP_delayed_acknowledgment>
1. <https://tools.ietf.org/html/rfc896>
1. <https://tools.ietf.org/html/rfc1122#section-4.2.3.2>
