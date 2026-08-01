# 一维伊辛抽取 RG 的数值验证：映射 K' = 1/2 ln cosh(2K)
# 画 (a) 映射与不动点；(b) 多个初值的迭代流，全部流向 K=0。
import numpy as np
import matplotlib.pyplot as plt

def Rmap(K):
    return 0.5 * np.log(np.cosh(2.0 * K))

# --- 数值确认：任意有限 K 都有 K' < K（流向 0）---
Ks = np.array([0.3, 0.8, 1.5, 2.5, 4.0])
print("K       K'=R(K)   K'<K ?")
for K in Ks:
    Kp = Rmap(K)
    print(f"{K:5.2f}   {Kp:7.4f}   {Kp < K}")

# --- 迭代流：从几个初值出发，看 K_n 的轨迹 ---
def trajectory(K0, n=12):
    seq = [K0]
    for _ in range(n):
        seq.append(Rmap(seq[-1]))
    return np.array(seq)

print("\n从 K0=2.5 迭代：", np.round(trajectory(2.5, 8), 4))

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 4.3))

K = np.linspace(0, 3, 400)
ax1.plot(K, Rmap(K), lw=2, label=r"$K'=\frac{1}{2}\ln\cosh 2K$")
ax1.plot(K, K, "k--", lw=1, label=r"$K'=K$ (diagonal)")
ax1.plot(0, 0, "o", color="C3", ms=8, label="stable FP  $K^*=0$")
ax1.set_xlabel("$K$"); ax1.set_ylabel("$K'$")
ax1.set_title("(a) RG map: only $K'<K$, flow to 0")
ax1.legend(fontsize=9); ax1.set_xlim(0, 3); ax1.set_ylim(0, 3)

for K0 in [0.3, 0.8, 1.5, 2.5, 4.0]:
    tr = trajectory(K0, 10)
    ax2.plot(range(len(tr)), tr, "-o", ms=4, label=f"$K_0={K0}$")
ax2.axhline(0, color="C3", lw=1.2, ls=":")
ax2.set_xlabel("RG step $n$"); ax2.set_ylabel("$K_n$")
ax2.set_title("(b) all finite $K$ flow to disordered $K^*=0$")
ax2.legend(fontsize=8)

fig.tight_layout()
fig.savefig("rg_ising1d.png", dpi=130)
print("\nsaved rg_ising1d.png")
