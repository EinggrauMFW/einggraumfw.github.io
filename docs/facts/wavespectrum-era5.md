# Facts: WaveSpectrum-ERA-5

Checked 2026-10-08 against `main` @ `ef94253c4ccd1dfea0db11b146a67223a6811736` (2026-10-01).
Repo: https://github.com/EinggrauMFW/WaveSpectrum-ERA-5. Source: `README.md` (R, via `gh api`), `gh` API (G).

| # | Fact | Source |
|---|---|---|
| 1 | Retrieves ERA5 2D wave spectra from CDS and reduces them to Hs, Tp, Tm01, Tm02, Dpm, Dspr with `wavespectra`. | R intro |
| 2 | Files: `cdsapidata_retrieval.py` (annotated cdsapi guide incl. 2D spectra request, axis rebuild, log10 → density), `wavespectra.ipynb` (gridded stats, spectrum plots), `onesitewavestatistic.ipynb` (nearest grid point, full parameter set, CSV export), `output.nc` (~7.7 MB example). | R "Repository contents", G |
| 3 | Example data: `reanalysis-era5-complete`, stream wave, param 251.140, expver 1, 2020-04-01..30, 6-hourly (120 steps), area [6, 95, 0, 100], 0.5° (13 × 11 points), 24 directions × 30 frequencies (0.0345–0.548 Hz). | R "Example dataset" |
| 4 | Result at the grid point nearest 6°N 95°E, April 2020: Hs mean 1.30 m, min 0.92 m, max 1.96 m; Tp mean about 14.0 s, min 11.4 s. | R "Result for the example dataset" |
| 5 | Independent check: ERA5 Site Explorer's own code on the same file gives mean Hm0 1.299 m, max 1.956 m, mean Tp 14.04 s (run 2026-10-01). | ERA5-Site-Explorer `docs/verification.md:24` |
| 6 | Caveats in README: running the guide script whole triggers three downloads; NetCDF loses real axes (rebuilt by helper); values stored as log10; MARS requests slow; expver 1 vs 5 can mix near the present. | R notes on `cdsapidata_retrieval.py` |
| 7 | No LICENSE file; no tests; no releases; no CI. | G (licence 404, no workflows, no tags) |
| 8 | Languages: Jupyter Notebook, Python. | G |
| 9 | ERA5 Site Explorer's fetcher design draws on these retrieval scripts. | ERA5-Site-Explorer `README.md:403` |
