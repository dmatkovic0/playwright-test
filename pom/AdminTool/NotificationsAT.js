import { BasePage } from '../BasePage.js';

export class NotificationsAT extends BasePage {
  constructor(page, expect = null) {
    super(page, expect);

    // Locators
    this.recipientEmailOrPhoneField = page.locator("//span[@data-field='Recipient']//input[@role='textbox']");

    // Grid locators
    this.gridRows = page.locator("//div[@class='k-grid-content k-auto-scrollable']//tbody//tr[@role='row']");
  }

  // ===========================================
  // SEARCH/FILTER METHODS
  // ===========================================

  /**
   * Search by recipient email or phone number
   * @param {string} emailOrPhone - Email or phone number to search for
   */
  async searchByRecipient(emailOrPhone) {
    await this.recipientEmailOrPhoneField.click();
    await this.recipientEmailOrPhoneField.fill(emailOrPhone);
    await this.recipientEmailOrPhoneField.press('Enter');
    await this.page.waitForTimeout(2000);
    console.log(`✓ Searched for recipient: ${emailOrPhone}`);
  }

  /**
   * Clear recipient search filter
   */
  async clearRecipientFilter() {
    await this.recipientEmailOrPhoneField.click();
    await this.recipientEmailOrPhoneField.clear();
    await this.recipientEmailOrPhoneField.press('Enter');
    await this.page.waitForTimeout(1500);
  }

  // ===========================================
  // GRID DATA METHODS
  // ===========================================

  /**
   * Check if any rows exist in the grid after filtering
   * @returns {boolean} True if rows exist
   */
  async hasRows() {
    const count = await this.gridRows.count();
    return count > 0;
  }

  /**
   * Get all rows in the grid
   * @returns {Array} Array of row locators
   */
  async getRows() {
    return await this.gridRows.all();
  }

  /**
   * Find row containing the recipient (uses contains match for phone numbers with +1)
   * @param {string} recipientText - Recipient email or phone to find
   * @returns {Locator|null} Row locator or null if not found
   */
  async findRowByRecipient(recipientText) {
    const rows = await this.getRows();

    for (const row of rows) {
      // Get the second column (index 1) which contains recipient
      const recipientCell = row.locator('td[role="gridcell"]').nth(1);
      const cellText = await recipientCell.textContent();

      if (cellText && cellText.includes(recipientText)) {
        return row;
      }
    }

    return null;
  }

  /**
   * Check if a row contains an activation link
   * @param {Locator} row - Row locator
   * @returns {boolean} True if row has activation link
   */
  async rowHasActivationLink(row) {
    // Get the third column (index 2) which contains the Long Link
    const longLinkCell = row.locator('td[role="gridcell"]').nth(2);
    const linkElement = longLinkCell.locator('a[href*="/Activation/"]');

    const count = await linkElement.count();
    return count > 0;
  }

  /**
   * Get activation link from a row
   * @param {Locator} row - Row locator
   * @returns {string|null} Activation link URL or null if not found
   */
  async getActivationLinkFromRow(row) {
    // Get the third column (index 2) which contains the Long Link
    const longLinkCell = row.locator('td[role="gridcell"]').nth(2);
    const linkElement = longLinkCell.locator('a[href*="/Activation/"]');

    const count = await linkElement.count();
    if (count > 0) {
      const href = await linkElement.getAttribute('href');
      return href;
    }

    return null;
  }

  /**
   * Search for recipient and get activation link if exists
   * @param {string} emailOrPhone - Email or phone number to search for
   * @returns {string|null} Activation link URL or null if not found
   */
  async findActivationLink(emailOrPhone) {
    // Search for the recipient
    await this.searchByRecipient(emailOrPhone);

    // Check if any rows exist
    const hasResults = await this.hasRows();
    if (!hasResults) {
      console.log(`✗ No notifications found for: ${emailOrPhone}`);
      return null;
    }

    // Find the row containing the recipient
    const row = await this.findRowByRecipient(emailOrPhone);
    if (!row) {
      console.log(`✗ No row found containing: ${emailOrPhone}`);
      return null;
    }

    // Check if the row has an activation link
    const hasActivationLink = await this.rowHasActivationLink(row);
    if (!hasActivationLink) {
      console.log(`✗ No activation link found for: ${emailOrPhone}`);
      return null;
    }

    // Get the activation link
    const activationLink = await this.getActivationLinkFromRow(row);
    console.log(`✓ Found activation link for ${emailOrPhone}: ${activationLink}`);

    return activationLink;
  }

  // ===========================================
  // HELPER METHODS
  // ===========================================

  /**
   * Get recipient email or phone field element
   * @returns {Locator} Recipient email or phone field
   */
  getRecipientEmailOrPhoneField() {
    return this.recipientEmailOrPhoneField;
  }

  /**
   * Get grid rows element
   * @returns {Locator} Grid rows
   */
  getGridRows() {
    return this.gridRows;
  }
}
