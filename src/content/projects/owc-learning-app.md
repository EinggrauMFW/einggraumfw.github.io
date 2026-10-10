---
title: "OWC learning app"
status: "In progress"
statusNote: "checks pass; no validation against measurements, and the direct literature comparison is still open"
summary: "An interactive app for learning oscillating water column hydrodynamics: a verified piston toy model and a 3D wall-OWC model after Zheng, Zhang & Iglesias (2019), with irregular waves and annual energy."
updated: 2026-10-10
order: 9
repo: "https://github.com/EinggrauMFW/owc-learning-app"
languages: ["Python"]
licence: "MIT"
release:
  tag: "v0.1.0"
  date: 2026-10-10
  url: "https://github.com/EinggrauMFW/owc-learning-app/releases/tag/v0.1.0"
commit:
  sha: "119f704fad1c03546caff3684a59aac1427b0369"
  url: "https://github.com/EinggrauMFW/owc-learning-app/commit/119f704fad1c03546caff3684a59aac1427b0369"
verification:
  - "Toy model: every formula derived with SymPy; an independent time-domain simulation matches the power to about 1e-12."
  - "Wall model: three methods for the radiation damping agree to 1.2e-3, and the gap shrinks 5-6x when the truncation doubles."
  - "Wall model reproduces the paper's PTO resonances at kh 1.861 and 2.911 (paper: 1.86, 2.90)."
  - "Wall model converges to the exact long-wave limit at a reflecting wall, error about 2e-4 at kh 0.025."
  - "66 tests pass in a fresh clone with the pinned environment."
openItems:
  - "No validation against measurements."
  - "Thin-wall comparison with Martins-Rivas & Mei (2009) is indirect (values read from a replot); the direct check needs the original paper."
  - "The paper's truncation is accurate to about 1-3%, not to the 1e-4 I aimed for."
  - "Annual energy uses offshore ERA5 sea states with no wave transformation to the device."
---

## Problem

I wanted to understand the one equation behind oscillating water column (OWC) papers, the chamber balance [(c + cPTO) − i(a + aPTO)] p = Qe, well enough to trust a number from it. A formula on paper does not show what each term does, or where a model stops being valid.[^summary]

## Method

The app has two models, never mixed:[^summary]

- **A piston toy model:** a water column moving like a piston, a compressible air chamber and a linear turbine, for an isolated device. It is for learning, not design.
- **A 3D wall model:** linear potential flow solved by eigen-function matching, for an OWC half-embedded in a vertical wall, after Zheng, Zhang & Iglesias (2019). I transcribed the equations from the paper's page images and re-derived the appendix linear system term by term. That found one typo: Eqs. 33-34 print Z₀(z) where Z₀(0) is meant.[^reportb]

Around them:
- a step-by-step Learn tab with an animated chamber and a phasor diagram;
- interactive charts;
- exercises;
- a Site & annual energy tab, which uses JONSWAP spectra and the Sipora 2022 ERA5-derived scatter table from my [thesis](/projects/sipora-thesis);
- a Physics checks tab that re-runs a time-domain check at any operating point.

<details open>
<summary><h2>Verification</h2></summary>

| Check | Against | Result | Source |
|---|---|---|---|
| Toy model formulas | Derivation from the governing equations (SymPy) | All identities hold | [^verif] |
| Toy model numbers | Independent time-domain simulation, 9 operating points | Power agrees to about 1e-12; energy balances to about 1e-12 | [^verif] |
| Wall model, radiation damping | Three methods (direct, far-field, Haskind) | Agree to 1.2e-3; the gap shrinks 5-6x as the truncation doubles | [^reportb] |
| Wall model, the paper's features | Zheng et al. (2019), Marine Structures | PTO resonances at kh 1.861 and 2.911 (paper 1.86, 2.90); Qe peak at kh 1.742 (paper 1.73) | [^reportb] |
| Wall model, energy bound | Bound derived from the Haskind relation with a wall | Never exceeded; direction average 2.000 | [^reportb] |
| Wall model, long waves | Exact long-wave limit at a reflecting wall | Converges like (kR)², error about 2e-4 at kh 0.025 | [^lit] |
| Wall model, thin wall | Martins-Rivas & Mei (2009) as replotted in Zheng et al. (2019) JFM, Fig. 4, read by eye | Main peak of c 7.96 vs 7.89; sloshing spike shifted about +0.07 in kh | [^rung3] |
| Test suite | Fresh clone, pinned environment | 66 tests pass | run 2026-10-10 |

