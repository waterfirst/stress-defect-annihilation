"""Generate reproducible NPE submission figures and numerical tables.

All scientific panels are produced by Plotly from the model in
``research/reduced_order_model.py``.  No generative image system is used.
"""

from __future__ import annotations

import csv
import json
import sys
from pathlib import Path

import numpy as np


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / ".codex_packages"))
sys.path.insert(0, str(ROOT / "research"))

import plotly.graph_objects as go
from plotly.subplots import make_subplots

from reduced_order_model import (
    first_crossing_time,
    make_grid,
    paired_initial_field,
    selective_mobility,
    simulate,
    verify_cosine_mode,
)


OUT = ROOT / "submission" / "npe"
FIG_DIR = OUT / "figures"
DATA_DIR = OUT / "data"
for folder in (FIG_DIR, DATA_DIR):
    folder.mkdir(parents=True, exist_ok=True)


COLORS = {
    "blue": "#0072B2",
    "orange": "#D55E00",
    "green": "#009E73",
    "purple": "#CC79A7",
    "sky": "#56B4E9",
    "yellow": "#E69F00",
    "gray": "#5F6368",
    "light": "#F0F4F8",
    "text": "#202124",
}


def base_layout(fig: go.Figure, width: int = 1600, height: int = 980) -> None:
    fig.update_layout(
        template="simple_white",
        width=width,
        height=height,
        paper_bgcolor="white",
        plot_bgcolor="white",
        font=dict(family="Arial", size=24, color=COLORS["text"]),
        margin=dict(l=95, r=55, t=95, b=80),
        legend=dict(bgcolor="rgba(255,255,255,0.92)", bordercolor="#DADCE0", borderwidth=1),
    )
    fig.update_xaxes(showline=True, linewidth=1.4, linecolor="#5F6368", mirror=False)
    fig.update_yaxes(showline=True, linewidth=1.4, linecolor="#5F6368", mirror=False)


def panel_labels(fig: go.Figure, labels: list[tuple[str, float, float]]) -> None:
    for label, x, y in labels:
        fig.add_annotation(
            x=x,
            y=y,
            xref="paper",
            yref="paper",
            text=f"<b>{label}</b>",
            showarrow=False,
            font=dict(size=30, color=COLORS["text"]),
            xanchor="left",
            yanchor="bottom",
        )


def export_figure(fig: go.Figure, stem: str, png_scale: float = 1.5) -> None:
    fig.write_image(FIG_DIR / f"{stem}.pdf", format="pdf")
    fig.write_image(FIG_DIR / f"{stem}.png", format="png", scale=png_scale)


def write_csv(path: Path, header: list[str], rows: list[list[object]]) -> None:
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.writer(handle)
        writer.writerow(header)
        writer.writerows(rows)


grid = make_grid(129, extent=6.0)
width_ratio = 0.08
heat_radius_reference = 0.55
da_reference = 0.5
q_opp = paired_initial_field(grid, "opposite", width_ratio=width_ratio)
q_same = paired_initial_field(grid, "same", width_ratio=width_ratio)
mobility_ref = selective_mobility(grid, heat_radius_reference)


