# 重建 "CrBr3-类" 磁化状态方程数据集（合成，校准到 Ho-Litster 1969 的指数）
# 用标准 Widom-Griffiths 标度状态方程: h = M^delta * (1 + t*M^{-1/beta})^gamma,  gamma=beta(delta-1)
#   t=0:      h=M^delta              -> 临界等温线 M~h^{1/delta}
#   h=0,t<0:  M=(-t)^beta            -> 自发磁化(beta)
#   t>0,M->0: h≈t^gamma*M, chi~t^{-gamma}  -> 磁化率(gamma)
# 指数取 Ho & Litster 1969 (CrBr3): beta=0.368, delta=4.28, Tc=32.84 K
# 注意: 这是合成重建, 非原文测量点; 指数是真实发表值, 关系(塌缩/Widom)与真系统一致。
import numpy as np
import csv

np.random.seed(7)

Tc = 32.84
beta = 0.368
delta = 4.28
gamma = beta * (delta - 1.0)          # Widom -> 1.207
print(f"beta={beta}, delta={delta}, gamma=beta(delta-1)={gamma:.3f}, Tc={Tc} K")

def h_of(M, t):
    # 仅在 1 + t*M^{-1/beta} >= 0 处物理(t<0 时要求 M>=(-t)^beta)；钳到非负避免浮点把 h=0 点判成负
    base = np.maximum(1.0 + t * M**(-1.0/beta), 0.0)
    return M**delta * base**gamma

# 一组"测量温度"(Tc 两侧)
temps = np.array([31.2, 31.8, 32.2, 32.5, 32.7, 32.84, 33.0, 33.3, 33.8, 34.4])
Hmax = 1.5
rows = []
for T in temps:
    t = (T - Tc) / Tc
    if t < 0:
        Msp = (-t)**beta
        M = np.linspace(Msp, Msp + 1.2, 40)        # 从自发磁化(h=0)向上扫
    else:
        M = np.logspace(-2.2, 0.1, 40)             # t>=0 从小 M 扫
    h = h_of(M, t)
    for Mi, hi in zip(M, h):
        if np.isfinite(hi) and 0 <= hi <= Hmax:
            hi_noisy = hi * (1 + 0.005*np.random.randn())   # 0.5% 测量噪声
            rows.append((round(T,3), round(t,5), max(hi_noisy,0.0), Mi))

# 存 CSV 供自己分析
with open("crbr3_scaling_data.csv", "w", newline="") as f:
    w = csv.writer(f); w.writerow(["T_K", "t", "H", "M"])
    for r in rows: w.writerow([r[0], r[1], f"{r[2]:.6g}", f"{r[3]:.6g}"])
print(f"saved crbr3_scaling_data.csv  ({len(rows)} points, {len(temps)} isotherms)")

# --- 几个关系的快速自检(你也可从 CSV 自己重做)---
data = np.array([(r[1], r[2], r[3]) for r in rows])   # t,H,M
t_arr, H_arr, M_arr = data[:,0], data[:,1], data[:,2]

# 1) 自发磁化: t<0 且 H 最小的点, M_sp ~ (-t)^beta
print("\n[自发磁化] 对每个 t<0 取最小 H 处的 M, 拟合 log M vs log(-t):")
tneg = sorted(set(t_arr[t_arr < 0]))
ts, Ms = [], []
for tv in tneg:
    sel = (t_arr == tv)
    i = np.argmin(H_arr[sel]); ts.append(-tv); Ms.append(M_arr[sel][i])
slope_b = np.polyfit(np.log(ts), np.log(Ms), 1)[0]
print(f"   斜率(=beta) = {slope_b:.3f}   (真值 {beta})")

# 2) 临界等温线: t≈0, M ~ H^{1/delta}
print("[临界等温线] T=Tc(t≈0): 拟合 log M vs log H:")
sel0 = np.abs(t_arr) < 1e-4
slope_d = np.polyfit(np.log(H_arr[sel0]), np.log(M_arr[sel0]), 1)[0]
print(f"   斜率(=1/delta) = {slope_d:.3f} -> delta = {1/slope_d:.2f}   (真值 {delta})")

# 3) 磁化率: t>0, chi=M/H(小 H 线性), chi ~ t^{-gamma}
print("[磁化率] t>0 取最小 H 处 chi=M/H, 拟合 log chi vs log t:")
tpos = sorted(set(t_arr[t_arr > 0]))
tg, chis = [], []
for tv in tpos:
    sel = (t_arr == tv); i = np.argmin(H_arr[sel])
    tg.append(tv); chis.append(M_arr[sel][i]/H_arr[sel][i])
slope_g = np.polyfit(np.log(tg), np.log(chis), 1)[0]
print(f"   斜率(=-gamma) = {slope_g:.3f} -> gamma = {-slope_g:.3f}   (Widom {gamma:.3f})")
print(f"[Widom 检验] beta*(delta-1) = {beta*(delta-1):.3f}  vs  gamma_fit = {-slope_g:.3f}")
