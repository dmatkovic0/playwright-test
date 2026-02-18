import { BasePage } from '../../BasePage.js';

export class DeleteEmployee extends BasePage {
  constructor(page, expect = null) {
    super(page, expect);

    // Bulk Actions menu
    this.bulkActionsButton    = page.getByText('Actions');
    this.deleteEmployeeOption = page.getByText('Delete employee', { exact: true });

    // Confirmation dialog
    this.confirmDeleteButton  = page.getByRole('button', { name: 'Delete Employee' });
  }

  // ===========================================
  // SELECTION METHODS
  // ===========================================

  /**
   * Select an employee row in the grid by matching their first name.
   * Uses a row filter so it works regardless of row position after search.
   * @param {string} firstName - First name of the employee to select
   */
  async selectEmployeeInGrid(firstName) {
    const employeeRow = this.page.locator('tr').filter({ hasText: firstName });
    await employeeRow.locator('.chk-col .input-helper').click();
    await this.page.waitForTimeout(300);
  }

  // ===========================================
  // BULK ACTIONS MENU METHODS
  // ===========================================

  /**
   * Open the bulk Actions menu
   */
  async openBulkActionsMenu() {
    await this.bulkActionsButton.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Click the Delete employee option in the menu
   */
  async clickDeleteEmployee() {
    await this.deleteEmployeeOption.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Click the Delete Employee confirmation button
   */
  async confirmDelete() {
    await this.confirmDeleteButton.click();
    await this.page.waitForTimeout(1000);
  }

  // ===========================================
  // VERIFICATION METHODS
  // ===========================================

  /**
   * Poll the grid every 2 seconds until the employee link is no longer visible.
   * Throws if the employee is still present after maxWaitMs.
   * @param {string} firstName - First name of the deleted employee
   * @param {number} maxWaitMs - Maximum time to wait in ms (default: 30000)
   */
  async waitForEmployeeToDisappear(firstName, maxWaitMs = 30000) {
    if (!this.expect) {
      throw new Error('expect object is required for assertions. Pass it in constructor.');
    }

    const interval   = 2000;
    const maxAttempts = Math.ceil(maxWaitMs / interval);
    const locator    = this.page.getByRole('link', { name: firstName, exact: true });

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const count = await locator.count();
      if (count === 0) {
        console.log(`✓ Employee "${firstName}" removed from grid (after ~${(attempt - 1) * interval}ms)`);
        return;
      }
      console.log(`Polling attempt ${attempt}/${maxAttempts}: "${firstName}" still visible, waiting 2s...`);
      await this.page.waitForTimeout(interval);
    }

    throw new Error(`Employee "${firstName}" still visible in grid after ${maxWaitMs}ms`);
  }

  // ===========================================
  // COMPLETE WORKFLOW METHODS
  // ===========================================

  /**
   * Select the employee by name, open Actions, delete, and confirm.
   * @param {string} firstName - First name of the employee to delete
   */
  async deleteEmployeeGeneric(firstName) {
    await this.selectEmployeeInGrid(firstName);
    await this.openBulkActionsMenu();
    await this.clickDeleteEmployee();
    await this.confirmDelete();
    console.log(`✓ Delete confirmed for employee: "${firstName}"`);
  }
}
