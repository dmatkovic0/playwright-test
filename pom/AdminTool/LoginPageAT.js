import { BasePage } from '../BasePage.js';

export class LoginPageAT extends BasePage {
  constructor(page, expect = null) {
    super(page, expect);

    // Locators
    this.emailField = page.locator("//input[@id='Email']");
    this.passwordField = page.locator("//input[@id='Password']");
    this.loginButton = page.locator("//button[normalize-space()='Login']");
    this.menuButton = page.locator("//button[@class='menu-toggle']");
  }

  // ===========================================
  // NAVIGATION METHODS
  // ===========================================

  /**
   * Navigate to Admin Tool URL
   * @param {string} url - Admin Tool URL
   */
  async navigateTo(url) {
    await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await this.page.waitForTimeout(1000);
  }

  // ===========================================
  // LOGIN FORM METHODS
  // ===========================================

  /**
   * Fill email field
   * @param {string} email - Email address
   */
  async fillEmail(email) {
    await this.emailField.click();
    await this.emailField.fill(email);
  }

  /**
   * Fill password field
   * @param {string} password - Password
   */
  async fillPassword(password) {
    await this.passwordField.click();
    await this.passwordField.fill(password);
  }

  /**
   * Click login button
   */
  async clickLogin() {
    await this.loginButton.click();
    await this.page.waitForTimeout(2000);
  }

  // ===========================================
  // VERIFICATION METHODS
  // ===========================================

  /**
   * Verify successful login by checking menu button visibility
   * @returns {boolean} True if menu button is visible
   */
  async verifyLoginSuccessful() {
    const isVisible = await this.menuButton.isVisible({ timeout: 10000 }).catch(() => false);

    if (isVisible) {
      console.log('✓ Login successful - Menu button is visible');
    } else {
      console.log('✗ Login failed - Menu button is not visible');
    }

    return isVisible;
  }

  /**
   * Assert login was successful using expect
   */
  async assertLoginSuccessful() {
    if (!this.expect) {
      throw new Error('expect object is required for assertions. Pass it in constructor.');
    }
    await this.expect(this.menuButton).toBeVisible({ timeout: 10000 });
    console.log('✓ Login successful - Menu button verified');
  }

  // ===========================================
  // HELPER METHODS
  // ===========================================

  /**
   * Get email field element
   * @returns {Locator} Email field
   */
  getEmailField() {
    return this.emailField;
  }

  /**
   * Get password field element
   * @returns {Locator} Password field
   */
  getPasswordField() {
    return this.passwordField;
  }

  /**
   * Get login button element
   * @returns {Locator} Login button
   */
  getLoginButton() {
    return this.loginButton;
  }

  /**
   * Get menu button element
   * @returns {Locator} Menu button
   */
  getMenuButton() {
    return this.menuButton;
  }

  // ===========================================
  // COMPLETE WORKFLOW METHODS
  // ===========================================

  /**
   * Complete login workflow
   * @param {string} url - Admin Tool URL
   * @param {string} email - Email address
   * @param {string} password - Password
   */
  async login(url, email, password) {
    // Navigate to Admin Tool
    await this.navigateTo(url);

    // Fill credentials
    await this.fillEmail(email);
    await this.fillPassword(password);

    // Click login
    await this.clickLogin();

    // Verify login successful
    const isSuccessful = await this.verifyLoginSuccessful();

    if (isSuccessful) {
      console.log(`✓ Successfully logged into Admin Tool as: ${email}`);
    } else {
      throw new Error(`Login failed for: ${email}`);
    }
  }
}
