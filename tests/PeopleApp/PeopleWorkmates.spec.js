import { test, expect } from '@playwright/test';
import { login5 } from '../../src/loginInfo/loginInfo.js';
import { LoginPage } from '../../pom/LoginPage.js';
import { NavbarAndSidebar } from '../../pom/NavbarAndSidebar.js';
import { QuickAddEmployee } from '../../pom/PeopleApp/QuickAddEmployee.js';
import { PeopleGrid } from '../../pom/PeopleApp/PeopleGrid.js';
import { AddEmployeeFlyout } from '../../pom/PeopleApp/AddEmployeeFlyout.js';

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

  const peopleGrid = new PeopleGrid(page, expect);
  await peopleGrid.searchByFirstName(employeeData.firstName);

  // ========================================
  // STEP 4: Verify employee appears in grid
  // ========================================
  const employeeProfileLink = page.getByRole('link', { name: employeeData.firstName });
  await expect(employeeProfileLink).toBeVisible();

  console.log(`✓ Employee verified in grid: ${employeeData.firstName} ${employeeData.lastName}`);
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
  // STEP 3: Fill employee details
  // ========================================
  const addEmployeeFlyout = new AddEmployeeFlyout(page, expect);
  const employeeData = await addEmployeeFlyout.fillAllRequiredFields();

  // Select random values from dropdowns
  const dropdownValues = await addEmployeeFlyout.selectRandomFromAllDropdowns();

  console.log(`Created employee: ${employeeData.firstName} ${employeeData.lastName}`);
  console.log(`Employee email: ${employeeData.email}`);
  console.log(`Start date: ${employeeData.startDate}`);
  console.log(`Selected dropdowns:`, dropdownValues);

  // ========================================
  // STEP 4: Save employee (No Auto Assignment is default)
  // ========================================
  await addEmployeeFlyout.save();
  await page.waitForTimeout(3000);

  // ========================================
  // STEP 5: Navigate to People and search for employee
  // ========================================
  const nav = new NavbarAndSidebar(page, expect);
  await nav.goToPeopleAndVerify();

  const peopleGrid = new PeopleGrid(page, expect);
  await peopleGrid.searchByFirstName(employeeData.firstName);

  // ========================================
  // STEP 6: Verify employee appears in grid
  // ========================================
  const employeeProfileLink = page.getByRole('link', { name: employeeData.firstName });
  await expect(employeeProfileLink).toBeVisible();

  console.log(`✓ Employee verified in grid: ${employeeData.firstName} ${employeeData.lastName}`);
  console.log(`✓ Test completed: AddEmployeeWithDetails verified successfully`);
});
