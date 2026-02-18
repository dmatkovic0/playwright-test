/**
 * ResetPasswordPage
 *
 * Handles the password-reset popup that opens when clicking "RESET PASSWORD"
 * from the password-reset email in MailCatcher.
 *
 * The popup contains two sequential screens:
 *   1. Set new password form  (Enter Password / Confirm Password / Update My Password)
 *   2. Login form             (Return to Sign In → email + password → Sign In Securely)
 *
 * Constructor receives the popup Page object returned by MailCatcher.getPasswordResetPopup().
 */
export class ResetPasswordPage {
  constructor(page, expect = null) {
    this.page   = page;
    this.expect = expect;

    // ── Screen 1: Set new password ──────────────────────────────────────────
    this.newPasswordField    = page.getByRole('textbox', { name: 'Enter Password' });
    this.confirmPasswordField = page.getByRole('textbox', { name: 'Confirm Password' });
    this.updatePasswordButton = page.locator("//button[normalize-space()='Reset My Password']");

    // ── Screen 2: Return to sign-in ─────────────────────────────────────────
    this.returnToSignInLink   = page.getByRole('link',    { name: 'Return to Sign In' });

    // ── Screen 3: Login with new credentials ────────────────────────────────
    this.emailLoginField      = page.getByRole('textbox', { name: 'Enter Account Email or Phone' });
    this.signInButton         = page.getByRole('button',  { name: 'Sign In Securely' });
  }

  // ===========================================
  // SET NEW PASSWORD METHODS
  // ===========================================

  /**
   * Fill in the new password and confirm password fields
   * @param {string} newPassword - The new password to set
   */
  async fillNewPassword(newPassword) {
    await this.page.waitForTimeout(2000);
    await this.newPasswordField.click();
    await this.newPasswordField.fill(newPassword);
    await this.confirmPasswordField.click();
    await this.confirmPasswordField.fill(newPassword);
    await this.page.waitForTimeout(1000);
    console.log('New password filled in both fields');
  }

  /**
   * Click the Update My Password button
   */
  async clickUpdatePassword() {
    await this.updatePasswordButton.click();
    await this.page.waitForTimeout(2000);
    console.log('Update My Password clicked');
  }

  // ===========================================
  // RETURN TO SIGN-IN METHODS
  // ===========================================

  /**
   * Click the Return to Sign In link after the password has been updated
   */
  async clickReturnToSignIn() {
    await this.returnToSignInLink.click();
    await this.page.waitForTimeout(2000);
    console.log('Return to Sign In clicked');
  }

  // ===========================================
  // LOGIN WITH NEW PASSWORD METHODS
  // ===========================================

  /**
   * Log in using the employee email and the newly set password
   * @param {string} email      - Employee account email
   * @param {string} newPassword - The password just set via the reset form
   */
  async loginWithNewPassword(email, newPassword) {
    await this.emailLoginField.click();
    await this.emailLoginField.fill(email);
    await this.newPasswordField.click();
    await this.newPasswordField.fill(newPassword);
    await this.signInButton.click();
    await this.page.waitForTimeout(3000);
    console.log(`Signed in as ${email} with new password`);
  }

  // ===========================================
  // COMPLETE WORKFLOW METHODS
  // ===========================================

  /**
   * Full password-reset flow inside the popup:
   *   1. Set new password
   *   2. Click Update My Password
   *   3. Click Return to Sign In
   *   4. Login with email + new password
   *
   * @param {string} email       - Employee account email
   * @param {string} newPassword - The new password to set (default: 'NewPassword123!')
   */
  async resetAndLogin(email, newPassword = 'NewPassword123!') {
    await this.fillNewPassword(newPassword);
    await this.clickUpdatePassword();
    await this.clickReturnToSignIn();
    await this.loginWithNewPassword(email, newPassword);
    console.log(`✓ Password reset complete — logged in as ${email}`);
  }
}
