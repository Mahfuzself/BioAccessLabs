import { defineConfig, devices } from '@playwright/test';
import { envConfig } from './src/config/environment.config';

export default defineConfig({
  testDir: './tests/ui',
  testMatch : [
    '**/*loginTest.ts',
    '**/*/smokeTest.ts',
    '**/*/smoke/complete.smoke.spec.ts',
    '**/*/regression/login.regression.spec.ts',
    '**/*/e2eTest.ts'
  ],
  timeout: 30 * 1000,
  expect: { timeout: 5000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
      ['html', { open: 'always', outputFolder: 'reports/html-report' }],
      ['json', { outputFile: 'reports/test-results.json' }],
      ['junit', { outputFile: 'reports/junit-results.xml' }],
      ['allure-playwright', { 
        outputFolder: 'reports/allure-results',
        detail: true,
        suiteTitle: true
      }],
      ['list']
  ],
  use: {
    baseURL: envConfig.baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10000,
    navigationTimeout: 15000,
    ignoreHTTPSErrors: true,
    viewport: { width: 1280, height: 720 },
    headless:false
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    // { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    // { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
    // { name: 'mobile-safari', use: { ...devices['iPhone 17'] } },
  ],
  outputDir: 'test-results/',
});
