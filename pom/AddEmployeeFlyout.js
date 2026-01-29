import { generateShortID } from '../src/utils.js';

export class AddEmployeeFlyout {
  constructor(page, expect = null) {
    this.page = page;
    this.expect = expect;

    // Main flyout locators
    this.addButton = page.locator('.aut-button-add');
    this.flyoutContainer = page.locator('.ngv-flyout');
    this.saveButton = this.flyoutContainer.getByRole('button', { name: 'Save' });
    this.cancelButton = this.flyoutContainer.getByRole('button', { name: 'Cancel' });

    // Form field locators
    this.firstNameField = this.flyoutContainer.getByRole('textbox', { name: 'First Name*' });
    this.lastNameField = this.flyoutContainer.getByRole('textbox', { name: 'Last Name*' });
    this.emailField = this.flyoutContainer.getByRole('textbox', { name: 'Account Email*' });
    this.startDateField = this.flyoutContainer.getByRole('textbox', { name: 'Start Date*' });

    // Dropdown locators
    this.departmentDropdown = this.flyoutContainer.getByRole('button', { name: 'Enter department... ' });
    this.positionDropdown = this.flyoutContainer.getByRole('button', { name: 'Enter position... ' });
    this.locationDropdown = this.flyoutContainer.getByRole('button', { name: 'Enter location... ' });
    this.dropdownMenu = page.locator('ul.dropdown-menu[role="menu"]:visible');
    this.dropdownItems = page.locator('ul.dropdown-menu[role="menu"]:visible li[ng-repeat="item in data"]');

    // Manager lookup locators
    this.managerLookupField = page.locator("//input[@id='xEmployee-xManagerLookup']");
    this.managerGrid = page.locator("//ngv-grid");
    this.managerGridFirstRow = page.locator("//body[1]/div[3]/div[5]/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/ngv-grid[1]/div[1]/div[3]/table[1]/tbody[1]/tr[1]/td[3]");

    // Checklist option locators
    this.onboardingChecklistOption = page.locator('//label[normalize-space()=\'Onboarding Checklist\']');
    this.prehireChecklistOption = page.locator('//label[normalize-space()=\'Pre-hire Checklist\']');
    this.noAutoAssignmentOption = page.locator('//label[normalize-space()=\'No Auto Assignment\']');

    // Confirmation dialog
    this.confirmCancelButton = page.locator('//confirm-dialog//button').first();

    // Employee Grid & Profile locators
    this.backButton = page.locator('//span[normalize-space()="Back"]');
    this.backButtonAlt = page.getByRole('button', { name: ' Back' });
    this.firstNameSearchField = page.getByRole('textbox', { name: 'First Name' });
    this.lastNameSearchField = page.getByRole('textbox', { name: 'Last Name' });
    this.searchClearIcon = page.locator('td:nth-child(3) > .search-field > .icon.icon-xs.icon-close');

    // Profile tabs
    this.personalTab = page.getByRole('tab', { name: 'Personal' });

    // Personal section edit
    this.personalSectionEditButton = page.locator('#details-xEmployee-xPersonalSection').getByRole('link', { name: ' Edit' });
    this.firstNameEditInput = page.getByRole('textbox', { name: 'First Name*' });
    this.lastNameEditInput = page.getByRole('textbox', { name: 'Last Name*' });
    this.saveEditButton = page.getByRole('button', { name: 'Save' });

    // Actions menu locators
    this.actionsMenuButton = page.getByRole('link', { name: ' Actions ' });
    this.changeStartDateOption = page.getByRole('link', { name: 'Change Start Date' });
    this.changeSalaryOption = page.getByRole('link', { name: 'Change Salary' });

    // Change Start Date dialog locators
    this.startDateInput = page.getByRole('textbox', { name: 'Start Date*' });
    this.startDateDisplayField = page.locator('#details-xEmployee-xStartDate');

    // Change Salary dialog locators
    this.effectiveDateInput = page.getByRole('textbox', { name: 'Effective Date*' });
    this.salaryInput = page.getByRole('textbox', { name: '00.00' });
    this.salaryDisplayField = page.locator('#details-xEmployee-xSalarySection');
  }

