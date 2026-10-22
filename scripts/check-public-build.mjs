import { readdir, readFile, lstat, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

export const base = '/codex-ext1/';
export function allowedPath(path) {
  return ['index.html', '.nojekyll', 'deployment.json'].includes(path)
    || /^assets\/[A-Za-z0-9_-]+-[A-Za-z0-9_-]+\.(js|css)$/.test(path);
}
export function inspectText(path, text) {
  // Never print matched content: it could contain a credential.
  const patterns = [
    /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
    /\b(?:gh[pousr]_[A-Za-z0-9_]{20,}|github_pat_[A-Za-z0-9_]{20,}|AKIA[A-Z0-9]{16})\b/,
    /\bsk-(?:proj-)?[A-Za-z0-9_-]{20,}/,
    /(?:api[_-]?key|client[_-]?secret|password)\s*[=:]\s*["'][^"']{8,}["']/i,
    /sourceMappingURL|["']sourcesContent["']\s*:/,
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
    /["']firstAnswer["']\s*:\s*["']/, // Serialized real/sample answer records are forbidden.
    /https?:\/\/[^\s"'`<>]*?(?:google-analytics|googletagmanager|segment\.com|hotjar|sentry\.io)/i,
  ];
  if (patterns.some(pattern => pattern.test(text))) throw new Error(`Forbidden content in ${path}; publication blocked`);
  if (/\.js$/.test(path) && /\b(?:fetch\s*\(|XMLHttpRequest|WebSocket|sendBeacon\s*\()/.test(text)) {
    throw new Error(`Network API in ${path}; manual privacy review required`);
  }
  if (/\.css$/.test(path) && /@import|url\s*\(/i.test(text)) {
    throw new Error(`CSS resource in ${path}; extend the reviewed allowlist before publication`);
  }
}
export async function inspectBuild(directory, { metadata = false } = {}) {
  const root = resolve(directory);
  const files = {};
  async function walk(dir) {
    for (const entry of await readdir(dir)) {
      const full = resolve(dir, entry), path = relative(root, full).replaceAll('\\', '/');
      const stat = await lstat(full);
      if (stat.isSymbolicLink()) throw new Error(`Symlink rejected: ${path}`);
      if (stat.isDirectory()) {
        if (path !== 'assets') throw new Error(`Directory rejected: ${path}`);
        await walk(full); continue;
      }
      if (!stat.isFile() || !allowedPath(path)) throw new Error(`File rejected: ${path}`);
      if (!metadata && path === 'deployment.json') throw new Error('Unexpected deployment metadata in build');
      if (stat.size > 2_000_000) throw new Error(`Oversized file: ${path}`);
      const bytes = await readFile(full);
      inspectText(path, bytes.toString('utf8'));
      files[path] = createHash('sha256').update(bytes).digest('hex');
    }
  }
  await walk(root);
  if (!files['index.html']) throw new Error('Missing index.html');
  const html = await readFile(resolve(root, 'index.html'), 'utf8');
  if (!/<html\s+lang="zh-CN"/.test(html)) throw new Error('Unexpected application HTML');
  const resources = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(m => m[1]);
  if (!resources.some(p => p.endsWith('.js')) || !resources.some(p => p.endsWith('.css'))) throw new Error('Missing JS/CSS');
  for (const resource of resources) {
    if (!resource.startsWith(base) || !files[resource.slice(base.length)]) throw new Error('Invalid subpath or missing HTML resource');
  }
  return files;
}
export async function verifyBuild(directory, sha) {
  if (!/^[a-f0-9]{40}$/.test(sha || '')) throw new Error('Invalid source SHA');
  const files = await inspectBuild(directory, { metadata: true });
  const manifest = JSON.parse(await readFile(resolve(directory, 'deployment.json'), 'utf8'));
  if (manifest.application !== 'codex-ext1' || manifest.schema !== 1 || manifest.sourceCommit !== sha) throw new Error('Wrong deployment provenance');
  const expected = Object.keys(files).filter(path => path !== 'deployment.json').sort();
  if (JSON.stringify(Object.keys(manifest.files || {}).sort()) !== JSON.stringify(expected)) throw new Error('Manifest file set mismatch');
  for (const path of expected) if (manifest.files[path] !== files[path]) throw new Error('Manifest hash mismatch');
  console.log('Pages artifact provenance and hashes verified');
  return files;
}
export async function prepareBuild(directory, sha) {
  if (!/^[a-f0-9]{40}$/.test(sha || '')) throw new Error('SOURCE_SHA must be a full commit SHA');
  await writeFile(resolve(directory, '.nojekyll'), '');
  const files = await inspectBuild(directory);
  const manifest = { application: 'codex-ext1', schema: 1, sourceCommit: sha, builtAt: new Date().toISOString(), files };
  await writeFile(resolve(directory, 'deployment.json'), JSON.stringify(manifest, null, 2) + '\n');
  await inspectBuild(directory, { metadata: true });
  console.log(`Public build approved: ${Object.keys(files).length + 1} files; no source, docs, tests, images, maps or records`);
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await prepareBuild(process.argv[2] || 'dist', process.env.SOURCE_SHA);
}
