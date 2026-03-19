import { mailcatcherUrl } from '../src/loginInfo/loginInfo.js';

export class MailCatcher {
  constructor(context) {
    this.context = context;
    this.mailcatcherPage = null;
    this.baseUrl = mailcatcherUrl;
  }

  // ===========================================
  // LOCATORS (lazy getters  require open() first)
  // ===========================================

  get searchBox() {
    return this.mailcatcherPage.locator(
      'input[type="search"], input[placeholder*="Search"], input[ng-model*="search"]'
    ).first();
  }

  get emailIframe() {
    return this.mailcatcherPage.locator('iframe').first();
  }

  get activationButtonInPage() {
    return this.mailcatcherPage.locator("//a[@class='button-link button-lg button-primary']");
  }

  // ===========================================
  // NAVIGATION METHODS
  // ===========================================

  /**
   * Open MailCatcher in a new browser tab and navigate to the inbox
   */
  async open() {
    this.mailcatcherPage = await this.context.newPage();
    await this.mailcatcherPage.goto(`${this.baseUrl}/#/`);
    await this.mailcatcherPage.waitForTimeout(5000);
    console.log('MailCatcher opened');
  }

  /**
   * Close the MailCatcher browser tab
   */
  async close() {
    if (this.mailcatcherPage) {
      await this.mailcatcherPage.close();
      this.mailcatcherPage = null;
      console.log('MailCatcher tab closed');
    }
  }

  // ===========================================
  // EMAIL INTERACTION METHODS
  // ===========================================

  /**
   * Filter the inbox using the search box (if available)
   * @param {string} emailAddress - Recipient email to search for
   */
  async searchForEmail(emailAddress) {
    const searchBoxVisible = await this.searchBox.isVisible({ timeout: 1000 }).catch(() => false);
    if (searchBoxVisible) {
      await this.searchBox.fill(emailAddress);
      await this.mailcatcherPage.waitForTimeout(1000);
    }
  }

  /**
   * Click an email in the inbox list that matches the given recipient address
   * @param {string} emailAddress - Recipient email to locate
   * @returns {boolean} Whether the email was found and clicked
   */
  async clickEmail(emailAddress) {
    const emailListItem = this.mailcatcherPage.locator(`text=${emailAddress}`).first();
    const emailVisible = await emailListItem.isVisible({ timeout: 2000 }).catch(() => false);

    if (emailVisible) {
      console.log('Found email in list, clicking it...');
      await emailListItem.click();
      await this.mailcatcherPage.waitForTimeout(2000);
      return true;
    }

    return false;
  }

  /**
   * Extract the activation link from the currently open email (via iframe or direct)
   * @returns {string|null} The href of the activation button, or null if not found
   */
  async extractActivationLink() {
    try {
      const iframeVisible = await this.emailIframe.isVisible({ timeout: 2000 }).catch(() => false);

      if (iframeVisible) {
        const emailContent = await this.emailIframe.contentFrame();
        if (emailContent) {
          const activationButton = emailContent.locator("//a[@class='button-link button-lg button-primary']");
          const buttonVisible = await activationButton.isVisible({ timeout: 2000 }).catch(() => false);

          if (buttonVisible) {
            const link = await activationButton.getAttribute('href');
            console.log(`Extracted activation link: ${link}`);
            return link;
          } else {
            console.log('Activation button not visible in iframe');
          }
        }
      } else {
        // Fallback: try finding button directly on the page (no iframe)
        const buttonVisible = await this.activationButtonInPage.isVisible({ timeout: 2000 }).catch(() => false);
        if (buttonVisible) {
          const link = await this.activationButtonInPage.getAttribute('href');
          console.log(`Extracted activation link (no iframe): ${link}`);
          return link;
        }
      }
    } catch (error) {
      console.log('Error extracting activation link:', error.message);
    }

    return null;
  }

