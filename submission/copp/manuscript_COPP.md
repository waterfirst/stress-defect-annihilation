# Depth-dependent photoelastic retardance around picosecond Bessel-beam-drilled glass and a calibration-ready reduced-order model

Nakcho Choi*, Jeongjin Park

Mobile Display Division, Samsung Display Co., Ltd., Giheung-gu, Yongin 17113, Republic of Korea

*Corresponding author: water.choi@samsung.com

## Abstract

Residual optical anisotropy around laser-drilled holes can reveal process states before macroscopic cracking, but retardance, slow-axis orientation, and mechanical stress are not interchangeable observables. This study combines a factorial drilling screen with a bounded reduced-order model. Approximately 500-µm-thick glass was processed by a 1064-nm picosecond Bessel-beam system under 18 conditions: three categorical pulse-energy settings, two pitches (10 and 20 µm), and three target depths (300, 400, and 500 µm). Mueller-matrix polarimetry was acquired at 450, 550, and 650 nm; condition comparisons use 550-nm retardance. Retardance increased with categorical pulse energy. At both pitches, the 400-µm condition produced the largest representative line-profile peak among the three depths, identifying an observed maximum at 80% of nominal thickness rather than a continuous optimum. Slow-axis maps contained organized textures, and one fractured specimen showed qualitative spatial correspondence between the mapped field and crack path; no predictive accuracy is claimed. A dimensionless diffusion-relaxation model of a fixed-axis deviatoric-stress proxy then tested whether opposite scalar polarity creates rapid cancellation. The verified calculation showed that increasing normalized mobility radius reduced the exposure for a 90% decrease in quadratic field content by about 4.5 times, whereas opposite polarity did not accelerate that threshold. The results support calibrated retardance mapping as a screening observable while rejecting uncalibrated stress conversion, topological-defect language, and absolute relaxation times.

**Keywords:** Bessel beam; glass drilling; photoelasticity; retardance; residual stress; nondestructive inspection

**OCIS codes:** (140.3390) Laser materials processing; (160.2750) Glass and other amorphous materials; (260.1440) Birefringence; (260.5430) Polarization; (120.5410) Polarimetry.


## 1. Introduction

Ultrashort-pulse Bessel beams provide an elongated interaction region that is attractive for high-aspect-ratio processing of transparent materials [1,2]. Compared with a conventional Gaussian focus, the extended central lobe can produce a modification along a substantial fraction of the substrate thickness, enabling volumetric scribing, drilling, and separation of thin glass. The same localization that makes the process efficient also produces steep transient gradients, pressure loading, structural modification, and residual stress. Their balance depends on pulse energy, spatial overlap, beam shape, and the depth over which energy is deposited [3–7]. Residual fields are therefore not a secondary cosmetic issue: they can reduce strength, redirect a fracture, and complicate subsequent display or semiconductor packaging operations, including later thermal evolution in through-glass-via structures [24].

Direct mechanical interrogation of a micrometre-scale laser modification is difficult. In transparent glass, photoelasticity offers a nondestructive full-field alternative. The measured retardance is a path-integrated optical response to anisotropy; under restricted conditions and with a calibrated stress-optic coefficient it can be related to a principal-stress difference [8,9]. Digital and integrated photoelasticity nevertheless remain inverse problems. Retardance depends on wavelength, material composition, optical path length, principal-axis variation through the thickness, phase unwrapping, and the measurement configuration [8–12]. Consequently, a colour map reported in nanometres is not automatically an absolute stress map in megapascals. The slow-axis direction supplies complementary orientation information, but it is a director field rather than a crack vector.

Previous laser-cleaving studies have shown that photoelastic fields evolve with the moving thermal load and that a crack can be studied through its surrounding birefringence [10,11]. Related glass-processing work links scanning order and accumulated laser exposure to asymmetric residual fields and fracture [5,6]. Those results motivate in-line optical screening, but they do not establish a universal threshold. Material-specific stress-optic calibration and repeated fracture outcomes are required before retardance can be converted into a failure probability.

