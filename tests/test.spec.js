import { test, expect } from '@playwright/test';
import { login, ensureSidebarExpanded, openPeople } from '../src/utils.js';
import { addEmployeeOnboardingChecklist, addEmployeePrehireChecklist, addEmployeeNoAutoAssignmentChecklist } from '../src/people/addEmployee.js';
import { addPosition, openPositions } from '../src/people/position.js';

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
  // Increase timeout for this test
  test.setTimeout(60000);
  
  await login('stg', 'hr2admin222@mail.com', 'Password123!!', page);
  
  // Ensure sidebar is expanded
  await ensureSidebarExpanded(page);

  await openPeople(page, expect);
  
  // Open Positions page
  await openPositions(page, expect);
  
  // Add new position
  await addPosition(page, expect);
  
  // Pause to keep browser open
  await page.pause();
});