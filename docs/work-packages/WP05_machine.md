# WP05: machine-readable layer, output check, drift check

Site origin: `https://einggraumfw.github.io` (`Astro.site`). Projects come from the `projects` content
collection (schema in `src/content.config.ts`; `entry.id` is the slug). Node 22, ES modules, no new
dependencies (Node stdlib only for scripts).

## A. Static endpoints (Astro, `src/pages/`)

All are prerendered `GET` endpoints returning `new Response(body, { headers: { "Content-Type": ... } })`.
Projects are always sorted by `data.order` ascending.

### `projects.json.ts` → `/projects.json` (`application/json; charset=utf-8`)

```json
{
  "site": "https://einggraumfw.github.io/",
  "author": "Faris Winawan",
  "generated": "YYYY-MM-DD",
  "projects": [
    {
      "slug": "era5-site-explorer",
      "title": "...",
      "status": "Verified | In progress | Planned",
      "statusNote": "...",
      "summary": "...",
      "url": "https://einggraumfw.github.io/projects/<slug>/",
      "markdown": "https://einggraumfw.github.io/projects/<slug>.md",
      "repo": "https://github.com/... or null",
      "sourcePublic": true,
      "release": { "tag": "v0.1.1", "date": "YYYY-MM-DD", "url": "..." } or null,
      "doi": "... or null",
      "commit": "<full sha> or null",
      "languages": ["..."],
      "licence": "... or null",
      "verification": ["..."],
      "openItems": ["..."],
      "lastVerified": "YYYY-MM-DD"
    }
  ]
}
```

`generated` is the build date. `lastVerified` is `data.updated`. Pretty-print with 2 spaces.

### `llms.txt.ts` → `/llms.txt` (`text/plain; charset=utf-8`)

Follows the llms.txt convention exactly in this shape:

```
# Faris Winawan

> Ocean engineering graduate (ITB, Indonesia) doing independent research in wave energy. Research direction: field-data-informed hydrodynamics of self-reacting, weathervaning wave energy converters.

Each project page states its status (Verified, In progress or Planned), what was checked and against what, and its open items. Structured data: https://einggraumfw.github.io/projects.json

## Projects

- [<title>](https://einggraumfw.github.io/projects/<slug>.md): <status>. <summary>
  (one line per project, in order)

## Optional

- [About](https://einggraumfw.github.io/about/): background
- [Contact](https://einggraumfw.github.io/contact/): email, GitHub, LinkedIn
```

### `projects/[slug].md.ts` → `/projects/<slug>.md` (`text/markdown; charset=utf-8`)

`getStaticPaths` over the collection. Body:

```
# <title>

Status: <status> (<statusNote>). Last checked <YYYY-MM-DD>.

<summary>

Repository: <repo>            (line only if repo)
Release: <tag> (<date>) <url> (line only if release)
DOI: https://doi.org/<doi>    (line only if doi)
Canonical page: https://einggraumfw.github.io/projects/<slug>/

<entry.body, the raw Markdown body of the content file, unchanged>
```

### `sitemap.xml.ts` → `/sitemap.xml` (`application/xml; charset=utf-8`)

Standard `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` with one `<url><loc>` for `/`,
`/about/`, `/contact/` and every `/projects/<slug>/`. Project URLs also get `<lastmod>` = `updated`.

## B. `scripts/check-output.mjs`

Exports `checkOutput(distDir)` → `string[]` of error messages (empty = pass). When run directly
(`node scripts/check-output.mjs [distDir]`, default `dist`) prints each error and exits 1 if any, else prints
`check-output: ok (<n> projects)` and exits 0.

Checks, each failure one message naming the file:

1. `projects.json` exists, parses, has `site`, `generated` and a non-empty `projects` array.
2. Every project has: non-empty strings `slug`, `title`, `summary`, `statusNote`; `status` in
   {`Verified`, `In progress`, `Planned`}; `url` = `<site>projects/<slug>/`; `markdown` =
   `<site>projects/<slug>.md`; `lastVerified` matching `^\d{4}-\d{2}-\d{2}$`; `languages`, `verification`,
   `openItems` arrays of strings; `repo` null or a string starting `https://`; `release` null or an object
   with string `tag`, `date` (YYYY-MM-DD), `url`. Slugs are unique.
3. A project with status `Planned` has an empty `verification` array.
4. For every project: `projects/<slug>.md` exists and its first line is `# <title>`; `projects/<slug>/index.html`
   exists.
5. `llms.txt` exists, its first line is `# ` + a name, it has a line starting `> `, a line `## Projects`, and
   for every project a line containing `](<markdown url>)`.
6. `sitemap.xml` exists and contains `<loc>` entries for `<site>`, `<site>about/`, `<site>contact/` and every
   project `url`.
7. No file under `distDir` with extension `.html`, `.md`, `.txt`, `.json` or `.xml` contains the string
   `TODO(verify)`.

## C. `scripts/drift.mjs`

Detects when a project page has gone stale relative to its GitHub repository.

Exports:

- `compare(site, remote)` → `string[]` drift messages, pure (no I/O).
  - `site`: one project object as in `projects.json`.
  - `remote`: `{ latestRelease: string | null, headSha: string | null, readme: string }`.
  - Rules:
    1. Release: if `remote.latestRelease !== (site.release?.tag ?? null)` →
       `"<slug>: release on site <site tag or none>, repo <remote tag or none>"`.
    2. Commit: if `site.commit` and `remote.headSha` and they differ →
       `"<slug>: page checked at <first 7 of site.commit>, repo head is <first 7 of headSha>"`.
    3. Test count: let `siteCount` = the first integer N (commas allowed, e.g. `1,024`) in
       `site.verification` matching `/(\d[\d,]*) (?:automated )?tests\b/`, and `repoCount` the first
       N matching `/(\d[\d,]*) tests\b/` in `remote.readme`. If both exist and differ →
       `"<slug>: <siteCount> tests on site, <repoCount> in README"`. If only one exists, no message.
- `fetchRemote(repoUrl)` → `Promise<remote>` using the `gh` CLI via `node:child_process` `execFile`:
  `gh api repos/<owner>/<name>/releases/latest --jq .tag_name` (a 404 means `null`),
  `gh api repos/<owner>/<name>/commits/HEAD --jq .sha`,
  `gh api repos/<owner>/<name>/readme -H "Accept: application/vnd.github.raw"`.

CLI (`node scripts/drift.mjs [distDir]`, default `dist`): read `<distDir>/projects.json`; for every project
with a non-null `repo` on github.com, fetch and compare; print each message; print
`drift: none (<n> repos checked)` when clean. Exit 1 if any drift, 2 on a fetch error (message names the
repo).

Detect "run directly" with `import.meta.url === pathToFileURL(process.argv[1]).href` so the modules can be
imported by tests without side effects.

## D. Tests (written first, by someone else; do not edit)

`scripts/check-output.test.mjs` and `scripts/drift.test.mjs`, run with `node --test "scripts/*.test.mjs"`.
