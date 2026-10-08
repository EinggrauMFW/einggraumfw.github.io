# Portfolio site: rules for any session editing it

Personal engineering portfolio of Faris Winawan (GitHub `EinggrauMFW`), deployed to
`https://einggraumfw.github.io` by GitHub Actions. Astro 5, static output.

## Structure

| Path | What it is |
|---|---|
| `docs/facts/<slug>.md` | Fact sheets. Every claim with its source. **Not published.** Project pages are written only from these. |
| `src/content/projects/<slug>.md` | One page per project (frontmatter + body). Also served as `/projects/<slug>.md`. |
| `src/pages/` | `index`, `about`, `contact`, `projects/[slug]`, plus endpoints `llms.txt`, `projects.json`, `sitemap.xml`, `projects/[slug].md`. |
| `src/layouts/Base.astro`, `src/styles/site.css` | Layout, meta, JSON-LD; typewriter design tokens. |
| `public/site.js` | Progressive enhancement only: typing effect, status filter, theme toggle. Every page must work without it. |
| `scripts/drift.mjs` | Compares project frontmatter with each GitHub repo (release, README test count, last commit). |
| `scripts/check-output.mjs` | Checks `dist/`: `projects.json` shape, `llms.txt`, `.md` mirrors, no `TODO(verify)`. |

## Honesty rules (from the owner; do not relax)

- Invent nothing. Every claim comes from a repo, README, test run, release, or a statement by Faris
  recorded in `docs/facts/` with a date. Add the fact first, then the sentence.
- Unverifiable fact: leave `TODO(verify)` in the source. `check-output.mjs` fails the build output if one
  reaches `dist/`, so a page with an open TODO cannot ship.
- Status labels, exactly one per project: `Verified` (released or completed; the checks listed on the page
  pass), `In progress` (work continues or a key check is missing), `Planned` (no results; show none).
  `statusNote` states the scope of the label, e.g. "numerics on synthetic data".
- Limitations and open items sit next to the verification, always.
- Do not overstate experience, team size, users, traction or revenue. No company, customers or funding.
  Never claim eligibility for, or name, any programme.
- Never include: application outcomes, salary or financial details, health details, client work under
  confidentiality (do not even name such a project; this repo is public). Ask Faris before adding any client
  or freelance work.
- No credentials or keys. The only email on the site is `fariswinawan@proton.me`.
- Only the projects in `src/content/projects/` belong on the site. Faris has excluded other work; never add
  or mention a project Faris has not approved.

## Writing style

Plain, specific, first person singular. Numbers with units. No "cutting-edge", "robust", "seamless",
"innovative", "powerful". Say what the code does and what was checked; say "not yet validated" where true.

## Design

Typewriter minimalist: Courier Prime, paper `#f6f2e8` / ink `#1c1b19` / ribbon red `#a3191c`; dark mode
carbon `#161513` / `#e8e2d4` / `#ff7b6e`. Dashed rules, no cards, no images except figures from Faris's own
runs (with axis labels and units), no gradients, one animation only (headline typing, skipped under
reduced motion). WCAG AA, keyboard usable, works at 375 px, Lighthouse performance >= 95.

## Workflow

Orchestrator (Claude Opus) writes facts and all claim text, reviews every diff and re-runs every check.
Code work packages go to Gemini via the 9router `router` agent in a git worktree
(`../portfolio-worktrees/wpNN`). Codex writes acceptance tests only. Never merge on an agent's report.
