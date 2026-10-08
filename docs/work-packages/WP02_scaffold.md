# WP02: Astro scaffold, layout, styles, pages

You work in this folder only (a git worktree). Create or edit files; do not run commands (the orchestrator
runs `npm install` and the build and will send you any errors). Read `CLAUDE.md` first: the honesty rules
and design rules there are binding.

**Copy rule:** do not write any text that makes a claim about Faris or a project. All page copy is given
below, verbatim. Use it exactly. Do not add taglines, adjectives, stats or placeholder bios.

## Files to create

```
package.json
astro.config.mjs
tsconfig.json
src/content.config.ts
src/content/projects/example.md      (fixture, replaced later by the orchestrator)
src/layouts/Base.astro
src/styles/site.css
src/pages/index.astro
src/pages/about.astro
src/pages/contact.astro
src/pages/404.astro
src/pages/projects/[slug].astro
public/site.js
public/robots.txt
```

`public/fonts/` already exists: `courier-prime-regular.woff`, `courier-prime-bold.woff`,
`courier-prime-italic.woff`, `OFL.txt`. Use them; do not add other fonts.

## package.json

```json
{
  "name": "portfolio",
  "private": true,
  "type": "module",
  "scripts": { "dev": "astro dev", "build": "astro build", "preview": "astro preview" },
  "dependencies": { "astro": "5.18.2" }
}
```

No other dependencies. `tsconfig.json`: `{ "extends": "astro/tsconfigs/strict", "include": [".astro/types.d.ts", "**/*"], "exclude": ["dist"] }`.

## astro.config.mjs

`site: "https://einggraumfw.github.io"`, `output: "static"`, `build: { format: "directory" }`. No integrations.

## Content collection (`src/content.config.ts`)

Astro 5 content layer: `defineCollection` with `glob({ pattern: "**/*.md", base: "./src/content/projects" })`
and this zod schema (`import { z } from "astro:content"`):

| Field | Type |
|---|---|
| `title` | string |
| `status` | enum `"Verified" \| "In progress" \| "Planned"` |
| `statusNote` | string (scope of the status) |
| `summary` | string (one line) |
| `updated` | `z.coerce.date()` (date this page was last checked) |
| `order` | number (index sort, ascending) |
| `repo` | string url, optional |
| `sourcePublic` | boolean, default `true` |
| `release` | optional object `{ tag: string, date: z.coerce.date(), url: string url }` |
| `doi` | string, optional |
| `languages` | string[], default `[]` |
| `licence` | string, optional |
| `commit` | optional object `{ sha: string, url: string url }` |
| `verification` | string[], default `[]` (one-line claims, used by projects.json) |
| `openItems` | string[], default `[]` |

`example.md`: valid frontmatter with `title: "Example"`, `status: "In progress"`, every other field filled with
obviously fake values (e.g. `summary: "Fixture page for the build; replaced before publishing."`). Body: the
section skeleton below with one line of lorem text each, one markdown table, one `[^1]` footnote.

Project body convention (the orchestrator writes real bodies like this; your CSS must style it):

```md
## Problem
...
## Method
...
<details open>
<summary><h2>Verification</h2></summary>

| Check | Against | Result | Source |
|---|---|---|---|
| ... | ... | ... | [^1] |

</details>

## Results
<figure><img src="/figures/x.jpg" alt="..." width="1200" height="800" loading="lazy"><figcaption>...</figcaption></figure>

<details open>
<summary><h2>Limitations and open items</h2></summary>

- ...

</details>

## How to run
```

## Layout (`src/layouts/Base.astro`)

Props: `title` (string), `description` (string), `path` (string, e.g. `/about/`), optional `jsonLd` (object or
array), optional `mdHref` (string). In `<head>`:

- charset, viewport, `<title>` = `${title} · Faris Winawan` (home page passes `title="Faris Winawan"` and the
  layout must not double it: if title equals "Faris Winawan" use it alone).
- `<meta name="description">`, `<link rel="canonical" href={new URL(path, Astro.site)}>`.
- Open Graph: `og:title`, `og:description`, `og:url` (canonical), `og:type` `website`, `og:site_name`
  `Faris Winawan`. No og:image.
- If `mdHref`: `<link rel="alternate" type="text/markdown" href={mdHref}>`.
- `<link rel="preload" href="/fonts/courier-prime-regular.woff" as="font" type="font/woff" crossorigin>`.
- Inline theme script, before the stylesheet, exactly:
  `<script is:inline>try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}</script>`
