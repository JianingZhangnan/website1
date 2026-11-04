# Equivalence Classes

>[!def]- partition
>A *partition* $\Pi$ of a set $S$ is a subdivision of $S$  into nonoverlapping, nonempty subsets.

>[!def]- equivalence relation
>An equivalence relation on a set $S$ is a relation that holds between certain pairs of elements of $S$, denoted by $a\sim b$, required to be:
>- transitive: If $a\sim b$ and $b\sim c$, then $a\sim c$.
>- symmetric: If $a\sim b$, then $b\sim a$.
>- reflexive: $a\sim a$.

^equivalence-relation

>[!example]-
>- Congruence of triangles is an example of an equivalence relation on the set of triangles in the plane. If $A$, $B$, and $C$ are triangles, and if $A$ is congruent to $B$ and $B$ is congruent to $C$, then $A$ is congruent to $C$, etc.
> 
>- Conjugacy is an equivalence relation on a group. Two group elements are conjugate, $a \sim b$, if $b = gag^{-1}$ for some group element $g$. We check transitivity: Suppose that $a \sim b$ and $b \sim c$. This means that $b = g_1ag_1^{-1}$ and $c = g_2bg_2^{-1}$ for some group elements $g_1$ and $g_2$. Then $c = g_2(g_1ag_1^{-1})g_2^{-1} = (g_2g_1)a(g_2g_1)^{-1}$, so $a \sim c$.

> [!done] Equivalence relations and partitions
> An equivalence relation on a set S determines a partition of S, and conversly. 

>[!def] equivalence classes
>$$
>C_{a} = \{ b\in S \mid a\sim b \}
>$$

^equivalence-classes

## Residue Classes

来源：[[Group/Lecture notes/GT-ch02.pdf#page=3|GT-ch02，§2.3]]。下面用整数的等价类实现模加法群。

> [!def] 模 $N$ 同余、剩余类与模加法群（Example 2.10）
> 固定正整数 $N$，记 $N\mathbb Z=\{kN:k\in\mathbb Z\}$。在整数上规定 $a\sim b$ 当且仅当 $a-b\in N\mathbb Z$，称为**模 $N$ 同余**。$a$ 的**剩余类**是
>
> $$
> \bar a=[a]=a+N\mathbb Z=\{a+kN:k\in\mathbb Z\}.
> $$
>
> 全体剩余类记作 $\mathbb Z_N=\mathbb Z/N\mathbb Z$，运算规定为 $\bar a+\bar b=\overline{a+b}$。

自反性来自 $a-a=0$，对称性来自整数倍取负后仍为整数倍，传递性来自 $(a-b)+(b-c)=a-c$。

> [!done] 剩余类加法良定义并构成循环群
> 上述加法不依赖代表元的选择；$\mathbb Z_N$ 是由 $\bar1$ 生成的 $N$ 阶循环群，单位元为 $\bar0$，$\bar a$ 的逆元为 $\overline{-a}$。

若 $a'=a+kN$、$b'=b+\ell N$，则 $a'+b'=a+b+(k+\ell)N$，所以两种选择得到同一剩余类。结合律继承自整数加法；每个剩余类都可写成 $\bar0,\bar1,\ldots,\overline{N-1}$ 中的一个，且这 $N$ 个类彼此不同。

例如在 $\mathbb Z_4$ 中，$\bar3+\bar2=\bar5=\bar1$。在 $\mathbb Z_2$ 中，$\bar0$ 是偶数类，$\bar1$ 是奇数类，$\bar1+\bar1=\bar0$。把 $\bar0$ 改记成 $1$，把 $\bar1$ 改记成 $-1$，就得到 $\{1,-1\}$ 的乘法表。这个对应在 [[Group/1. Foundations/Isomorphism#具体同构|同构算例]] 中严格验证。

# Coset

> [!def] Congruence modulo a subgroup
> [[2. Homomorphism#^692053|Left coset]] is a subset be like $aH=\{ ah\, |\, h\in H \}$. $a$ is any element in $G$. The first point we need to further realize is that, $aH=bH$ can still hold even when $a\neq b$. This condition happens if and only if $b=ah$ for some $h\in H$. This reminds us defining a kind of equivalence relation (the congruence relation):
> $$
> a\sim b, \quad \text{if} \ b=ah \text{ for some } h\in H .
> $$

And there is a natural corollary:

>[!done] The left cosets of a subgroup $H$  of a group $G$ partition the group.

![[Algebra, Second Edition.pdf#page=69&rect=23,442,423,487|Algebra, Second Edition, p.69]]

The second point is as follow:

>[!done] All left cosets $aH$ of subgroup $H$ of $G$ has the same [[1. Basic Definitions and Examples#^8671d9|order]].
>Actually is equals


>[!def] index
>The number of left cosets of a subgroup is called the *index* of $H$ in $G$. The index is denoted by
>$$
>[G:H]
>$$

>[!done] Cardinality of a coset
>All left cosets $aH$ of subgroup $H$ of $G$ have the same order. Actually it equals $|H|$.

>[!done] Lagrange counting formulas and the kernel–image relation
>- $|G|=|H|\cdot [G:H]$
>- $|G|=|\text{ker}\ \varphi |\cdot |\mathrm{im}\ \varphi |$
>- $[G:\mathrm{ker\ \varphi }]=|\mathrm{im}\ \varphi |$

