# SU(2) 与 SO(3) 的同态构造（定义速览）

> 完整的正向构造与良定性/同态性推导见 [[Group/1. Foundations/SU(2) and SO(3)]]。

1. **向量空间同构 $h$**（将三维实向量编码为 $2\times 2$ 无迹厄米矩阵空间 $\mathscr{H}$）：
   $$
   h:\mathbb{R}^{3}\to\mathscr{H},\qquad h(\vec{x})=\vec{x}\cdot \boldsymbol{\sigma} = x_{i}\sigma^{i}=\begin{pmatrix}
   x_{3} & x_{1}-\mathrm{i}x_{2} \\
   x_{1}+\mathrm{i}x_{2} & -x_{3}
   \end{pmatrix}
   $$
   满足 $\det\bigl(h(\vec{x})\bigr) = -\|\vec{x}\|^2$。

2. **$\mathscr{H}$ 上的酉共轭自同构 $C_u$**：
   $$
   C_{u}: \mathscr{H}\to \mathscr{H}, \qquad C_{u}(m)=umu^{\dagger}\qquad (u\in SU(2))
   $$

3. **群同态 $R: SU(2) \to SO(3)$**：
   $$
   R(u) := h^{-1} \circ C_{u} \circ h
   $$
   等价地，由下式对所有 $\vec{x}\in\mathbb{R}^3$ 唯一确定：
   $$
   u(\vec{x}\cdot\boldsymbol{\sigma})u^\dagger = \bigl(R(u)\vec{x}\bigr)\cdot\boldsymbol{\sigma}
   $$
