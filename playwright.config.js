// playwright.config.js
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './test',
  timeout: 30000,
  use: {
    baseURL: 'https://corehr.staging.hrcloud.net/Start/#/Authentication/Login?returnUrl=', 
    headless: false, 
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
});