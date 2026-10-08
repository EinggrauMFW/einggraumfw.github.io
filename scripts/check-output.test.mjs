import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { checkOutput } from './check-output.mjs';

const site = 'https://einggraumfw.github.io/';

function fixture(t) {
  const distDir = fs.mkdtempSync(path.join(os.tmpdir(), 'wp05-output-'));
  t.after(() => fs.rmSync(distDir, { recursive: true, force: true }));
  const projects = [
    {
      slug: 'era5-site-explorer',
      title: 'ERA5 Site Explorer',
      status: 'Verified',
      statusNote: 'Checked against the repository release',
      summary: 'Explore ERA5 data for an ocean engineering site.',
      url: `${site}projects/era5-site-explorer/`,
      markdown: `${site}projects/era5-site-explorer.md`,
      repo: 'https://github.com/einggraumfw/era5-site-explorer',
      sourcePublic: true,
      release: {
        tag: 'v0.1.1',
        date: '2026-10-01',
        url: 'https://github.com/einggraumfw/era5-site-explorer/releases/tag/v0.1.1',
      },
      doi: null,
      commit: '0123456789abcdef0123456789abcdef01234567',
      languages: ['Python'],
      licence: 'MIT',
      verification: ['725 tests passed against v0.1.1'],
      openItems: ['Validate additional sites'],
      lastVerified: '2026-10-02',
    },
    {
      slug: 'wave-energy-study',
      title: 'Wave Energy Study',
      status: 'Planned',
      statusNote: 'Research design is being prepared',
      summary: 'Study a self-reacting wave energy converter.',
      url: `${site}projects/wave-energy-study/`,
      markdown: `${site}projects/wave-energy-study.md`,
      repo: null,
      sourcePublic: false,
      release: null,
      doi: null,
      commit: null,
      languages: [],
      licence: null,
      verification: [],
      openItems: ['Prepare the research design'],
      lastVerified: '2026-10-03',
    },
  ];
  const data = { site, author: 'Faris Winawan', generated: '2026-10-08', projects };
  const write = (relative, body) => {
    const target = path.join(distDir, relative);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, body, 'utf8');
  };
  const writeProjects = () => write('projects.json', `${JSON.stringify(data, null, 2)}\n`);
  writeProjects();

  for (const project of projects) {
    const body = '## Research scope\n\nThe project scope and open items are recorded here.\n';
    const lines = [
      `# ${project.title}`,
      '',
      `Status: ${project.status} (${project.statusNote}). Last checked ${project.lastVerified}.`,
      '',
      project.summary,
      '',
    ];
    if (project.repo) lines.push(`Repository: ${project.repo}`);
    if (project.release) {
      const { tag, date, url } = project.release;
      lines.push(`Release: ${tag} (${date}) ${url}`);
    }
    if (project.doi) lines.push(`DOI: https://doi.org/${project.doi}`);
    lines.push(`Canonical page: ${project.url}`, '', body);
    write(`projects/${project.slug}.md`, lines.join('\n'));
    write(`projects/${project.slug}/index.html`,
      `<!doctype html>\n<html lang="en"><head><title>${project.title}</title></head><body><h1>${project.title}</h1><p>${project.summary}</p></body></html>\n`);
  }

  write('llms.txt', [
    '# Faris Winawan',
    '',
    '> Ocean engineering graduate (ITB, Indonesia) doing independent research in wave energy. Research direction: field-data-informed hydrodynamics of self-reacting, weathervaning wave energy converters.',
    '',
    `Each project page states its status (Verified, In progress or Planned), what was checked and against what, and its open items. Structured data: ${site}projects.json`,
    '',
    '## Projects',
    '',
    ...projects.map(p => `- [${p.title}](${p.markdown}): ${p.status}. ${p.summary}`),
    '',
    '## Optional',
    '',
    `- [About](${site}about/): background`,
    `- [Contact](${site}contact/): email, GitHub, LinkedIn`,
    '',
  ].join('\n'));
  write('sitemap.xml', [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...[site, `${site}about/`, `${site}contact/`].map(url => `  <url><loc>${url}</loc></url>`),
    ...projects.map(p => `  <url><loc>${p.url}</loc><lastmod>${p.lastVerified}</lastmod></url>`),
    '</urlset>',
    '',
  ].join('\n'));
  return { distDir, data, writeProjects, write };
}

