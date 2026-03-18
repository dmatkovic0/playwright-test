import { test, expect } from '@playwright/test';
import { login3 } from '../../src/loginInfo/loginInfo.js';
import { LoginPage } from '../../pom/LoginPage.js';
import { NavbarAndSidebar } from '../../pom/NavbarAndSidebar.js';
import { AddEmployeeFlyout } from '../../pom/PeopleApp/AddEmployeeFlyout.js';
import { PeopleGrid } from '../../pom/PeopleApp/PeopleGrid.js';
import { EmployeeProfileFlyout } from '../../pom/PeopleApp/EmployeeProfileFlyout.js';
import { GlobalSystemSettings } from '../../pom/SystemSettings/GlobalSystemSettings.js';
import { OnboardSettings } from '../../pom/SystemSettings/OnboardSettings.js';

test('VerifyPreboardingMandatoryFieldsConfiguration', async ({ page }) => {
  // Increase timeout for this comprehensive test
  test.setTimeout(180000); // 3 minutes

  // ========================================
  // STEP 1: Login
  // ========================================
  const loginPage = new LoginPage(page, expect);
  await loginPage.login(login3.environment, login3.email, login3.password);

  // ========================================
  // STEP 2: Navigate to People
  // ========================================
  const nav = new NavbarAndSidebar(page, expect);
  await nav.ensureSidebarExpanded();
  await nav.goToPeopleAndVerify();

  // ========================================
  // STEP 3: Add prehire employee with basic fields only (optional fields test)
  // ========================================
  console.log('\n--- PART 1: Testing with Optional Fields ---');
  const addEmployeeFlyout = new AddEmployeeFlyout(page, expect);
  const peopleGrid = new PeopleGrid(page, expect);
  const employeeProfile = new EmployeeProfileFlyout(page, expect);

  await addEmployeeFlyout.open();
  const employee1Data = await addEmployeeFlyout.createPrehireEmployeeBasicOnly();

  console.log(`Created employee 1: ${employee1Data.firstName} ${employee1Data.lastName}`);

  // Wait for save to complete
  await page.waitForTimeout(3000);

  // ========================================
  // STEP 4: Verify first employee in grid and check start date
  // ========================================
  await peopleGrid.clickBack();
  await peopleGrid.searchByFirstName(employee1Data.firstName);
  await peopleGrid.verifyEmployeeInGrid(employee1Data.firstName);

  console.log(`Employee 1 verified in grid: ${employee1Data.firstName} ${employee1Data.lastName}`);

  // Open employee profile
  await peopleGrid.openEmployeeProfile(employee1Data.firstName);

  // Verify start date is today's date
  const actualStartDate1 = await employeeProfile.getStartDateValue();
  const today = new Date();
  const expectedStartDate = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}/${today.getFullYear()}`;

  expect(actualStartDate1.trim()).toBe(expectedStartDate);
  console.log(`Start Date verified for employee 1: ${actualStartDate1.trim()}`);

  // Verify employment status is Prehire
  const actualEmploymentStatus1 = await employeeProfile.getEmploymentStatusValue();
  expect(actualEmploymentStatus1).toContain('Prehire');
  console.log(`Employment Status verified for employee 1: ${actualEmploymentStatus1}`);

  // Go back to grid
  await peopleGrid.clickBack();

  // ========================================
  // STEP 5: Navigate to System Settings and configure mandatory fields
  // ========================================
  console.log('\n--- PART 2: Configuring Mandatory Fields ---');
  await nav.goToSettings();
  await page.waitForTimeout(2000);

  const globalSystemSettings = new GlobalSystemSettings(page, expect);
  const onboardSettings = new OnboardSettings(page, expect);

  await globalSystemSettings.clickOnboardSettings();
  await onboardSettings.clickConfigurePreboardingMandatoryFields();

  // Set all fields to mandatory
  console.log('Setting Start Date, Department, Position, Location to Mandatory...');
  await onboardSettings.configureAllPreboardingFields('mandatory');
  console.log('All fields set to Mandatory');

  // ========================================
  // STEP 6: Navigate back to People and try to add employee with only basic fields
  // ========================================
  console.log('\n--- PART 3: Testing Mandatory Fields Enforcement ---');
  await nav.goToPeopleAndVerify();

  await addEmployeeFlyout.open();
  const employee2BasicData = await addEmployeeFlyout.fillBasicFieldsForPrehire();
  await addEmployeeFlyout.selectPrehireChecklist();

  console.log(`Attempting to create employee 2 with basic fields only: ${employee2BasicData.firstName} ${employee2BasicData.lastName}`);

  // ========================================
  // STEP 7: Try to save without mandatory fields and verify it fails
  // ========================================
  // Try to click the save button
  const saveButton = addEmployeeFlyout.getSaveButton();
  await saveButton.click();
  await page.waitForTimeout(2000);

  // Verify we're still on the flyout (employee was not created due to validation)
  const flyoutStillVisible = await addEmployeeFlyout.getFlyoutContainer().isVisible();
  expect(flyoutStillVisible).toBe(true);
  console.log('Employee not created - validation prevented save (flyout still open)');

  // ========================================
  // STEP 8: Fill all mandatory fields
  // ========================================
  console.log('Filling all mandatory fields...');

  // Fill start date
  const todayDate = addEmployeeFlyout.getTodayDate();
  await addEmployeeFlyout.fillStartDate(todayDate);

  // Select random values from dropdowns and store them
  const selectedDepartment = await addEmployeeFlyout.selectRandomFromDropdown(addEmployeeFlyout.getDepartmentDropdown());
  const selectedPosition = await addEmployeeFlyout.selectRandomFromDropdown(addEmployeeFlyout.getPositionDropdown());
  const selectedLocation = await addEmployeeFlyout.selectRandomFromDropdown(addEmployeeFlyout.getLocationDropdown());

  console.log(`Selected Department: ${selectedDepartment}`);
  console.log(`Selected Position: ${selectedPosition}`);
  console.log(`Selected Location: ${selectedLocation}`);

  // Save
  await addEmployeeFlyout.save();
  console.log(`Employee 2 created with all mandatory fields: ${employee2BasicData.firstName} ${employee2BasicData.lastName}`);

  // Wait for save to complete
  await page.waitForTimeout(3000);

  // ========================================
  // STEP 9: Verify second employee in grid and check all fields
  // ========================================
  await peopleGrid.clickBack();
  await peopleGrid.searchByFirstName(employee2BasicData.firstName);
  await peopleGrid.verifyEmployeeInGrid(employee2BasicData.firstName);

  console.log(`Employee 2 verified in grid: ${employee2BasicData.firstName} ${employee2BasicData.lastName}`);

  // Open employee profile
  await peopleGrid.openEmployeeProfile(employee2BasicData.firstName);

  // Verify all fields
  const actualStartDate2 = await employeeProfile.getStartDateValue();
  const actualDepartment2 = await employeeProfile.getDepartmentValue();
  const actualPosition2 = await employeeProfile.getPositionValue();
  const actualLocation2 = await employeeProfile.getLocationValue();
  const actualEmploymentStatus2 = await employeeProfile.getEmploymentStatusValue();

  expect(actualStartDate2.trim()).toBe(todayDate);
  expect(actualDepartment2).toBe(selectedDepartment);
  expect(actualPosition2).toBe(selectedPosition);
  expect(actualLocation2).toBe(selectedLocation);
  expect(actualEmploymentStatus2).toContain('Prehire');

  console.log(`Start Date verified for employee 2: ${actualStartDate2.trim()}`);
  console.log(`Department verified for employee 2: ${actualDepartment2}`);
  console.log(`Position verified for employee 2: ${actualPosition2}`);
  console.log(`Location verified for employee 2: ${actualLocation2}`);
  console.log(`Employment Status verified for employee 2: ${actualEmploymentStatus2}`);

  // Go back to grid
  await peopleGrid.clickBack();

  // ========================================
  // STEP 10: Navigate to System Settings and reset to optional (cleanup)
  // ========================================
  console.log('\n--- PART 4: Cleanup - Resetting to Optional Fields ---');
  await nav.goToSettings();
  await page.waitForTimeout(2000);

  await globalSystemSettings.clickOnboardSettings();
  await onboardSettings.clickConfigurePreboardingMandatoryFields();

  // Set all fields back to optional
  console.log('Setting Start Date, Department, Position, Location to Optional...');
  await onboardSettings.configureAllPreboardingFields('optional');
  console.log('All fields set to Optional');

  // ========================================
  // STEP 11: Verify cleanup - add employee with basic fields only again
  // ========================================
  console.log('\n--- PART 5: Verifying Cleanup - Testing with Optional Fields ---');
  await nav.goToPeopleAndVerify();

  await addEmployeeFlyout.open();
  const employee3Data = await addEmployeeFlyout.createPrehireEmployeeBasicOnly();

  console.log(`Created employee 3: ${employee3Data.firstName} ${employee3Data.lastName}`);

  // Wait for save to complete
  await page.waitForTimeout(3000);

  // ========================================
  // STEP 12: Verify third employee in grid and check start date
  // ========================================
  await peopleGrid.clickBack();
  await peopleGrid.searchByFirstName(employee3Data.firstName);
  await peopleGrid.verifyEmployeeInGrid(employee3Data.firstName);

  console.log(`Employee 3 verified in grid: ${employee3Data.firstName} ${employee3Data.lastName}`);

  // Open employee profile
  await peopleGrid.openEmployeeProfile(employee3Data.firstName);

  // Verify start date is today's date
  const actualStartDate3 = await employeeProfile.getStartDateValue();
  expect(actualStartDate3.trim()).toBe(expectedStartDate);
  console.log(`Start Date verified for employee 3: ${actualStartDate3.trim()}`);

  // Verify employment status is Prehire
  const actualEmploymentStatus3 = await employeeProfile.getEmploymentStatusValue();
  expect(actualEmploymentStatus3).toContain('Prehire');
  console.log(`Employment Status verified for employee 3: ${actualEmploymentStatus3}`);

  console.log('Test completed successfully: Preboarding mandatory fields configuration verified');
});

test('AddPrehireEmployee', async ({ page }) => {
  // Increase timeout for this test
  test.setTimeout(60000);

  const loginPage = new LoginPage(page, expect);
  await loginPage.login(login3.environment, login3.email, login3.password);

  // Ensure sidebar is expanded and open People page
  const nav = new NavbarAndSidebar(page, expect);
  await nav.ensureSidebarExpanded();
  await nav.goToPeopleAndVerify();

  // Create POM instances
  const addEmployeeFlyout = new AddEmployeeFlyout(page, expect);
  const peopleGrid = new PeopleGrid(page, expect);
  const employeeProfile = new EmployeeProfileFlyout(page, expect);

  // Open flyout and add employee with prehire checklist
  await addEmployeeFlyout.open();
  const employeeData = await addEmployeeFlyout.createEmployeeWithPrehireChecklist();

  console.log(`Created employee: ${employeeData.firstName} ${employeeData.lastName}`);
  console.log(`Selected Department: ${employeeData.department}`);
  console.log(`Selected Position: ${employeeData.position}`);
  console.log(`Selected Location: ${employeeData.location}`);
  console.log(`Selected Division: ${employeeData.division}`);
  console.log(`Selected Manager: ${employeeData.manager}`);

  // Wait for save to complete
  await page.waitForTimeout(3000);

  // Click Back to return to employee grid
  await peopleGrid.clickBack();

  // Search for the employee by first name
  await peopleGrid.searchByFirstName(employeeData.firstName);

  // Verify employee appears in search results
  await peopleGrid.verifyEmployeeInGrid(employeeData.firstName);

  console.log(`✓ Verified employee appears in grid: ${employeeData.firstName} ${employeeData.lastName}`);

  // Open employee profile
  await peopleGrid.openEmployeeProfile(employeeData.firstName);

  // Verify all fields in the profile
  const actualDepartment = await employeeProfile.getDepartmentValue();
  const actualPosition = await employeeProfile.getPositionValue();
  const actualLocation = await employeeProfile.getLocationValue();
  const actualDivision = await employeeProfile.getDivisionValue();
  const actualManager = await employeeProfile.getManagerValue();
  const actualStartDate = await employeeProfile.getStartDateValue();
  const actualEmploymentStatus = await employeeProfile.getEmploymentStatusValue();

  // Get today's date for comparison (system auto-populates start date for prehire)
  const today = new Date();
  const expectedStartDate = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}/${today.getFullYear()}`;

  expect(actualDepartment).toBe(employeeData.department);
  expect(actualPosition).toBe(employeeData.position);
  expect(actualLocation).toBe(employeeData.location);
  expect(actualDivision).toBe(employeeData.division);
  expect(actualManager).toContain(employeeData.manager);
  expect(actualStartDate.trim()).toBe(expectedStartDate);
  expect(actualEmploymentStatus).toContain('Prehire');

  console.log(`✓ Department verified: ${actualDepartment}`);
  console.log(`✓ Position verified: ${actualPosition}`);
  console.log(`✓ Location verified: ${actualLocation}`);
  console.log(`✓ Division verified: ${actualDivision}`);
  console.log(`✓ Manager verified: ${actualManager}`);
  console.log(`✓ Start Date verified: ${actualStartDate.trim()}`);
  console.log(`✓ Employment Status verified: ${actualEmploymentStatus}`);

  // Verify employment status badge is visible (visual indicator)
  const employmentStatusBadge = page.locator("//span[contains(@class,'label-caps PreHire')]");
  await expect(employmentStatusBadge).toBeVisible();
  console.log(`✓ Employment Status badge 'Prehire' is visible`);

});

