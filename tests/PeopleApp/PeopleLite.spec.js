import { test, expect } from '@playwright/test';
import { ensureSidebarExpanded, openPeople, generateRandomPastDate } from '../../src/utils.js';
import { login2 } from '../../src/loginInfo/loginInfo.js';
import { LoginPage } from '../../pom/LoginPage.js';
import { AddEmployeeFlyout } from '../../pom/PeopleApp/AddEmployeeFlyout.js';
import { PeopleGrid } from '../../pom/PeopleApp/PeopleGrid.js';
import { EmployeeProfileFlyout } from '../../pom/PeopleApp/EmployeeProfileFlyout.js';
import { Actions } from '../../pom/PeopleApp/Actions/Actions.js';
import { ChangeStartDateFlyout } from '../../pom/PeopleApp/Actions/ChangeStartDateFlyout.js';
import { ChangeEmploymentStatusFlyout } from '../../pom/PeopleApp/Actions/ChangeEmploymentStatusFlyout.js';
import { generateShortID } from '../../src/utils.js';

test('AddEmployeeOnboardingChecklist', async ({ page }) => {
  // Increase timeout for this test
  test.setTimeout(60000);

  // Login using POM with login2
  const loginPage = new LoginPage(page, expect);
  await loginPage.login(login2.environment, login2.email, login2.password);

  // Ensure sidebar is expanded
  await ensureSidebarExpanded(page);

  // Open People page
  await openPeople(page, expect);

  // Create POM instances
  const addEmployeeFlyout = new AddEmployeeFlyout(page, expect);
  const peopleGrid = new PeopleGrid(page, expect);

  // Open flyout
  await addEmployeeFlyout.open();

  // Generate unique ID and employee data
  const uniqueID = generateShortID();
  const firstName = `First_${uniqueID}`;
  const lastName = `Last_${uniqueID}`;
  const email = `${uniqueID}@mail.com`;
  const startDate = addEmployeeFlyout.getTodayDate();

  // Fill basic fields
  await addEmployeeFlyout.fillFirstName(firstName);
  await addEmployeeFlyout.fillLastName(lastName);
  await addEmployeeFlyout.fillEmail(email);
  await addEmployeeFlyout.fillStartDate(startDate);

  // Select random values from all dropdowns
  const selectedValues = await addEmployeeFlyout.selectRandomFromAllDropdowns();
  console.log(`Selected Department: ${selectedValues.department}`);
  console.log(`Selected Position: ${selectedValues.position}`);
  console.log(`Selected Location: ${selectedValues.location}`);
  console.log(`Selected Division: ${selectedValues.division}`);

  // Select first manager from grid
  await addEmployeeFlyout.selectFirstManager();

  // Onboarding checklist is default, so just save
  await addEmployeeFlyout.save();

  console.log(`Created employee: ${firstName} ${lastName}`);

  // Wait for save to complete
  await page.waitForTimeout(3000);

  // Click Back to return to employee grid
  await peopleGrid.clickBack();

  // Search for the employee by first name
  await peopleGrid.searchByFirstName(firstName);

  // Verify employee appears in search results
  await peopleGrid.verifyEmployeeInGrid(firstName);

  console.log(` Verified employee appears in grid: ${firstName} ${lastName}`);

  // Pause to keep browser open
  await page.pause();
});

test('AddEmployeePrehireChecklist', async ({ page }) => {
  // Increase timeout for this test
  test.setTimeout(60000);

  // Login using POM with login2
  const loginPage = new LoginPage(page, expect);
  await loginPage.login(login2.environment, login2.email, login2.password);

  // Ensure sidebar is expanded
  await ensureSidebarExpanded(page);

  // Open People page
  await openPeople(page, expect);

  // Create POM instances
  const addEmployeeFlyout = new AddEmployeeFlyout(page, expect);
  const peopleGrid = new PeopleGrid(page, expect);

  // Open flyout and add employee with prehire checklist
  await addEmployeeFlyout.open();
  const employeeData = await addEmployeeFlyout.createEmployeeWithPrehireChecklist();

  console.log(`Created employee: ${employeeData.firstName} ${employeeData.lastName}`);

  // Wait for save to complete
  await page.waitForTimeout(3000);

  // Click Back to return to employee grid
  await peopleGrid.clickBack();

  // Search for the employee by first name
  await peopleGrid.searchByFirstName(employeeData.firstName);

  // Verify employee appears in search results
  await peopleGrid.verifyEmployeeInGrid(employeeData.firstName);

  console.log(` Verified employee appears in grid: ${employeeData.firstName} ${employeeData.lastName}`);

  // Pause to keep browser open
  await page.pause();
});

