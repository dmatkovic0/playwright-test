import { generateShortID } from '../src/utils.js';

export class Department {
  constructor(page, expect) {
    this.page = page;
    this.expect = expect;

    // Navigation
    this.moreLink = page.getByRole('link', { name: 'More', exact: true });
    this.departmentsLink = page.getByRole('link', { name: 'Departments' });

    // Add/Edit form locators
    this.addButton = page.locator('.aut-button-add');
    this.departmentNameField = page.getByRole('textbox', { name: 'Department Name*' });
    this.departmentCodeField = page.getByRole('textbox', { name: 'Department Code*' });
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.editButton = page.getByRole('button', { name: 'Edit' });

    // List/Grid locators
    this.departmentNameSearchField = page.getByRole('textbox', { name: 'Department Name' }).first();
    this.departmentCodeSearchField = page.locator('//input[@placeholder=\'Department Code\']').first();
    this.departmentLinks = page.locator('.aut-button-xDepartmentDetail');
    this.firstDepartmentLink = this.departmentLinks.first();

    // Detail page locators
    this.detailPageHeading = page.locator('#details-xDepartment-xDepartmentName');
  }

  // ===========================================
  // NAVIGATION METHODS
  // ===========================================

  async open() {
    await this.moreLink.click();
    await this.departmentsLink.click();
    await this.page.waitForTimeout(500);
  }

  async openAddForm() {
    await this.addButton.click();
  }

  async openEditForm() {
    await this.editButton.click();
    await this.page.waitForTimeout(500);
  }

  // ===========================================
  // FORM FILLING METHODS
  // ===========================================

  async fillDepartmentName(name) {
    await this.departmentNameField.click();
    await this.departmentNameField.fill(name);
  }

  async fillDepartmentCode(code) {
    await this.departmentCodeField.click();
    await this.departmentCodeField.fill(code);
  }

  async clearDepartmentCode() {
    await this.departmentCodeField.click();
    await this.departmentCodeField.fill('');
  }

  async save() {
    await this.saveButton.click();
    await this.page.waitForTimeout(2000);
  }

  // ===========================================
  // SEARCH METHODS
  // ===========================================

  async searchByName(name) {
    await this.departmentNameSearchField.click();
    await this.departmentNameSearchField.fill(name);
    await this.page.waitForTimeout(1000);
  }

  async searchByCode(code) {
    await this.departmentCodeSearchField.click();
    await this.departmentCodeSearchField.fill(code);
    await this.departmentCodeSearchField.press('Enter');
    await this.page.waitForTimeout(1000);
  }

  async clickDepartmentLink(name) {
    await this.page.getByRole('link', { name: name }).click();
  }

  async clickFirstDepartment() {
    const departmentName = await this.firstDepartmentLink.textContent();
    await this.firstDepartmentLink.click();
    await this.page.waitForTimeout(1000);
    return departmentName;
  }

  // ===========================================
  // VERIFICATION METHODS
  // ===========================================

  async verifyDepartmentVisible(name) {
    await this.expect(this.page.locator(`text=${name}`)).toBeVisible({ timeout: 10000 });
  }

  async verifyDetailPageVisible() {
    await this.expect(this.detailPageHeading).toBeVisible({ timeout: 10000 });
  }

  async verifyDepartmentLinkVisible() {
    await this.expect(this.firstDepartmentLink).toBeVisible({ timeout: 10000 });
  }

  // ===========================================
  // COMPLETE WORKFLOW METHODS
  // ===========================================

  async createDepartment(uniqueID = null) {
    if (!uniqueID) {
      uniqueID = generateShortID();
    }

    const departmentName = `Department_${uniqueID}`;
    const departmentCode = `DEPT_${uniqueID}`;

    // Open add form
    await this.openAddForm();

    // Fill form
    await this.fillDepartmentName(departmentName);
    await this.fillDepartmentCode(departmentCode);

    // Save
    await this.save();

    // Search and verify
    await this.searchByName(departmentName);
    await this.clickDepartmentLink(departmentName);
    await this.verifyDepartmentVisible(departmentName);

    console.log(`✓ Department created successfully: ${departmentName}`);

    return {
      departmentName,
      departmentCode,
      uniqueID
    };
  }

  async updateDepartmentCode(updatedCode = null) {
    if (!updatedCode) {
      const uniqueID = generateShortID();
      updatedCode = `UpdatedDEPT_${uniqueID}`;
    }

    // Wait for grid to load
    await this.page.waitForTimeout(1000);

    // Click first department
    const departmentName = await this.clickFirstDepartment();

    // Open edit form
    await this.openEditForm();

    // Update code
    await this.clearDepartmentCode();
    await this.fillDepartmentCode(updatedCode);

    // Save
    await this.saveButton.click();
    await this.page.waitForTimeout(3000);

    console.log(`✓ Department updated successfully: ${departmentName} with new code: ${updatedCode}`);

    // Search and verify
    await this.searchByCode(updatedCode);
    await this.verifyDepartmentLinkVisible();
    await this.clickFirstDepartment();
    await this.verifyDetailPageVisible();

    console.log(`✓ Department verified successfully: ${departmentName} with code: ${updatedCode}`);

    return {
      departmentName: departmentName.trim(),
      updatedDepartmentCode: updatedCode
    };
  }
}
