import { test, expect } from '@playwright/test';
import { login } from '../src/utils.js';

test('test', async ({ page }) => {
  await login('stg', 'hr2admin222@mail.com', 'Password123!!', page);
  
  await page.getByRole('link', { name: 'People' }).click();
});