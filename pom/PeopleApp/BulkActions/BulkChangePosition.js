import { BasePage } from '../BasePage.js';

export class BulkChangePosition extends BasePage {
  constructor(page, expect = null) {
    super(page, expect);

    // Bulk Actions button and menu
    this.bulkActionsButton = page.getByText('Actions');
    this.changePositionOption = page.getByText('Change position for all the');

    // Date picker
    this.dateField = page.getByRole('textbox', { name: 'Select a date' });
    this.datePicker = page.locator('#ui-datepicker-div');

    // Field selector dropdown
    this.fieldSelectorDropdown = page.getByRole('button', { name: 'Select one... ' });
    this.managerOption = page.getByRole('menu').getByText('Manager', { exact: true });

    // Manager selection
    this.chooseManagerButton = page.getByRole('button', { name: 'Choose...' });
    this.managerGrid = page.locator('.content-scroll > .content-grid > .ng-isolate-scope > .k-grid > .k-grid-content > .k-selectable > tbody > tr > td:nth-child(3)');

    // Update buttons
    this.updateButton = page.getByRole('button', { name: 'Update' });
  }

  // ===========================================
  // EMPLOYEE SELECTION METHODS
  // ===========================================

  /**
   * Select employees by clicking their checkboxes
   * @param {Array<string>} employeeIdentifiers - Array of partial row text to identify employees
   */
  async selectEmployees(employeeIdentifiers) {
    for (const identifier of employeeIdentifiers) {
      await this.page.getByRole('row', { name: identifier }).locator('label').click();
      await this.page.waitForTimeout(300);
    }
    console.log(`Selected ${employeeIdentifiers.length} employees`);
  }

  // ===========================================
  // BULK ACTIONS MENU METHODS
  // ===========================================

  /**
   * Open bulk actions menu
   */
  async openBulkActionsMenu() {
    await this.bulkActionsButton.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Click Change Position option
   */
  async clickChangePosition() {
    await this.changePositionOption.click();
    await this.page.waitForTimeout(1000);
  }

  // ===========================================
  // DATE SELECTION METHODS
  // ===========================================

  /**
   * Select date by typing
   * @param {string} date - Date in MM/DD/YYYY format
   */
  async selectDateByTyping(date) {
    await this.dateField.click();
    await this.dateField.fill(date);
    await this.page.keyboard.press('Enter');
    await this.page.waitForTimeout(500);
  }

  /**
   * Select date from date picker by day number
   * @param {string} day - Day number to select
   */
  async selectDateFromPicker(day) {
    await this.dateField.click();
    await this.page.waitForTimeout(500);
    await this.datePicker.getByRole('link', { name: day, exact: true }).click();
    await this.page.waitForTimeout(500);
  }

  // ===========================================
  // FIELD SELECTION METHODS
  // ===========================================

  /**
   * Select Manager field
   */
  async selectManagerField() {
    await this.fieldSelectorDropdown.click();
    await this.page.waitForTimeout(300);
    await this.managerOption.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Select first manager from grid
   */
  async selectFirstManager() {
    await this.chooseManagerButton.click();
    await this.page.waitForTimeout(1000);
    await this.managerGrid.first().click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Select random manager from grid and return the manager name
   * @returns {string} Selected manager name
   */
  async selectRandomManager() {
    await this.chooseManagerButton.click();
    await this.page.waitForTimeout(2000);

    // Wait for manager grid to load
    await this.managerGrid.first().waitFor({ state: 'visible', timeout: 5000 });

    // Get all manager cells
    const managerCells = await this.managerGrid.all();

    if (managerCells.length === 0) {
      throw new Error('No managers found in grid');
    }

    // Select random manager
    const randomIndex = Math.floor(Math.random() * managerCells.length);
    const selectedManagerCell = managerCells[randomIndex];

    // Get manager name before clicking
    const managerName = await selectedManagerCell.textContent();

    // Click the selected manager
    await selectedManagerCell.click();
    await this.page.waitForTimeout(500);

    console.log(`Selected random manager: ${managerName.trim()}`);
    return managerName.trim();
  }

  // ===========================================
  // UPDATE METHODS
  // ===========================================

  /**
   * Click Update button
   */
  async clickUpdate() {
    await this.updateButton.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Confirm bulk update with specific employee count
   * @param {number} count - Number of employees to update
   */
  async confirmBulkUpdate(count) {
    const confirmButton = this.page.getByRole('button', { name: `Update ${count} employee(s)` });
    await confirmButton.click();
    await this.page.waitForTimeout(2000);
  }

  // ===========================================
  // VERIFICATION METHODS
  // ===========================================

  /**
   * Get manager value for employee by row index
   * @param {number} rowIndex - Row index (0-based)
   * @param {string} expectedManager - Expected manager name to look for
   * @returns {string} Manager name
   */
  async getManagerForEmployeeByIndex(rowIndex, expectedManager) {
    // Click on manager cell to view
    const managerCell = this.page.getByRole('gridcell', { name: expectedManager }).nth(rowIndex);
    await managerCell.click();
    await this.page.waitForTimeout(500);

    const managerText = await managerCell.textContent();
    return managerText.trim();
  }

  /**
   * Verify manager for multiple employees by their indices
   * @param {Array<number>} employeeIndices - Array of employee indices to verify
   * @param {string} expectedManager - Expected manager name
   */
  async verifyManagerForEmployees(employeeIndices, expectedManager) {
    for (const index of employeeIndices) {
      const actualManager = await this.getManagerForEmployeeByIndex(index, expectedManager);

      if (this.expect) {
        this.expect(actualManager).toContain(expectedManager);
      }

      console.log(`✓ Employee ${index + 1} manager verified: ${actualManager}`);
    }
  }

  // ===========================================
  // COMPLETE WORKFLOW METHODS
  // ===========================================

  /**
   * Bulk change manager for selected employees
   * @param {Array<string>} employeeIdentifiers - Array of employee row identifiers
   * @param {string} effectiveDate - Date in MM/DD/YYYY format
   * @returns {string} Selected manager name
   */
  async bulkChangeManager(employeeIdentifiers, effectiveDate) {
    // Select employees
    await this.selectEmployees(employeeIdentifiers);

    // Open bulk actions and select change position
    await this.openBulkActionsMenu();
    await this.clickChangePosition();

    // Set effective date
    await this.selectDateByTyping(effectiveDate);

    // Select Manager field
    await this.selectManagerField();

    // Select random manager from grid and get the name
    const selectedManager = await this.selectRandomManager();

    // Click Update
    await this.clickUpdate();

    // Confirm update
    await this.confirmBulkUpdate(employeeIdentifiers.length);

    console.log(`✓ Bulk manager change completed for ${employeeIdentifiers.length} employees`);

    return selectedManager;
  }
}
