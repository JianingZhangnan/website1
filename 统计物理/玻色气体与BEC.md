# 玻色气体与BEC

原稿切片：

![[assets/thermal-terminal/10-relativistic-and-bec.png]]

![[assets/thermal-terminal/11-bec-dimension.png]]

本页整理原稿中玻色气体和 Bose-Einstein 凝聚 (BEC) 的部分。公共巨正则公式见 [[量子理想气体]]。

## 三维理想玻色气体

令

$$
\lambda_{\rm th}=\dfrac{h}{\sqrt{2\pi mk_BT}},
\qquad
g_{\rm spin}=2s+1,
\qquad
z=e^{\beta\mu}.
$$

玻色积分记为

$$
g_\nu(z)={\rm Li}_\nu(z)
=\dfrac{1}{\Gamma(\nu)}
\int_0^\infty\dfrac{x^{\nu-1}}{z^{-1}e^x-1}\,dx.
$$

由 [[三维量子气体积分#宏观量]] 得

$$
N_{\rm ex}
=\dfrac{g_{\rm spin}V}{\lambda_{\rm th}^3}g_{3/2}(z),
\qquad
U=\dfrac{3}{2}k_BT
\dfrac{g_{\rm spin}V}{\lambda_{\rm th}^3}g_{5/2}(z).
$$

这里写 $N_{\rm ex}$ 是因为 BEC 发生后，基态粒子数要单独拿出来。

## 临界温度

玻色气体要求 $0<z\le1$。当 $z\to1$ 时，激发态最多能容纳

$$
N_{\rm ex}^{\max}
=\dfrac{g_{\rm spin}V}{\lambda_{\rm th}^3}\zeta(3/2).
$$

若总粒子数 $N$ 大于这个上限，多出的粒子进入基态。临界点由

$$
N=\dfrac{g_{\rm spin}V}{\lambda_{\rm th,c}^3}\zeta(3/2)
$$

给出，因此

$$
T_c=\dfrac{2\pi\hbar^2}{mk_B}
\left[\dfrac{n}{g_{\rm spin}\zeta(3/2)}\right]^{2/3}.
$$

低于 $T_c$ 时 $z=1$，激发态粒子数为

$$
N_{\rm ex}=N\left(\dfrac{T}{T_c}\right)^{3/2}.
$$

所以凝聚份额是

$$
\dfrac{N_0}{N}
=1-\left(\dfrac{T}{T_c}\right)^{3/2}.
$$

热内能为

$$
U=\left(\dfrac{3}{2}Nk_BT\right)
\dfrac{\zeta(5/2)}{\zeta(3/2)}
\left(\dfrac{T}{T_c}\right)^{3/2}.
$$

## 二维为什么没有通常的 BEC

二维自由粒子满足

$$
g(k)\,dk=\dfrac{A}{2\pi}k\,dk,
\qquad
E=\dfrac{\hbar^2k^2}{2m}.
$$

由于

$$
dE=\dfrac{\hbar^2}{m}k\,dk,
$$

二维能量态密度为

$$
g(E)\,dE=\dfrac{Am}{2\pi\hbar^2}\,dE.
$$

它是常数。令 $z\to1$ 时，激发态粒子数含有低能积分

$$
\int_0^\infty
\dfrac{g(E)\,dE}{e^{\beta E}-1}.
$$

在 $E\to0$ 附近，分母 $e^{\beta E}-1\simeq\beta E$，所以积分像

$$
\int_0\dfrac{dE}{E}
$$

一样发散。也就是说，二维激发态没有有限的最大容纳数，因此不会出现三维理想气体那种有限温度 BEC。
