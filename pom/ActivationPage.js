import { BasePage } from './BasePage.js';

export class ActivationPage extends BasePage {
  constructor(page, expect = null) {
    super(page, expect);

    // Activation form locators
    this.passwordField = page.locator("//input[@placeholder='Enter Password']");
    this.privacyPolicyCheckbox = page.locator("//label[@for='agree-policy']");
    this.signUpButton = page.locator("//button[normalize-space()='Sign up']");
  }

  // ===========================================
  // NAVIGATION METHODS
  // ===========================================

  /**
   * Navigate to the activation link
   * @param {string} activationLink - The full activation URL
   */
  async navigateTo(activationLink) {
    await this.page.goto(activationLink);
    await this.page.waitForTimeout(2000);
    console.log('Navigated to activation page');
  }

  // ===========================================
  // FORM METHODS
  // ===========================================

  /**
   * Fill in the password field
   * @param {string} password - Password to set for the new account
   */
  async fillPassword(password) {
    await this.passwordField.waitFor({ state: 'visible', timeout: 10000 });
    await this.passwordField.fill(password);
    console.log('Password field filled');
  }

  /**
   * Click the privacy policy checkbox on the activation form
   */
  async checkPrivacyPolicy() {
    await this.privacyPolicyCheckbox.waitFor({ state: 'visible', timeout: 5000 });
    await this.privacyPolicyCheckbox.click();
    console.log('Privacy policy checkbox checked');
  }

  /**
   * Click the Sign up button to submit the activation form
   */
  async submitSignUp() {
    await this.signUpButton.click();
    await this.page.waitForTimeout(3000);
    console.log('Sign up submitted');
  }

  // ===========================================
  // COMPLETE WORKFLOW METHODS
  // ===========================================

  /**
   * Complete the full activation flow: navigate, fill form, accept privacy policy, skip navigation.
   * acceptPrivacyPolicy() and skipNavigation() are inherited from BasePage.
   * @param {string} activationLink - The activation URL from the email
   * @param {string} password - Password for the new account (default: 'TestPassword123!')
   */
  async activate(activationLink, password = 'TestPassword123!') {
    await this.navigateTo(activationLink);
    await this.fillPassword(password);
    await this.checkPrivacyPolicy();
    await this.submitSignUp();
    await this.acceptPrivacyPolicy();
    await this.skipNavigation();
  }
}
