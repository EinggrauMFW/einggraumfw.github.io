---
title: "refcollector"
status: "In progress"
statusNote: "offline checks only; no measured extraction or resolution rate"
summary: "Extracts a paper's reference list, resolves full metadata, downloads open-access PDFs and drafts requests for the rest."
updated: 2026-10-08
order: 3
repo: "https://github.com/EinggrauMFW/refcollector"
languages: ["Python", "HTML"]
licence: "none (no licence file)"
commit:
  sha: "13771b410a5e720c15a52b15d61828dbb42cc11d"
  url: "https://github.com/EinggrauMFW/refcollector/commit/13771b410a5e720c15a52b15d61828dbb42cc11d"
verification:
  - "Offline script tests/test_matching.py checks matching and exports with 20 assertions."
  - "Every metadata match is checked field by field (title, year, authors); doubtful ones are flagged for review with the reason."
openItems:
  - "Extraction and resolution rates on real PDFs are not measured and published."
  - "Tests are a plain script, not a test framework; no CI."
  - "No licence file."
---

## Problem

A literature review starts from the reference lists of the theses and papers I already have. Copying each
entry into a reference manager by hand, finding its DOI and fetching the open-access copy is slow, and a
wrong match is easy to miss.

## Method

Give it a PDF; it runs locally as a command-line script or a small FastAPI web app on port 8000.[^readme]

1. Finds the References or Bibliography heading and splits the entries (numbered and author-year styles).
2. Resolves each entry: a DOI goes to Crossref, then DataCite, then doi.org; otherwise a title search on
   Crossref, OpenAlex and Semantic Scholar. Entries with only a URL are kept as web sources.
3. Checks every match field by field (title, year, authors) and marks doubtful ones *review* with the
   reason, so a wrong match is visible instead of silent.
4. Downloads open-access PDFs via Unpaywall, OpenAlex and Semantic Scholar.
5. Exports BibTeX, CSL JSON (Zotero), CSV and JSON, plus a list of paywalled papers with a drafted request
   email for each. It does not send email.

<details open>
<summary><h2>Verification</h2></summary>

| Check | Against | Result | Source |
|---|---|---|---|
| Matching and export logic | 20 assertions on fixed inputs in `tests/test_matching.py` (offline) | Script present; run with `python tests/test_matching.py` | [^tests] |
| Extraction and resolution on real PDFs | Batch scripts `tests/batch_extract.py`, `tests/batch_resolve.py` | Scripts exist; no rate is published here | [^tests] |

</details>

<details open>
<summary><h2>Limitations and open items</h2></summary>

- Open access only. Paywalled papers are listed with a drafted email; sources such as Sci-Hub are
  deliberately not supported.[^limits]
- Grey literature (reports, standards, theses) mostly has no DOI and stays a web source or unresolved.
- Extraction depends on the PDF layout: two-column layouts, unusual headings or one list per chapter can
  merge, split or miss entries.
- Matching is heuristic: trust *high*, check *review*.
- No measured extraction or resolution rate yet; no CI; no licence file.

</details>

## How to run

Python 3.10 or newer. Unpaywall, OpenAlex and Crossref ask for a real contact email, which the tool stores
only on your machine.

```bash
git clone https://github.com/EinggrauMFW/refcollector.git
cd refcollector
pip install -r requirements.txt
python refcollector.py paper.pdf --email you@your-domain --out output
```

Or `python webapp/app.py` and open `http://127.0.0.1:8000`.

[^readme]: [README.md](https://github.com/EinggrauMFW/refcollector/blob/13771b410a5e720c15a52b15d61828dbb42cc11d/README.md), "What it does".
[^tests]: [README.md](https://github.com/EinggrauMFW/refcollector/blob/13771b410a5e720c15a52b15d61828dbb42cc11d/README.md), "Tests"; [tests/](https://github.com/EinggrauMFW/refcollector/tree/13771b410a5e720c15a52b15d61828dbb42cc11d/tests).
[^limits]: [README.md](https://github.com/EinggrauMFW/refcollector/blob/13771b410a5e720c15a52b15d61828dbb42cc11d/README.md), "Limitations".