The original experimental study underlying this work screened Bessel-beam drilling conditions by pulse energy, pitch, and target depth. It reported two visually compelling observations: the strongest representative retardance occurred at a partial depth, and local slow-axis textures appeared related to a subsequent crack path. Both observations are useful, but the first was previously described as a broad optimum and the second through an analogy with liquid-crystal disclinations. Those interpretations exceeded the surviving evidence. Only three depths were tested, and no director-winding calculation, charge-conservation test, or repeated crack-prediction experiment was performed.

The present work rebuilds that dataset as a professional, claim-bounded study and combines it with a dimensionless reduced-order calculation. The experimental part asks two descriptive questions: how do retardance maps vary with categorical pulse energy, and which of the three tested depths produces the largest representative signal at each pitch? The computational part asks a separate mechanistic-control question: if two mapped fixed-axis stress components have opposite scalar signs, does linear smoothing and relaxation necessarily cause a uniquely fast “annihilation” pathway? This separation prevents the model from being presented as a fit to data that cannot identify its rate coefficients.

The contribution is threefold. First, the complete 18-condition matrix is organized around the retained optical observable rather than an uncalibrated stress value. Second, slow-axis and crack images are reported as qualitative correspondence, with topological labels removed. Third, a verified dimensionless model identifies the mobility footprint, rather than scalar polarity alone, as the dominant coordinate in the tested 90% field-reduction metric. Together, the experiment and calculation define what current polarimetry can screen and what a follow-up time-resolved study must calibrate.

## 2. Materials and methods

### 2.1 Glass specimens and Bessel-beam drilling

The substrate was an approximately 500-µm-thick glass sheet intended for display and glass-core-substrate process development. The retained project record did not include a composition certificate; the material is therefore described generically as glass, and no soda-lime or fused-silica stress-optic coefficient is assigned to it. Laser processing used a 1064-nm picosecond source configured to form a Bessel-like elongated focus. Absolute pulse energy, pulse duration, repetition rate, scan speed, and axicon parameters were not preserved in the source package available for this manuscript. Pulse energy is consequently retained as the three instrument categories Low (1), Middle (2), and High (3), without implying equal physical increments.

The design crossed three energy categories with pitches of 10 and 20 µm and target depths of 300, 400, and 500 µm, yielding 18 conditions. The nominal depth fractions were 60%, 80%, and 100% of the approximate substrate thickness. The 500-µm condition produced a through-hole; 300- and 400-µm conditions were partial-depth modifications. Figure 1 reproduces the full specimen matrix and representative top and cross-sectional micrographs. The source record contains one mapped specimen per indexed condition and does not document independent replicate counts. Results are therefore descriptive and no inferential significance test is applied.

[FIGURE_1]

[TABLE_1]

### 2.2 Mueller-matrix polarimetry

Photoelastic measurements were acquired with an Axometrics AxoStep 20H Mueller-matrix polarimeter using liquid-crystal polarization optics. Maps were recorded at 450, 550, and 650 nm to check the persistence of the process-related spatial pattern across visible wavelengths. Subsequent comparisons use the instrument's total-retardance output at 550 nm, for which the retained set is most complete. The system also reports a local slow-axis orientation. No post hoc denoising, generative filling, or synthetic enlargement was applied to the scientific images used here; the displayed panels are the original instrument or microscopy exports placed on a neutral manuscript page.

For a homogeneous, weakly birefringent layer with constant principal axes along the optical path, a common scalar relation is

[EQ1]

where R is the measured retardance, C is the material- and wavelength-dependent stress-optic coefficient, σ1 − σ2 is the principal-stress difference, and d is the optical path length through the stressed region [8,9]. The drilled specimens do not establish all of these conditions. Composition-specific C, the stressed path length, and through-thickness axis rotation were not independently calibrated. Retardance is therefore reported in nanometres as the primary observable and is not converted to megapascals.

### 2.3 Extraction of descriptive observables

