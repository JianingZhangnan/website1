---
level: 熟练
tags: [数理方法, 已消化]
---

# 勒让德多项式 (Legendre Polynomials)

公式卡，按备考记忆。来源：handnote1。

## 前 8 个 $P_l(x)$

$$\begin{aligned}
P_0&=1, & P_1&=x,\\[1mm]
P_2&=\dfrac{1}{2}(3x^2-1), & P_3&=\dfrac{1}{2}(5x^3-3x),\\[1mm]
P_4&=\dfrac{1}{8}(35x^4-30x^2+3), & P_5&=\dfrac{1}{8}(63x^5-70x^3+15x),\\[1mm]
P_6&=\dfrac{1}{16}(231x^6-315x^4+105x^2-5), & P_7&=\dfrac{1}{16}(429x^7-693x^5+315x^3-35x).
\end{aligned}$$

性质速记：$P_l(1)=1$，$P_l(-1)=(-1)^l$，宇称 $P_l(-x)=(-1)^lP_l(x)$。

## 幂函数 ↔ 勒让德

$$1=P_0,\quad x=P_1,\quad x^2=\dfrac{2P_2+P_0}{3},\quad x^3=\dfrac{2P_3+3P_1}{5},\quad x^4=\dfrac{8P_4+20P_2+7P_0}{35}.$$

倒推法：每次用 $P_n$ 的最高次项定系数、把低次减掉再续。$n$ 次多项式必为 $P_0\!\sim\!P_n$ 的有限组合，故展开多项式无需积分。

## 本征值问题 (eigenvalue problem)

勒让德方程：

$$\dfrac{d}{dx}\!\left[(1-x^2)\dfrac{dP}{dx}\right] + l(l+1)\,P(x) = 0$$

边界条件：$P(-1),\,P(1)$ 有限。本征值为 $l(l+1)$。

## 重要递推式 (recurrence relations)

$$(2l+1)\,x P_l = (l+1)P_{l+1} + l P_{l-1}$$
$$(2l+1)\,P_l = P_{l+1}' - P_{l-1}'$$
$$x P_l' = l P_l + P_{l-1}'$$
$$(1-x^2)P_l' = l\,(P_{l-1} - x P_l)$$
$$(1-x^2)P_l' = (l+1)(x P_l - P_{l+1})$$

## 生成函数 (generating function)

$$\dfrac{1}{\sqrt{1-2rx+r^2}} =
\begin{cases}
\displaystyle\sum_{l=0}^{\infty} P_l(x)\,r^l, & r<1,\\[2mm]
\displaystyle\sum_{l=0}^{\infty} P_l(x)\,\dfrac{1}{r^{l+1}}, & r>1.
\end{cases}$$

## Rodrigues 公式 (Rodrigues' formula)

$$P_l(x) = \dfrac{1}{2^l\, l!}\,\dfrac{d^l}{dx^l}(x^2-1)^l$$

## 特殊点取值（HW5 要用）

$$P_{2m}(0)=\dfrac{(-1)^m(2m)!}{4^m(m!)^2},\qquad P_{2m+1}'(0)=\dfrac{(-1)^m(2m+1)!}{4^m(m!)^2}$$

奇阶 $P(0)=0$，偶阶 $P'(0)=0$。

## 区间 $[0,1]$ 上的积分（速查）

$$\int_0^1 P_0\,dx=1,\qquad \int_0^1 P_{2k}\,dx=0\ (k\ge1),\qquad \int_0^1 P_{2k+1}\,dx=\dfrac{(-1)^k\binom{2k}{k}}{(k+1)\,2^{2k+1}}.$$

（三条可直接背用；统一来源是 $\int_0^1 P_n\,dx=\dfrac{P_{n-1}(0)-P_{n+1}(0)}{2n+1}$，$n\ge1$。）两个 $P_l$ 在 $[0,1]$ 上的积分见 [[例题-半区间勒让德积分]]。

## 常见展开例题

- 多项式：[[例题-多项式的勒让德展开]]
- 半区间内积 $\int_0^1 P_kP_l$：[[例题-半区间勒让德积分]]
- 奇延拓 $x\lvert x\rvert$：[[例题-奇延拓平方的勒让德展开]]
- 绝对值型 $\lvert x\rvert$：[[例题-绝对值型的勒让德展开]]
