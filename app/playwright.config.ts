import { defineConfig, devices } from '@playwright/test';

// Browser-level smoke test (Phase 7 Stage 4). Runs against the production
// build served by `vite preview`, under the same /workout-blueprint/ base
// path GitHub Pages uses, so a broken route, link, asset or stylesheet in
// the real bundle fails here. Unit and component behaviour stays in Vitest.
const PORT = 4173;

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.e2e.ts',
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: `http://localhost:${PORT}/workout-blueprint/`,
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `npm run build && npx vite preview --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}/workout-blueprint/`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