Energy dependence was evaluated from representative 550-nm maps at the through-hole, 20-µm-pitch condition (indices 1–3). Depth dependence was evaluated at the High energy category for pitch 20 µm (indices 3, 9, and 15) and pitch 10 µm (indices 6, 12, and 18). The retained figures contain line profiles through the mapped hole rows. Because the raw pixel arrays and region-of-interest definitions were not preserved, numerical peak values were not re-digitized from raster plots. The analysis uses only the ordinal relationships that are directly resolved: Low < Middle < High for the representative energy series and 400 µm > 500 µm > 300 µm for the representative depth series.

Slow-axis maps were inspected for organized textures near the holes and between adjacent holes. One available crack micrograph was compared with the corresponding mapped region. This is a case correspondence, not a training or validation set. We do not assign ±1/2 charges by visual resemblance. A valid topological classification would require an unwrapped director field, a closed-contour winding calculation, uncertainty propagation, and repeatable event tracking.

### 2.4 Reduced-order observable and geometry

The numerical model is not fitted to the depth series. It isolates a claim that arose from the orientation maps: whether opposite signed fields around neighbouring holes must relax faster than a same-polarity control. A double-angle optical representation, Q1 = R cos(2θ) and Q2 = R sin(2θ), can be formed from calibrated retardance and effective slow-axis angle without assigning an absolute stress. These quantities remain path-integrated optical proxies; reconstruction from the original raster panels is not attempted here. In a fixed laboratory frame, the corresponding in-plane deviatoric stress components can be represented by

[EQ2]

and

[EQ3]

The principal-stress difference and axis angle then follow as

[EQ4]

and

[EQ5]

respectively. The scalar calculation retains q = q1/qref under a symmetric condition in which q2 is small or as one calibrated projection of a reconstructed two-component field. A sign change in q1 can correspond to a 90° rotation of the principal axes; it is not a hydrostatic tension/compression label and is not a topological charge.

The via-centre spacing p sets the length scale. A square domain of side 6p contains two circular holes of radius 0.16p centred at x/p = −0.5 and +0.5. Each hole is surrounded by a regularized self-equilibrated basis field: a wall ring and a broader compensating halo with characteristic width a/p = 0.08. The field is zero inside each hole. Same- and opposite-polarity controls are normalized to the same peak magnitude. A prescribed dimensionless mobility field m(x,y) is the smooth union of two Gaussian activation kernels and is zero inside the holes. Its radius h/p is swept from 0.2 to 1.0.

### 2.5 Governing equation and nondimensional groups

During a prescribed relaxation hold, q evolves according to

[EQ6]

where Ds,max is an effective spatial mobility of the selected stress proxy, not the thermal diffusivity of glass, and τM is an effective local relaxation time. The mobility field confines both terms to a prescribed activated region. Equation (6) contains no laser-heating source, thermoelastic coupling, or structural-state evolution; it describes only the relaxation of an established field. A laser heat-transfer solution or coupled thermoelastic model [22,23] would be required to predict the mobility footprint from physical processing parameters.

With p, qref, and p²/Ds,max as length, field, and time scales,

[EQ7]

[EQ8]

and the dimensionless equation becomes

[EQ9]

Da compares first-order local relaxation with diffusion-like spatial smoothing. A physical time can be recovered only after Ds,max has been measured:

[EQ10]

The calculation therefore reports Fourier exposure rather than seconds.

### 2.6 Numerical method, metrics, and verification

Equation (9) is discretized on a cell-centred Cartesian grid using a conservative finite-volume divergence. Harmonic averaging defines face mobility and zero normal flux is imposed at the external boundaries and hole walls. Forward Euler integration uses ΔFo = 0.18(Δx/p)². Reference fields use 129 × 129 cells; parameter maps use 97 × 97 cells after verification.

The primary metric is normalized quadratic field content,

[EQ11]

where Ωs is the solid region. Cq is an L2 measure of the selected projected field, not elastic strain energy. Fo90 is the first interpolated exposure at which Cq/Cq(0) ≤ 0.1. For spatially uniform mobility and zero-flux boundaries, a cosine eigenmode has the exact amplitude

[EQ12]

where λ = kx² + ky². At Fo = 0.12 and Da = 0.5, the relative L2 error decreases from 3.41 × 10−4 on a 33 × 33 grid to 2.24 × 10−5 on the 129 × 129 reference grid. Automated tests also check finite initial fields, monotonic Cq, a resolved difference between polarity controls, and grid convergence.

