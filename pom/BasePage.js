export class BasePage {
  constructor(page, expect = null) {
    this.page = page;
    this.expect = expect;

    // Shared dropdown locators
    this.dropdownMenu = page.locator('ul.dropdown-menu[role="menu"]:visible');
    this.dropdownItems = page.locator('ul.dropdown-menu[role="menu"]:visible li[ng-repeat="item in data"]');

    // Application-wide post-login prompt locators
    this.acceptButton = page.locator("//button[normalize-space()='Accept']");
    this.skipNavigationButton = page.locator("//button[normalize-space()='Skip Navigation']");
  }

  // ===========================================
  // SHARED HELPER METHODS
  // ===========================================

  /**
   * Get today's date in MM/DD/YYYY format
   * @returns {string} Today's date
   */
  getTodayDate() {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const year = today.getFullYear();
    return `${month}/${day}/${year}`;
  }

  /**
   * Dismiss any open overlays or flyouts
   */
  async dismissOverlays() {
    await this.page.keyboard.press('Escape').catch(() => {});
    await this.page.waitForTimeout(300);

    await this.page.locator('.flyout-large').first().waitFor({ state: 'hidden', timeout: 1000 }).catch(() => {});
    await this.page.locator('.ngv-slide-overlay').first().waitFor({ state: 'hidden', timeout: 1000 }).catch(() => {});
    await this.page.locator('.ngv-flyout').first().waitFor({ state: 'hidden', timeout: 1000 }).catch(() => {});

    await this.page.waitForTimeout(500);
  }

  /**
   * Select an item from a dropdown by index
   * @param {Locator} dropdown - The dropdown button to click
   * @param {number} itemIndex - Index of item to select (default: 0)
   */
  async selectFromDropdown(dropdown, itemIndex = 0) {
    await dropdown.click();
    await this.page.waitForTimeout(500);

    const items = await this.dropdownItems.all();

    if (items.length > itemIndex) {
      await items[itemIndex].click();
    } else if (items.length > 0) {
      await items[0].click();
    }

    await this.page.waitForTimeout(500);
  }

  /**
   * Randomly select an item from a dropdown and return selected text
   * @param {Locator} dropdownButton - The button to click to open dropdown
   * @returns {string} The text of the selected item
   */
  async selectRandomFromDropdown(dropdownButton) {
    await dropdownButton.click();
    await this.page.waitForTimeout(500);

    const items = await this.dropdownItems.all();

    if (items.length === 0) {
      throw new Error('No items found in dropdown');
    }

    // Select random item
    const randomIndex = Math.floor(Math.random() * items.length);
    const selectedItem = items[randomIndex];
    const selectedText = await selectedItem.textContent();

    await selectedItem.click();
    await this.page.waitForTimeout(500);

    return selectedText.trim();
  }

  /**
   * Read the first N employee name links from the People grid before selection.
   * Skips row 0 (select-all checkbox) and row 1 (HR Admin) — same logic as selectFirstNEmployees.
   * @param {number} count - Number of employee names to capture
   * @returns {string[]} Array of full employee name strings
   */
  async captureEmployeeNames(count) {
    await this.page.waitForTimeout(1000);

    const allRows = await this.page.getByRole('row').all();

    // Keep only rows that contain a checkbox label (data rows)
    const dataRows = [];
    for (const row of allRows) {
      const labels = await row.locator('label').count();
      if (labels > 0) {
        dataRows.push(row);
      }
    }

    const names = [];
    const startIndex = 2; // skip row 0 (select all) and row 1 (HR Admin)

    for (let i = startIndex; i < Math.min(startIndex + count, dataRows.length); i++) {
      // First name and last name are separate <a class="aut-button-xEmployeeDetail"> links.
      // Collect all of them and join to form the full name (e.g. "HR" + "Admin" → "HR Admin").
      const nameLinks = await dataRows[i].locator('.aut-button-xEmployeeDetail').all();
      const nameParts = [];
      for (const link of nameLinks) {
        const text = (await link.textContent() ?? '').trim();
        if (text.length > 0) nameParts.push(text);
      }
      names.push(nameParts.join(' '));
    }

    console.log(`Captured employee names: ${names.join(', ')}`);
    return names;
  }

  /**
   * Select first N employees by clicking their checkboxes
   * @param {number} count - Number of employees to select
   * @returns {Array<number>} Array of row indices that were selected (0-based)
   */
  async selectFirstNEmployees(count) {
    // Wait for grid to load
    await this.page.waitForTimeout(2000);

    // Get all rows in the grid (using getByRole like original code)
    const allRows = await this.page.getByRole('row').all();

    // Filter to exclude header rows (rows typically have data cells)
    const dataRows = [];
    for (const row of allRows) {
      const labels = await row.locator('label').count();
      if (labels > 0) {
        dataRows.push(row);
      }
    }

    if (dataRows.length === 0) {
      throw new Error('No employee rows found in grid');
    }

    const selectedIndices = [];
    const selectedEmployeeNames = [];

    // Skip first 2 rows: 0 = "select all" checkbox, 1 = HR Admin
    const startIndex = 2;

    for (let i = startIndex; i < Math.min(startIndex + count, dataRows.length); i++) {
      // Get employee name from the row before clicking
      const rowText = await dataRows[i].textContent();
      selectedEmployeeNames.push(rowText.trim());

      // Find checkbox/label within each row
      const checkbox = dataRows[i].locator('label').first();
      await checkbox.click();
      await this.page.waitForTimeout(300);
      selectedIndices.push(i);
    }

    console.log(`Selected ${selectedIndices.length} employees (indices: ${selectedIndices.join(', ')}), skipped first 2 rows`);

    // Store employee names for later use (e.g., excluding from manager selection)
    this.selectedEmployeeNames = selectedEmployeeNames;

    return selectedIndices;
  }

  /**
   * Accept the application privacy policy prompt (shown on first login / after activation)
   */
  async acceptPrivacyPolicy() {
    await this.acceptButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.acceptButton.click();
    await this.page.waitForTimeout(2000);
    console.log('Privacy policy accepted');
  }

  /**
   * Dismiss the navigation tour/wizard prompt (shown on first login)
   */
  async skipNavigation() {
    await this.skipNavigationButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.skipNavigationButton.click();
    await this.page.waitForTimeout(2000);
    console.log('Navigation tour skipped');
  }
}
