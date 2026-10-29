---
title: 电磁场的量子化：从真实谐振腔实验到 Hamiltonian
date: 2026-10-29
tags:
  - 量子力学
  - 电动力学
  - 量子光学
---

# 电磁场的量子化：从真实谐振腔实验到 Hamiltonian

## 1. 实验室里有什么？

2007 年，Gleyzes、Kuhr、Guerlin、Haroche 等人在巴黎高等师范学院的实验室里，把微波储存在一个由两面超导铌镜组成的谐振腔中，并用逐个穿过腔体的铷原子探测腔内的电磁场。腔体的工作频率约为 $51.1\,\mathrm{GHz}$，镜间距约为 $2.7\,\mathrm{cm}$，温度为 $0.8\,\mathrm K$。测得的腔场能量衰减时间约为 $0.13\,\mathrm s$。

这里先提出一个完全经典的任务：

> 给定腔体的金属边界，求出其中的电场、磁场、允许的振动频率，以及腔内储存的电磁能量。然后再考虑如何通过原子探测这些电磁场。

实际实验中的镜面有曲率，电磁场具有三维空间分布。为了把 Maxwell 方程一直推导到 Hamiltonian，下面把它简化成**一维理想谐振腔**。简化模型保留了两项关键物理内容：**边界条件选出简正模式；一个简正模式具有随时间变化的振幅。** 模型中计算的 $\omega_n=n\pi c/L$ 只适用于理想一维腔，不能直接拿 $L=2.7\,\mathrm{cm}$ 的实际镜间距去复原实验的 $51.1\,\mathrm{GHz}$ 三维谐振频率。

## 2. 从 Maxwell 方程寻找腔内的场

设两块理想导体镜面分别位于 $x=0$ 和 $x=L$，在垂直于 $x$ 方向上取有效横截面积 $S$。腔内是真空，没有自由电荷与电流。Maxwell 方程为

$$
\begin{aligned}
\nabla\cdot\mathbf E&=0,&\qquad \nabla\cdot\mathbf B&=0,\\
\nabla\times\mathbf E&=-\dfrac{\partial\mathbf B}{\partial t},&
\nabla\times\mathbf B&=\mu_0\varepsilon_0\dfrac{\partial\mathbf E}{\partial t}.
\end{aligned}
$$

引入矢势 $\mathbf A$ 与标势 $\phi$：

$$
\mathbf B=\nabla\times\mathbf A,\qquad
\mathbf E=-\dfrac{\partial\mathbf A}{\partial t}-\nabla\phi.
$$

在无源横向辐射场中，选取 Coulomb 规范 $\nabla\cdot\mathbf A=0$，并在本模型中取 $\phi=0$，于是

$$
\mathbf E=-\partial_t\mathbf A,\qquad
\mathbf B=\nabla\times\mathbf A.
$$

将其代入 Ampère–Maxwell 方程：

$$
\nabla\times(\nabla\times\mathbf A)
=-\dfrac{1}{c^2}\dfrac{\partial^2\mathbf A}{\partial t^2},
\qquad c^2=\dfrac{1}{\mu_0\varepsilon_0}.
$$

使用恒等式 $\nabla\times(\nabla\times\mathbf A)=\nabla(\nabla\cdot\mathbf A)-\nabla^2\mathbf A$，得到

$$
\boxed{\dfrac{\partial^2\mathbf A}{\partial t^2}=c^2\nabla^2\mathbf A.}
$$

只考虑沿 $x$ 传播、沿 $y$ 偏振的场，令 $\mathbf A=A_y(x,t)\mathbf e_y$。此时 $\nabla\cdot\mathbf A=0$ 自动满足，而波动方程化为

$$
\dfrac{\partial^2 A_y}{\partial t^2}
=c^2\dfrac{\partial^2 A_y}{\partial x^2}.
$$

## 3. 导体边界怎样选出简正模式？

理想导体表面的**切向电场为零**。对两块垂直于 $x$ 的镜面，$E_y$ 是切向分量，所以

