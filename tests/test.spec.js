import { test, expect } from '@playwright/test';
import { login, generateShortID } from '../src/utils.js';

test('test', async ({ page }) => {
  // Increase timeout for this test
  test.setTimeout(60000);
  
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
  
  // Verify employee was created successfully
  // Wait for either the first name or last name to appear on the page
  await expect(page.locator(`text=${firstName}`).or(page.locator(`text=${lastName}`))).toBeVisible({ timeout: 15000 });
  
  // Additional verification - check both names are present
  await expect(page.locator(`text=${firstName}`)).toBeVisible();
  await expect(page.locator(`text=${lastName}`)).toBeVisible();
  
  console.log(`✓ Employee created successfully: ${firstName} ${lastName}`);
});