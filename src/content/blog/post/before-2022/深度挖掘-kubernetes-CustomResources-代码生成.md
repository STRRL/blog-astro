---
title: '[翻译]深度挖掘 kubernetes: CustomResources 代码生成'
tags:
- kubernetes
categories: 
- kubernetes
abbrlink: 4f347fb1
date: 2020-02-27 20:42:17
---

最近在看 sample-controller 的时候注意到了其特殊的特性. code generation. 感觉还是蛮重要的, 因此翻译了这个出自于官方的 blog.

> 原文: <https://blog.openshift.com/kubernetes-deep-dive-code-generation-customresources/>

随着 kubernetes 越来越多的作为分布式应用的平台, 越来越多的项目将使用扩展点在更高的层级上构建软件. CustomResourceDefinitions(CRD) 在 kubernetes 1.7 中作为 alpha 的特性引入, 随后在 1.8 中升级为 beta. 它是许多用例的中很自然的构建模块, 尤其在实现了某种 controller(有时候成为 operator)的模式中. 此外, CRD 非常容易建立和使用.

在 Kubernetes 1.8 中, 在基于 golang 的项目中的使用也变得更加自然: 通过用户提供的 CustomResources，我们可以利用在 Kubernetes 或 OpenShift 中使用的相同代码生成工具. 这篇文章展示了代码生成器是如何工作的, 以及如何用最少的代码行将它们应用到自己的项目中, 为您提供生`deepcopy`函数, 带有类型的客户端, `lister` 和 `informer`, 所有的这些只需要调用一个 shell 脚本和一些代码中的注解. [openshift-evangelists/crd-code-generation](https://github.com/openshift-evangelists/crd-code-generation)可以作为完整的蓝图项目.

## 代码生成 - 为什么

那些在 golang 中原生使用 ThirdPartyResources 或 CustomResourceDefinition 的人可能会惊讶于突然在 Kubernetes 1.8 中需要使用 client-go code-generation. 准确的说, client-go 需要 `runtime.Object`类型(golang 中, CustomResources 必须实现 `runtime.Object` 接口)必须有 `DeepCopy`方法. 这里的代码生成通过 deepcopy-gen 生成器起作用, 可以在 k8s.io/code-generator 这个 repo 中找到.

此外, 还有一些大多数使用 CustomResources 的用户所希望的 code-generator:

- deepcopy-gen, 为所有的类型 T 创建 `func (t* T) DeepCopy() *T` 方法.
- client-gen, 为 CustomResources APIGroups 创建带有类型的 `clientsets`.
- informer-gen, 为 CustomResources 创建提供基于事件的接口 `infomer`, 用来对服务器上 CustomResources 的变化作出反应.
- lister-gen, 为 CustomResources 创建 `lister`, 为 GET 和 LIST 请求提供一个只读的缓存层.

后两者是构建 controller(有些人称之为 operator)的基础. 在接下来的文章中, 我们将会关注 controller 的细节. 这四个代码生成器为构建功能完备的, 生产级的 controller 提供了强大的基础, 和上游中 kubernetes controllers 使用的都是相同的机制和软件包.

`k8s.io/code-generator` 中还有[更多的 generator](https://github.com/kubernetes/code-generator/tree/master/cmd)来满足其他的场景, 比如, 如果你需要构建自己的 aggregated API server，除了使用带有版本的类型之外, 你还会用到一些内部的类型. `Conversion-gen` 会创建`conversions`函数在内部和外部类型之间做转换. `Defaulter-gen`将为某些字段赋默认值.

## 在你的项目中调用 Code-Generators

Kubernetes 中所有的代码生成器都是在 [k8s.io/gengo](https://github.com/kubernetes/gengo) 上实现的. 它们都会使用一些通用的命令行参数. 基本上, 所有的 generator 获取输入的 package(`--input-dirs`), 逐个类型的操作，并输出生成的代码. 这些被生成的代码:

- 要么生成到与输入文件所在的一样的目录(使用`--output-file-bas "zz_generation.deepcopy"`来定义文件名), 为了实现 deepcopy-gen.
- 或者生成到一个或多个输出的包中(使用 `--output-package`), 像 client-gen,informer-gen 和 lister-gen 做的那样(一般生成到 `pkg/client`目录).

刚才的描述听上去像是需要长时间的摆弄命令行参数才能开始, 但是所幸这不是真的: [k8s.io/code-generator](https://github.com/kubernetes/code-generator)带来了一个 shel 脚本[generate-groups.sh](https://github.com/kubernetes/code-generator/blob/master/generate-groups.sh), 可以执行 CustomResources 的 use-case 所需的繁重的脚本. 你需要做的是就是在你的项目中执行一行命令, 一般在 `hack/update-codegen.sh`:

```shell
$ vendor/k8s.io/code-generator/generate-groups.sh all \
github.com/openshift-evangelist/crd-code-generation/pkg/client \ github.com/openshift-evangelist/crd-code-generation/pkg/apis \
example.com:v1
```

它可以在像这样的目录结构下执行:
![package tree](https://tva1.sinaimg.cn/large/00831rSTly1gcdpdwi1h6j30g40dymxt.jpg)

所有的 APIs 在`pkg/apis`下, clientsets, informers, listers 在`pkg/client`下被生成. 换句话说, `pkg/client`是完全生成的. `types.go`文件旁边的`zz_generated.deepcopy.go`文件中也包含了我们需要的 CustomResourceDefinition 类型. 两者都不应该手动修改, 而是通过运行以下命令创建:

```shell
$ hack/update-codegen.sh
```

通常来说, 这个文件旁边应该也有一个 `hack/verify-codegen.sh`, 当生成文件没有更新时会以一个非 0 的状态码退出.

这对于放入 CI 脚本中非常有帮助: 如果开发人员无意中修改了文件或文件刚刚过时, CI 会注意到并"抱怨"(complain).

## 控制生成的代码 - 通过 Tags

正如上面所说的, code-generator 的一些行为是通过命令行参数来控制的(尤其是需要被处理的 package), 更多的属性是通过你 golang 文件中的 tags 来控制的.

有两种类型的 tag:

- 对 `package` 的 Global tags, 在`doc.go`中
- 对需要被处理的类型的 Local tags

一般来说 tags 长 `// +tag-name` 或者 `// +tag-name=value` 这个样子, 也就是说, 它们会被写到注释中. 由于标签的原因, 注释在文件中的位置可能是非常重要的. 有些 tag 必须直接注释在某些类型(对于 global tag 是 `package` 那一行)的上面, 有些必须和类型(或者 `package`那一行)至少用一行空行分开. 我们正在努力使它在 1.9 发布周期中更加一致且不会出错(PR [#53579](https://github.com/kubernetes/kubernetes/pull/53579) 和 ISSUE [#53893](https://github.com/kubernetes/kubernetes/issues/53893)). 做好一个空行就可能造成问题的准备. 最好是照着 example 做, 并且复制它的基本样子.

### Global Tags

Global tags 写在 package 的`doc.go`文件中. 一个典型的 `pkg/apis/<apigroup>/<version>/doc.go` 文件看起来像这样:

```go
// +k8s:deepcopy-gen=package,register


// Package v1 is the v1 version of the API.
// +groupName=example.com
package v1
```

他告诉 deepcopy-gen 默认为这个 package 下面的所有类型都创建 deepcopy 方法. 如果你有不需要或者不想要生成 deepcopy 的 type, 你可以对这个 type 使用 local tag `// +k8s:deepcopy-gen=false` 来选择性的关闭(opt-out). 如果你没有开启 package 级别的 deepcopy, 你必须对每个希望有 deepcopy 使用选择行开启(opt-in), 通过 local tag `// +k8s:deepcopy-gen=true`.

注意: 在上面例子中的 `register` 关键词会开启将 deepcopy 方法注册到 scheme. 这在 Kubernetes 1.9 中会被完全的去掉, 因为 scheme 不再负责执行 `runtime.Object`的 deepcopy. 取而代之的是只需要调用`yourobject.DeepCopy()` 或者 `yourobject.DeepCopyObject()`. 你现在已经可以, 而且也应该在 1.8 为基础的版本中这么做, 因为这种方式更快, 更不容易出错. 此外你也应该为使用这种模式的 1.9 作准备.

最后, `// +groupName=example.com` 定义了标准 API 组名称(原文: fully qualified API group name). 如果你这里写错了, client-gen 会生成错误的代码. 注意这个 tag 必须写在`package`的上一行(看 [Issue #53893](https://github.com/kubernetes/kubernetes/issues/53893)).

### Local Tags

Local Tags 可以直接写在 API type 的上方, 也可以写在其上方的第二个注释块中. 这有关于 CustomResources 的 [deep dive 系列](https://blog.openshift.com/kubernetes-deep-dive-api-server-part-3a/) API server 中可以作为示例的 [types.go](https://github.com/openshift-evangelists/crd-code-generation/blob/master/pkg/apis/example.com/v1/types.go):

```go
// +genclient
// +genclient:noStatus
// +k8s:deepcopy-gen:interfaces=k8s.io/apimachinery/pkg/runtime.Object

// Database describes a database.
type Database struct {
    metav1.TypeMeta   `json:",inline"`
    metav1.ObjectMeta `json:"metadata,omitempty"`

    Spec DatabaseSpec `json:"spec"`
}

// DatabaseSpec is the spec for a Foo resource
type DatabaseSpec struct {
    User     string `json:"user"`
    Password string `json:"password"`
    Encoding string `json:"encoding,omitempty"`
}

// +k8s:deepcopy-gen:interfaces=k8s.io/apimachinery/pkg/runtime.Object

// DatabaseList is a list of Database resources
type DatabaseList struct {
    metav1.TypeMeta `json:",inline"`
    metav1.ListMeta `json:"metadata"`

    Items []Database `json:"items"`
}
```

注意我们已经为所有的类型默认开启了 deepcopy, 所以我们可以使用选择性关闭(opt-out). 但是这些类型, 都是 API 类型, 它们需要 deepcopy. 也就是说, 我们不需要在示例的 [types.go](https://github.com/openshift-evangelists/crd-code-generation/blob/master/pkg/apis/example.com/v1/types.go)中开关 deepcopy, 只需要在[doc.go](https://github.com/openshift-evangelists/crd-code-generation/blob/master/pkg/apis/example.com/v1/doc.go)中以 package 级别开启.

### RUNTIME.OBJECT AND DEEPCOPYOBJECT

有一个特殊的 deepcopy tag 需要特殊说明:

```go
// +k8s:deepcopy-gen:interfaces=k8s.io/apimachinery/pkg/runtime.Object
```

如果你已经尝试 用 Kubernetes 1.8 中的 client-go 使用 CustomResources(有些人可能已经遇到了, 因为它们意外地使用了 master 分支上的 k8s.io/apimachinery), 你会遇到编译错误, CustomResources 的类型没有实现`runtimeObject`因为`DeepCopyObject() runtime.Object`没有在你的类型中定义. 原因是由于在 1.8 中, `runtime.Object`接口[用了这个方法签名进行扩展](https://github.com/kubernetes/apimachinery/blob/7089aafd1ef57551192f6ec14c5ed1f49494ccd2/pkg/runtime/interfaces.go#L237), 因此每个`runtime.Object`都必须实现`DeepCopyObject`. 实现`DeepCopyObject() runtime.Object`比较琐碎:

```go
func (in *T) DeepCopyObject() runtime.Object {
    if c := in.DeepCopy(); c != nil {
        return c
    } else {
        return nil
    }
}
```

幸运的是, 你不需要为每个类型都实现一遍, 只需要在你的顶级 API 类型上加这个 local tag:

```go
// +k8s:deepcopy-gen:interfaces=k8s.io/apimachinery/pkg/runtime.Object
```

在我们的例子中 `Database`和`DatabaseList`都是顶级类型，因为它们会作为`runtime.Object`使用. 根据经验, 那些嵌入了`metav1.TypeMeta`的是顶级类型. 另外, 这些也是 clients 为了使用 client-gen 创建的类型.

注意, `// +k8s:deepcopy-gen:interfaces`标签可以, 也应该在你的类型中有类型为 interface 的域的时候使用, 例如 `field SomeInterface`. 这样 `// +k8s:deepcopy-gen:interfaces=example.com/pkg/apis/example.SomeInterface`会生成一个`DeepCopySomeInterface() SomeInterface`方法. 这允许它以类型正确的方式对这些字段进行深度复制.

### CLIENT-GEN TAGS

最后, 有一些控制 client-gen 的 tag, 我们的例子中用了两个:

```go
// +genclient
// +genclient:noStatus
```

第一个 tag 告诉 client-gen 为这个类型创建一个 client. 注意你不需要也不能把它放在`List`类型的上方.

第二个 tag 告诉 client-gen 这个类型没有通过`/status`子资源做 spec-status 的分离. 结果就是你不能在 client 中使用`UpdateStatus`方法(client-gen 只要在你的 struct 中看到`Status`, 就会直接生成这个). `/status` 子资源仅在 1.8 中对于原生(使用 golang)实现的资源才可用. 但是随着[PR 913](https://github.com/kubernetes/community/pull/913)中为 CustomResources 讨论子资源, 这种情况可能很快就会改变.

对于集群级别的资源, 你需要使用这个 tag:

```go
// +genclient:nonNamespaced
```

对于某些特殊目的的 client, 你可能还希望详细控制 client 可以使用哪些 HTTP 方法. 这可以用一些 tag 来完成, 比如:

```go
// +genclient:noVerbs
// +genclient:onlyVerbs=create,delete
// +genclient:skipVerbs=get,list,create,update,patch,delete,deleteCollection,watch
// +genclient:method=Create,verb=create,result=k8s.io/apimachinery/pkg/apis/meta/v1.Status
```

前三个 tag 很明显能看出是什么意思, 但是最后一个需要额外说明下. 使用这个 tag 的类型是 create-only 的, 而且返回的并不是 API type 本身, 而是`metav1.Status`. 对于 CustomResources 这没有很大的意义, 但是对于用户提供的使用 golang 写的 API server, 这写资源可以存在,而且也这么做了, 例如 OpenShift API.

## A Main Function Using the Types Clients

在 Kubernetes 1.7 或者更早以前, 大部分的例子都是使用的[client-go dynamic client](https://github.com/kubernetes/client-go/tree/master/dynamic)操作 CustomResources. 原生的 Kubernetes API 类型有更方便的 typed client 已经很久了. 这在 1.8 中会改变: 上面提到的 client-gen 可以为你的自定义 type 生成原生的, 功能完整的, 而且易用的 typed client. 事实上, client-gen 不知道他操作的是 CustomResources 还是 kubernetes 原生类型.

因此, 使用这种客户端和使用 kubernetes client-go 客户端是完全等价的. 这里有一个非常简单的例子:

```go
import (
    ...
    metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
    "k8s.io/client-go/tools/clientcmd"
    examplecomclientset "github.com/openshift-evangelist/crd-code-generation/pkg/client/clientset/versioned"
)

var (
    kuberconfig = flag.String("kubeconfig", "", "Path to a kubeconfig. Only required if out-of-cluster.")
    master      = flag.String("master", "", "The address of the Kubernetes API server. Overrides any value in kubeconfig. Only required if out-of-cluster.")
)

func main() {
    flag.Parse()

    cfg, err := clientcmd.BuildConfigFromFlags(*master, *kuberconfig)
    if err != nil {
        glog.Fatalf("Error building kubeconfig: %v", err)
    }

    exampleClient, err := examplecomclientset.NewForConfig(cfg)
    if err != nil {
        glog.Fatalf("Error building example clientset: %v", err)
    }

    list, err := exampleClient.ExampleV1().Databases("default").List(metav1.ListOptions{})
    if err != nil {
        glog.Fatalf("Error listing all databases: %v", err)
    }

    for _, db := range list.Items {
        fmt.Printf("database %s with user %q\n", db.Name, db.Spec.User)
    }
}
```

它需要一个 kubeconfig 文件才能工作, 事实上这和 kubectl, kuberntes clients 的用法是一样的.

与动态客户端使用的旧版 TPR(Third Party Resources) 或者 CustomResources 相比, 你不需要做类型转换. 取而代之的, client 调用看上去就像本地调用一样:

```go
list, err := exampleClient.ExampleV1().Databases("default").List(metav1.ListOptions{})
```

这个例子中的结果是 `DatabaseList`类型, 代表你集群里的所有的数据库. 如果你把类型切换到 cluster-wide(没有 namespace; 不要忘记使用`// +genclient:nonNamespaced`告诉 client-gen), 这个调用会变成:

```go
list, err := exampleClient.ExampleV1().Databases().List(metav1.ListOptions{})
```

## 在 Golang 中以编程方式创建一个 CustomResourceDefinition

这个问题经常出现, 简单说下在 golang 代码中怎么以编程的方式创建一个 CRD.

client-gen 总是创建出所谓的 clientsets. Clientsets 将一个或多个 API 组捆绑到一个客户端中. 通常来说, 这些 API group 在一个 repo 里, 而且被放置在一个 package 下. 例如, 这篇文章示例中的`pkg/apis`, 或者 Kubernetes 中的 k8s.io/api.

CustomResourceDefinitions 在这个 repo[kubernetes/apiextensions-apiserver repository](https://github.com/kubernetes/apiextensions-apiserver)中提供. 这个 API server(也可以独立启动)是嵌入到 kube-apiserver 的, 所以 CRD 在每个 kubernetes 集群中都是可用的. 但是操作 CRD 的 client 代码被生成到了 apiextensions-apiserver 这个 repo, 当然也需要用到 client-gen. 在读了这篇文章后, 在[kubernetes/apiextensions-apiserver/tree/master/pkg/client](https://github.com/kubernetes/apiextensions-apiserver/tree/master/pkg/client)中找到客户端也不应该惊讶, 也不因该觉得为了创建 CRD 而创建一个新的 client 示例是意外的.

```go
import (
    ...
    apiextensionsclientset "k8s.io/apiextensions-apiserver/pkg/client/clientset/clientset”
)

apiextensionsClient, err := apiextensionsclientset.NewForConfig(cfg)
...
createdCRD, err := apiextensionsClient.ApiextensionsV1beta1().CustomResourceDefinitions().Create(yourCRD)
```

注意在你建立了新的 CRD 后, 你需要等待`Established`条件. 只有这样以后, kube-apiserver 才会处理这个资源. 如果你没有等这个条件, 所有的 CustomResources 相关的操作都会返回 404.

## 更多的资料

目前 kubernetes 生成器的文档还有很多改进的空间, 也非常欢迎任何帮助. 它们刚刚从 kubernetes 中把代码抽取到[k8s.io/code-generator](https://github.com/kubernetes/code-generator), 为了让 CustomResources 的用户使用. 他的文档当然会随着时间的推移而不断改进, 并且此博客文章也旨在为此做出贡献.
有关不同生成器的更多信息, 通常最好查看 Kubernetes 本身内的示例(例如，在 [k8s.io/api](https://github.com/kubernetes/api) 中), 有许多高级用例的 [OpenShift](https://github.com/openshift/origin), 以及生成器本身:

- [Deepcopy-gen](https://github.com/kubernetes/gengo/tree/master/examples/deepcopy-gen)可以从它的 [main.go](https://github.com/kubernetes/gengo/blob/master/examples/deepcopy-gen/main.go#L17)文件中获取一些文档.
- [Client-gen](https://github.com/kubernetes/code-generator/tree/master/cmd/client-gen)可以从[这里](https://github.com/kubernetes/community/blob/master/contributors/devel/generating-clientset.md)获取一些文档.
- [Informer-gen](https://github.com/kubernetes/code-generator/tree/master/cmd/informer-gen)和[lister-gen](https://github.com/kubernetes/code-generator/tree/master/cmd/lister-gen)目前没有更多的文档, 但是 [generate-groups.sh](https://github.com/kubernetes/code-generator/blob/master/generate-groups.sh)展示了它们是如何被调用的.

文章中的所有例子都是可以被作为功能完整的 repo 获取的, 可以轻松的用作你自己实验的蓝图:

- <https://github.com/openshift-evangelists/crd-code-generation>.
