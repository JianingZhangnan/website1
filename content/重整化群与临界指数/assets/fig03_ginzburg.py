# 第三站配图：金兹堡判据 R(t) ~ |t|^{(d-4)/2}，看 d=3,4,5 在 t->0 的走向
import numpy as np
import matplotlib.pyplot as plt

plt.rcParams.update({"font.size": 12, "axes.linewidth": 1.0})

t = np.logspace(-5, -0.5, 300)  # |t| 从 1e-5 到 ~0.3，越往左越靠近 Tc

fig, ax = plt.subplots(figsize=(6.6, 4.6))
for d, c in [(3, "C0"), (4, "C1"), (5, "C2")]:
    R = t ** ((d - 4) / 2)
    ax.loglog(t, R, lw=2, color=c, label=fr"$d={d}$   exponent $(d-4)/2={ (d-4)/2:+.1f}$")

ax.axhline(1.0, color="gray", ls=":", lw=1)
ax.text(2e-5, 1.3, "fluctuation = order parameter", color="gray", fontsize=10)
ax.set_xlabel(r"$|t|=|T-T_c|/T_c$   (smaller = closer to $T_c$)")
ax.set_ylabel(r"$R=\langle(\delta\varphi)^2\rangle_{\xi^d}\,/\,\bar\varphi^{\,2}$")
ax.set_title(r"Ginzburg criterion:  $R\sim|t|^{(d-4)/2}$")
ax.legend(loc="upper right")
ax.text(3e-5, 25, r"$d=3$: $R\to\infty$  (fails)", color="C0", fontsize=10)
ax.text(3e-5, 3e-3, r"$d=5$: $R\to0$  (OK)", color="C2", fontsize=10)

fig.tight_layout()
fig.savefig("fig03_ginzburg.png", dpi=130)
print("saved fig03_ginzburg.png")
