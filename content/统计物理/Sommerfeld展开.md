# Sommerfeld展开

原稿切片：

![[assets/thermal-terminal/07-fermi-sommerfeld.png]]

本页整理 [[费米气体]] 的低温修正。目标是把

$$
I=\int_0^\infty\phi(E)f(E)\,dE,
\qquad
f(E)=\dfrac{1}{e^{\beta(E-\mu)}+1}
$$

展开成零温积分加温度修正。

## 分部积分

原稿先定义

$$
\psi(E)=\int_0^E\phi(E')\,dE',
\qquad
\psi'(E)=\phi(E).
$$

于是

$$
I=\int_0^\infty f(E)\,d\psi
=-\int_0^\infty\psi(E)\,df.
$$

边界项消失，是因为 $\psi(0)=0$ 且 $f(E\to\infty)=0$。令

$$
x=\beta(E-\mu),
\qquad
-\dfrac{df}{dE}
=\dfrac{1}{k_BT}\dfrac{e^x}{(e^x+1)^2}.
$$

因此

$$
I=\int_{-\mu/(k_BT)}^\infty
\psi(\mu+k_BTx)\dfrac{e^x}{(e^x+1)^2}\,dx.
$$

低温下 $\mu\gg k_BT$，下限可近似为 $-\infty$。把 $\psi$ 在 $\mu$ 附近展开：

$$
\psi(\mu+k_BTx)
=\psi(\mu)+k_BTx\psi'(\mu)
+\dfrac{1}{2}(k_BT)^2x^2\psi''(\mu)+\cdots.
$$

权重函数 $\dfrac{e^x}{(e^x+1)^2}$ 是偶函数，所以奇次项积分为零，并且

$$
\int_{-\infty}^{\infty}
\dfrac{e^x}{(e^x+1)^2}\,dx=1,
\qquad
\int_{-\infty}^{\infty}
x^2\dfrac{e^x}{(e^x+1)^2}\,dx=\dfrac{\pi^2}{3}.
$$

得到核心公式：

$$
I=\int_0^\mu\phi(E)\,dE
+\dfrac{\pi^2}{6}(k_BT)^2\phi'(\mu)+\cdots.
$$

## 固定粒子数

对三维非相对论费米气体，粒子数积分取 $\phi_N(E)=AE^{1/2}$。于是

$$
N=\dfrac{2}{3}A\mu^{3/2}
+\dfrac{\pi^2}{12}A(k_BT)^2\mu^{-1/2}+\cdots.
$$

令 $N=\dfrac{2}{3}AE_F^{3/2}$，解得

$$
\mu(T)=E_F\left[
1-\dfrac{\pi^2}{12}\left(\dfrac{T}{T_F}\right)^2+\cdots
\right],
\qquad
T_F=\dfrac{E_F}{k_B}.
$$

## 内能和热容

内能积分取 $\phi_U(E)=AE^{3/2}$。把上面的 $\mu(T)$ 代回 Sommerfeld 展开，得到

$$
U=\dfrac{3}{5}NE_F\left[
1+\dfrac{5\pi^2}{12}\left(\dfrac{T}{T_F}\right)^2+\cdots
\right].
$$

因此

$$
C_V=\left(\dfrac{\partial U}{\partial T}\right)_{V,N}
=\dfrac{\pi^2}{2}Nk_B\dfrac{T}{T_F}+\cdots.
$$

低温费米气体只有费米面附近约 $k_BT$ 宽度内的粒子能被热激发，所以 $C_V$ 与 $T$ 成正比。
