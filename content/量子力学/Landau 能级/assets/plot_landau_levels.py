"""Reproduce the figures in Basic Model of Landau Levels.md.

Requirements: Python 3, NumPy >= 2.0, Matplotlib >= 3.8.
Run: python plot_landau_levels.py [--output-dir PATH]

All curves are evaluated from the analytic single-particle model, not fitted
to data. Figure 2(b) is a schematic counting construction, not a density map.
The default output directory is this script's directory. Matplotlib's cache
is kept outside the vault.
"""

from __future__ import annotations

import argparse
import math
import os
from pathlib import Path
import tempfile

os.environ.setdefault(
    "MPLCONFIGDIR", str(Path(tempfile.gettempdir()) / "codex-landau-mpl-cache")
)

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle
import numpy as np
from numpy.polynomial.hermite import hermval


COLORS = ["#20639B", "#C76B23", "#347B68", "#825AA5"]
INK = "#273441"
GRAY = "#87939D"


def rho(n: int, xi: np.ndarray) -> np.ndarray:
    """Dimensionless density ell_B |phi_n|^2, with xi=(x-x0)/ell_B."""
    coefficients = np.zeros(n + 1)
    coefficients[n] = 1.0
    hn = hermval(xi, coefficients)  # Physicists' Hermite polynomials.
    return hn**2 * np.exp(-(xi**2)) / (
        2**n * math.factorial(n) * np.sqrt(np.pi)
    )


def configure_style() -> None:
    plt.rcParams.update(
        {
            "font.family": "DejaVu Sans",
            "font.size": 11,
            "mathtext.fontset": "stix",
            "axes.labelsize": 13,
            "axes.titlesize": 13,
            "axes.titlepad": 14,
            "axes.labelcolor": INK,
            "axes.edgecolor": INK,
            "text.color": INK,
            "xtick.color": INK,
            "ytick.color": INK,
            "axes.spines.top": False,
            "axes.spines.right": False,
            "axes.linewidth": 0.9,
            "lines.linewidth": 2.0,
            "savefig.facecolor": "white",
            "svg.fonttype": "path",
            "svg.hashsalt": "landau-basic-model",
        }
    )


def save_figure(fig: plt.Figure, directory: Path, name: str) -> None:
    fig.savefig(directory / f"{name}.png", dpi=220, bbox_inches="tight")
    fig.savefig(
        directory / f"{name}.svg", bbox_inches="tight", metadata={"Date": None}
    )
    plt.close(fig)


def plot_spectrum(directory: Path) -> None:
    fig, (ax, bx) = plt.subplots(1, 2, figsize=(12.4, 4.9))
    fig.subplots_adjust(left=0.075, right=0.965, bottom=0.20, top=0.88, wspace=0.28)

    xi = np.linspace(-3.4, 3.4, 2001)
    ax.plot(xi, xi**2 / 2, color=INK, lw=1.5, alpha=0.85)
    for n, color in enumerate(COLORS):
        energy = n + 0.5
        density = rho(n, xi)
        ax.axhline(energy, color=color, lw=0.9, ls=(0, (4, 4)), alpha=0.55)
        ax.fill_between(xi, energy, energy + 0.8 * density, color=color, alpha=0.16)
        ax.plot(xi, energy + 0.8 * density, color=color)
        ax.text(2.97, energy + 0.08, rf"$n={n}$", color=color, fontsize=12)
    ax.text(0.16, 4.02, r"$V_{\rm eff}/(\hbar\omega_c)=\xi^2/2$", fontsize=12)
    ax.set(
        xlim=(-3.4, 3.4),
        ylim=(0, 4.45),
        xlabel=r"$\xi=(x-x_0)/\ell_B$",
        ylabel=r"$E/(\hbar\omega_c)$",
        title="(a) Oscillator levels and transverse densities",
    )
    ax.set_yticks(np.arange(0.5, 4, 1))
    ax.text(
        0.5, -0.24,
        r"Density curves: $n+1/2+0.8\,\ell_B|\phi_n|^2$",
        transform=ax.transAxes, ha="center", fontsize=10,
    )

    fields = np.linspace(0.03, 1.5, 400)
    for n, color in enumerate(COLORS):
        bx.plot(fields, (n + 0.5) * fields, color=color)
        bx.text(1.53, (n + 0.5) * 1.5, rf"$n={n}$", color=color, va="center", fontsize=12)
        bx.scatter([1.0], [n + 0.5], color=color, s=23, zorder=4)
    bx.axvline(1.0, color=GRAY, ls=(0, (3, 4)), lw=0.9, zorder=0)
    bx.annotate(
        "", xy=(1.0, 2.5), xytext=(1.0, 1.5),
        arrowprops={"arrowstyle": "<->", "color": INK, "lw": 1.1},
    )
    bx.text(1.04, 1.99, r"$\hbar\omega_c(B_0)$", va="center", fontsize=11)
    bx.set(
        xlim=(0, 1.74),
        ylim=(0, 5.65),
        xlabel=r"$B/B_0$",
        ylabel=r"$E/[\hbar\omega_c(B_0)]$",
        title="(b) Landau energies versus magnetic field",
    )
    bx.set_xticks([0, 0.5, 1.0, 1.5])
    bx.text(
        0.5, -0.24, r"Fixed mass; $B_0>0$ is a reference field",
        transform=bx.transAxes, ha="center", fontsize=10,
    )
    save_figure(fig, directory, "landau_spectrum")