test('AddEmployeeNoAutoAssignment', async ({ page }) => {
  // Increase timeout for this test
  test.setTimeout(60000);

  // Login using POM with login2
  const loginPage = new LoginPage(page, expect);
  await loginPage.login(login2.environment, login2.email, login2.password);

  // Ensure sidebar is expanded
  await ensureSidebarExpanded(page);

  // Open People page
  await openPeople(page, expect);

  // Create POM instances
  const addEmployeeFlyout = new AddEmployeeFlyout(page, expect);
  const peopleGrid = new PeopleGrid(page, expect);

  // Open flyout and add employee with no auto assignment
  await addEmployeeFlyout.open();
  const employeeData = await addEmployeeFlyout.createEmployeeWithNoAutoAssignment();

  console.log(`Created employee: ${employeeData.firstName} ${employeeData.lastName}`);

  // Wait for save to complete
  await page.waitForTimeout(3000);

  // Click Back to return to employee grid
  await peopleGrid.clickBack();

  // Search for the employee by first name
  await peopleGrid.searchByFirstName(employeeData.firstName);

  // Verify employee appears in search results
  await peopleGrid.verifyEmployeeInGrid(employeeData.firstName);

  console.log(` Verified employee appears in grid: ${employeeData.firstName} ${employeeData.lastName}`);

  // Pause to keep browser open
  await page.pause();
});

test('UpdateExistingEmployee', async ({ page }) => {
  // Increase timeout for this test
  test.setTimeout(90000);

  // Login using POM with login2
  const loginPage = new LoginPage(page, expect);
  await loginPage.login(login2.environment, login2.email, login2.password);

  // Ensure sidebar is expanded
  await ensureSidebarExpanded(page);

  // Open People page
  await openPeople(page, expect);

  // Create POM instances
  const addEmployeeFlyout = new AddEmployeeFlyout(page, expect);
  const peopleGrid = new PeopleGrid(page, expect);
  const employeeProfile = new EmployeeProfileFlyout(page, expect);

  // Create employee
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
  await peopleGrid.clickBack();

  // Search for the employee by first name
  await peopleGrid.searchByFirstName(originalFirstName);

  // Open employee profile
  await peopleGrid.openEmployeeProfile(originalFirstName);

  // Navigate to Personal tab and edit
  await employeeProfile.goToPersonalTab();
  await employeeProfile.clickEditInPersonalSection();

  // Update first and last names
  await employeeProfile.updateFirstName(editedFirstName);
  await employeeProfile.updateLastName(editedLastName);

  // Save changes
  await employeeProfile.saveProfileChanges();

  // Verify the heading shows edited first name
  await employeeProfile.verifyProfileHeading(editedFirstName);

  console.log(`Successfully updated employee: ${editedFirstName} ${editedLastName}`);

  // Go back to grid
  await peopleGrid.clickBackAlt();

  // Clear previous search
  await peopleGrid.clearFirstNameSearch();

  // Search for edited employee using full updated first name
  await peopleGrid.searchByFirstName(editedFirstName);

  // Verify edited employee appears in search results
  await peopleGrid.verifyEmployeeInGrid(editedFirstName);

  console.log(`Verified edited employee appears in search results`);

  // Pause to keep browser open
  await page.pause();
});

test('UpdateStartDate', async ({ page }) => {
  // Increase timeout for this test
  test.setTimeout(60000);

  // Login using POM with login2
  const loginPage = new LoginPage(page, expect);
  await loginPage.login(login2.environment, login2.email, login2.password);

  // Ensure sidebar is expanded
  await ensureSidebarExpanded(page);

  // Open People page
  await openPeople(page, expect);

  // Create POM instances
  const peopleGrid = new PeopleGrid(page, expect);
  const actions = new Actions(page, expect);
  const changeStartDateFlyout = new ChangeStartDateFlyout(page, expect);
  const employeeProfile = new EmployeeProfileFlyout(page, expect);

  // Generate random date within last 30 days
  const expectedDate = generateRandomPastDate(30);

  console.log(`Selecting random date: ${expectedDate}`);

  // Search for HR Employee by first and last name
  await peopleGrid.searchByFirstAndLastName('HR', 'Employee');

  // Open employee profile (exact match for 'HR')
  await peopleGrid.openEmployeeProfile('HR', true);

  // Open Actions menu
  await actions.openActionsMenu();

  // Click Change Start Date
  await actions.clickChangeStartDate();

  // Type random date directly
  await changeStartDateFlyout.setStartDateByTyping(expectedDate);

  // Save the start date change
  await changeStartDateFlyout.saveStartDateChange();

  // Get the actual start date from the field
  const actualStartDate = await employeeProfile.getStartDateValue();

  // Verify the start date matches expected date
  expect(actualStartDate.trim()).toBe(expectedDate);
  console.log(`✓ Start date verified: Expected ${expectedDate}, Got ${actualStartDate.trim()}`);

  // Pause to keep browser open
  await page.pause();
});

