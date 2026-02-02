import { generateShortID } from '../../src/utils.js';

export class Position {
  constructor(page) {
    this.page = page;

    // Navigation
    this.positionsLink = page.getByRole('link', { name: 'Positions' });

    // Add/Edit form locators
    this.addButton = page.locator('.aut-button-add');
    this.positionTitleField = page.getByRole('textbox', { name: 'Position Title*' });
    this.positionCodeField = page.getByRole('textbox', { name: 'Position Code*' });
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.editButton = page.getByRole('button', { name: 'Edit' });

    // List/Grid locators
    this.positionTitleSearchField = page.getByRole('textbox', { name: 'Position Title' }).first();
    this.positionCodeSearchField = page.locator('//input[@placeholder=\'Position Code\']');
    this.positionLinks = page.locator('.aut-button-xPositionDetail');
    this.firstPositionLink = this.positionLinks.first();

    // Detail page locators
    this.detailPageHeading = page.locator('#details-xPosition-xPositionTitle');
  }

  // ===========================================
  // NAVIGATION METHODS
  // ===========================================

  async open() {
    await this.positionsLink.click();
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

  async fillPositionTitle(title) {
    await this.positionTitleField.click();
    await this.positionTitleField.fill(title);
  }

  async fillPositionCode(code) {
    await this.positionCodeField.click();
    await this.positionCodeField.fill(code);
  }

  async clearPositionCode() {
    await this.positionCodeField.click();
    await this.positionCodeField.fill('');
  }

  async save() {
    await this.saveButton.click();
    await this.page.waitForTimeout(2000);
  }

  // ===========================================
  // SEARCH METHODS
  // ===========================================

  async searchByTitle(title) {
    await this.positionTitleSearchField.click();
    await this.positionTitleSearchField.fill(title);
    await this.page.waitForTimeout(1000);
  }

  async searchByCode(code) {
    await this.positionCodeSearchField.click();
    await this.positionCodeSearchField.fill(code);
    await this.positionCodeSearchField.press('Enter');
    await this.page.waitForTimeout(1000);
  }

  async clickPositionLink(title) {
    await this.page.getByRole('link', { name: title }).click();
  }

  async clickFirstPosition() {
    const positionTitle = await this.firstPositionLink.textContent();
    await this.firstPositionLink.click();
    await this.page.waitForTimeout(1000);
    return positionTitle;
  }

  // ===========================================
  // HELPER METHODS (for tests to use with assertions)
  // ===========================================

  getPositionLocator(title) {
    return this.page.locator(`text=${title}`);
  }

  getDetailPageHeading() {
    return this.detailPageHeading;
  }

  getFirstPositionLink() {
    return this.firstPositionLink;
  }

  async waitForDetailPageVisible() {
    await this.detailPageHeading.waitFor({ state: 'visible', timeout: 10000 });
  }

  // ===========================================
  // COMPLETE WORKFLOW METHODS
  // ===========================================

  async createPosition(uniqueID = null) {
    if (!uniqueID) {
      uniqueID = generateShortID();
    }

    const positionTitle = `Position_${uniqueID}`;
    const positionCode = `Code_${uniqueID}`;

    // Open add form
    await this.openAddForm();

    // Fill form
    await this.fillPositionTitle(positionTitle);
    await this.fillPositionCode(positionCode);

    // Save
    await this.save();

    // Search and navigate to detail page
    await this.searchByTitle(positionTitle);
    await this.clickPositionLink(positionTitle);

    console.log(`✓ Position created: ${positionTitle} with code: ${positionCode}`);

    return {
      positionTitle,
      positionCode,
      uniqueID
    };
  }

  async updatePositionCode(updatedCode = null) {
    if (!updatedCode) {
      const uniqueID = generateShortID();
      updatedCode = `UpdatedCode_${uniqueID}`;
    }

    // Wait for grid to load
    await this.page.waitForTimeout(1000);

    // Click first position
    const positionTitle = await this.clickFirstPosition();

    // Open edit form
    await this.openEditForm();

    // Update code
    await this.clearPositionCode();
    await this.fillPositionCode(updatedCode);

    // Save
    await this.saveButton.click();
    await this.page.waitForTimeout(3000);

    console.log(`✓ Position updated: ${positionTitle} with new code: ${updatedCode}`);

    // Search and navigate to detail page
    await this.searchByCode(updatedCode);
    await this.clickFirstPosition();
    await this.waitForDetailPageVisible();

    console.log(`✓ Position detail page loaded: ${positionTitle} with code: ${updatedCode}`);

    return {
      positionTitle: positionTitle.trim(),
      updatedPositionCode: updatedCode
    };
  }
}
