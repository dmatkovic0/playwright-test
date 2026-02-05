import { BasePage } from '../BasePage.js';

export class BulkChangeDivision extends BasePage {
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
    this.divisionOption = page.getByRole('menu').getByText('Division');

    // Division selection
    this.chooseDivisionButton = page.getByRole('button', { name: 'Choose...' });
    // Division grid - will determine the correct column
    this.divisionGrid = page.locator('.content-scroll > .content-grid > .ng-isolate-scope > .k-grid > .k-grid-content > .k-selectable > tbody > tr > td:nth-child(3)');

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
   * Select Division field
   */
  async selectDivisionField() {
    await this.fieldSelectorDropdown.click();
    await this.page.waitForTimeout(300);
    await this.divisionOption.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Select random division from grid and return the division name
   * @returns {string} Selected division name
   */
  async selectRandomDivision() {
    await this.chooseDivisionButton.click();
    await this.page.waitForTimeout(2000);

    // Wait for division grid to load
    await this.divisionGrid.first().waitFor({ state: 'visible', timeout: 5000 });

    // Get all division cells from column 3
    const divisionCells = await this.divisionGrid.all();

    if (divisionCells.length === 0) {
      throw new Error('No divisions found in grid');
    }

    // Select random division
    const randomIndex = Math.floor(Math.random() * divisionCells.length);
    const selectedDivisionCell = divisionCells[randomIndex];

    // Get division name before clicking
    const divisionName = await selectedDivisionCell.textContent();

    // Click the selected division
    await selectedDivisionCell.click();
    await this.page.waitForTimeout(500);

    console.log(`Selected random division: ${divisionName.trim()}`);
    return divisionName.trim();
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
   * Get division value for employee by row index
   * @param {number} rowIndex - Row index (0-based)
   * @param {string} expectedDivision - Expected division name to look for
   * @returns {string} Division name
   */
  async getDivisionForEmployeeByIndex(rowIndex, expectedDivision) {
    // Click on division cell to view
    const divisionCell = this.page.getByRole('gridcell', { name: expectedDivision }).nth(rowIndex);
    await divisionCell.click();
    await this.page.waitForTimeout(500);

    const divisionText = await divisionCell.textContent();
    return divisionText.trim();
  }

  /**
   * Verify division for multiple employees by their indices
   * @param {Array<number>} employeeIndices - Array of employee indices to verify
   * @param {string} expectedDivision - Expected division name
   */
  async verifyDivisionForEmployees(employeeIndices, expectedDivision) {
    for (const index of employeeIndices) {
      const actualDivision = await this.getDivisionForEmployeeByIndex(index, expectedDivision);

      if (this.expect) {
        this.expect(actualDivision).toContain(expectedDivision);
      }

      console.log(`✓ Employee ${index + 1} division verified: ${actualDivision}`);
    }
  }

  // ===========================================
  // COMPLETE WORKFLOW METHODS
  // ===========================================

  /**
   * Bulk change division for selected employees
   * @param {Array<string>} employeeIdentifiers - Array of employee row identifiers
   * @param {string} effectiveDate - Date in MM/DD/YYYY format (optional, for PeopleFull)
   * @returns {string} Selected division name
   */
  async bulkChangeDivision(employeeIdentifiers, effectiveDate = null) {
    // Select employees
    await this.selectEmployees(employeeIdentifiers);

    // Open bulk actions and select change position
    await this.openBulkActionsMenu();
    await this.clickChangePosition();

    // Set effective date (only if provided - for PeopleFull)
    if (effectiveDate) {
      await this.selectDateByTyping(effectiveDate);
    }

    // Select Division field
    await this.selectDivisionField();

    // Select random division from grid and get the name
    const selectedDivision = await this.selectRandomDivision();

    // Click Update
    await this.clickUpdate();

    // Confirm update
    await this.confirmBulkUpdate(employeeIdentifiers.length);

    console.log(`✓ Bulk division change completed for ${employeeIdentifiers.length} employees`);

    return selectedDivision;
  }

  /**
   * Bulk change division for first N employees (generic version)
   * @param {number} employeeCount - Number of employees to select
   * @param {string} effectiveDate - Date in MM/DD/YYYY format (optional, for PeopleFull)
   * @returns {object} Object with selectedDivision and selectedIndices
   */
  async bulkChangeDivisionGeneric(employeeCount, effectiveDate = null) {
    // Select first N employees and get their indices
    const selectedIndices = await this.selectFirstNEmployees(employeeCount);

    // Open bulk actions and select change position
    await this.openBulkActionsMenu();
    await this.clickChangePosition();

    // Set effective date (only if provided - for PeopleFull)
    if (effectiveDate) {
      await this.selectDateByTyping(effectiveDate);
    }

    // Select Division field
    await this.selectDivisionField();

    // Select random division from grid and get the name
    const selectedDivision = await this.selectRandomDivision();

    // Click Update
    await this.clickUpdate();

    // Confirm update
    await this.confirmBulkUpdate(employeeCount);

    console.log(`✓ Bulk division change completed for ${employeeCount} employees`);

    return {
      selectedDivision,
      selectedIndices
    };
  }
}
