import { defineConfig } from 'vitest/config';

export default defineConfig({
  base: '/codex-ext1/',
  build: { sourcemap: false, modulePreload: { polyfill: false } },
  test: { include: ['tests/*.test.ts'] },
});
