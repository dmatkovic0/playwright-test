import { generateShortID } from '../utils.js';

export async function addLocation(page, expect) {
  // Generate unique identifiers for location name and code
  const uniqueID = generateShortID();
  const locationName = `Location_${uniqueID}`;
  const locationCode = `LOC_${uniqueID}`;

  // Click add button - using more specific selector
  await page.locator('.aut-button-add').click();

  // Fill Location Name
  await page.getByRole('textbox', { name: 'Location Name*' }).click();
  await page.getByRole('textbox', { name: 'Location Name*' }).fill(locationName);

  // Fill Location Code
  await page.getByRole('textbox', { name: 'Location Code*' }).click();
  await page.getByRole('textbox', { name: 'Location Code*' }).fill(locationCode);

  // Click Save
  await page.getByRole('button', { name: 'Save' }).click();

  // Wait for save to complete and return to locations list
  await page.waitForTimeout(2000);

  // Search for the created location using the search field
  await page.getByRole('textbox', { name: 'Location Name' }).first().click();
  await page.getByRole('textbox', { name: 'Location Name' }).first().fill(locationName);

  // Wait for search results
  await page.waitForTimeout(1000);

  // Click on the location link
  await page.getByRole('link', { name: locationName }).click();

  // Verify location page is loaded
  await expect(page.locator(`text=${locationName}`)).toBeVisible({ timeout: 10000 });

  console.log(`✓ Location created successfully: ${locationName}`);

  // Return location details for further use if needed
  return {
    locationName
  };
}

// Open Locations page and verify
export async function openLocations(page, expect) {
  await page.getByRole('link', { name: 'More', exact: true }).click();
  await page.getByRole('link', { name: 'Locations' }).click();
  // Add verification if there's a heading or specific element on Locations page
  await page.waitForTimeout(500);
}

// Update existing location
export async function updateLocation(page, expect) {
  // Generate unique identifier for updated code
  const uniqueID = generateShortID();
  const updatedLocationCode = `UpdatedLOC_${uniqueID}`;

  // Wait for the grid to load
  await page.waitForTimeout(1000);

  // Get the first location from the list using the specific class
  const firstLocationLink = page.locator('.aut-button-xLocationDetail').first();

  // Get the location name for verification
  const locationName = await firstLocationLink.textContent();

  // Click on the first location
  await firstLocationLink.click();

  // Wait for location details page to load
  await page.waitForTimeout(1000);

  // Click edit button
  await page.getByRole('button', { name: 'Edit' }).click();

  // Wait for edit form to load
  await page.waitForTimeout(500);

  // Update Location Code
  await page.getByRole('textbox', { name: 'Location Code*' }).click();
  await page.getByRole('textbox', { name: 'Location Code*' }).fill('');
  await page.getByRole('textbox', { name: 'Location Code*' }).fill(updatedLocationCode);

  // Click Save
  await page.getByRole('button', { name: 'Save' }).click();

  // Wait for save to complete and flyout to close automatically
  await page.waitForTimeout(3000);

  console.log(`✓ Location updated successfully: ${locationName} with new code: ${updatedLocationCode}`);

  // Search for the location using the updated location code
  await page.locator('//input[@placeholder=\'Location Code\']').click();
  await page.locator('//input[@placeholder=\'Location Code\']').fill(updatedLocationCode);
  await page.locator('//input[@placeholder=\'Location Code\']').press('Enter');

  // Wait for search results
  await page.waitForTimeout(1000);

  // Verify that the location is displayed in the grid
  const locationLink = page.locator('.aut-button-xLocationDetail').first();
  await expect(locationLink).toBeVisible({ timeout: 10000 });

  // Click on the location to open it
  await locationLink.click();

  // Wait for location details page to load
  await page.waitForTimeout(1500);

  // Verify location page is loaded (using the detail page heading)
  await expect(page.locator('#details-xLocation-xLocationName')).toBeVisible({ timeout: 10000 });

  console.log(`✓ Location verified successfully: ${locationName} with code: ${updatedLocationCode}`);

  // Return location details for further use if needed
  return {
    locationName: locationName.trim(),
    updatedLocationCode
  };
}
