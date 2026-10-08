---
title: "WaveSpectrum-ERA-5"
status: "Verified"
statusNote: "example result reproduced independently; no automated tests"
summary: "Scripts and notebooks that retrieve ERA5 2D wave spectra from CDS and reduce them to wave statistics."
updated: 2026-10-08
order: 2
repo: "https://github.com/EinggrauMFW/WaveSpectrum-ERA-5"
languages: ["Python", "Jupyter Notebook"]
licence: "none (no licence file)"
commit:
  sha: "ef94253c4ccd1dfea0db11b146a67223a6811736"
  url: "https://github.com/EinggrauMFW/WaveSpectrum-ERA-5/commit/ef94253c4ccd1dfea0db11b146a67223a6811736"
verification:
  - "Published example result (April 2020, nearest 6°N 95°E): Hs mean 1.30 m, max 1.96 m, Tp mean about 14.0 s."
  - "ERA5 Site Explorer's own code on the same file gives mean Hm0 1.299 m, max 1.956 m, mean Tp 14.04 s."
openItems:
  - "No automated tests and no CI."
  - "No licence file, so reuse terms are not stated."
  - "One example month only; no multi-year analysis."
---

## Problem

ERA5's 2D wave spectra (parameter 251.140) sit in the ECMWF MARS archive, not in the usual single-level
dataset. They come back as log10 densities, and in NetCDF the frequency and direction axes arrive as bin
indices. Before any statistic can be computed, the request and the decoding have to be right.

## Method

The repository holds the whole path from the CDS request to numbers:[^readme]

- `cdsapidata_retrieval.py`: an annotated `cdsapi` guide with the 2D spectra request, helpers that rebuild
  the axes (directions 7.5 + 15n degrees, frequencies 0.03453 · 1.1ⁿ Hz) and convert log10 values back to
  spectral density.
- `wavespectra.ipynb`: gridded statistics with `wavespectra`, a 2D spectrum plot, and a comparison of the
  peak-Hs and a calm sea state.
- `onesitewavestatistic.ipynb`: picks the grid point nearest a site and computes Hs, Tp, Tm01, Tm02, Dpm,
  Dspr, Dp, Dm and γ, exported to CSV.
- `output.nc`: the example data (about 7.7 MB): `reanalysis-era5-complete`, stream `wave`, April 2020,
  6-hourly (120 steps), 0–6°N × 95–100°E on a 0.5° grid (13 × 11 points), 24 directions × 30 frequencies
  (0.0345–0.548 Hz).

<details open>
<summary><h2>Verification</h2></summary>

| Check | Against | Result | Source |
|---|---|---|---|
| Example statistics at the grid point nearest 6°N 95°E | Independent implementation in ERA5 Site Explorer, same file | Hs mean 1.30 m vs 1.299 m; max 1.96 m vs 1.956 m; Tp mean about 14.0 s vs 14.04 s | [^result] [^cross] |

</details>

## Results

At the grid point nearest 6°N 95°E, April 2020: Hs mean 1.30 m (min 0.92 m, max 1.96 m); Tp mean about
14.0 s (min 11.4 s, long-period swell). The highest Hs occurred at 2020-04-12 12:00 UTC.[^result]

<details open>
<summary><h2>Limitations and open items</h2></summary>

- No automated tests and no CI; the check above is a single cross-check on one file.
- No licence file in the repository, so reuse terms are not stated.
- One example month. Nothing here describes a site's climate.
- The guide script runs three CDS requests in sequence if run whole; MARS requests are slow; `expver` 1
  (final) and 5 (preliminary) can mix near the present.[^readme]

</details>

## How to run

Needs a CDS account and `~/.cdsapirc`. The notebooks run on the committed `output.nc` without downloading.

```bash
git clone https://github.com/EinggrauMFW/WaveSpectrum-ERA-5.git
cd WaveSpectrum-ERA-5
pip install cdsapi xarray netCDF4 numpy pandas matplotlib dask wavespectra cartopy
jupyter notebook onesitewavestatistic.ipynb
```

[^readme]: [README.md](https://github.com/EinggrauMFW/WaveSpectrum-ERA-5/blob/ef94253c4ccd1dfea0db11b146a67223a6811736/README.md), "Repository contents", "Example dataset" and the notes on `cdsapidata_retrieval.py`.
[^result]: [README.md](https://github.com/EinggrauMFW/WaveSpectrum-ERA-5/blob/ef94253c4ccd1dfea0db11b146a67223a6811736/README.md), "Result for the example dataset".
[^cross]: [ERA5 Site Explorer, docs/verification.md](https://github.com/EinggrauMFW/ERA5-Site-Explorer/blob/b19ff375c6deb02ab18585f643e2a087d11d296d/docs/verification.md), line 24 (run on 2026-10-01).
