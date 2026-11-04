> [!def] 系统 System
> 系统(System)是一个将输入信号 $x(t)$ 映射为输出信号 $y(t)$ 的线性算子 $\mathcal{T}[x(t)]$. "Causal system" 的形式化定义如下：

>[!def] Causal system
>对任意时刻 $t_{0}$，若两个输入 $x_{1},x_{2}$ 在 $t\leq t_{0}$ 上完全相同，则他们的输出在 $t_{0}$ 也必须完全相同：
>$$
>x_{1}(t)=x_{2}(t),\ \ \forall t\leq t_{0}\implies (\mathcal{T}x_{1})(t_{0})=(\mathcal{T}x_{2})(t_{0})
>$$

> [!done] 因果性的截断算符判据
> 或者写成这种形式：
> $$
> \mathcal{P}_{t_{0}}\mathcal{T}=\mathcal{P_{t_{0}}}\mathcal{T}\mathcal{P_{t_{0}}},\quad \forall t_{0}.
> $$

> [!def] 截断算符
> 其中 $\mathcal{P_{t_{0}}}$ 是截断算符：
> $$
> (\mathcal{P}_{t_{0}}x)(t)=\begin{cases}
> x(t),t\leq t_{0} \\
> 0,t>t_{0}
> \end{cases}
> $$

这种写法能很好的看出：因果系统要求系统的输出只取决于当前与历史，而与未来无关。

