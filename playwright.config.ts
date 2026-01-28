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
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['list'],
    ['allure-playwright'],
  ],
  globalSetup: "./src/utils/global-setup.ts",
  use: {
    baseURL: process.env.BASE_URL || 'https://www.saucedemo.com/',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: "sauceDemo",
      testMatch: "**/specs/sauceDemo.spec.ts",
      fullyParallel: true,
      use: { 
        ...devices['Desktop Chrome'],
        ignoreHTTPSErrors: true,
        testIdAttribute: 'data-test',
        headless: false
      },
    },

   
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run dev',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
