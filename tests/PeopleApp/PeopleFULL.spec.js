import { test, expect } from '@playwright/test';
import { ensureSidebarExpanded, openPeople } from '../../src/utils.js';
import { login1 } from '../../src/loginInfo/loginInfo.js';
import { LoginPage } from '../../pom/LoginPage.js';
import { AddEmployeeFlyout } from '../../pom/AddEmployeeFlyout.js';
import { Position } from '../../pom/Position.js';
import { Location } from '../../pom/Location.js';
import { Department } from '../../pom/Department.js';

test('AddEmployeeOnboardingChecklist', async ({ page }) => {
  // Increase timeout for this test
  test.setTimeout(60000);

  // Login using POM
  const loginPage = new LoginPage(page, expect);
  await loginPage.login(login1.environment, login1.email, login1.password);

  // Ensure sidebar is expanded
  await ensureSidebarExpanded(page);

  // Open People page
  await openPeople(page, expect);

  // Create AddEmployeeFlyout POM instance
  const addEmployeeFlyout = new AddEmployeeFlyout(page, expect);

  // Open flyout and add employee with onboarding checklist
  await addEmployeeFlyout.open();
  await addEmployeeFlyout.createEmployeeWithOnboardingChecklist();

  // Pause to keep browser open
  await page.pause();
});

test('UpdateExistingEmployee', async ({ page }) => {
  // Increase timeout for this test
  test.setTimeout(90000);

  // Login using POM
  const loginPage = new LoginPage(page, expect);
  await loginPage.login(login1.environment, login1.email, login1.password);

  // Ensure sidebar is expanded
  await ensureSidebarExpanded(page);

  // Open People page
  await openPeople(page, expect);

  // Create AddEmployeeFlyout POM instance and create employee
  const addEmployeeFlyout = new AddEmployeeFlyout(page, expect);
  await addEmployeeFlyout.open();
  const employeeData = await addEmployeeFlyout.createEmployeeWithOnboardingChecklist();

  // Store employee names for later verification
  const originalFirstName = employeeData.firstName;
  const originalLastName = employeeData.lastName;
  const editedFirstName = `${originalFirstName}EDITED`;
  const editedLastName = `${originalLastName}EDITED`;

  console.log(`Created employee: ${originalFirstName} ${originalLastName}`);

  // Wait for save to complete
  await page.waitForTimeout(3000);

  // Click Back to return to employee grid
  await addEmployeeFlyout.clickBack();

  // Search for the employee by first name
  await addEmployeeFlyout.searchByFirstName(originalFirstName);

  // Open employee profile
  await addEmployeeFlyout.openEmployeeProfile(originalFirstName);

  // Navigate to Personal tab and edit
  await addEmployeeFlyout.goToPersonalTab();
  await addEmployeeFlyout.clickEditInPersonalSection();

  // Update first and last names
  await addEmployeeFlyout.updateFirstName(editedFirstName);
  await addEmployeeFlyout.updateLastName(editedLastName);

  // Save changes
  await addEmployeeFlyout.saveProfileChanges();

  // Verify the heading shows edited first name
  await addEmployeeFlyout.verifyProfileHeading(editedFirstName);

  console.log(`Successfully updated employee: ${editedFirstName} ${editedLastName}`);

  // Go back to grid
  await addEmployeeFlyout.clickBackAlt();

  // Clear previous search
  await addEmployeeFlyout.clearFirstNameSearch();

  // Search for edited employee using full updated first name
  await addEmployeeFlyout.searchByFirstName(editedFirstName);

  // Verify edited employee appears in search results
  await addEmployeeFlyout.verifyEmployeeInGrid(editedFirstName);

  console.log(`Verified edited employee appears in search results`);

  // Pause to keep browser open
  await page.pause();
});

test('AddEmployeePrehireChecklist', async ({ page }) => {
  // Increase timeout for this test
  test.setTimeout(60000);

  const loginPage = new LoginPage(page, expect);
  await loginPage.login(login1.environment, login1.email, login1.password);

  // Ensure sidebar is expanded
  await ensureSidebarExpanded(page);

  // Open People page
  await openPeople(page, expect);

  // Create AddEmployeeFlyout POM instance
  const addEmployeeFlyout = new AddEmployeeFlyout(page, expect);

  // Open flyout and add employee with prehire checklist
  await addEmployeeFlyout.open();
  await addEmployeeFlyout.createEmployeeWithPrehireChecklist();

  // Pause to keep browser open
  await page.pause();
});

