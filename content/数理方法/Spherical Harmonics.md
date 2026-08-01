---
level: 熟练
tags: [数理方法, 已消化]
---

# 球函数 (Spherical Harmonics)


## 球函数 $Y_l^m$（实数形式，未归一）

(10.3.1)：$Y_l^m(\theta,\varphi)=P_l^m(\cos\theta)\,\{\cos m\varphi\ \text{或}\ \sin m\varphi\},\quad m=0,1,\dots,l$。

**函数本身不带归一化因子**；每个 $l$ 有 $2l+1$ 个。复数形式 (10.3.2)：$P_l^{|m|}(\cos\theta)e^{im\varphi}$，$m=-l,\dots,l$。

> 带 $\sqrt{\tfrac{2l+1}{4\pi}\tfrac{(l-m)!}{(l+m)!}}$ 的复数 $Y_l^m$ 是物理/量子约定，**非本课本**。

## 连带勒让德 $P_l^m$（由 $P_l$ 生成）

$$P_l^m(x)=(1-x^2)^{m/2}\dfrac{d^m}{dx^m}P_l(x),\quad x=\cos\theta,\ P_l^0=P_l.$$

关键恒等式（配 θ 要用）：$P_l^m(\cos\theta)=\sin^m\theta\cdot P_l^{(m)}(\cos\theta)$，其中 $P_l^{(m)}:=\dfrac{d^mP_l}{dx^m}$。

低阶 $P_l^m(\cos\theta)$：$P_2^1=3\sin\theta\cos\theta,\ P_2^2=3\sin^2\theta,\ P_3^1=\tfrac32\sin\theta(5\cos^2\theta-1),\ P_3^2=15\cos\theta\sin^2\theta,\ P_3^3=15\sin^3\theta,\ P_4^2=\tfrac{15}{2}\sin^2\theta(7\cos^2\theta-1)$。

配 θ 要用的导数：$m{=}1$：$P_1'=1,\ P_2'=3x,\ P_3'=\tfrac32(5x^2-1)$；$m{=}2$：$P_2''=3,\ P_3''=15x,\ P_4''=\tfrac{15}{2}(7x^2-1)$。

## 按球函数展开 (10.3.7)

$$f(\theta,\varphi)=\sum_{l=0}^\infty\sum_{m=0}^l\big[A_l^m\cos m\varphi+B_l^m\sin m\varphi\big]P_l^m(\cos\theta).$$

系数（积分法，用模 $N_l^m$）：$A_l^m=\dfrac{1}{(N_l^m)^2}\displaystyle\iint f\,P_l^m(\cos\theta)\cos m\varphi\,d\Omega$，$(N_l^m)^2=\dfrac{2\pi}{2l+1}\dfrac{(l+m)!}{(l-m)!}\times\begin{cases}2,&m=0\\1,&m\ge1\end{cases}$（$B_l^m$ 把 $\cos$ 换 $\sin$）。

## 配 θ 套路（多项式型角函数，免积分）

$f$ 是 $\sin\theta,\cos\theta,\cos m\varphi,\sin m\varphi$ 的有限组合时：**降 φ 定 $m$ → 提出 $\sin^m\theta$ → 剩下的 $\cos\theta$ 多项式按 $\{P_l^{(m)}\}$ 匹配系数**（同 [[Legendre Polynomials]] 的幂↔勒让德）。例题见 [[例题-球函数展开]]。

相关：[[Legendre Polynomials]]
