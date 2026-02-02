import { BasePage } from './BasePage.js';

export class PeopleGrid extends BasePage {
  constructor(page, expect = null) {
    super(page, expect);

    // Employee Grid locators
    this.backButton = page.locator('//span[normalize-space()="Back"]');
    this.backButtonAlt = page.getByRole('button', { name: ' Back' });
    this.firstNameSearchField = page.getByRole('textbox', { name: 'First Name' });
    this.lastNameSearchField = page.getByRole('textbox', { name: 'Last Name' });
    this.searchClearIcon = page.locator('td:nth-child(3) > .search-field > .icon.icon-xs.icon-close');
  }

  // ===========================================
  // NAVIGATION METHODS
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

  // ===========================================
  // SEARCH METHODS
  // ===========================================

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
   * Clear the first name search field
   */
  async clearFirstNameSearch() {
    await this.firstNameSearchField.click();
    await this.searchClearIcon.click();
    await this.page.waitForTimeout(500);
  }

  // ===========================================
  // EMPLOYEE PROFILE METHODS
  // ===========================================

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
   * Get employee locator for custom assertions
   * @param {string} firstName - Employee first name
   * @param {string} lastName - Employee last name
   * @returns {Locator} Locator for the employee
   */
  getEmployeeLocator(firstName, lastName) {
    return this.page.locator(`text=${firstName}`).or(this.page.locator(`text=${lastName}`));
  }
}
