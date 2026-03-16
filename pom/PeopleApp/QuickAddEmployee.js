import { BasePage } from '../BasePage.js';
import { generateShortID } from '../../src/utils.js';

export class QuickAddEmployee extends BasePage {
  constructor(page, expect = null) {
    super(page, expect);

    // Quick Actions button in navbar
    this.quickActionsButton = page.locator('.icon.icon-plus');

    // Employee link in quick actions menu
    this.employeeLink = page.locator('#utility-bar-container a').filter({ hasText: 'Employee' });

    // Quick Add option
    this.quickAddOption = page.getByText('Quick Add Setup their account');

    // Add Employee with Details option
    this.addEmployeeWithDetailsOption = page.getByText('Add Employee with Details');

    // Form field locators
    this.firstNameField = page.locator('input[name="xFirstName0"]');
    this.lastNameField = page.locator('input[name="xLastName0"]');
    this.emailField = page.locator('input[name="xEmail0"]');

    // Add Employees button
    this.addEmployeesButton = page.getByRole('button', { name: 'Add Employees' });
  }

  // ===========================================
  // NAVIGATION METHODS
  // ===========================================

  /**
   * Open the Quick Add Employee flyout
   */
  async open() {
    await this.quickActionsButton.click();
    await this.page.waitForTimeout(500);
    await this.employeeLink.click();
    await this.page.waitForTimeout(500);
    await this.quickAddOption.click();
    await this.page.waitForTimeout(1000);
  }

  /**
   * Open the Add Employee with Details flyout
   */
  async openAddEmployeeWithDetails() {
    await this.quickActionsButton.click();
    await this.page.waitForTimeout(500);
    await this.employeeLink.click();
    await this.page.waitForTimeout(500);
    await this.addEmployeeWithDetailsOption.click();
    await this.page.waitForTimeout(1000);
  }

  // ===========================================
  // EMPLOYEE CREATION METHODS
  // ===========================================

  /**
   * Add a quick employee with random data
   * @returns {Object} Employee data {firstName, lastName, email}
   */
  async addQuickEmployee() {
    const shortID = generateShortID();
    const employeeData = {
      firstName: `First_${shortID}`,
      lastName: `Last_${shortID}`,
      email: `${shortID}@mail.com`
    };

    await this.firstNameField.click();
    await this.firstNameField.fill(employeeData.firstName);

    await this.lastNameField.click();
    await this.lastNameField.fill(employeeData.lastName);

    await this.emailField.click();
    await this.emailField.fill(employeeData.email);

    // Wait 5 seconds after filling all fields
    await this.page.waitForTimeout(5000);

    // Wait for button to be ready and click it
    await this.addEmployeesButton.waitFor({ state: 'visible' });
    await this.addEmployeesButton.click();
    await this.page.waitForTimeout(3000);

    console.log(`✓ Quick employee added: ${employeeData.firstName} ${employeeData.lastName}`);

    return employeeData;
  }

  /**
   * Add a quick employee with custom data
   * @param {string} firstName - Employee first name
   * @param {string} lastName - Employee last name
   * @param {string} email - Employee email
   * @returns {Object} Employee data {firstName, lastName, email}
   */
  async addQuickEmployeeWithData(firstName, lastName, email) {
    const employeeData = { firstName, lastName, email };

    await this.firstNameField.click();
    await this.firstNameField.fill(firstName);

    await this.lastNameField.click();
    await this.lastNameField.fill(lastName);

    await this.emailField.click();
    await this.emailField.fill(email);

    // Wait 5 seconds after filling all fields
    await this.page.waitForTimeout(5000);

    // Wait for button to be ready and click it
    await this.addEmployeesButton.waitFor({ state: 'visible' });
    await this.addEmployeesButton.click();
    await this.page.waitForTimeout(3000);

    console.log(`✓ Quick employee added: ${firstName} ${lastName}`);

    return employeeData;
  }
}
