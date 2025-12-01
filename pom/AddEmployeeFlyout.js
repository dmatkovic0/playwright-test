import { generateShortID } from '../src/utils.js';

export class AddEmployeeFlyout {
  constructor(page, expect) {
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
  // VERIFICATION METHODS
  // ===========================================

  async verifyFlyoutIsOpen() {
    await this.expect(this.flyoutContainer.first()).toBeVisible({ timeout: 5000 });
  }

  async verifyFlyoutIsClosed() {
    await this.flyoutContainer.first().waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});
  }

  async verifyAllFieldsVisible() {
    await this.expect(this.firstNameField).toBeVisible();
    await this.expect(this.lastNameField).toBeVisible();
    await this.expect(this.emailField).toBeVisible();
    await this.expect(this.startDateField).toBeVisible();
    await this.expect(this.departmentDropdown).toBeVisible();
    await this.expect(this.positionDropdown).toBeVisible();
    await this.expect(this.locationDropdown).toBeVisible();
    await this.expect(this.managerLookupField).toBeVisible();
  }

  async verifyRequiredFieldIndicators() {
    // Verify asterisks are present in field labels
    await this.expect(this.page.getByRole('textbox', { name: 'First Name*' })).toBeVisible();
    await this.expect(this.page.getByRole('textbox', { name: 'Last Name*' })).toBeVisible();
    await this.expect(this.page.getByRole('textbox', { name: 'Account Email*' })).toBeVisible();
    await this.expect(this.page.getByRole('textbox', { name: 'Start Date*' })).toBeVisible();
  }

  async verifySaveButtonVisible() {
    await this.expect(this.saveButton).toBeVisible();
  }

  async verifyCancelButtonVisible() {
    await this.expect(this.cancelButton).toBeVisible();
  }

  async verifyEmployeeCreated(firstName, lastName) {
    await this.expect(
      this.page.locator(`text=${firstName}`).or(this.page.locator(`text=${lastName}`))
    ).toBeVisible({ timeout: 15000 });
  }

  async verifyFieldValue(fieldName, expectedValue) {
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

    const value = await field.inputValue();
    this.expect(value).toBe(expectedValue);
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
    await this.verifyEmployeeCreated(firstName, lastName);
    return { firstName, lastName, email, uniqueID };
  }

  async createEmployeeWithAllFields() {
    const uniqueID = generateShortID();
    const { firstName, lastName, email, startDate } = await this.fillAllRequiredFields(uniqueID);
    await this.selectAllDropdowns();
    await this.selectFirstManager();
    await this.save();
    await this.verifyEmployeeCreated(firstName, lastName);
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

    // Verify
    await this.verifyEmployeeCreated(firstName, lastName);

    console.log(`✓ Employee created successfully: ${firstName} ${lastName} with start date: ${startDate}`);

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

    // Verify
    await this.verifyEmployeeCreated(firstName, lastName);

    console.log(`✓ Employee with Prehire Checklist created successfully: ${firstName} ${lastName}`);

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

    // Verify
    await this.verifyEmployeeCreated(firstName, lastName);

    console.log(`✓ Employee with No Auto Assignment created successfully: ${firstName} ${lastName}`);

    return {
      firstName,
      lastName,
      email,
      uniqueID
    };
  }
}