test('AddEmployeeNoAutoAssignment', async ({ page }) => {
  // Increase timeout for this test
  test.setTimeout(60000);

  const loginPage = new LoginPage(page, expect);
  await loginPage.login(login3.environment, login3.email, login3.password);

  // Ensure sidebar is expanded and open People page
  const nav = new NavbarAndSidebar(page, expect);
  await nav.ensureSidebarExpanded();
  await nav.goToPeopleAndVerify();

  // Create POM instances
  const addEmployeeFlyout = new AddEmployeeFlyout(page, expect);
  const peopleGrid = new PeopleGrid(page, expect);
  const employeeProfile = new EmployeeProfileFlyout(page, expect);

  // Open flyout and add employee with no auto assignment
  await addEmployeeFlyout.open();
  const employeeData = await addEmployeeFlyout.createEmployeeWithNoAutoAssignment();

  console.log(`Created employee: ${employeeData.firstName} ${employeeData.lastName}`);
  console.log(`Selected Department: ${employeeData.department}`);
  console.log(`Selected Position: ${employeeData.position}`);
  console.log(`Selected Location: ${employeeData.location}`);
  console.log(`Selected Division: ${employeeData.division}`);
  console.log(`Selected Manager: ${employeeData.manager}`);

  // Wait for save to complete
  await page.waitForTimeout(3000);

  // Click Back to return to employee grid
  await peopleGrid.clickBack();

  // Search for the employee by first name
  await peopleGrid.searchByFirstName(employeeData.firstName);

  // Verify employee appears in search results
  await peopleGrid.verifyEmployeeInGrid(employeeData.firstName);

  console.log(`✓ Verified employee appears in grid: ${employeeData.firstName} ${employeeData.lastName}`);

  // Open employee profile
  await peopleGrid.openEmployeeProfile(employeeData.firstName);

  // Verify all fields in the profile
  const actualDepartment = await employeeProfile.getDepartmentValue();
  const actualPosition = await employeeProfile.getPositionValue();
  const actualLocation = await employeeProfile.getLocationValue();
  const actualDivision = await employeeProfile.getDivisionValue();
  const actualManager = await employeeProfile.getManagerValue();
  const actualStartDate = await employeeProfile.getStartDateValue();
  const actualEmploymentStatus = await employeeProfile.getEmploymentStatusValue();

  // Get today's date for comparison (system auto-populates start date for no auto assignment)
  const today = new Date();
  const expectedStartDate = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}/${today.getFullYear()}`;

  expect(actualDepartment).toBe(employeeData.department);
  expect(actualPosition).toBe(employeeData.position);
  expect(actualLocation).toBe(employeeData.location);
  expect(actualDivision).toBe(employeeData.division);
  expect(actualManager).toContain(employeeData.manager);
  expect(actualStartDate.trim()).toBe(expectedStartDate);
  expect(actualEmploymentStatus).toContain('Active');

  console.log(`✓ Department verified: ${actualDepartment}`);
  console.log(`✓ Position verified: ${actualPosition}`);
  console.log(`✓ Location verified: ${actualLocation}`);
  console.log(`✓ Division verified: ${actualDivision}`);
  console.log(`✓ Manager verified: ${actualManager}`);
  console.log(`✓ Start Date verified: ${actualStartDate.trim()}`);
  console.log(`✓ Employment Status verified: ${actualEmploymentStatus}`);

  // Verify employment status badge is visible (visual indicator)
  const employmentStatusBadge = page.locator("//span[contains(@class,'label-caps Active')]");
  await expect(employmentStatusBadge).toBeVisible();
  console.log(`✓ Employment Status badge 'Active' is visible`);

});
