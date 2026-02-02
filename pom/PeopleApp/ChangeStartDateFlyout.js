import { BasePage } from './BasePage.js';

export class ChangeStartDateFlyout extends BasePage {
  constructor(page, expect = null) {
    super(page, expect);

    // Change Start Date dialog locators
    this.startDateInput = page.getByRole('textbox', { name: 'Start Date*' });
    this.saveButton = page.getByRole('button', { name: 'Save' });
  }

  // ===========================================
  // DATE SELECTION METHODS
  // ===========================================

  /**
   * Select a specific date in the calendar picker
   * @param {string} day - Day number to select (e.g., '15')
   */
  async selectDateInCalendar(day) {
    await this.startDateInput.click();
    await this.page.waitForTimeout(500);
    await this.page.getByRole('link', { name: day, exact: true }).click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Set start date by typing the full date
   * @param {string} date - Full date in MM/DD/YYYY format
   */
  async setStartDateByTyping(date) {
    await this.startDateInput.click();
    await this.page.waitForTimeout(500);
    await this.startDateInput.fill(date);
    await this.startDateInput.press('Enter');
    await this.page.waitForTimeout(500);
  }

  // ===========================================
  // SAVE METHOD
  // ===========================================

  /**
   * Save the start date change
   */
  async saveStartDateChange() {
    await this.saveButton.click();
    await this.page.waitForTimeout(2000);
  }
}
