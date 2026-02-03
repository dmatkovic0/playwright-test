import { BasePage } from './BasePage.js';
import { generateShortID } from '../../src/utils.js';

export class AddEmployeeFlyout extends BasePage {
  constructor(page, expect = null) {
    super(page, expect);

    // Main flyout locators
    this.addButton = page.locator('.aut-button-add');
    this.flyoutContainer = page.locator('.ngv-flyout');
    this.saveButton = this.flyoutContainer.getByRole('button', { name: 'Save' });
    this.cancelButton = this.flyoutContainer.getByRole('button', { name: 'Cancel' });
    this.confirmCancelButton = page.locator('//confirm-dialog//button').first();

    // Form field locators
    this.firstNameField = this.flyoutContainer.getByRole('textbox', { name: 'First Name*' });
    this.lastNameField = this.flyoutContainer.getByRole('textbox', { name: 'Last Name*' });
    this.emailField = this.flyoutContainer.getByRole('textbox', { name: 'Account Email*' });
    this.startDateField = this.flyoutContainer.getByRole('textbox', { name: 'Start Date*' });

    // Dropdown locators
    this.departmentDropdown = this.flyoutContainer.getByRole('button', { name: 'Enter department... ' });
    this.positionDropdown = this.flyoutContainer.getByRole('button', { name: 'Enter position... ' });
    this.locationDropdown = this.flyoutContainer.getByRole('button', { name: 'Enter location... ' });
    this.divisionDropdown = this.flyoutContainer.getByRole('button', { name: 'Enter division... ' });

    // Manager lookup locators
    this.managerLookupField = page.locator("//input[@id='xEmployee-xManagerLookup']");
    this.managerGrid = page.locator("//ngv-grid");
    this.managerGridFirstRow = page.locator("//body[1]/div[3]/div[5]/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/ngv-grid[1]/div[1]/div[3]/table[1]/tbody[1]/tr[1]/td[3]");

    // Checklist option locators
    this.onboardingChecklistOption = page.locator('//label[normalize-space()=\'Onboarding Checklist\']');
    this.prehireChecklistOption = page.locator('//label[normalize-space()=\'Pre-hire Checklist\']');
    this.noAutoAssignmentOption = page.locator('//label[normalize-space()=\'No Auto Assignment\']');
  }

  // ===========================================
  // NAVIGATION METHODS
  // ===========================================

