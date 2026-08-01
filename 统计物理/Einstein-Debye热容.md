# Einstein-Debye热容

原稿切片：

![[assets/thermal-terminal/05-einstein-debye.png]]

本页整理 [[固体热容与声子]] 中的热容模型。两种模型都把固体看成声子谐振子系统，差别只在模式密度 $g(\omega)$。

## Einstein 模型

Einstein 模型假设所有声子振动频率相同，均为 $\omega_E$，所以固体等价于 $3N$ 个同频谐振子：

$$
U=3N\hbar\omega_E
\left(\dfrac{1}{2}+\dfrac{1}{e^{\beta\hbar\omega_E}-1}\right).
$$

令

$$
\theta_E=\dfrac{\hbar\omega_E}{k_B},
\qquad
x=\dfrac{\theta_E}{T}.
$$

摩尔内能为

$$
U_m=3R\theta_E
\left(\dfrac{1}{2}+\dfrac{1}{e^{\theta_E/T}-1}\right).
$$

热容为

$$
C_V=3Nk_B\dfrac{x^2e^x}{(e^x-1)^2}.
$$

高温下 $x\to0$，$C_V\to3Nk_B$；低温下 $C_V$ 按 $e^{-\theta_E/T}$ 衰减。

## Debye 模型

Debye 模型把低频声子近似成线性色散

$$
\omega=v_s q.
$$

三维声子有三支，因此模式密度写成

$$
g(\omega)\,d\omega
=\dfrac{3V\omega^2}{2\pi^2v_s^3}\,d\omega.
$$

引入截止频率 $\omega_D$，要求总模式数为 $3N$：

$$
\int_0^{\omega_D}g(\omega)\,d\omega=3N.
$$

于是

$$
g(\omega)\,d\omega
=\dfrac{9N}{\omega_D^3}\omega^2\,d\omega,
\qquad
\theta_D=\dfrac{\hbar\omega_D}{k_B}.
$$

内能保留原稿中的零点能项：

$$
U=\int_0^{\omega_D}g(\omega)\hbar\omega
\left(\dfrac{1}{2}+\dfrac{1}{e^{\beta\hbar\omega}-1}\right)d\omega.
$$

零点能为

$$
U_0=\dfrac{9}{8}N\hbar\omega_D.
$$

热激发部分令 $x=\beta\hbar\omega$：

$$
U_{\rm th}
=9Nk_BT\left(\dfrac{T}{\theta_D}\right)^3
\int_0^{\theta_D/T}\dfrac{x^3}{e^x-1}\,dx.
$$

热容为

$$
C_V=9Nk_B\left(\dfrac{T}{\theta_D}\right)^3
\int_0^{\theta_D/T}\dfrac{x^4e^x}{(e^x-1)^2}\,dx.
$$

低温时把上限近似为 $\infty$：

$$
\int_0^\infty\dfrac{x^4e^x}{(e^x-1)^2}\,dx=\dfrac{4\pi^4}{15}.
$$

所以

$$
C_V\simeq\dfrac{12\pi^4}{5}Nk_B
\left(\dfrac{T}{\theta_D}\right)^3.
$$

这就是 Debye 的 $T^3$ 定律。
