import { BasePage } from './BasePage.js';

export class ChangeSalaryFlyout extends BasePage {
  constructor(page, expect = null) {
    super(page, expect);

    // Change Salary dialog locators
    this.effectiveDateInput = page.getByRole('textbox', { name: 'Effective Date*' });
    this.salaryInput = page.getByRole('textbox', { name: '00.00' });
    this.saveButton = page.getByRole('button', { name: 'Save' });
  }

  // ===========================================
  // DATE SELECTION METHODS
  // ===========================================

  /**
   * Set effective date for salary change by typing
   * @param {string} date - Full date in MM/DD/YYYY format
   */
  async setEffectiveDateByTyping(date) {
    await this.effectiveDateInput.click();
    await this.page.waitForTimeout(500);
    await this.effectiveDateInput.fill(date);
    await this.effectiveDateInput.press('Enter');
    await this.page.waitForTimeout(500);
  }

  /**
   * Select effective date in the calendar picker
   * @param {string} day - Day number to select (e.g., '29')
   */
  async selectEffectiveDateInCalendar(day) {
    await this.effectiveDateInput.click();
    await this.page.waitForTimeout(500);
    await this.page.getByRole('link', { name: day, exact: true }).click();
    await this.page.waitForTimeout(500);
  }

  // ===========================================
  // SALARY INPUT METHOD
  // ===========================================

  /**
   * Enter salary amount
   * @param {string} salary - Salary amount (e.g., '1000')
   */
  async enterSalary(salary) {
    await this.salaryInput.click();
    await this.salaryInput.fill(salary);
    await this.page.waitForTimeout(500);
  }

  // ===========================================
  // SAVE METHOD
  // ===========================================

  /**
   * Save the salary change
   */
  async saveSalaryChange() {
    await this.saveButton.click();
    // Wait for the dialog to close
    await this.page.waitForTimeout(2000);
    // Wait for any overlays/dialogs to be removed
    await this.page.locator('.ngv-slide-overlay').first().waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});
    // Add additional wait time for the flyout to fully close and data to refresh
    await this.page.waitForTimeout(2000);
  }
}
