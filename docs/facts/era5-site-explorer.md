# Facts: ERA5 Site Explorer

Checked 2026-10-08 against `main` @ `b19ff375c6deb02ab18585f643e2a087d11d296d` (2026-10-05).
Repo: https://github.com/EinggrauMFW/ERA5-Site-Explorer. Sources: `README.md` (R), `docs/verification.md` (V),
`CHANGELOG.md` (C), `CITATION.cff` (CFF), `gh` API (G).

| # | Fact | Source |
|---|---|---|
| 1 | Local web app: pick a site on a map, download ERA5 wave data from Copernicus CDS, analyse it at any grid node: energy flux, climatology, scatter tables, wave roses, spectral partitioning, site screening, device performance, extreme values, report export. | R:5-7 |
| 2 | Two routes kept separate: Option A = ERA5 single-level integrated parameters; Option B = 2D spectra, every parameter derived from E(f, θ). A cross-check panel compares them, never merges them. | R:9-11 |
| 3 | Stack: Python (Flask), JavaScript, MapLibre, OpenFreeMap basemap (no token). | R:11, R:361-367, G languages |
| 4 | Licence MIT (code only). | R:391-394, G |
| 5 | Releases: v0.1.0 2026-10-04 (first tagged), v0.1.1 2026-10-05 (latest). v0.1.1 fixed form fields sent as text, which broke page-started downloads in 0.1.0. | C, G |
| 6 | DOI 10.5281/zenodo.23129942; author "Winawan, Faris". | R:3, CFF |
| 7 | 725 tests, 75 drive the page in headless Chromium (Playwright); `pytest --collect-only` collects 725. | R:14, C, collection run 2026-10-08 |
| 8 | CI: GitHub Actions on Ubuntu and Windows, Python 3.12 and 3.13, plus a Chromium job that fails instead of skipping; last 3 runs on main succeeded (2026-10-05). | R:380-389, G `gh run list` |
| 9 | Deep-water flux J = ρg²/(64π)·Hm0²·Te = 0.4906·Hm0²·Te kW/m, ρ = 1025 kg/m³, g = 9.81 m/s², computed per record then averaged. Source: ECMWF wave parameters doc (Bidlot 2020) eq. 6. | R:212-217, V:14 |
| 10 | Te = mwp = Tm-1 = m-1/m0, per Bidlot (ECMWF, 2020) §3.2; ordering Tm02 ≤ Tm01 ≤ Te checked on every record. | R:201-210, V:11 |
| 11 | Hm0, Tm01, Tm02 match `wavespectra(tail=False)` to 1e-6 (tested). | V:20 |
| 12 | Real-file check: on WaveSpectrum-ERA-5 `output.nc` (April 2020, 6°N 95°E) the app gives mean Hm0 1.299 m, max 1.956 m, mean Tp 14.04 s, matching that repo's README. Run 2026-10-01. | V:24 |
| 13 | Extremes: POT/GPD recovers the parameters and analytic return levels of a synthetic process with a known GPD tail (30 years, 3 bootstrap seeds). | V:40 |
| 14 | Option A has completed real CDS downloads (2025 single levels, under one year). | R:15-16, V:34 |
| 15 | Option B has no completed real job (5 refused as too large, 1 cancelled, 1 marked failed after a restart). | R:16-18, V:34 |
| 16 | Option A vs B not compared on real data; no multi-year record analysed. | R:18, V:35 |
| 17 | Limits: ERA5 is a reanalysis, not a measurement; no buoy validation; ~0.36° model grid does not resolve the nearshore; spectra stop at 0.548 Hz, no tail. | R:337-341 |
| 18 | COV, MVI, SVI not checked against a published definition (MVI/SVI per Kamranzad et al. 2016; its cited sources not read). | R:345-346, V:39 |
| 19 | Device assessment verified only on hand-computed and synthetic matrices; no real device; Te/Tp axis ambiguity reported, not resolved. | V:41, V:46 |
| 20 | Status line from the README: "Treat results as a screening aid, not a resource assessment." | R:21 |
| 21 | Screenshots: 14 JPGs in `docs/screenshots/`, from one Option A job (2025, 0.93 years, 8,184 records, near −8.75°, 119.28°, Komodo–Flores); nearest ocean node 36.4 km from the site; device views use a synthetic example matrix; illustrate the interface, not a resource estimate. | R:25-32 |
| 22 | Demo video (`public/media/era5-site-explorer-demo.mp4`), 22 s, 1920×1080, 5.16 MB, music, no narration; same Option A demo job (Komodo–Flores, 16 nodes, Hm0 0.96 m, Te 9.20 s, Tp 13.0 s, 4.43 kW/m), shows the short-record warning, device panel labelled synthetic example matrix. Hosted on the site at `/media/` (Faris pointed to it, 2026-10-08). | `brag-plan.md`, stills inspected 2026-10-08 |
| 23 | Run: `pip install -r requirements.txt`, `python app.py`, open http://127.0.0.1:5000. Needs `~/.cdsapirc` (CDS token). Developed on Python 3.13, Windows 11. | R:63-88 |
| 24 | 20 unresolved items listed in `docs/verification.md`. | V:26-47 |

Not verified: Zenodo DOI resolution (check in WP7); local test pass (only collection + CI).
