# Facts: refcollector

Checked 2026-10-08 against `main` @ `13771b410a5e720c15a52b15d61828dbb42cc11d` (2026-09-30).
Repo: https://github.com/EinggrauMFW/refcollector. Source: `README.md` (R), local clone, `gh` API (G).

| # | Fact | Source |
|---|---|---|
| 1 | Takes a thesis or paper PDF, extracts the reference list, resolves full metadata per entry, downloads open-access PDFs, lists paywalled ones with a drafted request email. | R intro |
| 2 | Runs locally: CLI (`refcollector.py`) and a FastAPI web app on 127.0.0.1:8000. Python 3.10+. | R, R "Project layout" |
| 3 | Resolution: DOI → Crossref, DataCite, doi.org; otherwise title search on Crossref, OpenAlex, Semantic Scholar; URL-only entries kept as web-source records. | R "What it does" 2 |
| 4 | Each match checked field by field (title, year, authors); doubtful ones flagged *review* with the reason. | R "What it does" 3 |
| 5 | Open-access PDFs via Unpaywall, OpenAlex, Semantic Scholar. Exports BibTeX, CSL JSON, CSV, JSON, paywalled list with email drafts. Does not send emails. | R "What it does" 4-5 |
| 6 | Tests: `tests/test_matching.py` is a plain script with offline checks of matching and exports (20 `check()` asserts, not pytest); two batch scripts measure extraction and resolution on a folder of PDFs (network). | R "Tests", local `tests/` |
| 7 | Limits: open access only (Sci-Hub deliberately not supported); grey literature mostly has no DOI; extraction depends on PDF layout; matching is heuristic. | R "Limitations" |
| 8 | User email stored locally in git-ignored `webapp/data/config.json`, sent only to Unpaywall/OpenAlex/Crossref. | R "Your email address" |
| 9 | No LICENSE file; no releases; no CI. Languages: Python, HTML. | G |

Not verified: extraction/resolution rates on real PDFs (batch logs exist locally, not read; no number quoted).
