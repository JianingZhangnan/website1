# Stern–Gerlach：自旋上下分量的 $\langle z\rangle(t)$

题目见 `practice1.png`。中子初态 $|\psi_0\rangle=\psi(\boldsymbol r,0)(\alpha|\uparrow\rangle+\beta|\downarrow\rangle)$，$\langle\boldsymbol r\rangle=0$，$\langle p_x\rangle=p_0$，$\langle p_y\rangle=\langle p_z\rangle=0$。

## 哈密顿量按自旋分块（关键一步）

你已算出 $\boldsymbol B=(0,0,B_0+\lambda z)$，$\hat{\boldsymbol\sigma}\cdot\boldsymbol B=\sigma_z(B_0+\lambda\hat z)$，故

$$
\hat H=\frac{\hat p^{2}}{2m}-\mu\,\sigma_z(B_0+\lambda\hat z).
$$

要点：$\sigma_z$ 与轨道部分对易，且 $[\hat H,\sigma_z]=0$。在 $\{|\uparrow\rangle,|\downarrow\rangle\}$ 基下 $\sigma_z$ 对角（本征值 $\pm1$），所以 $\hat H$ **分裂成两个互不耦合的轨道哈密顿量**

$$
\hat H_{\uparrow}=\frac{\hat p^{2}}{2m}-\mu(B_0+\lambda\hat z),\qquad
\hat H_{\downarrow}=\frac{\hat p^{2}}{2m}+\mu(B_0+\lambda\hat z).
$$

自旋向上的空间波包只在 $\hat H_\uparrow$ 下演化，向下的只在 $\hat H_\downarrow$ 下演化——彼此独立。$\alpha,\beta$ 只决定各支的权重 $|\alpha|^2,|\beta|^2$，在求"自旋向上中子的 $\langle z\rangle$"（条件期望）时会归一化掉，不影响结果。

## 你忘记的那一步：怎么"让态演化"

$\hat H$ 不显含 $t$，正式的演化是 $|\psi(t)\rangle=e^{-i\hat H t/\hbar}|\psi_0\rangle$。但**本题只问 $\langle z\rangle(t)$，不必解出整个 $\psi(\boldsymbol r,t)$**——直接对期望值用 Ehrenfest 定理（见 [[系统随时间的演化]]）：

$$
\frac{d}{dt}\langle\hat z\rangle=\frac{1}{i\hbar}\langle[\hat z,\hat H]\rangle=\frac{\langle\hat p_z\rangle}{m},\qquad
\frac{d}{dt}\langle\hat p_z\rangle=\frac{1}{i\hbar}\langle[\hat p_z,\hat H]\rangle=-\Big\langle\frac{\partial V}{\partial z}\Big\rangle.
$$

对每一支，$z$ 方向势能是 $z$ 的**线性函数**，故 $\dfrac{\partial V}{\partial z}$ 是常数，力是恒力：

$$
\hat H_\uparrow:\ V_\uparrow=-\mu(B_0+\lambda z),\ \ F_\uparrow=-\frac{\partial V_\uparrow}{\partial z}=+\mu\lambda;\qquad
\hat H_\downarrow:\ F_\downarrow=-\mu\lambda.
$$

（$B_0$ 是常数势，不产生力，只是能量平移，对 $\langle z\rangle$ 无贡献。）这正是**匀加速运动**：恒力 $\Rightarrow$ 加速度 $a_\pm=\pm\mu\lambda/m$。

## 积分得结果

$\langle\hat p_z\rangle$ 是常数力的线性增长，$\langle\hat z\rangle$ 再积一次。代入初值 $\langle z\rangle(0)=0$、$\langle p_z\rangle(0)=0$：

$$
\langle\hat p_z\rangle_{\pm}(t)=\pm\mu\lambda\,t,\qquad
\langle\hat z\rangle_{\pm}(t)=\frac{\langle p_z\rangle(0)}{m}t+\frac12\frac{F_\pm}{m}t^{2}.
$$

$$
\boxed{\ \langle\hat z\rangle_{\uparrow}(t)=+\frac{\mu\lambda}{2m}\,t^{2},\qquad \langle\hat z\rangle_{\downarrow}(t)=-\frac{\mu\lambda}{2m}\,t^{2}.\ }
$$

两支沿 $z$ 反向、随 $t^2$ 分开——这就是 Stern–Gerlach 把束流按自旋劈成两束的物理。（$x$ 方向 $\langle p_x\rangle=p_0$ 守恒、$\langle x\rangle=p_0t/m$ 是束流前进方向，本题没问。）

> 等价做法：海森堡绘景里解 $\hat z(t)$。$\dfrac{d\hat z}{dt}=\dfrac{\hat p_z}{m}$、$\dfrac{d\hat p_z}{dt}=\pm\mu\lambda$，给出 $\hat z_\pm(t)=\hat z+\dfrac{\hat p_z}{m}t\pm\dfrac{\mu\lambda}{2m}t^2$，取期望同样得上式。两种绘景一致。
