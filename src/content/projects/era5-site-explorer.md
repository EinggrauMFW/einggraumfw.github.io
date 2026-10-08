---
title: "ERA5 Site Explorer"
status: "Verified"
statusNote: "v0.1.1; numerics tested on synthetic data, one real-file check; not a resource assessment"
summary: "Local web app: download ERA5 wave data for a site from Copernicus CDS and analyse it at any grid node."
updated: 2026-10-08
order: 1
repo: "https://github.com/EinggrauMFW/ERA5-Site-Explorer"
release:
  tag: "v0.1.1"
  date: 2026-10-05
  url: "https://github.com/EinggrauMFW/ERA5-Site-Explorer/releases/tag/v0.1.1"
doi: "10.5281/zenodo.23129942"
languages: ["Python", "JavaScript", "HTML", "CSS"]
licence: "MIT"
commit:
  sha: "b19ff375c6deb02ab18585f643e2a087d11d296d"
  url: "https://github.com/EinggrauMFW/ERA5-Site-Explorer/commit/b19ff375c6deb02ab18585f643e2a087d11d296d"
verification:
  - "725 automated tests (75 drive the page in headless Chromium), run by GitHub Actions on Ubuntu and Windows, Python 3.12 and 3.13."
  - "Hm0, Tm01 and Tm02 from 2D spectra match wavespectra (tail=False) to 1e-6."
  - "On the WaveSpectrum-ERA-5 example file the app gives mean Hm0 1.299 m, max 1.956 m, mean Tp 14.04 s, matching that repository's published result."
  - "Peaks-over-threshold fit recovers the parameters and return levels of a synthetic 30-year record with a known GPD tail."
openItems:
  - "Option B (2D spectra) has no completed real download."
  - "Option A and Option B have not been compared on real data."
  - "No multi-year record has been analysed; no buoy validation."
  - "COV, MVI and SVI are not checked against a published definition."
  - "Device assessment checked only on hand-computed and synthetic power matrices."
---

## Problem

Screening a site for wave energy starts with a long record of sea states at that site. ERA5, the ECMWF
reanalysis, has one for every ocean grid node since 1940, but getting it out of the Copernicus Climate Data
Store (CDS) and into a defensible set of numbers takes many small steps, each easy to get wrong: which
period is the energy period, which way directions point, how the flux is averaged, which grid node stands
for the site.

## Method

A Flask and MapLibre app that runs on my own machine. I pick a site on a map; the app downloads ERA5 for a
box around it and analyses any grid node in that box: energy flux, climatology, Hm0–Te scatter tables, wave
roses, swell and wind-sea composition, site screening across nodes, device performance from a power
matrix, extreme values, and a report export.[^readme]

Two data routes are kept apart and never merged:

- **Option A:** ERA5 single-level integrated parameters (`swh`, `mwp`, `pp1d`, ...).
- **Option B:** the 2D wave spectra; every parameter is derived from E(f, θ).

A cross-check panel compares the two.

Definitions are fixed once and used everywhere. Te is `mwp` = Tm-1 = m-1/m0, the ECMWF definition
(Bidlot, ECMWF 2020, §3.2). Deep-water flux is J = ρg²/(64π) · Hm0² · Te = 0.4906 · Hm0² · Te kW/m with
ρ = 1025 kg/m³ and g = 9.81 m/s², computed per record and then averaged, never from mean Hm0 and mean Te.
The ordering Tm02 ≤ Tm01 ≤ Te is checked on every record.[^defs]

<details open>
<summary><h2>Verification</h2></summary>

| Check | Against | Result | Source |
|---|---|---|---|
| Test suite, 725 tests (75 in headless Chromium) | Hand-derived values on synthetic inputs | Pass in CI on Ubuntu and Windows, Python 3.12 and 3.13 (last three runs on `main`, 2026-10-05) | [^ci] |
| Spectral Hm0, Tm01, Tm02 | `wavespectra` with `tail=False` | Agree to 1e-6 | [^ver20] |
| Real ERA5 spectra file (April 2020, 6°N 95°E) | Published result of WaveSpectrum-ERA-5 | Mean Hm0 1.299 m, max 1.956 m, mean Tp 14.04 s; matches | [^ver24] |
| Flux coefficient 0.4906 kW/(m·s·m²) | ECMWF wave parameter definitions, eq. 6 | Same expression and constants | [^ver14] |
| Peaks-over-threshold with a GPD fit | Synthetic 30-year record with a known GPD tail, 3 bootstrap seeds | Recovers the generating parameters and analytic return levels | [^ver40] |
| Real CDS downloads, Option A | CDS service | Completed: 2025 single levels, under one year | [^readme15] |

</details>

## Results

The screenshots below come from one Option A job: ERA5 single levels, hourly, 2025 (0.93 years, 8,184
records), near −8.75°, 119.28° (Komodo–Flores area). The nearest ocean node is 36.4 km from the site. The
record is far shorter than the 10 years the app asks for, so these numbers show the interface and are not
a resource estimate.[^shots]

<figure><img src="/figures/era5-site-explorer-analysis.jpg" alt="Wave analysis panel: record of 0.93 years, mean Hm0 0.96 m, mean Te 9.20 s, mean Tp 13.0 s, mean deep-water flux 4.43 kW/m, with a warning that the record is a demonstration" width="1200" height="930" loading="lazy"><figcaption>Analysis overview for the demonstration job: key numbers, the short-record warning and flux percentiles. Contains modified Copernicus Climate Change Service information (2025).</figcaption></figure>

