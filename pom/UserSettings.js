import { BasePage } from './BasePage.js';

export class UserSettings extends BasePage {
  constructor(page, expect = null) {
    super(page, expect);

    // Account Info tab (in case it is not the default active tab)
    this.accountInfoTab = page.getByRole('link', { name: 'Account Info' });

    // Change Password section
    this.changePasswordButton = page.getByRole('button', { name: 'Change Password' });
    this.forgotPasswordLink    = page.locator('a').filter({ hasText: 'Forgot password?' });
  }

  // ===========================================
  // NAVIGATION METHODS
  // ===========================================

  /**
   * Click the Account Info tab (if needed — it may already be the default)
   */
  async goToAccountInfoTab() {
    await this.accountInfoTab.click();
    await this.page.waitForTimeout(1000);
  }

  // ===========================================
  // CHANGE PASSWORD METHODS
  // ===========================================

  /**
   * Click the Change Password button on the Account Info section
   */
  async clickChangePassword() {
    await this.changePasswordButton.click();
    await this.page.waitForTimeout(1000);
  }

  /**
   * Click the "Forgot password?" link to trigger a password reset email
   */
  async clickForgotPassword() {
    await this.forgotPasswordLink.click();
    await this.page.waitForTimeout(2000);
  }

  // ===========================================
  // COMPLETE WORKFLOW METHODS
  // ===========================================

  /**
   * Open Change Password panel and click Forgot password? to send the reset email.
   * This is all that is needed — the reset itself happens via MailCatcher.
   */
  async initiatePasswordReset() {
    await this.clickChangePassword();
    await this.clickForgotPassword();
    console.log('Password reset email triggered via Forgot password?');
  }
}
