# 2D 伊辛抽取：耦合爆炸与截断

一维抽取后还是同形式的链，递推闭合（[[一维伊辛抽取RG]]）。二维一抽取就关不上：本站精确算出"抽掉一个自旋会生出哪些新耦合"，这就是实空间 RG 在 $d\ge2$ 的根本困难。

## 抽一个中心自旋，长出三种耦合

方格点上抽掉中心自旋 $\sigma_0$，它耦合四个邻居 $\sigma_1,\sigma_2,\sigma_3,\sigma_4$（绕中心一圈）：

$$\sum_{\sigma_0=\pm1}e^{K\sigma_0(\sigma_1+\sigma_2+\sigma_3+\sigma_4)}=2\cosh\!\big[K(\sigma_1+\sigma_2+\sigma_3+\sigma_4)\big].$$

右边只依赖四自旋之和，**对它们完全对称**，故无法只用一个近邻耦合表示。把它重新写成指数形式，必须同时容纳三类耦合：四条边的近邻 $K'$、两条对角的次近邻 $L'$、一个四自旋 $M'$：

$$2\cosh\!\big[K\textstyle\sum\sigma_i\big]=A\,\exp\!\Big[K'\!\!\sum_{\text{边}}\!\sigma_i\sigma_j+L'\!\!\sum_{\text{对角}}\!\sigma_i\sigma_k+M'\,\sigma_1\sigma_2\sigma_3\sigma_4\Big].$$

## 解出系数（完整匹配）

四自旋之和 $\sum\sigma_i\in\{\pm4,\pm2,0\}$，按构型分四类，逐一让两边相等（记 $a=\ln A$）：

| 构型 | 边和 | 对角和 | 四自旋 | 左边 |
|---|---|---|---|---|
| 全同向 | $4$ | $2$ | $+1$ | $2\cosh4K$ |
| 三同一异 | $0$ | $0$ | $-1$ | $2\cosh2K$ |
| 两两相邻 | $0$ | $-2$ | $+1$ | $2$ |
| 两两对角 | $-4$ | $2$ | $+1$ | $2$ |

得四个方程：$a+4K'+2L'+M'=\ln2\cosh4K$；$a-M'=\ln2\cosh2K$；$a-2L'+M'=\ln2$；$a-4K'+2L'+M'=\ln2$。后两式相减给 $K'=L'$（单点贡献），代入解得**单点系数**

$$K'_{\rm 单}=L'_{\rm 单}=\tfrac18\ln\cosh4K,\qquad M'=\tfrac18\ln\cosh4K-\tfrac12\ln\cosh2K.$$

## 几何重数 → 格点递推

抽掉的是一套棋盘格点（$b=\sqrt2$）；剩下的格点重组成边长 $\sqrt2$ 的新方格。新格上**每条近邻键被两个中心的贡献叠加**（一对 $\sqrt2$ 间距的存活点有两个公共中心），对角键只一个中心贡献。乘上重数：

$$\boxed{\ K'=\tfrac14\ln\cosh4K,\quad L'=\tfrac18\ln\cosh4K,\quad M'=\tfrac18\ln\cosh4K-\tfrac12\ln\cosh2K.\ }$$

一步就从"只有近邻 $K$"长出近邻、次近邻、四自旋三种耦合。再迭代，更远程、更高阶的耦合层出不穷——**耦合空间无穷繁衍，递推关不上、解析解不了**。（这种不闭合还牵涉严格的"RG 病态"：van Enter–Fernández–Sokal 证明抽取后的重整测度可非吉布斯。）

## 最朴素的截断

要往下算，只能**人为截断**：扔掉 $M'$，把对角 $L'$ 并进有效近邻（粗暴地把 $\sqrt2$ 对角键当近邻键），得闭合的一元递推

$$K'_{\rm eff}=K'+L'=\tfrac38\ln\cosh4K.$$

不动点 $\tfrac38\ln\cosh4K^*=K^*$ 给 $K^*\approx0.507$（精确 $K_c=0.4407$）；导数 $\tfrac{dK'}{dK}\big\vert_*=\tfrac32\tanh4K^*\approx1.449$，$b=\sqrt2$，故 $y_t=\dfrac{\ln1.449}{\ln\sqrt2}\approx1.07$，$\nu=1/y_t\approx0.93$（精确 $\nu=1$）。截断越粗越不准——下一步换更聪明的截断方案（[[2D伊辛-Migdal-Kadanoff递推]]、[[2D伊辛-NvL累积量展开]]）。

**文献**：Maris & Kadanoff, *Am. J. Phys.* **46**, 652 (1978)（此抽取/截断算例）；van Enter, Fernández & Sokal, *J. Stat. Phys.* **72**, 879 (1993)（RG 病态）；推导逐行见 Kardar, *Statistical Physics of Fields*, §V（MIT 8.334）。