# Figure 1: quantities and computational workflow.
fig1 = make_subplots(
    rows=1,
    cols=3,
    column_widths=[0.34, 0.34, 0.32],
    horizontal_spacing=0.08,
    specs=[[{"type": "heatmap"}, {"type": "heatmap"}, {"type": "xy"}]],
)
fig1.add_trace(
    go.Heatmap(
        z=q_opp,
        x=grid.x,
        y=grid.y,
        zmin=-1,
        zmax=1,
        colorscale="RdBu",
        reversescale=True,
        colorbar=dict(title="q/q₀", len=0.62, x=0.30, thickness=18),
        hovertemplate="x/p=%{x:.2f}<br>y/p=%{y:.2f}<br>q/q₀=%{z:.3f}<extra></extra>",
    ),
    1,
    1,
)
fig1.add_trace(
    go.Heatmap(
        z=mobility_ref,
        x=grid.x,
        y=grid.y,
        zmin=0,
        zmax=1,
        colorscale="Cividis",
        colorbar=dict(title="m", len=0.62, x=0.65, thickness=18),
        hovertemplate="x/p=%{x:.2f}<br>y/p=%{y:.2f}<br>m=%{z:.3f}<extra></extra>",
    ),
    1,
    2,
)
fig1.add_trace(go.Scatter(x=[0, 1], y=[0, 1], mode="markers", marker_opacity=0, showlegend=False), 1, 3)
workflow_boxes = [
    (0.08, 0.79, "Measured or assumed<br>signed field q₀"),
    (0.08, 0.53, "Prescribed local<br>mobility m(x,y)"),
    (0.08, 0.27, "Dimensionless solve<br>Fo and Da"),
    (0.08, 0.01, "Residual quadratic content,<br>peak and Fo₉₀"),
]
for x, y, label in workflow_boxes:
    fig1.add_shape(
        type="rect",
        x0=x,
        x1=0.92,
        y0=y,
        y1=y + 0.16,
        xref="x3",
        yref="y3",
        line=dict(color="#9AA0A6", width=2),
        fillcolor="#F8FAFD",
    )
    fig1.add_annotation(x=0.50, y=y + 0.08, xref="x3", yref="y3", text=label, showarrow=False, font=dict(size=24))
for y0 in (0.79, 0.53, 0.27):
    fig1.add_annotation(
        x=0.50,
        y=y0 - 0.095,
        ax=0.50,
        ay=y0 - 0.045,
        xref="x3",
        yref="y3",
        axref="x3",
        ayref="y3",
        text="",
        showarrow=True,
        arrowhead=2,
        arrowsize=1.3,
        arrowwidth=2,
        arrowcolor=COLORS["blue"],
    )
fig1.update_xaxes(title_text="x/p", scaleanchor="y", scaleratio=1, row=1, col=1)
fig1.update_yaxes(title_text="y/p", row=1, col=1)
fig1.update_xaxes(title_text="x/p", scaleanchor="y2", scaleratio=1, row=1, col=2)
fig1.update_yaxes(title_text="y/p", row=1, col=2)
fig1.update_xaxes(range=[0, 1], visible=False, row=1, col=3)
fig1.update_yaxes(range=[0, 1], visible=False, row=1, col=3)
base_layout(fig1, width=1400, height=688)
fig1.update_layout(title=None, margin=dict(l=95, r=55, t=55, b=80))
panel_labels(fig1, [("(a)", 0.00, 1.01), ("(b)", 0.36, 1.01), ("(c)", 0.72, 1.01)])
export_figure(fig1, "Figure_1_model_workflow")


# Figure 2: energy histories for mobility-window size and polarity.
times_curve = np.linspace(0.0, 0.5, 101)
heat_radii = [0.25, 0.55, 1.00]
curve_colors = [COLORS["orange"], COLORS["blue"], COLORS["green"]]
fig2 = go.Figure()
energy_rows: list[list[object]] = []
curve_results: dict[tuple[float, str], object] = {}
for radius, color in zip(heat_radii, curve_colors):
    mobility = selective_mobility(grid, radius)
    for polarity, dash in (("opposite", "solid"), ("same", "dash")):
        q0 = q_opp if polarity == "opposite" else q_same
        result = simulate(q0, mobility, grid, da_reference, times_curve)
        curve_results[(radius, polarity)] = result
        fig2.add_trace(
            go.Scatter(
                x=result.times,
                y=result.energy,
                mode="lines",
                name=f"{radius:.2f} {'opp.' if polarity == 'opposite' else 'same'}",
                line=dict(color=color, width=4, dash=dash),
                hovertemplate="Fo=%{x:.3f}<br>E/E₀=%{y:.3e}<extra></extra>",
            )
        )
        energy_rows.extend([[radius, polarity, da_reference, float(t), float(e), float(p)] for t, e, p in zip(result.times, result.energy, result.peak)])
