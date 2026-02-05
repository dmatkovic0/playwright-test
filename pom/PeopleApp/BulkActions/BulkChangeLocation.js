import { BasePage } from '../BasePage.js';

export class BulkChangeLocation extends BasePage {
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
    this.locationOption = page.getByRole('menu').getByText('Location');

    // Location selection
    this.chooseLocationButton = page.getByRole('button', { name: 'Choose...' });
    // Location grid - will determine the correct column
    this.locationGrid = page.locator('.content-scroll > .content-grid > .ng-isolate-scope > .k-grid > .k-grid-content > .k-selectable > tbody > tr > td:nth-child(3)');

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
   * Select Location field
   */
  async selectLocationField() {
    await this.fieldSelectorDropdown.click();
    await this.page.waitForTimeout(300);
    await this.locationOption.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Select random location from grid and return the location name
   * @returns {string} Selected location name
   */
  async selectRandomLocation() {
    await this.chooseLocationButton.click();
    await this.page.waitForTimeout(2000);

    // Wait for location grid to load
    await this.locationGrid.first().waitFor({ state: 'visible', timeout: 5000 });

    // Get all location cells from column 3
    const locationCells = await this.locationGrid.all();

    if (locationCells.length === 0) {
      throw new Error('No locations found in grid');
    }

    // Select random location
    const randomIndex = Math.floor(Math.random() * locationCells.length);
    const selectedLocationCell = locationCells[randomIndex];

    // Get location name before clicking
    const locationName = await selectedLocationCell.textContent();

    // Click the selected location
    await selectedLocationCell.click();
    await this.page.waitForTimeout(500);

    console.log(`Selected random location: ${locationName.trim()}`);
    return locationName.trim();
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
   * Get location value for employee by row index
   * @param {number} rowIndex - Row index (0-based)
   * @param {string} expectedLocation - Expected location name to look for
   * @returns {string} Location name
   */
  async getLocationForEmployeeByIndex(rowIndex, expectedLocation) {
    // Click on location cell to view
    const locationCell = this.page.getByRole('gridcell', { name: expectedLocation }).nth(rowIndex);
    await locationCell.click();
    await this.page.waitForTimeout(500);

    const locationText = await locationCell.textContent();
    return locationText.trim();
  }

  /**
   * Verify location for multiple employees by their indices
   * @param {Array<number>} employeeIndices - Array of employee indices to verify
   * @param {string} expectedLocation - Expected location name
   */
  async verifyLocationForEmployees(employeeIndices, expectedLocation) {
    for (const index of employeeIndices) {
      const actualLocation = await this.getLocationForEmployeeByIndex(index, expectedLocation);

      if (this.expect) {
        this.expect(actualLocation).toContain(expectedLocation);
      }

      console.log(`✓ Employee ${index + 1} location verified: ${actualLocation}`);
    }
  }

  // ===========================================
  // COMPLETE WORKFLOW METHODS
  // ===========================================

  /**
   * Bulk change location for selected employees
   * @param {Array<string>} employeeIdentifiers - Array of employee row identifiers
   * @param {string} effectiveDate - Date in MM/DD/YYYY format (optional, for PeopleFull)
   * @returns {string} Selected location name
   */
  async bulkChangeLocation(employeeIdentifiers, effectiveDate = null) {
    // Select employees
    await this.selectEmployees(employeeIdentifiers);

    // Open bulk actions and select change position
    await this.openBulkActionsMenu();
    await this.clickChangePosition();

    // Set effective date (only if provided - for PeopleFull)
    if (effectiveDate) {
      await this.selectDateByTyping(effectiveDate);
    }

    // Select Location field
    await this.selectLocationField();

    // Select random location from grid and get the name
    const selectedLocation = await this.selectRandomLocation();

    // Click Update
    await this.clickUpdate();

    // Confirm update
    await this.confirmBulkUpdate(employeeIdentifiers.length);

    console.log(`✓ Bulk location change completed for ${employeeIdentifiers.length} employees`);

    return selectedLocation;
  }

  /**
   * Bulk change location for first N employees (generic version)
   * @param {number} employeeCount - Number of employees to select
   * @param {string} effectiveDate - Date in MM/DD/YYYY format (optional, for PeopleFull)
   * @returns {object} Object with selectedLocation and selectedIndices
   */
  async bulkChangeLocationGeneric(employeeCount, effectiveDate = null) {
    // Select first N employees and get their indices
    const selectedIndices = await this.selectFirstNEmployees(employeeCount);

    // Open bulk actions and select change position
    await this.openBulkActionsMenu();
    await this.clickChangePosition();

    // Set effective date (only if provided - for PeopleFull)
    if (effectiveDate) {
      await this.selectDateByTyping(effectiveDate);
    }

    // Select Location field
    await this.selectLocationField();

    // Select random location from grid and get the name
    const selectedLocation = await this.selectRandomLocation();

    // Click Update
    await this.clickUpdate();

    // Confirm update
    await this.confirmBulkUpdate(employeeCount);

    console.log(`✓ Bulk location change completed for ${employeeCount} employees`);

    return {
      selectedLocation,
      selectedIndices
    };
  }
}
