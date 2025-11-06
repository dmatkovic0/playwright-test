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

// Update existing position
export async function updatePosition(page, expect) {
  // Generate unique identifier for updated code
  const uniqueID = generateShortID();
  const updatedPositionCode = `UpdatedCode_${uniqueID}`;

  // Wait for the grid to load
  await page.waitForTimeout(1000);

  // Get the first position from the list using the specific class
  const firstPositionLink = page.locator('.aut-button-xPositionDetail').first();

  // Get the position title for verification
  const positionTitle = await firstPositionLink.textContent();

  // Click on the first position
  await firstPositionLink.click();

  // Wait for position details page to load
  await page.waitForTimeout(1000);

  // Click edit button
  await page.getByRole('button', { name: 'Edit' }).click();

  // Wait for edit form to load
  await page.waitForTimeout(500);

  // Update Position Code
  await page.getByRole('textbox', { name: 'Position Code*' }).click();
  await page.getByRole('textbox', { name: 'Position Code*' }).fill('');
  await page.getByRole('textbox', { name: 'Position Code*' }).fill(updatedPositionCode);

  // Click Save
  await page.getByRole('button', { name: 'Save' }).click();

  // Wait for save to complete and flyout to close automatically
  await page.waitForTimeout(3000);

  console.log(`✓ Position updated successfully: ${positionTitle} with new code: ${updatedPositionCode}`);

  // Search for the position using the updated position code
  await page.locator('//input[@placeholder=\'Position Code\']').click();
  await page.locator('//input[@placeholder=\'Position Code\']').fill(updatedPositionCode);
  await page.locator('//input[@placeholder=\'Position Code\']').press('Enter');

  // Wait for search results
  await page.waitForTimeout(1000);

  // Verify that the position is displayed in the grid
  const positionLink = page.locator('.aut-button-xPositionDetail').first();
  await expect(positionLink).toBeVisible({ timeout: 10000 });

  // Click on the position to open it
  await positionLink.click();

  // Wait for position details page to load
  await page.waitForTimeout(1500);

  // Verify position page is loaded (using the detail page heading)
  await expect(page.locator('#details-xPosition-xPositionTitle')).toBeVisible({ timeout: 10000 });

  console.log(`✓ Position verified successfully: ${positionTitle} with code: ${updatedPositionCode}`);

  // Return position details for further use if needed
  return {
    positionTitle: positionTitle.trim(),
    updatedPositionCode
  };
}