base_layout(fig2, width=950, height=583)
fig2.update_layout(
    title=None,
    legend=dict(orientation="h", yanchor="bottom", y=1.01, xanchor="center", x=0.5, font=dict(size=24)),
)
fig2.update_xaxes(title="Fourier exposure, Fo = Dₛ,max t/p²", range=[0, 0.5])
fig2.update_yaxes(title="Normalized quadratic content, Cq/Cq,0", type="log", range=[-5.3, 0.05])
export_figure(fig2, "Figure_2_energy_histories")
write_csv(DATA_DIR / "quadratic_content_histories.csv", ["heat_radius_over_pitch", "polarity", "Da", "Fo", "quadratic_content_ratio", "peak_ratio"], energy_rows)


# Figure 3: equal-scale field snapshots for the primary control comparison.
snapshot_times = [0.0, 0.03, 0.30]
opp_snap = simulate(q_opp, mobility_ref, grid, da_reference, snapshot_times)
same_snap = simulate(q_same, mobility_ref, grid, da_reference, snapshot_times)
fig3 = make_subplots(rows=2, cols=3, horizontal_spacing=0.04, vertical_spacing=0.12)
for row, (polarity, result) in enumerate((("Opposite polarity", opp_snap), ("Same polarity", same_snap)), start=1):
    for col, exposure in enumerate(snapshot_times, start=1):
        fig3.add_trace(
            go.Heatmap(
                z=result.snapshots[exposure],
                x=grid.x,
                y=grid.y,
                zmin=-1,
                zmax=1,
                colorscale="RdBu",
                reversescale=True,
                showscale=(row == 1 and col == 3),
                colorbar=dict(title="q/q₀", len=0.70, thickness=18, x=1.01),
                hovertemplate="x/p=%{x:.2f}<br>y/p=%{y:.2f}<br>q/q₀=%{z:.3f}<extra></extra>",
            ),
            row,
            col,
        )
        fig3.update_xaxes(title_text="x/p" if row == 2 else None, range=[-1.8, 1.8], row=row, col=col)
        fig3.update_yaxes(title_text=None, range=[-1.4, 1.4], scaleanchor=f"x{(row-1)*3+col if (row-1)*3+col>1 else ''}", scaleratio=1, row=row, col=col)
        residual = result.energy[col - 1]
        fig3.add_annotation(
            x=0.5,
            y=1.04,
            xref=f"x{(row-1)*3+col if (row-1)*3+col>1 else ''} domain",
            yref=f"y{(row-1)*3+col if (row-1)*3+col>1 else ''} domain",
            text=f"Fo={exposure:.2f}; Cq/Cq,0={residual:.2e}",
            showarrow=False,
            font=dict(size=24),
        )
fig3.add_annotation(x=-0.095, y=0.77, xref="paper", yref="paper", text="Opposite<br>polarity", textangle=-90, showarrow=False, font=dict(size=24))
fig3.add_annotation(x=-0.095, y=0.22, xref="paper", yref="paper", text="Same<br>polarity", textangle=-90, showarrow=False, font=dict(size=24))
fig3.add_annotation(x=-0.035, y=0.50, xref="paper", yref="paper", text="y/p", textangle=-90, showarrow=False, font=dict(size=24))
base_layout(fig3, width=1400, height=896)
fig3.update_layout(margin=dict(l=150, r=90, t=100, b=90))
fig3.update_layout(title=None)
export_figure(fig3, "Figure_3_field_snapshots")


# Figure 4: polarity effect map and Fo90 comparison.
radii_map = np.linspace(0.20, 1.00, 17)
times_map = np.unique(np.concatenate([np.linspace(0.0, 0.10, 101), np.linspace(0.11, 0.50, 40)]))
grid_sweep = make_grid(97, extent=6.0)
q_opp_sweep = paired_initial_field(grid_sweep, "opposite", width_ratio=width_ratio)
q_same_sweep = paired_initial_field(grid_sweep, "same", width_ratio=width_ratio)
benefit = np.zeros((len(radii_map), len(times_map)))
fo90_opp: list[float] = []
fo90_same: list[float] = []
map_rows: list[list[object]] = []
for i, radius in enumerate(radii_map):
    mobility = selective_mobility(grid_sweep, float(radius))
    result_opp = simulate(q_opp_sweep, mobility, grid_sweep, da_reference, times_map)
    result_same = simulate(q_same_sweep, mobility, grid_sweep, da_reference, times_map)
    benefit[i] = 100.0 * (result_same.energy - result_opp.energy) / np.maximum(result_same.energy, 1e-30)
    fo90_opp.append(first_crossing_time(result_opp.times, result_opp.energy, 0.1))
    fo90_same.append(first_crossing_time(result_same.times, result_same.energy, 0.1))
    map_rows.extend(
        [
            [float(radius), float(t), float(b), float(eo), float(es)]
            for t, b, eo, es in zip(times_map, benefit[i], result_opp.energy, result_same.energy)
        ]
    )

