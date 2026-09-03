# Laser Stress-Defect Annihilation Simulator

**Stress-defect annihilation simulator for laser-processed glass**  
A hypothesis-driven interactive simulator for exploring how laser-induced residual stress in drilled glass can be relaxed, reduced, or “annihilated” through selective laser annealing, inspired by defect annihilation in liquid-crystal director fields.

This project extends the concept of **stress-induced birefringence measurement for crack detection** into a next-step framework:

> **Measure → Predict → Cure**

Instead of only detecting crack precursors after Bessel beam laser drilling, this simulator explores the process window where residual stress hotspots may be selectively relaxed before they evolve into cracks.

---

## 1. Background

Laser drilling, Bessel beam processing, and through-glass-via (TGV) formation can generate strong residual stress fields in glass. These stresses may remain optically invisible under ordinary microscopy but can appear as **stress-induced birefringence** or **retardation** under polarized optical measurement.

In prior work, retardation mapping and slow-axis analysis were used to detect latent crack precursors around laser-drilled holes. The present simulator builds on that idea and asks a new question:

> Can the residual stress field be treated like a topological defect field and selectively relaxed by laser annealing, similar to defect annihilation in liquid crystals?

---

## 2. Core Concept

The simulator models a laser-induced stress hotspot as a normalized **stress-defect order parameter**:

\[
S_\sigma = 0
\]

for a stress-free state, and

\[
S_\sigma \approx 1
\]

for a highly stressed defect core.

The optical retardation is assumed to scale with the residual stress level:

\[
R_{\text{final}} = R_0 \cdot \frac{S_{\text{final}}}{S_0}
\]

where:

- \(R_0\): initial peak retardation
- \(S_0\): initial normalized stress-defect strength
- \(S_{\text{final}}\): residual stress-defect strength after annealing

---

## 3. Model

The simulator uses a simplified relaxation model:

\[
S(t) = S_{\text{floor}} + (S_0 - S_{\text{floor}})\exp[-k_{\text{eff}}t]
\]

where:

- \(S(t)\): stress-defect order parameter after annealing time \(t\)
- \(S_0\): initial stress-defect value
- \(S_{\text{floor}}\): residual locked stress that cannot be fully removed under the selected condition
- \(k_{\text{eff}}\): effective relaxation rate
- \(t\): annealing dwell time

The effective relaxation rate is modeled as:

\[
k_{\text{eff}} =
k_0
\exp\left[
-\frac{E_a}{k_B}
\left(
\frac{1}{T} - \frac{1}{T_g}
\right)
\right]
\cdot
\text{locality}(r_h/l)
+
k_{\text{diff}}
\]

where:

- \(k_0\): reference relaxation rate near \(T_g\)
- \(E_a\): activation energy
- \(k_B\): Boltzmann constant
- \(T\): annealing temperature
- \(T_g\): glass transition temperature
- \(r_h\): heated-zone radius
- \(l\): hole or via pitch
- \(k_{\text{diff}}\): phenomenological stress diffusion term

The locked residual stress floor is modeled as:

\[
S_{\text{floor}}
=
S_0 \cdot \alpha \cdot \exp(-l/55)
\cdot
[
1 - 0.60 \cdot \text{sigmoid}(T/T_g - 0.91)
]
\]

where \(\alpha\) is a stress-locking coefficient representing stress coupling between neighboring drilled holes or via structures.

---

## 4. What the Simulator Shows

The interactive simulator provides four main outputs.

### 4.1 Stress-Defect Decay

Shows how \(S(t)\) decreases with annealing time under the selected process condition.

This plot helps answer:

- Is the selected annealing time sufficient?
- Is the stress relaxation fast enough?
- Does the final stress fall below the target threshold?

### 4.2 Annealing Window Map

Maps the relationship between:

- annealing temperature ratio \(T/T_g\)
- dwell time

The map highlights regions where stress relaxation is effective but shape-risk remains acceptable.

This helps identify a practical process window.

### 4.3 Radial Stress Profile

Compares the local residual stress profile before and after annealing.

This represents selective local stress relaxation around a laser-drilled feature.

### 4.4 Recommended Condition

The simulator searches for a recommended process condition that minimizes a cost function combining:

- residual stress
- shape-risk
- dwell time
- thermal burden

The recommendation is expressed as:

- optimal \(T/T_g\)
- dwell time
- predicted residual \(S_{\text{final}}\)
- predicted residual retardation
- shape-risk
- annihilation number

---

## 5. Parameters

### Initial Stress State

| Parameter | Meaning |
|---|---|
| `S0` | Initial normalized stress-defect strength |
| `R0` | Initial peak retardation in nanometers |
| `pitch` | Hole/via pitch in micrometers |
| `rh` | Heated-zone radius in micrometers |

### Annealing Dynamics

| Parameter | Meaning |
|---|---|
| `Tg` | Glass transition temperature in kelvin |
| `T/Tg` | Annealing temperature normalized by glass transition temperature |
| `ta` | Annealing dwell time in seconds |
| `k0` | Reference relaxation rate near \(T_g\) |
| `Ea` | Activation energy in electronvolts |
| `alpha` | Stress-locking coefficient |

### Target Criteria

| Parameter | Meaning |
|---|---|
| `S_target` | Target residual stress-defect level |
| `riskMax` | Maximum allowed shape-risk index |

---

