import { test, expect } from '@playwright/test';
import { ensureSidebarExpanded, openPeople } from '../../src/utils.js';
import { login1 } from '../../src/loginInfo/loginInfo.js';
import { LoginPage } from '../../pom/LoginPage.js';
import { PeoplePortals } from '../../pom/peoplePortals.js';

// ============================================
// SETUP HELPER
// ============================================

async function setupTest(page) {
  test.setTimeout(60000);
  const loginPage = new LoginPage(page);
  await loginPage.login(login1.environment, login1.email, login1.password);
  await ensureSidebarExpanded(page);
  await openPeople(page, expect);
  const portals = new PeoplePortals(page);
  await portals.open();
  return portals;
}

// ============================================
// 1. NAVIGATION TESTS
// ============================================

test('should navigate to portals page', async ({ page }) => {
  const portals = await setupTest(page);
  await expect(portals.addButton).toBeVisible({ timeout: 10000 });
  console.log('✓ Portals page loaded successfully');
});

test('should open add portal form', async ({ page }) => {
  const portals = await setupTest(page);
  await portals.openAddForm();
  await expect(portals.getTitleField()).toBeVisible({ timeout: 5000 });
  await expect(portals.getSaveButton()).toBeVisible();
  await expect(portals.getCancelButton()).toBeVisible();
  console.log('✓ Add portal form opened successfully');
});

// ============================================
// 2. CREATE PORTAL TESTS
// ============================================

test('should create a new portal with title', async ({ page }) => {
  const portals = await setupTest(page);
  const portal = await portals.createPortal();

  // Verify portal appears in list
  await expect(portals.getPortalLocator(portal.portalTitle)).toBeVisible({ timeout: 10000 });
  console.log(`✓ Portal created successfully: ${portal.portalTitle}`);

  // Open the newly created portal to verify it exists
  await portals.clickPortalByName(portal.portalTitle);
  await portals.waitForDetailPageVisible();

  // Verify the detail page heading matches the portal title
  const heading = portals.getDetailPageHeading();
  await expect(heading).toContainText(portal.portalTitle, { timeout: 5000 });
  console.log(`✓ Portal opened successfully with title: ${portal.portalTitle}`);
});

test('should create portal with custom title', async ({ page }) => {
  const portals = await setupTest(page);
  const customTitle = `CustomPortal_${Date.now()}`;

  await portals.openAddForm();
  await portals.fillTitle(customTitle);
  await portals.save();

  // Verify portal appears in list
  await expect(portals.getPortalLocator(customTitle)).toBeVisible({ timeout: 10000 });
  console.log(`✓ Portal created with custom title: ${customTitle}`);

  // Open the newly created portal to verify it exists
  await portals.clickPortalByName(customTitle);
  await portals.waitForDetailPageVisible();

  // Verify the detail page heading matches the portal title
  const heading = portals.getDetailPageHeading();
  await expect(heading).toContainText(customTitle, { timeout: 5000 });
  console.log(`✓ Portal opened successfully with title: ${customTitle}`);
});

// ============================================
// 3. FORM VALIDATION TESTS
// ============================================

test('should prevent save when title is empty', async ({ page }) => {
  const portals = await setupTest(page);
  await portals.openAddForm();

  // Save button should be disabled when title is empty
  const isDisabled = await portals.getSaveButton().isDisabled();
  expect(isDisabled).toBe(true);

  // Form should still be visible
  await expect(portals.getTitleField()).toBeVisible({ timeout: 5000 });
  console.log('✓ Save button is disabled with empty title field');
});

test('should allow canceling portal creation', async ({ page }) => {
  const portals = await setupTest(page);
  await portals.openAddForm();
  await portals.fillTitle('Test Portal');
  await portals.cancel();

  // Add button should be visible again (form closed)
  await expect(portals.addButton).toBeVisible({ timeout: 5000 });
  console.log('✓ Portal creation cancelled successfully');
});

// ============================================
// 4. FIELD INTERACTION TESTS
// ============================================

test('should fill title field correctly', async ({ page }) => {
  const portals = await setupTest(page);
  await portals.openAddForm();

  const testTitle = 'Test Portal Title';
  await portals.fillTitle(testTitle);

  const fieldValue = await portals.getTitleField().inputValue();
  expect(fieldValue).toBe(testTitle);
  console.log('✓ Title field filled correctly');
});

test('should clear title field', async ({ page }) => {
  const portals = await setupTest(page);
  await portals.openAddForm();

  await portals.fillTitle('Initial Title');
  await portals.clearTitle();

  const fieldValue = await portals.getTitleField().inputValue();
  expect(fieldValue).toBe('');
  console.log('✓ Title field cleared successfully');
});

// ============================================
// 5. BUTTON STATE TESTS
// ============================================

test('should display save and cancel buttons', async ({ page }) => {
  const portals = await setupTest(page);
  await portals.openAddForm();

  await expect(portals.getSaveButton()).toBeVisible();
  await expect(portals.getCancelButton()).toBeVisible();

  const saveText = await portals.getSaveButton().textContent();
  const cancelText = await portals.getCancelButton().textContent();

  console.log(`✓ Save button: "${saveText}"`);
  console.log(`✓ Cancel button: "${cancelText}"`);
});

// ============================================
// 6. COMPLETE WORKFLOW TESTS
// ============================================

test('complete portal creation workflow', async ({ page }) => {
  const portals = await setupTest(page);

  console.log('Starting complete portal workflow test...');

  // Step 1: Create portal (which opens form, fills, and saves)
  const portal = await portals.createPortal();
  console.log(`  ✓ Portal created: ${portal.portalTitle}`);

  // Step 2: Verify it appears in list
  await expect(portals.getPortalLocator(portal.portalTitle)).toBeVisible({ timeout: 10000 });
  console.log('  ✓ Portal visible in list');

  // Step 3: Open the portal to verify it exists
  await portals.clickPortalByName(portal.portalTitle);
  await portals.waitForDetailPageVisible();

  // Step 4: Verify the detail page heading matches the portal title
  const heading = portals.getDetailPageHeading();
  await expect(heading).toContainText(portal.portalTitle, { timeout: 5000 });
  console.log('  ✓ Portal opened and verified');

  console.log('✓ COMPLETE WORKFLOW TEST PASSED');
});

// ============================================
// GROUPED TESTS
// ============================================

test.describe('Portals - Critical Path', () => {
  test('critical: navigate and create portal', async ({ page }) => {
    const portals = await setupTest(page);
    const portal = await portals.createPortal();

    // Verify portal appears in list
    await expect(portals.getPortalLocator(portal.portalTitle)).toBeVisible({ timeout: 10000 });

    // Open the newly created portal to verify it exists
    await portals.clickPortalByName(portal.portalTitle);
    await portals.waitForDetailPageVisible();

    // Verify the detail page heading matches the portal title
    const heading = portals.getDetailPageHeading();
    await expect(heading).toContainText(portal.portalTitle, { timeout: 5000 });
  });

  test('critical: form validation', async ({ page }) => {
    const portals = await setupTest(page);
    await portals.openAddForm();

    // Save button should be disabled when title is empty
    const isDisabled = await portals.getSaveButton().isDisabled();
    expect(isDisabled).toBe(true);

    await expect(portals.getTitleField()).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Portals - Form Interactions', () => {
  test('should handle form field interactions', async ({ page }) => {
    const portals = await setupTest(page);
    await portals.openAddForm();
    await portals.fillTitle('Test');
    await portals.clearTitle();
    const value = await portals.getTitleField().inputValue();
    expect(value).toBe('');
  });
});
