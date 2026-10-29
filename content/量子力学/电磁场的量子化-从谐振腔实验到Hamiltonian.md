---
title: Jordan 为什么量子化电磁场？从黑体实验到波的能量涨落
date: 2026-10-29
tags:
  - 量子力学
  - 电动力学
  - 量子光学
---

# Jordan 为什么量子化电磁场？

## 1925 年的哥廷根：量子力学能否用于光？

1925 年，Heisenberg 刚提出矩阵力学。Born 和 Jordan 正在哥廷根研究这种新力学：原来描述振子运动的坐标 $q(t)$，现在可以用矩阵表示。

但有一个问题：**原子可以用量子力学描述，原子发出和吸收的光又该怎样描述？**

Maxwell 理论已经很好地解释了干涉、衍射与驻波。与此同时，黑体辐射和光电效应等现象又在提示，光的能量交换具有离散特征。Jordan 想知道：能否让*电磁场本身*遵守刚建立起来的矩阵力学？

这个问题可以从当时实验室里的一只加热空腔开始理解。

## 1. 真实实验：加热一个带小孔的空腔

19 世纪末，Lummer、Pringsheim、Rubens 和 Kurlbaum 等人在实验室里研究黑体辐射。一个典型装置是**加热的空腔，壁上开一个很小的孔**。腔壁不断吸收、发射电磁波，温度稳定后，小孔漏出的辐射可以通过分光设备测量。

实验人员逐个测量不同波长的辐射强度。结果显示：给定温度，辐射强度随波长有一个峰值，在短波长一侧又逐渐降低。经典物理与热平衡统计结合得到的 Rayleigh–Jeans 公式，在高频处与实验严重不符。

1900 年，Planck 得到了符合测量结果的辐射公式。他使用的关键假设是：与辐射交换能量的振子以 $h\nu$ 为单位改变能量。**这时，能量量子的假设已经出现，但“电磁场本身怎样成为量子系统”仍需要进一步说明。**

- 实验上实际测量的是**不同波长的辐射强度**。
- 接下来讨论的“腔中某一小块区域的能量怎样涨落”，主要来自 Einstein 和 Jordan 的**理论计算**，不能把它当作上述实验直接测得的数据。

## 2. Maxwell 电磁场在腔里是什么样子？

先把真实的三维空腔简化为两端是理想导体的长方形腔体，两端相距 $L$。电场必须满足导体表面的边界条件，所以腔内可以形成驻波。它很像**一根两端固定、只能以某些形状振动的琴弦**。

取一个沿 $y$ 方向偏振的简正模式，用矢势写成

$$
\mathbf A(x,t)=q(t)\sin(kx)\,\mathbf e_y,
\qquad k=\dfrac{m\pi}{L},\quad m=1,2,\ldots
$$

这里需要分清两个东西：

- $\sin(kx)$：表示驻波在空间中的**形状**；$x$ 可以连续变化。
- $q(t)$：表示这整个驻波的**振幅**；场随时间怎样振荡，由它决定。

由 $\mathbf E=-\partial_t\mathbf A$ 和 $\mathbf B=\nabla\times\mathbf A$，

$$
E_y(x,t)=-\dot q(t)\sin(kx),\qquad
B_z(x,t)=kq(t)\cos(kx).
$$

代入 Maxwell 方程，可以得到

$$
\boxed{\ddot q+\omega^2q=0,\qquad \omega=ck.}
$$

也就是说，**在经典电磁场内部，每一个驻波模式的振幅就按照简谐振子的方程运动。** 虽然允许的频率 $\omega$ 已经由腔体边界条件选定，振幅大小依然可以连续改变。

## 3. 为什么一个电磁场模式有简谐振子的 Hamiltonian？

腔中储存的电磁能量是电场和磁场能量之和：

$$
H=\int_V\left(
\dfrac{\varepsilon_0}{2}E^2+
\dfrac{1}{2\mu_0}B^2
\right)dV.
$$

设腔体横截面积为 $S$。把上面的驻波代入，再利用

$$
\int_0^L\sin^2(kx)\,dx
=\int_0^L\cos^2(kx)\,dx=\dfrac L2,
$$

直接得到

$$
H=\dfrac{\varepsilon_0 SL}{4}
\left(\dot q^{\,2}+\omega^2q^2\right).
$$

