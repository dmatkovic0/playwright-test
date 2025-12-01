import { test, expect } from '@playwright/test';
import { LoginPage } from '../pom/LoginPage.js';
import { login1 } from '../src/loginInfo/loginInfo.js';

test('should successfully login with valid credentials', async ({ page }) => {
  // Increase timeout for this test
  test.setTimeout(60000);

  const loginPage = new LoginPage(page, expect);
  await loginPage.loginAndVerifySuccess(login1.environment, login1.email, login1.password);
});

test('should fail login with invalid credentials', async ({ page }) => {
  // Increase timeout for this test
  test.setTimeout(60000);

  const loginPage = new LoginPage(page, expect);
  await loginPage.loginWithInvalidCredentials('stg');
});

test('should prevent login when both email and password fields are empty', async ({ page }) => {
  // Increase timeout for this test
  test.setTimeout(60000);

  const loginPage = new LoginPage(page, expect);
  await loginPage.testEmptyFields('stg', 'both');
});

test('should show validation error when email is empty but password is filled', async ({ page }) => {
  // Increase timeout for this test
  test.setTimeout(60000);

  const loginPage = new LoginPage(page, expect);
  await loginPage.testEmptyFields('stg', 'email');
});

test('should show validation error when password is empty but email is filled', async ({ page }) => {
  // Increase timeout for this test
  test.setTimeout(60000);

  const loginPage = new LoginPage(page, expect);
  await loginPage.testEmptyFields('stg', 'password');
});