[TABLE_2]

## 3. Results

### 3.1 Pulse-energy dependence of retardance

Figure 2 compares representative 550-nm retardance maps for Low, Middle, and High pulse-energy categories at 20-µm pitch and nominal through-hole depth. The low-energy row appears as a narrow, comparatively uniform band. The middle setting produces a stronger, spatially modulated response, and the high setting produces the strongest and most heterogeneous band. The retained line images therefore support the ordinal relationship Low < Middle < High for this condition. Because the instrument settings are categorical and the experiment does not include independent replicates, the result is not interpreted as a linear energy coefficient or a universal damage threshold.

[FIGURE_2]

The growth of retardance with processing intensity is consistent with stronger optical anisotropy arising from a combination of residual stress, densification, rarefaction, and other laser-induced structural changes [3–7,13]. The measurement alone does not separate those mechanisms. Multi-technique calibration is particularly important in glass because Raman and Brillouin responses can also depend on cooling history and structural state [13–15,26].

### 3.2 Non-monotonic response across the three tested depths

Figure 3 presents High-energy maps and line profiles for both pitches. For the 20-µm series, the representative 400-µm profile is higher than the 500- and 300-µm profiles. The same ordering is visible for the 10-µm series. Thus, the largest representative peak among the three tested depths occurs at 400 µm, corresponding to 80% of the nominal substrate thickness. This wording matters: the data do not identify a continuous optimum, a universal 75% depth, or a critical point with a confidence interval.

The 300-µm condition may deposit insufficient energy over the full optical path to produce the larger residual anisotropy seen at 400 µm. Conversely, completion of a through-hole at 500 µm changes the free-surface geometry, material-removal pathway, and stress release. Those mechanisms are plausible but are not separately resolved here. The appropriate conclusion is a non-monotonic response across three target depths, not a uniquely established failure mechanism.

The common ranking at 10 and 20 µm shows that the observed depth maximum is not restricted to one pitch in this screen. It does not establish that pitch is irrelevant. Hole overlap, cumulative heating, and the number of neighbouring modified zones can change both retardance amplitude and texture. A replicated factorial experiment with absolute energy and thermal-history records is required to estimate pitch-by-depth interaction.

[FIGURE_3]

### 3.3 Slow-axis texture around adjacent holes

Figure 4 shows six retained slow-axis maps spanning several process conditions. The field contains organized bands and local rotations around the hole row rather than spatially random orientations. Some patterns repeat near neighbouring holes, suggesting that the measured director field retains information about periodic processing and field overlap. The maps also contain fine alternating bands. Their origin cannot be assigned uniquely: pulse overlap, optical sampling, phase wrapping, or image-processing artefacts are all possible. We therefore treat the bands as an unresolved signature rather than a measured material periodicity.

[FIGURE_4]

Visual motifs in a director field can resemble liquid-crystal disclinations, but resemblance is not classification. A slow axis is equivalent under 180° rotation, and a charge estimate would require integrating its unwrapped orientation around a closed contour while excluding low-retardance regions where the axis is ill-defined. No such computation is available in the retained dataset. Terms such as “±1/2 defect” and “annihilation” are consequently omitted from the experimental result.

### 3.4 Qualitative crack-field correspondence

Figure 5 juxtaposes a slow-axis map, a microscope image of a crack between two adjacent holes, and a higher-resolution orientation map from the same project. The observed crack follows a curved path through the inter-hole region. Over part of that path, its local tangent is approximately transverse to the dominant nearby slow-axis segments. This is consistent with the expectation that a brittle crack responds to the local tensile-stress field, but the slow axis is not itself the principal tensile-stress direction without a complete optical inversion.

[FIGURE_5]

The figure is a single-example correspondence. It demonstrates why orientation maps merit further study, but it cannot support sensitivity, specificity, lead time, or a causal prediction claim. A validation study would register pre-fracture maps to post-fracture micrographs for multiple specimens, predefine an orientation-derived risk score, and evaluate the score against blinded crack outcomes.

