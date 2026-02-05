import { BasePage } from '../BasePage.js';

export class BulkChangeDepartment extends BasePage {
  constructor(page, expect = null) {
    super(page, expect);

    // Bulk Actions button and menu
    this.bulkActionsButton = page.getByText('Actions');
    this.changePositionOption = page.getByText('Bulk Change Position');

    // Date picker
    this.dateField = page.getByRole('textbox', { name: 'Select a date' });
    this.datePicker = page.locator('#ui-datepicker-div');

    // Field selector dropdown
    this.fieldSelectorDropdown = page.getByRole('button', { name: 'Select one... ' });
    this.departmentOption = page.getByRole('menu').getByText('Department');

    // Department selection
    this.chooseDepartmentButton = page.getByRole('button', { name: 'Choose...' });
    // Department grid - column 3 contains department names (same pattern as manager grid)
    this.departmentGrid = page.locator('.content-scroll > .content-grid > .ng-isolate-scope > .k-grid > .k-grid-content > .k-selectable > tbody > tr > td:nth-child(3)');

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
   * Click Bulk Change Position option
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
   * Select Department field
   */
  async selectDepartmentField() {
    await this.fieldSelectorDropdown.click();
    await this.page.waitForTimeout(300);
    await this.departmentOption.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Select random department from grid and return the department name
   * @returns {string} Selected department name
   */
  async selectRandomDepartment() {
    await this.chooseDepartmentButton.click();
    await this.page.waitForTimeout(2000);

    // Wait for department grid to load
    await this.departmentGrid.first().waitFor({ state: 'visible', timeout: 5000 });

    // Get all department cells from column 3
    const departmentCells = await this.departmentGrid.all();

    if (departmentCells.length === 0) {
      throw new Error('No departments found in grid');
    }

    // Select random department
    const randomIndex = Math.floor(Math.random() * departmentCells.length);
    const selectedDepartmentCell = departmentCells[randomIndex];

    // Get department name before clicking
    const departmentName = await selectedDepartmentCell.textContent();

    // Click the selected department
    await selectedDepartmentCell.click();
    await this.page.waitForTimeout(500);

    console.log(`Selected random department: ${departmentName.trim()}`);
    return departmentName.trim();
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
   * Get department value for employee by row index
   * @param {number} rowIndex - Row index (0-based)
   * @param {string} expectedDepartment - Expected department name to look for
   * @returns {string} Department name
   */
  async getDepartmentForEmployeeByIndex(rowIndex, expectedDepartment) {
    // Click on department cell to view
    const departmentCell = this.page.getByRole('gridcell', { name: expectedDepartment }).nth(rowIndex);
    await departmentCell.click();
    await this.page.waitForTimeout(500);

    const departmentText = await departmentCell.textContent();
    return departmentText.trim();
  }

  /**
   * Verify department for multiple employees by their indices
   * @param {Array<number>} employeeIndices - Array of employee indices to verify
   * @param {string} expectedDepartment - Expected department name
   */
  async verifyDepartmentForEmployees(employeeIndices, expectedDepartment) {
    for (const index of employeeIndices) {
      const actualDepartment = await this.getDepartmentForEmployeeByIndex(index, expectedDepartment);

      if (this.expect) {
        this.expect(actualDepartment).toContain(expectedDepartment);
      }

      console.log(`✓ Employee ${index + 1} department verified: ${actualDepartment}`);
    }
  }

  // ===========================================
  // COMPLETE WORKFLOW METHODS
  // ===========================================

  /**
   * Bulk change department for selected employees
   * @param {Array<string>} employeeIdentifiers - Array of employee row identifiers
   * @param {string} effectiveDate - Date in MM/DD/YYYY format (optional, for PeopleFull)
   * @returns {string} Selected department name
   */
  async bulkChangeDepartment(employeeIdentifiers, effectiveDate = null) {
    // Select employees
    await this.selectEmployees(employeeIdentifiers);

    // Open bulk actions and select change position
    await this.openBulkActionsMenu();
    await this.clickChangePosition();

    // Set effective date (only if provided - for PeopleFull)
    if (effectiveDate) {
      await this.selectDateByTyping(effectiveDate);
    }

    // Select Department field
    await this.selectDepartmentField();

    // Select random department from grid and get the name
    const selectedDepartment = await this.selectRandomDepartment();

    // Click Update
    await this.clickUpdate();

    // Confirm update
    await this.confirmBulkUpdate(employeeIdentifiers.length);

    console.log(`✓ Bulk department change completed for ${employeeIdentifiers.length} employees`);

    return selectedDepartment;
  }

  /**
   * Bulk change department for first N employees (generic version)
   * @param {number} employeeCount - Number of employees to select
   * @param {string} effectiveDate - Date in MM/DD/YYYY format (optional, for PeopleFull)
   * @returns {object} Object with selectedDepartment and selectedIndices
   */
  async bulkChangeDepartmentGeneric(employeeCount, effectiveDate = null) {
    // Select first N employees and get their indices
    const selectedIndices = await this.selectFirstNEmployees(employeeCount);

    // Open bulk actions and select change position
    await this.openBulkActionsMenu();
    await this.clickChangePosition();

    // Set effective date (only if provided - for PeopleFull)
    if (effectiveDate) {
      await this.selectDateByTyping(effectiveDate);
    }

    // Select Department field
    await this.selectDepartmentField();

    // Select random department from grid and get the name
    const selectedDepartment = await this.selectRandomDepartment();

    // Click Update
    await this.clickUpdate();

    // Confirm update
    await this.confirmBulkUpdate(employeeCount);

    console.log(`✓ Bulk department change completed for ${employeeCount} employees`);

    return {
      selectedDepartment,
      selectedIndices
    };
  }
}
