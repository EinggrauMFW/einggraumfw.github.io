import test from 'node:test';
import assert from 'node:assert/strict';
import { compare } from './drift.mjs';

function fixture() {
  return {
    site: {
      slug: 'era5-site-explorer',
      title: 'ERA5 Site Explorer',
      status: 'Verified',
      statusNote: 'Checked against the repository release',
      summary: 'Explore ERA5 data for an ocean engineering site.',
      url: 'https://einggraumfw.github.io/projects/era5-site-explorer/',
      markdown: 'https://einggraumfw.github.io/projects/era5-site-explorer.md',
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
    remote: {
      latestRelease: 'v0.1.1',
      headSha: '0123456789abcdef0123456789abcdef01234567',
      readme: '# ERA5 Site Explorer\n\n725 tests passed.\n',
    },
  };
}

test('matching release, commit and test count produce no drift', () => {
  const { site, remote } = fixture();
  assert.deepEqual(compare(site, remote), []);
});

test('release drift names both tags', () => {
  const { site, remote } = fixture();
  remote.latestRelease = 'v0.1.2';
  const messages = compare(site, remote);
  assert.deepEqual(messages, [
    `${site.slug}: release on site v0.1.1, repo v0.1.2`,
  ]);
});

test('a null site release is reported as none', () => {
  const { site, remote } = fixture();
  site.release = null;
  assert.deepEqual(compare(site, remote), [
    `${site.slug}: release on site none, repo v0.1.1`,
  ]);
});

test('commit drift reports both seven-character prefixes', () => {
  const { site, remote } = fixture();
  remote.headSha = 'abcdef0123456789abcdef0123456789abcdef01';
  assert.deepEqual(compare(site, remote), [
    `${site.slug}: page checked at 0123456, repo head is abcdef0`,
  ]);
});

test('test-count drift reports 725 on site and 730 in README', () => {
  const { site, remote } = fixture();
  remote.readme = '# ERA5 Site Explorer\n\n730 tests passed.\n';
  assert.deepEqual(compare(site, remote), [
    `${site.slug}: 725 tests on site, 730 in README`,
  ]);
});

test('comma-form automated test counts match README test counts', () => {
  const { site, remote } = fixture();
  site.verification = ['1,024 automated tests passed'];
  remote.readme = '# ERA5 Site Explorer\n\n1,024 tests passed.\n';
  assert.deepEqual(compare(site, remote), []);
});

test('a test count only on the site produces no count drift', () => {
  const { site, remote } = fixture();
  remote.readme = '# ERA5 Site Explorer\n\nChecks passed.\n';
  assert.deepEqual(compare(site, remote), []);
});

test('a test count only in README produces no count drift', () => {
  const { site, remote } = fixture();
  site.verification = ['Manual checks passed'];
  assert.deepEqual(compare(site, remote), []);
});

test('a null site commit produces no commit drift', () => {
  const { site, remote } = fixture();
  site.commit = null;
  remote.headSha = 'abcdef0123456789abcdef0123456789abcdef01';
  assert.deepEqual(compare(site, remote), []);
});
