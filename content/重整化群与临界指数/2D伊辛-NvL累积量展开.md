# 2D 伊辛：Niemeijer–van Leeuwen 累积量展开

另一套 2D 实空间 RG：在三角格上用"多数票"定块自旋，再用**累积量展开**算出递推。比移键（[[2D伊辛-Migdal-Kadanoff递推]]）更系统，指数也更准些。

## 块变换：多数票 + 微扰劈分

三角格按每三个自旋一格分块（去掉 $1/3$ 自由度，线性重标 $b=\sqrt3$）。块自旋由**多数票**定：$\sigma'=\mathrm{sign}(\sigma_1+\sigma_2+\sigma_3)$。

RG 后的哈密顿量由"对所有与块自旋相容的微观构型求和"定义：$e^{-\beta H'[\sigma']}=\sum_{\sigma\to\sigma'}e^{-\beta H[\sigma]}$。把 $-\beta H$ 劈成**块内**与**块间**两部分：$-\beta H=-\beta H_0-U$。$H_0$（块内三角键）各块独立、可精确求和；$U$（块间键）当微扰，做**累积量（联通团簇）展开**：

$$\beta H'=-\ln\langle e^{-U}\rangle_0+\text{const}=\langle U\rangle_0-\tfrac12\big(\langle U^2\rangle_0-\langle U\rangle_0^2\big)+\cdots$$

## 一阶递推（完整算出）

一阶只需 $\langle U\rangle_0$：把每个块内自旋换成"给定多数票后的平均值"。单块给定多数为 $+$ 时，块内 4 个相容态（$+\!+\!+$ 与三个 $+\!+\!-$）的权重为 $e^{3K}$ 与 $e^{-K}$（三角三键的能量），故单自旋期望

$$\langle\sigma\rangle=\frac{e^{3K}+e^{-K}}{e^{3K}+3e^{-K}}\equiv R(K).$$

相邻两块间有 2 条块间键，每条键的两端各换成 $R(K)\sigma'$，于是

$$\boxed{\ K'=2K\,R(K)^2=2K\left(\frac{e^{3K}+e^{-K}}{e^{3K}+3e^{-K}}\right)^2.\ }$$

## 不动点与指数

不动点要 $R(K^*)^2=\tfrac12$，即 $R=1/\sqrt2$。令 $u=e^{4K}$，$\dfrac{u+1}{u+3}=\dfrac1{\sqrt2}$ 解得 $u=\dfrac{3-\sqrt2}{\sqrt2-1}$，故

$$K^*=\tfrac14\ln\frac{3-\sqrt2}{\sqrt2-1}\approx0.336\quad(\text{精确三角 }K_c\approx0.275).$$

热本征值 $\dfrac{dK'}{dK}\big\vert_{K^*}\approx1.624$，$b=\sqrt3$：

$$y_t=\frac{\ln1.624}{\ln\sqrt3}\approx0.883,\quad \nu=\frac1{y_t}\approx1.13,\quad \alpha=2-\frac2{y_t}\approx-0.26\ (\text{精确 }0).$$

磁场方向类似得 $y_h=\dfrac{\ln(3/\sqrt2)}{\ln\sqrt3}\approx1.37$（精确 $1.875$）。

## 高阶与诚实提醒

二阶累积量（带 3 个耦合）给 $y_t\approx1.05$，惊人地接近精确 $1$——但 Kardar 明言这"多半是巧合"。第三阶显示**累积量级数是渐近的、不收敛**，阶数高未必更准。所以这类实空间 RG 给的是定性正确、定量平庸的指数；精确值仍归 Onsager 与 CFT（[[2D伊辛-精确解与CFT基准]]）。

**文献**：Th. Niemeijer & J. M. J. van Leeuwen, *Phys. Rev. Lett.* **31**, 1411 (1973)；*Physica* **71**, 17 (1974)；综述见 Domb & Green, *Phase Transitions and Critical Phenomena* 卷 6 (1976)；逐行推导见 Kardar §V（式 V.40–V.50）。
