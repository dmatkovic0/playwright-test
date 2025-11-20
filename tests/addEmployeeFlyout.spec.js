import { test, expect } from '@playwright/test';
import { login, ensureSidebarExpanded, openPeople } from '../src/utils.js';
import { login1 } from '../src/loginInfo/loginInfo.js';
import {
  // 1. Flyout Display & Layout Tests
  verifyFlyoutOpens,
  verifyAllFormFieldsVisible,
  verifyRequiredFieldIndicators,

  // 2. Required Field Validation Tests
  testSaveWithAllFieldsEmpty,
  testSaveWithOnlyFirstName,
  testSaveWithMinimumRequiredFields,

  // 3. Field Format Validation Tests
  testInvalidEmailFormat,
  testValidEmailFormat,
  testDateFieldValidation,

  // 4. Dropdown Functionality Tests
  testDepartmentDropdown,
  testPositionDropdown,
  testLocationDropdown,
  testAllDropdowns,
  testDropdownChangeSelection,

  // 5. Manager Lookup Tests
  testManagerLookupOpens,
  testManagerSelection,
  testManagerLookupCancel,

  // 6. Checklist Option Tests
  testOnboardingChecklistSelection,
  testPrehireChecklistSelection,
  testNoAutoAssignmentSelection,
  testSwitchBetweenChecklistOptions,

  // 7. Save Functionality Tests
  testSuccessfulSaveWithAllFields,
  testSaveButtonState,

  // 8. Cancel/Close Functionality Tests
  testCloseFlyoutWithCloseButton,
  testCloseFlyoutWithEscKey,
  testCancelButton,

  // 9. Data Persistence Tests
  testDataPersistenceWhenSwitchingFields,
  testDataPersistenceDuringDropdownInteractions,

  // 10. Keyboard Navigation Tests
  testKeyboardNavigation,

  // 11. Comprehensive Integration Tests
  testCompleteFlyoutWorkflow
} from '../src/people/addEmployeeFlyout.js';

// ============================================
// SETUP HELPER
// ============================================

async function setupTest(page, expect) {
  test.setTimeout(20000);
  await login(login1.environment, login1.email, login1.password, page);
  await ensureSidebarExpanded(page);
  await openPeople(page, expect);
}

// ============================================
// 1. FLYOUT DISPLAY & LAYOUT TESTS
// ============================================

test('should open add employee flyout when clicking add button', async ({ page }) => {
  await setupTest(page, expect);
  await verifyFlyoutOpens(page, expect);
});

test('should display all form fields in the flyout', async ({ page }) => {
  await setupTest(page, expect);
  await verifyAllFormFieldsVisible(page, expect);
});

test('should show required field indicators (*) for mandatory fields', async ({ page }) => {
  await setupTest(page, expect);
  await verifyRequiredFieldIndicators(page, expect);
});

// ============================================
// 2. REQUIRED FIELD VALIDATION TESTS
// ============================================

test('should prevent save when all required fields are empty', async ({ page }) => {
  await setupTest(page, expect);
  await testSaveWithAllFieldsEmpty(page, expect);
});

test('should prevent save when only first name is filled', async ({ page }) => {
  await setupTest(page, expect);
  await testSaveWithOnlyFirstName(page, expect);
});

test('should successfully save with minimum required fields', async ({ page }) => {
  await setupTest(page, expect);
  await testSaveWithMinimumRequiredFields(page, expect);
});

// ============================================
// 3. FIELD FORMAT VALIDATION TESTS
// ============================================

test('should validate email field format', async ({ page }) => {
  await setupTest(page, expect);
  await testInvalidEmailFormat(page, expect);
});

test('should accept valid email format', async ({ page }) => {
  await setupTest(page, expect);
  await testValidEmailFormat(page, expect);
});

test('should validate date field format', async ({ page }) => {
  await setupTest(page, expect);
  await testDateFieldValidation(page, expect);
});

// ============================================
// 4. DROPDOWN FUNCTIONALITY TESTS
// ============================================

test('should open and select from department dropdown', async ({ page }) => {
  await setupTest(page, expect);
  await testDepartmentDropdown(page, expect);
});

test('should open and select from position dropdown', async ({ page }) => {
  await setupTest(page, expect);
  await testPositionDropdown(page, expect);
});

test('should open and select from location dropdown', async ({ page }) => {
  await setupTest(page, expect);
  await testLocationDropdown(page, expect);
});

test('should work with all dropdowns sequentially', async ({ page }) => {
  await setupTest(page, expect);
  await testAllDropdowns(page, expect);
});