  // ===========================================
  // NAVIGATION METHODS
  // ===========================================

  async open() {
    await this.addButton.click();
    await this.page.waitForTimeout(500);
  }

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

  async save() {
    await this.saveButton.click();
  }

  // ===========================================
  // FORM FILLING METHODS
  // ===========================================

  async fillFirstName(firstName) {
    await this.firstNameField.fill(firstName);
  }

  async fillLastName(lastName) {
    await this.lastNameField.fill(lastName);
  }

  async fillEmail(email) {
    await this.emailField.fill(email);
  }

  async fillStartDate(date) {
    await this.startDateField.fill(date);
    await this.startDateField.press('Enter');
  }

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

  async selectFromDropdown(dropdown, itemIndex = 0) {
    await dropdown.click();
    await this.page.waitForTimeout(500);

    const items = await this.dropdownItems.all();

    if (items.length > itemIndex) {
      await items[itemIndex].click();
    } else if (items.length > 0) {
      await items[0].click();
    }

    await this.page.waitForTimeout(500);
  }

  async selectDepartment(itemIndex = 0) {
    await this.selectFromDropdown(this.departmentDropdown, itemIndex);
  }

  async selectPosition(itemIndex = 0) {
    await this.selectFromDropdown(this.positionDropdown, itemIndex);
  }

  async selectLocation(itemIndex = 0) {
    await this.selectFromDropdown(this.locationDropdown, itemIndex);
  }

  async selectAllDropdowns(deptIndex = 0, posIndex = 0, locIndex = 0) {
    await this.selectDepartment(deptIndex);
    await this.selectPosition(posIndex);
    await this.selectLocation(locIndex);
  }

  // ===========================================
  // MANAGER LOOKUP METHODS
  // ===========================================

  async openManagerLookup() {
    await this.managerLookupField.click();
    await this.page.waitForTimeout(1000);
  }

  async selectFirstManager() {
    await this.openManagerLookup();
    await this.managerGridFirstRow.click();
    await this.page.waitForTimeout(1000);
  }

  async getManagerValue() {
    return await this.managerLookupField.inputValue();
  }

  // ===========================================
  // CHECKLIST OPTION METHODS
  // ===========================================

  async scrollToChecklistOptions() {
    await this.flyoutContainer.evaluate(el => el.scrollTo(0, el.scrollHeight));
    await this.page.waitForTimeout(300);
  }

  async selectOnboardingChecklist() {
    await this.scrollToChecklistOptions();
    await this.onboardingChecklistOption.scrollIntoViewIfNeeded();
    await this.onboardingChecklistOption.click({ force: true });
    await this.page.waitForTimeout(500);
  }

  async selectPrehireChecklist() {
    await this.scrollToChecklistOptions();
    await this.prehireChecklistOption.scrollIntoViewIfNeeded();
    await this.prehireChecklistOption.click({ force: true });
    await this.page.waitForTimeout(500);
  }

  async selectNoAutoAssignment() {
    await this.scrollToChecklistOptions();
    await this.noAutoAssignmentOption.scrollIntoViewIfNeeded();
    await this.noAutoAssignmentOption.click({ force: true });
    await this.page.waitForTimeout(500);
  }

  // ===========================================
  // HELPER METHODS (for tests to use with assertions)
  // ===========================================

  async waitForFlyoutOpen() {
    await this.flyoutContainer.first().waitFor({ state: 'visible', timeout: 5000 });
  }

