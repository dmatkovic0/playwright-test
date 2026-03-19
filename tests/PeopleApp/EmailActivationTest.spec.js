import { test, expect } from '@playwright/test';
import { login1, loginAdminTool } from '../../src/loginInfo/loginInfo.js';
import { LoginPage } from '../../pom/LoginPage.js';
import { NavbarAndSidebar } from '../../pom/NavbarAndSidebar.js';
import { AddEmployeeFlyout } from '../../pom/PeopleApp/AddEmployeeFlyout.js';
import { MailCatcher } from '../../pom/MailCatcher.js';
import { ActivationPage } from '../../pom/ActivationPage.js';
import { UserSettings } from '../../pom/UserSettings.js';
import { ResetPasswordPage } from '../../pom/ResetPasswordPage.js';
import { PeopleGrid } from '../../pom/PeopleApp/PeopleGrid.js';
import { EmployeeProfileFlyout } from '../../pom/PeopleApp/EmployeeProfileFlyout.js';
import { generateRandomPhoneNumber } from '../../src/utils.js';
import { LoginPageAT } from '../../pom/AdminTool/LoginPageAT.js';
import { SidebarAndNavbarAT } from '../../pom/AdminTool/SidebarAndNavbarAT.js';
import { NotificationsAT } from '../../pom/AdminTool/NotificationsAT.js';

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

  // ========================================
  // STEP 8: Verify password change notification email was received
  // ========================================
  await mailcatcher.open();

  const notificationReceived = await mailcatcher.verifyPasswordChangeNotification(employeeData.email);
  expect(notificationReceived).toBe(true);

  await mailcatcher.close();

  console.log(`✓ Password change notification email verified — contains "Recently your account password has changed"`);
});

test('AddEmployeeWithEmailAndPhoneNumber', async ({ page, context }) => {
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
  // STEP 2: Add new employee with phone number
  // ========================================
  const addEmployeeFlyout = new AddEmployeeFlyout(page, expect);
  await addEmployeeFlyout.open();

  // Fill all fields including phone number
  const employeeData = await addEmployeeFlyout.fillAllRequiredFields();
  const phoneNumber = generateRandomPhoneNumber();

  await addEmployeeFlyout.fillAccountPhone(phoneNumber);

  const dropdownValues = await addEmployeeFlyout.selectRandomFromAllDropdowns();
  const manager = await addEmployeeFlyout.selectRandomManager();

  // Save employee (Onboarding checklist is default)
  await addEmployeeFlyout.save();

  console.log(`Created employee: ${employeeData.firstName} ${employeeData.lastName}`);
  console.log(`Employee email: ${employeeData.email}`);
  console.log(`Account phone: ${phoneNumber}`);

  // Wait for save to complete
  await page.waitForTimeout(3000);

  // ========================================
  // STEP 3: Go back to grid and find employee
  // ========================================
  const peopleGrid = new PeopleGrid(page, expect);

  // Click Back to return to employee grid
  await peopleGrid.clickBack();

  // Search for the employee by first name
  await peopleGrid.searchByFirstName(employeeData.firstName);

  // Verify employee appears in search results
  await peopleGrid.verifyEmployeeInGrid(employeeData.firstName);

  console.log(`✓ Verified employee appears in grid: ${employeeData.firstName} ${employeeData.lastName}`);

  // ========================================
  // STEP 4: Open employee profile and verify all fields
  // ========================================
  await peopleGrid.openEmployeeProfile(employeeData.firstName);

  const employeeProfile = new EmployeeProfileFlyout(page, expect);

  // Verify all fields on Personal tab
  const actualDepartment = await employeeProfile.getDepartmentValue();
  const actualPosition = await employeeProfile.getPositionValue();
  const actualDivision = await employeeProfile.getDivisionValue();
  const actualLocation = await employeeProfile.getLocationValue();
  const actualManager = await employeeProfile.getManagerValue();
  const actualStartDate = await employeeProfile.getStartDateValue();

  expect(actualDepartment).toBe(dropdownValues.department);
  expect(actualPosition).toBe(dropdownValues.position);
  expect(actualDivision).toBe(dropdownValues.division);
  expect(actualLocation).toBe(dropdownValues.location);
  expect(actualManager).toBe(manager);
  expect(actualStartDate).toBe(employeeData.startDate);

  console.log(`✓ All personal fields verified successfully`);

  // ========================================
  // STEP 5: Verify account phone on Account tab
  // ========================================
  await employeeProfile.goToAccountTab();

  const actualPhone = await employeeProfile.getAccountPhoneValue();

  // Verify that displayed phone contains our 9-digit number
  // (displayed phone may include country code like +1)
  expect(actualPhone).toContain(phoneNumber);

  console.log(`✓ Account phone verified: ${actualPhone} contains ${phoneNumber}`);

  // ========================================
  // STEP 6: Go back to grid for activation email
  // ========================================
  await peopleGrid.clickBack();
  await page.waitForTimeout(2000);

  // ========================================
  // STEP 7-8: Find activation email and extract link
  // ========================================
  const mailcatcher = new MailCatcher(context);
  await mailcatcher.open();

  const activationLink = await mailcatcher.getActivationLink(employeeData.email);

  await mailcatcher.close();

  expect(activationLink).toBeTruthy();

  // ========================================
  // STEP 9-13: Complete employee account activation
  // ========================================
  const activationPage = new ActivationPage(page, expect);
  await activationPage.activate(activationLink);

  // ========================================
  // STEP 14: Verify successful login via dashboard logo
  // ========================================
  await nav.verifyLogoVisible();

  console.log(`✓ Employee account activated successfully`);
  console.log(`Final URL: ${page.url()}`);
});

