# 数值计算：RG 流与临界指数

两段可运行代码（`assets/`），数值兑现第五站的解析结论。

## 一维伊辛抽取 RG —— `assets/rg_ising1d.py`

迭代 $K'=\tfrac12\ln\cosh 2K$（[[一维伊辛抽取RG]]）。数值确认任意有限 $K$ 都 $K'<K$、流向 $0$：

```
K=2.5 迭代: 2.5 → 2.153 → 1.807 → 1.461 → 1.116 → 0.775 → 0.450 → 0.180 → 0.032 → 0
```

唯一稳定不动点 $K^*=0$，一维无有限温相变。图 `assets/rg_ising1d.png`（左映射、右各初值轨迹齐流向 0）。

## 威尔逊–费希尔与 δ —— `assets/rg_wilson_fisher.py`

RK4 积分一圈耦合流 $\dfrac{du}{d\ell}=\varepsilon u-(n+8)u^2$（$n=1$），确认收敛到 $u^*=\varepsilon/(n+8)$；由 $y_t=2-(n+2)u^*$、$\tilde\eta=\dfrac{n+2}{2(n+8)^2}\varepsilon^2$ 算指数，组装 $\delta=\dfrac{d+2-\tilde\eta}{d-2+\tilde\eta}$（$d=4-\varepsilon$）：

```
   d   eps    u*      y_t     nu    eta~   delta
 4.00  0.00  0.000   2.000  0.500  0.0000  3.000   平均场
 3.00  1.00  0.111   1.667  0.600  0.0185  4.891   三维(一圈)
 真值(3D 伊辛):              0.630  0.036   4.79
```

$d=4$ 回到平均场 $\delta=3$；$d=3$ 时一圈给出 $\delta\approx4.89$，与真值 $4.79$ 同量级（一圈在 $\varepsilon=1$ 只定性准，高阶 + 重求和才精确）。图 `assets/rg_wilson_fisher.png`（左耦合流向 $u^*$，右 $\delta(d)$ 从 $3$ 升到 $\approx4.9$，真值星标）。

完整推导见 [[05-重整化群]]。