### 3.5 Reduced-order field evolution

Figure 6 compares same- and opposite-polarity controls at equal colour scale for h/p = 0.55 and Da = 0.5. At Fo = 0.03, the normalized quadratic content is 4.05 × 10−2 for the opposite case and 3.08 × 10−2 for the same case. The opposite field therefore retains about 31% more content at the early exposure. By Fo = 0.30, the ordering has reversed: the opposite case retains 8.95 × 10−5 and the same case 1.58 × 10−4. Sufficient spatial broadening allows the opposite projected lobes to cancel in the very-low-amplitude tail.

[FIGURE_6]

The crossover is linear superposition, not a new microscopic reaction. Both controls use identical mobility and relaxation parameters, and Eq. (9) includes no pairwise force, defect core, or director charge. Opposite scalar polarity therefore does not establish a separate fast pathway.

### 3.6 Mobility radius dominates the 90% reduction threshold

Across h/p = 0.2–1.0 at Da = 0.5, opposite-polarity Fo90 decreases from 0.06845 to 0.01511, a factor of 4.53. The same-polarity value decreases from 0.06634 to 0.01440, a factor of 4.61. At every tested mobility radius, the opposite case reaches the 90% threshold slightly later than the same-polarity control; the delay is 3.18%–5.30%. Figure 7 separates this threshold behaviour from the long-exposure tail.

The engineering interpretation is narrow but useful. Within this model, how much of the mapped field lies inside an activated mobility footprint matters far more to early reduction than whether two selected lobes have opposite signs. The experiment does not identify h/p, Ds,max, or τM, so the calculation cannot explain the 400-µm maximum quantitatively. It instead rejects a shortcut: a visually opposite orientation pattern is not enough to infer rapid annihilation.

[FIGURE_7]

### 3.7 Verification, rate sensitivity, and conditional time scaling

Figure 8 reports grid verification, Damköhler sensitivity, and the conditional conversion from Fo to seconds. Increasing Da from 0 to 5 changes the reference opposite-polarity Fo90 from 0.01699 to 0.01534 and the same-polarity value from 0.01595 to 0.01465. In this selected field, mobility coverage has more leverage than the first-order rate term. That ordering is not asserted to hold for broader or experimentally reconstructed initial fields.

[FIGURE_8]

At p = 200 µm and Fo90 = 0.01712, illustrative Ds,max values of 10−10, 10−9, and 10−8 m² s−1 yield t90 values of 6.85, 0.685, and 0.0685 s. These scenarios span two decades and are not measurements. They show why assigning an absolute subsecond relaxation time before calibration is unjustified.

## 4. Discussion

### 4.1 What can be used for process screening now

The most defensible current screening output is a calibrated optical observable, not an inferred fracture probability. At fixed wavelength and instrument configuration, peak or integrated retardance can flag process states that depart from a validated baseline. In the present screen, the High-energy category and the 400-µm target depth produce the strongest representative responses. That combination should be treated as a candidate high-retardance condition for confirmation, not as a universal crack window. Reporting the categorical condition, wavelength, mapped area, and region-of-interest rule is essential for transfer to an in-line tool.

Slow-axis texture can add spatial context. A high retardance band with a coherent reorientation between holes may be more informative than peak retardance alone. However, orientation becomes unstable where retardance approaches the instrument noise floor, and the director is only defined modulo 180°. A production metric should mask low-confidence pixels, unwrap the director, and quantify gradients or alignment against a predefined path. It should then be validated on repeated outcomes rather than selected examples.

### 4.2 Relationship between experiment and model

The experimental depth series is a static comparison among different drilling endpoints. The model is a post-process relaxation equation with unmeasured mobility and rate coefficients. These are complementary but not interchangeable datasets. The static experiment establishes where a large retained retardance occurred; it does not provide a time series from which Ds,max or τM can be estimated. The model identifies dimensionless coordinates and a falsifiable polarity control; it does not reproduce the measured depth ranking.