- `import "../styles/site.css"` in the frontmatter.
- If `jsonLd`: `<script type="application/ld+json" set:html={JSON.stringify(jsonLd)} />`.
- `<script src="/site.js" defer is:inline></script>`.

Body:

```
<a class="skip" href="#main">Skip to content</a>
<header>  site name "FARIS WINAWAN" linking to "/"
          <nav aria-label="Main">: Projects (/#projects) · About (/about/) · Contact (/contact/) · GitHub (https://github.com/EinggrauMFW)
          <button id="theme-toggle" type="button" hidden>   (site.js un-hides it)
<main id="main"> <slot/> </main>
<footer>  line 1: "Text and figures CC BY 4.0. Code MIT." with "Code" linking to https://github.com/EinggrauMFW/einggraumfw.github.io
          line 2: links: fariswinawan@proton.me (mailto) · GitHub · LinkedIn (https://www.linkedin.com/in/fariswinawan)
          line 3: "Machine-readable: /llms.txt · /projects.json" (both links)
```

Mark the current nav link with `aria-current="page"`.

## Styles (`src/styles/site.css`)

Typewriter minimalist. Tokens on `:root`, dark values twice: under
`@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { ... } }` and under
`:root[data-theme="dark"] { ... }`.

| Token | Light | Dark |
|---|---|---|
| `--paper` | `#f6f2e8` | `#161513` |
| `--ink` | `#1c1b19` | `#e8e2d4` |
| `--muted` | `#5b574e` | `#b3ac9c` |
| `--red` | `#a3191c` | `#ff7b6e` |
| `--rule` | `#8a8476` | `#6e695e` |

- `@font-face` for the three woff files, family `"Courier Prime"`, `font-display: swap`. Font stack
  `"Courier Prime", "Courier New", ui-monospace, monospace` everywhere. Set `color-scheme: light dark`.
- `body`: background `var(--paper)`, color `var(--ink)`, font-size `17px`, line-height `1.6`.
  Content column: `max-width: 66ch; margin: 0 auto; padding: 0 16px` (header, main and footer alike).
- Headings: same font, bold, `text-transform: uppercase; letter-spacing: .06em`. h1 1.6rem, h2 1.15rem,
  h3 1rem. No colour other than ink.
- Rules: `hr`, header bottom border, footer top border and table row borders are `1px dashed var(--rule)`.
  No cards, shadows, radii, gradients or background fills other than `--paper`.
- Links: `color: var(--red)`, underline `text-underline-offset: 3px`. Hover: thicker underline.
  `:focus-visible`: `outline: 2px dashed var(--red); outline-offset: 3px`.
- Buttons (`button`, `.filters button`): look like typed keys: transparent background, ink text,
  `1px solid var(--ink)`, padding `.1em .6em`, font inherit, cursor pointer. `:active` shifts `translateY(1px)`.
  `[aria-pressed="true"]`: background `var(--ink)`, color `var(--paper)`.
- Status label `.status`: monospace already; uppercase, `color: var(--red)`, wrapped in brackets via
  `::before { content: "[" }` / `::after { content: "]" }`.
- Tables: `width: 100%; border-collapse: collapse;` cells padded `.35em .5em .35em 0`, left aligned, top
  vertical-align, dashed bottom border, header row bold uppercase small (`.85rem`). Wrap wide tables:
  every `table` inside `main` must scroll horizontally on its own rather than widen the page (use
  `display: block; overflow-x: auto` on `table`).
- `details > summary`: `cursor: pointer; list-style: none;` show `[-] ` before an open summary and
  `[+] ` before a closed one (`summary::before`), `summary h2 { display: inline; }`, hide the default marker
  (`summary::-webkit-details-marker { display: none }`).
- Figures: `img { max-width: 100%; height: auto; border: 1px dashed var(--rule); }`, `figcaption` muted,
  `.9rem`. Margin `1.5em 0`.
