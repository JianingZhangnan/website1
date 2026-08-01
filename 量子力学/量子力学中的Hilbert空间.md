# 量子力学中的 Hilbert 空间

## ket、bra 与对偶

定义 ket：$|\alpha\rangle$ 表示一个量子态，$\alpha$ 是态的标记。所有 ket 构成一个 Hilbert 空间 $\mathcal H$。

记 bra $\langle\alpha|$ 为 ket 的对偶，则所有 bra 构成一个 Hilbert 空间 $\mathcal H^{*}$。ket、bra 之间互为对偶空间。

注意：这个对偶（记为 DC，对偶共轭）是反线性的，即

$$
c_\alpha|\alpha\rangle+c_\beta|\beta\rangle\ \xrightarrow{\ \mathrm{DC}\ }\ c_\alpha^{*}\langle\alpha|+c_\beta^{*}\langle\beta|.
$$

## 内积

内积的定义：$\langle\beta|\alpha\rangle$——$\langle\beta|$ 将 $|\alpha\rangle$ 映射为一个复数。基本性质：

$$
\langle\beta|\alpha\rangle=\langle\alpha|\beta\rangle^{*},\qquad
\langle\alpha|\alpha\rangle\ge0,\qquad
\langle\gamma|\,(c_1|\alpha\rangle+c_2|\beta\rangle)=c_1\langle\gamma|\alpha\rangle+c_2\langle\gamma|\beta\rangle.
$$

由此定义态矢量的模 $\|\alpha\|=\sqrt{\langle\alpha|\alpha\rangle}$；正交条件 $\langle\alpha|\beta\rangle=0$。

## 算符

算符：对态矢量的变换操作。线性算符满足

$$
\hat A(|\alpha\rangle+|\beta\rangle)=\hat A|\alpha\rangle+\hat A|\beta\rangle,\qquad \hat A(c|\alpha\rangle)=c\,(\hat A|\alpha\rangle).
$$

伴随算符 $\hat A^{\dagger}$ 由 DC 定义：$\hat A|\alpha\rangle\ \xrightarrow{\ \mathrm{DC}\ }\ \langle\alpha|\hat A^{\dagger}$。满足 $\hat A=\hat A^{\dagger}$ 的称自伴（厄米）算符（即 [[基础公设]] 中可观测量对应的算符）。

**本征值为实数。** 设 $\hat A|\alpha\rangle=a|\alpha\rangle$，由自伴性

$$
\langle\alpha|\hat A|\alpha\rangle^{*}=\langle\alpha|\hat A^{\dagger}|\alpha\rangle=\langle\alpha|\hat A|\alpha\rangle
\ \Rightarrow\ a^{*}\|\alpha\|^{2}=a\|\alpha\|^{2},
$$

故 $a$ 为实数。

**不同本征值的本征矢正交。** 设 $\hat A|\alpha\rangle=a|\alpha\rangle$，$\hat A|\beta\rangle=b|\beta\rangle$（$a,b$ 实）。一方面 $\langle\beta|\hat A|\alpha\rangle=a\langle\beta|\alpha\rangle$，另一方面 $\langle\beta|\hat A|\alpha\rangle=(\langle\alpha|\hat A|\beta\rangle)^{*}=b\langle\beta|\alpha\rangle$。若 $a\neq b$，则 $\langle\beta|\alpha\rangle=0$。

## 求一个算符的厄米共轭的方法

① 利用定义。离散基底：$(\hat A^{\dagger})_{ij}=\hat A_{ji}^{*}$；连续算符则逐对比较

$$
\langle\beta|\hat A|\alpha\rangle=\int_{-\infty}^{\infty}\beta^{*}\,\hat A\,\alpha\,dx,\qquad
\langle\alpha|\hat A^{\dagger}|\beta\rangle=\int_{-\infty}^{\infty}\alpha^{*}\,\hat A^{\dagger}\,\beta\,dx,
$$

两边对照得出结果。

② 利用已知性质（如 $\hat D=\dfrac{d}{dx}$ 是反厄米的）：

$$
(c\hat A)^{\dagger}=c^{*}\hat A^{\dagger},\quad
(\hat A+\hat B)^{\dagger}=\hat A^{\dagger}+\hat B^{\dagger},\quad
(\hat A\hat B)^{\dagger}=\hat B^{\dagger}\hat A^{\dagger},\quad
(\hat A^{\dagger})^{\dagger}=\hat A.
$$

## 本征态、谱与期望值

当 $\hat A|\alpha\rangle=a|\alpha\rangle$（$a$ 为常数）时，称 $|\alpha\rangle$ 为 $\hat A$ 的本征态（该定义与测量公设相符）。**简并**：同一个 $a$ 可能有多个线性无关的归一化本征态，其个数称简并度。一个算符所有本征值的集合称为该算符的**谱**。

