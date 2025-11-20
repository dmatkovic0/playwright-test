import { test, expect } from '@playwright/test';
import { login, ensureSidebarExpanded, openPeople } from '../src/utils.js';
import { login1 } from '../src/loginInfo/loginInfo.js';

test('DEBUG: Inspect flyout structure', async ({ page }) => {
  test.setTimeout(60000);

  // Login and navigate to People page
  await login(login1.environment, login1.email, login1.password, page);
  await ensureSidebarExpanded(page);
  await openPeople(page, expect);

  console.log('\n========================================');
  console.log('BEFORE clicking Add button');
  console.log('========================================');

  // Take screenshot before opening flyout
  await page.screenshot({ path: 'debug-before-flyout.png', fullPage: true });
  console.log('Screenshot saved: debug-before-flyout.png');

  // Click add button to open flyout
  await page.locator('.aut-button-add').click();
  await page.waitForTimeout(2000);

  console.log('\n========================================');
  console.log('AFTER clicking Add button');
  console.log('========================================');

  // Take screenshot after opening flyout
  await page.screenshot({ path: 'debug-after-flyout.png', fullPage: true });
  console.log('Screenshot saved: debug-after-flyout.png');

  // Try to find the flyout container using various common selectors
  console.log('\n--- Checking common flyout selectors ---');

  const selectors = [
    '[role="dialog"]',
    '.flyout',
    '.modal',
    '.modal-dialog',
    '.modal-content',
    '[class*="flyout"]',
    '[class*="modal"]',
    '[class*="dialog"]',
    '[class*="panel"]',
    '[class*="sidebar"]',
    '.side-panel',
    '.drawer',
    '[class*="drawer"]',
    'aside',
    '[class*="overlay"]',
    '.overlay',
    '[ng-if*="show"]',
    '[ng-show]',
    'div[style*="position: fixed"]',
    'div[style*="position: absolute"]'
  ];

  for (const selector of selectors) {
    try {
      const count = await page.locator(selector).count();
      if (count > 0) {
        console.log(`✓ Found ${count} element(s) with selector: ${selector}`);

        // Get the first element's classes
        const element = page.locator(selector).first();
        const className = await element.getAttribute('class').catch(() => null);
        const id = await element.getAttribute('id').catch(() => null);

        if (className) console.log(`  Classes: ${className}`);
        if (id) console.log(`  ID: ${id}`);
      }
    } catch (e) {
      // Selector not found, skip
    }
  }

  // Get all visible form inputs to understand the flyout structure
  console.log('\n--- Visible textbox inputs ---');
  const textboxes = await page.locator('input[type="text"]:visible, input[ng-model]:visible').all();
  console.log(`Found ${textboxes.length} visible text inputs`);

  for (let i = 0; i < Math.min(textboxes.length, 10); i++) {
    const name = await textboxes[i].getAttribute('name').catch(() => null);
    const id = await textboxes[i].getAttribute('id').catch(() => null);
    const placeholder = await textboxes[i].getAttribute('placeholder').catch(() => null);
    const ngModel = await textboxes[i].getAttribute('ng-model').catch(() => null);

    console.log(`\nInput ${i + 1}:`);
    if (name) console.log(`  name: ${name}`);
    if (id) console.log(`  id: ${id}`);
    if (placeholder) console.log(`  placeholder: ${placeholder}`);
    if (ngModel) console.log(`  ng-model: ${ngModel}`);
  }

  // Check for First Name field specifically
  console.log('\n--- Looking for First Name field ---');
  const firstNameField = page.getByRole('textbox', { name: 'First Name*' });
  const isVisible = await firstNameField.isVisible({ timeout: 2000 }).catch(() => false);
  console.log(`First Name field visible: ${isVisible}`);

  if (isVisible) {
    // Get the parent elements to understand structure
    console.log('\n--- Getting parent structure of First Name field ---');
    const parentClasses = await page.evaluate(() => {
      const field = document.querySelector('input[name*="first" i], input[id*="first" i], input[placeholder*="first" i]');
      if (field) {
        const parents = [];
        let current = field.parentElement;
        let level = 0;

        while (current && level < 10) {
          const tag = current.tagName.toLowerCase();
          const classes = current.className || '';
          const id = current.id || '';

          parents.push({
            level,
            tag,
            classes: classes.toString(),
            id
          });

          current = current.parentElement;
          level++;
        }

        return parents;
      }
      return [];
    });

    console.log('Parent hierarchy:');
    parentClasses.forEach(p => {
      console.log(`  Level ${p.level} - <${p.tag}> ${p.classes ? `class="${p.classes}"` : ''} ${p.id ? `id="${p.id}"` : ''}`);
    });
  }

  // Check for Save button
  console.log('\n--- Looking for Save button ---');
  const saveButton = page.getByRole('button', { name: 'Save' });
  const saveVisible = await saveButton.isVisible({ timeout: 2000 }).catch(() => false);
  console.log(`Save button visible: ${saveVisible}`);

  // Check for close/cancel buttons
  console.log('\n--- Looking for close/cancel buttons ---');
  const closeSelectors = [
    'button:has-text("Cancel")',
    'button:has-text("Close")',
    '[aria-label="Close"]',
    '.close',
    '[ng-click*="close"]',
    '[ng-click*="cancel"]',
    'button[class*="close"]',
    'button[class*="cancel"]'
  ];

  for (const selector of closeSelectors) {
    try {
      const count = await page.locator(selector).count();
      if (count > 0) {
        const isVis = await page.locator(selector).first().isVisible();
        console.log(`✓ Found ${count} element(s) with selector: ${selector} (visible: ${isVis})`);
      }
    } catch (e) {
      // Skip
    }
  }

  // Log all elements with ng-click that are visible
  console.log('\n--- Elements with ng-click (buttons/links) ---');
  const ngClickElements = await page.locator('[ng-click]:visible').all();
  console.log(`Found ${ngClickElements.length} visible elements with ng-click`);

  for (let i = 0; i < Math.min(ngClickElements.length, 15); i++) {
    const text = await ngClickElements[i].innerText().catch(() => '');
    const ngClick = await ngClickElements[i].getAttribute('ng-click').catch(() => null);
    const tag = await ngClickElements[i].evaluate(el => el.tagName.toLowerCase());

    if (text || ngClick) {
      console.log(`\n${i + 1}. <${tag}>`);
      if (text) console.log(`   Text: "${text.trim()}"`);
      if (ngClick) console.log(`   ng-click: ${ngClick}`);
    }
  }

  console.log('\n========================================');
  console.log('DEBUG TEST COMPLETE');
  console.log('Check the screenshots and console output above');
  console.log('========================================\n');

  // Keep browser open for manual inspection
  await page.pause();
});
