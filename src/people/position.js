import { generateShortID } from '../utils.js';

export async function addPosition(page, expect) {
  // Generate unique identifiers for position title and code
  const uniqueID = generateShortID();
  const positionTitle = `Position_${uniqueID}`;
  const positionCode = `Code_${uniqueID}`;
  
  // Click add button - using more specific selector
  await page.locator('.aut-button-add').click();
  
  // Fill Position Title
  await page.getByRole('textbox', { name: 'Position Title*' }).click();
  await page.getByRole('textbox', { name: 'Position Title*' }).fill(positionTitle);
  
  // Fill Position Code
  await page.getByRole('textbox', { name: 'Position Code*' }).click();
  await page.getByRole('textbox', { name: 'Position Code*' }).fill(positionCode);
  
  // Click Save
  await page.getByRole('button', { name: 'Save' }).click();
  
  // Wait for save to complete and return to positions list
  await page.waitForTimeout(2000);
  
  // Search for the created position using the search field (first one)
  await page.getByRole('textbox', { name: 'Position Title' }).first().click();
  await page.getByRole('textbox', { name: 'Position Title' }).first().fill(positionTitle);
  
  // Wait for search results
  await page.waitForTimeout(1000);
  
  // Click on the position link
  await page.getByRole('link', { name: positionTitle }).click();
  
  // Verify position page is loaded
  await expect(page.locator(`text=${positionTitle}`)).toBeVisible({ timeout: 10000 });
  
  console.log(`✓ Position created successfully: ${positionTitle} with code: ${positionCode}`);
  
  // Return position details for further use if needed
  return {
    positionTitle,
    positionCode
  };
}

// Open Positions page and verify
export async function openPositions(page, expect) {
  await page.getByRole('link', { name: 'Positions' }).click();
  // Add verification if there's a heading or specific element on Positions page
  await page.waitForTimeout(500);
}