  // ===========================================
  // COMPLETE WORKFLOW METHODS
  // ===========================================

  /**
   * Poll MailCatcher until an activation email arrives for the given address,
   * then return the activation link found inside it.
   * Retries every 2 seconds for up to maxAttempts iterations.
   *
   * @param {string} emailAddress - Recipient email to wait for
   * @param {number} maxAttempts - Maximum number of polling attempts (default: 30 = ~60s)
   * @returns {string} The activation link URL
   * @throws {Error} If the email is not found within the allotted attempts
   */
  async getActivationLink(emailAddress, maxAttempts = 30) {
    console.log(`Searching for activation email sent to: ${emailAddress}`);

    for (let i = 0; i < maxAttempts; i++) {
      console.log(`Attempt ${i + 1}/${maxAttempts}: Looking for email in MailCatcher...`);

      try {
        await this.searchForEmail(emailAddress);

        // There may be multiple emails for the same address (e.g. activation + welcome).
        // Iterate through ALL matching emails and check each one for the activation link.
        const allMatchingEmails = this.mailcatcherPage.locator(`text=${emailAddress}`);
        const count = await allMatchingEmails.count();

        for (let j = 0; j < count; j++) {
          const emailItem = allMatchingEmails.nth(j);
          const isVisible = await emailItem.isVisible({ timeout: 1000 }).catch(() => false);
          if (!isVisible) continue;

          await emailItem.click();
          await this.mailcatcherPage.waitForTimeout(1500);

          const iframeVisible = await this.emailIframe.isVisible({ timeout: 2000 }).catch(() => false);
          if (!iframeVisible) continue;

          const emailContent = await this.emailIframe.contentFrame();
          const activationButton = emailContent.locator("//a[@class='button-link button-lg button-primary']");
          const buttonVisible = await activationButton.isVisible({ timeout: 2000 }).catch(() => false);

          if (buttonVisible) {
            const link = await activationButton.getAttribute('href');
            console.log(`Extracted activation link from email ${j + 1} of ${count}: ${link}`);
            return link;
          } else {
            console.log(`Email ${j + 1}/${count} does not contain activation link, trying next...`);
          }
        }
      } catch (error) {
        console.log(`Error on attempt ${i + 1}: ${error.message}`);
      }

      if (i < maxAttempts - 1) {
        await this.mailcatcherPage.reload();
        await this.mailcatcherPage.waitForTimeout(5000);
      }
    }

    throw new Error(`Activation email not found for ${emailAddress} after ${maxAttempts} attempts`);
  }

  /**
   * Verify that a password change notification email was received.
   * The email contains the text "Recently your account password has changed".
   *
   * @param {string} emailAddress - Recipient email to search for
   * @param {number} maxAttempts  - Maximum polling attempts (default: 30 = ~60s)
   * @returns {boolean} True if the notification email was found with the expected text
   * @throws {Error} If the email is not found within the allotted attempts
   */
  async verifyPasswordChangeNotification(emailAddress, maxAttempts = 30) {
    console.log(`Searching for password change notification email sent to: ${emailAddress}`);

    for (let i = 0; i < maxAttempts; i++) {
      console.log(`Attempt ${i + 1}/${maxAttempts}: Looking for password change notification...`);

      try {
        await this.searchForEmail(emailAddress);

        // There may be multiple emails for the same address.
        // Iterate through ALL matching emails and check each one for the notification text.
        const allMatchingEmails = this.mailcatcherPage.locator(`text=${emailAddress}`);
        const count = await allMatchingEmails.count();

        for (let j = 0; j < count; j++) {
          const emailItem = allMatchingEmails.nth(j);
          const isVisible = await emailItem.isVisible({ timeout: 1000 }).catch(() => false);
          if (!isVisible) continue;

          await emailItem.click();
          await this.mailcatcherPage.waitForTimeout(1500);

          const iframeVisible = await this.emailIframe.isVisible({ timeout: 2000 }).catch(() => false);
          if (!iframeVisible) continue;

          const emailContent = await this.emailIframe.contentFrame();

          // Look for the specific text "Recently your account password has changed"
          const notificationText = emailContent.locator("text=Recently your account password has changed");
          const textVisible = await notificationText.isVisible({ timeout: 2000 }).catch(() => false);

          if (textVisible) {
            console.log(`✓ Password change notification found in email ${j + 1} of ${count}`);
            return true;
          } else {
            console.log(`Email ${j + 1}/${count} does not contain password change notification, trying next...`);
          }
        }
      } catch (error) {
        console.log(`Error on attempt ${i + 1}: ${error.message}`);
      }

      if (i < maxAttempts - 1) {
        await this.mailcatcherPage.reload();
        await this.mailcatcherPage.waitForTimeout(5000);
      }
    }

    throw new Error(`Password change notification email not found for ${emailAddress} after ${maxAttempts} attempts`);
  }

