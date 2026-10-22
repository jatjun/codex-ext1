import { defineConfig } from '@playwright/test';
import { existsSync } from 'node:fs';

// BASE_URL can point the same tests at the live Pages site after deployment.
const baseURL = process.env.BASE_URL || 'http://127.0.0.1:4173/codex-ext1/';
export default defineConfig({
  testDir: 'tests/browser',
  use: {
    baseURL,
    launchOptions: {
      executablePath: existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined,
      args: ['--no-sandbox'],
    },
  },
  ...(process.env.BASE_URL ? {} : {
    webServer: {
      command: 'npm run preview -- --port 4173 --strictPort',
      url: baseURL,
      reuseExistingServer: false,
    },
  }),
});
