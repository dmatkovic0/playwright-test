import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://corehr.staging.hrcloud.net/Start/#/Authentication/Login?returnUrl=');
  await page.getByRole('textbox', { name: 'Enter Account Email or Phone' }).dblclick();
  await page.locator('#custom-login-container iframe').contentFrame().getByRole('button', { name: 'Accept' }).click();
  await page.getByRole('textbox', { name: 'Enter Account Email or Phone' }).click();
  await page.getByRole('textbox', { name: 'Enter Account Email or Phone' }).fill('hr2admin222@mail.com');
  await page.getByRole('textbox', { name: 'Enter Password' }).click();
  await page.getByRole('textbox', { name: 'Enter Password' }).fill('Password123!!');
  await page.getByRole('button', { name: 'Sign In Securely' }).click();
  await page.locator('[data-test-id="chat-widget-iframe"]').contentFrame().locator('[data-test-id="ai-welcome-msg-close-button"]').click();
  await page.getByRole('link', { name: 'People' }).click();
});