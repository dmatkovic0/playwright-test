import { generateShortID } from '../utils.js';

export async function addDepartment(page, expect) {
  // Generate unique identifiers for department name and code
  const uniqueID = generateShortID();
  const departmentName = `Department_${uniqueID}`;
  const departmentCode = `DEPT_${uniqueID}`;

  // Click add button - using more specific selector
  await page.locator('.aut-button-add').click();

  // Fill Department Name
  await page.getByRole('textbox', { name: 'Department Name*' }).click();
  await page.getByRole('textbox', { name: 'Department Name*' }).fill(departmentName);

  // Fill Department Code
  await page.getByRole('textbox', { name: 'Department Code*' }).click();
  await page.getByRole('textbox', { name: 'Department Code*' }).fill(departmentCode);

  // Click Save
  await page.getByRole('button', { name: 'Save' }).click();

  // Wait for save to complete and return to departments list
  await page.waitForTimeout(2000);

  // Search for the created department using the search field
  await page.getByRole('textbox', { name: 'Department Name' }).first().click();
  await page.getByRole('textbox', { name: 'Department Name' }).first().fill(departmentName);

  // Wait for search results
  await page.waitForTimeout(1000);

  // Click on the department link
  await page.getByRole('link', { name: departmentName }).click();

  // Verify department page is loaded
  await expect(page.locator(`text=${departmentName}`)).toBeVisible({ timeout: 10000 });

  console.log(`✓ Department created successfully: ${departmentName}`);

  // Return department details for further use if needed
  return {
    departmentName
  };
}

// Open Departments page and verify
export async function openDepartments(page, expect) {
  await page.getByRole('link', { name: 'More', exact: true }).click();
  await page.getByRole('link', { name: 'Departments' }).click();
  // Add verification if there's a heading or specific element on Departments page
  await page.waitForTimeout(500);
}

// Update existing department
export async function updateDepartment(page, expect) {
  // Generate unique identifier for updated code
  const uniqueID = generateShortID();
  const updatedDepartmentCode = `UpdatedDEPT_${uniqueID}`;

  // Wait for the grid to load
  await page.waitForTimeout(1000);

  // Get the first department from the list using the specific class
  const firstDepartmentLink = page.locator('.aut-button-xDepartmentDetail').first();

  // Get the department name for verification
  const departmentName = await firstDepartmentLink.textContent();

  // Click on the first department
  await firstDepartmentLink.click();

  // Wait for department details page to load
  await page.waitForTimeout(1000);

  // Click edit button
  await page.getByRole('button', { name: 'Edit' }).click();

  // Wait for edit form to load
  await page.waitForTimeout(500);

  // Update Department Code
  await page.getByRole('textbox', { name: 'Department Code*' }).click();
  await page.getByRole('textbox', { name: 'Department Code*' }).fill('');
  await page.getByRole('textbox', { name: 'Department Code*' }).fill(updatedDepartmentCode);

  // Click Save
  await page.getByRole('button', { name: 'Save' }).click();

  // Wait for save to complete and flyout to close automatically
  await page.waitForTimeout(3000);

  console.log(`✓ Department updated successfully: ${departmentName} with new code: ${updatedDepartmentCode}`);

  // Search for the department using the updated department code
  await page.locator('//input[@placeholder=\'Department Code\']').first().click();
  await page.locator('//input[@placeholder=\'Department Code\']').first().fill(updatedDepartmentCode);
  await page.locator('//input[@placeholder=\'Department Code\']').first().press('Enter');

  // Wait for search results
  await page.waitForTimeout(1000);

  // Verify that the department is displayed in the grid
  const departmentLink = page.locator('.aut-button-xDepartmentDetail').first();
  await expect(departmentLink).toBeVisible({ timeout: 10000 });

  // Click on the department to open it
  await departmentLink.click();

  // Wait for department details page to load
  await page.waitForTimeout(1500);

  // Verify department page is loaded (using the detail page heading)
  await expect(page.locator('#details-xDepartment-xDepartmentName')).toBeVisible({ timeout: 10000 });

  console.log(`✓ Department verified successfully: ${departmentName} with code: ${updatedDepartmentCode}`);

  // Return department details for further use if needed
  return {
    departmentName: departmentName.trim(),
    updatedDepartmentCode
  };
}
