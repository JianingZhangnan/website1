二者的定义在此前已经给出。很多地方都告诉我们， $SU(2)$ 包含了 $SO(3)$. 那么这个包含到底是什么意思，我们今天来严谨探讨一下。
首先，我们想构建一个从SU2到SO3的 homomorphism. 我们知道 $SU(2)$ 和 $SO(3)$ 都可以通过三个参数进行参数化。对于 $SO(3)$ 来说，常见的方式有欧拉角；对于 $SU(2)$ 来说，可以借助 Pauli 矩阵。

直观而言，从一个 $2\times 2$ 的复矩阵到一个 $3\times 3$ 的实矩阵，想做一个逐元素的、直接的同态并不容易，况且二者各自都带有约束方程。因此我们换一个思路，从**群作用**的角度来正向构造这个同态：

1. **明确目标：在 $\mathbb{R}^{3}$ 上构造保长线性作用**。
   $SO(3)$ 在 $\mathbb{R}^{3}$ 上有一个自然作用，即保持欧氏长度（与定向）的空间旋转。如果我们想构造同态 $R: SU(2) \to SO(3)$，等价于让每一个 $u \in SU(2)$ 都能在 $\mathbb{R}^{3}$ 上诱导一个**保范数（保长）的 $\mathbb{R}$-线性变换**（再结合连通性即可将 $O(3)$ 限制到 $SO(3)$）。

2. **将 $\mathbb{R}^{3}$ 与“长度”一同编码进 $2\times 2$ 矩阵空间 $\mathscr{H}$**
   为了让 $2\times 2$ 矩阵 $u \in SU(2)$ 能够作用在三维实向量上，我们把 $\vec{x} \in \mathbb{R}^{3}$ 映射为 $2\times 2$ 无迹厄米矩阵空间 $\mathscr{H} = \{m \in M_2(\mathbb{C}) \mid m^\dagger = m,\; \operatorname{Tr}(m) = 0\}$ 中的元素：
   $$
   h:\mathbb{R}^{3}\to\mathscr{H},\quad h(\vec{x})=\vec{x}\cdot \boldsymbol{\sigma} = x_{i}\sigma^{i}=\begin{pmatrix}
   x_{3} & x_{1}-\mathrm{i}x_{2} \\
   x_{1}+\mathrm{i}x_{2} & -x_{3}
   \end{pmatrix}
   $$
   这是一个 $\mathbb{R}$-线性同构（这里 $\mathscr{H}$ 与 $\mathbb{R}^{3}$ 作为实向量空间同构，只是元素用矩阵表示）。更重要的是，**这个编码把 $\mathbb{R}^{3}$ 上的欧氏范数直接转化成了矩阵的行列式**：
   $$
   \det\bigl(h(\vec{x})\bigr) = -x_3^2 - (x_1^2 + x_2^2) = -\|\vec{x}\|^2
   $$
   于是，“在 $\mathbb{R}^{3}$ 上构造保长线性变换”，就完全等价于“在 $\mathscr{H}$ 上构造**保行列式**的 $\mathbb{R}$-线性变换”。

3. **在 $\mathscr{H}$ 上自然引出共轭作用 $C_u$**
   现在来看 $u \in SU(2)$ 应当如何作用在 $m \in \mathscr{H}$ 上，才能既不跑出 $\mathscr{H}$，又保持 $\det(m)$ 不变：
   - 如果直接左乘 $m \mapsto um$，一般既不再满足厄米性，迹也不再为 $0$，会直接跑出 $\mathscr{H}$；
   - 由于 $u$ 是酉矩阵（$u^\dagger = u^{-1}$），最自然的选择是**酉共轭（相似变换）**：
     $$
     C_{u}: \mathscr{H}\to \mathscr{H}, \quad C_{u}(m)=umu^{\dagger}
     $$
   这个作用一次性满足了我们需要的全部条件：
   - **空间封闭性与线性性**：对任意 $m \in \mathscr{H}$，利用 $u^\dagger u = I$ 有 $(umu^\dagger)^\dagger = um^\dagger u^\dagger = umu^\dagger$ 且 $\operatorname{Tr}(umu^\dagger) = \operatorname{Tr}(mu^\dagger u) = \operatorname{Tr}(m) = 0$，因此 $C_u(m) \in \mathscr{H}$，且显然是 $\mathbb{R}$-线性双射；
   - **保行列式**：相似变换不改变行列式，即 $\det\bigl(C_u(m)\bigr) = \det(umu^{-1}) = \det(m)$；
   - **天然满足群作用相容性**：对任意 $u_1, u_2 \in SU(2)$，
     $$
     C_{u_1 u_2}(m) = (u_1 u_2) m (u_1 u_2)^\dagger = u_1 (u_2 m u_2^\dagger) u_1^\dagger = (C_{u_1} \circ C_{u_2})(m)
     $$

4. **通过同构 $h$ 拉回 $\mathbb{R}^{3}$，得到目标同态 $R$**
   既然 $h: \mathbb{R}^{3} \xrightarrow{\sim} \mathscr{H}$ 是线性同构，我们将 $\mathscr{H}$ 上的线性变换 $C_u$ 通过 $h$ 拉回 $\mathbb{R}^{3}$，便唯一确定了 $\mathbb{R}^{3}$ 上的线性变换：
   $$
   R(u) := h^{-1} \circ C_u \circ h : \mathbb{R}^{3} \to \mathbb{R}^{3}
   $$
   （若不显式写出 $h^{-1}$，也可等价地写为 $u(\vec{x}\cdot\boldsymbol{\sigma})u^\dagger = \bigl(R(u)\vec{x}\bigr)\cdot\boldsymbol{\sigma}$。）

   在这个构造下，$R(u) \in SO(3)$ 以及同态性几乎水到渠成：
   - **正交性（$R(u) \in O(3)$）**：因为 $C_u$ 保行列式而 $\det(h(\vec{x})) = -\|\vec{x}\|^2$，故
     $$
     \|R(u)\vec{x}\|^2 = -\det\bigl(h(R(u)\vec{x})\bigr) = -\det\bigl(C_u(h(\vec{x}))\bigr) = -\det\bigl(h(\vec{x})\bigr) = \|\vec{x}\|^2
     $$
     即 $R(u)$ 是 $\mathbb{R}^{3}$ 上的正交变换（$\det R(u) = \pm 1$）。
   - **定向保持（$R(u) \in SO(3)$）**：当 $u = I$ 时，$R(I) = \mathrm{id}_{\mathbb{R}^{3}}$，有 $\det R(I) = 1$。由于 $SU(2)$ 是道路连通的（同胚于 $S^3$），而 $u \mapsto \det R(u) \in \{\pm 1\}$ 是连续映射，因此对所有 $u \in SU(2)$ 必有 $\det R(u) = 1$。由此 $R: SU(2) \to SO(3)$ 是良定的。
   - **同态性**：由 $C_{u_1 u_2} = C_{u_1} \circ C_{u_2}$ 直接可得
     $$
     R(u_1 u_2) = h^{-1} C_{u_1 u_2} h = h^{-1} C_{u_1} h h^{-1} C_{u_2} h = R(u_1) R(u_2)
     $$

至此，我们已经从正向构造出了群同态 $R: SU(2) \to SO(3)$。接下来，我们只需要验证 $R$ 是满射（并刻画其核 $\ker R$），就能看清“$SU(2)$ 包含 $SO(3)$”的严谨含义。