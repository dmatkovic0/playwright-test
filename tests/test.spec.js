import { test, expect } from '@playwright/test';
import { login, ensureSidebarExpanded, openPeople } from '../src/utils.js';
import { addEmployeeOnboardingChecklist } from '../src/addEmployee.js';

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