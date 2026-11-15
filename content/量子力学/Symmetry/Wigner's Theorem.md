在量子力学的早期建立阶段，海森堡、狄拉克等早期学者直接沿用了分析力学与[[Classical Mechanics/2. Continuos Symmetry|诺特定理]]（对称性对应守恒量）的思路：如果一个变换保持哈密顿量不变，它就是[[量子力学/Symmetry/Classical Symmetry|对称性]]。

## 从哈密顿量不变到跃迁概率不变

将量子对称性直接定义为 $\hat T \hat H \hat T^{-1} = \hat H$（等价于[[量子力学/Hilbert空间/对易子与反对易子|对易子]] $[\hat T, \hat H] = 0$，见[[量子力学/基础与演化/幺正算符与厄米算符的区别|幺正对称变换与哈密顿量对易的等价性]]），隐含了一个前提：变换 $\hat T$ 在[[量子力学/Hilbert空间/简介|Hilbert 空间]]中是一个[[量子力学/基础与演化/幺正算符与厄米算符的区别#^def-hermitian-unitary|线性幺正算符]]（线性性保证标量可提出，幺正性保证内积与能量期望值不变）。

这一前提并不总是成立。例如[[量子力学/Symmetry/Time-Reversal Operator|时间反演算符]] $\hat T$（从波函数角度定义为 $\hat T|\psi(t)\rangle = |\psi(-t)\rangle$）便无法实现为线性算符（具体证明需在确立 Wigner 定理后由时间演化方程导出，详见[[量子力学/Symmetry/Time-Reversal Operator]]）。可见，在讨论“哈密顿量是否不变”之前，必须先确定量子力学中的对称变换在 Hilbert 空间上究竟对应哪一类映射。

根据[[量子力学/基础与演化/基础公设#^def-pure-state-postulate|状态公设]]，态矢 $|\psi\rangle$ 与相差整体相因子的态矢 $e^{i\alpha}|\psi\rangle$（$\alpha \in \mathbb{R}$）对应同一个物理态（即 Hilbert 空间中的一条**射线**，ray）。量子力学中直接具有物理意义的量是两态之间的跃迁概率 $|\langle \phi | \psi \rangle|^2$（见[[量子力学/基础与演化/基础公设#3. 测量公设|Born's Rule]]）。因此，对称变换首先必须满足运动学层面的不变性：它把射线映到射线，且保持所有跃迁概率不变。若记 $|\psi'\rangle, |\phi'\rangle$ 分别为变换 $T$ 作用在 $|\psi\rangle, |\phi\rangle$ 对应射线上的代表元，则对任意态均有

$$
|\langle \phi' | \psi' \rangle|^2 = |\langle \phi | \psi \rangle|^2.
$$

## Wigner 定理

> [!def] 反线性算符与反幺正算符
> 设 $\hat A$ 为 Hilbert 空间 $\mathcal{H}$ 上的映射。若对任意 $|\psi\rangle, |\phi\rangle \in \mathcal{H}$ 及复数 $c_1, c_2 \in \mathbb{C}$，满足
>
> $$
> \hat A(c_1 |\psi\rangle + c_2 |\phi\rangle) = c_1^* \hat A|\psi\rangle + c_2^* \hat A|\phi\rangle,
> $$
>
> 则称 $\hat A$ 为**反线性算符**（antilinear operator）。若反线性算符 $\hat A$ 同时满足保持内积共轭：
>
> $$
> \langle \hat A\phi | \hat A\psi \rangle = \langle \phi | \psi \rangle^* = \langle \psi | \phi \rangle,
> $$
>
> 则称 $\hat A$ 为**反幺正算符**（antiunitary operator）。
^def-antiunitary

> [!done] Wigner 定理
> 设 $T$ 是 Hilbert 空间 $\mathcal{H}$ 上保持所有跃迁概率 $|\langle \phi' | \psi' \rangle|^2 = |\langle \phi | \psi \rangle|^2$ 不变的射线映射，则在适当选取各态的整体相因子后，$T$ 可以由 $\mathcal{H}$ 上的一个[[量子力学/基础与演化/幺正算符与厄米算符的区别#^def-hermitian-unitary|幺正算符]]（线性）或[[#^def-antiunitary|反幺正算符]]（反线性）实现，且该算符在相差一个整体常数相因子的意义下唯一。
^thm-wigner

Wigner 定理确立了对称变换的数学形式：

- **线性幺正情形**：由参数连续变化且可连续退化到恒等算符 $\hat I$（满足 $\hat I|\psi\rangle = |\psi\rangle$）的对称性称为**连续对称性**（如空间平移、旋转）。由于线性算符与反线性算符满足不同的数乘规则（$c$ 与 $c^*$），两者之间不存在连续过渡，因此能连续连接到线性算符 $\hat I$ 的对称算符必为线性幺正算符 $\hat U$。当哈密顿量不显含时间时，[[量子力学/基础与演化/系统随时间的演化#^prop-time-independent-evolution|时间演化算符]]为 $e^{-i\hat H t/\hbar}$；若不显含时间的 $\hat U$ 与时间演化算符对易，展开一阶项即回到早期“$[\hat U, \hat H] = 0$”的表述。
- **反线性反幺正情形**：不能由 $\hat I$ 连续形变得到的对称性称为**离散对称性**（如时间反演）。Wigner 定理为这一分支提供了反幺正算符这一数学实现，后续可据此进一步证明时间反演算符的具体形式与性质。
