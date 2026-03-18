import { BasePage } from '../BasePage.js';
import { generateShortID } from '../../src/utils.js';

export class AddEmployeeWithDetailsFlyoutPeopleWM extends BasePage {
  constructor(page, expect = null) {
    super(page, expect);

    // Form field locators
    this.firstNameField = page.locator("//input[@id='firstName']");
    this.lastNameField = page.locator("//input[@id='lastName']");
    this.startDateField = page.locator("//input[@id='startDate']");
    this.emailField = page.locator("//input[@id='email']");

    // Dropdown locators
    this.positionDropdown = page.locator("//div[@name='xPositionLookup']//button[@type='button'][normalize-space()='Select one...']");
    this.locationDropdown = page.locator("//div[@name='xLocationLookup']//button[@type='button'][normalize-space()='Select one...']");
    this.departmentDropdown = page.locator("//div[contains(@name,'xDepartmentLookup')]//button[contains(@type,'button')][normalize-space()='Select one...']");

    // Manager lookup locators
    this.managerLookupButton = page.locator("//button[normalize-space()='Choose...']");
    this.managerGrid = page.locator("//ngv-grid");
    this.managerGridFirstRow = page.locator("//body[1]/div[3]/div[5]/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/ngv-grid[1]/div[1]/div[3]/table[1]/tbody[1]/tr[1]/td[3]");

    // Button locators
    this.saveButton = page.locator("//span[normalize-space()='Save']");
    this.cancelButton = page.locator("//span[normalize-space()='Cancel']");
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
   * Fill all required fields
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
   * Select department from dropdown
   * @param {number} itemIndex - Index of department to select
   */
  async selectDepartment(itemIndex = 0) {
    await this.selectFromDropdown(this.departmentDropdown, itemIndex);
  }

  /**
   * Select random values from all dropdowns and return selected values
   * @returns {object} Selected values
   */
  async selectRandomFromAllDropdowns() {
    const position = await this.selectRandomFromDropdown(this.positionDropdown);
    const location = await this.selectRandomFromDropdown(this.locationDropdown);
    const department = await this.selectRandomFromDropdown(this.departmentDropdown);

    return { position, location, department };
  }

  // ===========================================
  // MANAGER LOOKUP METHODS
  // ===========================================

  /**
   * Open manager lookup
   */
  async openManagerLookup() {
    await this.managerLookupButton.click();
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
   * Select random manager from lookup grid and return selected manager name
   * @returns {string} Selected manager name
   */
  async selectRandomManager() {
    await this.openManagerLookup();
    await this.page.waitForTimeout(1000);

    // Get all manager rows from the grid
    const managerRows = await this.page.locator("//ngv-grid//tbody//tr").all();

    if (managerRows.length === 0) {
      throw new Error('No managers found in lookup grid');
    }

    // Select random manager
    const randomIndex = Math.floor(Math.random() * managerRows.length);
    const selectedRow = managerRows[randomIndex];

    // Click on the manager row to select (click on 3rd column)
    const managerNameCell = selectedRow.locator('td').nth(2); // 3rd column (0-indexed)
    await managerNameCell.click({ force: true });
    await this.page.waitForTimeout(1000);

    // Get the manager name from the input field AFTER selection
    const managerName = await this.getManagerValue();

    return managerName.trim();
  }

  /**
   * Get manager value
   * @returns {string} Manager value
   */
  async getManagerValue() {
    return await this.managerLookupButton.textContent();
  }

  // ===========================================
  // SAVE/CANCEL METHODS
  // ===========================================

  /**
   * Save the employee
   */
  async save() {
    await this.saveButton.click();
  }

  /**
   * Cancel the form
   */
  async cancel() {
    await this.cancelButton.click();
  }

  // ===========================================
  // COMPLETE WORKFLOW METHODS
  // ===========================================

  /**
   * Create employee with all details
   * @returns {object} Employee data
   */
  async createEmployeeWithDetails() {
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

    // Select random values from all dropdowns
    const dropdownValues = await this.selectRandomFromAllDropdowns();

    // Select random manager
    const manager = await this.selectRandomManager();

    // Save
    await this.save();

    console.log(`✓ Employee created with details: ${firstName} ${lastName} with start date: ${startDate}`);

    return {
      firstName,
      lastName,
      email,
      startDate,
      uniqueID,
      position: dropdownValues.position,
      location: dropdownValues.location,
      department: dropdownValues.department,
      manager
    };
  }
}