  /**
   * Open the Add Employee flyout
   */
  async open() {
    await this.addButton.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Close the Add Employee flyout
   */
  async close() {
    const isVisible = await this.cancelButton.isVisible({ timeout: 2000 }).catch(() => false);

    if (isVisible) {
      await this.cancelButton.click();
      await this.page.waitForTimeout(500);

      // Handle confirmation dialog
      const confirmVisible = await this.confirmCancelButton.isVisible({ timeout: 2000 }).catch(() => false);
      if (confirmVisible) {
        await this.confirmCancelButton.click({ force: true });
        await this.page.waitForTimeout(1000);
      }

      // Wait for flyout to be completely removed from DOM
      await this.page.locator('.flyout-large').first().waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});
      await this.flyoutContainer.first().waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});
      await this.page.locator('.ngv-slide-overlay').first().waitFor({ state: 'detached', timeout: 3000 }).catch(() => {});
      await this.page.waitForTimeout(500).catch(() => {});
    } else {
      // Fallback to ESC key
      await this.page.keyboard.press('Escape');
      await this.page.waitForTimeout(1000);
    }
  }

  /**
   * Save the employee
   */
  async save() {
    await this.saveButton.click();
  }

  // ===========================================
  // FORM FILLING METHODS
  // ===========================================

  /**
   * Fill first name field
   * @param {string} firstName - First name value
   */
  async fillFirstName(firstName) {
    await this.firstNameField.fill(firstName);
  }

  /**
   * Fill last name field
   * @param {string} lastName - Last name value
   */
  async fillLastName(lastName) {
    await this.lastNameField.fill(lastName);
  }

  /**
   * Fill email field
   * @param {string} email - Email value
   */
  async fillEmail(email) {
    await this.emailField.fill(email);
  }

  /**
   * Fill start date field
   * @param {string} date - Date in MM/DD/YYYY format
   */
  async fillStartDate(date) {
    await this.startDateField.fill(date);
    await this.startDateField.press('Enter');
  }

  /**
   * Fill only required fields (firstName, lastName, email)
   * @param {string} uniqueID - Optional unique ID (will generate if not provided)
   * @returns {object} Employee data
   */
  async fillRequiredFields(uniqueID = null) {
    if (!uniqueID) {
      uniqueID = generateShortID();
    }

    const firstName = `First_${uniqueID}`;
    const lastName = `Last_${uniqueID}`;
    const email = `${uniqueID}@mail.com`;

    await this.fillFirstName(firstName);
    await this.fillLastName(lastName);
    await this.fillEmail(email);

    return { firstName, lastName, email, uniqueID };
  }

  /**
   * Fill all required fields including start date
   * @param {string} uniqueID - Optional unique ID (will generate if not provided)
   * @returns {object} Employee data
   */
  async fillAllRequiredFields(uniqueID = null) {
    if (!uniqueID) {
      uniqueID = generateShortID();
    }

    const firstName = `First_${uniqueID}`;
    const lastName = `Last_${uniqueID}`;
    const email = `${uniqueID}@mail.com`;
    const startDate = this.getTodayDate();

    await this.fillFirstName(firstName);
    await this.fillLastName(lastName);
    await this.fillEmail(email);
    await this.fillStartDate(startDate);

    return { firstName, lastName, email, startDate, uniqueID };
  }

  // ===========================================
  // DROPDOWN METHODS
  // ===========================================

  /**
   * Select department from dropdown
   * @param {number} itemIndex - Index of department to select
   */
  async selectDepartment(itemIndex = 0) {
    await this.selectFromDropdown(this.departmentDropdown, itemIndex);
  }

  /**
   * Select position from dropdown
   * @param {number} itemIndex - Index of position to select
   */
  async selectPosition(itemIndex = 0) {
    await this.selectFromDropdown(this.positionDropdown, itemIndex);
  }

  /**
   * Select location from dropdown
   * @param {number} itemIndex - Index of location to select
   */
  async selectLocation(itemIndex = 0) {
    await this.selectFromDropdown(this.locationDropdown, itemIndex);
  }

  /**
   * Select division from dropdown
   * @param {number} itemIndex - Index of division to select
   */
  async selectDivision(itemIndex = 0) {
    await this.selectFromDropdown(this.divisionDropdown, itemIndex);
  }

  /**
   * Select all dropdowns (department, position, location)
   * @param {number} deptIndex - Department index
   * @param {number} posIndex - Position index
   * @param {number} locIndex - Location index
   */
  async selectAllDropdowns(deptIndex = 0, posIndex = 0, locIndex = 0) {
    await this.selectDepartment(deptIndex);
    await this.selectPosition(posIndex);
    await this.selectLocation(locIndex);
  }

  /**
   * Select random values from all dropdowns and return selected values
   * @returns {object} Selected values
   */
  async selectRandomFromAllDropdowns() {
    const department = await this.selectRandomFromDropdown(this.departmentDropdown);
    const position = await this.selectRandomFromDropdown(this.positionDropdown);
    const location = await this.selectRandomFromDropdown(this.locationDropdown);
    const division = await this.selectRandomFromDropdown(this.divisionDropdown);

    return { department, position, location, division };
  }

  // ===========================================
  // MANAGER LOOKUP METHODS
  // ===========================================

  /**
   * Open manager lookup
   */
  async openManagerLookup() {
    await this.managerLookupField.click();
    await this.page.waitForTimeout(1000);
  }

  /**
   * Select first manager from lookup grid
   */
  async selectFirstManager() {
    await this.openManagerLookup();
    await this.managerGridFirstRow.click();
    await this.page.waitForTimeout(1000);
  }

  /**
   * Get manager value
   * @returns {string} Manager value
   */
  async getManagerValue() {
    return await this.managerLookupField.inputValue();
  }

  // ===========================================
  // CHECKLIST OPTION METHODS
  // ===========================================

  /**
   * Scroll to checklist options
   */
  async scrollToChecklistOptions() {
    await this.flyoutContainer.evaluate(el => el.scrollTo(0, el.scrollHeight));
    await this.page.waitForTimeout(300);
  }

  /**
   * Select Onboarding Checklist option
   */
  async selectOnboardingChecklist() {
    await this.scrollToChecklistOptions();
    await this.onboardingChecklistOption.scrollIntoViewIfNeeded();
    await this.onboardingChecklistOption.click({ force: true });
    await this.page.waitForTimeout(500);
  }

  /**
   * Select Pre-hire Checklist option
   */
  async selectPrehireChecklist() {
    await this.scrollToChecklistOptions();
    await this.prehireChecklistOption.scrollIntoViewIfNeeded();
    await this.prehireChecklistOption.click({ force: true });
    await this.page.waitForTimeout(500);
  }

  /**
   * Select No Auto Assignment option
   */
  async selectNoAutoAssignment() {
    await this.scrollToChecklistOptions();
    await this.noAutoAssignmentOption.scrollIntoViewIfNeeded();
    await this.noAutoAssignmentOption.click({ force: true });
    await this.page.waitForTimeout(500);
  }

  // ===========================================
  // HELPER METHODS
  // ===========================================

  /**
   * Wait for flyout to open
   */
  async waitForFlyoutOpen() {
    await this.flyoutContainer.first().waitFor({ state: 'visible', timeout: 5000 });
  }

  /**
   * Wait for flyout to close
   */
  async waitForFlyoutClosed() {
    await this.flyoutContainer.first().waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});
  }

  /**
   * Get flyout container element
   * @returns {Locator} Flyout container
   */
  getFlyoutContainer() {
    return this.flyoutContainer.first();
  }

  /**
   * Get first name field element
   * @returns {Locator} First name field
   */
  getFirstNameField() {
    return this.firstNameField;
  }

  /**
   * Get last name field element
   * @returns {Locator} Last name field
   */
  getLastNameField() {
    return this.lastNameField;
  }

  /**
   * Get email field element
   * @returns {Locator} Email field
   */
  getEmailField() {
    return this.emailField;
  }

  /**
   * Get start date field element
   * @returns {Locator} Start date field
   */
  getStartDateField() {
    return this.startDateField;
  }

  /**
   * Get department dropdown element
   * @returns {Locator} Department dropdown
   */
  getDepartmentDropdown() {
    return this.departmentDropdown;
  }

  /**
   * Get position dropdown element
   * @returns {Locator} Position dropdown
   */
  getPositionDropdown() {
    return this.positionDropdown;
  }

  /**
   * Get location dropdown element
   * @returns {Locator} Location dropdown
   */
  getLocationDropdown() {
    return this.locationDropdown;
  }

  /**
   * Get manager lookup field element
   * @returns {Locator} Manager lookup field
   */
  getManagerLookupField() {
    return this.managerLookupField;
  }

  /**
   * Get save button element
   * @returns {Locator} Save button
   */
  getSaveButton() {
    return this.saveButton;
  }

  /**
   * Get cancel button element
   * @returns {Locator} Cancel button
   */
  getCancelButton() {
    return this.cancelButton;
  }

  /**
   * Get field value by field name
   * @param {string} fieldName - Field name (firstName, lastName, email, startDate)
   * @returns {string} Field value
   */
  async getFieldValue(fieldName) {
    let field;
    switch(fieldName.toLowerCase()) {
      case 'firstname':
        field = this.firstNameField;
        break;
      case 'lastname':
        field = this.lastNameField;
        break;
      case 'email':
        field = this.emailField;
        break;
      case 'startdate':
        field = this.startDateField;
        break;
      default:
        throw new Error(`Unknown field: ${fieldName}`);
    }

    return await field.inputValue();
  }

  // ===========================================
  // COMPLETE WORKFLOW METHODS
  // ===========================================

  /**
   * Create employee with minimum required fields
   * @returns {object} Employee data
   */
  async createEmployeeWithMinimumFields() {
    const uniqueID = generateShortID();
    const { firstName, lastName, email } = await this.fillRequiredFields(uniqueID);
    await this.selectNoAutoAssignment();
    await this.save();
    return { firstName, lastName, email, uniqueID };
  }

  /**
   * Create employee with all fields
   * @returns {object} Employee data
   */
  async createEmployeeWithAllFields() {
    const uniqueID = generateShortID();
    const { firstName, lastName, email, startDate } = await this.fillAllRequiredFields(uniqueID);
    await this.selectAllDropdowns();
    await this.selectFirstManager();
    await this.save();
    return { firstName, lastName, email, startDate, uniqueID };
  }

  /**
   * Create employee with onboarding checklist
   * @returns {object} Employee data
   */
  async createEmployeeWithOnboardingChecklist() {
    const uniqueID = generateShortID();
    const firstName = `First_${uniqueID}`;
    const lastName = `Last_${uniqueID}`;
    const email = `${uniqueID}@mail.com`;
    const startDate = this.getTodayDate();

    // Fill basic fields
    await this.fillFirstName(firstName);
    await this.fillLastName(lastName);
    await this.fillEmail(email);
    await this.fillStartDate(startDate);

    // Select dropdowns (2nd option for department, position, location)
    await this.selectDepartment(1);
    await this.selectPosition(1);
    await this.selectLocation(1);

    // Select manager
    await this.selectFirstManager();

    // Onboarding is default, so just save
    await this.save();

    console.log(`✓ Employee created: ${firstName} ${lastName} with start date: ${startDate}`);

    return {
      firstName,
      lastName,
      email,
      startDate,
      uniqueID
    };
  }

  /**
   * Create employee with pre-hire checklist
   * @returns {object} Employee data
   */
  async createEmployeeWithPrehireChecklist() {
    const uniqueID = generateShortID();
    const firstName = `First_${uniqueID}`;
    const lastName = `Last_${uniqueID}`;
    const email = `${uniqueID}@mail.com`;

    // Fill basic fields
    await this.fillFirstName(firstName);
    await this.fillLastName(lastName);
    await this.fillEmail(email);

    // Select prehire checklist
    await this.selectPrehireChecklist();

    // Save
    await this.save();

    console.log(`✓ Employee with Prehire Checklist created: ${firstName} ${lastName}`);

    return {
      firstName,
      lastName,
      email,
      uniqueID
    };
  }

  /**
   * Create employee with no auto assignment
   * @returns {object} Employee data
   */
  async createEmployeeWithNoAutoAssignment() {
    const uniqueID = generateShortID();
    const firstName = `First_${uniqueID}`;
    const lastName = `Last_${uniqueID}`;
    const email = `${uniqueID}@mail.com`;

    // Fill basic fields
    await this.fillFirstName(firstName);
    await this.fillLastName(lastName);
    await this.fillEmail(email);

    // Select no auto assignment
    await this.selectNoAutoAssignment();

    // Save
    await this.save();

    console.log(`✓ Employee with No Auto Assignment created: ${firstName} ${lastName}`);

    return {
      firstName,
      lastName,
      email,
      uniqueID
    };
  }
}