  /**
   * Poll MailCatcher until a password-reset email arrives for the given address,
   * click the "RESET PASSWORD" link inside the email iframe, and return the
   * popup page that opens (to be used with ResetPasswordPage POM).
   *
   * @param {string} emailAddress - Recipient email to search for
   * @param {number} maxAttempts  - Maximum polling attempts (default: 30 = ~60s)
   * @returns {Page} The popup page opened by clicking RESET PASSWORD
   * @throws {Error} If the email or the reset link is not found in time
   */
  async getPasswordResetPopup(emailAddress, maxAttempts = 30) {
    console.log(`Searching for password reset email sent to: ${emailAddress}`);

    for (let i = 0; i < maxAttempts; i++) {
      console.log(`Attempt ${i + 1}/${maxAttempts}: Looking for password reset email...`);

      try {
        await this.searchForEmail(emailAddress);

        // There may be multiple emails for the same address (e.g. activation + reset).
        // Iterate through ALL matching rows and check each one for the RESET PASSWORD link.
        const allMatchingEmails = this.mailcatcherPage.locator(`text=${emailAddress}`);
        const count = await allMatchingEmails.count();

        for (let j = 0; j < count; j++) {
          const emailItem = allMatchingEmails.nth(j);
          const isVisible = await emailItem.isVisible({ timeout: 1000 }).catch(() => false);
          if (!isVisible) continue;

          await emailItem.click();
          await this.mailcatcherPage.waitForTimeout(1500);

          const iframeVisible = await this.emailIframe.isVisible({ timeout: 2000 }).catch(() => false);
          if (!iframeVisible) continue;

          const emailContent = await this.emailIframe.contentFrame();
          const resetLink    = emailContent.getByRole('link', { name: 'RESET PASSWORD' });
          const linkVisible  = await resetLink.isVisible({ timeout: 2000 }).catch(() => false);

          if (linkVisible) {
            try {
              const popupPromise = this.mailcatcherPage.waitForEvent('popup', { timeout: 10000 });
              await resetLink.click();
              const popup = await popupPromise;
              await popup.waitForLoadState('domcontentloaded');
              console.log(`Password reset popup opened (found in email ${j + 1} of ${count})`);
              return popup;
            } catch (popupError) {
              console.log(`Popup did not open on attempt ${i + 1}, email ${j + 1}: ${popupError.message}. Will refresh and retry...`);
            }
          } else {
            console.log(`Email ${j + 1}/${count} does not contain RESET PASSWORD link, trying next...`);
          }
        }
      } catch (error) {
        console.log(`Error on attempt ${i + 1}: ${error.message}`);
      }

      if (i < maxAttempts - 1) {
        await this.mailcatcherPage.reload();
        await this.mailcatcherPage.waitForTimeout(5000);
      }
    }

    throw new Error(`Password reset email not found for ${emailAddress} after ${maxAttempts} attempts`);
  }
}
