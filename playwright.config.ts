import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';
import * as fs from 'fs';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

// Clean up allure results before each run
const allureResultsDir = './allure-results';
if (fs.existsSync(allureResultsDir)) {
  fs.rmSync(allureResultsDir, { recursive: true });
}

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './src/tests',
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 3 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['list'],
    ['allure-playwright', {
      outputFolder: process.env.ALLURE_RESULTS || 'allure-results'
    }],
    ['blob', { outputFolder: process.env.BLOB_REPORT || 'blob-report' }]
  ],
  globalSetup: "./src/utils/global-setup.ts",
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: "sauceDemo",
      testMatch: "**/specs/ui/sauceDemo.spec.ts",
      fullyParallel: true,
      use: { 
        ...devices['Desktop Chrome'],
        ignoreHTTPSErrors: true,
        testIdAttribute: 'data-test',
        headless: !!process.env.CI
      }
    },
    {
        name: "fakeStoreAPI",
        testMatch: "**/specs/api/fakestore.spec.ts",
        use: {
            ignoreHTTPSErrors: true,
            extraHTTPHeaders: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'application/json',
            'Accept-Language': 'en-US,en;q=0.9'
        } 
        },
    }
  ],
});
