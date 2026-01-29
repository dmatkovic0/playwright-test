import { test, expect } from '@playwright/test';
import { ensureSidebarExpanded } from '../../src/utils.js';
import { login1 } from '../../src/loginInfo/loginInfo.js';
import { LoginPage } from '../../pom/LoginPage.js';
import { openCalendar, addEvent } from '../../pom/addEvent.js';

test('CreateNewEvent', async ({ page }) => {
  // Increase timeout for this test
  test.setTimeout(60000);

  const loginPage = new LoginPage(page, expect);
  await loginPage.login(login1.environment, login1.email, login1.password);

  // Ensure sidebar is expanded
  await ensureSidebarExpanded(page);

  // Open Calendar from sidebar
  await openCalendar(page, expect);

  // Add new event with GUID as event name
  await addEvent(page, expect);

  // Pause to keep browser open
  await page.pause();
});