function assertFailure(distDir, fileOrSlug) {
  const messages = checkOutput(distDir);
  assert.ok(Array.isArray(messages), 'checkOutput must return an array');
  assert.ok(messages.length > 0, 'the invalid output must produce an error');
  assert.ok(messages.every(message => typeof message === 'string'));
  assert.ok(messages.some(message => message.includes(fileOrSlug)),
    `expected an error naming ${fileOrSlug}: ${JSON.stringify(messages)}`);
}

test('complete valid static output passes', t => {
  const { distDir } = fixture(t);
  assert.deepEqual(checkOutput(distDir), []);
});

test('rule 1: projects.json must be parseable', t => {
  const { distDir, write } = fixture(t);
  write('projects.json', '{ invalid JSON');
  assertFailure(distDir, 'projects.json');
});

test('rule 2: status must be an allowed value', t => {
  const { distDir, data, writeProjects } = fixture(t);
  data.projects[0].status = 'Complete';
  writeProjects();
  assertFailure(distDir, 'projects.json');
});

test('rule 2: slugs must be unique', t => {
  const { distDir, data, writeProjects } = fixture(t);
  // Repeat an otherwise valid project so all paths and URLs remain valid.
  data.projects.push(structuredClone(data.projects[0]));
  writeProjects();
  assertFailure(distDir, 'projects.json');
});

test('rule 3: Planned projects must have empty verification', t => {
  const { distDir, data, writeProjects } = fixture(t);
  data.projects[1].verification = ['10 tests passed'];
  writeProjects();
  assertFailure(distDir, 'projects.json');
});

test('rule 4: every project must have a Markdown mirror', t => {
  const { distDir, data } = fixture(t);
  const mirror = `projects/${data.projects[0].slug}.md`;
  fs.unlinkSync(path.join(distDir, mirror));
  assertFailure(distDir, data.projects[0].slug);
});

test('rule 4: Markdown first line must match the project title', t => {
  const { distDir, data, write } = fixture(t);
  const mirror = `projects/${data.projects[0].slug}.md`;
  const original = fs.readFileSync(path.join(distDir, mirror), 'utf8');
  write(mirror, original.replace(/^.*\n/, '# Incorrect title\n'));
  assertFailure(distDir, data.projects[0].slug);
});

test('rule 5: llms.txt must link to every Markdown mirror', t => {
  const { distDir, data, write } = fixture(t);
  const original = fs.readFileSync(path.join(distDir, 'llms.txt'), 'utf8');
  write('llms.txt', original.split('\n')
    .filter(line => !line.includes(`](${data.projects[0].markdown})`)).join('\n'));
  assertFailure(distDir, 'llms.txt');
});

test('rule 6: sitemap.xml must contain every project loc', t => {
  const { distDir, data, write } = fixture(t);
  const original = fs.readFileSync(path.join(distDir, 'sitemap.xml'), 'utf8');
  write('sitemap.xml', original.split('\n')
    .filter(line => !line.includes(`<loc>${data.projects[0].url}</loc>`)).join('\n'));
  assertFailure(distDir, 'sitemap.xml');
});

test('rule 7: HTML files must not contain TODO(verify)', t => {
  const { distDir } = fixture(t);
  // A nested HTML file also requires the checker to walk the output tree.
  const relative = 'nested/deeper/unresolved.html';
  fs.mkdirSync(path.dirname(path.join(distDir, relative)), { recursive: true });
  fs.writeFileSync(path.join(distDir, relative), '<!doctype html><p>TODO(verify)</p>\n');
  assertFailure(distDir, 'unresolved.html');
});
