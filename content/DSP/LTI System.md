>[!def] LTI system
>算子 $\mathcal{T}$ 是线性、时不变的。即：
>- $\mathcal{T}[\lambda_{1}x_{1}(t)+\lambda_{2}x_{2}(t)]=\lambda_{1}\mathcal{T}[x_{1}(t)]+\lambda_{2}\mathcal{T}[x_{2}(t)]$.
>- $\mathcal{T}$ 与时间平移算符 $\mathscr{T}$ 对易，即若 $\mathcal{T}[x(t_{1})]=y(t_{1})$，则 $\mathcal{T}[x(t_{1}+\Delta t)]=y(t_{1}+\Delta t)$.
^def-lti-system

利用 LTI system 的线性和时不变性，我们可以把算子表示成卷积形式。核心思想如下：

> [!done] 信号的冲激分解
> 首先，任意输入信号可以视为单位冲激信号的和：
> $$
> \begin{align}
> \text{discrete:} &  \quad x[n] = \sum_{k=-\infty}^{+\infty} x[k]\delta [n-k ] \\
> \text{continuos:} & \quad x(t) = \int_{-\infty}^{+\infty} x(\tau)\delta(t-\tau) \, \mathrm{d}\tau 
> \end{align}
> $$
^done-lti-impulse-decomposition

> [!def] 冲激响应
> 然后，假设 $\mathcal{T}[\delta(t)]=h(t)$, 即 $h(t)$ 为单位冲激的响应，则由于 **Time Invariant**，有：
> $$
> \mathcal{T}[\delta(t-\tau)]=h(t-\tau )
> $$

> [!done] LTI 系统的卷积表示
> 由于线性，将线性算子作用到输入信号上，有：
> $$
> \begin{align}
> \text{discrete:} & \quad \mathcal{T}[x[n]]=\sum_{k=-\infty}^{+\infty}x[k] \cdot h[n-k] \\
> \text{continuos:} & \quad \mathcal{T}[x(t)]=\int_{-\infty}^{+\infty} x(\tau)h(t-\tau) \, \mathrm{d}\tau  
> \end{align}
> $$
> 上两式分别是离散和连续情形下的卷积。
^done-lti-convolution

当然其中有一些数学上需要严格化的地方，比如 $\delta$ 函数作为一种分布，而非普通的 $L^{2}$ 空间的向量，其线性性等需要严格定义，此处不讨论。

这个的意义是，对于任何 LTI 系统，我们只要首先求出冲激响应 $h(t)$，就可以通过卷积求出任意输入 $x(t)$ 的响应 $y(t)=x(t)*h(t)$.

---
## LTI 具体例子

### 微分方程和差分方程

> [!def] 微分、差分与单位延时算子
> 微分算子 $\mathcal{L}=\sum_{k=0}^{N}a_{k}\dfrac{\mathrm{d}^{k}}{\mathrm{d}t^{k}}$ ，差分算子 $\mathcal{D}=\sum_{k=0}^{N}a_{k}\mathscr{S}^{k}$（其中 $\mathscr{S}$ 为单位延时算符 $(\mathscr{S}x)[n]=x[n-1]$）。

由常系数微分/差分方程描述的系统：
$$
\begin{align}
\text{continuous:} & \quad \sum_{k=0}^{N} a_{k} \frac{\mathrm{d}^{k}y(t)}{\mathrm{d}t^{k}} = \sum_{m=0}^{M} b_{m} \frac{\mathrm{d}^{m}x(t)}{\mathrm{d}t^{m}} \\
\text{discrete:} & \quad \sum_{k=0}^{N} a_{k} y[n-k] = \sum_{m=0}^{M} b_{m} x[n-m]
\end{align}
$$

>[!def] 初始松弛条件（Initial Rest）
>微分/差分方程构成严格 LTI 系统的**充要前提是系统处于零状态**（即在输入施加前所有状态变量为零）。
>若初始状态非零，输出包含零输入响应（ZIR），算子失去线性性（零输入时输出不为零）。