$$
E_y(0,t)=E_y(L,t)=0.
$$

由 $E_y=-\partial_t A_y$，对随时间振荡的部分可以取 $A_y(0,t)=A_y(L,t)=0$。寻找分离变量解

$$
A_y(x,t)=q(t)u(x).
$$

代入波动方程并除以 $qu$：

$$
\dfrac{\ddot q(t)}{c^2q(t)}
=\dfrac{u''(x)}{u(x)}=-k^2.
$$

空间方程、时间方程分别为

$$
u''+k^2u=0,\qquad
\ddot q+c^2k^2q=0.
$$

空间通解 $u(x)=C\sin(kx)+D\cos(kx)$。由 $u(0)=0$ 得 $D=0$；由 $u(L)=0$ 得 $\sin(kL)=0$。因此

$$
\boxed{k_n=\dfrac{n\pi}{L},\quad
u_n(x)=\sin\left(\dfrac{n\pi x}{L}\right),\quad
\omega_n=\dfrac{n\pi c}{L},\quad n=1,2,\ldots}
$$

频率 $\omega_n$ 在这里已经离散，但到目前为止全部使用了**经典** Maxwell 方程和边界条件。离散的简正频率尚未意味着能量离散。

挑出一个频率为 $\omega=ck$ 的模式，吸收空间函数的常数因子到振幅中，写成

$$
\boxed{\mathbf A(x,t)=q(t)\sin(kx)\,\mathbf e_y,\qquad k=\dfrac{n\pi}{L}.}
$$

这就是后面要使用的单模式矢势。$x$ 仍是连续的空间坐标，$q(t)$ 是一个普通的、随时间变化的经典数。

## 4. 从矢势直接计算实际电场和磁场

由矢势的定义，

$$
\begin{aligned}
\mathbf E(x,t)
&=-\dot q(t)\sin(kx)\,\mathbf e_y,\\
\mathbf B(x,t)
&=kq(t)\cos(kx)\,\mathbf e_z.
\end{aligned}
$$

电场在 $\sin(kx)$ 的波腹处最大；磁场在 $\cos(kx)$ 的波腹处最大。两者在空间上错开四分之一波长。代入 Maxwell 方程得到

$$
\ddot q+\omega^2q=0,\qquad \omega=ck.
$$

例如，$q(t)=q_0\cos(\omega t+\delta)$ 时，

$$
\begin{aligned}
E_y(x,t)&=\omega q_0\sin(\omega t+\delta)\sin(kx),\\
B_z(x,t)&=kq_0\cos(\omega t+\delta)\cos(kx).
\end{aligned}
$$

电场能量与磁场能量会随时间交替变化。现在可以计算腔体中真正存储了多少能量。

## 5. 通过 Maxwell 电磁能量推导经典 Hamiltonian

真空电磁场的能量密度为

$$
u_{\mathrm{EM}}=\dfrac{\varepsilon_0}{2}|\mathbf E|^2
+\dfrac{1}{2\mu_0}|\mathbf B|^2.
$$

对腔体积分得到总能量

$$
H_{\mathrm{EM}}
=\dfrac{S}{2}\int_0^L
\left[\varepsilon_0\dot q^{\,2}\sin^2(kx)
+\dfrac{k^2q^2}{\mu_0}\cos^2(kx)\right]dx.
$$

因为 $kL=n\pi$，

$$
\int_0^L\sin^2(kx)\,dx
=\int_0^L\cos^2(kx)\,dx
=\dfrac{L}{2},
$$

所以

$$
\begin{aligned}
H_{\mathrm{EM}}
&=\dfrac{\varepsilon_0SL}{4}\dot q^{\,2}
+\dfrac{SLk^2}{4\mu_0}q^2\\
&=\dfrac{\varepsilon_0SL}{4}
\left(\dot q^{\,2}+\omega^2q^2\right),
\end{aligned}
$$

最后一步使用了 $k^2/\mu_0=\varepsilon_0\omega^2$。

定义一个便于书写的参数

