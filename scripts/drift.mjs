import { execFile } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

export function compare(site, remote) {
  const messages = [];

  const siteTag = site.release?.tag ?? null;
  if (remote.latestRelease !== siteTag) {
    const siteStr = siteTag ?? 'none';
    const remoteStr = remote.latestRelease ?? 'none';
    messages.push(`${site.slug}: release on site ${siteStr}, repo ${remoteStr}`);
  }

  if (site.commit && remote.headSha && site.commit !== remote.headSha) {
    messages.push(
      `${site.slug}: page checked at ${site.commit.slice(0, 7)}, repo head is ${remote.headSha.slice(0, 7)}`
    );
  }

  let siteCount = null;
  if (Array.isArray(site.verification)) {
    for (const v of site.verification) {
      if (typeof v === 'string') {
        const match = v.match(/(\d[\d,]*) (?:automated )?tests\b/);
        if (match) {
          siteCount = match[1];
          break;
        }
      }
    }
  }

  let repoCount = null;
  if (typeof remote.readme === 'string') {
    const match = remote.readme.match(/(\d[\d,]*) tests\b/);
    if (match) {
      repoCount = match[1];
    }
  }

  if (siteCount !== null && repoCount !== null) {
    const siteNum = parseInt(siteCount.replace(/,/g, ''), 10);
    const repoNum = parseInt(repoCount.replace(/,/g, ''), 10);
    if (siteNum !== repoNum) {
      messages.push(`${site.slug}: ${siteCount} tests on site, ${repoCount} in README`);
    }
  }

  return messages;
}

export async function fetchRemote(repoUrl) {
  const url = new URL(repoUrl);
  const parts = url.pathname.replace(/^\/+|\.git$/g, '').split('/');
  const owner = parts[0];
  const name = parts[1];
  const repo = `${owner}/${name}`;

  let latestRelease = null;
  try {
    const { stdout } = await execFileAsync('gh', [
      'api',
      `repos/${repo}/releases/latest`,
      '--jq',
      '.tag_name',
    ]);
    latestRelease = stdout.trim() || null;
  } catch (err) {
    const errText = `${err.stderr || ''} ${err.stdout || ''} ${err.message || ''}`;
    if (errText.includes('404')) {
      latestRelease = null;
    } else {
      throw err;
    }
  }

  const { stdout: headShaOut } = await execFileAsync('gh', [
    'api',
    `repos/${repo}/commits/HEAD`,
    '--jq',
    '.sha',
  ]);
  const headSha = headShaOut.trim() || null;

  let readme = '';
  try {
    const { stdout: readmeOut } = await execFileAsync('gh', [
      'api',
      `repos/${repo}/readme`,
      '-H',
      'Accept: application/vnd.github.raw',
    ]);
    readme = readmeOut;
  } catch (err) {
    const errText = `${err.stderr || ''} ${err.stdout || ''} ${err.message || ''}`;
    if (errText.includes('404')) {
      readme = '';
    } else {
      throw err;
    }
  }

  return { latestRelease, headSha, readme };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const distDir = process.argv[2] || 'dist';
  const projectsJsonPath = path.join(distDir, 'projects.json');
  let data;
  try {
    data = JSON.parse(fs.readFileSync(projectsJsonPath, 'utf8'));
  } catch (e) {
    console.error(`drift: could not read ${projectsJsonPath}: ${e.message}`);
    process.exit(2);
  }

  const projects = data.projects || [];
  const githubProjects = projects.filter(
    (p) => p.repo && typeof p.repo === 'string' && p.repo.includes('github.com')
  );

  const allMessages = [];
  let checkedCount = 0;

  for (const p of githubProjects) {
    let remote;
    try {
      remote = await fetchRemote(p.repo);
      checkedCount++;
    } catch (err) {
      console.error(`drift: error fetching ${p.repo}: ${err.message || err}`);
      process.exit(2);
    }

    const diffs = compare(p, remote);
    allMessages.push(...diffs);
  }

  if (allMessages.length > 0) {
    for (const msg of allMessages) {
      console.log(msg);
    }
    process.exit(1);
  }

  console.log(`drift: none (${checkedCount} repos checked)`);
  process.exit(0);
}
