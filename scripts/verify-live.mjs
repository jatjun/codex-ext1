import { createHash } from 'node:crypto';
const base = 'https://jatjun.github.io/codex-ext1/';
const sha = process.env.SOURCE_SHA;
if (!/^[a-f0-9]{40}$/.test(sha || '')) throw new Error('Expected a full release SHA');
let manifest;
for (let attempt = 0; attempt < 12; attempt++) {
  const response = await fetch(`${base}deployment.json?release=${sha}`, { signal: AbortSignal.timeout(15000) });
  if (response.ok) {
    const candidate = await response.json();
    if (candidate.application === 'codex-ext1' && candidate.sourceCommit === sha) { manifest = candidate; break; }
  }
  if (attempt < 11) await new Promise(resolve => setTimeout(resolve, 5000));
}
if (!manifest) throw new Error('Live website did not expose the expected released commit');
for (const [path, expectedHash] of Object.entries(manifest.files)) {
  if (path === '.nojekyll') continue; // Pages build marker is not a public application resource.
  if (path !== 'index.html' && !/^assets\/[A-Za-z0-9_-]+-[A-Za-z0-9_-]+\.(js|css)$/.test(path)) throw new Error('Unexpected live asset path');
  const response = await fetch(`${base}${path}?release=${sha}`, { signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error(`Live asset ${path}: HTTP ${response.status}`);
  const hash = createHash('sha256').update(Buffer.from(await response.arrayBuffer())).digest('hex');
  if (hash !== expectedHash) throw new Error(`Live asset hash differs from tested build: ${path}`);
  console.log(`Live asset OK: ${path}`);
}
console.log(`Live release verified: ${sha}`);
