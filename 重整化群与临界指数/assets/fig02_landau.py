# 第二站配图：朗道自由能 f(M)=a M^2 + b M^4 在 a 变号前后的形状
import numpy as np
import matplotlib.pyplot as plt

plt.rcParams.update({"font.size": 12, "axes.linewidth": 1.0})

M = np.linspace(-1.4, 1.4, 500)
b = 1.0

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 4.2))

# 左：H=0，三个温度（a>0, a=0, a<0）
for a, lab, ls in [(0.8, r"$a>0\ (T>T_c)$", "-"),
                   (0.0, r"$a=0\ (T=T_c)$", "--"),
                   (-0.8, r"$a<0\ (T<T_c)$", "-.")]:
    f = a * M**2 + b * M**4
    ax1.plot(M, f, ls, lw=2, label=lab)
ax1.axhline(0, color="gray", lw=0.6)
ax1.set_xlabel(r"order parameter $M$")
ax1.set_ylabel(r"free energy $f(M)$  ($H=0$)")
ax1.set_title(r"(a) single well $\to$ double well as $a$ flips sign")
ax1.legend()

# 右：T<Tc 加小外场，-H M 使双阱倾斜，选出一个极小
a = -0.8
for H, lab in [(0.0, r"$H=0$"), (0.4, r"$H>0$ tilts the well")]:
    f = a * M**2 + b * M**4 - H * M
    ax2.plot(M, f, lw=2, label=lab)
ax2.axhline(0, color="gray", lw=0.6)
ax2.set_xlabel(r"order parameter $M$")
ax2.set_ylabel(r"free energy $f(M)$  ($T<T_c$)")
ax2.set_title(r"(b) field $-HM$ selects one minimum")
ax2.legend()

fig.tight_layout()
fig.savefig("fig02_landau.png", dpi=130)
print("saved fig02_landau.png")
