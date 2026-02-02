import { test, expect } from '@playwright/test';
import { ensureSidebarExpanded, openPeople } from '../../src/utils.js';
import { login1 } from '../../src/loginInfo/loginInfo.js';
import { LoginPage } from '../../pom/LoginPage.js';
import { AddEmployeeFlyout } from '../../pom/PeopleApp/AddEmployeeFlyout.js';
import { PeopleGrid } from '../../pom/PeopleApp/PeopleGrid.js';
import { EmployeeProfileFlyout } from '../../pom/PeopleApp/EmployeeProfileFlyout.js';
import { Actions } from '../../pom/PeopleApp/Actions.js';
import { ChangeStartDateFlyout } from '../../pom/PeopleApp/ChangeStartDateFlyout.js';
import { ChangeSalaryFlyout } from '../../pom/PeopleApp/ChangeSalaryFlyout.js';
import { ChangePositionFlyout } from '../../pom/PeopleApp/ChangePositionFlyout.js';
import { Position } from '../../pom/PeopleApp/Position.js';
import { Location } from '../../pom/PeopleApp/Location.js';
import { Department } from '../../pom/PeopleApp/Department.js';

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

  // Create POM instances
  const peopleGrid = new PeopleGrid(page, expect);
  const actions = new Actions(page, expect);
  const changeStartDateFlyout = new ChangeStartDateFlyout(page, expect);
  const employeeProfile = new EmployeeProfileFlyout(page, expect);

  // Get today's date
  const today = new Date();
  const todayDay = String(today.getDate());
  const expectedDate = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}/${today.getFullYear()}`;

  console.log(`Selecting today's date: ${expectedDate} (day: ${todayDay})`);

  // Search for HR Employee by first and last name
  await peopleGrid.searchByFirstAndLastName('HR', 'Employee');

  // Open employee profile (exact match for 'HR')
  await peopleGrid.openEmployeeProfile('HR', true);

  // Open Actions menu
  await actions.openActionsMenu();

  // Click Change Start Date
  await actions.clickChangeStartDate();

  // Type today's date directly
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

  // Create POM instances
  const peopleGrid = new PeopleGrid(page, expect);
  const actions = new Actions(page, expect);
  const changeSalaryFlyout = new ChangeSalaryFlyout(page, expect);
  const employeeProfile = new EmployeeProfileFlyout(page, expect);

  // Generate random 4-digit salary
  const randomSalary = Math.floor(1000 + Math.random() * 9000).toString();

  // Get today's date
  const today = new Date();
  const todayDay = String(today.getDate());
  const expectedDate = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}/${today.getFullYear()}`;

  console.log(`Generated salary: ${randomSalary}`);
  console.log(`Selecting today's date: ${expectedDate} (day: ${todayDay})`);

  // Search for HR Employee by first and last name
  await peopleGrid.searchByFirstAndLastName('HR', 'Employee');

  // Open employee profile (exact match for 'HR')
  await peopleGrid.openEmployeeProfile('HR', true);

  // Open Actions menu
  await actions.openActionsMenu();

  // Click Change Salary
  await actions.clickChangeSalary();

  // Type today's date for effective date
  await changeSalaryFlyout.setEffectiveDateByTyping(expectedDate);

  // Enter salary
  await changeSalaryFlyout.enterSalary(randomSalary);

  // Save the salary change
  await changeSalaryFlyout.saveSalaryChange();

  // Get the actual salary from the field
  const actualSalary = await employeeProfile.getSalaryValue();

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

test('ChangePosition', async ({ page }) => {
  // Increase timeout for this test
  test.setTimeout(60000);

  // Login using POM
  const loginPage = new LoginPage(page, expect);
  await loginPage.login(login1.environment, login1.email, login1.password);

  // Ensure sidebar is expanded
  await ensureSidebarExpanded(page);

  // Open People page
  await openPeople(page, expect);

  // Create POM instances
  const peopleGrid = new PeopleGrid(page, expect);
  const actions = new Actions(page, expect);
  const changePositionFlyout = new ChangePositionFlyout(page, expect);
  const employeeProfile = new EmployeeProfileFlyout(page, expect);

  // Get today's date
  const today = new Date();
  const expectedDate = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}/${today.getFullYear()}`;

  console.log(`Selecting today's date: ${expectedDate}`);

  // Search for HR Employee by first and last name
  await peopleGrid.searchByFirstAndLastName('HR', 'Employee');

  // Open employee profile (exact match for 'HR')
  await peopleGrid.openEmployeeProfile('HR', true);

  // Open Actions menu
  await actions.openActionsMenu();

  // Click Change Position
  await actions.clickChangePosition();

  // Type today's date for effective date
  await changePositionFlyout.setEffectiveDateByTyping(expectedDate);

  // Randomly select department and store selected value
  const selectedDepartment = await changePositionFlyout.selectRandomDepartment();
  console.log(`Selected department: ${selectedDepartment}`);

  // Randomly select division and store selected value
  const selectedDivision = await changePositionFlyout.selectRandomDivision();
  console.log(`Selected division: ${selectedDivision}`);

  // Randomly select location and store selected value
  const selectedLocation = await changePositionFlyout.selectRandomLocation();
  console.log(`Selected location: ${selectedLocation}`);

  // Randomly select position and store selected value
  const selectedPosition = await changePositionFlyout.selectRandomPosition();
  console.log(`Selected position: ${selectedPosition}`);

  // Save the position change
  await changePositionFlyout.savePositionChange();

  // Verify all fields are properly updated
  const actualDepartment = await employeeProfile.getDepartmentValue();
  const actualPosition = await employeeProfile.getPositionValue();
  const actualDivision = await employeeProfile.getDivisionValue();
  const actualLocation = await employeeProfile.getLocationValue();

  // Verify each field matches what was selected
  expect(actualDepartment).toBe(selectedDepartment);
  console.log(`✓ Department verified: Expected ${selectedDepartment}, Got ${actualDepartment}`);

  expect(actualDivision).toBe(selectedDivision);
  console.log(`✓ Division verified: Expected ${selectedDivision}, Got ${actualDivision}`);

  expect(actualLocation).toBe(selectedLocation);
  console.log(`✓ Location verified: Expected ${selectedLocation}, Got ${actualLocation}`);

  expect(actualPosition).toBe(selectedPosition);
  console.log(`✓ Position verified: Expected ${selectedPosition}, Got ${actualPosition}`);

  // Pause to keep browser open
  await page.pause();
});

