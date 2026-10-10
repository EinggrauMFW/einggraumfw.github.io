# Facts: OWC learning app

Checked 2026-10-10 against `main` @ `8f9ae15c0cb6d3c9d71927a474da19e0a1029e36` (README test count updated to 66 in that commit).
Repo: https://github.com/EinggrauMFW/owc-learning-app (public, created 2026-10-10).

**Sources** (all files at that commit):
- README.md (R)
- SUMMARY_REPORT.md (S)
- REPORT.md (A)
- REPORT_B.md (B)
- VERIFICATION.md (V)
- LITERATURE.md (L)
- docs/rungs/rung3_indirect.md (R3)
- data/README.md (D)
- the `gh` API (G)
- a local test run (T)

| # | Fact | Source |
|---|---|---|
| 1 | Interactive local Streamlit app for learning oscillating water column (OWC) hydrodynamics. It has two independent models that are never mixed: a piston toy model (isolated device) and a 3D linear potential-flow model of an OWC half-embedded in a vertical wall, after Zheng, Zhang & Iglesias (2019), Marine Structures 66:121-135. | S §1 |
| 2 | Tabs: Learn step by step (8 steps, chamber animation, phasor diagram of the chamber equation, dispersion plot), Model, Site & annual energy, Exercises, Glossary, Physics checks. All charts are interactive. | S §1; R |
| 3 | Toy model: every formula derived from its governing equations with SymPy, and an independent time-domain simulation reproduces the frequency-domain power to about 1e-12 at 9 operating points. Every public function passes a pint dimensional check. | V §2-3 |
| 4 | Wall model: the equations were transcribed from the paper's page images, the appendix linear system was re-derived term by term, and a typo in Eqs. 33-34 (Z0(z) for Z0(0)) was found. | B "Equation log"; S §3 |
| 5 | Rung 1: three independent methods for the radiation damping (direct, far-field, Haskind) agree to 1.2e-3 at the paper's truncation (M = 12, L = 20), and the gap shrinks 5-6x when the truncation doubles. | B rung table |
| 6 | Rung 2: converges, but the original 1e-4 target was not reached; the paper's truncation is accurate to about 1-3%, slowest near the sloshing mode. | B rung table |
| 7 | Rung 4: the paper's PTO resonances are reproduced at kh 1.861 and 2.911 (paper: 1.86, 2.90); main Qe peak at kh 1.742 (paper: 1.73). | B rung 4 table |
| 8 | Rung 5: eta never exceeds its per-direction bound with the wall; the direction-averaged bound is 2.000. | B rung table |
| 9 | Long-wave limit at a reflecting wall: the wall model converges to the exact limit for both Qe and c, with error falling like (kR)^2 down to about 2e-4 at kh 0.025. | L "Validation done in this repository"; S §4 |
| 10 | Indirect rung 3, thin wall against Martins-Rivas & Mei (2009) as replotted in Zheng et al. (2019) JFM Fig. 4, read by eye: main-mode peak of c 7.96 vs 7.89; the narrow sloshing spike is shifted by about +0.07 in kh. The direct comparison needs the original paper. | R3; B rung 3 |
| 11 | Finding: the toy's damping ratio 0.30 is about half the value implied by the Froude-Krylov force plus the Haskind relation (0.54 at the natural frequency, 0.63 at the PTO resonance). An optional frequency-dependent damping mode gives the physical long-wave scaling c ~ w^3. | V §4; S §2b |
| 12 | Site & annual energy for the Sipora 2022 ERA5-derived scatter table, thesis direction sector, 5,194 hours, h = 10 m, best fixed turbine setting: toy constant damping 229 MWh; toy frequency-dependent damping 57 MWh; wall model 114 MWh. Assumptions shown in the app: no wave transformation from the ERA5 deep-water node, long-crested waves, absorbed (not electrical) energy. | S §2b; D |
| 13 | Literature: 38 references from Crossref and OpenAlex (every DOI checked), mapped to 11 theory claims; support is judged from abstracts, since full texts were mostly not read. | L |
| 14 | No validation against measurements: no dataset was found that reports capture width against kh for a wall-embedded circular OWC. | L "What is still missing"; S §7 |
| 15 | Tests: 66 passing (pytest, no network); a fresh clone with the pinned environment passes all of them. | T 2026-10-10 (fresh single-branch clone of main) |
| 16 | Licence MIT (GitHub detects MIT); third-party data and sources in NOTICE; ERA5 under CC BY 4.0 with attribution in data/README.md. | G license.spdx_id = MIT; NOTICE; D |
| 17 | Built with AI coding assistance: Claude Opus planned, wrote the physics text and derivations, and reviewed and re-ran every check; Claude Haiku and Sonnet subagents wrote code in batches. | S §9 "How it was built" |
| 18 | Language: Python; requires Python 3.13. | G; R "Licence and data" |
