# 加载重建数据集 crbr3_scaling_data.csv，画 (a) 原始 M-H 等温线  (b) 标度塌缩
# 也可当作你自己分析的模板：改 beta/delta 看塌缩好坏，就能"拟合"出指数。
import numpy as np
import csv
import matplotlib.pyplot as plt

beta, delta, Tc = 0.368, 4.28, 32.84   # Ho-Litster (1969) CrBr3

T, t, H, M = [], [], [], []
with open("crbr3_scaling_data.csv") as f:
    r = csv.DictReader(f)
    for row in r:
        T.append(float(row["T_K"])); t.append(float(row["t"]))
        H.append(float(row["H"]));   M.append(float(row["M"]))
T, t, H, M = map(np.array, (T, t, H, M))

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 4.3))

for Tv in sorted(set(T)):
    s = (T == Tv)
    o = np.argsort(H[s])
    c = "C3" if Tv < Tc else ("k" if abs(Tv-Tc) < 1e-6 else "C0")
    ax1.plot(H[s][o], M[s][o], "-o", ms=3, color=c, alpha=0.8,
             label=f"T={Tv} K" + (" (=Tc)" if abs(Tv-Tc)<1e-6 else ""))
ax1.set_xlabel("field  H"); ax1.set_ylabel("magnetization  M")
ax1.set_title("(a) raw isotherms (red: T<Tc, black: Tc, blue: T>Tc)")
ax1.legend(fontsize=7, ncol=2)

for Tv in sorted(set(T)):
    s = (T == Tv) & (np.abs(t) > 1e-9) & (H > 1e-4)   # 塌缩需 t!=0；滤掉 H≈0 的对数伪点
    if s.sum() == 0: continue
    tv = t[s][0]
    X = H[s] / np.abs(tv)**(beta*delta)
    Y = M[s] / np.abs(tv)**beta
    c = "C3" if tv < 0 else "C0"
    o = np.argsort(X)
    ax2.plot(X[o], Y[o], "-o", ms=3, color=c, alpha=0.5)
ax2.plot([], [], "C0", label=r"$t>0$ branch $F_+$")
ax2.plot([], [], "C3", label=r"$t<0$ branch $F_-$")
ax2.set_xlabel(r"$H/|t|^{\beta\delta}$"); ax2.set_ylabel(r"$M/|t|^{\beta}$")
ax2.set_xscale("log"); ax2.set_yscale("log")
ax2.set_xlim(1e-3, 5e3)
ax2.set_title(r"(b) collapse with $\beta=0.368,\ \delta=4.28$")
ax2.legend(fontsize=9)

fig.tight_layout()
fig.savefig("crbr3_scaling.png", dpi=130)
print("saved crbr3_scaling.png")
