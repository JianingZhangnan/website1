"""Reproduce the two figures used in 电磁场的横纵分解与偏振基.md.

Run with Python, NumPy and Matplotlib. Images are written beside this script.
"""

from pathlib import Path
import numpy as np
import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib import font_manager

OUT = Path(__file__).resolve().parent
for candidate in (
    Path("C:/Windows/Fonts/NotoSansSC-VF.ttf"),
    Path("C:/Windows/Fonts/msyh.ttc"),
    Path("/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc"),
):
    if candidate.exists():
        font_manager.fontManager.addfont(str(candidate))
        plt.rcParams["font.family"] = font_manager.FontProperties(fname=str(candidate)).get_name()
        break

plt.rcParams.update({
    "font.size": 18,
    "mathtext.fontset": "stix",
    "axes.unicode_minus": False,
    "text.color": "#172d3b",
    "figure.facecolor": "white",
    "savefig.facecolor": "white",
})
BLUE = "#165f99"
ORANGE = "#a63d1a"
INK = "#263b48"
GREEN = "#166449"


def arrow2(ax, end, color, width=2.7):
    ax.annotate("", end, (0, 0), arrowprops={"arrowstyle": "-|>", "lw": width,
                                               "color": color, "mutation_scale": 20})


def old_coordinates():
    fig, ax = plt.subplots(figsize=(8, 7.2))
    fig.subplots_adjust(left=0.035, right=0.98, bottom=0.035, top=0.91)
    ax.set_aspect("equal")
    ax.set_xlim(-1.75, 1.9)
    ax.set_ylim(-1.65, 1.9)
    ax.axis("off")
    fig.suptitle("从代数约束得到的新基", fontsize=23, y=0.97, weight="bold")
    ax.plot([-1.4, 1.4], [1.4, -1.4], color=BLUE, lw=2.2, ls=(0, (5, 4)), zorder=1)
    ax.plot([-1.35, 0], [0, 0], color=INK, lw=1, alpha=0.65)
    ax.plot([0, 0], [-1.35, 0], color=INK, lw=1, alpha=0.65)
    arrow2(ax, (1.68, 0), INK, 2)
    arrow2(ax, (0, 1.68), INK, 2)
    ax.text(1.76, -0.08, r"$\mathbf{e}_x$", fontsize=24)
    ax.text(-0.21, 1.76, r"$\mathbf{e}_y$", fontsize=24)
    unit = 1 / np.sqrt(2)
    arrow2(ax, (1.34, 1.34), ORANGE, 2.8)
    arrow2(ax, (unit, unit), ORANGE, 3.5)
    arrow2(ax, (unit, -unit), BLUE, 3.5)
    ax.text(1.40, 1.30, r"$\mathbf{k}_0$", fontsize=25, color=ORANGE)
    ax.text(0.25, 0.86, r"$\epsilon_3$", fontsize=25, color=ORANGE)
    ax.text(0.75, -0.91, r"$\epsilon_1$", fontsize=25, color=BLUE)
    ax.text(-1.63, 1.20, r"$a_x+a_y=0$", fontsize=23, color=BLUE,
            bbox={"facecolor": "white", "edgecolor": "none", "pad": 3})
    # The right angle is between the two derived directions.
    d1 = np.array([unit, -unit])
    d3 = np.array([unit, unit])
    corner = np.array([0.16*d1, 0.16*(d1+d3), 0.16*d3])
    ax.plot(corner[:, 0], corner[:, 1], color=INK, lw=1.5)
    ax.text(-1.57, -1.37, r"$\odot\quad\epsilon_2=\mathbf{e}_z$", fontsize=24, color=GREEN)
    ax.text(-1.57, -1.59, "指向纸外", fontsize=18, color=GREEN)
    fig.savefig(OUT / "coulomb_basis_xy.png", dpi=190)
    plt.close(fig)


def new_coordinates():
    fig = plt.figure(figsize=(8.6, 7.6))
    ax = fig.add_subplot(111, projection="3d")
    fig.subplots_adjust(left=0, right=1, bottom=0.03, top=0.88)
    ax.set_axis_off()
    ax.set_box_aspect((1.25, 1.25, 1.5))
    ax.view_init(elev=22, azim=-62)
    ax.set(xlim=(-1.2, 1.65), ylim=(-1.2, 1.65), zlim=(-0.35, 2.05))
    fig.suptitle("在新基中：允许的振幅位于一个平面内", fontsize=22, y=0.96, weight="bold")
    x, y = np.meshgrid(np.linspace(-1.1, 1.3, 2), np.linspace(-1.1, 1.3, 2))
    ax.plot_surface(x, y, np.zeros_like(x), color="#77b6dc", alpha=0.23,
                    edgecolor=BLUE, linewidth=1.1, shade=False)
    ax.plot([-1.1, 0], [0, 0], [0, 0], color=INK, lw=1)
    ax.plot([0, 0], [-1.1, 0], [0, 0], color=INK, lw=1)
    ax.quiver(0, 0, 0, 1.55, 0, 0, color=BLUE, linewidth=2.8, arrow_length_ratio=0.10)
    ax.quiver(0, 0, 0, 0, 1.55, 0, color=GREEN, linewidth=2.8, arrow_length_ratio=0.10)
    ax.quiver(0, 0, 0, 0, 0, 1.85, color=ORANGE, linewidth=2.8, arrow_length_ratio=0.09)
    ax.text(1.6, -0.05, -0.03, r"$\epsilon_1$", fontsize=25, color=BLUE)
    ax.text(-0.05, 1.58, 0.02, r"$\epsilon_2$", fontsize=25, color=GREEN)
    ax.text(0.06, 0.06, 1.91, r"$\epsilon_3\ \parallel\ \mathbf{k}_0$", fontsize=23, color=ORANGE)
    ax.quiver(0, 0, 0, 0.84, 0.64, 0, color=INK, linewidth=3, arrow_length_ratio=0.13)
    ax.plot([0.84, 0.84], [0, 0.64], [0, 0], color=INK, ls="--", lw=1.5)
    ax.plot([0, 0.84], [0.64, 0.64], [0, 0], color=INK, ls="--", lw=1.5)
    ax.text(0.85, 0.70, 0.08, r"$\mathbf{a}_0=q_1\epsilon_1+q_2\epsilon_2$", fontsize=21, color=INK)
    ax.text2D(0.10, 0.18, "横向平面", transform=ax.transAxes, fontsize=22, color=BLUE)
    ax.text2D(0.10, 0.12, r"$q_3=0$", transform=ax.transAxes, fontsize=25, color=BLUE)
    fig.text(0.5, 0.035, "沿波矢的第三个分量被库伦规范限制为零", ha="center", fontsize=19, color=ORANGE)
    fig.savefig(OUT / "coulomb_transverse_plane.png", dpi=190)
    plt.close(fig)


if __name__ == "__main__":
    old_coordinates()
    new_coordinates()
    print("Created coulomb_basis_xy.png and coulomb_transverse_plane.png")