<figure><img src="/figures/era5-site-explorer-scatter-rose.jpg" alt="Hm0 versus Te scatter table in percent of records, 0.5 m by 1 s bins, and a wave rose by share of hours and share of energy" width="1200" height="930" loading="lazy"><figcaption>Hm0–Te scatter (share of records, %) and the wave rose by hours and by energy for the same job. Contains modified Copernicus Climate Change Service information (2025).</figcaption></figure>

<figure><video controls preload="none" playsinline width="1200" height="675" poster="/media/era5-site-explorer-demo-poster.jpg" aria-describedby="demo-desc"><source src="/media/era5-site-explorer-demo.mp4" type="video/mp4"><a href="/media/era5-site-explorer-demo.mp4">Download the demo video (MP4, 5.2 MB)</a></video><figcaption id="demo-desc">Demo video, 22 s, with music and no narration. It shows the same demonstration job: a site is picked on the map, the 16 ERA5 grid nodes around it appear, the key numbers (mean Hm0 0.96 m, Te 9.20 s, Tp 13.0 s, flux 4.43 kW/m) come up with the app's short-record warning, then the screening, scatter, device (synthetic example matrix) and monthly climatology panels.</figcaption></figure>

<details open>
<summary><h2>Limitations and open items</h2></summary>

- Option B (2D spectra) has no completed real job: CDS refused five requests as too large, one was
  cancelled, and one was marked failed after an app restart.[^readme]
- Option A and Option B have not been compared on real data. No multi-year record has been analysed.
- ERA5 is a reanalysis, not a measurement, and there is no buoy validation. The wave model grid (about
  0.36°) does not resolve the nearshore; a coastal site is represented by an offshore cell.[^limits]
- Spectra stop at 0.548 Hz with no tail, so spectral Hm0 is expected slightly below `swh`.
- COV, MVI and SVI are implemented as stated in the tool and not checked against a published definition.
- The device assessment is verified only with hand-computed and synthetic power matrices. Whether a real
  matrix is indexed by Te or Tp is reported as a range, not resolved.[^ver41]
- 20 open items in total are listed in `docs/verification.md`.[^ver]
- The app's own wording: treat results as a screening aid, not a resource assessment.

</details>

## How to run

Needs a CDS account and a `~/.cdsapirc` token file (see the README). Developed on Python 3.13, Windows 11.

```bash
git clone https://github.com/EinggrauMFW/ERA5-Site-Explorer.git
cd ERA5-Site-Explorer
python -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/python app.py
```

Then open `http://127.0.0.1:5000`. Tests: `pip install -r requirements-dev.txt` and `python -m pytest -q`.

[^readme]: [README.md](https://github.com/EinggrauMFW/ERA5-Site-Explorer/blob/b19ff375c6deb02ab18585f643e2a087d11d296d/README.md), lines 5–21.
[^defs]: [README.md](https://github.com/EinggrauMFW/ERA5-Site-Explorer/blob/b19ff375c6deb02ab18585f643e2a087d11d296d/README.md), lines 196–217.
[^ci]: [GitHub Actions, CI workflow](https://github.com/EinggrauMFW/ERA5-Site-Explorer/actions/workflows/ci.yml); test count from `CHANGELOG.md` and `pytest --collect-only`.
[^ver20]: [docs/verification.md](https://github.com/EinggrauMFW/ERA5-Site-Explorer/blob/b19ff375c6deb02ab18585f643e2a087d11d296d/docs/verification.md), line 20.
[^ver24]: [docs/verification.md](https://github.com/EinggrauMFW/ERA5-Site-Explorer/blob/b19ff375c6deb02ab18585f643e2a087d11d296d/docs/verification.md), line 24 (run on 2026-10-01).
[^ver14]: [docs/verification.md](https://github.com/EinggrauMFW/ERA5-Site-Explorer/blob/b19ff375c6deb02ab18585f643e2a087d11d296d/docs/verification.md), line 14.
[^ver40]: [docs/verification.md](https://github.com/EinggrauMFW/ERA5-Site-Explorer/blob/b19ff375c6deb02ab18585f643e2a087d11d296d/docs/verification.md), line 40.
[^readme15]: [README.md](https://github.com/EinggrauMFW/ERA5-Site-Explorer/blob/b19ff375c6deb02ab18585f643e2a087d11d296d/README.md), lines 15–16.
[^shots]: [README.md](https://github.com/EinggrauMFW/ERA5-Site-Explorer/blob/b19ff375c6deb02ab18585f643e2a087d11d296d/README.md), lines 25–32.
[^limits]: [README.md](https://github.com/EinggrauMFW/ERA5-Site-Explorer/blob/b19ff375c6deb02ab18585f643e2a087d11d296d/README.md), lines 335–346.
[^ver41]: [docs/verification.md](https://github.com/EinggrauMFW/ERA5-Site-Explorer/blob/b19ff375c6deb02ab18585f643e2a087d11d296d/docs/verification.md), lines 41 and 46.
[^ver]: [docs/verification.md](https://github.com/EinggrauMFW/ERA5-Site-Explorer/blob/b19ff375c6deb02ab18585f643e2a087d11d296d/docs/verification.md), lines 26–47.