定义 $M=\varepsilon_0 SL/2$。从相应的模式 Lagrangian

$$
\mathcal L_{\mathrm{mode}}
=\dfrac M2\dot q^{\,2}-\dfrac{M\omega^2}{2}q^2
$$

可得正则动量 $p=\partial\mathcal L_{\mathrm{mode}}/\partial\dot q=M\dot q$。因此

$$
\boxed{H(q,p)=\dfrac{p^2}{2M}+\dfrac12M\omega^2q^2.}
$$

它与质量为 $M$、角频率为 $\omega$ 的简谐振子的 Hamiltonian 形式相同。不过这里的 $M$ 是归一化参数；**$q$ 描述驻波的整体振幅，腔内没有一个正在来回移动的、质量为 $M$ 的小球。**

到这里，Maxwell 理论已经给出了完整的经典动力学。接下来需要问：这个经典模式面对黑体辐射的量子问题时，还缺少什么？

## 4. 1909 年 Einstein 提出的困难：光究竟怎样涨落？

1905 年，Einstein 用能量为 $h\nu$ 的光量子理解部分辐射现象。1909 年，他又研究了一个更细致的问题：

**如果只考察黑体空腔里一小块区域、一个很窄的频率范围，其中的辐射能量会怎样围绕平均值涨落？**

例如，每次考察这块区域中的能量 $E$，结果可能稍高或稍低。用 $\overline E$ 表示平均能量，用 $\langle(\Delta E)^2\rangle$ 表示能量涨落的均方值。

Einstein 从 Planck 辐射定律和热平衡统计关系推导出一个引人注意的结构：

$$
\boxed{
\langle(\Delta E)^2\rangle
=h\nu\,\overline E
+\dfrac{\overline E^{\,2}}{N}.
}
$$

这里 $N$ 表示所考察体积与窄频段对应的有效模式数。

这两个部分的物理图像不同：

- **$\overline E^{\,2}/N$：波动部分。** 不同波叠加时，局部强度随着干涉而变化；经典波动图像能够解释这一类贡献。
- **$h\nu\,\overline E$：粒子部分。** 如果能量由一个个 $h\nu$ 的量子贡献，那么量子的数目也会涨落，并产生这一贡献。

这使人面临一个值得追问的理论问题：**有没有一种统一的电磁场理论，能够从同一组动力学变量自然地产生这两个部分？**

1923 年的 Compton 散射等实验也强化了光具有粒子性特征的证据。不过 Jordan 在此处关注的重点，是给 Einstein 的涨落公式找到统一的量子力学解释。

## 5. Jordan 1925 年的想法：把模式振幅变成矩阵

现在回到已经求出的经典 Hamiltonian：

$$
H(q,p)=\dfrac{p^2}{2M}+\dfrac12M\omega^2q^2.
$$

Born 和 Jordan 所做的关键推广是：**既然电磁场的每个模式都满足简谐振子的动力学方程，就可以把矩阵力学用于这些模式。**

用今天的符号写，这一步是

$$
q\longrightarrow\hat q,\qquad
p\longrightarrow\hat p,\qquad
[\hat q,\hat p]=i\hbar.
$$

这样，场的矢势也成为算符：

$$
\boxed{
\hat{\mathbf A}(x)
=\sin(kx)\,\hat q\,\mathbf e_y.
}
$$

这正是当年“将电磁场写成矩阵”在单模式情形下的含义。

- 空间中的每一个位置 $x$ 仍然是连续的。
- $\sin(kx)$ 仍是 Maxwell 方程给出的驻波形状。
- 原来决定振幅的数 $q$，现在是作用于量子态的矩阵（算符）。

如果用该模式的能量本征态 $|n\rangle$ 作为矩阵基底，那么 $q_{rs}=\langle r|\hat q|s\rangle$ 表示两个量子态之间的矩阵元。矩阵的行列指标标记**量子态**，不代表空间网格的编号。

量子简谐振子的结果可以直接使用（见 [[谐振子]]）：

$$
\boxed{
\hat H=\hbar\omega\left(\hat a^\dagger\hat a+\dfrac12\right),
\qquad
E_n=\hbar\omega\left(n+\dfrac12\right).
}
$$

