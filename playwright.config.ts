import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: ['**/*.pl.ts', '**/*.pl.tsx'],
  timeout: 10000,
  use: {
    baseURL: 'http://localhost:4000',
    headless: true,
  },
  webServer: {
    command: 'npm start',
    port: 4000,
    reuseExistingServer: !process.env.CI,
  },
});
