import { generateShortID } from './utils.js';

export async function addEmployeeOnboardingChecklist(page, expect) {
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
  
  // Click add button
  await page.locator('.aut-button-add').click();
  
  // Fill First Name
  await page.getByRole('textbox', { name: 'First Name*' }).click();
  await page.getByRole('textbox', { name: 'First Name*' }).fill(firstName);
  
  // Fill Last Name
  await page.getByRole('textbox', { name: 'Last Name*' }).click();
  await page.getByRole('textbox', { name: 'Last Name*' }).fill(lastName);
  
  // Fill Account Email
  await page.getByRole('textbox', { name: 'Account Email*' }).click();
  await page.getByRole('textbox', { name: 'Account Email*' }).fill(`${uniqueID}@mail.com`);
  
  // Fill Start Date with today's date
  await page.getByRole('textbox', { name: 'Start Date*' }).click();
  await page.getByRole('textbox', { name: 'Start Date*' }).fill(todayFormatted);
  await page.getByRole('textbox', { name: 'Start Date*' }).press('Enter');
  
  // Select second option in department dropdown
  await page.getByRole('button', { name: 'Enter department... ' }).click();
  await page.waitForTimeout(500);
  await page.waitForSelector('ul.dropdown-menu[role="menu"]:visible li[ng-repeat="item in data"]');
  const departmentItems = await page.locator('ul.dropdown-menu[role="menu"]:visible li[ng-repeat="item in data"]').all();
  if (departmentItems.length > 1) {
    await departmentItems[1].click();
  } else {
    await departmentItems[0].click();
  }
  
  // Select second option in position dropdown
  await page.getByRole('button', { name: 'Enter position... ' }).click();
  await page.waitForTimeout(500);
  await page.waitForSelector('ul.dropdown-menu[role="menu"]:visible li[ng-repeat="item in data"]');
  const positionItems = await page.locator('ul.dropdown-menu[role="menu"]:visible li[ng-repeat="item in data"]').all();
  if (positionItems.length > 1) {
    await positionItems[1].click();
  } else {
    await positionItems[0].click();
  }
  
  // Select second option in location dropdown
  await page.getByRole('button', { name: 'Enter location... ' }).click();
  await page.waitForTimeout(500);
  await page.waitForSelector('ul.dropdown-menu[role="menu"]:visible li[ng-repeat="item in data"]');
  const locationItems = await page.locator('ul.dropdown-menu[role="menu"]:visible li[ng-repeat="item in data"]').all();
  if (locationItems.length > 1) {
    await locationItems[1].click();
  } else {
    await locationItems[0].click();
  }
  
  // Click Save
  await page.getByRole('button', { name: 'Save' }).click();
  
  // Verify employee was created successfully
  await expect(page.locator(`text=${firstName}`).or(page.locator(`text=${lastName}`))).toBeVisible({ timeout: 15000 });
  await expect(page.locator(`text=${firstName}`)).toBeVisible();
  await expect(page.locator(`text=${lastName}`)).toBeVisible();
  
  console.log(`✓ Employee created successfully: ${firstName} ${lastName} with start date: ${todayFormatted}`);
  
  // Return employee details for further use if needed
  return {
    firstName,
    lastName,
    email: `${uniqueID}@mail.com`,
    startDate: todayFormatted
  };
}

export async function addEmployeePrehireChecklist(page, expect) {
  // Generate unique identifiers for first and last name
  const uniqueID = generateShortID();
  const firstName = `First_${uniqueID}`;
  const lastName = `Last_${uniqueID}`;
  
  // Click add button
  await page.locator('.aut-button-add').click();
  
  // Fill First Name
  await page.getByRole('textbox', { name: 'First Name*' }).click();
  await page.getByRole('textbox', { name: 'First Name*' }).fill(firstName);
  
  // Fill Last Name
  await page.getByRole('textbox', { name: 'Last Name*' }).click();
  await page.getByRole('textbox', { name: 'Last Name*' }).fill(lastName);
  
  // Fill Account Email
  await page.getByRole('textbox', { name: 'Account Email*' }).click();
  await page.getByRole('textbox', { name: 'Account Email*' }).fill(`${uniqueID}@mail.com`);
  
  // Click on Prehire Checklist option
  await page.locator('//div[@ng-click="vm.setAutomaticTaskAssignmentOption(\'Prehire\')"]//div[@class=\'widget-content\']').click();
  
  // Click Save
  await page.getByRole('button', { name: 'Save' }).click();
  
  // Verify employee was created successfully
  await expect(page.locator(`text=${firstName}`).or(page.locator(`text=${lastName}`))).toBeVisible({ timeout: 15000 });
  await expect(page.locator(`text=${firstName}`)).toBeVisible();
  await expect(page.locator(`text=${lastName}`)).toBeVisible();
  
  console.log(`✓ Employee with Prehire Checklist created successfully: ${firstName} ${lastName}`);
  
  // Return employee details for further use if needed
  return {
    firstName,
    lastName,
    email: `${uniqueID}@mail.com`
  };
}

export async function addEmployeeNoAutoAssignmentChecklist(page, expect) {
  // Generate unique identifiers for first and last name
  const uniqueID = generateShortID();
  const firstName = `First_${uniqueID}`;
  const lastName = `Last_${uniqueID}`;
  
  // Click add button
  await page.locator('.aut-button-add').click();
  
  // Fill First Name
  await page.getByRole('textbox', { name: 'First Name*' }).click();
  await page.getByRole('textbox', { name: 'First Name*' }).fill(firstName);
  
  // Fill Last Name
  await page.getByRole('textbox', { name: 'Last Name*' }).click();
  await page.getByRole('textbox', { name: 'Last Name*' }).fill(lastName);
  
  // Fill Account Email
  await page.getByRole('textbox', { name: 'Account Email*' }).click();
  await page.getByRole('textbox', { name: 'Account Email*' }).fill(`${uniqueID}@mail.com`);
  
  // Click on No Auto Assignment option
  await page.locator('//div[@ng-click="vm.setAutomaticTaskAssignmentOption(\'None\')"]//div[@class=\'widget-content\']').click();
  
  // Click Save
  await page.getByRole('button', { name: 'Save' }).click();
  
  // Verify employee was created successfully
  await expect(page.locator(`text=${firstName}`).or(page.locator(`text=${lastName}`))).toBeVisible({ timeout: 15000 });
  await expect(page.locator(`text=${firstName}`)).toBeVisible();
  await expect(page.locator(`text=${lastName}`)).toBeVisible();
  
  console.log(`✓ Employee with No Auto Assignment created successfully: ${firstName} ${lastName}`);
  
  // Return employee details for further use if needed
  return {
    firstName,
    lastName,
    email: `${uniqueID}@mail.com`
  };
}