## 6. Presets

The simulator includes three process-oriented presets.

### UDC / Thin Glass

For display cover glass or under-display camera aperture structures.

Typical characteristics:

- smaller pitch
- smaller heated zone
- lower allowed shape-risk
- lower residual stress target

### GCS / TGV

For glass core substrates and through-glass-via structures.

Typical characteristics:

- larger pitch
- stronger initial stress
- deeper drilling geometry
- higher thermal budget

### Conservative Search

For cautious exploration where shape preservation is prioritized over aggressive stress relaxation.

---

## 7. Physical Interpretation

The project is based on the analogy:

| Liquid Crystal System | Laser-Processed Glass System |
|---|---|
| Director field | Slow-axis vector field |
| Disclination | Stress-field singularity |
| Defect core | Residual stress hotspot |
| Defect annihilation | Stress relaxation / stress-defect annihilation |
| Polarized optical texture | Retardation / birefringence map |

In laser-processed glass, the slow-axis map can be interpreted as a vector field associated with principal stress orientation. Regions where the vector field converges, diverges, or changes abruptly can act as mechanical instability points and potential crack precursors.

This simulator assumes that selective annealing can reduce these stress singularities by activating local structural relaxation in the glass network.

---

## 8. Suggested Experimental Validation

The simulator is intended to guide experiments, not replace them.

Recommended validation flow:

1. **Measure initial stress**
   - Use Mueller matrix polarimetry or retardation imaging.
   - Extract \(R_0\), slow-axis orientation, and stress hotspot geometry.

2. **Apply selective laser annealing**
   - Tune annealing temperature, dwell time, and beam size.
   - Avoid reaching conditions that cause shape deformation, via collapse, or surface damage.

3. **Re-measure residual retardation**
   - Compare \(R_{\text{final}}\) with the predicted residual value.
   - Calculate stress reduction.

4. **Validate structural relaxation**
   - Raman spectroscopy for Si–O network relaxation.
   - Brillouin light scattering for elastic/phonon velocity changes.
   - Cross-section microscopy for geometry preservation.

5. **Correlate with crack yield**
   - Compare predicted low-risk windows with actual crack occurrence after downstream processing.

---

## 9. How to Use

Open the simulator file in a browser:

```bash
open simulator-v2.html
```

or, if hosted with GitHub Pages, visit:

```text
https://waterfirst.github.io/stress-defect-annihilation/simulator-v2.html
```

Adjust the sliders and observe:

- whether residual stress falls below the target
- whether shape-risk remains acceptable
- which temperature/time window is recommended

---

## 10. Output Metrics

| Metric | Meaning |
|---|---|
| `S_final` | Predicted residual stress-defect level |
| `Stress reduction` | Fractional reduction of stress relative to \(S_0\) |
| `R_final` | Predicted residual retardation |
| `Shape-risk` | Phenomenological risk of unwanted shape or geometry change |
| `Annihilation number` | Dimensionless indicator of relaxation strength |

A useful process condition should satisfy:

\[
S_{\text{final}} \leq S_{\text{target}}
\]

and

\[
\text{shape-risk} \leq \text{riskMax}
\]

---

## 11. Important Disclaimer

This simulator is a **hypothesis-driven exploratory model**.

It is not yet a fully validated physical simulator. The equations are phenomenological and designed to help generate experimental hypotheses and process-window intuition.

Before using the output for real manufacturing decisions, the parameters must be calibrated with experimental data such as:

- measured retardation maps
- actual crack yield
- glass composition
- laser wavelength and pulse profile
- thermal diffusion geometry
- annealing temperature distribution
- post-process mechanical reliability

---

## 12. Research Value

This project proposes a shift in laser glass processing quality control:

### Conventional approach

> Inspect the final hole and reject cracked samples.

### Retardation-based predictive approach

> Detect stress-induced retardation before visible cracking.

### Stress-defect annihilation approach

> Detect the stress hotspot, predict its relaxation window, and selectively anneal it before crack formation.

This creates a possible path toward:

- predictive crack prevention
- local stress engineering
- glass core substrate yield improvement
- UDC aperture reliability improvement
- process-aware laser annealing recipes

---

## 13. Repository Contents

Suggested structure:

```text
stress-defect-annihilation/
├── README.md
├── index.html
├── simulator-v2.html
├── paper.html
├── paper.pdf
└── assets/
```

---

## 14. Future Work

Planned improvements:

- Import real retardation map data.
- Fit \(S_0\), \(S_{\text{floor}}\), and \(k_{\text{eff}}\) from experiments.
- Add 2D stress-field simulation.
- Add slow-axis vector and singularity tracking.
- Add crack-risk prediction map.
- Add multi-step annealing recipes.
- Compare CO₂ laser, IR laser, and furnace annealing cases.
- Export recommended annealing conditions as CSV.

---

## 15. Citation / Related Work

This simulator is conceptually connected to research on:

- stress-induced birefringence in laser-processed glass
- photoelastic retardation measurement
- Bessel beam laser drilling
- under-display camera glass processing
- glass core substrate and TGV fabrication
- liquid crystal defect topology
- local laser annealing and glass structural relaxation

---

## 16. License

Use an appropriate license for your intended release.

Suggested options:

- MIT License for open software
- CC BY 4.0 for explanatory figures and documentation
- Private/internal license if used for unpublished manufacturing process development
