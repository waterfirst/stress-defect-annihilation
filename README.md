# Phonon-Assisted Topological Stress-Defect Annihilation in Laser-Drilled Glass

[![GitHub Pages](https://img.shields.io/badge/Demo-Live-brightgreen)](https://waterfirst.github.io/stress-defect-annihilation/)

## Interactive Simulator

**[▶ Launch Simulator](https://waterfirst.github.io/stress-defect-annihilation/)**

An interactive web-based simulator for phonon-assisted stress-defect annihilation dynamics in laser-drilled glass substrates (TGVs).

### Features
- Real-time parameter tuning with sliders
- 4 interactive plots: stress decay, birefringence map, phonon rate, annihilation time
- Dark/Light theme toggle
- English/Korean language toggle
- Based on the theoretical framework in the companion paper

### Physics
This simulator implements the governing equation:

$$\frac{\partial S_\sigma}{\partial t} = D_{th}\nabla^2 S_\sigma - \Gamma_{ph}(T,S_\sigma)\cdot S_\sigma + \frac{F_{el}}{l^2\eta(T)}$$

where the phonon-mediated relaxation rate is:

$$\Gamma_{ph}(T, S_\sigma) = \nu_D \exp\left(-\frac{E_a}{k_B T}\right)\cdot\left[1 - S_\sigma^2\left(\frac{T}{T_g}\right)\right]$$

### Paper
- **PDF**: [paper.pdf](paper.pdf)
- **HTML**: [paper.html](paper.html)
- **Target**: SID Display Week 2027 / Journal of Display Technology

### Applications
1. **HBM Glass Core Substrates** — TGV stress relief for semiconductor packaging
2. **Foldable Display UTG/HTG** — Stress mitigation at fold zones
3. **Architectural Glass** — Tempered glass quality control
4. **Optical Components** — Precision birefringence control

### Author
**Nakcho Choi** — Samsung Display Co., Ltd.
- SID Display Week 2026 Poster P-99: "Stress-Induced Birefringence Measurement for Crack Detection in Bessel Beam Laser-Drilled Glass"

### References
1. S. Chono, T. Tsuji, *Open J. Fluid Dyn.*, 8, 343-360 (2018) — LC defect annihilation
2. N. Choi et al., *SID Display Week 2026*, P-99 — Stress birefringence measurement