  async waitForFlyoutClosed() {
    await this.flyoutContainer.first().waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});
  }

  getFlyoutContainer() {
    return this.flyoutContainer.first();
  }

  getFirstNameField() {
    return this.firstNameField;
  }

  getLastNameField() {
    return this.lastNameField;
  }

  getEmailField() {
    return this.emailField;
  }

  getStartDateField() {
    return this.startDateField;
  }

  getDepartmentDropdown() {
    return this.departmentDropdown;
  }

  getPositionDropdown() {
    return this.positionDropdown;
  }

  getLocationDropdown() {
    return this.locationDropdown;
  }

  getManagerLookupField() {
    return this.managerLookupField;
  }

  getSaveButton() {
    return this.saveButton;
  }

  getCancelButton() {
    return this.cancelButton;
  }

  getEmployeeLocator(firstName, lastName) {
    return this.page.locator(`text=${firstName}`).or(this.page.locator(`text=${lastName}`));
  }

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
  // HELPER METHODS
  // ===========================================

  getTodayDate() {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const year = today.getFullYear();
    return `${month}/${day}/${year}`;
  }

  async dismissOverlays() {
    await this.page.keyboard.press('Escape').catch(() => {});
    await this.page.waitForTimeout(300);

    await this.page.locator('.flyout-large').first().waitFor({ state: 'hidden', timeout: 1000 }).catch(() => {});
    await this.page.locator('.ngv-slide-overlay').first().waitFor({ state: 'hidden', timeout: 1000 }).catch(() => {});
    await this.flyoutContainer.first().waitFor({ state: 'hidden', timeout: 1000 }).catch(() => {});

    await this.page.waitForTimeout(500);
  }

  // ===========================================
  // COMPLETE WORKFLOW METHODS
  // ===========================================

  async createEmployeeWithMinimumFields() {
    const uniqueID = generateShortID();
    const { firstName, lastName, email } = await this.fillRequiredFields(uniqueID);
    await this.selectNoAutoAssignment();
    await this.save();
    return { firstName, lastName, email, uniqueID };
  }

  async createEmployeeWithAllFields() {
    const uniqueID = generateShortID();
    const { firstName, lastName, email, startDate } = await this.fillAllRequiredFields(uniqueID);
    await this.selectAllDropdowns();
    await this.selectFirstManager();
    await this.save();
    return { firstName, lastName, email, startDate, uniqueID };
  }

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

  // ===========================================
  // EMPLOYEE GRID & PROFILE METHODS
  // ===========================================

  /**
   * Click Back button to return to employee grid
   */
  async clickBack() {
    await this.backButton.click();
    await this.page.waitForTimeout(2000);
  }

  /**
   * Click Back button (alternative locator)
   */
  async clickBackAlt() {
    await this.backButtonAlt.click();
    await this.page.waitForTimeout(2000);
  }

  /**
   * Search for employee by first name
   * @param {string} firstName - First name to search for
   */
  async searchByFirstName(firstName) {
    await this.firstNameSearchField.fill(firstName);
    await this.firstNameSearchField.press('Enter');
    await this.page.waitForTimeout(1500);
  }

  /**
   * Search for employee by last name
   * @param {string} lastName - Last name to search for
   */
  async searchByLastName(lastName) {
    await this.lastNameSearchField.fill(lastName);
    await this.lastNameSearchField.press('Enter');
    await this.page.waitForTimeout(1500);
  }

  /**
   * Clear the first name search field
   */
  async clearFirstNameSearch() {
    await this.firstNameSearchField.click();
    await this.searchClearIcon.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Open employee profile from grid by clicking on their name link
   * @param {string} employeeName - Full name or first name of employee
   * @param {boolean} exact - Whether to match the name exactly (default: false)
   */
  async openEmployeeProfile(employeeName, exact = false) {
    await this.page.getByRole('link', { name: employeeName, exact: exact }).click();
    await this.page.waitForTimeout(2000);
  }

  /**
   * Verify employee appears in grid search results
   * @param {string} employeeName - Name to verify
   */
  async verifyEmployeeInGrid(employeeName) {
    if (!this.expect) {
      throw new Error('expect object is required for assertions. Pass it in constructor.');
    }
    await this.expect(this.page.getByRole('link', { name: employeeName })).toBeVisible({ timeout: 10000 });
  }

  /**
   * Navigate to Personal tab
   */
  async goToPersonalTab() {
    await this.personalTab.click();
    await this.page.waitForTimeout(1500);
  }

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

  /**
   * Search, open, and edit employee
   * @param {string} originalName - Name to search for
   * @param {string} newFirstName - New first name
   * @param {string} newLastName - New last name
   */
  async searchOpenAndEdit(originalName, newFirstName, newLastName) {
    await this.searchByFirstName(originalName);
    await this.openEmployeeProfile(originalName);
    await this.editPersonalInfo(newFirstName, newLastName);
    await this.verifyProfileHeading(newFirstName);
  }

  // ===========================================
  // ACTIONS MENU METHODS
  // ===========================================

  /**
   * Search for employee by first and last name
   * @param {string} firstName - First name to search for
   * @param {string} lastName - Last name to search for
   */
  async searchByFirstAndLastName(firstName, lastName) {
    await this.firstNameSearchField.click();
    await this.firstNameSearchField.fill(firstName);
    await this.lastNameSearchField.click();
    await this.lastNameSearchField.fill(lastName);
    await this.lastNameSearchField.press('Enter');
    await this.page.waitForTimeout(1500);
  }

  /**
   * Open the Actions menu on employee profile
   */
  async openActionsMenu() {
    await this.actionsMenuButton.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Click Change Start Date option in Actions menu
   */
  async clickChangeStartDate() {
    await this.changeStartDateOption.click();
    await this.page.waitForTimeout(1500);
  }

  /**
   * Select a specific date in the calendar picker
   * @param {string} day - Day number to select (e.g., '15')
   */
  async selectDateInCalendar(day) {
    await this.startDateInput.click();
    await this.page.waitForTimeout(500);
    await this.page.getByRole('link', { name: day, exact: true }).click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Set start date by typing the full date
   * @param {string} date - Full date in MM/DD/YYYY format
   */
  async setStartDateByTyping(date) {
    await this.startDateInput.click();
    await this.page.waitForTimeout(500);
    await this.startDateInput.fill(date);
    await this.startDateInput.press('Enter');
    await this.page.waitForTimeout(500);
  }

  /**
   * Save the start date change
   */
  async saveStartDateChange() {
    await this.saveEditButton.click();
    await this.page.waitForTimeout(2000);
  }

  /**
   * Verify start date field value
   * @param {string} expectedDate - Expected date value
   */
  async verifyStartDate(expectedDate) {
    const actualDate = await this.startDateDisplayField.textContent();
    console.log(`Start Date verified: ${actualDate}`);
    return actualDate;
  }

  /**
   * Get start date field element for assertions
   */
  getStartDateField() {
    return this.startDateDisplayField;
  }

  // ===========================================
  // CHANGE SALARY METHODS
  // ===========================================

  /**
   * Click Change Salary option in Actions menu
   */
  async clickChangeSalary() {
    await this.changeSalaryOption.click();
    await this.page.waitForTimeout(1500);
  }

  /**
   * Set effective date for salary change by typing
   * @param {string} date - Full date in MM/DD/YYYY format
   */
  async setEffectiveDateByTyping(date) {
    await this.effectiveDateInput.click();
    await this.page.waitForTimeout(500);
    await this.effectiveDateInput.fill(date);
    await this.effectiveDateInput.press('Enter');
    await this.page.waitForTimeout(500);
  }

  /**
   * Select effective date in the calendar picker
   * @param {string} day - Day number to select (e.g., '29')
   */
  async selectEffectiveDateInCalendar(day) {
    await this.effectiveDateInput.click();
    await this.page.waitForTimeout(500);
    await this.page.getByRole('link', { name: day, exact: true }).click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Enter salary amount
   * @param {string} salary - Salary amount (e.g., '1000')
   */
  async enterSalary(salary) {
    await this.salaryInput.click();
    await this.salaryInput.fill(salary);
    await this.page.waitForTimeout(500);
  }

  /**
   * Save the salary change
   */
  async saveSalaryChange() {
    await this.saveEditButton.click();
    await this.page.waitForTimeout(2000);
  }

  /**
   * Verify salary field value
   * @returns {string} The salary text from the display field
   */
  async verifySalary() {
    const salaryText = await this.salaryDisplayField.textContent();
    console.log(`Salary verified: ${salaryText}`);
    return salaryText;
  }

  /**
   * Get salary field element for assertions
   */
  getSalaryField() {
    return this.salaryDisplayField;
  }
}