> [!done] 零状态下的冲激响应方程
> 在零状态下，冲激响应 $h(t)$ 满足：
> $$
> \sum_{k=0}^{N} a_{k} \frac{\mathrm{d}^{k}h(t)}{\mathrm{d}t^{k}} = \sum_{m=0}^{M} b_{m} \frac{\mathrm{d}^{m}\delta(t)}{\mathrm{d}t^{m}}
> $$
> 此时系统的完全响应即可通过卷积统一写为 $y(t) = (x * h)(t)$。

---

## 冲激响应与 LTI 系统的性质

系统的时域核心特性全部被唯一编码在冲激响应 $h$ 中：

### 1. 因果性 (Causality)

> [!done] LTI 系统的因果性判据
> 结合 [[Causal System]]，系统在当前时刻的输出不依赖于未来的输入：
> $$
> \begin{align}
> \text{continuous:} & \quad h(t) = 0, \quad \forall t < 0 \implies y(t) = \int_{-\infty}^{t} x(\tau)h(t-\tau) \, \mathrm{d}\tau \\
> \text{discrete:} & \quad h[n] = 0, \quad \forall n < 0 \implies y[n] = \sum_{k=-\infty}^{n} x[k]h[n-k]
> \end{align}
> $$

### 2. BIBO 稳定性 (Bounded-Input Bounded-Output Stability)

> [!def] BIBO 稳定性
> 对每个有界输入，系统的输出也有界，称系统具有有界输入有界输出（BIBO）稳定性。

> [!done] LTI 系统的 BIBO 稳定判据
> 若输入有界 $|x(t)| \leq B_x < \infty$，输出亦保持有界 $|y(t)| \leq B_y < \infty$ 的充要条件是冲激响应**绝对可积 / 绝对可和**：
> $$
> \begin{align}
> \text{continuous:} & \quad \|h\|_{L^1} = \int_{-\infty}^{+\infty} |h(t)| \, \mathrm{d}t < \infty \\
> \text{discrete:} & \quad \|h\|_{\ell^1} = \sum_{n=-\infty}^{+\infty} |h[n]| < \infty
> \end{align}
> $$

### 3. 可逆性 (Invertibility)

> [!def] LTI 逆系统
> 若存在逆系统 $\mathcal{T}^{-1}$，其冲激响应 $h_{\text{inv}}$ 满足恒等映射条件：
> $$
> (h * h_{\text{inv}})(t) = \delta(t) \quad (\text{discrete: } h[n] * h_{\text{inv}}[n] = \delta[n])
> $$

---

## LTI 系统的特征函数与频域分析的本质

为什么信号处理要引入傅里叶变换、拉普拉斯变换与 Z 变换？数学根本在于：**复指数信号是所有 LTI 系统的共同特征函数 (Eigenfunctions)**。

>[!done] 复指数信号是 LTI 算子的特征函数
>对连续时间输入 $x(t) = e^{st} \ (s \in \mathbb{C})$，系统的响应为：
>$$
>\mathcal{T}[e^{st}] = \int_{-\infty}^{+\infty} h(\tau) e^{s(t-\tau)} \, \mathrm{d}\tau = \left( \int_{-\infty}^{+\infty} h(\tau) e^{-s\tau} \, \mathrm{d}\tau \right) e^{st} = H(s) e^{st}
>$$
>输出仍然是同频复指数信号，仅被标量特征值 $H(s)$ 加权。
>- 当 $s = \sigma + j\omega$ 时，特征值 $H(s)$ 即**双边拉普拉斯变换**（传递函数）；
>- 当 $s = j\omega$ 时，特征值 $H(j\omega)$ 即**连续时间傅里叶变换**（频率响应）。
>
>离散时间下完全对偶：对输入 $x[n] = z^{n} \ (z \in \mathbb{C})$：
>$$
>\mathcal{T}[z^n] = \sum_{k=-\infty}^{+\infty} h[k] z^{n-k} = \left( \sum_{k=-\infty}^{+\infty} h[k] z^{-k} \right) z^n = H(z) z^n
>$$
>特征值 $H(z)$ 即系统的 **Z 变换**。

^e6b26d

这意味着：**傅里叶/拉普拉斯/Z 变换的本质，是将信号投影到 LTI 算子的特征子空间中，将时域复杂的卷积运算对角化为代数乘法。**