test('ChangeEmploymentStatusLoA', async ({ page }) => {
  // Increase timeout for this test
  test.setTimeout(60000);

  // Login using POM with login2
  const loginPage = new LoginPage(page, expect);
  await loginPage.login(login2.environment, login2.email, login2.password);

  // Ensure sidebar is expanded
  await ensureSidebarExpanded(page);

  // Open People page
  await openPeople(page, expect);

  // Create POM instances
  const addEmployeeFlyout = new AddEmployeeFlyout(page, expect);
  const actions = new Actions(page, expect);
  const changeEmploymentStatusFlyout = new ChangeEmploymentStatusFlyout(page, expect);
  const employeeProfile = new EmployeeProfileFlyout(page, expect);

  // Create new employee with onboarding checklist
  await addEmployeeFlyout.open();
  const employeeData = await addEmployeeFlyout.createEmployeeWithOnboardingChecklist();

  console.log(`Created employee: ${employeeData.firstName} ${employeeData.lastName}`);

  // Wait for employee creation to complete
  await page.waitForTimeout(3000);

  // Get today's date
  const today = new Date();
  const expectedDate = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}/${today.getFullYear()}`;

  console.log(`Setting effective date: ${expectedDate}`);

  // Open Actions menu
  await actions.openActionsMenu();

  // Click Change Employment Status
  await actions.clickChangeEmploymentStatus();

  // Type today's date for effective date
  await changeEmploymentStatusFlyout.setEffectiveDateByTyping(expectedDate);

  // Select "Leave of Absence" status
  await changeEmploymentStatusFlyout.selectEmploymentStatus('Leave of Absence');

  // Save the employment status change
  await changeEmploymentStatusFlyout.saveEmploymentStatusChange();

  // Get the actual employment status from the field
  const actualEmploymentStatus = await employeeProfile.getEmploymentStatusValue();

  // Verify the employment status contains "Leave of Absence"
  expect(actualEmploymentStatus).toContain('Leave of Absence');
  console.log(`✓ Employment Status verified: Expected "Leave of Absence", Got "${actualEmploymentStatus}"`);

  // Pause to keep browser open
  await page.pause();
});

test('ChangeEmploymentStatusPrehire', async ({ page }) => {
  // Increase timeout for this test
  test.setTimeout(60000);

  // Login using POM with login2
  const loginPage = new LoginPage(page, expect);
  await loginPage.login(login2.environment, login2.email, login2.password);

  // Ensure sidebar is expanded
  await ensureSidebarExpanded(page);

  // Open People page
  await openPeople(page, expect);

  // Create POM instances
  const addEmployeeFlyout = new AddEmployeeFlyout(page, expect);
  const actions = new Actions(page, expect);
  const changeEmploymentStatusFlyout = new ChangeEmploymentStatusFlyout(page, expect);
  const employeeProfile = new EmployeeProfileFlyout(page, expect);

  // Create new employee with onboarding checklist
  await addEmployeeFlyout.open();
  const employeeData = await addEmployeeFlyout.createEmployeeWithOnboardingChecklist();

  console.log(`Created employee: ${employeeData.firstName} ${employeeData.lastName}`);

  // Wait for employee creation to complete
  await page.waitForTimeout(3000);

  // Get today's date
  const today = new Date();
  const expectedDate = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}/${today.getFullYear()}`;

  console.log(`Setting effective date: ${expectedDate}`);

  // Open Actions menu
  await actions.openActionsMenu();

  // Click Change Employment Status
  await actions.clickChangeEmploymentStatus();

  // Type today's date for effective date
  await changeEmploymentStatusFlyout.setEffectiveDateByTyping(expectedDate);

  // Select "Prehire" status
  await changeEmploymentStatusFlyout.selectEmploymentStatus('Prehire');

  // Save the employment status change
  await changeEmploymentStatusFlyout.saveEmploymentStatusChange();

  // Get the actual employment status from the field
  const actualEmploymentStatus = await employeeProfile.getEmploymentStatusValue();

  // Verify the employment status contains "Prehire"
  expect(actualEmploymentStatus).toContain('Prehire');
  console.log(`✓ Employment Status verified: Expected "Prehire", Got "${actualEmploymentStatus}"`);

  // Pause to keep browser open
  await page.pause();
});
