import { test, expect } from '@playwright/test';
import {
  testLoginWithValidCredentials,
  testLoginWithInvalidCredentials,
  testLoginWithBothFieldsEmpty,
  testLoginWithEmailEmpty,
  testLoginWithPasswordEmpty
} from '../src/login/loginTests.js';

test('should successfully login with valid credentials', async ({ page }) => {
  // Increase timeout for this test
  test.setTimeout(60000);

  await testLoginWithValidCredentials(page, expect);
});

test('should fail login with invalid credentials', async ({ page }) => {
  // Increase timeout for this test
  test.setTimeout(60000);

  await testLoginWithInvalidCredentials(page, expect);
});

test('should prevent login when both email and password fields are empty', async ({ page }) => {
  // Increase timeout for this test
  test.setTimeout(60000);

  await testLoginWithBothFieldsEmpty(page, expect);
});

test('should show validation error when email is empty but password is filled', async ({ page }) => {
  // Increase timeout for this test
  test.setTimeout(60000);

  await testLoginWithEmailEmpty(page, expect);
});

test('should show validation error when password is empty but email is filled', async ({ page }) => {
  // Increase timeout for this test
  test.setTimeout(60000);

  await testLoginWithPasswordEmpty(page, expect);
});
