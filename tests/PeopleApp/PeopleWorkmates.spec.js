import { test, expect } from '@playwright/test';
import { login5 } from '../../src/loginInfo/loginInfo.js';
import { LoginPage } from '../../pom/LoginPage.js';
import { NavbarAndSidebar } from '../../pom/NavbarAndSidebar.js';
import { QuickAddEmployee } from '../../pom/PeopleApp/QuickAddEmployee.js';
import { PeopleGrid } from '../../pom/PeopleApp/PeopleGrid.js';
import { AddEmployeeFlyout } from '../../pom/PeopleApp/AddEmployeeFlyout.js';
import { AddEmployeeWithDetailsFlyoutPeopleWM } from '../../pom/PeopleApp/AddEmployeeWithDetailsFlyoutPeopleWM.js';

test('QuickAddEmployee', async ({ page }) => {
  test.setTimeout(60000); // 1 minute

  // ========================================
  // STEP 1: Login
  // ========================================
  const loginPage = new LoginPage(page, expect);
  await loginPage.login(login5.environment, login5.email, login5.password);

  // ========================================
  // STEP 2: Quick Add Employee
  // ========================================
  const quickAddEmployee = new QuickAddEmployee(page, expect);
  await quickAddEmployee.open();
  const employeeData = await quickAddEmployee.addQuickEmployee();

  console.log(`Created employee: ${employeeData.firstName} ${employeeData.lastName}`);
  console.log(`Employee email: ${employeeData.email}`);

  // ========================================
  // STEP 3: Navigate to People and search for employee
  // ========================================
  const nav = new NavbarAndSidebar(page, expect);
  await nav.goToPeopleAndVerify();

  // Get today's date (Quick Add auto-populates start date as today)
  const addEmployeeFlyout = new AddEmployeeFlyout(page, expect);
  const todayDate = addEmployeeFlyout.getTodayDate();

  const peopleGrid = new PeopleGrid(page, expect);
  await peopleGrid.searchByFirstName(employeeData.firstName);
  await peopleGrid.searchByLastName(employeeData.lastName);
  await peopleGrid.searchByStartDate(todayDate);

  // ========================================
  // STEP 4: Verify employee appears in grid
  // ========================================
  const employeeProfileLink = page.getByRole('link', { name: employeeData.firstName });
  await expect(employeeProfileLink).toBeVisible();

  console.log(`✓ Employee verified in grid: ${employeeData.firstName} ${employeeData.lastName}`);
  console.log(`✓ Start Date: ${todayDate}`);
  console.log(`✓ Test completed: QuickAddEmployee verified successfully`);
});

test('AddEmployeeWithDetails', async ({ page }) => {
  test.setTimeout(60000); // 1 minute

  // ========================================
  // STEP 1: Login
  // ========================================
  const loginPage = new LoginPage(page, expect);
  await loginPage.login(login5.environment, login5.email, login5.password);

  // ========================================
  // STEP 2: Open Add Employee with Details
  // ========================================
  const quickAddEmployee = new QuickAddEmployee(page, expect);
  await quickAddEmployee.openAddEmployeeWithDetails();

  // ========================================
  // STEP 3: Fill employee details and save
  // ========================================
  const addEmployeeWithDetailsFlyout = new AddEmployeeWithDetailsFlyoutPeopleWM(page, expect);
  const employeeData = await addEmployeeWithDetailsFlyout.createEmployeeWithDetails();

  console.log(`Created employee: ${employeeData.firstName} ${employeeData.lastName}`);
  console.log(`Employee email: ${employeeData.email}`);
  console.log(`Start date: ${employeeData.startDate}`);
  console.log(`Selected Position: ${employeeData.position}`);
  console.log(`Selected Department: ${employeeData.department}`);
  console.log(`Selected Location: ${employeeData.location}`);
  console.log(`Selected Manager: ${employeeData.manager}`);

  // Wait for save to complete
  await page.waitForTimeout(3000);

  // ========================================
  // STEP 4: Navigate to People and search for employee
  // ========================================
  const nav = new NavbarAndSidebar(page, expect);
  await nav.goToPeopleAndVerify();

  const peopleGrid = new PeopleGrid(page, expect);
  await peopleGrid.searchByFirstName(employeeData.firstName);
  await peopleGrid.searchByLastName(employeeData.lastName);
  await peopleGrid.searchByStartDate(employeeData.startDate);
  await peopleGrid.searchByPosition(employeeData.position);
  await peopleGrid.searchByDepartment(employeeData.department);
  await peopleGrid.searchByLocation(employeeData.location);

  // ========================================
  // STEP 5: Verify employee appears in grid
  // ========================================
  const employeeProfileLink = page.getByRole('link', { name: employeeData.firstName });
  await expect(employeeProfileLink).toBeVisible();

  console.log(`✓ Employee verified in grid with all filters applied`);
  console.log(`✓ Test completed: AddEmployeeWithDetails verified successfully`);
});
