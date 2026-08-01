# 威尔逊-费希尔不动点的数值求解（一圈，n 分量 phi^4，伊辛 n=1）
# 1) 数值积分耦合流 du/dl = eps*u - (n+8)*u^2，确认收敛到 u* = eps/(n+8)
# 2) 由 u* 算热本征值 y_t = 2 - (n+2)*u*，得 nu = 1/y_t
# 3) eta~ = (n+2)/(2(n+8)^2) eps^2
# 4) 组装 delta = (d+2-eta~)/(d-2+eta~)，d = 4-eps
import numpy as np
import matplotlib.pyplot as plt

n = 1  # Ising

def u_flow(u, eps):
    return eps * u - (n + 8) * u**2          # one-loop coupling flow

def integrate_u(eps, lmax=60.0, steps=6000, u0=1e-4):
    # 自写 RK4 积分 du/dl = eps*u - (n+8)u^2
    l = np.linspace(0, lmax, steps)
    h = l[1] - l[0]
    u = np.empty(steps); u[0] = u0
    for i in range(steps - 1):
        k1 = u_flow(u[i], eps)
        k2 = u_flow(u[i] + 0.5*h*k1, eps)
        k3 = u_flow(u[i] + 0.5*h*k2, eps)
        k4 = u_flow(u[i] + h*k3, eps)
        u[i+1] = u[i] + (h/6.0)*(k1 + 2*k2 + 2*k3 + k4)
    return l, u

def exponents(eps):
    # 数值求不动点：从小 u0 积分到大 l，取末值
    l, u = integrate_u(eps)
    ustar_num = u[-1]
    ustar_ana = eps / (n + 8)
    y_t = 2 - (n + 2) * ustar_num            # 热方向本征值
    nu = 1.0 / y_t if y_t != 0 else np.inf
    eta = (n + 2) / (2 * (n + 8)**2) * eps**2
    d = 4 - eps
    delta = (d + 2 - eta) / (d - 2 + eta)
    return ustar_num, ustar_ana, y_t, nu, eta, delta, u, l

print("=== Wilson-Fisher one-loop, n=1 (Ising) ===")
print(f"{'d':>5} {'eps':>5} {'u*num':>8} {'u*ana':>8} {'y_t':>6} {'nu':>6} {'eta~':>7} {'delta':>7}")
for eps in [0.0, 0.25, 0.5, 0.75, 1.0]:
    us, ua, yt, nu, eta, delta, _, _ = exponents(eps)
    print(f"{4-eps:5.2f} {eps:5.2f} {us:8.4f} {ua:8.4f} {yt:6.3f} {nu:6.3f} {eta:7.4f} {delta:7.3f}")

print("\n对照(高阶+重求和/数值, 3D 伊辛真值): nu=0.630, eta~=0.036, delta=4.79")
print("平均场(高斯不动点, d>=4):            nu=0.5,   eta~=0,     delta=3")

# --- 图 ---
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 4.3))

for eps in [0.25, 0.5, 1.0]:
    _, ua, _, _, _, _, u, l = exponents(eps)
    ax1.plot(l, u, lw=2, label=fr"$\varepsilon={eps}$,  $u^*={ua:.3f}$")
    ax1.axhline(ua, color="gray", ls=":", lw=0.8)
ax1.set_xlabel(r"RG time $\ell=\ln b$"); ax1.set_ylabel(r"coupling $u$")
ax1.set_title(r"(a) coupling flows to WF fixed point $u^*=\varepsilon/(n+8)$")
ax1.set_xlim(0, 25); ax1.legend(fontsize=9)

ds = np.linspace(3.0, 4.0, 200)
epss = 4 - ds
etas = (n + 2) / (2 * (n + 8)**2) * epss**2
deltas = (ds + 2 - etas) / (ds - 2 + etas)
ax2.plot(ds, deltas, lw=2, color="C0", label=r"one-loop $\delta(d)$")
ax2.axhline(3, color="C1", ls="--", lw=1.5, label=r"mean field $\delta=3$ ($d\geq4$)")
ax2.plot(3, 4.79, "*", color="C3", ms=15, label=r"3D true $\delta\approx4.79$")
ax2.plot(3, deltas[0], "o", color="C0", ms=7)
ax2.annotate(fr"$d=3$: $\delta\approx{deltas[0]:.2f}$", (3, deltas[0]),
             xytext=(3.15, deltas[0]-0.15), fontsize=9)
ax2.set_xlabel("dimension $d$"); ax2.set_ylabel(r"$\delta$")
ax2.set_title(r"(b) $\delta=\frac{d+2-\tilde\eta}{d-2+\tilde\eta}$: 3 at $d{=}4$ $\to$ ~4.8 at $d{=}3$")
ax2.legend(fontsize=9, loc="upper right"); ax2.set_xlim(2.95, 4.05)

fig.tight_layout()
fig.savefig("rg_wilson_fisher.png", dpi=130)
print("\nsaved rg_wilson_fisher.png")
