# 2D 伊辛：精确解与 CFT 基准

2D 实空间 RG（[[2D伊辛-Migdal-Kadanoff递推]]、[[2D伊辛-NvL累积量展开]]）只给近似指数。它们的标尺是两样精确的东西：Onsager 解与临界点的共形场论。

## Onsager 精确解

Onsager（1944）用传递矩阵精确解出零场方格伊辛的自由能，给出临界耦合

$$K_c=\tfrac12\ln(1+\sqrt2)\approx0.44069\quad(\tanh K_c=\sqrt2-1),\qquad T_c\approx2.2692\,J/k_B.$$

精确临界指数（与维度 $d=2$ 锁定）：

| $\alpha$ | $\beta$ | $\gamma$ | $\delta$ | $\nu$ | $\tilde\eta$ |
|---|---|---|---|---|---|
| $0$（对数） | $1/8$ | $7/4$ | $15$ | $1$ | $1/4$ |

（$\beta=1/8$ 的自发磁化由 Onsager 宣布、Yang 1952 首次发表。）这些满足 [[04-标度假设与普适性]] 的全部标度律，可作为任何近似法的判分线。

## 临界点 = 共形场论

临界点上 $\xi=\infty$、无标度，系统不仅标度不变，更是**共形不变**（标度不变加上局域伸缩）。在 2D，共形对称是无穷维的，约束极强，使 2D 伊辛临界点成为一个**可精确求解的"极小模型"**——等价于一个无质量的自由马约拉纳费米子。刻画它的一个普适数叫**中心荷** $c=1/2$。

理论里每个标度算符（场）有一个**标度维度** $\Delta$（即 [[05-重整化群]] 中场在重标下要乘的幂，这里给出精确值）。只三个基本算符：

| 算符 | $\Delta$ | 临界指数角色 |
|---|---|---|
| 单位 $\mathbb1$ | $0$ | — |
| 自旋 $\sigma$ | $1/8$ | $\tilde\eta=2\Delta_\sigma=1/4$；$\beta=\nu\Delta_\sigma=1/8$ |
| 能量 $\varepsilon$ | $1$ | $\nu=\dfrac1{d-\Delta_\varepsilon}=1$；$\alpha=0$ |

指数全由两个**相关**算符（$\sigma$ 对应外场、$\varepsilon$ 对应温度）的标度维度定出，正是 [[05-重整化群]] 里"指数 = 不动点本征值"的精确版：$y_h=d-\Delta_\sigma$、$y_t=d-\Delta_\varepsilon$。验证 $\tilde\eta=2\Delta_\sigma-(d-2)=1/4$、$\nu=1/(2-1)=1$，与 Onsager 完全一致。

（共形场论的完整机器超出本笔记；这里只取"算符 + 标度维度 + 指数字典"的结论。它也是 3D 共形自举的出发点，见 [[3D伊辛-共形自举]]。）

**文献**：L. Onsager, *Phys. Rev.* **65**, 117 (1944)；C. N. Yang, *Phys. Rev.* **85**, 808 (1952)；A. A. Belavin, A. M. Polyakov & A. B. Zamolodchikov, *Nucl. Phys. B* **241**, 333 (1984)（共形场论/极小模型）；教科书 J. Cardy, *Scaling and Renormalization in Statistical Physics* (1996)。
