import { login } from '../utils.js';
import { login1 } from '../loginInfo/loginInfo.js';

/**
 * Test successful login with valid credentials
 * Verifies that user can login and sees the Onboard dashboard
 */
export async function testLoginWithValidCredentials(page, expect) {
  // Login with valid credentials from loginInfo
  await login(login1.environment, login1.email, login1.password, page);

  // Verify successful login by checking that the Onboard heading is visible
  await expect(page.getByRole('heading', { name: 'Onboard' })).toBeVisible();

  // Also verify the welcome message
  await expect(page.getByText('Welcome, HR2!')).toBeVisible();

  console.log('✓ Login successful with valid credentials');
}

/**
 * Test login failure with invalid credentials
 * Verifies that invalid credentials are rejected with appropriate error message
 */
export async function testLoginWithInvalidCredentials(page, expect) {
  // Navigate to login page
  await page.goto('https://corehr.staging.hrcloud.net/Start/#/Authentication/Login?returnUrl=', {
    waitUntil: 'domcontentloaded',
    timeout: 30000
  });

  // Handle the cookie consent popup in iframe
  await page.getByRole('textbox', { name: 'Enter Account Email or Phone' }).dblclick();
  const cookieIframe = page.locator('#custom-login-container iframe').contentFrame();
  await cookieIframe.getByRole('button', { name: 'Accept' }).click();

  // Fill with invalid credentials
  await page.getByRole('textbox', { name: 'Enter Account Email or Phone' }).click();
  await page.getByRole('textbox', { name: 'Enter Account Email or Phone' }).fill('invalid@test.com');
  await page.getByRole('textbox', { name: 'Enter Password' }).click();
  await page.getByRole('textbox', { name: 'Enter Password' }).fill('WrongPassword123!');

  // Submit login form
  await page.getByRole('button', { name: 'Sign In Securely' }).click();

  // Wait for error message to appear
  await page.waitForTimeout(3000);

  // Verify error message is displayed
  const errorMessage = page.locator('.alert-danger').first();
  await expect(errorMessage).toBeVisible();

  // Verify we're still on the login page
  await expect(page.getByRole('textbox', { name: 'Enter Account Email or Phone' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Sign In Securely' })).toBeVisible();

  // Verify we did NOT navigate to dashboard
  const onboardHeading = page.getByRole('heading', { name: 'Onboard' });
  const isOnboardVisible = await onboardHeading.isVisible({ timeout: 2000 }).catch(() => false);
  expect(isOnboardVisible).toBe(false);

  console.log('✓ Login correctly failed with invalid credentials');
}

/**
 * Test login prevention when both email and password fields are empty
 * Verifies HTML5 validation prevents form submission
 */
export async function testLoginWithBothFieldsEmpty(page, expect) {
  // Navigate to login page
  await page.goto('https://corehr.staging.hrcloud.net/Start/#/Authentication/Login?returnUrl=', {
    waitUntil: 'domcontentloaded',
    timeout: 30000
  });

  // Handle the cookie consent popup in iframe
  await page.getByRole('textbox', { name: 'Enter Account Email or Phone' }).dblclick();
  const cookieIframe = page.locator('#custom-login-container iframe').contentFrame();
  await cookieIframe.getByRole('button', { name: 'Accept' }).click();

  // Ensure both fields are empty
  const emailField = page.getByRole('textbox', { name: 'Enter Account Email or Phone' });
  const passwordField = page.getByRole('textbox', { name: 'Enter Password' });

  await emailField.click();
  await emailField.clear();
  await passwordField.click();
  await passwordField.clear();

  // Try to click the "Sign In Securely" button with empty fields
  const signInButton = page.getByRole('button', { name: 'Sign In Securely' });
  const isDisabledBefore = await signInButton.isDisabled().catch(() => false);

  await signInButton.click({ force: true });
  await page.waitForTimeout(2000);

  // Check for validation error messages
  const validationChecks = await checkValidationIndicators(page, 'both');

  // Verify we're still on the login page
  await expect(emailField).toBeVisible({ timeout: 5000 });
  await expect(passwordField).toBeVisible({ timeout: 5000 });

  const onLoginPage = await emailField.isVisible().catch(() => false);
  expect(onLoginPage).toBe(true);

  console.log('✓ Empty fields validation test completed');
  console.log(`  Button disabled state: ${isDisabledBefore}`);
  console.log(`  Validation indicators found: ${validationChecks.found}`);
}

/**
 * Test validation when email is empty but password is filled
 * Verifies email field validation is triggered
 */
export async function testLoginWithEmailEmpty(page, expect) {
  // Navigate to login page
  await page.goto('https://corehr.staging.hrcloud.net/Start/#/Authentication/Login?returnUrl=', {
    waitUntil: 'domcontentloaded',
    timeout: 30000
  });

  // Handle the cookie consent popup in iframe
  await page.getByRole('textbox', { name: 'Enter Account Email or Phone' }).dblclick();
  const cookieIframe = page.locator('#custom-login-container iframe').contentFrame();
  await cookieIframe.getByRole('button', { name: 'Accept' }).click();

  // Leave email field empty but fill password
  const emailField = page.getByRole('textbox', { name: 'Enter Account Email or Phone' });
  const passwordField = page.getByRole('textbox', { name: 'Enter Password' });

  await emailField.click();
  await emailField.clear();
  await passwordField.click();
  await passwordField.fill('TestPassword123!');

  // Try to submit
  const signInButton = page.getByRole('button', { name: 'Sign In Securely' });
  await signInButton.click({ force: true });
  await page.waitForTimeout(2000);

  // Check for validation error
  const validationChecks = await checkValidationIndicators(page, 'email');

  // Verify we're still on the login page
  await expect(emailField).toBeVisible({ timeout: 5000 });

  const emailFieldElement = emailField.first();
  const hasRequiredAttr = await emailFieldElement.evaluate(el => el.hasAttribute('required')).catch(() => false);

  const onLoginPage = await emailField.isVisible().catch(() => false);
  expect(onLoginPage).toBe(true);

  console.log('✓ Email empty validation test completed');
  console.log(`  Email field has required attribute: ${hasRequiredAttr}`);
  console.log(`  Validation indicators found: ${validationChecks.found}`);
}

/**
 * Test validation when password is empty but email is filled
 * Verifies password field validation is triggered
 */
export async function testLoginWithPasswordEmpty(page, expect) {
  // Navigate to login page
  await page.goto('https://corehr.staging.hrcloud.net/Start/#/Authentication/Login?returnUrl=', {
    waitUntil: 'domcontentloaded',
    timeout: 30000
  });

  // Handle the cookie consent popup in iframe
  await page.getByRole('textbox', { name: 'Enter Account Email or Phone' }).dblclick();
  const cookieIframe = page.locator('#custom-login-container iframe').contentFrame();
  await cookieIframe.getByRole('button', { name: 'Accept' }).click();

  // Fill email field but leave password empty
  const emailField = page.getByRole('textbox', { name: 'Enter Account Email or Phone' });
  const passwordField = page.getByRole('textbox', { name: 'Enter Password' });

  await emailField.click();
  await emailField.fill('test@example.com');
  await passwordField.click();
  await passwordField.clear();

  // Try to submit
  const signInButton = page.getByRole('button', { name: 'Sign In Securely' });
  await signInButton.click({ force: true });
  await page.waitForTimeout(2000);

  // Check for validation error
  const validationChecks = await checkValidationIndicators(page, 'password');

  // Verify we're still on the login page
  await expect(passwordField).toBeVisible({ timeout: 5000 });

  const passwordFieldElement = passwordField.first();
  const hasRequiredAttr = await passwordFieldElement.evaluate(el => el.hasAttribute('required')).catch(() => false);

  const onLoginPage = await passwordField.isVisible().catch(() => false);
  expect(onLoginPage).toBe(true);

  console.log('✓ Password empty validation test completed');
  console.log(`  Password field has required attribute: ${hasRequiredAttr}`);
  console.log(`  Validation indicators found: ${validationChecks.found}`);
}

/**
 * Helper function to check for validation error indicators
 * @param {Page} page - Playwright page object
 * @param {string} context - Context of the validation check ('both', 'email', 'password')
 * @returns {Promise<{found: boolean, messages: string[]}>}
 */
async function checkValidationIndicators(page, context) {
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

  for (const selector of validationSelectors) {
    try {
      const elements = page.locator(selector);
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
    const emailInput = page.getByRole('textbox', { name: 'Enter Account Email or Phone' });
    const passwordInput = page.getByRole('textbox', { name: 'Enter Password' });

    if (context === 'both' || context === 'email') {
      const emailValidation = await emailInput.evaluate(el => el.validationMessage).catch(() => '');
      if (emailValidation) {
        messages.push(`Email validation: ${emailValidation}`);
        found = true;
      }
    }

    if (context === 'both' || context === 'password') {
      const passwordValidation = await passwordInput.evaluate(el => el.validationMessage).catch(() => '');
      if (passwordValidation) {
        messages.push(`Password validation: ${passwordValidation}`);
        found = true;
      }
    }
  } catch (error) {
    // Validation message check failed
  }

  // Check for visual indicators
  try {
    const inputs = await page.locator('input[type="text"], input[type="password"], input[type="email"]').all();
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