A direct bridge requires time-resolved polarimetry. An isolated-hole experiment should first measure the broadening and amplitude decay of a reconstructed q1,q2 field during a controlled thermal hold. The spatial broadening can identify an effective mobility after the thermal footprint is known, while remaining amplitude decay constrains τM or a distribution of relaxation times. Those parameters should then be frozen and tested on paired holes at multiple pitches. Raman and Brillouin maps can independently test whether an apparent photoelastic reduction accompanies a structural or elastic change [13–15].

### 4.3 Physical limitations

The scalar equation does not enforce mechanical equilibrium or displacement compatibility, does not solve a temperature field, and does not represent the free surface created as a blind modification becomes a through-hole. Ds,max is a coarse-grained mobility of a measured projection, not a material diffusion coefficient. A single Maxwell time is also an approximation: glass relaxation depends on temperature and structural state and can require a spectrum of times or a Tool–Narayanaswamy-type description [16–21,25]. Atomistic vibration studies [27,28] likewise do not justify assigning a microscopic attempt frequency directly to the macroscopic relaxation term.

The optical limitations are equally important. Equation (1) is not used for stress conversion because composition-specific C, path length, and axis variation are unknown. The original maps are raster exports rather than raw Mueller matrices, preventing recalculation of uncertainty, phase unwrapping, or standardized regions of interest. Absolute laser parameters and independent specimen replicates are also absent. These deficits limit the present work to a structured exploratory study.

### 4.4 Required validation before a crack-detection claim

A journal-grade validation campaign should retain absolute laser energy, pulse duration, repetition rate, beam-shaping geometry, scan speed, and glass composition. At least three independent specimens per condition are needed for variance estimation, with more specimens for a predictive crack model. Retardance and slow-axis maps should be acquired before fracture and registered to blind post-process crack labels. A threshold or probabilistic model must be locked before evaluation on a held-out set. Only then can sensitivity, false-alarm rate, and process-window robustness be reported.

The current study provides the protocol and prevents three common overclaims. First, the maximum among 300, 400, and 500 µm is not a continuous optimum. Second, a slow-axis motif is not a topological defect without a winding calculation. Third, opposite scalar signs do not by themselves create a rapid relaxation mechanism. These corrections make the experimental observations more useful because they define what evidence must be added next.

## 5. Conclusions

A 1064-nm picosecond Bessel-beam drilling screen was reorganized around experimentally retained photoelastic observables. Representative 550-nm maps showed increasing retardance from Low to High categorical pulse energy. At both 10- and 20-µm pitch, the 400-µm target depth produced the largest representative line-profile peak among the three tested depths; this is an observed maximum at 80% of nominal thickness, not a universal optimum. Slow-axis maps contained organized inter-hole textures, and one crack image showed qualitative spatial correspondence, but the dataset does not establish predictive accuracy or topological charge.

The dimensionless reduced-order calculation supplied a separate mechanistic control. Expanding the normalized mobility radius reduced the 90% field-content exposure by about a factor of 4.5, whereas opposite scalar polarity did not accelerate that early threshold. Its smaller long-exposure tail arose from linear cancellation after spatial broadening. The combined study therefore supports retardance and director-field metrics as candidates for calibrated nondestructive screening while excluding uncalibrated MPa conversion, absolute process times, and defect-annihilation claims. Replicated specimens, raw Mueller data, absolute laser settings, and time-resolved calibration are required before the method can be presented as a crack predictor.

## Author Contributions

Nakcho Choi: Conceptualization, Methodology, Investigation, Formal analysis, Software, Visualization, Writing – original draft. Jeongjin Park: Investigation, Resources, Validation, Writing – review and editing.

## Funding

This work was supported by Samsung Display Co., Ltd.

## Disclosures

The authors are employees of Samsung Display Co., Ltd. The authors declare no other known financial interests or personal relationships that could have appeared to influence the work.

## Data Availability Statement

The processed numerical data and source code for the reduced-order calculation are included with the associated repository and submission package. The original instrument maps are reproduced in the manuscript from the authors' retained project files. Raw Mueller matrices, absolute laser settings, and specimen-level production records are not included in the available package and may be available from the corresponding author subject to company disclosure restrictions.

## Use of AI-Assisted Technologies

