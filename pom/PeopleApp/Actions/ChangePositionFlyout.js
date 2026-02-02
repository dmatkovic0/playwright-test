import { BasePage } from '../BasePage.js';

export class ChangePositionFlyout extends BasePage {
  constructor(page, expect = null) {
    super(page, expect);

    // Change Position dialog locators
    this.effectiveDateInput = page.getByRole('textbox', { name: 'Effective Date*' });
    this.saveButton = page.getByRole('button', { name: 'Save' });
  }

  // ===========================================
  // DATE SELECTION METHOD
  // ===========================================

  /**
   * Set effective date for position change by typing
   * @param {string} date - Full date in MM/DD/YYYY format
   */
  async setEffectiveDateByTyping(date) {
    await this.effectiveDateInput.click();
    await this.page.waitForTimeout(500);
    await this.effectiveDateInput.fill(date);
    await this.effectiveDateInput.press('Enter');
    await this.page.waitForTimeout(500);
  }

  // ===========================================
  // DROPDOWN SELECTION METHODS
  // ===========================================

  /**
   * Select random department in Change Position dialog
   * @returns {string} The selected department text
   */
  async selectRandomDepartment() {
    // Find department dropdown by label text
    const departmentButton = this.page.locator('//label[contains(text(), "Department")]/..//button').first();
    return await this.selectRandomFromDropdown(departmentButton);
  }

  /**
   * Select random division in Change Position dialog
   * @returns {string} The selected division text
   */
  async selectRandomDivision() {
    // Find division dropdown by label text
    const divisionButton = this.page.locator('//label[contains(text(), "Division")]/..//button').first();
    return await this.selectRandomFromDropdown(divisionButton);
  }

  /**
   * Select random location in Change Position dialog
   * @returns {string} The selected location text
   */
  async selectRandomLocation() {
    // Find location dropdown by label text
    const locationButton = this.page.locator('//label[contains(text(), "Location")]/..//button').first();
    return await this.selectRandomFromDropdown(locationButton);
  }

  /**
   * Select random position in Change Position dialog
   * @returns {string} The selected position text
   */
  async selectRandomPosition() {
    // Find position dropdown by label text
    const positionButton = this.page.locator('//label[contains(text(), "Position")]/..//button').first();
    return await this.selectRandomFromDropdown(positionButton);
  }

  // ===========================================
  // SAVE METHOD
  // ===========================================

  /**
   * Save the position change
   */
  async savePositionChange() {
    await this.saveButton.click();
    // Wait for the dialog to close
    await this.page.waitForTimeout(2000);
    // Wait for any overlays/dialogs to be removed
    await this.page.locator('.ngv-slide-overlay').first().waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});
    // Add additional wait time for the flyout to fully close and data to refresh
    await this.page.waitForTimeout(2000);
  }
}