fig4 = make_subplots(rows=1, cols=2, column_widths=[0.60, 0.40], horizontal_spacing=0.18, shared_yaxes=True)
fig4.add_trace(
    go.Heatmap(
        z=benefit,
        x=times_map,
        y=radii_map,
        zmid=0,
        zmin=-60,
        zmax=60,
        colorscale="RdBu",
        reversescale=True,
        colorbar=dict(title="ΔC (%)", len=0.66, x=0.55, thickness=19),
        hovertemplate="Fo=%{x:.2f}<br>h/p=%{y:.2f}<br>benefit=%{z:.1f}%<extra></extra>",
    ),
    1,
    1,
)
fig4.add_trace(
    go.Contour(
        z=benefit,
        x=times_map,
        y=radii_map,
        contours=dict(start=0, end=0, size=1, coloring="none"),
        line=dict(color="#202124", width=3),
        showscale=False,
        showlegend=False,
        hoverinfo="skip",
    ),
    1,
    1,
)
fig4.add_trace(go.Scatter(x=fo90_opp, y=radii_map, mode="lines+markers", name="Opposite", line=dict(color=COLORS["blue"], width=4), marker=dict(size=9)), 1, 2)
fig4.add_trace(go.Scatter(x=fo90_same, y=radii_map, mode="lines+markers", name="Same", line=dict(color=COLORS["orange"], width=4, dash="dash"), marker=dict(size=9, symbol="diamond")), 1, 2)
fig4.update_xaxes(title_text="Fourier exposure, Fo", row=1, col=1)
fig4.update_yaxes(title_text="Mobility radius, h/p", row=1, col=1)
fig4.update_xaxes(title_text="90% reduction exposure, Fo₉₀", row=1, col=2)
fig4.update_yaxes(title_text=None, showticklabels=False, row=1, col=2)
base_layout(fig4, width=1400, height=736)
fig4.update_layout(
    title=None,
    legend=dict(orientation="h", y=1.01, x=0.80, xanchor="center", font=dict(size=24)),
)
panel_labels(fig4, [("(a)", 0.00, 1.01), ("(b)", 0.64, 1.01)])
export_figure(fig4, "Figure_4_design_map")
write_csv(DATA_DIR / "polarity_design_map.csv", ["heat_radius_over_pitch", "Fo", "opposite_benefit_percent", "opposite_energy_ratio", "same_energy_ratio"], map_rows)
write_csv(DATA_DIR / "fo90_by_heat_radius.csv", ["heat_radius_over_pitch", "Fo90_opposite", "Fo90_same"], [[float(r), float(o), float(s)] for r, o, s in zip(radii_map, fo90_opp, fo90_same)])


# Figure 5: solver verification, reaction sensitivity, and conditional time map.
verification_ns = [33, 49, 65, 97, 129]
verification = [verify_cosine_mode(n, da=da_reference, exposure=0.12) for n in verification_ns]
da_values = np.asarray([0.0, 0.1, 0.5, 1.0, 2.0, 5.0])
times_short = np.linspace(0.0, 0.10, 101)
fo90_da_opp: list[float] = []
fo90_da_same: list[float] = []
for da in da_values:
    r_opp = simulate(q_opp, mobility_ref, grid, float(da), times_short)
    r_same = simulate(q_same, mobility_ref, grid, float(da), times_short)
    fo90_da_opp.append(first_crossing_time(r_opp.times, r_opp.energy, 0.1))
    fo90_da_same.append(first_crossing_time(r_same.times, r_same.energy, 0.1))

fo90_reference = float(fo90_opp[int(np.argmin(np.abs(radii_map - heat_radius_reference)))])
pitches_um = np.linspace(50, 300, 101)
effective_diffusivities = [1e-10, 1e-9, 1e-8]