$$
m_{\mathrm{eff}}\equiv\dfrac{\varepsilon_0SL}{2}.
$$

于是

$$
\boxed{H_{\mathrm{EM}}
=\dfrac{m_{\mathrm{eff}}}{2}\dot q^{\,2}
+\dfrac{m_{\mathrm{eff}}\omega^2}{2}q^2.}
$$

这个 $m_{\mathrm{eff}}$ 仅是电磁场模式的归一化系数，并没有一个质量为 $m_{\mathrm{eff}}$ 的物体在腔中运动。

Hamiltonian 应当表示为正则坐标与正则动量的函数，所以下一步还需要确定 $q$ 的共轭动量。

## 6. 为什么正则动量是 $p=m_{\mathrm{eff}}\dot q$？

真空电磁场的 Lagrangian 为

$$
\mathcal L_{\mathrm{EM}}
=\dfrac{\varepsilon_0}{2}|\mathbf E|^2
-\dfrac{1}{2\mu_0}|\mathbf B|^2.
$$

将单模式的 $\mathbf E,\mathbf B$ 代入并对空间积分：

$$
\begin{aligned}
L_{\mathrm{mode}}
&=\int_V\mathcal L_{\mathrm{EM}}\,d^3r\\
&=\dfrac{\varepsilon_0SL}{4}\dot q^{\,2}
-\dfrac{\varepsilon_0SL\omega^2}{4}q^2\\
&=\dfrac{m_{\mathrm{eff}}}{2}
\left(\dot q^{\,2}-\omega^2q^2\right).
\end{aligned}
$$

由正则动量的定义，

$$
\boxed{p\equiv\dfrac{\partial L_{\mathrm{mode}}}{\partial\dot q}
=m_{\mathrm{eff}}\dot q.}
$$

对 $q$ 和 $p$ 作 Legendre 变换：

$$
\begin{aligned}
H(q,p)
&=p\dot q-L_{\mathrm{mode}}\\
&=\dfrac{p^2}{2m_{\mathrm{eff}}}
+\dfrac{m_{\mathrm{eff}}\omega^2q^2}{2}.
\end{aligned}
$$

这个 Hamiltonian 的两个变量有明确的电磁学来源：$q$ 是矢势模式的振幅，$p$ 与振幅的时间导数成正比。检验 Hamilton 方程：

$$
\dot q=\dfrac{\partial H}{\partial p}
=\dfrac{p}{m_{\mathrm{eff}}},\qquad
\dot p=-\dfrac{\partial H}{\partial q}
=-m_{\mathrm{eff}}\omega^2q.
$$

它们立即给出 $\ddot q+\omega^2q=0$，与 Maxwell 波动方程完全一致。

还可以改用归一化坐标

$$
Q=\sqrt{m_{\mathrm{eff}}}\,q,\qquad
P=\dfrac{p}{\sqrt{m_{\mathrm{eff}}}}.
$$

这保持了正则结构：$\{Q,P\}=1$（Poisson 括号）。于是

$$
\boxed{H(Q,P)=\dfrac12P^2+\dfrac12\omega^2Q^2.}
$$

一个电磁场简正模式在经典 Hamiltonian 力学中，恰好是一个简谐振子。这里的“振子坐标”指的是整个空间模式的振幅 $Q$，在腔体中找不到一个对应的振动小球。

## 7. 多个模式也可以用同样的方法处理

理想一维腔的矢势可以写成

$$
A_y(x,t)=\sum_{n=1}^{\infty}q_n(t)\sin(k_nx).
$$

两个不同模式满足正交关系

$$
\int_0^L\sin(k_nx)\sin(k_mx)\,dx
=\dfrac{L}{2}\delta_{nm}
$$

以及相应的余弦正交关系。把模式展开代入电磁能量积分，包含 $q_nq_m$ 或 $\dot q_n\dot q_m$ 的交叉项在 $n\ne m$ 时全部消失，因此

