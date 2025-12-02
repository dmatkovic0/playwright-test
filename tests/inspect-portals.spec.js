import { test, expect } from '@playwright/test';
import { ensureSidebarExpanded, openPeople } from '../src/utils.js';
import { login1 } from '../src/loginInfo/loginInfo.js';
import { LoginPage } from '../pom/LoginPage.js';

test('Inspect Portals Page', async ({ page }) => {
  test.setTimeout(120000);

  // Login
  const loginPage = new LoginPage(page);
  await loginPage.login(login1.environment, login1.email, login1.password);

  // Open People app
  await ensureSidebarExpanded(page);
  await openPeople(page, expect);

  // Click on Portals link using xpath
  console.log('\n========== CLICKING PORTALS LINK ==========');
  const portalsLink = page.locator('//*[@id="main-menu-dropdown"]/ul[1]/li[3]/a[1]');
  const portalsLinkText = await portalsLink.textContent();
  console.log(`Portals link text: "${portalsLinkText?.trim()}"`);
  await portalsLink.click();
  console.log('✓ Clicked on Portals link');

  // Wait for the page to load
  await page.waitForTimeout(2000);

  // Take screenshot
  console.log('\n========== TAKING SCREENSHOT ==========');
  await page.screenshot({ path: 'portals-page-screenshot.png', fullPage: true });
  console.log('✓ Screenshot saved: portals-page-screenshot.png');

  // Inspect Add button
  console.log('\n========== INSPECTING ADD BUTTON ==========');
  const addButtonLocators = [
    '.aut-button-add',
    'button:has-text("Add")',
    '[aria-label*="Add"]',
    'button[class*="add"]',
  ];

  for (const selector of addButtonLocators) {
    const count = await page.locator(selector).count();
    if (count > 0) {
      console.log(`✓ Add button found: ${selector} (count: ${count})`);
    }
  }

  // Click Add button to open form
  console.log('\n========== OPENING ADD FORM ==========');
  try {
    await page.locator('.aut-button-add').first().click({ timeout: 5000 });
    await page.waitForTimeout(1000);
    console.log('✓ Add form opened');

    // Take screenshot of the form
    await page.screenshot({ path: 'portals-add-form-screenshot.png', fullPage: true });
    console.log('✓ Form screenshot saved: portals-add-form-screenshot.png');

    // Inspect all form fields
    console.log('\n========== INSPECTING FORM FIELDS ==========');

    // Get all text inputs
    const textInputs = await page.locator('input[type="text"], input[type="textbox"], input[role="textbox"]').all();
    console.log(`Found ${textInputs.length} text input fields:`);
    for (let i = 0; i < textInputs.length; i++) {
      const placeholder = await textInputs[i].getAttribute('placeholder');
      const name = await textInputs[i].getAttribute('name');
      const id = await textInputs[i].getAttribute('id');
      const ariaLabel = await textInputs[i].getAttribute('aria-label');
      console.log(`  Field ${i + 1}:`);
      console.log(`    - Placeholder: ${placeholder}`);
      console.log(`    - Name: ${name}`);
      console.log(`    - ID: ${id}`);
      console.log(`    - Aria-label: ${ariaLabel}`);
    }

    // Get all buttons in the form
    console.log('\n========== INSPECTING FORM BUTTONS ==========');
    const buttons = await page.locator('button, [role="button"]').all();
    console.log(`Found ${buttons.length} buttons:`);
    for (let i = 0; i < Math.min(buttons.length, 20); i++) {
      const text = await buttons[i].textContent();
      const className = await buttons[i].getAttribute('class');
      if (text?.trim()) {
        console.log(`  Button ${i + 1}: "${text.trim()}" | class: ${className}`);
      }
    }

    // Get all dropdowns
    console.log('\n========== INSPECTING DROPDOWNS ==========');
    const dropdowns = await page.locator('select, [role="combobox"], button[aria-haspopup]').all();
    console.log(`Found ${dropdowns.length} dropdown fields:`);
    for (let i = 0; i < dropdowns.length; i++) {
      const text = await dropdowns[i].textContent();
      const ariaLabel = await dropdowns[i].getAttribute('aria-label');
      const name = await dropdowns[i].getAttribute('name');
      console.log(`  Dropdown ${i + 1}:`);
      console.log(`    - Text: ${text?.trim()}`);
      console.log(`    - Aria-label: ${ariaLabel}`);
      console.log(`    - Name: ${name}`);
    }

  } catch (error) {
    console.log(`❌ Could not open add form: ${error.message}`);
    console.log('Pausing for manual inspection...');
    await page.pause();
  }

  // Close form and inspect grid
  console.log('\n========== CLOSING FORM AND INSPECTING GRID ==========');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(1000);

  // Look for portal links in grid
  console.log('\n========== INSPECTING GRID LINKS ==========');
  const gridLinkSelectors = [
    '.aut-button-xPortalDetail',
    'a[class*="portal"]',
    'a[class*="Portal"]',
    'a[href*="portal"]',
    'a[href*="Portal"]',
    'table a',
    '.grid a',
  ];

  for (const selector of gridLinkSelectors) {
    const count = await page.locator(selector).count();
    if (count > 0) {
      console.log(`✓ Portal links found: ${selector} (count: ${count})`);
      const firstLink = page.locator(selector).first();
      const text = await firstLink.textContent();
      console.log(`  First link text: "${text?.trim()}"`);
    }
  }

  // Inspect search fields
  console.log('\n========== INSPECTING SEARCH FIELDS ==========');
  const searchInputs = await page.locator('input[placeholder*="Portal"], input[placeholder*="portal"]').all();
  console.log(`Found ${searchInputs.length} portal-related search fields:`);
  for (let i = 0; i < searchInputs.length; i++) {
    const placeholder = await searchInputs[i].getAttribute('placeholder');
    const name = await searchInputs[i].getAttribute('name');
    console.log(`  Search field ${i + 1}:`);
    console.log(`    - Placeholder: ${placeholder}`);
    console.log(`    - Name: ${name}`);
  }

  // Click on first portal to see detail page
  console.log('\n========== NAVIGATING TO DETAIL PAGE ==========');
  try {
    const firstPortalLink = page.locator('.aut-button-xPortalDetail').first();
    const portalName = await firstPortalLink.textContent();
    console.log(`Clicking on portal: "${portalName?.trim()}"`);
    await firstPortalLink.click({ timeout: 5000 });
    await page.waitForTimeout(2000);

    // Take screenshot of detail page
    await page.screenshot({ path: 'portals-detail-page-screenshot.png', fullPage: true });
    console.log('✓ Detail page screenshot saved: portals-detail-page-screenshot.png');

    // Inspect detail page heading
    console.log('\n========== INSPECTING DETAIL PAGE HEADING ==========');
    const headingSelectors = [
      '#details-xPortal-xPortalName',
      '#details-xPortal-xPortalTitle',
      'h1[id*="Portal"]',
      'h2[id*="Portal"]',
      '.detail-heading',
      '[class*="detail"] h1',
      '[class*="detail"] h2',
    ];

    for (const selector of headingSelectors) {
      const count = await page.locator(selector).count();
      if (count > 0) {
        const text = await page.locator(selector).first().textContent();
        console.log(`✓ Detail heading found: ${selector}`);
        console.log(`  Text: "${text?.trim()}"`);
      }
    }

  } catch (error) {
    console.log(`❌ Could not navigate to detail page: ${error.message}`);
  }

  console.log('\n========== INSPECTION COMPLETE ==========');
  console.log('Check the console output above and the screenshots saved in the project root.');
  console.log('Screenshots saved:');
  console.log('  - portals-page-screenshot.png');
  console.log('  - portals-add-form-screenshot.png');
  console.log('  - portals-detail-page-screenshot.png');

  // Keep browser open for manual inspection
  await page.pause();
});
