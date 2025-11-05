// playwright.config.js
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30000,
  use: {
    baseURL: 'https://corehr.staging.hrcloud.net/Start/#/Authentication/Login?returnUrl=', 
    headless: false, 
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    viewport: null, // Disable fixed viewport
    permissions: [], // Deny all permissions
    geolocation: undefined, // Don't set geolocation
  },
  projects: [
    {
      name: 'chromium',
      use: { 
        browserName: 'chromium',
        launchOptions: {
          args: ['--start-maximized'] // Open Chrome in maximized window
        }
      },
    },
  ],
});