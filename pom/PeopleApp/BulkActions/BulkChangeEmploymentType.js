import { BasePage } from '../BasePage.js';

export class BulkChangeEmploymentType extends BasePage {
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
    this.employmentTypeOption = page.getByRole('menu').getByText('Employment Type');

    // Employment Type selection
    this.chooseEmploymentTypeButton = page.getByRole('button', { name: 'Choose...' });
    // Employment Type grid - column 3 contains employment type names (same pattern as other grids)
    this.employmentTypeGrid = page.locator('.content-scroll > .content-grid > .ng-isolate-scope > .k-grid > .k-grid-content > .k-selectable > tbody > tr > td:nth-child(3)');

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
   * Select Employment Type field
   */
  async selectEmploymentTypeField() {
    await this.fieldSelectorDropdown.click();
    await this.page.waitForTimeout(300);
    await this.employmentTypeOption.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Select random employment type from grid and return the employment type name
   * @returns {string} Selected employment type name
   */
  async selectRandomEmploymentType() {
    await this.chooseEmploymentTypeButton.click();
    await this.page.waitForTimeout(2000);

    // Wait for employment type grid to load
    await this.employmentTypeGrid.first().waitFor({ state: 'visible', timeout: 5000 });

    // Get all employment type cells from column 3
    const employmentTypeCells = await this.employmentTypeGrid.all();

    if (employmentTypeCells.length === 0) {
      throw new Error('No employment types found in grid');
    }

    // Select random employment type
    const randomIndex = Math.floor(Math.random() * employmentTypeCells.length);
    const selectedEmploymentTypeCell = employmentTypeCells[randomIndex];

    // Get employment type name before clicking
    const employmentTypeName = await selectedEmploymentTypeCell.textContent();

    // Click the selected employment type
    await selectedEmploymentTypeCell.click();
    await this.page.waitForTimeout(500);

    console.log(`Selected random employment type: ${employmentTypeName.trim()}`);
    return employmentTypeName.trim();
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
   * Get employment type value for employee by row index
   * @param {number} rowIndex - Row index (0-based)
   * @param {string} expectedEmploymentType - Expected employment type name to look for
   * @returns {string} Employment type name
   */
  async getEmploymentTypeForEmployeeByIndex(rowIndex, expectedEmploymentType) {
    // Click on employment type cell to view
    const employmentTypeCell = this.page.getByRole('gridcell', { name: expectedEmploymentType }).nth(rowIndex);
    await employmentTypeCell.click();
    await this.page.waitForTimeout(500);

    const employmentTypeText = await employmentTypeCell.textContent();
    return employmentTypeText.trim();
  }

  /**
   * Verify employment type for multiple employees by their indices
   * @param {Array<number>} employeeIndices - Array of employee indices to verify
   * @param {string} expectedEmploymentType - Expected employment type name
   */
  async verifyEmploymentTypeForEmployees(employeeIndices, expectedEmploymentType) {
    for (const index of employeeIndices) {
      const actualEmploymentType = await this.getEmploymentTypeForEmployeeByIndex(index, expectedEmploymentType);

      if (this.expect) {
        this.expect(actualEmploymentType).toContain(expectedEmploymentType);
      }

      console.log(`✓ Employee ${index + 1} employment type verified: ${actualEmploymentType}`);
    }
  }

  // ===========================================
  // COMPLETE WORKFLOW METHODS
  // ===========================================

  /**
   * Bulk change employment type for selected employees
   * @param {Array<string>} employeeIdentifiers - Array of employee row identifiers
   * @param {string} effectiveDate - Date in MM/DD/YYYY format (optional, for PeopleFull)
   * @returns {string} Selected employment type name
   */
  async bulkChangeEmploymentType(employeeIdentifiers, effectiveDate = null) {
    // Select employees
    await this.selectEmployees(employeeIdentifiers);

    // Open bulk actions and select change position
    await this.openBulkActionsMenu();
    await this.clickChangePosition();

    // Set effective date (only if provided - for PeopleFull)
    if (effectiveDate) {
      await this.selectDateByTyping(effectiveDate);
    }

    // Select Employment Type field
    await this.selectEmploymentTypeField();

    // Select random employment type from grid and get the name
    const selectedEmploymentType = await this.selectRandomEmploymentType();

    // Click Update
    await this.clickUpdate();

    // Confirm update
    await this.confirmBulkUpdate(employeeIdentifiers.length);

    console.log(`✓ Bulk employment type change completed for ${employeeIdentifiers.length} employees`);

    return selectedEmploymentType;
  }

  /**
   * Bulk change employment type for first N employees (generic version)
   * @param {number} employeeCount - Number of employees to select
   * @param {string} effectiveDate - Date in MM/DD/YYYY format (optional, for PeopleFull)
   * @returns {object} Object with selectedEmploymentType and selectedIndices
   */
  async bulkChangeEmploymentTypeGeneric(employeeCount, effectiveDate = null) {
    // Select first N employees and get their indices
    const selectedIndices = await this.selectFirstNEmployees(employeeCount);

    // Open bulk actions and select change position
    await this.openBulkActionsMenu();
    await this.clickChangePosition();

    // Set effective date (only if provided - for PeopleFull)
    if (effectiveDate) {
      await this.selectDateByTyping(effectiveDate);
    }

    // Select Employment Type field
    await this.selectEmploymentTypeField();

    // Select random employment type from grid and get the name
    const selectedEmploymentType = await this.selectRandomEmploymentType();

    // Click Update
    await this.clickUpdate();

    // Confirm update
    await this.confirmBulkUpdate(employeeCount);

    console.log(`✓ Bulk employment type change completed for ${employeeCount} employees`);

    return {
      selectedEmploymentType,
      selectedIndices
    };
  }
}
