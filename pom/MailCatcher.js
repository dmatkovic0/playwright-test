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
    await this.mailcatcherPage.waitForTimeout(2000);
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

        const emailClicked = await this.clickEmail(emailAddress);

        if (emailClicked) {
          const activationLink = await this.extractActivationLink();
          if (activationLink) {
            return activationLink;
          }
        }
      } catch (error) {
        console.log(`Error on attempt ${i + 1}: ${error.message}`);
      }

      if (i < maxAttempts - 1) {
        await this.mailcatcherPage.reload();
        await this.mailcatcherPage.waitForTimeout(2000);
      }
    }

    throw new Error(`Activation email not found for ${emailAddress} after ${maxAttempts} attempts`);
  }
}
