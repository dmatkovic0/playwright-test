import { environments } from '../src/loginInfo/loginInfo.js';

export class LoginPage {
  constructor(page, expect) {
    this.page = page;
    this.expect = expect;

    // Environment URLs (imported from secure loginInfo file)
    this.environments = environments;

    // Locators
    this.emailField = page.getByRole('textbox', { name: 'Enter Account Email or Phone' });
    this.passwordField = page.getByRole('textbox', { name: 'Enter Password' });
    this.signInButton = page.getByRole('button', { name: 'Sign In Securely' });
    this.cookieConsentFrame = page.locator('#custom-login-container iframe');
    this.chatWidgetFrame = page.locator('[data-test-id="chat-widget-iframe"]');
  }

  // ===========================================
  // NAVIGATION METHODS
  // ===========================================

  async navigateTo(environment, retries = 3) {
    // Normalize environment to lowercase
    const env = environment.toLowerCase();

    // Get the URL for the specified environment
    const url = this.environments[env];

    if (!url) {
      throw new Error(`Invalid environment: ${environment}. Valid options are: qa, stg, prod`);
    }

    // Navigate to login page with retry logic
    let attemptCount = retries;
    while (attemptCount > 0) {
      try {
        await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        break;
      } catch (error) {
        attemptCount--;
        if (attemptCount === 0) throw error;
        console.log(`Navigation failed, retrying... (${attemptCount} attempts left)`);
        await this.page.waitForTimeout(2000);
      }
    }
  }

  // ===========================================
  // COOKIE CONSENT METHODS
  // ===========================================

  async acceptCookieConsent() {
    try {
      // Double click to trigger cookie consent
      await this.emailField.dblclick();

      // Accept cookies in iframe
      const frame = await this.cookieConsentFrame.contentFrame();
      await frame.getByRole('button', { name: 'Accept' }).click();
    } catch (error) {
      console.log('Cookie consent handling failed or not needed:', error.message);
    }
  }

  // ===========================================
  // LOGIN FORM METHODS
  // ===========================================

  async fillEmail(email) {
    await this.emailField.click();
    await this.emailField.fill(email);
  }

  async fillPassword(password) {
    await this.passwordField.click();
    await this.passwordField.fill(password);
  }

  async clickSignIn() {
    await this.signInButton.click();
  }

  // ===========================================
  // CHAT WIDGET METHODS
  // ===========================================

  async closeChatWidget() {
    try {
      const frame = await this.chatWidgetFrame.contentFrame();
      await frame.locator('[data-test-id="ai-welcome-msg-close-button"]').click();
    } catch (error) {
      console.log('Chat widget close failed or not present:', error.message);
    }
  }

  // ===========================================
  // VERIFICATION METHODS
  // ===========================================

  async verifyLoginPageLoaded() {
    await this.expect(this.emailField).toBeVisible({ timeout: 10000 });
    await this.expect(this.passwordField).toBeVisible({ timeout: 10000 });
    await this.expect(this.signInButton).toBeVisible({ timeout: 10000 });
  }

  async verifyEmailFieldVisible() {
    await this.expect(this.emailField).toBeVisible();
  }

  async verifyPasswordFieldVisible() {
    await this.expect(this.passwordField).toBeVisible();
  }

  async verifySignInButtonVisible() {
    await this.expect(this.signInButton).toBeVisible();
  }

  // ===========================================
  // COMPLETE WORKFLOW METHODS
  // ===========================================

  async login(environment, email, password) {
    // Navigate to login page
    await this.navigateTo(environment);

    // Handle cookie consent
    await this.acceptCookieConsent();

    // Fill credentials
    await this.fillEmail(email);
    await this.fillPassword(password);

    // Sign in
    await this.clickSignIn();

    // Close chat widget
    await this.closeChatWidget();

    console.log(`✓ Successfully logged in as: ${email} in ${environment} environment`);
  }

  async loginWithoutChatClose(environment, email, password) {
    // Navigate to login page
    await this.navigateTo(environment);

    // Handle cookie consent
    await this.acceptCookieConsent();

    // Fill credentials
    await this.fillEmail(email);
    await this.fillPassword(password);

    // Sign in
    await this.clickSignIn();

    console.log(`✓ Logged in (chat widget not closed): ${email} in ${environment} environment`);
  }

  async quickLogin(environment, email, password) {
    // Simplified login without extra waits
    await this.navigateTo(environment);
    await this.acceptCookieConsent();
    await this.emailField.fill(email);
    await this.passwordField.fill(password);
    await this.signInButton.click();
    await this.closeChatWidget();
  }

  // ===========================================
  // VALIDATION TEST METHODS
  // ===========================================

  async loginAndVerifySuccess(environment, email, password) {
    await this.login(environment, email, password);

    // Verify successful login by checking dashboard
    await this.expect(this.page.getByRole('heading', { name: 'Onboard' })).toBeVisible();
    await this.expect(this.page.getByText('Welcome, HR2!')).toBeVisible();

    console.log('✓ Login successful with valid credentials');
  }

