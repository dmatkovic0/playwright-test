import { BasePage } from '../BasePage.js';

export class ChangeEmploymentStatusFlyout extends BasePage {
  constructor(page, expect = null) {
    super(page, expect);

    // Change Employment Status dialog locators
    this.effectiveDateInput = page.getByRole('textbox', { name: 'Effective Date*' });
    this.doneButton = page.getByRole('button', { name: 'Done' });
    this.employmentStatusButton = page.getByRole('button', { name: 'Active ' });
    this.saveButton = page.getByRole('button', { name: 'Save' });
  }

  // ===========================================
  // DATE SELECTION METHOD
  // ===========================================

  /**
   * Set effective date for employment status change by typing
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
   * Set effective date by clicking on calendar day
   * @param {string} day - Day number to click
   */
  async setEffectiveDateByCalendar(day) {
    await this.effectiveDateInput.click();
    await this.page.waitForTimeout(500);
    await this.page.locator('#ui-datepicker-div').getByRole('link', { name: day, exact: true }).click();
    await this.doneButton.click();
    await this.page.waitForTimeout(500);
  }

  // ===========================================
  // EMPLOYMENT STATUS SELECTION METHOD
  // ===========================================

  /**
   * Select employment status from dropdown
   * @param {string} status - Employment status: 'Active', 'Leave of Absence', or 'Prehire'
   */
  async selectEmploymentStatus(status) {
    // Click the employment status button to open dropdown
    await this.employmentStatusButton.click();
    await this.page.waitForTimeout(500);

    // For Prehire, use the specific locator
    if (status === 'Prehire') {
      await this.page.locator('#xEmploymentStatusHistory-xEmploymentStatusLookup').getByText('Prehire').click();
      await this.page.waitForTimeout(500);
    } else {
      // For other statuses (Active, Leave of Absence), use getByText
      await this.page.getByText(status, { exact: true }).click();
      await this.page.waitForTimeout(500);
    }
  }

  // ===========================================
  // SAVE METHOD
  // ===========================================

  /**
   * Save the employment status change
   */
  async saveEmploymentStatusChange() {
    await this.saveButton.click();
    // Wait for the dialog to close
    await this.page.waitForTimeout(2000);
    // Wait for any overlays/dialogs to be removed
    await this.page.locator('.ngv-slide-overlay').first().waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});
    // Add additional wait time for the flyout to fully close and data to refresh
    await this.page.waitForTimeout(2000);
  }
}