fig5 = make_subplots(rows=1, cols=3, horizontal_spacing=0.10, column_widths=[0.31, 0.31, 0.38])
fig5.add_trace(
    go.Scatter(
        x=[v["dx_over_p"] for v in verification],
        y=[v["relative_l2_error"] for v in verification],
        mode="lines+markers",
        name="Cosine-mode benchmark",
        showlegend=False,
        line=dict(color=COLORS["blue"], width=4),
        marker=dict(size=10),
    ),
    1,
    1,
)
fig5.add_trace(go.Scatter(x=da_values, y=fo90_da_opp, mode="lines+markers", name="Opposite", line=dict(color=COLORS["blue"], width=4)), 1, 2)
fig5.add_trace(go.Scatter(x=da_values, y=fo90_da_same, mode="lines+markers", name="Same", line=dict(color=COLORS["orange"], width=4, dash="dash")), 1, 2)
for diffusivity, color in zip(effective_diffusivities, [COLORS["orange"], COLORS["blue"], COLORS["green"]]):
    t90 = fo90_reference * (pitches_um * 1e-6) ** 2 / diffusivity
    fig5.add_trace(
        go.Scatter(
            x=pitches_um,
            y=t90,
            mode="lines",
            name={1e-10: "D=10⁻¹⁰", 1e-9: "D=10⁻⁹", 1e-8: "D=10⁻⁸"}[diffusivity],
            line=dict(color=color, width=4),
            hovertemplate="p=%{x:.0f} µm<br>conditional t₉₀=%{y:.3g} s<extra></extra>",
        ),
        1,
        3,
    )
fig5.update_xaxes(
    title_text="Grid spacing, Δx/p",
    tickvals=[verification[i]["dx_over_p"] for i in (0, 2, 4)],
    ticktext=[f"{verification[i]['dx_over_p']:.3f}" for i in (0, 2, 4)],
    tickangle=0,
    row=1,
    col=1,
)
fig5.update_yaxes(title_text="Relative L₂ error", rangemode="tozero", row=1, col=1)
fig5.update_xaxes(title_text="Damköhler number, Da", row=1, col=2)
fig5.update_yaxes(title_text="Fo₉₀", row=1, col=2)
fig5.update_xaxes(title_text="Via pitch, p (µm)", row=1, col=3)
fig5.update_yaxes(title_text="Conditional t₉₀ (s)", type="log", row=1, col=3)
fig5.update_yaxes(
    tickvals=[0.005, 0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10, 20],
    ticktext=["0.005", "0.01", "0.02", "0.05", "0.1", "0.2", "0.5", "1", "2", "5", "10", "20"],
    row=1,
    col=3,
)
base_layout(fig5, width=1450, height=705)
fig5.update_layout(
    title=None,
    legend=dict(orientation="h", y=-0.20, x=0.5, xanchor="center", font=dict(size=24)),
    margin=dict(l=95, r=55, t=100, b=150),
)
panel_labels(fig5, [("(a)", 0.00, 1.01), ("(b)", 0.36, 1.01), ("(c)", 0.70, 1.01)])
export_figure(fig5, "Figure_5_verification_and_scaling")
write_csv(DATA_DIR / "solver_verification.csv", ["n", "dx_over_pitch", "relative_l2_error", "relative_linf_error"], [[int(v["n"]), v["dx_over_p"], v["relative_l2_error"], v["relative_linf_error"]] for v in verification])
write_csv(DATA_DIR / "da_sensitivity.csv", ["Da", "Fo90_opposite", "Fo90_same"], [[float(d), float(o), float(s)] for d, o, s in zip(da_values, fo90_da_opp, fo90_da_same)])
scenario_rows: list[list[object]] = []
for diffusivity in effective_diffusivities:
    for pitch, t90 in zip(pitches_um, fo90_reference * (pitches_um * 1e-6) ** 2 / diffusivity):
        scenario_rows.append([diffusivity, float(pitch), float(t90), fo90_reference])
write_csv(DATA_DIR / "conditional_time_map.csv", ["effective_Ds_m2_per_s", "pitch_um", "conditional_t90_s", "Fo90_used"], scenario_rows)


