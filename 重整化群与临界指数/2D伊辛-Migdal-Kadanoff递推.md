# 2D 伊辛：Migdal–Kadanoff 移键递推

抽取在 2D 关不上（[[2D伊辛-decimation与耦合爆炸]]）。Migdal–Kadanoff（MK）用一个聪明的近似——**移键**——把递推强行闭合成一元映射，且在某种分形格上**精确**。

## 移键的构造

直接对方格每隔一个自旋抽取，会把格子削得太弱（趋于一维）。MK 的补偿：抽取前先把**将被破坏的键搬到留存的键上**，让每条留存键加倍。在 $d$ 维，一条留存键吸收 $b^{d-1}$ 条邻键；$d=2,\ b=2$ 时加倍，耦合 $K\to 2K$。然后对这些加倍耦合的一维链做抽取。

抽取一维链（耦合 $\tilde K$、去掉中间一个自旋）的精确递推是 $\tilde K'=\tfrac12\ln\cosh2\tilde K$（[[一维伊辛抽取RG]]）。代入移键后的 $\tilde K=2K$：

$$\boxed{\ K'=\tfrac12\ln\cosh(4K)\quad(d=2,\ b=2).\ }$$

一般维：$K'=\tfrac12\ln\cosh(2\cdot2^{d-1}K)$。移键在方格上是**不受控的近似**，但在对应的菱形/分级（Berker）分形格上**严格成立**，因而保证响应函数为正、物理自洽。

## 不动点与指数

不动点 $K'=K$：$2K^*=\ln\cosh4K^*$，即 $e^{2K^*}=\cosh4K^*$，解得

$$K^*\approx0.305\quad(\text{精确 }K_c=0.4407).$$

（约定提醒：在对偶变量 $x=\tanh K$ 里同一方案的不动点常记作 $K^*\approx0.609$；那是 $x^*\leftrightarrow e^{-2K^*}$ 的换标，**物理与本征值不变**。）

热本征值 $\Lambda=\dfrac{dK'}{dK}\big\vert_{K^*}=2\tanh4K^*\approx1.679$，$b=2$：

$$y_t=\frac{\ln\Lambda}{\ln2}\approx0.747,\qquad \nu=\frac1{y_t}\approx1.34\quad(\text{精确 }\nu=1).$$

MK 把 $\nu$ 高估约 34%——精度平平，胜在闭合、可任意维迭代、且总给物理结果。

## 优劣与一处妙事

- $d=3$ 时 $K^*\approx0.065,\ y_t\approx0.934$，维度越高越差；MK 能给出正确的**下临界维度** $d=1$（有限 $K$ 无非平凡不动点），却给不出**上临界维度** $d_c=4$。
- 妙事（Kadanoff 1976）：把 Migdal 公式按**各向异性**重新诠释，竟能对所有 $J_x/J_y$ 重现 2D 伊辛的**精确** $K_c$——近似里藏着一条精确线。

精确标尺见 [[2D伊辛-精确解与CFT基准]]；另一套实空间方案见 [[2D伊辛-NvL累积量展开]]。

**文献**：A. A. Migdal, *Sov. Phys. JETP* **42**, 743 (1976)（相变；勿与 JETP 42, 413 的规范场递推混淆）；L. P. Kadanoff, *Ann. Phys.* **100**, 359 (1976)；Maris & Kadanoff, *Am. J. Phys.* **46**, 652 (1978)；逐行推导见 Kardar, *Statistical Physics of Fields* §V（式 V.51–V.54）。
