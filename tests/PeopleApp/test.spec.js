import { test, expect } from '@playwright/test';
import { ensureSidebarExpanded, openPeople } from '../../src/utils.js';
import { login1 } from '../../src/loginInfo/loginInfo.js';
import { LoginPage } from '../../pom/LoginPage.js';
import { AddEmployeeFlyout } from '../../pom/AddEmployeeFlyout.js';
import { Position } from '../../pom/Position.js';
import { Location } from '../../pom/Location.js';
import { Department } from '../../pom/Department.js';
import { openCalendar, addEvent } from '../../src/calendar/addEvent.js';

test('test', async ({ page }) => {
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

test('test2', async ({ page }) => {
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

test('test3', async ({ page }) => {
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

test('test4', async ({ page }) => {
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

test('test5', async ({ page }) => {
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

test('test6', async ({ page }) => {
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

test('test7', async ({ page }) => {
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

test('test8', async ({ page }) => {
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

test('test9', async ({ page }) => {
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

test('test10', async ({ page }) => {
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