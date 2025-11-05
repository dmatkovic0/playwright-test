import { test, expect } from '@playwright/test';
import { login, ensureSidebarExpanded, openPeople } from '../src/utils.js';
import { addEmployeeOnboardingChecklist, addEmployeePrehireChecklist, addEmployeeNoAutoAssignmentChecklist } from '../src/addEmployee.js';

test('test', async ({ page }) => {
  // Increase timeout for this test
  test.setTimeout(60000);
  
  await login('stg', 'hr2admin222@mail.com', 'Password123!!', page);
  
  // Ensure sidebar is expanded
  await ensureSidebarExpanded(page);
  
  // Open People page
  await openPeople(page, expect);
  
  // Add employee with onboarding checklist
  await addEmployeeOnboardingChecklist(page, expect);
  
  // Pause to keep browser open
  await page.pause();
});

test('test2', async ({ page }) => {
  // Increase timeout for this test
  test.setTimeout(60000);
  
  await login('stg', 'hr2admin222@mail.com', 'Password123!!', page);
  
  // Ensure sidebar is expanded
  await ensureSidebarExpanded(page);
  
  // Open People page
  await openPeople(page, expect);
  
  // Add employee with prehire checklist
  await addEmployeePrehireChecklist(page, expect);
  
  // Pause to keep browser open
  await page.pause();
});

test('test3', async ({ page }) => {
  // Increase timeout for this test
  test.setTimeout(60000);
  
  await login('stg', 'hr2admin222@mail.com', 'Password123!!', page);
  
  // Ensure sidebar is expanded
  await ensureSidebarExpanded(page);
  
  // Open People page
  await openPeople(page, expect);
  
  // Add employee with no auto assignment
  await addEmployeeNoAutoAssignmentChecklist(page, expect);
  
  // Pause to keep browser open
  await page.pause();
});

test('test4', async ({ page }) => {
  await page.goto('https://corehr.staging.hrcloud.net/Start/#/Authentication/Login?returnUrl=');
  await page.getByRole('textbox', { name: 'Enter Account Email or Phone' }).click();
  await page.getByRole('link', { name: 'Positions' }).click();
  await page.getByRole('link', { name: '' }).click();
  await page.getByRole('textbox', { name: 'Position Title*' }).click();
  await page.getByRole('textbox', { name: 'Position Title*' }).fill('guid1');
  await page.getByRole('textbox', { name: 'Position Code*' }).click();
  await page.getByRole('textbox', { name: 'Position Code*' }).fill('guid2');
  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByRole('textbox', { name: 'Position Title' }).click();
  await page.getByRole('textbox', { name: 'Position Title' }).fill('guid1');
  await page.getByRole('link', { name: 'guid1' }).click();
});