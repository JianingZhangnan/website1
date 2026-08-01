# 第四站配图：数据塌缩。平均场状态方程 h = 2 t eta + 4 eta^3 (beta=1/2, delta=3)
import numpy as np
import matplotlib.pyplot as plt

plt.rcParams.update({"font.size": 12, "axes.linewidth": 1.0})
beta, delta = 0.5, 3.0
ts = [0.3, 0.1, 0.03, -0.03, -0.1, -0.3]
eta = np.linspace(-1.0, 1.0, 600)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 4.3))

for t in ts:
    h = 2 * t * eta + 4 * eta**3            # mean-field equation of state
    c = "C0" if t > 0 else "C3"
    ax1.plot(h, eta, color=c, lw=1.6, alpha=0.9,
             label=f"t={t:+.2f}")
ax1.set_xlim(-2, 2); ax1.set_ylim(-1, 1)
ax1.set_xlabel(r"field $h$"); ax1.set_ylabel(r"order parameter $\eta$")
ax1.set_title(r"(a) raw curves: each $t$ different")
ax1.legend(fontsize=8, ncol=2, loc="lower right")

for t in ts:
    h = 2 * t * eta + 4 * eta**3
    X = h / abs(t)**(beta * delta)          # h / |t|^{beta*delta}
    Y = eta / abs(t)**beta                  # eta / |t|^{beta}
    c = "C0" if t > 0 else "C3"
    ax2.plot(X, Y, color=c, lw=2.2, alpha=0.6)
ax2.set_xlim(-6, 6); ax2.set_ylim(-3, 3)
ax2.set_xlabel(r"$h/|t|^{\beta\delta}$"); ax2.set_ylabel(r"$\eta/|t|^{\beta}$")
ax2.set_title(r"(b) scaled: collapse onto two branches")
ax2.plot([], [], "C0", lw=2, label=r"$t>0$  ($F_+$)")
ax2.plot([], [], "C3", lw=2, label=r"$t<0$  ($F_-$)")
ax2.legend(fontsize=9, loc="lower right")

fig.tight_layout()
fig.savefig("fig04_collapse.png", dpi=130)
print("saved fig04_collapse.png")
