import { test, expect } from '@playwright/test';
import { login, ensureSidebarExpanded, openPeople } from '../src/utils.js';
import { addEmployeeOnboardingChecklist, addEmployeePrehireChecklist, addEmployeeNoAutoAssignmentChecklist } from '../src/people/addEmployee.js';
import { addPosition, openPositions, updatePosition } from '../src/people/position.js';
import { addLocation, openLocations, updateLocation } from '../src/people/location.js';
import { addDepartment, openDepartments, updateDepartment } from '../src/people/department.js';
import { openCalendar, addEvent } from '../src/calendar/addEvent.js';

test('test', async ({ page }) => {
  // Increase timeout for this test
  test.setTimeout(60000);
  
  await login('stg', 'hr2admin222@mail.com', 'Password123!!', page);
  
  // Ensure sidebar is expanded
  await ensureSidebarExpanded(page);
  
  // Open People page
  await openPeople(page, expect);
  
  // Add employee with onboarding checklist
  await addEmployeeOnboardingChecklist(page, expect);
  
  // Pause to keep browser open
  await page.pause();
});

test('test2', async ({ page }) => {
  // Increase timeout for this test
  test.setTimeout(60000);
  
  await login('stg', 'hr2admin222@mail.com', 'Password123!!', page);
  
  // Ensure sidebar is expanded
  await ensureSidebarExpanded(page);
  
  // Open People page
  await openPeople(page, expect);
  
  // Add employee with prehire checklist
  await addEmployeePrehireChecklist(page, expect);
  
  // Pause to keep browser open
  await page.pause();
});

test('test3', async ({ page }) => {
  // Increase timeout for this test
  test.setTimeout(60000);
  
  await login('stg', 'hr2admin222@mail.com', 'Password123!!', page);
  
  // Ensure sidebar is expanded
  await ensureSidebarExpanded(page);
  
  // Open People page
  await openPeople(page, expect);
  
  // Add employee with no auto assignment
  await addEmployeeNoAutoAssignmentChecklist(page, expect);
  
  // Pause to keep browser open
  await page.pause();
});

test('test4', async ({ page }) => {
  // Increase timeout for this test
  test.setTimeout(60000);

  await login('stg', 'hr2admin222@mail.com', 'Password123!!', page);

  // Ensure sidebar is expanded
  await ensureSidebarExpanded(page);

  await openPeople(page, expect);

  // Open Positions page from people app
  await openPositions(page, expect);

  // Add new position
  await addPosition(page, expect);

  // Pause to keep browser open
  await page.pause();
});

test('test5', async ({ page }) => {
  // Increase timeout for this test
  test.setTimeout(60000);

  await login('stg', 'hr2admin222@mail.com', 'Password123!!', page);

  // Ensure sidebar is expanded
  await ensureSidebarExpanded(page);

  await openPeople(page, expect);

  // Open Locations page from people app
  await openLocations(page, expect);

  // Add new location
  await addLocation(page, expect);

  // Pause to keep browser open
  await page.pause();
});

test('test6', async ({ page }) => {
  // Increase timeout for this test
  test.setTimeout(60000);

  await login('stg', 'hr2admin222@mail.com', 'Password123!!', page);

  // Ensure sidebar is expanded
  await ensureSidebarExpanded(page);

  await openPeople(page, expect);

  // Open Positions page from people app
  await openPositions(page, expect);

  // Update existing position
  await updatePosition(page, expect);

  // Pause to keep browser open
  await page.pause();
});

test('test7', async ({ page }) => {
  // Increase timeout for this test
  test.setTimeout(60000);

  await login('stg', 'hr2admin222@mail.com', 'Password123!!', page);

  // Ensure sidebar is expanded
  await ensureSidebarExpanded(page);

  await openPeople(page, expect);

  // Open Locations page from people app
  await openLocations(page, expect);

  // Update existing location
  await updateLocation(page, expect);

  // Pause to keep browser open
  await page.pause();
});

test('test8', async ({ page }) => {
  // Increase timeout for this test
  test.setTimeout(60000);

  await login('stg', 'hr2admin222@mail.com', 'Password123!!', page);

  // Ensure sidebar is expanded
  await ensureSidebarExpanded(page);

  await openPeople(page, expect);

  // Open Departments page from people app
  await openDepartments(page, expect);

  // Add new department
  await addDepartment(page, expect);

  // Pause to keep browser open
  await page.pause();
});

test('test9', async ({ page }) => {
  // Increase timeout for this test
  test.setTimeout(60000);

  await login('stg', 'hr2admin222@mail.com', 'Password123!!', page);

  // Ensure sidebar is expanded
  await ensureSidebarExpanded(page);

  await openPeople(page, expect);

  // Open Departments page from people app
  await openDepartments(page, expect);

  // Update existing department
  await updateDepartment(page, expect);

  // Pause to keep browser open
  await page.pause();
});

test('test10', async ({ page }) => {
  // Increase timeout for this test
  test.setTimeout(60000);

  await login('stg', 'hr2admin222@mail.com', 'Password123!!', page);

  // Ensure sidebar is expanded
  await ensureSidebarExpanded(page);

  // Open Calendar from sidebar
  await openCalendar(page, expect);

  // Add new event with GUID as event name
  await addEvent(page, expect);

  // Pause to keep browser open
  await page.pause();
});