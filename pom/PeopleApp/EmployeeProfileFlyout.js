import { BasePage } from './BasePage.js';

export class EmployeeProfileFlyout extends BasePage {
  constructor(page, expect = null) {
    super(page, expect);

    // Profile tabs
    this.personalTab = page.getByRole('tab', { name: 'Personal' });

    // Personal section edit locators
    this.personalSectionEditButton = page.locator('#details-xEmployee-xPersonalSection').getByRole('link', { name: ' Edit' });
    this.firstNameEditInput = page.getByRole('textbox', { name: 'First Name*' });
    this.lastNameEditInput = page.getByRole('textbox', { name: 'Last Name*' });
    this.saveEditButton = page.getByRole('button', { name: 'Save' });

    // Display fields for verification
    this.departmentDisplayField = page.locator('#details-xEmployee-xDepartmentLookup');
    this.positionDisplayField = page.locator('#details-xEmployee-xPositionLookup');
    this.divisionDisplayField = page.locator('#details-xEmployee-xDivisionLookup');
    this.locationDisplayField = page.locator('#details-xEmployee-xLocationLookup');
    this.startDateDisplayField = page.locator('#details-xEmployee-xStartDate');
    this.salaryDisplayField = page.locator('//span[@id=\'details-xEmployee-xSalary\']');
    this.employmentStatusDisplayField = page.locator('employee-information-picture');
    this.bonusDisplayField = page.locator('#details-xEmployee-xBonus');
  }

  // ===========================================
  // NAVIGATION METHODS
  // ===========================================

  /**
   * Navigate to Personal tab
   */
  async goToPersonalTab() {
    await this.personalTab.click();
    await this.page.waitForTimeout(1500);
  }

  // ===========================================
  // PERSONAL SECTION EDIT METHODS
  // ===========================================

  /**
   * Click Edit button in Personal section
   */
  async clickEditInPersonalSection() {
    await this.personalSectionEditButton.click();
    await this.page.waitForTimeout(1500);
  }

  /**
   * Update first name in edit mode
   * @param {string} firstName - New first name value
   */
  async updateFirstName(firstName) {
    await this.firstNameEditInput.click();
    await this.firstNameEditInput.fill(firstName);
    await this.page.waitForTimeout(500);
  }

  /**
   * Update last name in edit mode
   * @param {string} lastName - New last name value
   */
  async updateLastName(lastName) {
    await this.lastNameEditInput.click();
    await this.lastNameEditInput.fill(lastName);
    await this.page.waitForTimeout(500);
  }

  /**
   * Click Save button to save profile changes
   */
  async saveProfileChanges() {
    await this.saveEditButton.click();
    await this.page.waitForTimeout(3000);
  }

  /**
   * Verify employee name heading on profile page
   * @param {string} name - Expected name in heading
   */
  async verifyProfileHeading(name) {
    if (!this.expect) {
      throw new Error('expect object is required for assertions. Pass it in constructor.');
    }
    await this.expect(this.page.getByRole('heading', { name: name })).toBeVisible({ timeout: 10000 });
  }

  /**
   * Complete workflow to edit employee personal information
   * @param {string} firstName - New first name
   * @param {string} lastName - New last name
   */
  async editPersonalInfo(firstName, lastName) {
    await this.goToPersonalTab();
    await this.clickEditInPersonalSection();
    await this.updateFirstName(firstName);
    await this.updateLastName(lastName);
    await this.saveProfileChanges();
  }

  // ===========================================
  // DISPLAY FIELD VALUE METHODS
  // ===========================================

  /**
   * Get department value from profile display field
   * @returns {string} The department text
   */
  async getDepartmentValue() {
    await this.departmentDisplayField.waitFor({ state: 'visible', timeout: 5000 });
    await this.page.waitForTimeout(500);
    const text = await this.departmentDisplayField.textContent();
    return text.trim();
  }