test('AddEmployeeNoAutoAssignment', async ({ page }) => {
  // Increase timeout for this test
  test.setTimeout(60000);

  const loginPage = new LoginPage(page, expect);
  await loginPage.login(login1.environment, login1.email, login1.password);

  // Ensure sidebar is expanded
  await ensureSidebarExpanded(page);

  // Open People page
  await openPeople(page, expect);

  // Create AddEmployeeFlyout POM instance
  const addEmployeeFlyout = new AddEmployeeFlyout(page, expect);

  // Open flyout and add employee with no auto assignment
  await addEmployeeFlyout.open();
  await addEmployeeFlyout.createEmployeeWithNoAutoAssignment();

  // Pause to keep browser open
  await page.pause();
});

test('AddPosition', async ({ page }) => {
  // Increase timeout for this test
  test.setTimeout(60000);

  const loginPage = new LoginPage(page, expect);
  await loginPage.login(login1.environment, login1.email, login1.password);

  // Ensure sidebar is expanded
  await ensureSidebarExpanded(page);

  await openPeople(page, expect);

  // Create Position POM instance
  const position = new Position(page, expect);

  // Open Positions page from people app
  await position.open();

  // Add new position
  await position.createPosition();

  // Pause to keep browser open
  await page.pause();
});

test('AddLocation', async ({ page }) => {
  // Increase timeout for this test
  test.setTimeout(60000);

  const loginPage = new LoginPage(page, expect);
  await loginPage.login(login1.environment, login1.email, login1.password);

  // Ensure sidebar is expanded
  await ensureSidebarExpanded(page);

  await openPeople(page, expect);

  // Create Location POM instance
  const location = new Location(page, expect);

  // Open Locations page from people app
  await location.open();

  // Add new location
  await location.createLocation();

  // Pause to keep browser open
  await page.pause();
});

test('UpdatePosition', async ({ page }) => {
  // Increase timeout for this test
  test.setTimeout(60000);

  const loginPage = new LoginPage(page, expect);
  await loginPage.login(login1.environment, login1.email, login1.password);

  // Ensure sidebar is expanded
  await ensureSidebarExpanded(page);

  await openPeople(page, expect);

  // Create Position POM instance
  const position = new Position(page, expect);

  // Open Positions page from people app
  await position.open();

  // Update existing position
  await position.updatePositionCode();

  // Pause to keep browser open
  await page.pause();
});

test('UpdateLocation', async ({ page }) => {
  // Increase timeout for this test
  test.setTimeout(60000);

  const loginPage = new LoginPage(page, expect);
  await loginPage.login(login1.environment, login1.email, login1.password);

  // Ensure sidebar is expanded
  await ensureSidebarExpanded(page);

  await openPeople(page, expect);

  // Create Location POM instance
  const location = new Location(page, expect);

  // Open Locations page from people app
  await location.open();

  // Update existing location
  await location.updateLocationCode();

  // Pause to keep browser open
  await page.pause();
});

test('AddDepartment', async ({ page }) => {
  // Increase timeout for this test
  test.setTimeout(60000);

  const loginPage = new LoginPage(page, expect);
  await loginPage.login(login1.environment, login1.email, login1.password);

  // Ensure sidebar is expanded
  await ensureSidebarExpanded(page);

  await openPeople(page, expect);

  // Create Department POM instance
  const department = new Department(page, expect);

  // Open Departments page from people app
  await department.open();

  // Add new department
  await department.createDepartment();

  // Pause to keep browser open
  await page.pause();
});

test('UpdateDepartment', async ({ page }) => {
  // Increase timeout for this test
  test.setTimeout(60000);

  const loginPage = new LoginPage(page, expect);
  await loginPage.login(login1.environment, login1.email, login1.password);

  // Ensure sidebar is expanded
  await ensureSidebarExpanded(page);

  await openPeople(page, expect);

  // Create Department POM instance
  const department = new Department(page, expect);

  // Open Departments page from people app
  await department.open();

  // Update existing department
  await department.updateDepartmentCode();

  // Pause to keep browser open
  await page.pause();
});