对应 $|\psi\rangle$ 测量，测得状态在 $|n\rangle$ 的概率为 $P(a_n)=|\langle n|\psi\rangle|^{2}$，其中 $|\psi\rangle=\sum_n c_n|n\rangle$，$c_n=\langle n|\psi\rangle$。

**期望值**：力学量 $\hat A$ 在态 $|\psi\rangle$（归一化）的期望值定义为 $\langle\hat A\rangle=\langle\psi|\hat A|\psi\rangle$。利用完备性

$$
\langle\psi|\hat A|\psi\rangle=\sum_{n,n'}\langle\psi|n'\rangle\langle n'|\hat A|n\rangle\langle n|\psi\rangle=\sum_n a_n|\langle n|\psi\rangle|^{2},
$$

即 $\langle\hat A\rangle=\sum_n a_n P_n$，与期望值的定义相符。

## 对易子

算符不满足乘法交换律，故引入对易子 $[\hat A,\hat B]=\hat A\hat B-\hat B\hat A$。

① 厄米算符的对易子是反厄米的：

$$
[\hat A,\hat B]^{\dagger}=\hat B^{\dagger}\hat A^{\dagger}-\hat A^{\dagger}\hat B^{\dagger}=\hat B\hat A-\hat A\hat B=-[\hat A,\hat B].
$$

② 若两个算符 $[\hat A,\hat B]=0$（即 $\hat A\hat B=\hat B\hat A$），则一定存在 $\hat A$、$\hat B$ 的共同本征态，且这组线性无关的共同本征态张成整个 Hilbert 空间（$\hat A$、$\hat B$ 可同时对角化）。

> 注：两个可观测量若对易 $[\hat A,\hat B]=0$，其一组共同本征态张成 Hilbert 空间；若不足以张成，则需引入其他自伴算符 $\hat C$，满足 $[\hat A,\hat C]=[\hat B,\hat C]=0$。

## 不确定关系

给定可观测量 $\hat A$，对任意态 $|\psi\rangle$ 定义算符 $\Delta\hat A=\hat A-\langle\hat A\rangle$（仍是厄米的），其涨落

$$
\langle(\Delta\hat A)^{2}\rangle=\langle\hat A^{2}-2\hat A\langle\hat A\rangle+\langle\hat A\rangle^{2}\rangle=\langle\hat A^{2}\rangle-\langle\hat A\rangle^{2}.
$$

> **引理（Schwarz 不等式）** $\langle\alpha|\alpha\rangle\langle\beta|\beta\rangle\ge|\langle\alpha|\beta\rangle|^{2}$。
> 证：由 $(\langle\alpha|+c^{*}\langle\beta|)(|\alpha\rangle+c|\beta\rangle)\ge0$，取 $c=-\dfrac{\langle\beta|\alpha\rangle}{\langle\beta|\beta\rangle}$ 即得。

利用 $\Delta\hat A$ 厄米，$\langle(\Delta\hat A)^{2}\rangle=\langle\Delta\hat A\,\psi|\Delta\hat A\,\psi\rangle$，再用 Schwarz 不等式

$$
\langle(\Delta\hat A)^{2}\rangle\langle(\Delta\hat B)^{2}\rangle\ge|\langle\Delta\hat A\,\psi|\Delta\hat B\,\psi\rangle|^{2}=|\langle\Delta\hat A\,\Delta\hat B\rangle|^{2}.
$$

而 $\Delta\hat A\,\Delta\hat B=\dfrac12[\Delta\hat A,\Delta\hat B]+\dfrac12\{\Delta\hat A,\Delta\hat B\}$（$\{\hat A,\hat B\}=\hat A\hat B+\hat B\hat A$ 是反对易子）。易证厄米算符的对易子期望值是纯虚数、反对易子期望值是实数，故

$$
|\langle\Delta\hat A\,\Delta\hat B\rangle|^{2}=\tfrac14|\langle[\hat A,\hat B]\rangle|^{2}+\tfrac14|\langle\{\Delta\hat A,\Delta\hat B\}\rangle|^{2}\ge\tfrac14|\langle[\hat A,\hat B]\rangle|^{2}.
$$

令 $\Delta a=\sqrt{\langle(\Delta\hat A)^{2}\rangle}$，$\Delta b=\sqrt{\langle(\Delta\hat B)^{2}\rangle}$，则得**不确定关系**

$$
\Delta a\,\Delta b\ge\tfrac12|\langle[\hat A,\hat B]\rangle|.
$$

如 $\Delta x\,\Delta p\ge\dfrac12|\langle[\hat x,\hat p]\rangle|=\dfrac\hbar2$。

> 注：$\Delta E\,\Delta t\ge\dfrac\hbar2$ 中的 $\Delta t$ 不是同一个含义（没有时间算符），这里 $\Delta t=\dfrac{\Delta E}{\left|\dfrac{d\langle E\rangle}{dt}\right|}$。
