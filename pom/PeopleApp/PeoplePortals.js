import { generateShortID } from '../../src/utils.js';

export class PeoplePortals {
  constructor(page) {
    this.page = page;

    // Navigation
    this.portalsLink = page.locator('//a[@ng-show=\'!menuItem.SubMenus.length\'][normalize-space()=\'Portals\']');

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
    // Target the portal title heading specifically (not "People" or "Portal Administration")
    this.detailPageHeading = page.locator('h1').first();
  }

  // ===========================================
  // NAVIGATION METHODS
  // ===========================================

  async open() {
    await this.portalsLink.click();
    // Wait for the Portals page to load by checking for the Add button
    await this.addButton.waitFor({ state: 'visible', timeout: 10000 });
  }

  async openAddForm() {
    // Dismiss any overlays first
    await this.dismissOverlays();
    await this.addButton.click();
    // Wait for the form to open by checking if title field is visible
    await this.titleField.waitFor({ state: 'visible', timeout: 5000 });
  }

  async dismissOverlays() {
    // Click on the overlay to close it if present
    const overlay = this.page.locator('#flyout-close.overlay');
    const overlayCount = await overlay.count();
    if (overlayCount > 0) {
      await overlay.first().click({ force: true }).catch(() => {});
    }

    // Also try pressing Escape
    await this.page.keyboard.press('Escape').catch(() => {});

    // Wait for overlays to be removed
    await this.page.locator('.overlay.show').first().waitFor({ state: 'detached', timeout: 2000 }).catch(() => {});
    await this.page.locator('.flyout-large').first().waitFor({ state: 'hidden', timeout: 1000 }).catch(() => {});
  }

  async openEditForm() {
    const editButton = this.page.getByRole('button', { name: 'Edit' });
    await editButton.click();
    // Wait for the edit form to open by checking if title field is visible
    await this.titleField.waitFor({ state: 'visible', timeout: 5000 });
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
    // Wait for the form to close by checking if save button disappears
    await this.saveButton.waitFor({ state: 'hidden', timeout: 10000 });
  }

  async cancel() {
    await this.cancelButton.click();
    // Wait for the form to close by checking if cancel button disappears
    await this.cancelButton.waitFor({ state: 'hidden', timeout: 5000 });
  }

  // ===========================================
  // SEARCH METHODS
  // ===========================================

  async searchByTitle(title) {
    await this.titleSearchField.click();
    await this.titleSearchField.fill(title);
    // Wait for search results to load - wait for network to be idle
    await this.page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
  }

  async clickPortalByName(portalName) {
    // Click on portal link in the title column using xpath pattern
    const portalLink = this.page.locator(`//td[@role='gridcell']//a[contains(text(),'${portalName}')]`);
    await portalLink.click();
    // Wait for detail page to load
    await this.detailPageHeading.waitFor({ state: 'visible', timeout: 10000 });
  }

  async clickFirstPortal() {
    const portalTitle = await this.firstPortalLink.textContent();
    await this.firstPortalLink.click();
    // Wait for detail page to load
    await this.detailPageHeading.waitFor({ state: 'visible', timeout: 10000 });
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

    // Wait for grid to load by checking if first portal link is visible
    await this.firstPortalLink.waitFor({ state: 'visible', timeout: 10000 });

    // Click first portal
    const originalTitle = await this.clickFirstPortal();

    // Open edit form
    await this.openEditForm();

    // Update title
    await this.clearTitle();
    await this.fillTitle(updatedTitle);

    // Save
    await this.saveButton.click();
    // Wait for the form to close and page to update
    await this.saveButton.waitFor({ state: 'hidden', timeout: 10000 });
    // Wait for the updated title to appear in the heading
    await this.page.waitForFunction(
      (expectedTitle) => document.querySelector('h1')?.textContent?.includes(expectedTitle),
      updatedTitle,
      { timeout: 5000 }
    ).catch(() => {});

    console.log(` Portal updated: ${originalTitle} to ${updatedTitle}`);

    return {
      originalTitle: originalTitle.trim(),
      updatedTitle: updatedTitle
    };
  }
}