test('AddEmployeePhoneNumber', async ({ page, context }) => {
  test.setTimeout(180000); // 3 minutes

  // ========================================
  // STEP 1: Login and navigate to People
  // ========================================
  const loginPage = new LoginPage(page, expect);
  await loginPage.login(login1.environment, login1.email, login1.password);

  const nav = new NavbarAndSidebar(page, expect);
  await nav.ensureSidebarExpanded();
  await nav.goToPeopleAndVerify();

  // ========================================
  // STEP 2: Add new employee with phone number only (no email)
  // ========================================
  const addEmployeeFlyout = new AddEmployeeFlyout(page, expect);
  await addEmployeeFlyout.open();

  const employeeData = await addEmployeeFlyout.createEmployeeWithPhoneOnly();

  console.log(`Created employee: ${employeeData.firstName} ${employeeData.lastName}`);
  console.log(`Account phone: ${employeeData.phoneNumber}`);

  // Wait for save to complete
  await page.waitForTimeout(3000);

  // ========================================
  // STEP 3: Go back to grid and find employee
  // ========================================
  const peopleGrid = new PeopleGrid(page, expect);

  // Click Back to return to employee grid
  await peopleGrid.clickBack();

  // Search for the employee by first name
  await peopleGrid.searchByFirstName(employeeData.firstName);

  // Verify employee appears in search results
  await peopleGrid.verifyEmployeeInGrid(employeeData.firstName);

  console.log(`✓ Verified employee appears in grid: ${employeeData.firstName} ${employeeData.lastName}`);

  // ========================================
  // STEP 4: Open employee profile and verify all fields
  // ========================================
  await peopleGrid.openEmployeeProfile(employeeData.firstName);

  const employeeProfile = new EmployeeProfileFlyout(page, expect);

  // Verify all fields on Personal tab
  const actualDepartment = await employeeProfile.getDepartmentValue();
  const actualPosition = await employeeProfile.getPositionValue();
  const actualDivision = await employeeProfile.getDivisionValue();
  const actualLocation = await employeeProfile.getLocationValue();
  const actualManager = await employeeProfile.getManagerValue();
  const actualStartDate = await employeeProfile.getStartDateValue();

  expect(actualDepartment).toBe(employeeData.department);
  expect(actualPosition).toBe(employeeData.position);
  expect(actualDivision).toBe(employeeData.division);
  expect(actualLocation).toBe(employeeData.location);
  expect(actualManager).toBe(employeeData.manager);
  expect(actualStartDate).toBe(employeeData.startDate);

  console.log(`✓ All personal fields verified successfully`);

  // ========================================
  // STEP 5: Verify account phone on Account tab
  // ========================================
  await employeeProfile.goToAccountTab();

  const actualPhone = await employeeProfile.getAccountPhoneValue();

  // Verify that displayed phone contains our 9-digit number
  expect(actualPhone).toContain(employeeData.phoneNumber);

  console.log(`✓ Account phone verified: ${actualPhone} contains ${employeeData.phoneNumber}`);

  // ========================================
  // STEP 6: Go to Admin Tool
  // ========================================
  const loginPageAT = new LoginPageAT(page, expect);
  await loginPageAT.login(loginAdminTool.url, loginAdminTool.email, loginAdminTool.password);

  // ========================================
  // STEP 7: Navigate to Notifications
  // ========================================
  const sidebarAT = new SidebarAndNavbarAT(page, expect);
  await sidebarAT.openMenuAndGoToNotifications();

  // ========================================
  // STEP 8: Search for activation notification using phone number
  // ========================================
  const notificationsAT = new NotificationsAT(page, expect);
  const activationLink = await notificationsAT.findActivationLink(employeeData.phoneNumber);

  expect(activationLink).toBeTruthy();
  console.log(`✓ Found activation link in Admin Tool`);

  // ========================================
  // STEP 9: Activate account using the link
  // ========================================
  const activationPage = new ActivationPage(page, expect);
  await activationPage.activate(activationLink);

  // ========================================
  // STEP 10: Verify successful login via dashboard logo
  // ========================================
  await nav.verifyLogoVisible();

  console.log(`✓ Employee account activated successfully via phone number`);
  console.log(`Final URL: ${page.url()}`);
});
