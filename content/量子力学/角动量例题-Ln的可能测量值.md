# 角动量例题：$\hat L_n=\vec{\hat L}\cdot\vec n$

> 通用结果见 [[角动量]]。

**题目**：已知在 $(\hat L^2,\hat L_z)$ 表象下，粒子运动状态的角度部分可以用如下波函数描写

$$
\psi(\theta,\phi)=Y_{00}(\theta,\phi)+Y_{10}(\theta,\phi)+\sqrt2\,Y_{11}(\theta,\phi).
$$

（1）求 $\hat L^2$ 期待值。（2）求算符 $\hat L_n=\vec{\hat L}\cdot\vec n$ 的可能测量值和相应概率，其中

$$
\vec n=\vec e_x\sin\alpha\cos\beta+\vec e_y\sin\alpha\sin\beta+\vec e_z\cos\alpha
$$

是任意单位矢量，$\alpha$ 和 $\beta$ 是球坐标的方位角，$\vec e_x,\vec e_y,\vec e_z$ 分别是 $x,y,z$ 方向的单位矢量。

## 归一化

记 $|00\rangle=Y_{00}$ 等，$|\psi\rangle=|00\rangle+|10\rangle+\sqrt2\,|11\rangle$，各项正交归一，故 $\langle\psi|\psi\rangle=1+1+2=4$。下面所有期望都带上 $\dfrac14$ 的归一化因子。

## （1）$\hat L^2$ 期待值

$Y_{00}$ 对应 $l=0$（$\hat L^2=0$），$Y_{10},Y_{11}$ 对应 $l=1$（$\hat L^2=2\hbar^2$）：

$$
\langle\hat L^2\rangle=\frac14\big(\langle00|\hat L^2|00\rangle+\langle10|\hat L^2|10\rangle+2\langle11|\hat L^2|11\rangle\big)
=\frac14(0+2\hbar^2+2\cdot2\hbar^2)=\frac32\hbar^2.
$$

## （2）$\hat L_n$ 的期望

$\hat L_n=\hat L_x\sin\alpha\cos\beta+\hat L_y\sin\alpha\sin\beta+\hat L_z\cos\alpha$，先算 $\hat L_x,\hat L_y,\hat L_z$ 的期望。由

$$
\hat L_x=\tfrac12(\hat L_++\hat L_-),\qquad \hat L_y=\tfrac1{2i}(\hat L_+-\hat L_-),
$$

以及 $\hat L_\pm|l,m\rangle=\sqrt{l(l+1)-m(m\pm1)}\,\hbar\,|l,m\pm1\rangle$，逐项作用：

$$
\hat L_+|10\rangle=\sqrt2\,\hbar|11\rangle,\quad \hat L_+|00\rangle=\hat L_-|00\rangle=0,\quad \hat L_+|11\rangle=0,
$$

$$
\hat L_-|11\rangle=\sqrt2\,\hbar|10\rangle,\quad \hat L_-|10\rangle=\sqrt2\,\hbar|1,-1\rangle.
$$

于是 $\hat L_+|\psi\rangle=\sqrt2\,\hbar|11\rangle$，$\hat L_-|\psi\rangle=2\hbar|10\rangle+\sqrt2\,\hbar|1,-1\rangle$，故

$$
\langle\hat L_x\rangle=\frac14\langle\psi|\tfrac12(\hat L_++\hat L_-)|\psi\rangle=\frac14\Big(\sqrt2\cdot\tfrac12\sqrt2\hbar+1\cdot\tfrac12\cdot2\hbar\Big)=\frac12\hbar,
$$

$$
\langle\hat L_y\rangle=0\quad(\text{两项贡献} \tfrac1i\hbar\ \text{与}\ -\tfrac1i\hbar\ \text{抵消}),
$$

$$
\langle\hat L_z\rangle=\frac14\langle\psi|\hat L_z|\psi\rangle=\frac14\big(\sqrt2\,\langle11|\cdot\sqrt2\,\hbar|11\rangle\big)=\frac12\hbar.
$$

代入

$$
\langle\hat L_n\rangle=\frac12\hbar\sin\alpha\cos\beta+0+\frac12\hbar\cos\alpha=\frac12\hbar\,(\cos\alpha+\sin\alpha\cos\beta).
$$

> 注：手写解到此给出的是 $\hat L_n$ 的**期望值**。题目（2）要的"可能测量值与相应概率"还需在 $l=0$ 与 $l=1$ 子空间内对 $\hat L_n$ 单独对角化、再把 $|\psi\rangle$ 投影到其本征态上——这一步原稿未展开，留待补。
