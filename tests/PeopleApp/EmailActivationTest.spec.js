import { test, expect } from '@playwright/test';
import { login1 } from '../../src/loginInfo/loginInfo.js';
import { LoginPage } from '../../pom/LoginPage.js';
import { NavbarAndSidebar } from '../../pom/NavbarAndSidebar.js';
import { AddEmployeeFlyout } from '../../pom/PeopleApp/AddEmployeeFlyout.js';
import { MailCatcher } from '../../pom/MailCatcher.js';
import { ActivationPage } from '../../pom/ActivationPage.js';
import { UserSettings } from '../../pom/UserSettings.js';
import { ResetPasswordPage } from '../../pom/ResetPasswordPage.js';

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

test('PasswordReset', async ({ page, context }) => {
  test.setTimeout(180000); // 3 minutes

  const NEW_PASSWORD = 'NewPassword123!';

  // ========================================
  // STEP 1: Login as admin and navigate to People
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
  // STEP 3: Activate account via email (same flow as AddEmployeeAndActivateViaEmail)
  // ========================================
  const mailcatcher = new MailCatcher(context);
  await mailcatcher.open();

  const activationLink = await mailcatcher.getActivationLink(employeeData.email);
  await mailcatcher.close();

  expect(activationLink).toBeTruthy();

  const activationPage = new ActivationPage(page, expect);
  await activationPage.activate(activationLink);

  // Page is now logged in as the new employee
  await nav.verifyLogoVisible();
  console.log('Employee account activated and logged in');

  // ========================================
  // STEP 4: Go to My Settings → Change Password → Forgot password?
  // ========================================
  await nav.goToMySettings();

  const userSettings = new UserSettings(page, expect);
  await userSettings.initiatePasswordReset();

  // Wait for the reset email to be sent
  await page.waitForTimeout(3000);

  // ========================================
  // STEP 5: Find password reset email in MailCatcher and get the popup
  // ========================================
  await mailcatcher.open();

  const resetPopup = await mailcatcher.getPasswordResetPopup(employeeData.email);

  // ========================================
  // STEP 6: Set new password and log in via the popup
  // ========================================
  const resetPasswordPage = new ResetPasswordPage(resetPopup, expect);
  await resetPasswordPage.resetAndLogin(employeeData.email, NEW_PASSWORD);

  // Close MailCatcher only after the popup flow is fully complete
  await mailcatcher.close();

  // ========================================
  // STEP 7: Verify successful login with new password
  // ========================================
  const navInPopup = new NavbarAndSidebar(resetPopup, expect);
  await navInPopup.verifyLogoVisible();

  console.log(`✓ Password reset verified — ${employeeData.email} logged in with new password`);
});
