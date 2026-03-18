import { BasePage } from '../BasePage.js';

export class GlobalSystemSettings extends BasePage {
  constructor(page, expect = null) {
    super(page, expect);

    // ===========================================
    // LOCATORS
    // ===========================================

    this.onboardSettingsLink = page.locator("//span[@class='aut-button-onboardingSettings']");
  }

  // ===========================================
  // METHODS
  // ===========================================

  /**
   * Click on Onboard Settings link
   */
  async clickOnboardSettings() {
    // Move mouse to middle of page to close sidebar if it's open
    await this.page.mouse.move(600, 400);
    await this.page.waitForTimeout(500);

    // Scroll into view and click
    await this.onboardSettingsLink.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);
    await this.onboardSettingsLink.click();
    await this.page.waitForTimeout(2000);
  }
}
