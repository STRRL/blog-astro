---
title: "Unlocking the Power of Cloudflare Tunnel: Secure, Scalable, and Simple Kubernetes Ingress Controller Implementation for Your Applications"
date: 2023-06-30T14:51:40+08:00
lastmod: 2023-06-30T14:51:40+08:00
keywords:
  - Cloudflare
  - Cloudflare Tunnel
  - Kubernetes
  - Ingress
  - Ingress Controller
description: ""
tags: []
categories: []
---

> This post was assisted by ChatGPT and Grammarly.

## Introduction

Today, more and more teams are adopting cloud computing and cloud native technologies. However, exposing applications to the Internet is still a challenge. We should always consider the security, scalability, also performance of the solution. And the complexity from different cloud providers makes it even harder, tons of products and services are available, it's going to be a nightmare to choose the right one.

Cloudflare Tunnel give users a secure way to expose applications to the Internet with the minimal attack surface. It's also easy to use, and it offers free plan to individuals.

Kubernetes is the most popular container orchestration system, it's also the de facto standard for cloud native applications. Kubernetes has a built-in Ingress Resources for exposing applications to the Internet, but it's not enough. We need an Ingress Controller to implement the exposing logic. There are many Ingress Controllers available, which also increase the complexity of the solution.

In this post, I will introduce a project, [Cloudflare Tunnel Ingress Controller](https://github.com/STRRL/cloudflare-tunnel-ingress-controller), that combines Cloudflare Tunnel and Kubernetes Ingress Controller to provide a secure, scalable, and simple solution for exposing applications to the Internet. Even though it's still in the very early stage, it's still usable and I'm using it in my homelab.

{{< og-summary "https://github.com/STRRL/cloudflare-tunnel-ingress-controller" >}}

> It's not an official project from Cloudflare. And there did exist an official project from Cloudflare, [Cloudflare Ingress Controller](https://github.com/cloudflare/cloudflare-ingress-controller), but it does not works and the community is not active anymore.

## Use Cases and Examples

Imagine that you are working with Kubernetes, and

- you are working on a project, and you want to share it to your colleagues for collaborating, like profiling or debugging;
- or you just finished a proof of concept, and you want to show it to others quickly;
- or you have some self-hosted services, and you want to expose it to the Internet.

Using Cloudflare Tunnel Ingress Controller, you could expose your applications to the Internet very easily, and it's secure, scalable, and simple. Only create a Kubernetes Ingress Resource, and the Ingress Controller will do the rest.

You could follow the [Get Started](https://github.com/STRRL/cloudflare-tunnel-ingress-controller#get-started) section to try it out, bootstrap a local minikube Kubernetes Cluster, then expose the Kubernetes Dashboard to the Internet.

Also you could take a look on this video to see how smoothly and easily it works:

{{< youtube id="e-ARlEnS4zQ" title="Bootstrap Kubernetes and Expose Kubernetes Dashboard in less than 5 mins" >}}

## Benefits

Easy-to-use; Only create a Kubernetes Ingress Resources, and the Ingress Controller will do the rest. No more complex service and products from different cloud providers.

Cloud-agnostic; It works with any Kubernetes Cluster, no matter it's on-premises or in the cloud, no matter it's managed or self-hosted.

Other benefits from Cloudflare Tunnel; You could leverage the experience by Cloudflare, like Full TLS encryption on Internet, also no need to manage certificates, no need to have a public IP,  no need to expose ports, no need to manage firewall rules, no need to manage DNS records, etc.

## Conclusion

For individual developers, homelab fans and small teams, Cloudflare Tunnel Ingress Controller is a great solution for exposing applications to the Internet. Just give it a try! And it's also a Open Source project, contribution is always welcome!
