import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  reporter: 'list',
  projects: [
    {
      name: 'api',
      use: {
        baseURL: process.env.API_BASE_URL ?? 'http://127.0.0.1:3333',
        extraHTTPHeaders: { Accept: 'application/json' },
      },
    },
  ],
});
