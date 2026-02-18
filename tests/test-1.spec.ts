import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  // Recording...
  await page.getByRole('link', { name: 'People' }).click();
  await page.locator('tr:nth-child(22) > .chk-col > .input-helper').click();
  await page.getByText('Actions').click();
  await page.getByText('Delete employee', { exact: true }).click();
  await page.getByRole('button', { name: 'Delete Employee' }).click();
  await page.getByRole('textbox', { name: 'First Name' }).click();
});