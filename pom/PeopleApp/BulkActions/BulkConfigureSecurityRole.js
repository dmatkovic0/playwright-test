import { BasePage } from '../../BasePage.js';

export class BulkConfigureSecurityRole extends BasePage {
  constructor(page, expect = null) {
    super(page, expect);

    // Bulk Actions menu
    this.bulkActionsButton                = page.getByText('Actions');
    this.bulkConfigureSecurityRoleOption  = page.getByText('Bulk configure Security Role');

    // Security role modal
    this.securityRoleDropdown = page.getByRole('button', { name: 'Select one... ' });
    this.securityRoleMenu     = page.getByRole('menu');
    this.saveButton           = page.getByRole('button', { name: 'Save' });
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
   * Click the Bulk Configure Security Role option in the menu
   */
  async clickBulkConfigureSecurityRole() {
    await this.bulkConfigureSecurityRoleOption.click();
    await this.page.waitForTimeout(1000);
  }

  // ===========================================
  // SECURITY ROLE SELECTION METHODS
  // ===========================================

  /**
   * Open the security role dropdown, pick a random option, and return its name.
   * @returns {string} The name of the randomly selected security role
   */
  async selectRandomSecurityRole() {
    await this.securityRoleDropdown.click();
    await this.page.waitForTimeout(500);

    // Wait for menu to appear and collect all options
    await this.securityRoleMenu.waitFor({ state: 'visible', timeout: 5000 });
    const options = await this.securityRoleMenu.locator('li').all();

    if (options.length === 0) {
      throw new Error('No security roles found in dropdown');
    }

    const randomIndex = Math.floor(Math.random() * options.length);
    const option = options[randomIndex];
    const roleName = (await option.textContent()).trim();

    await option.click();
    await this.page.waitForTimeout(500);

    console.log(`Selected random security role: "${roleName}" (option ${randomIndex + 1} of ${options.length})`);
    return roleName;
  }

  /**
   * Click the Save button to confirm the security role assignment
   */
  async save() {
    await this.saveButton.click();
    await this.page.waitForTimeout(2000);
  }

  // ===========================================
  // COMPLETE WORKFLOW METHODS
  // ===========================================

  /**
   * Select employees, pick a random security role, bulk-assign it, and return data for verification.
   * @param {number} employeeCount - Number of employees to select (uses first N, skipping rows 0–1)
   * @returns {{ roleName: string, employeeNames: string[], selectedIndices: number[] }}
   */
  async bulkConfigureSecurityRoleGeneric(employeeCount) {
    // Capture employee names from the grid before selecting (used for verification later)
    const employeeNames = await this.captureEmployeeNames(employeeCount);

    // Select the first N employees via checkboxes (inherited from BasePage)
    const selectedIndices = await this.selectFirstNEmployees(employeeCount);

    // Open bulk actions menu and choose Bulk Configure Security Role
    await this.openBulkActionsMenu();
    await this.clickBulkConfigureSecurityRole();

    // Pick a random security role from the dropdown
    const roleName = await this.selectRandomSecurityRole();

    // Confirm
    await this.save();

    console.log(`✓ Security role "${roleName}" bulk-assigned to: ${employeeNames.join(', ')}`);

    return { roleName, employeeNames, selectedIndices };
  }
}