  /**
   * Get position value from profile display field
   * @returns {string} The position text
   */
  async getPositionValue() {
    await this.positionDisplayField.waitFor({ state: 'visible', timeout: 5000 });
    await this.page.waitForTimeout(500);
    const text = await this.positionDisplayField.textContent();
    return text.trim();
  }

  /**
   * Get division value from profile display field
   * @returns {string} The division text
   */
  async getDivisionValue() {
    await this.divisionDisplayField.waitFor({ state: 'visible', timeout: 5000 });
    await this.page.waitForTimeout(500);
    const text = await this.divisionDisplayField.textContent();
    return text.trim();
  }

  /**
   * Get location value from profile display field
   * @returns {string} The location text
   */
  async getLocationValue() {
    await this.locationDisplayField.waitFor({ state: 'visible', timeout: 5000 });
    await this.page.waitForTimeout(500);
    const text = await this.locationDisplayField.textContent();
    return text.trim();
  }

  /**
   * Get start date value from profile display field
   * @returns {string} The start date text
   */
  async getStartDateValue() {
    await this.startDateDisplayField.waitFor({ state: 'visible', timeout: 5000 });
    await this.page.waitForTimeout(500);
    const text = await this.startDateDisplayField.textContent();
    console.log(`Start Date verified: ${text}`);
    return text.trim();
  }

  /**
   * Get salary value from profile display field
   * @returns {string} The salary text
   */
  async getSalaryValue() {
    await this.salaryDisplayField.waitFor({ state: 'visible', timeout: 5000 });
    await this.page.waitForTimeout(500);
    const text = await this.salaryDisplayField.textContent();
    console.log(`Salary verified: ${text}`);
    return text.trim();
  }

  /**
   * Get employment status value from profile display field
   * @returns {string} The employment status text
   */
  async getEmploymentStatusValue() {
    await this.employmentStatusDisplayField.waitFor({ state: 'visible', timeout: 5000 });
    await this.page.waitForTimeout(500);
    const text = await this.employmentStatusDisplayField.textContent();
    console.log(`Employment Status verified: ${text}`);
    return text.trim();
  }

  /**
   * Get bonus value from profile display field
   * @returns {string} The bonus text
   */
  async getBonusValue() {
    await this.bonusDisplayField.waitFor({ state: 'visible', timeout: 5000 });
    await this.page.waitForTimeout(500);
    const text = await this.bonusDisplayField.textContent();
    console.log(`Bonus verified: ${text}`);
    return text.trim();
  }

  /**
   * Parse bonus value and return as number (removes formatting and USD)
   * @returns {number} The bonus amount as a number
   */
  async getBonusValueAsNumber() {
    const bonusText = await this.getBonusValue();
    // Remove commas, USD, and convert to number (e.g., "1,000.00 USD" -> 1000.00)
    const numericValue = parseFloat(bonusText.replace(/,/g, '').replace(' USD', ''));
    return numericValue;
  }

  // ===========================================
  // DISPLAY FIELD GETTERS FOR ASSERTIONS
  // ===========================================

  /**
   * Get department field element for assertions
   * @returns {Locator} Department display field
   */
  getDepartmentField() {
    return this.departmentDisplayField;
  }

  /**
   * Get position field element for assertions
   * @returns {Locator} Position display field
   */
  getPositionField() {
    return this.positionDisplayField;
  }

  /**
   * Get division field element for assertions
   * @returns {Locator} Division display field
   */
  getDivisionField() {
    return this.divisionDisplayField;
  }

  /**
   * Get location field element for assertions
   * @returns {Locator} Location display field
   */
  getLocationField() {
    return this.locationDisplayField;
  }

  /**
   * Get start date field element for assertions
   * @returns {Locator} Start date display field
   */
  getStartDateField() {
    return this.startDateDisplayField;
  }

  /**
   * Get salary field element for assertions
   * @returns {Locator} Salary display field
   */
  getSalaryField() {
    return this.salaryDisplayField;
  }

  /**
   * Get employment status field element for assertions
   * @returns {Locator} Employment status display field
   */
  getEmploymentStatusField() {
    return this.employmentStatusDisplayField;
  }
}
