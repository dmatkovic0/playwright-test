import { BasePage } from './BasePage.js';

export class Actions extends BasePage {
  constructor(page, expect = null) {
    super(page, expect);

    // Actions menu locators
    this.actionsMenuButton = page.getByRole('link', { name: ' Actions ' });
    this.changeStartDateOption = page.getByRole('link', { name: 'Change Start Date' });
    this.changeSalaryOption = page.getByRole('link', { name: 'Change Salary' });
    this.changePositionOption = page.getByRole('link', { name: 'Change Position' });
  }

  // ===========================================
  // ACTIONS MENU METHODS
  // ===========================================

  /**
   * Open the Actions menu on employee profile
   */
  async openActionsMenu() {
    await this.actionsMenuButton.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Click Change Start Date option in Actions menu
   */
  async clickChangeStartDate() {
    await this.changeStartDateOption.click();
    await this.page.waitForTimeout(1500);
  }

  /**
   * Click Change Salary option in Actions menu
   */
  async clickChangeSalary() {
    await this.changeSalaryOption.click();
    await this.page.waitForTimeout(1500);
  }

  /**
   * Click Change Position option in Actions menu
   */
  async clickChangePosition() {
    await this.changePositionOption.click();
    await this.page.waitForTimeout(1500);
  }
}
