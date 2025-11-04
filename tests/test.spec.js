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
  
  // Get today's date formatted as MM/DD/YYYY
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const year = today.getFullYear();
  const todayFormatted = `${month}/${day}/${year}`;
  
  await page.locator('.aut-button-add').click();
  await page.getByRole('textbox', { name: 'First Name*' }).click();
  await page.getByRole('textbox', { name: 'First Name*' }).fill(firstName);
  await page.getByRole('textbox', { name: 'Last Name*' }).click();
  await page.getByRole('textbox', { name: 'Last Name*' }).fill(lastName);
  await page.getByRole('textbox', { name: 'Account Email*' }).click();
  await page.getByRole('textbox', { name: 'Account Email*' }).fill(`${uniqueID}@mail.com`);
  
  // Fill Start Date with today's date
  await page.getByRole('textbox', { name: 'Start Date*' }).click();
  await page.getByRole('textbox', { name: 'Start Date*' }).fill(todayFormatted);
  await page.getByRole('textbox', { name: 'Start Date*' }).press('Enter');
  
  // Select second option in department dropdown
  await page.getByRole('button', { name: 'Enter department... ' }).click();
  // Wait a bit for dropdown to fully render
  await page.waitForTimeout(500);
  // Wait for dropdown items to be visible
  await page.waitForSelector('ul.dropdown-menu[role="menu"]:visible li[ng-repeat="item in data"]');
  // Get all visible department items and click the second one
  const departmentItems = await page.locator('ul.dropdown-menu[role="menu"]:visible li[ng-repeat="item in data"]').all();
  if (departmentItems.length > 1) {
    await departmentItems[1].click();
  } else {
    await departmentItems[0].click();
  }
  
  // Select second option in position dropdown
  await page.getByRole('button', { name: 'Enter position... ' }).click();
  // Wait a bit for dropdown to fully render
  await page.waitForTimeout(500);
  // Wait for dropdown items to be visible
  await page.waitForSelector('ul.dropdown-menu[role="menu"]:visible li[ng-repeat="item in data"]');
  // Get all visible position items and click the second one
  const positionItems = await page.locator('ul.dropdown-menu[role="menu"]:visible li[ng-repeat="item in data"]').all();
  if (positionItems.length > 1) {
    await positionItems[1].click();
  } else {
    await positionItems[0].click();
  }
  // Select second option in location dropdown
  await page.getByRole('button', { name: 'Enter location... ' }).click();
  // Wait a bit for dropdown to fully render
  await page.waitForTimeout(500);
  // Wait for dropdown items to be visible
  await page.waitForSelector('ul.dropdown-menu[role="menu"]:visible li[ng-repeat="item in data"]');
  // Get all visible location items and click the second one
  const locationItems = await page.locator('ul.dropdown-menu[role="menu"]:visible li[ng-repeat="item in data"]').all();
  if (locationItems.length > 1) {
    await locationItems[1].click();
  } else {
    await locationItems[0].click();
  }
  await page.getByRole('button', { name: 'Save' }).click();
  
  // Verify employee was created successfully
  // Wait for either the first name or last name to appear on the page
  await expect(page.locator(`text=${firstName}`).or(page.locator(`text=${lastName}`))).toBeVisible({ timeout: 15000 });
  
  // Additional verification - check both names are present
  await expect(page.locator(`text=${firstName}`)).toBeVisible();
  await expect(page.locator(`text=${lastName}`)).toBeVisible();
  
  console.log(`✓ Employee created successfully: ${firstName} ${lastName} with start date: ${todayFormatted}`);

  await page.pause();

  
});