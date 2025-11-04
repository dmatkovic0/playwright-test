import { test, expect } from '@playwright/test';
import { login, generateShortID } from '../src/utils.js';

test('test', async ({ page }) => {
  await login('stg', 'hr2admin222@mail.com', 'Password123!!', page);
  
  await page.getByRole('link', { name: 'People' }).click();
  await expect(page.getByRole('heading').getByText('People')).toBeVisible();
  
  // Generate unique identifiers for first and last name
  const uniqueID = generateShortID();
  const firstName = `First_${uniqueID}`;
  const lastName = `Last_${uniqueID}`;
  
  await page.locator('.aut-button-add').click();
  await page.getByRole('textbox', { name: 'First Name*' }).click();
  await page.getByRole('textbox', { name: 'First Name*' }).fill(firstName);
  await page.getByRole('textbox', { name: 'Last Name*' }).click();
  await page.getByRole('textbox', { name: 'Last Name*' }).fill(lastName);
  await page.getByRole('textbox', { name: 'Account Email*' }).click();
  await page.getByRole('textbox', { name: 'Account Email*' }).fill(`${uniqueID}@mail.com`);
  await page.getByRole('textbox', { name: 'Start Date*' }).click();
  await page.getByRole('link', { name: '4', exact: true }).click();
  await page.getByRole('button', { name: 'Enter department... ' }).click();
  await page.locator('a').filter({ hasText: 'Client Services' }).click();
  await page.getByRole('button', { name: 'Enter position... ' }).click();
  await page.locator('a').filter({ hasText: 'Chief Executive Officer' }).click();
  await page.getByRole('button', { name: 'Enter location... ' }).click();
  await page.getByText('afgannnn').click();
  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByRole('button', { name: ' Back' }).click();
  await page.getByRole('textbox', { name: 'First Name' }).click();
  await page.getByRole('textbox', { name: 'First Name' }).fill(firstName.toLowerCase());
  await page.getByRole('link', { name: firstName }).click();
  await page.pause ();
});