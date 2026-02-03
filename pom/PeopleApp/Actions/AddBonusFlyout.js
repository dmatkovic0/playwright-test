import { BasePage } from '../BasePage.js';

export class AddBonusFlyout extends BasePage {
  constructor(page, expect = null) {
    super(page, expect);

    // Add Bonus dialog locators
    this.bonusAmountInput = page.getByRole('textbox', { name: '00.00' });
    this.effectiveDateInput = page.getByRole('textbox', { name: 'Effective Date*' });
    this.saveButton = page.getByRole('button', { name: 'Save' });
  }

  // ===========================================
  // BONUS AMOUNT METHOD
  // ===========================================

  /**
   * Enter bonus amount
   * @param {string} amount - Bonus amount to enter
   */
  async enterBonusAmount(amount) {
    await this.bonusAmountInput.click();
    await this.page.waitForTimeout(500);
    await this.bonusAmountInput.fill(amount);
    await this.page.waitForTimeout(500);
  }

  // ===========================================
  // DATE SELECTION METHOD
  // ===========================================

  /**
   * Set effective date by clicking on calendar day
   * @param {string} day - Day number to click
   */
  async setEffectiveDateByCalendar(day) {
    await this.effectiveDateInput.click();
    await this.page.waitForTimeout(500);
    await this.page.locator('#ui-datepicker-div').getByRole('link', { name: day, exact: true }).click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Set effective date by typing
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
  // SAVE METHOD
  // ===========================================

  /**
   * Save the bonus
   */
  async saveBonusChange() {
    await this.saveButton.click();
    // Wait for the dialog to close
    await this.page.waitForTimeout(2000);
    // Wait for any overlays/dialogs to be removed
    await this.page.locator('.ngv-slide-overlay').first().waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});
    // Add additional wait time for the flyout to fully close and data to refresh
    await this.page.waitForTimeout(2000);
  }
}
