---
tags:
  - 待整理
aliases:
  - 同构与自同构
---

# Isomorphism

来源：[[Group/Lecture notes/GT-ch03.pdf|GT-ch03]] 中关于同构、自同构、具体同构及换基的内容。

## 同构与自同构

> [!def] 同构、自同构与自同构集合（Definition 3.4）
> 双射的[[Group/1. Foundations/2. Homomorphism#^group-homomorphism|群同态]]称为**同构**（isomorphism）。存在同构 $G\to G'$ 时记 $G\cong G'$。
> 从群 $G$ 到自身的同构称为**自同构**（automorphism），所有自同构组成的集合记为 $\operatorname{Aut}(G)$。

一个同构不只匹配元素，还匹配全部乘法。一个集合之间的任意双射不一定是群同构。

> [!done] 用核与像检验同构（Proposition 3.10）
> 同态 $\varphi:G\to G'$ 是同构，当且仅当 $\ker\varphi=\{e\}$ 且 $\operatorname{im}\varphi=G'$。

第一项由[[Group/1. Foundations/2. Homomorphism#^injective-kernel|单射判据]]处理，第二项就是满射。计算时必须说明目标群：同一个公式以整个 $G'$ 为目标可能不满射，以自身的像为目标则总满射。

> [!done] 同构的逆与同构关系（Proposition 3.5）
> 同构 $\varphi:G\to G'$ 的逆映射 $\varphi^{-1}:G'\to G$ 也是同构。同构关系具有自反性、对称性、传递性，因此是等价关系。

逆映射已是双射，只需验证它保持乘法。任取 $g'_1,g'_2\in G'$，由满射性可写成 $g'_j=\varphi(g_j)$，于是

$$
\begin{aligned}
\varphi^{-1}(g'_1g'_2)
&=\varphi^{-1}\bigl(\varphi(g_1)\varphi(g_2)\bigr)\\
&=\varphi^{-1}(\varphi(g_1g_2))
=g_1g_2=\varphi^{-1}(g'_1)\varphi^{-1}(g'_2).
\end{aligned}
$$

恒等映射给出自反性，逆同构给出对称性，复合两个同构给出传递性。等价关系的一般定义见 [[Group/1. Foundations/Cosets#^equivalence-relation]]。

> [!done] 自同构群（Proposition 3.6）
> $\operatorname{Aut}(G)$ 在映射复合下构成群，其单位元是恒等映射，逆元是逆映射。

两个自同构复合仍是双射且保持乘法，因此封闭；逆映射是自同构已由 Proposition 3.5 证明；结合律来自函数复合。乘积 $\psi\varphi$ 的约定是先作 $\varphi$，再作 $\psi$。

## 循环群的全部自同构（Example 3.7）

> [!def] 剩余类上的乘法映射
> 固定 $N\ge1$ 和整数 $k$，定义 $m_k:\mathbb Z_N\to\mathbb Z_N$ 为 $m_k(\bar x)=\overline{kx}$。这里源群和目标群的运算都是模 $N$ 加法。

将 $x$ 换成 $x+N\ell$，$kx$ 只改变 $kN\ell$，所以映射良定义。又因 $k(x+y)=kx+ky$，它是同态；$m_{k+N}=m_k$，$m_1$ 为恒等映射，$m_0$ 将所有元素送到 $\bar0$。

> [!done] 循环群的自同构判据与完整列表
> $m_k$ 是 $\mathbb Z_N$ 的自同构当且仅当 $\gcd(k,N)=1$，并且每个自同构都是某个 $m_k$。因此
>
> $$
> \operatorname{Aut}(\mathbb Z_N)
> =\{m_k:0\le k<N,\ \gcd(k,N)=1\},\qquad
> m_k\circ m_\ell=m_{k\ell}.
> $$
>
> $\gcd(k,N)$ 表示非负最大公约数；$N=1$ 时得到平凡自同构群。

令 $d=\gcd(k,N)$。若 $d>1$，取 $x=N/d$，则 $0<x<N$，但 $kx=(k/d)N$，所以 $m_k(\bar x)=\bar0$ 而 $\bar x\ne\bar0$，不单射。若 $d=1$，$N\mid kx$ 时，$N$ 的每个素数幂因子都必须来自 $x$，因此 $N\mid x$；核只含 $\bar0$，所以单射。有限集合到自身的单射必为满射，故是自同构。

最后，任何同态都由 $\varphi(\bar1)=\bar k$ 决定，因为 $\bar x$ 是 $\bar1$ 的整数倍，必有 $\varphi(\bar x)=\overline{kx}$。

$N=4$ 时可逐项核对：

| $\bar x$ | $\bar0$ | $\bar1$ | $\bar2$ | $\bar3$ |
| --- | --- | --- | --- | --- |
| $m_3(\bar x)$ | $\bar0$ | $\bar3$ | $\bar2$ | $\bar1$ |
| $m_2(\bar x)$ | $\bar0$ | $\bar2$ | $\bar0$ | $\bar2$ |

$m_3$ 是自同构，$m_2$ 的核为 $\{\bar0,\bar2\}$，像也是 $\{\bar0,\bar2\}$。

## 具体同构

### 剩余类与单位根（Example 3.11）

> [!done] 剩余类群与单位根群同构
> 映射 $\varphi:\mathbb Z_N\to\mu_N$，$\bar r\mapsto e^{2\pi ir/N}$，是群同构。

将 $r$ 改成 $r+N\ell$，指数多出 $2\pi i\ell$，函数值不变，所以对剩余类良定义。并且

$$
\varphi(\bar r+\bar s)=e^{2\pi i(r+s)/N}
=e^{2\pi ir/N}e^{2\pi is/N}=\varphi(\bar r)\varphi(\bar s).
$$

所有单位根都出现，故满射；$e^{2\pi ir/N}=1$ 等价于 $N\mid r$，所以核只有 $\bar0$。这严格说明加法记法与乘法记法表示同一个循环群。

### 平面转动与相位（Example 3.14）

> [!done] $SO(2)$ 与 $U(1)$ 同构
> 用 [[Group/1. Foundations/1. Basic Definitions and Examples#二维转动、圆群与三维球面|二维转动矩阵]] 的参数化，映射 $\varphi(R(\phi))=e^{i\phi}$ 给出 $SO(2)\cong U(1)$。

同一个 $R(\phi)$ 的角度只相差 $2\pi$ 整数倍，$e^{i\phi}$ 不变，所以良定义。由转动矩阵的乘法公式，$\varphi(R(\phi_1)R(\phi_2))=e^{i(\phi_1+\phi_2)}$，故为同态。$e^{i\phi}=1$ 时 $R(\phi)=I_2$，核平凡；任意单位复数都有这个形式，故满射。

三维转动的情况见 [[Group/1. Foundations/SU(2) and SO(3)]]；该映射有两个原像，因此不能将它直接当成上面这种同构。

## 从可逆线性变换到可逆矩阵（Example 3.20）

> [!def] 线性空间的一般线性群与坐标映射
> 设 $V$ 为 $\kappa$ 上的 $n$ 维向量空间。$GL(V)$ 是 $V\to V$ 的所有可逆线性映射在复合下组成的群。
> 选有序基 $b=(e_1,\ldots,e_n)$，用
>
> $$
> \tau(e_i)=\sum_{j=1}^{n}e_jT_b(\tau)_{ji}
> $$
>
> 定义 $\tau$ 的矩阵 $T_b(\tau)$，并记坐标映射为 $\varphi_b:GL(V)\to GL(n,\kappa)$，$\tau\mapsto T_b(\tau)$。

第 $i$ 列记录 $e_i$ 的像。结合律来自函数复合，恒等映射与逆映射都是线性的，所以 $GL(V)$ 确实构成群。

> [!done] 选基给出群同构
> $\varphi_b$ 是群同构，特别地
>
> $$
> T_b(\tau_1\tau_2)=T_b(\tau_1)T_b(\tau_2),\qquad
> GL(V)\cong GL(n,\kappa).
> $$

设 $v=\sum_i v_i e_i$，先作 $\tau_2$ 再作 $\tau_1$：

$$
\begin{aligned}
\tau_1(\tau_2v)
&=\sum_{i,j}v_iT_b(\tau_2)_{ji}\tau_1(e_j)\\
&=\sum_{i,j,k}e_kT_b(\tau_1)_{kj}T_b(\tau_2)_{ji}v_i.
\end{aligned}
$$

另一方面，按矩阵的定义，$(\tau_1\tau_2)(v)=\sum_{i,k}e_kT_b(\tau_1\tau_2)_{ki}v_i$。对所有坐标 $v_i$ 比较，利用基线性无关，就得到矩阵乘法公式。

每个可逆矩阵都能按给出的列定义一个可逆线性映射，故满射。若 $T_b(\tau)=I_n$，则每个 $\tau(e_i)=e_i$，由线性性 $\tau=\operatorname{id}_V$，所以核平凡，故单射。

## 换基为何表现为共轭

> [!def] 本页的换基矩阵约定
> 对另一组基 $b'=(e'_1,\ldots,e'_n)$，定义可逆矩阵 $S$ 为
>
> $$
> e_i=\sum_j e'_jS_{ji}.
> $$
>
> 即 $S$ 的第 $i$ 列是旧基向量 $e_i$ 在新基 $b'$ 中的坐标，因此 $[v]_{b'}=S[v]_b$。

> [!done] 同一线性变换的换基公式
> 在上述约定下，$T_{b'}(\tau)=S\,T_b(\tau)\,S^{-1}$。

对任意 $v$，有 $[\tau v]_{b'}=S[\tau v]_b=ST_b(\tau)[v]_b=ST_b(\tau)S^{-1}[v]_{b'}$，比较坐标即可。若把 $S$ 定义成相反方向的换基矩阵，公式中的 $S$ 与 $S^{-1}$ 也随之对调；不能脱离定义背诵次序。

作为补充算例，令 $V=\mathbb R^2$，旧基为 $e_1,e_2$，新基取 $e'_1=e_1$、$e'_2=e_1+e_2$，则

$$
S=\begin{pmatrix}1&-1\\0&1\end{pmatrix},\qquad
T_b(\tau)=\begin{pmatrix}2&0\\0&3\end{pmatrix}.
$$

于是 $T_{b'}(\tau)=ST_b(\tau)S^{-1}=\begin{pmatrix}2&-1\\0&3\end{pmatrix}$。直接检查第二列：$\tau(e'_2)=2e_1+3e_2=-e'_1+3e'_2$，确实给出 $(-1,3)^T$。

矩阵实现的定义、由生成元构造同态的判据，以及整数群、两元素群、三次单位根和 $D_4$ 的矩阵算例，接在 [[Group/1. Foundations/2. Homomorphism#Matrix Realizations|同态笔记]] 中。
