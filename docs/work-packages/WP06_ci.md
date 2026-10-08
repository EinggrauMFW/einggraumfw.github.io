# WP06: GitHub Actions workflows

Repo will be `EinggrauMFW/einggraumfw.github.io` (GitHub Pages user site, source = GitHub Actions).
Node 22. Build: `npm ci` then `npm run build` (output `dist/`). Tests: `node --test "scripts/*.test.mjs"`.
Output check: `node scripts/check-output.mjs`. Drift check: `node scripts/drift.mjs` (needs `gh`, which is
preinstalled on GitHub runners, with `GH_TOKEN: ${{ github.token }}`).

## `.github/workflows/deploy.yml`

- Name `Deploy`. Triggers: `push` to `main`, and `workflow_dispatch`.
- Top-level `permissions: { contents: read, pages: write, id-token: write }`.
- `concurrency: { group: pages, cancel-in-progress: false }`.
- Job `build` on `ubuntu-latest`: `actions/checkout@v4`; `actions/setup-node@v4` with `node-version: 22`
  and `cache: npm`; `npm ci`; `npm run build`; run the tests; run the output check;
  `actions/upload-pages-artifact@v3` with `path: dist`.
- Job `deploy`, `needs: build`, on `ubuntu-latest`, `environment: { name: github-pages, url:
  ${{ steps.deployment.outputs.page_url }} }`, one step `actions/deploy-pages@v4` with `id: deployment`.

## `.github/workflows/drift.yml`

- Name `Drift check`. Trigger: `workflow_dispatch` only.
- `permissions: { contents: read }`.
- Job `drift` on `ubuntu-latest`: checkout, setup-node (22, npm cache), `npm ci`, `npm run build`, then
  `node scripts/drift.mjs` with `env: GH_TOKEN: ${{ github.token }}`.

Nothing else: no other files, no badges, no extra actions.