$$
\boxed{H_{\mathrm{EM}}
=\sum_n\left[\dfrac{P_n^2}{2}
+\dfrac{\omega_n^2Q_n^2}{2}\right].}
$$

这是**无限多个彼此独立的经典简谐振子**，分别对应不同的场模式。如果激发了多个模式，电磁场在空间中仍然由它们的连续函数叠加而成。

到这里，可以完全在经典理论内部停下：边界条件、谐振频率、驻波形状、能量、正则动量、Hamiltonian 都已经求出。

## 8. 经典理论还会预言什么？

如果给腔体接上微波输入端，以 $51.1\,\mathrm{GHz}$ 附近的频率驱动，它会产生共振。停止驱动后，真实镜面会吸收少量能量，腔场逐渐衰减。用振幅阻尼模型表示为

$$
\ddot Q+\kappa\dot Q+\omega^2Q=0.
$$

在弱阻尼 $\kappa\ll\omega$ 下，振幅的包络随 $e^{-\kappa t/2}$ 衰减，场能量的周期平均值随

$$
\boxed{\overline H(t)=\overline H(0)e^{-\kappa t}}
$$

变化。这个结论解释了经典的腔体振铃实验（ring-down）。

同时，对于固定频率 $\omega$，经典场的初始振幅可以连续选择：

$$
Q(t)=Q_0\cos(\omega t+\delta),\qquad
H=\dfrac12\omega^2Q_0^2.
$$

$Q_0$ 可以任意接近零，$H$ 也可以取任意非负实数。经典 Maxwell 理论没有给这个模式指定一个最小的非零能量单位。

## 9. 实验在什么地方提出了新问题？

Haroche 团队进一步做了一个特殊的实验：向高品质微波腔中逐个发送处于特定量子态的 Rydberg 原子。原子经过腔体前后还穿过 Ramsey 干涉装置，腔内的电磁场使原子的量子相位发生偏移。巧妙选择失谐与相互作用时间后，探测原子的末态可以区分腔内的**零光子**与**一个光子**。

关键是：这项测量在理想情况下不吸收所探测的光子，因此称为量子无破坏测量（quantum non-demolition，QND）。可以让许多原子先后询问同一个腔，获得随时间变化的光子数记录。2007 年的记录中，读数在零光子与一个光子之间随机切换；一个光子能够保持一段时间，再突然消失。

离散的原子探测结果本身还不足以建立电磁场的能量量子化，因为原子探测器也具有量子性。这里额外重要的事实是：**许多次非吸收式测量给出一致的腔场光子数，并揭示其量子跃迁及依赖光子数的相互作用。** 经典场的连续振幅 $Q,P$ 无法提供这些光子数本征态以及相应的测量概率和跃迁规律。

实验实际使用量子原子作为探针；要定量解释整个原子—腔场系统，需要一个能同时描述原子量子态与腔场量子态的 Hamiltonian。此时才有必要进一步改变对场模式振幅的描述。