  async loginWithInvalidCredentials(environment) {
    await this.navigateTo(environment);
    await this.acceptCookieConsent();

    // Fill with invalid credentials
    await this.fillEmail('invalid@test.com');
    await this.fillPassword('WrongPassword123!');
    await this.clickSignIn();

    // Wait for error message
    await this.page.waitForTimeout(3000);

    // Verify error message is displayed
    const errorMessage = this.page.locator('.alert-danger').first();
    await this.expect(errorMessage).toBeVisible();

    // Verify still on login page
    await this.expect(this.emailField).toBeVisible();
    await this.expect(this.signInButton).toBeVisible();

    // Verify NOT on dashboard
    const onboardHeading = this.page.getByRole('heading', { name: 'Onboard' });
    const isOnboardVisible = await onboardHeading.isVisible({ timeout: 2000 }).catch(() => false);
    this.expect(isOnboardVisible).toBe(false);

    console.log('✓ Login correctly failed with invalid credentials');
  }

  async testEmptyFields(environment, scenario = 'both') {
    await this.navigateTo(environment);
    await this.acceptCookieConsent();

    // Handle different scenarios
    if (scenario === 'both') {
      // Clear both fields
      await this.emailField.click();
      await this.emailField.clear();
      await this.passwordField.click();
      await this.passwordField.clear();
    } else if (scenario === 'email') {
      // Email empty, password filled
      await this.emailField.click();
      await this.emailField.clear();
      await this.fillPassword('TestPassword123!');
    } else if (scenario === 'password') {
      // Email filled, password empty
      await this.fillEmail('test@example.com');
      await this.passwordField.click();
      await this.passwordField.clear();
    }

    // Try to submit
    const isDisabledBefore = await this.signInButton.isDisabled().catch(() => false);
    await this.signInButton.click({ force: true });
    await this.page.waitForTimeout(2000);

    // Check for validation
    const validationChecks = await this.checkValidationIndicators(scenario);

    // Verify still on login page
    await this.expect(this.emailField).toBeVisible({ timeout: 5000 });
    const onLoginPage = await this.emailField.isVisible().catch(() => false);
    this.expect(onLoginPage).toBe(true);

    console.log(`✓ Empty fields validation test completed (${scenario})`);
    console.log(`  Button disabled state: ${isDisabledBefore}`);
    console.log(`  Validation indicators found: ${validationChecks.found}`);

    return validationChecks;
  }

  async checkValidationIndicators(context) {
    const validationSelectors = [
      'text=/required/i',
      'text=/must.*filled/i',
      'text=/cannot.*empty/i',
      'text=/field.*required/i',
      'text=/enter.*email/i',
      'text=/enter.*password/i',
      'text=/please.*provide/i',
      '[role="alert"]',
      '.error-message',
      '.validation-error',
      '.field-error',
      '.error',
      '.invalid-feedback',
      '.text-danger',
      'span[class*="error"]',
      'div[class*="error"]',
      'p[class*="error"]',
      'input:invalid'
    ];

    const messages = [];
    let found = false;

    // Check for text-based validation messages
    for (const selector of validationSelectors) {
      try {
        const elements = this.page.locator(selector);
        const count = await elements.count();

        for (let i = 0; i < count; i++) {
          const element = elements.nth(i);
          const isVisible = await element.isVisible({ timeout: 1000 }).catch(() => false);

          if (isVisible) {
            const text = await element.textContent().catch(() => '');
            if (text.trim()) {
              messages.push(text.trim());
              found = true;
            }
          }
        }
      } catch (error) {
        continue;
      }
    }

    // Check for HTML5 validation
    try {
      if (context === 'both' || context === 'email') {
        const emailValidation = await this.emailField.evaluate(el => el.validationMessage).catch(() => '');
        if (emailValidation) {
          messages.push(`Email validation: ${emailValidation}`);
          found = true;
        }
      }

      if (context === 'both' || context === 'password') {
        const passwordValidation = await this.passwordField.evaluate(el => el.validationMessage).catch(() => '');
        if (passwordValidation) {
          messages.push(`Password validation: ${passwordValidation}`);
          found = true;
        }
      }
    } catch (error) {
      // Validation message check failed
    }

    // Check for visual indicators (error classes)
    try {
      const inputs = await this.page.locator('input[type="text"], input[type="password"], input[type="email"]').all();
      for (const input of inputs) {
        const isVisible = await input.isVisible().catch(() => false);
        if (isVisible) {
          const classList = await input.getAttribute('class').catch(() => '');
          const hasErrorClass = /error|invalid|danger/i.test(classList);

          if (hasErrorClass) {
            const ariaLabel = await input.getAttribute('aria-label').catch(() => '');
            messages.push(`Visual error indicator on: ${ariaLabel}`);
            found = true;
          }
        }
      }
    } catch (error) {
      // Visual indicator check failed
    }

    return { found, messages };
  }
}
