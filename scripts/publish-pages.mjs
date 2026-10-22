// All writes are hard-bound to the single approved public repository.
// No checkout, no force push, and no credentials in URLs, files or log output.
import { readFile, mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { inspectBuild, allowedPath } from './check-public-build.mjs';
const target = 'jatjun/codex-ext1-pages', source = 'jatjun/codex-ext1';
const token = process.env.PAGES_DEPLOY_TOKEN, sourceToken = process.env.SOURCE_READ_TOKEN;
if (!token || !sourceToken) throw new Error('Deployment credential missing; see docs/GITHUB_PAGES_DEPLOYMENT.md');
const sha = process.env.SOURCE_SHA;
if (!/^[a-f0-9]{40}$/.test(sha || '')) throw new Error('Invalid source SHA');
async function api(path, { method = 'GET', body, allow404 = false, allowEmpty = false, sourceAuth = false } = {}) {
  const response = await fetch(`https://api.github.com/repos/${sourceAuth ? source : target}/${path}`, {
    method, headers: { Authorization: `Bearer ${sourceAuth ? sourceToken : token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'Content-Type': 'application/json' },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  if (allow404 && response.status === 404) return null;
  if (allowEmpty && response.status === 409) {
    const error = await response.json();
    if (error.message === 'Git Repository is empty.') return [];
    throw new Error('Unexpected repository conflict; publication stopped');
  }
  if (!response.ok) throw new Error(`GitHub ${method} ${path}: HTTP ${response.status}; no response body logged`);
  return response.json();
}
const directory = resolve('dist');
const files = await inspectBuild(directory, { metadata: true });
const manifest = JSON.parse(await readFile(resolve(directory, 'deployment.json'), 'utf8'));
if (manifest.application !== 'codex-ext1-pages' || manifest.sourceCommit !== sha) throw new Error('Wrong build provenance');
const expectedFiles = Object.keys(files).filter(p => p !== 'deployment.json').sort();
if (JSON.stringify(Object.keys(manifest.files).sort()) !== JSON.stringify(expectedFiles)) throw new Error('Manifest file set mismatch');
for (const path of expectedFiles) if (manifest.files[path] !== files[path]) throw new Error('Manifest hash mismatch');
const sourceMeta = await api('', { sourceAuth: true });
if (sourceMeta.private !== true || sourceMeta.full_name !== source) throw new Error('Source must remain private');
const repo = await api('');
if (repo.private !== false || repo.full_name !== target) throw new Error('Target must be the approved public repository');
if (repo.default_branch !== 'main') throw new Error('Target default branch must be main');
const refs = await api('git/matching-refs/heads/', { allowEmpty: true });
if (refs.some(ref => ref.ref !== 'refs/heads/main')) throw new Error('Unexpected target branches; manual review required');
const tags = await api('git/matching-refs/tags/', { allowEmpty: true });
if (tags.length) throw new Error('Unexpected target tags; manual review required');
const head = refs.find(ref => ref.ref === 'refs/heads/main')?.object.sha;
if (head) {
  const tree = await api(`git/trees/${head}?recursive=1`);
  if (tree.truncated || tree.tree.some(entry => entry.type === 'blob' ? entry.mode !== '100644' || !allowedPath(entry.path) : entry.type !== 'tree' || entry.path !== 'assets')) throw new Error('Unrelated target content; publication stopped');
  const metadata = tree.tree.find(entry => entry.path === 'deployment.json' && entry.mode === '100644');
  if (!metadata) throw new Error('Existing target lacks project marker; publication stopped');
  const old = await api(`git/blobs/${metadata.sha}`);
  const marker = JSON.parse(Buffer.from(old.content, 'base64').toString('utf8'));
  if (marker.application !== 'codex-ext1-pages' || marker.schema !== 1) throw new Error('Unrecognized target history; publication stopped');
  // Check every ancestor: an unrelated older commit must not be silently overwritten.
  let cursor = head, count = 0;
  while (cursor) {
    if (++count > 2000) throw new Error('History review limit reached; manual review required');
    const commit = await api(`git/commits/${cursor}`);
    if (!/^Publish [a-f0-9]{40}$/.test(commit.message.trim()) || commit.parents.length > 1) throw new Error('Unrelated target history; publication stopped');
    cursor = commit.parents[0]?.sha;
  }
}
// Git transport can initialize an empty repository; Git Data REST cannot reliably do so.
// Only verified dist bytes enter this fresh temporary Git repository.
const staging = await mkdtemp(join(process.env.RUNNER_TEMP || tmpdir(), 'math-pages-'));
const exec = promisify(execFile);
const gitEnv = { ...process.env,
  GIT_CONFIG_COUNT: '1', GIT_CONFIG_KEY_0: 'http.https://github.com/.extraheader',
  GIT_CONFIG_VALUE_0: `AUTHORIZATION: basic ${Buffer.from(`x-access-token:${token}`).toString('base64')}`,
  GIT_AUTHOR_NAME: 'Pages deployment', GIT_AUTHOR_EMAIL: 'pages@users.noreply.github.com',
  GIT_COMMITTER_NAME: 'Pages deployment', GIT_COMMITTER_EMAIL: 'pages@users.noreply.github.com',
  GIT_TERMINAL_PROMPT: '0',
};
async function git(...args) {
  try { return (await exec('git', args, { cwd: staging, env: gitEnv })).stdout.trim(); }
  catch { throw new Error('Git publication failed; target was not force-updated. Check repository access and concurrent updates.'); }
}
let publicCommit;
try {
  await git('init', '--initial-branch=main');
  const url = `https://github.com/${target}.git`;
  if (head) {
    await git('fetch', '--depth=1', url, 'refs/heads/main');
    if (await git('rev-parse', 'FETCH_HEAD') !== head) throw new Error('Target changed during review; retry the workflow');
  }
  for (const path of Object.keys(files).sort()) {
    const content = await readFile(resolve(directory, path));
    if (createHash('sha256').update(content).digest('hex') !== files[path]) throw new Error('Build changed during publication');
    await mkdir(dirname(join(staging, path)), { recursive: true });
    await writeFile(join(staging, path), content, { flag: 'wx' });
  }
  await git('add', '--all');
  const tree = await git('write-tree');
  publicCommit = await git('commit-tree', tree, ...(head ? ['-p', head] : []), '-m', `Publish ${sha}`);
  const latest = await api('git/ref/heads/feat/interactive-math-v1', { sourceAuth: true });
  if (latest.object.sha !== sha) throw new Error('A newer source commit exists; stale publication stopped');
  await git('update-ref', 'refs/heads/main', publicCommit);
  await git('push', url, 'refs/heads/main:refs/heads/main');
} finally { await rm(staging, { recursive: true, force: true }); }
console.log(`Published static files only. Public commit: ${publicCommit}. Source commit: ${sha}`);
if (process.env.GITHUB_STEP_SUMMARY) {
  const { appendFile } = await import('node:fs/promises');
  await appendFile(process.env.GITHUB_STEP_SUMMARY, `Published **${publicCommit}** from source **${sha}**.\n\n[Public repository](https://github.com/${target}) · [Website (Pages must be enabled)](https://jatjun.github.io/codex-ext1-pages/)\n`);
}