原始实验：S. Gleyzes *et al.*, “[Quantum jumps of light recording the birth and death of a photon in a cavity](https://doi.org/10.1038/nature05589)”, *Nature* **446**, 297–300 (2007)。

## 10. 对经典模式实施正则量子化

现在回到已经由 Maxwell 理论推导出来的 Hamiltonian：

$$
H(Q,P)=\dfrac12P^2+\dfrac12\omega^2Q^2.
$$

将正则变量提升为作用于模式 Hilbert 空间的自伴算符：

$$
Q\longmapsto\hat Q,\qquad
P\longmapsto\hat P,\qquad
\boxed{[\hat Q,\hat P]=i\hbar\hat I.}
$$

这一步是**正则量子化规则**，由量子力学的物理公设和实验验证支持；对 Maxwell 方程作代数变形不会自动产生这个对易关系。

量子化后的单模式 Hamiltonian 为

$$
\hat H=\dfrac12\hat P^2+\dfrac12\omega^2\hat Q^2.
$$

按照 [[谐振子]] 中的方法定义

$$
\boxed{
\begin{aligned}
\hat a&=\sqrt{\dfrac{\omega}{2\hbar}}\hat Q
+\dfrac{i}{\sqrt{2\hbar\omega}}\hat P,\\
\hat a^\dagger&=\sqrt{\dfrac{\omega}{2\hbar}}\hat Q
-\dfrac{i}{\sqrt{2\hbar\omega}}\hat P.
\end{aligned}}
$$

利用 $[\hat Q,\hat P]=i\hbar$ 可以逐项检验

$$
\begin{aligned}
[\hat a,\hat a^\dagger]
&=\dfrac{1}{2\hbar\omega}
[\omega\hat Q+i\hat P,\omega\hat Q-i\hat P]\\
&=\dfrac{-2i\omega}{2\hbar\omega}[\hat Q,\hat P]=1.
\end{aligned}
$$

反解这两个定义：

$$
\hat Q=\sqrt{\dfrac{\hbar}{2\omega}}
(\hat a+\hat a^\dagger),\qquad
\hat P=-i\sqrt{\dfrac{\hbar\omega}{2}}
(\hat a-\hat a^\dagger).
$$

代回 Hamiltonian，按算符顺序展开：

$$
\begin{aligned}
\hat H
&=\dfrac{\hbar\omega}{4}
\left[-(\hat a-\hat a^\dagger)^2
+(\hat a+\hat a^\dagger)^2\right]\\
&=\dfrac{\hbar\omega}{2}
(\hat a\hat a^\dagger+\hat a^\dagger\hat a)\\
&=\boxed{\hbar\omega
\left(\hat a^\dagger\hat a+\dfrac12\right)}.
\end{aligned}
$$

定义光子数算符 $\hat N=\hat a^\dagger\hat a$。它的归一化本征态满足

$$
\begin{aligned}
\hat N|n\rangle&=n|n\rangle,\\
\hat a|n\rangle&=\sqrt n\,|n-1\rangle,\\
\hat a^\dagger|n\rangle&=\sqrt{n+1}\,|n+1\rangle,
\end{aligned}
\qquad n=0,1,2,\ldots
$$

于是单模式能量本征值为

$$
\boxed{E_n=\hbar\omega\left(n+\dfrac12\right),\qquad
E_{n+1}-E_n=\hbar\omega.}
$$

由此，**腔中这个模式每增加一个激发量子，能量增加 $\hbar\omega$**。把这样的激发称为一个光子。

## 11. 电磁场究竟在什么意义上变成了算符？

经典矢势是

$$
\mathbf A(x,t)=q(t)\sin(kx)\,\mathbf e_y,\qquad
q=\dfrac{Q}{\sqrt{m_{\mathrm{eff}}}}.
$$

因此，把 $\hat Q$ 代入就得到 Schrödinger 绘景下的矢势算符：

$$
\hat{\mathbf A}(x)
=\sqrt{\dfrac{\hbar}{\varepsilon_0SL\omega}}
\sin(kx)(\hat a+\hat a^\dagger)\,\mathbf e_y.
$$

在 Heisenberg 绘景中，$\hat a(t)=\hat a(0)e^{-i\omega t}$、$\hat a^\dagger(t)=\hat a^\dagger(0)e^{i\omega t}$。省略算符中显式的初始时刻下标，三个场算符为

$$
\boxed{
\begin{aligned}
\hat{\mathbf A}(x,t)
&=\sqrt{\dfrac{\hbar}{\varepsilon_0SL\omega}}\,
\sin(kx)\,[\hat a(t)+\hat a^\dagger(t)]\,\mathbf e_y,\\[4pt]
\hat{\mathbf E}(x,t)
&=i\sqrt{\dfrac{\hbar\omega}{\varepsilon_0SL}}\,
\sin(kx)\,[\hat a(t)-\hat a^\dagger(t)]\,\mathbf e_y,\\[4pt]
\hat{\mathbf B}(x,t)
&=k\sqrt{\dfrac{\hbar}{\varepsilon_0SL\omega}}\,
\cos(kx)\,[\hat a(t)+\hat a^\dagger(t)]\,\mathbf e_z.
\end{aligned}}
$$

这里保留了经典 Maxwell 模式的连续空间函数 $\sin(kx)$ 和 $\cos(kx)$。变化发生在**振幅**：经典数 $q(t)$ 被替换为 Hilbert 空间上的算符。

例如在单光子数态 $|1\rangle$ 中，

$$
\langle1|\hat{\mathbf E}(x,t)|1\rangle=0,\qquad
\langle1|\hat{\mathbf B}(x,t)|1\rangle=0,
$$

因为 $\hat a,\hat a^\dagger$ 改变光子数，使相应的对角矩阵元为零。但电场涨落并没有消失：

$$
\langle n|\hat E_y^2(x,t)|n\rangle
=\dfrac{\hbar\omega}{\varepsilon_0SL}
(2n+1)\sin^2(kx).
$$

这也包括 $n=0$ 的真空态：$\langle0|\hat{\mathbf E}|0\rangle=0$，而 $\langle0|\hat E_y^2|0\rangle$ 非零。$\tfrac12\hbar\omega$ 是单模式的零点能；腔体中一个光子的**激发能量**仍然是 $\hbar\omega$。

因此，对“一个光子”的描述需要说明**模式**与**状态**。一个光子数态具有确定的模式占据数，其场的平均振幅可以为零；不能仅凭经典场振幅的大小判定它是否处于单光子数态。

## 12. 回到实验：原子为什么能数出光子？

将 Rydberg 原子的两个相关能级抽象为 $|g\rangle$ 与 $|e\rangle$，能级差为 $\hbar\omega_a$。在电偶极近似下，原子与电场相互作用的能量是

$$
\hat H_{\mathrm{int}}=-\hat{\mathbf d}\cdot\hat{\mathbf E}(\mathbf r_a).
$$

原子跃迁偶极矩与腔模的电场幅度决定耦合强度 $g$。保留接近共振的能量交换项（旋转波近似），得到常见的 Jaynes–Cummings Hamiltonian：

$$
\boxed{
\hat H_{\mathrm{JC}}
=\hbar\omega_c\hat a^\dagger\hat a
+\dfrac{\hbar\omega_a}{2}\hat\sigma_z
+\hbar g(\hat a\hat\sigma_++\hat a^\dagger\hat\sigma_-).
}
$$

其中 $\hat\sigma_+=|e\rangle\langle g|$，$\hat\sigma_-=|g\rangle\langle e|$，$\hat\sigma_z=|e\rangle\langle e|-|g\rangle\langle g|$。这里的 $\hat a$ 与 $\hat a^\dagger$ 已经是**电磁场模式**的算符。

先看与原子共振时的能量交换。若原子激发、腔内没有光子，

$$
|e,0\rangle\equiv|e\rangle\otimes|0\rangle,
$$

那么

$$
\hat a^\dagger\hat\sigma_-|e,0\rangle
=|g,1\rangle.
$$

系统可以从 $|e,0\rangle$ 转化成 $|g,1\rangle$，即原子失去一份激发、腔场增加一个光子。若忽略衰减，且 $\omega_a=\omega_c$，在这两个态张成的子空间内，相互作用 Hamiltonian 为

$$
\hat H_{\mathrm{int}}
\;\widehat{=}\;
\hbar g
\begin{pmatrix}
0&1\\
1&0
\end{pmatrix},
\quad\text{基底 }(|e,0\rangle,|g,1\rangle).
$$

从 $|e,0\rangle$ 出发的态演化为

$$
|\psi(t)\rangle
=\cos(gt)|e,0\rangle-i\sin(gt)|g,1\rangle,
$$

从而

$$
\boxed{\Pr(g,1;t)=\sin^2(gt).}
$$

这就是最简单的**真空 Rabi 振荡**：即使腔体最初处于 $|0\rangle$，原子的激发仍能与腔场交换。若初始腔内有 $n$ 个光子，相关跃迁矩阵元变成 $\hbar g\sqrt{n+1}$，反映出光子数的量子作用。

## 13. 原始 QND 实验为什么要让原子与腔失谐？

2007 年记录光子数跃迁的实验主要使用**非共振的色散相互作用**。将原子与腔的失谐记为

$$
\Delta=\omega_a-\omega_c,\qquad
|\Delta|\gg g\sqrt{n+1}.
$$

当失谐较大，原子与腔不容易真正交换能量，但它们会改变彼此的能级。可以用二阶微扰论直接算出这个效果。

未耦合时，$|e,n\rangle$ 能量为

$$
E_{e,n}^{(0)}
=n\hbar\omega_c+\dfrac{\hbar\omega_a}{2}.
$$

它通过 $\hat a^\dagger\hat\sigma_-$ 与 $|g,n+1\rangle$ 耦合，矩阵元为 $\hbar g\sqrt{n+1}$，两个态的未扰动能量差为 $\hbar\Delta$。因此

$$
\delta E_{e,n}
=\dfrac{|\hbar g\sqrt{n+1}|^2}{\hbar\Delta}
=\dfrac{\hbar g^2(n+1)}{\Delta}.
$$

同理，$|g,n\rangle$ 与 $|e,n-1\rangle$ 耦合，其能量差是 $-\hbar\Delta$，得到

$$
\delta E_{g,n}=-\dfrac{\hbar g^2n}{\Delta}.
$$

于是，当腔内光子数为 $n$ 时，原子两个能级之间的有效频率差为

$$
\boxed{\omega_a^{(n)}
=\omega_a+\dfrac{g^2}{\Delta}(2n+1).}
$$

如果原子在叠加态中穿过腔体，相互作用持续时间为 $\tau$，其相对相位便依赖光子数：

$$
\phi_n-\phi_0
\simeq\dfrac{2g^2\tau}{\Delta}\,n.
$$

Ramsey 干涉装置把这样的相位差转化成可测的原子末态概率。通过调整参数，可以使 $n=0$ 与 $n=1$ 对应明显不同的干涉结果。腔内光子数在理想色散测量中不发生改变，因此可以让后续原子继续测量同一个光子。

这里的两能级模型、常数 $g$ 和二阶微扰公式展示了实验原理。真实 Rydberg 原子有更多能级，运动中的原子经历随位置变化的腔场；精确分析需要把这些因素纳入模型。上面共振的能量交换演示与本节失谐的 QND 读出，分别说明了量子场的两种可观测作用。

## 14. 从一维模式推广到三维电磁场

实际三维腔体中的模式用 $\mathbf f_\lambda(\mathbf r)$ 表示，$\lambda$ 统一标记空间模式及偏振。令它们满足相应导体边界条件与横向约束，并选取归一化

$$
\int_V\varepsilon_0\,
\mathbf f_\lambda(\mathbf r)\cdot
\mathbf f_{\lambda'}(\mathbf r)\,d^3r
=\delta_{\lambda\lambda'}.
$$

展开经典场：

$$
\mathbf A(\mathbf r,t)=\sum_\lambda
Q_\lambda(t)\mathbf f_\lambda(\mathbf r).
$$

对真空中的横向腔模，空间本征方程为

$$
\nabla\times\nabla\times\mathbf f_\lambda
=\dfrac{\omega_\lambda^2}{c^2}\mathbf f_\lambda.
$$

由正交性和导体边界条件进行分部积分，可得

$$
\int_V\dfrac{1}{\mu_0}
(\nabla\times\mathbf f_\lambda)\cdot
(\nabla\times\mathbf f_{\lambda'})\,d^3r
=\omega_\lambda^2\delta_{\lambda\lambda'}.
$$

因此经典 Hamiltonian 仍然是

$$
H_{\mathrm{EM}}
=\sum_\lambda
\left(\dfrac{P_\lambda^2}{2}
+\dfrac{\omega_\lambda^2Q_\lambda^2}{2}\right).
$$

对每一对独立的正则变量施加

$$
[\hat Q_\lambda,\hat P_{\lambda'}]
=i\hbar\delta_{\lambda\lambda'},\qquad
[\hat Q_\lambda,\hat Q_{\lambda'}]
=[\hat P_\lambda,\hat P_{\lambda'}]=0,
$$

就得到

$$
\boxed{
\hat H_{\mathrm{EM}}
=\sum_\lambda\hbar\omega_\lambda
\left(\hat a_\lambda^\dagger\hat a_\lambda+\dfrac12\right).
}
$$

单模数态 $|n\rangle$ 推广为整组模式的占据数态：

$$
|\{n_\lambda\}\rangle
=\prod_\lambda
\dfrac{(\hat a_\lambda^\dagger)^{n_\lambda}}
{\sqrt{n_\lambda!}}|\mathrm{vac}\rangle.
$$

这些数态构成电磁场的玻色 Fock 空间。场算符写成

$$
\boxed{
\hat{\mathbf A}(\mathbf r)
=\sum_\lambda\sqrt{\dfrac{\hbar}{2\omega_\lambda}}\,
\mathbf f_\lambda(\mathbf r)
(\hat a_\lambda+\hat a_\lambda^\dagger).
}
$$

经过同样的时间演化和空间求旋度，可得到 $\hat{\mathbf E}(\mathbf r,t)$ 和 $\hat{\mathbf B}(\mathbf r,t)$。每个 $\mathbf r$ 都是连续空间中的一个位置；$\hat{\mathbf A}(\mathbf r)$ 对每个位置指定一个 Hilbert 空间算符。

## 15. 用实验数字核对能量尺度

原实验模式的频率约为 $\nu=51.1\,\mathrm{GHz}$。一个光子的激发能量是

$$
\hbar\omega=h\nu
=(6.62607015\times10^{-34}\,\mathrm{J\,s})
(51.1\times10^9\,\mathrm{s^{-1}})
\approx3.39\times10^{-23}\,\mathrm J.
$$

换成温度尺度，

$$
\dfrac{h\nu}{k_{\mathrm B}}\approx2.45\,\mathrm K.
$$

在 $T=0.8\,\mathrm K$ 的热平衡条件下，单模式平均热光子数为

$$
\bar n=\dfrac{1}{e^{h\nu/(k_{\mathrm B}T)}-1}
\approx0.049.
$$

相应的玻色振子热态中，光子数分布为

$$
P(n)=\dfrac{\bar n^{\,n}}{(1+\bar n)^{n+1}}.
$$

所以零光子态约占 $95\%$，单光子态约占 $4.5\%$，两个及以上光子的总概率很小。这说明为什么实验在低温下可以频繁遇到“空腔”和偶尔出现的“单光子”，并追踪它们之间的跃迁。

对于一个处于确定数态的腔场，测量得到的是离散的 $n$；对很多独立实验作统计平均，又可以得到随时间平滑衰减的平均能量。经典的连续能量曲线因此仍然能有效描述大量光子或大量重复实验的平均行为。

## 进一步阅读

- [[谐振子]]：升降算符、数算符、本征态以及零点能的标准推导。
- [[光子气体与黑体辐射]]：将量子化后的多模式电磁场放入热平衡，推导 Planck 分布。
- S. Gleyzes *et al.*, “[Quantum jumps of light recording the birth and death of a photon in a cavity](https://doi.org/10.1038/nature05589)”, *Nature* **446**, 297–300 (2007)。实验本身与量子跃迁记录。
- S. Haroche, “[Nobel Lecture: Controlling photons in a box and exploring the quantum to classical boundary](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.85.1083)”, *Reviews of Modern Physics* **85**, 1083 (2013)。腔量子电动力学的实验脉络。
- S. Haroche, “[QND counting of 0 or 1 photon](https://www.college-de-france.fr/en/agenda/lecture/non-destructive-quantum-measurements/qnd-counting-of-0-or-1-photon)”, Collège de France (2008)。Ramsey 原子干涉读出光子数的说明。
