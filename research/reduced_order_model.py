"""Dimensionless reduced-order stress-relaxation model for paired vias.

The field ``q`` is a signed scalar proxy for one calibrated, photoelastically
observable deviatoric-stress component.  It is not a von-Mises stress, a full
stress tensor, or a topological charge.  The model deliberately reports
dimensionless exposure so that an unmeasured glass relaxation time is never
presented as a physical time prediction.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Iterable

import numpy as np


@dataclass(frozen=True)
class Grid:
    x: np.ndarray
    y: np.ndarray
    xx: np.ndarray
    yy: np.ndarray
    dx: float
    extent: float


@dataclass
class SimulationResult:
    times: np.ndarray
    energy: np.ndarray
    peak: np.ndarray
    snapshots: dict[float, np.ndarray]
    final_field: np.ndarray


def make_grid(n: int = 129, extent: float = 6.0) -> Grid:
    """Return a square cell-centred grid in coordinates normalized by pitch."""
    if n < 17 or n % 2 == 0:
        raise ValueError("n must be an odd integer of at least 17")
    dx = extent / n
    x = np.linspace(-extent / 2.0 + dx / 2.0, extent / 2.0 - dx / 2.0, n)
    xx, yy = np.meshgrid(x, x, indexing="xy")
    return Grid(x=x, y=x.copy(), xx=xx, yy=yy, dx=float(dx), extent=extent)


def self_equilibrated_signature(
    grid: Grid,
    center_x: float,
    center_y: float = 0.0,
    width_ratio: float = 0.08,
    via_radius_ratio: float = 0.16,
) -> np.ndarray:
    """Return a zero-integral wall-ring plus compensating-halo signature.

    This is a generic basis function, not a fitted TGV stress profile.  It is
    zero inside the idealized hole; the positive wall ring is balanced by a
    broader negative halo in the solid.  All lengths are divided by pitch.
    """
    if width_ratio <= 0 or via_radius_ratio <= 0:
        raise ValueError("width_ratio and via_radius_ratio must be positive")
    radius = np.sqrt((grid.xx - center_x) ** 2 + (grid.yy - center_y) ** 2)
    solid = radius >= via_radius_ratio
    wall = np.exp(-0.5 * ((radius - via_radius_ratio) / width_ratio) ** 2) * solid
    halo_radius = via_radius_ratio + 2.8 * width_ratio
    halo_width = 1.6 * width_ratio
    halo = np.exp(-0.5 * ((radius - halo_radius) / halo_width) ** 2) * solid
    balance = float(np.sum(wall) / np.sum(halo))
    return wall - balance * halo


def paired_initial_field(
    grid: Grid,
    polarity: str = "opposite",
    width_ratio: float = 0.08,
    separation_ratio: float = 1.0,
    via_radius_ratio: float = 0.16,
) -> np.ndarray:
    """Construct same- or opposite-polarity paired stress signatures."""
    if polarity not in {"opposite", "same"}:
        raise ValueError("polarity must be 'opposite' or 'same'")
    half = separation_ratio / 2.0
    left = self_equilibrated_signature(
        grid,
        -half,
        width_ratio=width_ratio,
        via_radius_ratio=via_radius_ratio,
    )
    right = self_equilibrated_signature(
        grid,
        half,
        width_ratio=width_ratio,
        via_radius_ratio=via_radius_ratio,
    )
    field = left - right if polarity == "opposite" else left + right
    scale = np.max(np.abs(field))
    if scale == 0:
        raise ValueError("degenerate initial field")
    return field / scale


def selective_mobility(
    grid: Grid,
    heat_radius_ratio: float = 0.55,
    separation_ratio: float = 1.0,
    via_radius_ratio: float = 0.16,
) -> np.ndarray:
    """Return a smooth union of two normalized local mobility kernels.

    The field ranges from zero to one.  It represents a prescribed local
    mobility window and is not a solved laser temperature distribution.
    """
    if heat_radius_ratio <= 0:
        raise ValueError("heat_radius_ratio must be positive")
    half = separation_ratio / 2.0
    r1 = (grid.xx + half) ** 2 + grid.yy**2
    r2 = (grid.xx - half) ** 2 + grid.yy**2
    m1 = np.exp(-r1 / (2.0 * heat_radius_ratio**2))
    m2 = np.exp(-r2 / (2.0 * heat_radius_ratio**2))
    mobility = 1.0 - (1.0 - m1) * (1.0 - m2)
    solid = (np.sqrt(r1) >= via_radius_ratio) & (np.sqrt(r2) >= via_radius_ratio)
    return mobility * solid


def _rhs(q: np.ndarray, mobility: np.ndarray, da: float, dx: float) -> np.ndarray:
    """Conservative finite-volume divergence with zero-normal-flux boundaries."""
    left_m = mobility[:, :-1]
    right_m = mobility[:, 1:]
    lower_m = mobility[:-1, :]
    upper_m = mobility[1:, :]
    face_x = np.divide(
        2.0 * left_m * right_m,
        left_m + right_m,
        out=np.zeros_like(left_m),
        where=(left_m + right_m) > 0,
    )
    face_y = np.divide(
        2.0 * lower_m * upper_m,
        lower_m + upper_m,
        out=np.zeros_like(lower_m),
        where=(lower_m + upper_m) > 0,
    )
    flux_x = face_x * (q[:, 1:] - q[:, :-1]) / dx
    flux_y = face_y * (q[1:, :] - q[:-1, :]) / dx

    div = np.zeros_like(q)
    div[:, 0] += flux_x[:, 0] / dx
    div[:, 1:-1] += (flux_x[:, 1:] - flux_x[:, :-1]) / dx
    div[:, -1] += -flux_x[:, -1] / dx
    div[0, :] += flux_y[0, :] / dx
    div[1:-1, :] += (flux_y[1:, :] - flux_y[:-1, :]) / dx
    div[-1, :] += -flux_y[-1, :] / dx
    return div - da * mobility * q


def simulate(
    q0: np.ndarray,
    mobility: np.ndarray,
    grid: Grid,
    da: float,
    sample_times: Iterable[float],
    stability_factor: float = 0.18,
) -> SimulationResult:
    """Integrate the nondimensional relaxation equation by explicit Euler.

    Time is the Fourier exposure ``Fo = D_s,max t / p^2`` and ``da`` is the
    local reaction-to-diffusion ratio ``p^2 / (D_s,max tau_M)``.
    """
    if q0.shape != mobility.shape or q0.shape != grid.xx.shape:
        raise ValueError("q0, mobility, and grid must have matching shapes")
    if da < 0:
        raise ValueError("da must be nonnegative")
    times = np.asarray(sorted(set(float(t) for t in sample_times)), dtype=float)
    if times.size == 0 or times[0] < 0:
        raise ValueError("sample_times must contain nonnegative values")
    if not 0 < stability_factor <= 0.2:
        raise ValueError("stability_factor must lie in (0, 0.2]")

    dt_nominal = stability_factor * grid.dx**2
    if da > 0:
        dt_nominal = min(dt_nominal, 0.2 / da)
    q = np.asarray(q0, dtype=float).copy()
    e0 = float(np.mean(q0**2))
    p0 = float(np.max(np.abs(q0)))
    if e0 == 0 or p0 == 0:
        raise ValueError("q0 must be nonzero")

    energy_values: list[float] = []
    peak_values: list[float] = []
    snapshots: dict[float, np.ndarray] = {}
    t_now = 0.0

    for target in times:
        while t_now < target - 1e-15:
            dt = min(dt_nominal, target - t_now)
            q += dt * _rhs(q, mobility, da, grid.dx)
            t_now += dt
        energy_values.append(float(np.mean(q**2) / e0))
        peak_values.append(float(np.max(np.abs(q)) / p0))
        snapshots[float(target)] = q.copy()

    return SimulationResult(
        times=times,
        energy=np.asarray(energy_values),
        peak=np.asarray(peak_values),
        snapshots=snapshots,
        final_field=q,
    )


def first_crossing_time(times: np.ndarray, values: np.ndarray, threshold: float) -> float:
    """Linearly interpolate the first downward threshold crossing."""
    hit = np.flatnonzero(values <= threshold)
    if hit.size == 0:
        return float("nan")
    i = int(hit[0])
    if i == 0:
        return float(times[0])
    t0, t1 = times[i - 1], times[i]
    v0, v1 = values[i - 1], values[i]
    if v0 == v1:
        return float(t1)
    return float(t0 + (threshold - v0) * (t1 - t0) / (v1 - v0))


def verify_cosine_mode(
    n: int,
    da: float = 0.5,
    exposure: float = 0.12,
    stability_factor: float = 0.18,
) -> dict[str, float]:
    """Compare the numerical solver with a Neumann cosine eigenmode."""
    grid = make_grid(n=n, extent=6.0)
    shifted_x = grid.xx + grid.extent / 2.0
    shifted_y = grid.yy + grid.extent / 2.0
    q0 = np.cos(np.pi * shifted_x / grid.extent) * np.cos(np.pi * shifted_y / grid.extent)
    mobility = np.ones_like(q0)
    result = simulate(
        q0=q0,
        mobility=mobility,
        grid=grid,
        da=da,
        sample_times=[exposure],
        stability_factor=stability_factor,
    )
    eigenvalue = 2.0 * (np.pi / grid.extent) ** 2
    exact = q0 * np.exp(-(eigenvalue + da) * exposure)
    rel_l2 = float(np.linalg.norm(result.final_field - exact) / np.linalg.norm(exact))
    rel_linf = float(np.max(np.abs(result.final_field - exact)) / np.max(np.abs(exact)))
    return {
        "n": float(n),
        "dx_over_p": grid.dx,
        "relative_l2_error": rel_l2,
        "relative_linf_error": rel_linf,
    }