During preparation of this work, the authors used OpenAI Codex to assist with dimensional auditing, code implementation, literature verification, language editing, and document layout. No generative image system was used to create, fill, or alter the scientific data images. The authors reviewed and edited the resulting manuscript and take full responsibility for its content.

## References

[1] F. Courvoisier, R. Stoian, A. Couairon, Ultrafast laser micro- and nano-processing with nondiffracting and curved beams, Opt. Laser Technol. 80 (2016) 125–137. https://doi.org/10.1016/j.optlastec.2015.11.026.

[2] R. Stoian, M.K. Bhuyan, G. Zhang, G. Cheng, R. Meyer, F. Courvoisier, Ultrafast Bessel beams: advanced tools for laser materials processing, Adv. Opt. Technol. 7 (2018) 165–174. https://doi.org/10.1515/aot-2018-0009.

[3] J. Dudutis, J. Pipiras, R. Stonys, E. Daknys, A. Kilikevičius, A. Kasparaitis, G. Račiukaitis, P. Gečys, In-depth comparison of conventional glass cutting technologies with laser-based methods by volumetric scribing using Bessel beam and rear-side machining, Opt. Express 28 (2020) 32133–32151. https://doi.org/10.1364/OE.402567.

[4] Y. Ito, R. Shinomoto, K. Nagato, A. Otsu, K. Tatsukoshi, Y. Fukasawa, T. Kizaki, N. Sugita, M. Mitsuishi, Mechanisms of damage formation in glass in the process of femtosecond laser drilling, Appl. Phys. A 124 (2018) 181. https://doi.org/10.1007/s00339-018-1607-4.

[5] R. Shinomoto, Y. Ito, T. Kizaki, K. Tatsukoshi, Y. Fukasawa, K. Nagato, N. Sugita, M. Mitsuishi, Experimental analysis of glass drilling with ultrashort pulse lasers, Int. J. Autom. Technol. 10 (2016) 863–873. https://doi.org/10.20965/ijat.2016.p0863.

[6] Q. Sun, T. Lee, M. Beresna, G. Brambilla, Control of laser induced cumulative stress for efficient processing of fused silica, Sci. Rep. 10 (2020) 3819. https://doi.org/10.1038/s41598-020-60828-3.

[7] F. Zimmermann, M. Lancry, A. Plech, S. Richter, T. Ullsperger, B. Poumellec, A. Tünnermann, S. Nolte, Ultrashort pulse laser processing of silica at high repetition rates—from network change to residual strain, Int. J. Appl. Glass Sci. 8 (2017) 233–238. https://doi.org/10.1111/ijag.12221.

[8] H. Aben, L. Ainola, J. Anton, Integrated photoelasticity for nondestructive residual stress measurement in glass, Opt. Lasers Eng. 33 (2000) 49–64. https://doi.org/10.1016/S0143-8166(00)00018-X.

[9] L. Ainola, H. Aben, Approximate solution of the inverse problem of axisymmetric thermoelasticity for residual stress measurement in glass, J. Therm. Stresses 31 (2008) 165–175. https://doi.org/10.1080/01495730701521843.

[10] S. Iwatsuki, H. Hidai, A. Chiba, S. Matsusaka, N. Morita, Examination of internal stress by photoelasticity in laser cleaving of glass, Precis. Eng. 64 (2020) 122–128. https://doi.org/10.1016/j.precisioneng.2020.03.019.

[11] N. Zhao, H. Zhang, J. Lu, M. Tang, H. Zhang, Photoelasticity-based stress field analysis of glass under 1064 nm laser irradiation, Opt. Lasers Eng. 181 (2024) 108367. https://doi.org/10.1016/j.optlaseng.2024.108367.

[12] K. Ramesh, S. Sasikumar, Digital photoelasticity: recent developments and diverse applications, Opt. Lasers Eng. 135 (2020) 106186. https://doi.org/10.1016/j.optlaseng.2020.106186.

[13] N. Terakado, R. Sasaki, Y. Takahashi, T. Fujiwara, S. Orihara, Y. Orihara, A novel method for stress evaluation in chemically strengthened glass based on micro-Raman spectroscopy, Commun. Phys. 3 (2020) 37. https://doi.org/10.1038/s42005-020-0305-7.

