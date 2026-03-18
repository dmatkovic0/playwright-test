import { BasePage } from '../BasePage.js';

export class OnboardSettings extends BasePage {
  constructor(page, expect = null) {
    super(page, expect);

    // ===========================================
    // LOCATORS
    // ===========================================

    this.ConfigurePreboardingMandatoryFields = page.locator("//a[@ng-click='vm.openPreboardingConfiguration()']");

    // ── Preboarding Flyout ──
    this.PreboardingFlyoutCancelButton = page.locator("//span[normalize-space()='Cancel']");
    this.PreboardingSaveButton = page.locator("//button[@class='btn aut-button-save btn-primary']");
    this.PreboardingEmployeeNumberDropdown = page.locator("//div[@class='inner-padding']//div[1]//div[1]//button[1]");
    this.PreboardingStartDateDropdown = page.locator("//div[@class='content-wrapper']//div[2]//div[1]//button[1]");
    this.PreboardingDepartmentDropdown = page.locator("//div[@class='ngv-slide popup-wrapper show flyout-small']//div[3]//div[1]//button[1]");
    this.PreboardingPositionDropdown = page.locator("//div[4]//div[1]//button[1]");
    this.PreboardingLocationDropdown = page.locator("//div[@class='ngv-slide popup-wrapper show flyout-small']//div[5]//div[1]//button[1]");

    // ── Preboarding Dropdown Options (Generic) ──
    this.PreboardingOptionalOption = page.locator(".aut-button-optionalOption");
    this.PreboardingMandatoryOption = page.locator(".aut-button-mandatoryOption");
  }

  // ===========================================
  // METHODS
  // ===========================================

  /**
   * Click on Configure Preboarding Mandatory Fields button
   */
  async clickConfigurePreboardingMandatoryFields() {
    await this.ConfigurePreboardingMandatoryFields.click();
    await this.page.waitForTimeout(1500);
  }

  /**
   * Set a field to Mandatory
   * @param {Locator} fieldDropdown - The field dropdown locator
   */
  async setFieldToMandatory(fieldDropdown) {
    await fieldDropdown.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(300);
    await fieldDropdown.click();
    await this.page.waitForTimeout(2000);

    // Find the Mandatory option that's visible
    const mandatoryOptions = await this.page.locator("a.aut-button-mandatoryOption.aut-button-option").all();
    for (const option of mandatoryOptions) {
      if (await option.isVisible()) {
        await option.click();
        break;
      }
    }
    await this.page.waitForTimeout(500);
  }

  /**
   * Set a field to Optional
   * @param {Locator} fieldDropdown - The field dropdown locator
   */
  async setFieldToOptional(fieldDropdown) {
    await fieldDropdown.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(300);
    await fieldDropdown.click();
    await this.page.waitForTimeout(2000);

    // Find the Optional option that's visible
    const optionalOptions = await this.page.locator("a.aut-button-optionalOption.aut-button-option").all();
    for (const option of optionalOptions) {
      if (await option.isVisible()) {
        await option.click();
        break;
      }
    }
    await this.page.waitForTimeout(500);
  }

  /**
   * Save preboarding configuration
   */
  async savePreboardingConfiguration() {
    await this.PreboardingSaveButton.click();
    await this.page.waitForTimeout(1500);
  }

  /**
   * Set Start Date field to Mandatory
   */
  async setStartDateToMandatory() {
    await this.setFieldToMandatory(this.PreboardingStartDateDropdown);
  }

  /**
   * Set Start Date field to Optional
   */
  async setStartDateToOptional() {
    await this.setFieldToOptional(this.PreboardingStartDateDropdown);
  }

  /**
   * Set Department field to Mandatory
   */
  async setDepartmentToMandatory() {
    await this.setFieldToMandatory(this.PreboardingDepartmentDropdown);
  }

  /**
   * Set Department field to Optional
   */
  async setDepartmentToOptional() {
    await this.setFieldToOptional(this.PreboardingDepartmentDropdown);
  }

  /**
   * Set Position field to Mandatory
   */
  async setPositionToMandatory() {
    await this.setFieldToMandatory(this.PreboardingPositionDropdown);
  }

  /**
   * Set Position field to Optional
   */
  async setPositionToOptional() {
    await this.setFieldToOptional(this.PreboardingPositionDropdown);
  }

  /**
   * Set Location field to Mandatory
   */
  async setLocationToMandatory() {
    await this.setFieldToMandatory(this.PreboardingLocationDropdown);
  }

  /**
   * Set Location field to Optional
   */
  async setLocationToOptional() {
    await this.setFieldToOptional(this.PreboardingLocationDropdown);
  }

  /**
   * Configure all preboarding fields (Start Date, Department, Position, Location)
   * @param {string} mode - 'mandatory' or 'optional'
   */
  async configureAllPreboardingFields(mode = 'mandatory') {
    if (mode === 'mandatory') {
      await this.setStartDateToMandatory();
      await this.setDepartmentToMandatory();
      await this.setPositionToMandatory();
      await this.setLocationToMandatory();
    } else {
      await this.setStartDateToOptional();
      await this.setDepartmentToOptional();
      await this.setPositionToOptional();
      await this.setLocationToOptional();
    }
    await this.savePreboardingConfiguration();
  }
}
