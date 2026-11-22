import matplotlib
matplotlib.use("Agg")
import numpy as np
import matplotlib.pyplot as plt

# 常数 (cgs)
kB = 1.380649e-16
me = 9.1093837e-28
c = 2.99792458e10
h = 6.62607015e-27
mu_atomic = 1.660539e-24
Rgas = kB / mu_atomic
a_rad = 7.5657e-15

K_NR = (h**2 / (20 * me)) * (3 / np.pi)**(2/3) * mu_atomic**(-5/3)
K_UR = (h * c / 8) * (3 / np.pi)**(1/3) * mu_atomic**(-4/3)

# 取典型演化成分 mu = 0.62, mu_e = 1.18 (或均取 2.0/1.33 用于演示)
mu, mu_e = 0.62, 1.18
rho_rel = 8 * np.pi / 3 * (me * c / h)**3 * mu_e * mu_atomic  # ~ 1.15e6 g/cm3
# 严格用 P_NR = P_UR 的交叉密度:
rho_cross = (K_UR / K_NR)**3 * mu_e

rho = np.logspace(-4, 11, 500)
T_rad_id = (3 * Rgas / (a_rad * mu))**(1/3) * rho**(1/3)
T_nr_deg = (K_NR * mu / (Rgas * mu_e**(5/3))) * rho**(2/3)
T_ur_deg = (K_UR * mu / (Rgas * mu_e**(4/3))) * rho**(1/3)
T_pair = np.full_like(rho, me * c**2 / kB)

plt.figure(figsize=(10, 7.4))
plt.loglog(rho, T_rad_id, "r--", lw=2, label=r"$P_{\mathrm{rad}} = P_{\mathrm{id}}$ (slope 1/3)")
plt.loglog(rho[rho <= rho_cross], T_nr_deg[rho <= rho_cross], "b-", lw=2,
           label=r"$P_{\mathrm{id}} = P_{e,\mathrm{NR}}$ (slope 2/3)")
plt.loglog(rho[rho >= rho_cross], T_ur_deg[rho >= rho_cross], "g-.", lw=2,
           label=r"$P_{\mathrm{id}} = P_{e,\mathrm{UR}}$ (slope 1/3)")
plt.axvline(rho_cross, color="k", ls="--", lw=1.5,
            label=rf"NR/UR cross $\rho \approx {rho_cross:.2e}\ \mathrm{{g\,cm}}^{{-3}}$")
plt.loglog(rho, T_pair, "m:", lw=1.8, label=r"$k_B T = m_e c^2 \approx 5.93\times 10^9$ K (thermal relativistic scale)")

# 标注典型天体中心位置
stars = {"Sun": (150, 1.57e7), "Massive Star (25 M_sun)": (3.0, 3.8e7),
         "White Dwarf": (2e6, 1e6), "Pre-SN Core": (1e9, 6e9)}
for name, (r0, t0) in stars.items():
    plt.scatter([r0], [t0], s=60, zorder=5)
    plt.text(r0 * 1.3, t0 * 1.15, name, fontsize=12)

plt.xlim(1e-4, 1e11)
plt.ylim(1e3, 1e11)
plt.xlabel(r"Density $\rho$ ($\mathrm{g\,cm^{-3}}$)")
plt.ylabel(r"Temperature $T$ (K)")
plt.title(r"Equation of State Regimes in the $T$-$\rho$ Plane ($\mu=0.62, \mu_e=1.18$)")
plt.legend(loc="lower right", fontsize=11)
plt.grid(True, which="both", alpha=0.25)
plt.tight_layout()
plt.savefig(__import__("pathlib").Path(__file__).resolve().parent / "figures" / "density-temperature.png", dpi=170)