相邻能级相差 $\hbar\omega=h\nu$。一个场模式现在可以有 $0,1,2,\ldots$ 个激发量子；后来我们把这些激发称为这个模式中的**光子**。空间驻波没有消失，发生变化的是它的量子状态及其允许的能量。

## 6. Jordan 在 1926 年怎样检验这个想法？

1925 年 Born–Jordan 论文已经尝试把矩阵力学应用于电磁场。1926 年发表的 Born–Heisenberg–Jordan 三人论文中，Jordan 进一步研究了 Einstein 的能量涨落问题。

他的关键模型非常朴素：**一根两端固定的振动弦。**

弦上可以同时存在许多驻波。若只看弦的某个小段，其中的能量会随驻波之间的干涉而变化。这个连续弦模型在数学上类似于一维的场，因此便于研究“空间中的一小部分含有多少能量”。

Jordan 将不同驻波的振幅当作矩阵力学中的量子变量，计算弦的一小段区域中的能量涨落，得到了与 Einstein 公式相联系的**波动贡献与粒子贡献**。他的推导后来经过历史学者重新分析，其原始论证在统计平均方面还有需要补充的地方。

为了看清这件事的物理意义，可以使用一个更简单的**现代热平衡示例**。设频率为 $\nu$ 的一个量子模式平均含有 $\bar n$ 个激发量子，那么玻色热态满足

$$
\mathrm{Var}(n)=\bar n+\bar n^2.
$$

其中 $\bar n$ 给出类似独立量子计数的涨落，$\bar n^2$ 体现玻色波动的附加涨落。若有 $N$ 个独立、频率接近的模式，且平均能量为 $\overline E=Nh\nu\bar n$，便得到

$$
\mathrm{Var}(E)=h\nu\,\overline E+\dfrac{\overline E^{\,2}}{N}.
$$

这展示了 Jordan 工作所揭示的联系：**给连续的波动场建立量子态之后，可以从同一套理论得到波动特征与离散能量特征。**

这段热态计算只用于展示物理图像。Jordan 当时的计算对象是整根弦处于确定量子状态时，弦的一小段区域中的能量涨落，计算方法与这里的热态示例有所区别。

## 7. 这件事与后来实验中数出一个光子有什么联系？

加热空腔中的黑体实验测量的是**辐射光谱**；Einstein 的 1909 年涨落公式是基于已知辐射规律提出的**理论结果**；Jordan 将矩阵力学应用于场，是为了在理论内部解释波动和粒子两方面的规律。

量子化后的模式具有数算符

$$
\hat N=\hat a^\dagger\hat a,\qquad
\hat N|n\rangle=n|n\rangle.
$$

现代腔量子电动力学实验可以制备和探测不同的 $|n\rangle$ 态。例如 Haroche 团队在 2007 年利用穿过微波腔的原子反复测量光子数，并记录单个光子的出现与消失。这类实验使“模式里有几个光子”成为可以直接追踪的物理量。

Jordan 在 1925—1926 年还没有这样的实验手段。他面对的是一组已有的光学实验事实，以及 Einstein 留下的能量涨落问题。用当时刚诞生的矩阵力学量子化驻波振幅，使连续电磁场与离散光量子能够进入同一种动力学描述。

## 历史资料

- M. Born、P. Jordan，*Zur Quantenmechanik*，*Zeitschrift für Physik* **34**, 858–888 (1925)。矩阵力学的系统化及应用于电磁场的早期尝试。
- M. Born、W. Heisenberg、P. Jordan，*Zur Quantenmechanik II*，*Zeitschrift für Physik* **35**, 557–615 (1926)。包含 Jordan 对场的量子化及涨落问题的研究。
- A. Duncan、M. Janssen，[*Pascual Jordan's resolution of the conundrum of the wave-particle duality of light*](https://experts.umn.edu/en/publications/pascual-jordans-resolution-of-the-conundrum-of-the-wave-particle-/)，*Studies in History and Philosophy of Modern Physics* **39**, 634–666 (2008)。现代历史研究与推导重建。
- [Otto Lummer 的黑体辐射实验史料](https://www.otto-lummer.de/waermestrahlung.html)。介绍当年的空腔装置与辐射光谱测量。