[14] M. Bergler, K. Cvecek, F. Werr, A. Veber, J. Schreiner, U.R. Eckstein, K.G. Webber, M. Schmidt, D. de Ligny, Coupling Raman, Brillouin and Nd3+ photoluminescence spectroscopy to distinguish the effect of uniaxial stress from cooling rate on soda–lime silicate glass, Materials 14 (2021) 3584. https://doi.org/10.3390/ma14133584.

[15] M. Bergler, K. Cvecek, F. Werr, M. Brehl, D. de Ligny, M. Schmidt, Cooling rate calibration and mapping of ultra-short pulsed laser modifications in fused silica by Raman and Brillouin spectroscopy, Int. J. Extrem. Manuf. 2 (2020) 035001. https://doi.org/10.1088/2631-7990/ab9583.

[16] A.Q. Tool, Relation between inelastic deformability and thermal expansion of glass in its annealing range, J. Am. Ceram. Soc. 29 (1946) 240–253. https://doi.org/10.1111/j.1151-2916.1946.tb11592.x.

[17] R. Gardon, O.S. Narayanaswamy, Stress and volume relaxation in annealing flat glass, J. Am. Ceram. Soc. 53 (1970) 380–385. https://doi.org/10.1111/j.1151-2916.1970.tb12137.x.

[18] O.S. Narayanaswamy, A model of structural relaxation in glass, J. Am. Ceram. Soc. 54 (1971) 491–498. https://doi.org/10.1111/j.1151-2916.1971.tb12186.x.

[19] D.C. Larsen, J.J. Mills, J.L. Sievert, Stress relaxation behavior of soda-lime glass between the transformation and softening temperatures, J. Non-Cryst. Solids 14 (1974) 269–279. https://doi.org/10.1016/0022-3093(74)90035-0.

[20] J.P. van den Brink, Master stress relaxation function of silica glasses, J. Non-Cryst. Solids 196 (1996) 210–215. https://doi.org/10.1016/0022-3093(95)00588-9.

[21] J.C. Mauro, Y. Yue, A.J. Ellison, P.K. Gupta, D.C. Allan, Viscosity of glass-forming liquids, Proc. Natl. Acad. Sci. U.S.A. 106 (2009) 19780–19784. https://doi.org/10.1073/pnas.0911705106.

[22] M. Lax, Temperature rise induced by a laser beam, J. Appl. Phys. 48 (1977) 3919–3924. https://doi.org/10.1063/1.324265.

[23] A. Chiba, S. Matsusaka, H. Hidai, N. Morita, Study of thermal stress behavior of sheet glass during laser irradiation using one-dimensional elastic wave model, J. Adv. Mech. Des. Syst. Manuf. 8 (2014) JAMDSM0003. https://doi.org/10.1299/jamdsm.2014jamdsm0003.

[24] H. Wang, B. Ma, P. Liu, W. Tian, H. Liang, X. Zhang, H. Chen, G. Lu, X. Yang, Time and temperature dependence of residual stress evolution and protrusion behavior in through-glass vias, Microsyst. Nanoeng. 12 (2026) 52. https://doi.org/10.1038/s41378-026-01162-y.

[25] J.M.D. Lane, Cooling rate and stress relaxation in silica melts and glasses via microsecond molecular dynamics, Phys. Rev. E 92 (2015) 012320. https://doi.org/10.1103/PhysRevE.92.012320.

[26] B. Hehlen, A century of structural and vibrational spectroscopy in vitreous silica: a short review, Int. J. Appl. Glass Sci. 13 (2022) 370–387. https://doi.org/10.1111/ijag.16572.

[27] B. Bhattarai, D.A. Drabold, Vibrations in amorphous silica, J. Non-Cryst. Solids 439 (2016) 6–14. https://doi.org/10.1016/j.jnoncrysol.2016.02.002.

[28] C. Oligschleger, Dynamics of SiO2 glasses, Phys. Rev. B 60 (1999) 3182–3193. https://doi.org/10.1103/PhysRevB.60.3182.