def plot_guiding_centers(directory: Path) -> None:
    fig, (ax, bx) = plt.subplots(1, 2, figsize=(12.4, 4.9))
    fig.subplots_adjust(left=0.075, right=0.965, bottom=0.20, top=0.88, wspace=0.28)

    x = np.linspace(-5.6, 5.6, 2501)
    for center, color in zip([-3.0, 0.0, 3.0], COLORS):
        density = rho(0, x - center)
        ax.fill_between(x, density, color=color, alpha=0.12)
        ax.plot(x, density, color=color)
        ax.vlines(center, 0, 0.565, color=color, lw=0.9, ls=(0, (3, 3)))
        ax.text(
            center, 0.615, rf"$x_0/\ell_B={center:g}$",
            ha="center", color=color, fontsize=12,
        )
    ax.set(
        xlim=(-5.6, 5.6),
        ylim=(0, 0.70),
        xlabel=r"$x/\ell_B$",
        ylabel=r"$\ell_B|\phi_0(x-x_0)|^2$",
        title="(a) Degenerate orbitals in the lowest level",
    )
    ax.set_xticks([-4, -2, 0, 2, 4])
    ax.text(
        0.5, -0.24, r"All three states have $E_0=\hbar\omega_c/2$",
        transform=ax.transAxes, ha="center", fontsize=10,
    )

    # A counting schematic. Horizontal and vertical coordinates are not to scale.
    width, height = 12.0, 6.0
    bx.add_patch(Rectangle((4, 0), 1, height, color=COLORS[0], alpha=0.13, lw=0))
    for center in range(1, 12):
        color = COLORS[0] if center in (4, 5) else "#B2BDC6"
        bx.plot([center, center], [0, height], color=color, lw=1.2)
    for edge in (0, width):
        bx.plot([edge, edge], [0, height], color=INK, lw=1.3)
    for edge in (0, height):
        bx.plot([0, width], [edge, edge], color=INK, lw=1.0, ls=(0, (4, 3)))

    bx.annotate(
        "", xy=(4, 6.45), xytext=(5, 6.45),
        arrowprops={"arrowstyle": "<->", "color": COLORS[0], "lw": 1.2},
    )
    bx.text(4.5, 6.78, r"$\Delta x_0=2\pi\ell_B^2/L_y$", ha="center", fontsize=12)
    bx.annotate(
        "", xy=(0, -0.62), xytext=(width, -0.62),
        arrowprops={"arrowstyle": "<->", "color": INK, "lw": 1.0},
    )
    bx.text(width / 2, -1.04, r"$L_x$", ha="center", fontsize=13)
    bx.annotate(
        "", xy=(12.6, 0), xytext=(12.6, height),
        arrowprops={"arrowstyle": "<->", "color": INK, "lw": 1.0},
    )
    bx.text(13.0, height / 2, r"$L_y$", va="center", fontsize=13)
    bx.text(8.45, 3.3, "Guiding centers", ha="center", fontsize=10, backgroundcolor="white")
    bx.text(8.45, 2.4, "Periodic in y", ha="center", fontsize=10, backgroundcolor="white")
    bx.set(xlim=(-0.5, 14), ylim=(-1.15, 7.7), title="(b) Counting the allowed guiding centers")
    bx.set_axis_off()
    bx.text(
        0.5, -0.24, r"One state per counting area $L_y\Delta x_0=2\pi\ell_B^2$",
        transform=bx.transAxes, ha="center", fontsize=10,
    )
    save_figure(fig, directory, "landau_guiding_centers")


def verify_densities() -> None:
    # Check the analytic densities used by the figures against normalization and
    # the oscillator's exact second moment. No reference images or fit parameters.
    xi = np.linspace(-12, 12, 24001)
    normalization_errors = []
    variance_errors = []
    for n in range(4):
        density = rho(n, xi)
        normalization_errors.append(abs(np.trapezoid(density, xi) - 1))
        variance_errors.append(abs(np.trapezoid(xi**2 * density, xi) - (n + 0.5)))
    if max(normalization_errors + variance_errors) > 1e-10:
        raise RuntimeError("Oscillator density verification failed.")
    print(f"Maximum normalization error: {max(normalization_errors):.2e}")
    print(f"Maximum second-moment error: {max(variance_errors):.2e}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output-dir", type=Path, default=Path(__file__).resolve().parent)
    args = parser.parse_args()
    args.output_dir.mkdir(parents=True, exist_ok=True)
    configure_style()
    verify_densities()
    plot_spectrum(args.output_dir)
    plot_guiding_centers(args.output_dir)
    print(f"Saved two figures in PNG and SVG: {args.output_dir.resolve()}")


if __name__ == "__main__":
    main()
