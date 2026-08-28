# Photoelastic retardance around picosecond Bessel-beam-drilled glass

This repository contains the manuscript and reproducibility package for the study **“Depth-dependent photoelastic retardance around picosecond Bessel-beam-drilled glass and a calibration-ready reduced-order model.”**

**Authors:** Nakcho Choi and Jeongjin Park

**Target journal:** *Optics & Laser Technology*, Full Length Article

## Journal package

- [Editable manuscript](submission/olt/manuscript_OLT.docx)
- [Review PDF](submission/olt/manuscript_OLT.pdf)
- [Manuscript source](submission/olt/manuscript_source.md)
- [Highlights](submission/olt/HIGHLIGHTS.txt)
- [Supplementary code and data](submission/olt/OLT_Supplementary_Code_and_Data.zip)
- [Separate figure files](submission/olt/figures/)

The manuscript is 12 A4 pages and contains eight figures, two tables, a 234-word abstract, six keywords, four journal-compliant highlights, and 28 cited references.

## Claim boundaries

The experimental record supports a descriptive comparison across 18 drilling conditions. The 400-µm target depth produced the largest representative retardance peak among the three tested depths at both pitches; it is not presented as a continuous optimum. Retardance remains an optical observable because a composition-specific stress-optic calibration is unavailable. Slow-axis maps and the retained crack image are treated as qualitative correspondence rather than a validated crack predictor or a topological-defect measurement.

The reduced-order model is dimensionless and is not fitted to the static depth series. It tests the sensitivity of field relaxation to mobility footprint and scalar polarity without assigning an absolute process time or claiming defect annihilation.

## Reproduce and validate

Python 3.10 or newer is recommended.

```bash
python research/test_reduced_order_model.py
python scripts/build_olt_documents.py
python scripts/validate_olt_submission.py
```

The tests verify finite initial fields, monotonic quadratic-field decay, polarity-control separation, and grid convergence. The submission validator checks the abstract, keywords, highlights, reference coverage, author metadata, figure count, and table count.

## Repository layout

```text
research/
  reduced_order_model.py
  test_reduced_order_model.py
scripts/
  build_olt_documents.py
  export_docx_pdf.ps1
  validate_olt_submission.py
submission/olt/
  manuscript_OLT.docx
  manuscript_OLT.pdf
  manuscript_source.md
  HIGHLIGHTS.txt
  figures/
  supplement/
  OLT_Supplementary_Code_and_Data.zip
```

## Legacy simulator

The existing [3D simulator](https://waterfirst.github.io/stress-defect-annihilation/) and [2D visualization](https://waterfirst.github.io/stress-defect-annihilation/annihilation_2d.html) are exploratory interfaces created before the journal revision. Their topological and phonon-assisted language is not experimental evidence and is not used as a claim in the OLT manuscript.
