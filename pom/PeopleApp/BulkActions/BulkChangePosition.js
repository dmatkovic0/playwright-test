import { BasePage } from '../../BasePage.js';

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
    this.positionOption = page.getByRole('menu').getByText('Position', { exact: true });

    // Position selection
    this.choosePositionButton = page.getByRole('button', { name: 'Choose...' });
    // Position grid - column 3 contains position names (same pattern as other grids)
    this.positionGrid = page.locator('.content-scroll > .content-grid > .ng-isolate-scope > .k-grid > .k-grid-content > .k-selectable > tbody > tr > td:nth-child(3)');

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

  // ===========================================
  // FIELD SELECTION METHODS
  // ===========================================

  /**
   * Select Position field
   */
  async selectPositionField() {
    await this.fieldSelectorDropdown.click();
    await this.page.waitForTimeout(300);
    await this.positionOption.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Select random position from grid and return the position name
   * @returns {string} Selected position name
   */
  async selectRandomPosition() {
    await this.choosePositionButton.click();
    await this.page.waitForTimeout(2000);

    // Wait for position grid to load
    await this.positionGrid.first().waitFor({ state: 'visible', timeout: 5000 });

    // Get all position cells from column 3
    const positionCells = await this.positionGrid.all();

    if (positionCells.length === 0) {
      throw new Error('No positions found in grid');
    }

    // Select random position
    const randomIndex = Math.floor(Math.random() * positionCells.length);
    const selectedPositionCell = positionCells[randomIndex];

    // Get position name before clicking
    const positionName = await selectedPositionCell.textContent();

    // Click the selected position
    await selectedPositionCell.click();
    await this.page.waitForTimeout(500);

    console.log(`Selected random position: ${positionName.trim()}`);
    return positionName.trim();
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
   * Get position value for employee by row index
   * @param {number} rowIndex - Row index (0-based)
   * @param {string} expectedPosition - Expected position name to look for
   * @returns {string} Position name
   */
  async getPositionForEmployeeByIndex(rowIndex, expectedPosition) {
    // Click on position cell to view
    const positionCell = this.page.getByRole('gridcell', { name: expectedPosition }).nth(rowIndex);
    await positionCell.click();
    await this.page.waitForTimeout(500);

    const positionText = await positionCell.textContent();
    return positionText.trim();
  }

  /**
   * Verify position for multiple employees by their indices
   * @param {Array<number>} employeeIndices - Array of employee indices to verify
   * @param {string} expectedPosition - Expected position name
   */
  async verifyPositionForEmployees(employeeIndices, expectedPosition) {
    for (const index of employeeIndices) {
      const actualPosition = await this.getPositionForEmployeeByIndex(index, expectedPosition);

      if (this.expect) {
        this.expect(actualPosition).toContain(expectedPosition);
      }

      console.log(`✓ Employee ${index + 1} position verified: ${actualPosition}`);
    }
  }

  // ===========================================
  // COMPLETE WORKFLOW METHODS
  // ===========================================

  /**
   * Bulk change position for selected employees
   * @param {Array<string>} employeeIdentifiers - Array of employee row identifiers
   * @param {string} effectiveDate - Date in MM/DD/YYYY format (optional, for PeopleFull)
   * @returns {string} Selected position name
   */
  async bulkChangePosition(employeeIdentifiers, effectiveDate = null) {
    // Select employees
    await this.selectEmployees(employeeIdentifiers);

    // Open bulk actions and select change position
    await this.openBulkActionsMenu();
    await this.clickChangePosition();

    // Set effective date (only if provided - for PeopleFull)
    if (effectiveDate) {
      await this.selectDateByTyping(effectiveDate);
    }

    // Select Position field
    await this.selectPositionField();

    // Select random position from grid and get the name
    const selectedPosition = await this.selectRandomPosition();

    // Click Update
    await this.clickUpdate();

    // Confirm update
    await this.confirmBulkUpdate(employeeIdentifiers.length);

    console.log(`✓ Bulk position change completed for ${employeeIdentifiers.length} employees`);

    return selectedPosition;
  }

  /**
   * Bulk change position for first N employees (generic version)
   * @param {number} employeeCount - Number of employees to select
   * @param {string} effectiveDate - Date in MM/DD/YYYY format (optional, for PeopleFull)
   * @returns {object} Object with selectedPosition and selectedIndices
   */
  async bulkChangePositionGeneric(employeeCount, effectiveDate = null) {
    // Select first N employees and get their indices
    const selectedIndices = await this.selectFirstNEmployees(employeeCount);

    // Open bulk actions and select change position
    await this.openBulkActionsMenu();
    await this.clickChangePosition();

    // Set effective date (only if provided - for PeopleFull)
    if (effectiveDate) {
      await this.selectDateByTyping(effectiveDate);
    }

    // Select Position field
    await this.selectPositionField();

    // Select random position from grid and get the name
    const selectedPosition = await this.selectRandomPosition();

    // Click Update
    await this.clickUpdate();

    // Confirm update
    await this.confirmBulkUpdate(employeeCount);

    console.log(`✓ Bulk position change completed for ${employeeCount} employees`);

    return {
      selectedPosition,
      selectedIndices
    };
  }
}