</details>

## Results

- **The toy's damping is about half the physical value.** Its damping ratio of 0.30 is about half the value implied by the Froude-Krylov force plus the Haskind relation: 0.54 at the natural frequency, 0.63 at the resonance. An optional frequency-dependent damping mode in the app gives the physical long-wave behaviour.[^verif]
- **Annual energy at Sipora** (2022 swell sector, 5,194 hours, 10 m depth, best fixed turbine setting):[^summary]
  - toy model with constant damping: 229 MWh;
  - toy model with frequency-dependent damping: 57 MWh;
  - wall model: 114 MWh.
- **What the comparison shows.** The constant-damping toy overestimates long-period swell. The wall model gives about twice the physically scaled isolated estimate, which is what wall reflection predicts; the geometries differ, so this is an observation, not a proof. These are absorbed energies, not electricity.

<details open>
<summary><h2>Limitations and open items</h2></summary>

- Not yet validated against measurements: I found no dataset of capture width against kh for a wall-embedded circular OWC.[^lit]
- The thin-wall literature comparison is indirect. The values were read by eye from a replot, and the direct check needs Martins-Rivas & Mei (2009).[^rung3]
- The paper's truncation (M = 12, L = 20) is accurate to about 1-3%, not to the 1e-4 I aimed for. Convergence is slowest near the sloshing mode.[^reportb]
- Linear, lossless and regular-wave based. The wall is ideal and perfectly reflecting, and the optimal turbine setting per frequency is an upper bound.[^summary]
- Annual energy applies offshore ERA5 sea states at the device with no wave transformation, assumes long-crested waves, and covers only the swell-sector hours.[^data]
- The literature check judged support from abstracts; most full texts were not read.[^lit]

</details>

## How it was built

I built it with AI coding assistance. Claude Opus planned the work, wrote the physics text and derivations, and reviewed and re-ran every check. Claude Haiku and Sonnet subagents wrote code in batches.[^summary]

## How to run

```bash
git clone https://github.com/EinggrauMFW/owc-learning-app.git
cd owc-learning-app
python -m venv .venv
.venv/Scripts/python -m pip install -r requirements.txt
.venv/Scripts/python -m streamlit run app.py
```

On Linux or macOS, use `.venv/bin/python`. Python 3.13.

[^summary]: [SUMMARY_REPORT.md](https://github.com/EinggrauMFW/owc-learning-app/blob/119f704fad1c03546caff3684a59aac1427b0369/SUMMARY_REPORT.md).
[^reportb]: [REPORT_B.md](https://github.com/EinggrauMFW/owc-learning-app/blob/119f704fad1c03546caff3684a59aac1427b0369/REPORT_B.md), rung table and equation log.
[^verif]: [VERIFICATION.md](https://github.com/EinggrauMFW/owc-learning-app/blob/119f704fad1c03546caff3684a59aac1427b0369/VERIFICATION.md), sections 2-4.
[^lit]: [LITERATURE.md](https://github.com/EinggrauMFW/owc-learning-app/blob/119f704fad1c03546caff3684a59aac1427b0369/LITERATURE.md), "Validation done in this repository" and "What is still missing".
[^rung3]: [docs/rungs/rung3_indirect.md](https://github.com/EinggrauMFW/owc-learning-app/blob/119f704fad1c03546caff3684a59aac1427b0369/docs/rungs/rung3_indirect.md).
[^data]: [data/README.md](https://github.com/EinggrauMFW/owc-learning-app/blob/119f704fad1c03546caff3684a59aac1427b0369/data/README.md).
