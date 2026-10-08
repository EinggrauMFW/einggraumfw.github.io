import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export function checkOutput(distDir = 'dist') {
  const projectsJsonPath = path.join(distDir, 'projects.json');
  if (!fs.existsSync(projectsJsonPath)) {
    return ['projects.json: file not found'];
  }

  let data;
  try {
    data = JSON.parse(fs.readFileSync(projectsJsonPath, 'utf8'));
  } catch {
    return ['projects.json: invalid JSON'];
  }

  if (!data || typeof data !== 'object') {
    return ['projects.json: root must be an object'];
  }

  const errors = [];

  if (typeof data.site !== 'string' || !data.site.startsWith('http')) {
    errors.push('projects.json: missing or invalid "site"');
  }
  if (typeof data.generated !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(data.generated)) {
    errors.push('projects.json: missing or invalid "generated"');
  }
  if (!Array.isArray(data.projects) || data.projects.length === 0) {
    errors.push('projects.json: "projects" must be a non-empty array');
    return errors;
  }

  const seenSlugs = new Set();
  const allowedStatuses = new Set(['Verified', 'In progress', 'Planned']);
  const site = data.site.endsWith('/') ? data.site : `${data.site}/`;

  for (const p of data.projects) {
    if (!p || typeof p !== 'object') {
      errors.push('projects.json: project entry must be an object');
      continue;
    }

    if (typeof p.slug !== 'string' || p.slug.trim() === '') {
      errors.push('projects.json: project missing valid "slug"');
    } else {
      if (seenSlugs.has(p.slug)) {
        errors.push(`projects.json: duplicate slug "${p.slug}"`);
      }
      seenSlugs.add(p.slug);
    }

    if (typeof p.title !== 'string' || p.title.trim() === '') {
      errors.push(`projects.json: project "${p.slug}" missing valid "title"`);
    }
    if (typeof p.summary !== 'string' || p.summary.trim() === '') {
      errors.push(`projects.json: project "${p.slug}" missing valid "summary"`);
    }
    if (typeof p.statusNote !== 'string' || p.statusNote.trim() === '') {
      errors.push(`projects.json: project "${p.slug}" missing valid "statusNote"`);
    }
    if (!allowedStatuses.has(p.status)) {
      errors.push(`projects.json: project "${p.slug}" invalid status "${p.status}"`);
    }
    if (p.url !== `${site}projects/${p.slug}/`) {
      errors.push(`projects.json: project "${p.slug}" invalid url "${p.url}"`);
    }
    if (p.markdown !== `${site}projects/${p.slug}.md`) {
      errors.push(`projects.json: project "${p.slug}" invalid markdown "${p.markdown}"`);
    }
    if (typeof p.lastVerified !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(p.lastVerified)) {
      errors.push(`projects.json: project "${p.slug}" invalid lastVerified "${p.lastVerified}"`);
    }
    if (!Array.isArray(p.languages) || !p.languages.every((s) => typeof s === 'string')) {
      errors.push(`projects.json: project "${p.slug}" languages must be array of strings`);
    }
    if (!Array.isArray(p.verification) || !p.verification.every((s) => typeof s === 'string')) {
      errors.push(`projects.json: project "${p.slug}" verification must be array of strings`);
    }
    if (!Array.isArray(p.openItems) || !p.openItems.every((s) => typeof s === 'string')) {
      errors.push(`projects.json: project "${p.slug}" openItems must be array of strings`);
    }
    if (p.repo !== null && (typeof p.repo !== 'string' || !p.repo.startsWith('https://'))) {
      errors.push(`projects.json: project "${p.slug}" invalid repo "${p.repo}"`);
    }
    if (p.release !== null) {
      if (
        !p.release ||
        typeof p.release !== 'object' ||
        typeof p.release.tag !== 'string' ||
        typeof p.release.date !== 'string' ||
        !/^\d{4}-\d{2}-\d{2}$/.test(p.release.date) ||
        typeof p.release.url !== 'string'
      ) {
        errors.push(`projects.json: project "${p.slug}" invalid release object`);
      }
    }

    if (p.status === 'Planned' && Array.isArray(p.verification) && p.verification.length > 0) {
      errors.push(`projects.json: Planned project "${p.slug}" has non-empty verification`);
    }
  }

  for (const p of data.projects) {
    if (!p || typeof p.slug !== 'string') continue;

    const mdRel = `projects/${p.slug}.md`;
    const mdPath = path.join(distDir, mdRel);
    if (!fs.existsSync(mdPath)) {
      errors.push(`${mdRel}: file not found`);
    } else {
      try {
        const mdContent = fs.readFileSync(mdPath, 'utf8');
        const firstLine = mdContent.split(/\r?\n/)[0];
        if (firstLine !== `# ${p.title}`) {
          errors.push(`${mdRel}: first line is "${firstLine}", expected "# ${p.title}"`);
        }
      } catch {
        errors.push(`${mdRel}: could not read file`);
      }
    }

    const htmlRel = `projects/${p.slug}/index.html`;
    const htmlPath = path.join(distDir, htmlRel);
    if (!fs.existsSync(htmlPath)) {
      errors.push(`${htmlRel}: file not found`);
    }
  }

  const llmsPath = path.join(distDir, 'llms.txt');
  if (!fs.existsSync(llmsPath)) {
    errors.push('llms.txt: file not found');
  } else {
    try {
      const llmsContent = fs.readFileSync(llmsPath, 'utf8');
      const lines = llmsContent.split(/\r?\n/);
      if (!lines[0] || !lines[0].startsWith('# ') || lines[0].trim() === '#') {
        errors.push('llms.txt: first line must be "# " + a name');
      }
      if (!lines.some((l) => l.startsWith('> '))) {
        errors.push('llms.txt: missing line starting with "> "');
      }
      if (!lines.some((l) => l.trim() === '## Projects')) {
        errors.push('llms.txt: missing "## Projects" heading');
      }
      for (const p of data.projects) {
        if (p && typeof p.markdown === 'string') {
          const expectedLink = `](${p.markdown})`;
          if (!lines.some((l) => l.includes(expectedLink))) {
            errors.push(`llms.txt: missing link ${expectedLink}`);
          }
        }
      }
    } catch {
      errors.push('llms.txt: could not read file');
    }
  }

  const sitemapPath = path.join(distDir, 'sitemap.xml');
  if (!fs.existsSync(sitemapPath)) {
    errors.push('sitemap.xml: file not found');
  } else {
    try {
      const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
      const requiredUrls = [
        site,
        `${site}about/`,
        `${site}contact/`,
        ...data.projects.map((p) => p?.url).filter(Boolean),
      ];
      for (const u of requiredUrls) {
        if (!sitemapContent.includes(`<loc>${u}</loc>`)) {
          errors.push(`sitemap.xml: missing <loc>${u}</loc>`);
        }
      }
    } catch {
      errors.push('sitemap.xml: could not read file');
    }
  }

  const textExts = new Set(['.html', '.md', '.txt', '.json', '.xml']);
  function walk(currentDir) {
    let entries;
    try {
      entries = fs.readdirSync(currentDir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const ent of entries) {
      const fullPath = path.join(currentDir, ent.name);
      if (ent.isDirectory()) {
        walk(fullPath);
      } else if (ent.isFile()) {
        const ext = path.extname(ent.name).toLowerCase();
        if (textExts.has(ext)) {
          try {
            const content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('TODO(verify)')) {
              const rel = path.relative(distDir, fullPath).replace(/\\/g, '/');
              errors.push(`${rel}: contains TODO(verify)`);
            }
          } catch {}
        }
      }
    }
  }
  walk(distDir);

  return errors;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const distDir = process.argv[2] || 'dist';
  const errors = checkOutput(distDir);
  if (errors.length > 0) {
    for (const err of errors) {
      console.error(err);
    }
    process.exit(1);
  }
  let count = 0;
  try {
    const raw = fs.readFileSync(path.join(distDir, 'projects.json'), 'utf8');
    const data = JSON.parse(raw);
    count = data.projects?.length ?? 0;
  } catch {}
  console.log(`check-output: ok (${count} projects)`);
  process.exit(0);
}