# Required online highlight image; it remains a reproducible data visualization.
highlight = make_subplots(rows=2, cols=2, horizontal_spacing=0.08, vertical_spacing=0.12)
highlight.add_trace(go.Heatmap(z=q_opp, x=grid.x, y=grid.y, zmin=-1, zmax=1, colorscale="RdBu", reversescale=True, showscale=False), 1, 1)
highlight.add_trace(go.Heatmap(z=mobility_ref, x=grid.x, y=grid.y, zmin=0, zmax=1, colorscale="Cividis", showscale=False), 1, 2)
highlight.add_trace(go.Scatter(x=times_curve, y=curve_results[(0.55, "opposite")].energy, mode="lines", line=dict(color=COLORS["blue"], width=6), name="Opposite"), 2, 1)
highlight.add_trace(go.Scatter(x=times_curve, y=curve_results[(0.55, "same")].energy, mode="lines", line=dict(color=COLORS["orange"], width=6, dash="dash"), name="Same"), 2, 1)
highlight.add_trace(go.Scatter(x=fo90_opp, y=radii_map, mode="lines+markers", line=dict(color=COLORS["blue"], width=6), showlegend=False), 2, 2)
highlight.add_trace(go.Scatter(x=fo90_same, y=radii_map, mode="lines+markers", line=dict(color=COLORS["orange"], width=6, dash="dash"), showlegend=False), 2, 2)
base_layout(highlight, width=2404, height=1882)
highlight.update_layout(
    title=dict(text="Paired-via stress relaxation: dimensionless design map", x=0.5, xanchor="center", font=dict(size=38)),
    legend=dict(orientation="h", x=0.25, y=0.47, xanchor="center", font=dict(size=26)),
)
highlight.update_xaxes(title_text="x/p", row=1, col=1)
highlight.update_yaxes(title_text="y/p", row=1, col=1)
highlight.update_xaxes(title_text="x/p", row=1, col=2)
highlight.update_yaxes(title_text="y/p", row=1, col=2)
highlight.update_xaxes(title_text="Fo", row=2, col=1)
highlight.update_yaxes(title_text="Cq/Cq,0", type="log", row=2, col=1)
highlight.update_xaxes(title_text="Fo₉₀", row=2, col=2)
highlight.update_yaxes(title_text="h/p", row=2, col=2)
highlight.write_image(FIG_DIR / "Highlight_Image.png", format="png", width=2404, height=1882, scale=1)


manifest = {
    "artifact": "NPE reduced-order paired-via stress-relaxation calculation",
    "generated_by": "scripts/build_npe_assets.py",
    "generative_ai_images_used": False,
    "model": {
        "equation": "dq/dFo = div(m grad q) - Da m q",
        "field_interpretation": "signed scalar proxy for one calibrated deviatoric-stress component",
        "grid_n_reference": 129,
        "domain_extent_over_pitch": 6.0,
        "initial_signature_width_over_pitch": width_ratio,
        "reference_mobility_radius_over_pitch": heat_radius_reference,
        "reference_Da": da_reference,
        "boundary_condition": "zero normal flux",
        "integrator": "conservative finite volume in space; explicit Euler in exposure",
        "stability_factor": 0.18,
    },
    "interpretive_limit": "Mapping Fo to seconds requires a separately calibrated effective stress mobility D_s,max.",
}
(DATA_DIR / "model_manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")


summary = {
    "Fo90_reference_opposite": fo90_reference,
    "Fo90_reference_same": float(fo90_same[int(np.argmin(np.abs(radii_map - heat_radius_reference)))]),
    "Fo90_opposite_range_over_h": [float(np.nanmin(fo90_opp)), float(np.nanmax(fo90_opp))],
    "Fo90_same_range_over_h": [float(np.nanmin(fo90_same)), float(np.nanmax(fo90_same))],
    "maximum_absolute_polarity_benefit_percent": float(np.max(np.abs(benefit[:, 1:]))),
    "benchmark_finest_relative_l2_error": float(verification[-1]["relative_l2_error"]),
}
(DATA_DIR / "result_summary.json").write_text(json.dumps(summary, indent=2), encoding="utf-8")
print(json.dumps(summary, indent=2))
