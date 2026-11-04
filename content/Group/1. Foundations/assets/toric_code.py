"""Draw the local star and plaquette operators used in GT-ch02, section 2.7."""
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle


def main():
    fig, ax = plt.subplots(figsize=(7.6, 6.0), layout="constrained")
    fig.patch.set_facecolor("white")
    ax.set_aspect("equal")
    ax.add_patch(Rectangle((1, 1), 1, 1, color="#dbeafe", alpha=0.8, zorder=0))
    for i in range(4):
        ax.plot([0, 3], [i, i], color="#9ca3af", lw=1.1, zorder=1)
        ax.plot([i, i], [0, 3], color="#9ca3af", lw=1.1, zorder=1)
    edge_points = [(i + 0.5, j) for i in range(3) for j in range(4)]
    edge_points += [(i, j + 0.5) for i in range(4) for j in range(3)]
    ax.scatter(*zip(*edge_points), facecolor="white", edgecolor="#6b7280", s=43, zorder=4)
    red, blue = "#b91c1c", "#1d4ed8"
    ax.plot([0, 2], [1, 1], color=red, lw=5, alpha=0.80, zorder=2)
    ax.plot([1, 1], [0, 2], color=red, lw=5, alpha=0.80, zorder=2)
    ax.plot([1, 2, 2, 1, 1], [1, 1, 2, 2, 1], color=blue, lw=2.3, ls="--", zorder=3)
    star = [(0.5, 1), (1.5, 1), (1, 0.5), (1, 1.5)]
    face = [(1.5, 1), (2, 1.5), (1.5, 2), (1, 1.5)]
    for x, y in star:
        ax.text(x - 0.15, y - 0.21, "$X$", color=red, fontsize=17, zorder=5)
    for x, y in face:
        ax.text(x + 0.09, y + 0.10, "$Z$", color=blue, fontsize=17, zorder=5)
    ax.scatter([1], [1], color=red, s=35, zorder=6)
    ax.text(0.81, 0.77, "$v$", fontsize=17, color=red)
    ax.text(1.47, 1.49, "$p$", fontsize=22, color=blue)
    ax.text(0.0, 3.35, "Star and plaquette operators", fontsize=20, weight="bold")
    ax.text(0.0, -0.44, r"$A_v=\prod_{e\ni v}X_e$", fontsize=18, color=red)
    ax.text(1.65, -0.44, r"$B_p=\prod_{e\in\partial p}Z_e$", fontsize=18, color=blue)
    ax.text(0.0, -0.83, "Two shared edges: two minus signs cancel.", fontsize=12, color="#374151")
    ax.text(0.0, -1.10, "Each open circle is one edge qubit. Periodic boundary omitted.", fontsize=10, color="#6b7280")
    ax.set_xlim(-0.22, 3.48)
    ax.set_ylim(-1.25, 3.70)
    ax.axis("off")
    fig.savefig(Path(__file__).with_name("toric-code.png"), dpi=200, facecolor="white")
    plt.close(fig)


if __name__ == "__main__":
    main()
