import { generateShortID } from '../../src/utils.js';

export class Location {
  constructor(page) {
    this.page = page;

    // Navigation
    this.moreLink = page.getByRole('link', { name: 'More', exact: true });
    this.locationsLink = page.getByRole('link', { name: 'Locations' });

    // Add/Edit form locators
    this.addButton = page.locator('.aut-button-add');
    this.locationNameField = page.getByRole('textbox', { name: 'Location Name*' });
    this.locationCodeField = page.getByRole('textbox', { name: 'Location Code*' });
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.editButton = page.getByRole('button', { name: 'Edit' });

    // List/Grid locators
    this.locationNameSearchField = page.getByRole('textbox', { name: 'Location Name' }).first();
    this.locationCodeSearchField = page.locator('//input[@placeholder=\'Location Code\']');
    this.locationLinks = page.locator('.aut-button-xLocationDetail');
    this.firstLocationLink = this.locationLinks.first();

    // Detail page locators
    this.detailPageHeading = page.locator('#details-xLocation-xLocationName');
  }

  // ===========================================
  // NAVIGATION METHODS
  // ===========================================

  async open() {
    await this.moreLink.click();
    await this.locationsLink.click();
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

  async fillLocationName(name) {
    await this.locationNameField.click();
    await this.locationNameField.fill(name);
  }

  async fillLocationCode(code) {
    await this.locationCodeField.click();
    await this.locationCodeField.fill(code);
  }

  async clearLocationCode() {
    await this.locationCodeField.click();
    await this.locationCodeField.fill('');
  }

  async save() {
    await this.saveButton.click();
    await this.page.waitForTimeout(2000);
  }

  // ===========================================
  // SEARCH METHODS
  // ===========================================

  async searchByName(name) {
    await this.locationNameSearchField.click();
    await this.locationNameSearchField.fill(name);
    await this.page.waitForTimeout(1000);
  }

  async searchByCode(code) {
    await this.locationCodeSearchField.click();
    await this.locationCodeSearchField.fill(code);
    await this.locationCodeSearchField.press('Enter');
    await this.page.waitForTimeout(1000);
  }

  async clickLocationLink(name) {
    await this.page.getByRole('link', { name: name }).click();
  }

  async clickFirstLocation() {
    const locationName = await this.firstLocationLink.textContent();
    await this.firstLocationLink.click();
    await this.page.waitForTimeout(1000);
    return locationName;
  }

  // ===========================================
  // HELPER METHODS (for tests to use with assertions)
  // ===========================================

  getLocationLocator(name) {
    return this.page.locator(`text=${name}`);
  }

  getDetailPageHeading() {
    return this.detailPageHeading;
  }

  getFirstLocationLink() {
    return this.firstLocationLink;
  }

  async waitForDetailPageVisible() {
    await this.detailPageHeading.waitFor({ state: 'visible', timeout: 10000 });
  }

  // ===========================================
  // COMPLETE WORKFLOW METHODS
  // ===========================================

  async createLocation(uniqueID = null) {
    if (!uniqueID) {
      uniqueID = generateShortID();
    }

    const locationName = `Location_${uniqueID}`;
    const locationCode = `LOC_${uniqueID}`;

    // Open add form
    await this.openAddForm();

    // Fill form
    await this.fillLocationName(locationName);
    await this.fillLocationCode(locationCode);

    // Save
    await this.save();

    // Search and navigate to detail page
    await this.searchByName(locationName);
    await this.clickLocationLink(locationName);

    console.log(`✓ Location created: ${locationName}`);

    return {
      locationName,
      locationCode,
      uniqueID
    };
  }

  async updateLocationCode(updatedCode = null) {
    if (!updatedCode) {
      const uniqueID = generateShortID();
      updatedCode = `UpdatedLOC_${uniqueID}`;
    }

    // Wait for grid to load
    await this.page.waitForTimeout(1000);

    // Click first location
    const locationName = await this.clickFirstLocation();

    // Open edit form
    await this.openEditForm();

    // Update code
    await this.clearLocationCode();
    await this.fillLocationCode(updatedCode);

    // Save
    await this.saveButton.click();
    await this.page.waitForTimeout(3000);

    console.log(`✓ Location updated: ${locationName} with new code: ${updatedCode}`);

    // Search and navigate to detail page
    await this.searchByCode(updatedCode);
    await this.clickFirstLocation();
    await this.waitForDetailPageVisible();

    console.log(`✓ Location detail page loaded: ${locationName} with code: ${updatedCode}`);

    return {
      locationName: locationName.trim(),
      updatedLocationCode: updatedCode
    };
  }
}