test('UpdateStartDate', async ({ page }) => {
  // Increase timeout for this test
  test.setTimeout(60000);

  // Login using POM
  const loginPage = new LoginPage(page, expect);
  await loginPage.login(login1.environment, login1.email, login1.password);

  // Ensure sidebar is expanded
  await ensureSidebarExpanded(page);

  // Open People page
  await openPeople(page, expect);

  // Create AddEmployeeFlyout POM instance
  const addEmployeeFlyout = new AddEmployeeFlyout(page, expect);

  // Get today's date
  const today = new Date();
  const todayDay = String(today.getDate());
  const expectedDate = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}/${today.getFullYear()}`;

  console.log(`Selecting today's date: ${expectedDate} (day: ${todayDay})`);

  // Search for HR Employee by first and last name
  await addEmployeeFlyout.searchByFirstAndLastName('HR', 'Employee');

  // Open employee profile (exact match for 'HR')
  await addEmployeeFlyout.openEmployeeProfile('HR', true);

  // Open Actions menu
  await addEmployeeFlyout.openActionsMenu();

  // Click Change Start Date
  await addEmployeeFlyout.clickChangeStartDate();

  // Type today's date directly
  await addEmployeeFlyout.setStartDateByTyping(expectedDate);

  // Save the start date change
  await addEmployeeFlyout.saveStartDateChange();

  // Get the actual start date from the field
  const actualStartDate = await addEmployeeFlyout.verifyStartDate();

  // Verify the start date matches expected date
  expect(actualStartDate.trim()).toBe(expectedDate);
  console.log(`✓ Start date verified: Expected ${expectedDate}, Got ${actualStartDate.trim()}`);

  // Pause to keep browser open
  await page.pause();
});


test('ChangeSalary', async ({ page }) => {
  // Increase timeout for this test
  test.setTimeout(60000);

  // Login using POM
  const loginPage = new LoginPage(page, expect);
  await loginPage.login(login1.environment, login1.email, login1.password);

  // Ensure sidebar is expanded
  await ensureSidebarExpanded(page);

  // Open People page
  await openPeople(page, expect);

  // Create AddEmployeeFlyout POM instance
  const addEmployeeFlyout = new AddEmployeeFlyout(page, expect);

  // Generate random 4-digit salary
  const randomSalary = Math.floor(1000 + Math.random() * 9000).toString();

  // Get today's date
  const today = new Date();
  const todayDay = String(today.getDate());
  const expectedDate = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}/${today.getFullYear()}`;

  console.log(`Generated salary: ${randomSalary}`);
  console.log(`Selecting today's date: ${expectedDate} (day: ${todayDay})`);

  // Search for HR Employee by first and last name
  await addEmployeeFlyout.searchByFirstAndLastName('HR', 'Employee');

  // Open employee profile (exact match for 'HR')
  await addEmployeeFlyout.openEmployeeProfile('HR', true);

  // Open Actions menu
  await addEmployeeFlyout.openActionsMenu();

  // Click Change Salary
  await addEmployeeFlyout.clickChangeSalary();

  // Type today's date for effective date
  await addEmployeeFlyout.setEffectiveDateByTyping(expectedDate);

  // Enter salary
  await addEmployeeFlyout.enterSalary(randomSalary);

  // Save the salary change
  await addEmployeeFlyout.saveSalaryChange();

  // Get the actual salary from the field
  const actualSalary = await addEmployeeFlyout.verifySalary();

  // Format expected salary (e.g., "1,234.00 USD")
  const formattedSalary = Number(randomSalary).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  const expectedSalaryText = `${formattedSalary} USD`;

  // Verify the salary matches (accounting for formatting)
  expect(actualSalary).toContain(formattedSalary);
  console.log(`✓ Salary verified: Expected ${expectedSalaryText}, Got ${actualSalary}`);

  // Pause to keep browser open
  await page.pause();
});
