# 第一站配图：自发磁化 M(T) + 临界等温线 delta=3 vs 4.8
import numpy as np
import matplotlib.pyplot as plt

plt.rcParams.update({"font.size": 12, "axes.linewidth": 1.0})

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 4.2))

# --- 左：自发磁化随温度消失 (H=0)，M ~ (-t)^beta, t=(T-Tc)/Tc ---
Tc = 1.0
T = np.linspace(0.0, 1.5, 400)
beta_mf = 0.5      # 平均场
beta_3d = 0.326    # 三维
M_mf = np.where(T < Tc, (1 - T / Tc) ** beta_mf, 0.0)
M_3d = np.where(T < Tc, (1 - T / Tc) ** beta_3d, 0.0)
ax1.plot(T, M_mf, label=r"mean field  $\beta=1/2$", lw=2)
ax1.plot(T, M_3d, label=r"3D  $\beta\approx0.326$", lw=2, ls="--")
ax1.axvline(Tc, color="gray", ls=":", lw=1)
ax1.text(Tc + 0.02, 0.9, r"$T_c$", color="gray")
ax1.set_xlabel(r"$T/T_c$")
ax1.set_ylabel(r"spontaneous magnetization $M$  ($H=0$)")
ax1.set_title(r"(a) order parameter vanishes continuously at $T_c$")
ax1.legend()

# --- 右：临界等温线 (T=Tc)，M ~ H^{1/delta}，对数坐标看斜率 ---
H = np.logspace(-3, 0, 200)
M_d3 = H ** (1 / 3)
M_d48 = H ** (1 / 4.8)
ax2.loglog(H, M_d3, lw=2, label=r"mean field  $\delta=3$  (slope $1/3$)")
ax2.loglog(H, M_d48, lw=2, ls="--", label=r"3D  $\delta\approx4.8$  (slope $1/4.8$)")
ax2.set_xlabel(r"external field $H$")
ax2.set_ylabel(r"magnetization $M$  ($T=T_c$)")
ax2.set_title(r"(b) critical isotherm:  $M\sim H^{1/\delta}$")
ax2.legend()

fig.tight_layout()
fig.savefig("fig01_critical.png", dpi=130)
print("saved fig01_critical.png")
