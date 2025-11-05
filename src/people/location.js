import { generateShortID } from '../utils.js';

export async function addLocation(page, expect) {
  // Generate unique identifiers for location name
  const uniqueID = generateShortID();
  const locationName = `Location_${uniqueID}`;

  // Click add button - using more specific selector
  await page.locator('.aut-button-add').click();

  // Fill Location Name
  await page.getByRole('textbox', { name: 'Location Name*' }).click();
  await page.getByRole('textbox', { name: 'Location Name*' }).fill(locationName);

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
