import { createHash } from 'node:crypto';
const base = 'https://jatjun.github.io/codex-ext1/';
const sha = process.env.SOURCE_SHA;
if (!/^[a-f0-9]{40}$/.test(sha || '')) throw new Error('Expected a full release SHA');
let manifest;
let lastResult = 'no response';
for (let attempt = 0; attempt < 24; attempt++) {
  try {
    const response = await fetch(`${base}deployment.json?release=${sha}&probe=${Date.now()}`, { signal: AbortSignal.timeout(15000), cache: 'no-store' });
    lastResult = `HTTP ${response.status}`;
    if (response.ok) {
      const candidate = await response.json();
      const observedSha = /^[a-f0-9]{40}$/.test(candidate.sourceCommit || '') ? candidate.sourceCommit : 'missing/invalid';
      lastResult += `; observed source SHA ${observedSha}; application matches: ${candidate.application === 'codex-ext1'}`;
      if (candidate.application === 'codex-ext1' && candidate.sourceCommit === sha) { manifest = candidate; break; }
    }
  } catch (error) { lastResult = `Request/JSON error: ${error.name}`; }
  console.log(`Live probe ${attempt + 1}: ${lastResult}`);
  if (attempt < 23) await new Promise(resolve => setTimeout(resolve, 5000));
}
if (!manifest) throw new Error(`Live release verification failed: ${lastResult}`);
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
