// playwright.config.js
const { defineConfig } = require('@playwright/test');
require('dotenv').config();

// AIO Tests Configuration
const aioConfig = {
  cloud: true, // Set to true for Jira Cloud
  jiraUrl: process.env.AIO_JIRA_URL || 'https://yourcompany.atlassian.net',
  apiKey: process.env.AIO_API_KEY || '',
  projectKey: process.env.AIO_PROJECT_KEY || '',

  // Optional: Specify cycle key to update existing cycle, otherwise a new cycle will be created
  cycleKey: process.env.AIO_CYCLE_KEY || undefined,

  // Optional: Create a new cycle with this name if cycleKey is not specified
  createNewCycle: true,
  cycleName: `Playwright Test Run - ${new Date().toISOString().split('T')[0]}`,

  // Optional: Upload attachments for failed tests
  uploadAttachments: true,
};

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30000,
  workers: 2,
  use: {
    baseURL: 'https://corehr.staging.hrcloud.net/Start/#/Authentication/Login?returnUrl=',
    headless: false,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    viewport: null,
    permissions: [],
    geolocation: undefined,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        launchOptions: {
          args: ['--start-maximized']
        }
      },
    },
  ],

  // Reporters configuration
  reporter: [
    ['list'], // Default console reporter
    ['html'], // HTML report
    ['aiotests-playwright-reporter', { aioConfig }], // AIO Tests reporter
  ],
});