test('should allow changing dropdown selection', async ({ page }) => {
  await setupTest(page, expect);
  await testDropdownChangeSelection(page, expect);
});

// ============================================
// 5. MANAGER LOOKUP TESTS
// ============================================

test('should open manager lookup flyout', async ({ page }) => {
  await setupTest(page, expect);
  await testManagerLookupOpens(page, expect);
});

test('should select manager from lookup grid', async ({ page }) => {
  await setupTest(page, expect);
  await testManagerSelection(page, expect);
});

test('should allow canceling manager lookup without selection', async ({ page }) => {
  await setupTest(page, expect);
  await testManagerLookupCancel(page, expect);
});

// ============================================
// 6. CHECKLIST OPTION TESTS
// ============================================

test('should select Onboarding checklist option', async ({ page }) => {
  await setupTest(page, expect);
  await testOnboardingChecklistSelection(page, expect);
});

test('should select Prehire checklist option', async ({ page }) => {
  await setupTest(page, expect);
  await testPrehireChecklistSelection(page, expect);
});

test('should select No Auto Assignment option', async ({ page }) => {
  await setupTest(page, expect);
  await testNoAutoAssignmentSelection(page, expect);
});

test('should allow switching between checklist options', async ({ page }) => {
  await setupTest(page, expect);
  await testSwitchBetweenChecklistOptions(page, expect);
});

// ============================================
// 7. SAVE FUNCTIONALITY TESTS
// ============================================

test('should successfully save employee with all fields filled', async ({ page }) => {
  await setupTest(page, expect);
  await testSuccessfulSaveWithAllFields(page, expect);
});

test('should verify save button state', async ({ page }) => {
  await setupTest(page, expect);
  await testSaveButtonState(page, expect);
});

// ============================================
// 8. CANCEL/CLOSE FUNCTIONALITY TESTS
// ============================================

test('should close flyout with close button without saving', async ({ page }) => {
  await setupTest(page, expect);
  await testCloseFlyoutWithCloseButton(page, expect);
});

test('should close flyout with ESC key', async ({ page }) => {
  await setupTest(page, expect);
  await testCloseFlyoutWithEscKey(page, expect);
});

test('should close flyout with cancel button', async ({ page }) => {
  await setupTest(page, expect);
  await testCancelButton(page, expect);
});

// ============================================
// 9. DATA PERSISTENCE TESTS
// ============================================

test('should maintain field values when switching between fields', async ({ page }) => {
  await setupTest(page, expect);
  await testDataPersistenceWhenSwitchingFields(page, expect);
});

test('should maintain field values during dropdown interactions', async ({ page }) => {
  await setupTest(page, expect);
  await testDataPersistenceDuringDropdownInteractions(page, expect);
});

// ============================================
// 10. KEYBOARD NAVIGATION TESTS
// ============================================

test('should support keyboard navigation through form fields', async ({ page }) => {
  await setupTest(page, expect);
  await testKeyboardNavigation(page, expect);
});

// ============================================
// 11. COMPREHENSIVE INTEGRATION TESTS
// ============================================

test('should complete full employee creation workflow', async ({ page }) => {
  await setupTest(page, expect);
  await testCompleteFlyoutWorkflow(page, expect);
});

// ============================================
// OPTIONAL: RUN SPECIFIC TEST SUITE
// ============================================

// You can also group tests and run them selectively
test.describe('Add Employee Flyout - Critical Path Tests', () => {
  test('critical: open flyout and verify layout', async ({ page }) => {
    await setupTest(page, expect);
    await verifyFlyoutOpens(page, expect);
    await verifyAllFormFieldsVisible(page, expect);
  });

  test('critical: required field validation', async ({ page }) => {
    await setupTest(page, expect);
    await testSaveWithAllFieldsEmpty(page, expect);
  });

  test('critical: successful employee creation', async ({ page }) => {
    await setupTest(page, expect);
    await testSuccessfulSaveWithAllFields(page, expect);
  });
});

test.describe('Add Employee Flyout - Dropdown Tests', () => {
  test('all dropdowns should work correctly', async ({ page }) => {
    await setupTest(page, expect);
    await testAllDropdowns(page, expect);
  });
});

test.describe('Add Employee Flyout - Manager Selection', () => {
  test('manager lookup workflow', async ({ page }) => {
    await setupTest(page, expect);
    await testManagerLookupOpens(page, expect);
    await testManagerSelection(page, expect);
  });
});
