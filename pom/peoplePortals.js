import { generateShortID } from '../src/utils.js';

export class PeoplePortals {
  constructor(page) {
    this.page = page;

    // Navigation
    this.portalsLink = page.locator('//*[@id="main-menu-dropdown"]/ul[1]/li[3]/a[1]');

    // Add/Edit form locators
    this.addButton = page.locator('.aut-button-add');
    this.titleField = page.locator('#title');
    this.saveButton = page.locator('.aut-button-save');
    this.cancelButton = page.locator('.aut-button-cancel');

    // Grid locators - portal links in title column
    this.portalLinks = page.locator('td[role="gridcell"] a');
    this.firstPortalLink = this.portalLinks.first();

    // Search field in title column
    this.titleSearchField = page.getByPlaceholder('Title').first();

    // Detail page locators
    this.detailPageHeading = page.locator('h1, h2').first();
  }

  // ===========================================
  // NAVIGATION METHODS
  // ===========================================

  async open() {
    await this.portalsLink.click();
    await this.page.waitForTimeout(500);
  }

  async openAddForm() {
    // Dismiss any overlays first
    await this.dismissOverlays();
    await this.addButton.click();
    await this.page.waitForTimeout(500);
  }

  async dismissOverlays() {
    // Click on the overlay to close it if present
    const overlay = this.page.locator('#flyout-close.overlay');
    const overlayCount = await overlay.count();
    if (overlayCount > 0) {
      await overlay.first().click({ force: true }).catch(() => {});
      await this.page.waitForTimeout(500);
    }

    // Also try pressing Escape
    await this.page.keyboard.press('Escape').catch(() => {});
    await this.page.waitForTimeout(300);

    // Wait for overlays to be removed
    await this.page.locator('.overlay.show').first().waitFor({ state: 'detached', timeout: 2000 }).catch(() => {});
    await this.page.locator('.flyout-large').first().waitFor({ state: 'hidden', timeout: 1000 }).catch(() => {});
    await this.page.waitForTimeout(300);
  }

  async openEditForm() {
    const editButton = this.page.getByRole('button', { name: 'Edit' });
    await editButton.click();
    await this.page.waitForTimeout(500);
  }

  // ===========================================
  // FORM FILLING METHODS
  // ===========================================

  async fillTitle(title) {
    await this.titleField.click();
    await this.titleField.fill(title);
  }

  async clearTitle() {
    await this.titleField.click();
    await this.titleField.fill('');
  }

  async save() {
    await this.saveButton.click();
    await this.page.waitForTimeout(2000);
  }

  async cancel() {
    await this.cancelButton.click();
    await this.page.waitForTimeout(500);
  }

  // ===========================================
  // SEARCH METHODS
  // ===========================================

  async searchByTitle(title) {
    await this.titleSearchField.click();
    await this.titleSearchField.fill(title);
    await this.page.waitForTimeout(1000);
  }

  async clickPortalByName(portalName) {
    // Click on portal link in the title column using xpath pattern
    const portalLink = this.page.locator(`//td[@role='gridcell']//a[contains(text(),'${portalName}')]`);
    await portalLink.click();
    await this.page.waitForTimeout(1000);
  }

  async clickFirstPortal() {
    const portalTitle = await this.firstPortalLink.textContent();
    await this.firstPortalLink.click();
    await this.page.waitForTimeout(1000);
    return portalTitle;
  }

  // ===========================================
  // HELPER METHODS (for tests to use with assertions)
  // ===========================================

  getPortalLocator(title) {
    return this.page.locator(`text=${title}`);
  }

  getDetailPageHeading() {
    return this.detailPageHeading;
  }

  getFirstPortalLink() {
    return this.firstPortalLink;
  }

  getTitleField() {
    return this.titleField;
  }

  getSaveButton() {
    return this.saveButton;
  }

  getCancelButton() {
    return this.cancelButton;
  }

  async waitForDetailPageVisible() {
    await this.detailPageHeading.waitFor({ state: 'visible', timeout: 10000 });
  }

  // ===========================================
  // COMPLETE WORKFLOW METHODS
  // ===========================================

  async createPortal(uniqueID = null) {
    if (!uniqueID) {
      uniqueID = generateShortID();
    }

    const portalTitle = `Portal_${uniqueID}`;

    // Open add form
    await this.openAddForm();

    // Fill form
    await this.fillTitle(portalTitle);

    // Save
    await this.save();

    console.log(` Portal created: ${portalTitle}`);

    return {
      portalTitle,
      uniqueID
    };
  }

  async updatePortalTitle(updatedTitle = null) {
    if (!updatedTitle) {
      const uniqueID = generateShortID();
      updatedTitle = `UpdatedPortal_${uniqueID}`;
    }

    // Wait for grid to load
    await this.page.waitForTimeout(1000);

    // Click first portal
    const originalTitle = await this.clickFirstPortal();

    // Open edit form
    await this.openEditForm();

    // Update title
    await this.clearTitle();
    await this.fillTitle(updatedTitle);

    // Save
    await this.saveButton.click();
    await this.page.waitForTimeout(3000);

    console.log(` Portal updated: ${originalTitle} to ${updatedTitle}`);

    return {
      originalTitle: originalTitle.trim(),
      updatedTitle: updatedTitle
    };
  }
}
