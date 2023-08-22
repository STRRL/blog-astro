---
title: kubernetes from scratch
tags:
- kubernetes
categories:
- kubernetes
abbrlink: 12e8edae
date: 2020-02-02 15:28:34
---

从头开始装一个 kubernetes.

现在是 2020-02-02 15:29

参考资料: <https://github.com/kelseyhightower/kubernetes-the-hard-way>

## 准备

将在两台虚拟机上安装 kubernetes:  
kmaster 2C4G ubuntu-18.04 192.168.50.57  
worker-0 2C4G ubuntu-18.04 192.168.50.195

## 生成证书

kubernetes 各个组件之间都是需要经过 HTTPS 双向认证的, 所以至少为每个组件都生成一对公私钥和证书:

这里使用 cfssl 这个工具来生成证书, 其实也可以用 openssl 的. （一年前还是用的 openssl

关于 cfssl 和 openssl 以后开一个新坑再来研究吧.

按照 kubernetes-the-hard-way 中的步骤, 做到 api server 部分时, 需要把 IP/hostname 手动指定一下.

## master 节点 安装 etcd

这里只用的单节点的 etcd, 需要修改启动参数, 同时 IP 与集群中的机器的地址也需要更改.

## master 节点 启动 Kubernetes Control Plane 相关服务

完全按照教程来, 只不过更新了包的版本.

增加了一个 ClusterRole `system:kube-apiserver-to-kubelet`:

```yaml
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: ClusterRole
metadata:
  annotations:
    rbac.authorization.kubernetes.io/autoupdate: 'true'
  labels:
    kubernetes.io/bootstrapping: rbac-defaults
  name: system:kube-apiserver-to-kubelet
rules:
  - apiGroups:
      - ''
    resources:
      - nodes/proxy
      - nodes/stats
      - nodes/log
      - nodes/spec
      - nodes/metrics
    verbs:
      - '*'
```

以及一个 cluster role binding `system:kube-apiserver`

```yaml
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: ClusterRoleBinding
metadata:
  name: system:kube-apiserver
  namespace: ''
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: system:kube-apiserver-to-kubelet
subjects:
  - apiGroup: rbac.authorization.k8s.io
    kind: User
    name: kubernetes
```

## worker 节点

同样完全按照教程来, 只不过更新了包的版本, 跟着修改一些配置文件.

```bash
wget -q --show-progress --https-only --timestamping \
  https://github.com/kubernetes-sigs/cri-tools/releases/download/v1.17.0/crictl-v1.17.0-linux-amd64.tar.gz \
  https://github.com/opencontainers/runc/releases/download/v1.0.0-rc10/runc.amd64 \
  https://github.com/containernetworking/plugins/releases/download/v0.8.5/cni-plugins-linux-amd64-v0.8.5.tgz \
  https://github.com/containerd/containerd/releases/download/v1.3.2/containerd-1.3.2.linux-amd64.tar.gz \
  https://storage.googleapis.com/kubernetes-release/release/v1.17.2/bin/linux/amd64/kubectl \
  https://storage.googleapis.com/kubernetes-release/release/v1.17.2/bin/linux/amd64/kube-proxy \
  https://storage.googleapis.com/kubernetes-release/release/v1.17.2/bin/linux/amd64/kubelet
```

启动 kubelet 时还出现了一个小插曲:
<https://github.com/kubernetes/kubernetes/issues/73189>

插曲二 iptables FORWARD 默认 POLICY 是 DROP

## 安装 flannel

需要修改两个地方

1. <https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml> 修改这里的 podCidr, 和前面保持一致(10.200.0.0/16)
1. <https://github.com/coreos/flannel/blob/master/Documentation/troubleshooting.md#kubernetes-specific>, 这里我手动 patch 了.

## 冒烟测试

部署了一个 _kubernetes in action_ 的一个例子:

```yaml
---
apiVersion: v1
kind: ReplicationController
metadata:
  name: kubia-v1
spec:
  replicas: 3
  template:
    metadata:
      name: kubia
      labels:
        app: kubia
    spec:
      containers:
        - name: nodejs
          image: luksa/kubia:v1
          ports:
            - containerPort: 8080
              name: kubia-http

---
apiVersion: v1
kind: Service
metadata:
  name: kubia
spec:
  type: NodePort
  selector:
    app: kubia
  ports:
    - port: 80
      targetPort: 8080
```

```bash
# strrl @ worker-0 in ~ [13:08:47]
$ curl localhost:30545
This is v1 running in pod kubia-v1-th9ph

# strrl @ worker-0 in ~ [13:08:48]
$ curl localhost:30545
This is v1 running in pod kubia-v1-h8z47

# strrl @ worker-0 in ~ [13:08:49]
$ curl localhost:30545
This is v1 running in pod kubia-v1-685vm
```

## 总结

现在时间 2020-02-02 21:09 去掉中间吃饭的一个半小时，总共耗时 4.5 小时.

整理感觉下来，kubernetes 的部署除了证书和配置文件有点繁琐之外，其他地方还比较直接, 挺符合直觉的.

并不比感觉用 kubeadm 复杂很多.
