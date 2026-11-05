---
aliases: ["统计物理/Sommerfeld展开"]
---
# Sommerfeld展开

取 [[费米气体#^def-fermi-occupation|费米占据函数]] $f(E)=1/[e^{(E-\mu)/(k_BT)}+1]$，其中 $E$ 是单粒子能量，$\mu>0$ 是化学势，$T$ 是温度，$k_B$ 是玻尔兹曼常数，$\beta=1/(k_BT)$。考虑

$$
I=\int_0^\infty\phi(E)f(E)\,dE.
$$

$\phi(E)$ 是待积分的权重函数；假设它在 $\mu$ 附近平滑，且大能量端的增长不超过多项式。定义 $\theta(x)=1$（$x>0$）、$0$（$x<0$），约定 $\theta(0)=1/2$。固定 $E<\mu$ 时指数 $(E-\mu)/(k_BT)\to-\infty$，所以 $f\to1$；$E>\mu$ 时相反，$f\to0$；$E=\mu$ 时 $f=1/2$。因此零温极限将 $f$ 换成 $\theta(\mu-E)$，所以首项是 $\int_0^\mu\phi(E)dE$。低温展开要计算的是平滑过渡对这项增加的修正，要求 $k_BT\ll\mu$。
下面把 $I$ 展开成零温积分加温度修正。

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

边界项消失，是因为 $\psi(0)=0$，而无穷远处 $\psi$ 的多项式增长被 $f$ 的指数衰减压过。令

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

权重 $w(x)=e^x/(1+e^x)^2$ 在 $\lvert x\rvert\gg1$ 时按 $e^{-\lvert x\rvert}$ 衰减。可把 $\psi(E)$ 在 $E<0$ 定义为零，将下限形式上扩到 $-\infty$；原积分未改变。低温时，$\lvert E-\mu\rvert>\mu/2$ 的区间至多给出多项式因子乘 $e^{-\mu/(2k_BT)}$ 的小量，故幂次修正只来自 $\mu$ 附近。

在这一区间把 $\psi$ 在 $\mu$ 附近展开；若其四阶导数有界，展开到三阶后的余项受常数乘 $(k_BT)^4\lvert x\rvert^4$ 控制，乘 $w(x)$ 后仍可积。因此可以逐项积分求到 $T^2$ 的修正：

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

> [!done] Sommerfeld 低温展开
> 对在 $\mu$ 附近平滑、无穷远至多多项式增长的 $\phi$，当 $\mu/(k_BT)\gg1$ 时，
>
> $$
> I=\int_0^\mu\phi(E)\,dE
> +\dfrac{\pi^2}{6}(k_BT)^2\phi'(\mu)+\cdots.
> $$

^prop-sommerfeld-expansion

## 固定粒子数

对三维非相对论费米气体，取 $\phi_N(E)=AE^{1/2}$，其中 $A=\dfrac{g_{\rm spin}V}{4\pi^2}(2m/\hbar^2)^{3/2}$，这里 $A$ 包含体积，与 [[热力学量与费米积分#从态求和到热力学量|主线的单位体积系数]] 相差一个 $V$。$g_{\rm spin}$ 是自旋态数，$m$ 是粒子质量。于是

$$
N=\dfrac{2}{3}A\mu^{3/2}
+\dfrac{\pi^2}{12}A(k_BT)^2\mu^{-1/2}+\cdots.
$$

> [!done] 固定粒子数下的低温化学势与费米温度
> 令[[零温与低温#^def-zero-temperature-fermi-sphere|零温费米能]]满足 $N=\dfrac{2}{3}AE_F^{3/2}$，解得
>
> $$
> \mu(T)=E_F\left[
> 1-\dfrac{\pi^2}{12}\left(\dfrac{T}{T_F}\right)^2+\cdots
> \right],
> \qquad
> T_F=\dfrac{E_F}{k_B}.
> $$

^prop-fermi-low-temperature-mu

令 $t=T/T_F$、$\mu=E_F(1+a t^2+\cdots)$，把上面的粒子数积分除以 $N=2AE_F^{3/2}/3$，得到

$$
1=(1+a t^2)^{3/2}+\dfrac{\pi^2}{8}t^2(1+a t^2)^{-1/2}+\cdots
=1+\left(\dfrac32a+\dfrac{\pi^2}{8}\right)t^2+\cdots.
$$

比较 $t^2$ 的系数得 $a=-\pi^2/12$，不需要沿书中的隐式方程反复迭代。

## 内能和热容

> [!done] 三维非相对论费米气体的低温内能与热容
> 内能积分取 $\phi_U(E)=AE^{3/2}$。把上面的 $\mu(T)$ 代回 Sommerfeld 展开，得到
>
> $$
> U=\dfrac{3}{5}NE_F\left[
> 1+\dfrac{5\pi^2}{12}\left(\dfrac{T}{T_F}\right)^2+\cdots
> \right].
> $$
>
> 因此
>
> $$
> C_V=\left(\dfrac{\partial U}{\partial T}\right)_{V,N}
> =\dfrac{\pi^2}{2}Nk_B\dfrac{T}{T_F}+\cdots.
> $$

^prop-fermi-low-temperature-energy

为核对上式系数，令 $t=T/T_F$，先把能量积分展开为

$$
U=\dfrac25 A\mu^{5/2}+\dfrac{\pi^2}{4}A(k_BT)^2\mu^{1/2}+\cdots.
$$

代入 $\mu/E_F=1-\pi^2t^2/12+\cdots$：

$$
\dfrac{U}{(2/5)AE_F^{5/2}}
=1-\dfrac{5\pi^2}{24}t^2+\dfrac{5\pi^2}{8}t^2+\cdots
=1+\dfrac{5\pi^2}{12}t^2+\cdots.
$$

固定 $N,V$ 时 $E_F,T_F$ 不变，对这个式子按 $T$ 求导就得到 $C_V$。

低温费米气体只有费米面附近约 $k_BT$ 宽度内的粒子能被热激发，所以 $C_V$ 与 $T$ 成正比。


## 费米积分的大逸度展开

[[费米积分的级数展开#^prop-fermi-fugacity-series|小逸度幂级数]] 只适用于 $z\le1$。低温固定密度时 $z=e^{\mu/(k_BT)}\gg1$，改用 $\eta=\ln z$ 作为大参数。对 $f_\nu(z)$ 的积分取 $\mu=\eta$、$k_BT=1$ 的无量纲形式，以及 $\phi(x)=x^{\nu-1}/\Gamma(\nu)$，得到

> [!done] 费米积分的大逸度渐近式
> 对固定 $\nu>0$，$\eta=\ln z\gg1$ 时，
> $$
> f_\nu(e^\eta)
> \sim\dfrac{\eta^\nu}{\Gamma(\nu+1)}
> \left[1+\dfrac{\pi^2}{6}\dfrac{\nu(\nu-1)}{\eta^2}+\cdots\right].
> $$
^prop-fermi-integral-large-eta

$\sim$ 表示这是大参数的渐近展开：前几项在 $\eta$ 很大时给近似，不是对任意 $z$ 都收敛的幂级数。取 $\nu=3/2$，括号中的修正为 $\pi^2/(8\eta^2)$，这正是书中式 (4.1.135) 的来源。取 $\nu=5/2$，修正为 $5\pi^2/(8\eta^2)$。网站图像用原积分数值作图，在 $\eta\ge4$ 时才显示该近似作参照。

## 二阶矩的系数从哪里来

上面采用的标准定积分中，零阶矩由 $w(x)=e^x/(1+e^x)^2=-d[1/(1+e^x)]/dx$ 的端点值直接得到 $\int w(x)dx=1$。二阶矩用偶性、分部积分及 $x>0$ 时的几何级数得到

$$
\begin{aligned}
\int_{-\infty}^{\infty}x^2w(x)dx
&=4\int_0^\infty\dfrac{x}{1+e^x}dx\\
&=4\sum_{\ell=1}^\infty\dfrac{(-1)^{\ell-1}}{\ell^2}
=\dfrac{\pi^2}{3}.
\end{aligned}
$$

最后一步用 $\sum_{\ell\ge1}\ell^{-2}=\pi^2/6$：把偶数项从全体项中减去两次，交错和就是总和的一半。总和的值也可由 [[DSP/信号的傅里叶级数|Fourier 级数]] 核对：即把周期函数表示为正弦、余弦的和。对周期延拓的 $x^2$（$-\pi\le x\le\pi$），逐次分部积分给余弦系数 $4(-1)^\ell/\ell^2$ 和常数项 $\pi^2/3$，于是 $x^2=\pi^2/3+4\sum_{\ell\ge1}(-1)^\ell\cos(\ell x)/\ell^2$。周期延拓在端点两侧同为 $\pi^2$，且分段光滑，Fourier 级数在此收敛到左右极限的平均值。因此在 $x=\pi$ 可代入 $\pi^2=\pi^2/3+4\sum_{\ell\ge1}\ell^{-2}$。本页只需要这个二阶矩，因此不再计算更高阶系数。

原有手稿供核对：

![[统计物理/assets/thermal-terminal/07-fermi-sommerfeld.png]]