- Footnotes (Astro's GFM output: `section.footnotes`, `sup a`): footnote section smaller (`.9rem`) and muted,
  above a dashed top border.
- `.skip`: visually hidden until focused.
- `.caret` (used by the typing effect): `display: inline-block; animation: blink 1s steps(1) infinite;`
  with `@keyframes blink { 50% { opacity: 0 } }`. Inside `@media (prefers-reduced-motion: reduce)` disable
  all animation and transitions.
- At `max-width: 480px`: body `16px`, nav wraps onto its own line.
- Contrast: every text/background pair above must meet WCAG AA (the token values were chosen for it; do not
  change them).

## Pages

### `index.astro`

`<Base title="Faris Winawan" description="Ocean engineering graduate (ITB). Independent research in wave energy. Projects with how each one was verified and what is still open." path="/" jsonLd={person}>`

`person` JSON-LD:

```json
{ "@context": "https://schema.org", "@type": "Person", "name": "Faris Winawan",
  "alternateName": "Muhammad Faris Winawan", "url": "https://einggraumfw.github.io/",
  "email": "mailto:fariswinawan@proton.me",
  "alumniOf": { "@type": "CollegeOrUniversity", "name": "Institut Teknologi Bandung" },
  "knowsAbout": ["wave energy", "ocean engineering", "ERA5 reanalysis"],
  "sameAs": ["https://github.com/EinggrauMFW", "https://www.linkedin.com/in/fariswinawan"] }
```

Copy, verbatim:

```
<h1 data-type>Faris Winawan</h1>
<p>Ocean engineering graduate (ITB, Indonesia). I do independent research in wave energy and write the
software I need for it. Each project below says what it does, how it was checked, and what is still open.</p>

<h2>Research direction</h2>
<p>Field-data-informed hydrodynamics of self-reacting, weathervaning wave energy converters.</p>
<p>The items marked Planned build toward this question. None of them has results yet.</p>

<h2 id="projects">Projects</h2>
```

Then the filter bar and the table:

```html
<div class="filters" role="group" aria-label="Filter by status" hidden>
  <button type="button" data-filter="all" aria-pressed="true">All</button>
  <button type="button" data-filter="Verified" aria-pressed="false">Verified</button>
  <button type="button" data-filter="In progress" aria-pressed="false">In progress</button>
  <button type="button" data-filter="Planned" aria-pressed="false">Planned</button>
</div>
<p class="filter-count" aria-live="polite"></p>
<table class="projects">
  <thead><tr><th scope="col">Project</th><th scope="col">Status</th><th scope="col">What it is</th><th scope="col">Checked</th></tr></thead>
  <tbody> one <tr data-status={status}> per collection entry, sorted by `order`:
    <td><a href={`/projects/${id}/`}>{title}</a></td>
    <td><span class="status">{status}</span></td>
    <td>{summary}</td>
    <td>{updated as YYYY-MM-DD}</td>
  </tbody>
</table>
```

Below the table, verbatim:

```
<h2>Status labels</h2>
<dl>
  <dt><span class="status">Verified</span></dt><dd>Released or completed; the checks listed on its page pass. The note next to the label gives the scope.</dd>
  <dt><span class="status">In progress</span></dt><dd>Work continues, or a key check is still missing.</dd>
  <dt><span class="status">Planned</span></dt><dd>Not started. No results are shown.</dd>
</dl>
```

### `about.astro`

`title="About"`, `path="/about/"`, description "Background of Faris Winawan, ocean engineering graduate (ITB)."
Verbatim:

```
<h1>About</h1>
<h2>Background</h2>
<p>I studied Ocean Engineering at Institut Teknologi Bandung (ITB), Indonesia. My undergraduate thesis
(2024) assessed the wave energy resource and the cost of energy for a floating wave energy converter farm
off Sipora Island, Mentawai: <a href="/projects/sipora-thesis/">project page</a>.</p>
<p>I have spent about three years in self-directed study of wave energy, and built the tools
listed on the <a href="/#projects">projects</a> page.</p>
{/* Freelance experience: withheld until Faris supplies exact wording and dates. */}

<h2>How this site is kept accurate</h2>
<p>Every claim on a project page has a source: a repository file, a test run, a release, or my own
statement. Limitations and open items are listed next to the checks. A script compares each page with its
repository and flags differences in release, test count and last commit.</p>
<p>Machine-readable versions: <a href="/llms.txt">llms.txt</a>, <a href="/projects.json">projects.json</a>,
and each project page as Markdown at <code>/projects/&lt;name&gt;.md</code>.</p>
```

Keep the `{/* ... */}` comment exactly; it must not render.

### `contact.astro`

`title="Contact"`, `path="/contact/"`, description "How to contact Faris Winawan." Verbatim:

```
<h1>Contact</h1>
<dl>
  <dt>Email</dt><dd><a href="mailto:fariswinawan@proton.me">fariswinawan@proton.me</a></dd>
  <dt>GitHub</dt><dd><a href="https://github.com/EinggrauMFW">github.com/EinggrauMFW</a></dd>
  <dt>LinkedIn</dt><dd><a href="https://www.linkedin.com/in/fariswinawan">linkedin.com/in/fariswinawan</a></dd>
</dl>
```

### `404.astro`

`title="Not found"`, `path="/404/"`, description "Page not found." Body: `<h1>Not found</h1><p>No page at this
address. <a href="/">Back to the index</a>.</p>`

### `projects/[slug].astro`

`getStaticPaths` from `getCollection("projects")`, `params: { slug: entry.id }`. Render with `render(entry)`
from `astro:content`. `Base` props: `title={data.title}`, `description={data.summary}`,
`path={`/projects/${id}/`}`, `mdHref={`/projects/${id}.md`}`, `jsonLd` = SoftwareSourceCode when `repo` is
set, otherwise CreativeWork:

```js
{ "@context": "https://schema.org", "@type": repo ? "SoftwareSourceCode" : "CreativeWork",
  "name": title, "description": summary, "url": canonical page URL,
  "author": { "@type": "Person", "name": "Faris Winawan", "url": "https://einggraumfw.github.io/" },
  "dateModified": updated ISO date,
  // only when present:
  "codeRepository": repo, "programmingLanguage": languages, "license": licence,
  "version": release.tag, "identifier": doi ? `https://doi.org/${doi}` : undefined }
```

Drop undefined keys. Page structure:

```
<article>
  <h1>{title}</h1>
  <p class="summary">{summary}</p>
  <p class="meta"><span class="status">{status}</span> {statusNote} · checked <time datetime=...>{YYYY-MM-DD}</time></p>
  <Content />
  <h2>Links</h2>
  <ul> only for fields present:
    repo -> "Repository: <a>{repo without https://}</a>"
    !sourcePublic -> "Source: not public."
    release -> "Release: <a href={release.url}>{tag}</a> ({YYYY-MM-DD})"
    doi -> "DOI: <a href=https://doi.org/{doi}>{doi}</a>"
    always -> "This page as Markdown: <a href={mdHref}>{id}.md</a>"
  </ul>
  if languages.length or licence:
  <h2>Stack</h2><p>{languages joined ", "}{licence ? ` · licence: ${licence}` : ""}</p>
  <hr>
  <p class="meta">Last checked {YYYY-MM-DD}{commit ? " against commit <a href={commit.url}><code>{sha first 7}</code></a>" : ""}.</p>
</article>
```

Format all dates as `YYYY-MM-DD` with `toISOString().slice(0, 10)`.

## `public/site.js` (plain ES2017, no imports, wrapped in an IIFE, target < 2.5 KB)

1. **Theme toggle.** Un-hide `#theme-toggle`. Effective theme = `document.documentElement.dataset.theme`
   or, if unset, `matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"`. Button text is the
   theme it switches *to*, in brackets: `[dark]` or `[light]`; `aria-label` "Switch to dark theme" /
   "Switch to light theme". On click: set `dataset.theme`, save to `localStorage` inside `try {} catch {}`,
   update the label.
2. **Typing effect.** For `h1[data-type]`: if `matchMedia("(prefers-reduced-motion: reduce)").matches`, do
   nothing. Otherwise keep the full text, set `aria-label` to it, append a `<span class="caret" aria-hidden="true">_</span>`,
   and reveal the text one character at a time so the total takes at most 1.2 s (interval =
   `Math.min(90, 1200 / text.length)` ms). Typed text goes in a `<span aria-hidden="true">` before the caret.
   Remove the caret 1.5 s after the last character.
3. **Status filter.** For `.filters`: remove `hidden`. On button click: set `aria-pressed` on all buttons,
   show rows of `table.projects tbody tr` whose `data-status` matches (or all for `all`) via `row.hidden`,
   and write `"{n} of {total} shown"` into `.filter-count`. On load the count is empty.

Everything must still work without this file: no content may depend on it.

## `public/robots.txt`

```
User-agent: *
Allow: /

Sitemap: https://einggraumfw.github.io/sitemap.xml
```

## Done when

- `npm install && npm run build` succeeds with no warnings from your code.
- Every page renders without JavaScript.
- No text other than the verbatim copy above and the fixture.
