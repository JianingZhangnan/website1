# 3D 伊辛：泛函 RG（Wetterich 方程）

场论 RG（[[3D伊辛-场论RG-ε展开与定维展开]]）是微扰 + 重求和。泛函 RG（也叫非微扰 RG）走另一条：写下一个**精确的流动方程**，不依赖任何小量。

## 有效平均作用与精确流

引入一个随尺度 $k$ 变化的"有效平均作用" $\Gamma_k[\varphi]$：它只把动量 $\gtrsim k$ 的涨落积掉。两端是已知的——$k=\Lambda$（紫外）时没积任何涨落，$\Gamma_\Lambda$ 就是裸作用；$k=0$ 时涨落全积完，$\Gamma_0$ 就是完整的自由能。中间怎么连？由 **Wetterich 方程**精确给出：

$$\boxed{\ \partial_t\Gamma_k=\tfrac12\,\mathrm{STr}\Big[\big(\Gamma_k^{(2)}+R_k\big)^{-1}\partial_t R_k\Big],\qquad t=\ln\frac k\Lambda.\ }$$

$\Gamma_k^{(2)}$ 是 $\Gamma_k$ 对场的二阶泛函导数（完整的逆传播子），$R_k$ 是把动量 $<k$ 的模式"冻住"的红外正规化子，$\mathrm{STr}$ 是对动量与内部指标求迹。这是一条**泛函 ODE**——是 [[RG的流是递推还是真正的流]] 里"真正的流"的极致版：不动点是一个**不动点泛函** $\Gamma_*$（整条函数被钉死，而非几个耦合）。

## 导数展开：把泛函流变成可算

$\Gamma_k$ 是无穷多耦合的泛函，得截断。最常用的是**导数展开**：按场的梯度幂次保留有限项，

$$\Gamma_k=\int d^dx\Big[U_k(\varphi)+\tfrac12 Z_k(\varphi)(\nabla\varphi)^2+\cdots\Big],$$

到 $O(\partial^2),O(\partial^4),O(\partial^6)$。注意它**不**是微扰小耦合，而是对涨落的非微扰重组——能在任意维直接做，不必 $\varepsilon$ 小。代进 Wetterich 方程得 $U_k,Z_k$ 的流，求其标度不动点即威尔逊–费希尔不动点，线性化出指数。

## 结果（$n=1,\ d=3$）

逐阶收敛（De Polsi 等 2020）：

| 阶 | $\nu$ | $\tilde\eta$ |
|---|---|---|
| $O(\partial^2)$ | $0.6278(22)$ | $0.0450(87)$ |
| $O(\partial^4)$ | $0.63027(30)$ | $0.03454(176)$ |
| $O(\partial^6)$ | $0.63017(20)$ | $0.03581(49)$ |

推荐最佳值 $\nu=0.62989(25),\ \tilde\eta=0.03622(115),\ \omega=0.797(12)$——与场论、自举、蒙特卡洛相互一致（对比见 [[3D伊辛-共形自举]]）。关键进展（Balog 等 2019）是证明了导数展开有**有限收敛半径**、逐阶被一个小参数（约 $1/9\sim1/4$）压低，故能给可靠误差棒。

**文献**：C. Wetterich, *Phys. Lett. B* **301**, 90 (1993)；J. Berges, N. Tetradis & C. Wetterich, *Phys. Rep.* **363**, 223 (2002)；I. Balog, H. Chaté, B. Delamotte, M. Marohnić & N. Wschebor, *Phys. Rev. Lett.* **123**, 240604 (2019)；G. De Polsi, I. Balog, M. Tissier & N. Wschebor, *Phys. Rev. E* **101**, 042113 (2020)。
