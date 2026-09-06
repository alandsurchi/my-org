import { defineConfig, devices } from '@playwright/test';

const WEB_PORT = process.env.E2E_WEB_PORT || '4101';

/**
 * End-to-end tests run against the real production web server and backend
 * (see e2e/stack.mjs). `npm run build` must have produced dist/ first.
 */
export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list']],
  use: {
    baseURL: `http://127.0.0.1:${WEB_PORT}`,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  // Locally, reuse the Google Chrome already installed (no 200 MB download); CI installs Chromium.
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], channel: process.env.CI ? undefined : 'chrome' } },
    { name: 'mobile', use: { ...devices['Pixel 7'], channel: process.env.CI ? undefined : 'chrome' }, testMatch: /public\.spec\.ts/ },
  ],
  webServer: {
    command: 'node e2e/stack.mjs',
    url: `http://127.0.0.1:${WEB_PORT}/api/health`,
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
  },
});
