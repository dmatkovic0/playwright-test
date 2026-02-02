export class BasePage {
  constructor(page, expect = null) {
    this.page = page;
    this.expect = expect;

    // Shared dropdown locators
    this.dropdownMenu = page.locator('ul.dropdown-menu[role="menu"]:visible');
    this.dropdownItems = page.locator('ul.dropdown-menu[role="menu"]:visible li[ng-repeat="item in data"]');
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
}
