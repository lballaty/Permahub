/*
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/playwright.config.js
 * Description: Playwright E2E testing configuration with comprehensive test suite support
 * Author: Libor Ballaty <libor@arionetworks.com>
 * Created: 2025-11-07
 * Last Updated: 2025-11-16
 */

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Test directories - supports unit, integration, and e2e tests
  testDir: './tests',

  // Test matching patterns
  testMatch: '**/*.spec.js',

  // Timeout settings
  timeout: 30000, // 30 seconds per test
  expect: {
    timeout: 5000 // 5 seconds for assertions
  },

  // Parallel execution
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  // Enhanced reporting
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }],
    // Uncomment for CI/CD
    // ['junit', { outputFile: 'test-results/junit.xml' }],
    // ['github']
  ],

  // Global test configuration
  use: {
    baseURL: 'http://localhost:3001',

    // Tracing and debugging
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    // Browser context options
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,

    // Capture HAR for network debugging
    // harPath: process.env.CI ? undefined : './test-results/har/',

    // Action timeouts
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },

  // Test projects - browser configurations
  projects: [
    // Desktop browsers
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Tag-based configuration
        launchOptions: {
          slowMo: process.env.SLOW_MO ? 100 : 0
        }
      }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    },
    {
      name: 'edge',
      use: {
        ...devices['Desktop Edge'],
        channel: 'msedge'
      }
    },

    // Mobile browsers
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
      // Only run mobile tests tagged with @mobile
      grep: /@mobile/
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
      grep: /@mobile/
    },

    // Tablet
    {
      name: 'tablet',
      use: { ...devices['iPad Pro'] },
      grep: /@tablet|@mobile/
    }
  ],

  // Commented out to use manually started dev server
  // Uncomment for automatic server management
  // webServer: {
  //   command: 'npm run dev',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  //   timeout: 120000,
  //   stdout: 'pipe',
  //   stderr: 'pipe'
  // }
});
