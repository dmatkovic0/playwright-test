import { test, expect } from '@playwright/test';
import { login1 } from '../../src/loginInfo/loginInfo.js';
import { LoginPage } from '../../pom/LoginPage.js';
import { NavbarAndSidebar } from '../../pom/NavbarAndSidebar.js';
import { AddEmployeeFlyout } from '../../pom/PeopleApp/AddEmployeeFlyout.js';
import { MailCatcher } from '../../pom/MailCatcher.js';
import { ActivationPage } from '../../pom/ActivationPage.js';

test('AddEmployeeAndActivateViaEmail', async ({ page, context }) => {
  test.setTimeout(120000); // 2 minutes

  // ========================================
  // STEP 1: Login and navigate to People
  // ========================================
  const loginPage = new LoginPage(page, expect);
  await loginPage.login(login1.environment, login1.email, login1.password);

  const nav = new NavbarAndSidebar(page, expect);
  await nav.ensureSidebarExpanded();
  await nav.goToPeopleAndVerify();

  // ========================================
  // STEP 2: Add new employee
  // ========================================
  const addEmployeeFlyout = new AddEmployeeFlyout(page, expect);
  await addEmployeeFlyout.open();
  const employeeData = await addEmployeeFlyout.createEmployeeWithOnboardingChecklist();

  console.log(`Created employee: ${employeeData.firstName} ${employeeData.lastName}`);
  console.log(`Employee email: ${employeeData.email}`);

  await page.waitForTimeout(3000);

  // ========================================
  // STEP 3-4: Find activation email and extract link
  // ========================================
  const mailcatcher = new MailCatcher(context);
  await mailcatcher.open();

  const activationLink = await mailcatcher.getActivationLink(employeeData.email);

  await mailcatcher.close();

  expect(activationLink).toBeTruthy();

  // ========================================
  // STEP 5-9: Complete employee account activation
  // ========================================
  const activationPage = new ActivationPage(page, expect);
  await activationPage.activate(activationLink);

  // ========================================
  // STEP 10: Verify successful login via dashboard logo
  // ========================================
  await nav.verifyLogoVisible();

  console.log(`Final URL: ${page.url()}`);
});



