// Environment URLs
const ENVIRONMENTS = {
  qa: 'https://corehr.qa.hrcloud.net/Start/#/Authentication/Login?returnUrl=',
  stg: 'https://corehr.staging.hrcloud.net/Start/#/Authentication/Login?returnUrl=',
  prod: 'https://corehr.hrcloud.com/Start/#/Authentication/Login'
};

// Generate a unique identifier (GUID)
export function generateGUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Generate a short unique identifier (for names)
export function generateShortID() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// Ensure sidebar is expanded
export async function ensureSidebarExpanded(page) {
  const sidebarOverlay = page.locator('.utility-navigation-tour-overlay');
  const isExpanded = await sidebarOverlay.evaluate(el => el.classList.contains('utility-sidebar-open-navigation-tour-overlay'));
  
  if (!isExpanded) {
    console.log('Sidebar is collapsed, expanding...');
    await page.locator('//div[@class="menu-arrow-button tooltipstered"]//i[@class="icon icon-chevron-right"]').click();
    await page.waitForTimeout(500); // Wait for sidebar animation
  } else {
    console.log('Sidebar is already expanded');
  }
}

// Open People page and verify
export async function openPeople(page, expect) {
  await page.getByRole('link', { name: 'People' }).click();
  await expect(page.getByRole('heading').getByText('People')).toBeVisible();
}

export async function login(env, username, password, page) {
  // Normalize environment to lowercase
  const environment = env.toLowerCase();
  
  // Get the URL for the specified environment
  const url = ENVIRONMENTS[environment];
  
  if (!url) {
    throw new Error(`Invalid environment: ${env}. Valid options are: qa, stg, prod`);
  }
  
  // Navigate to login page with retry logic
  let retries = 3;
  while (retries > 0) {
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      break;
    } catch (error) {
      retries--;
      if (retries === 0) throw error;
      console.log(`Navigation failed, retrying... (${retries} attempts left)`);
      await page.waitForTimeout(2000);
    }
  }
  
  // Handle cookie consent popup in iframe
  await page.getByRole('textbox', { name: 'Enter Account Email or Phone' }).dblclick();
  await page.locator('#custom-login-container iframe').contentFrame().getByRole('button', { name: 'Accept' }).click();
  
  // Fill in login credentials
  await page.getByRole('textbox', { name: 'Enter Account Email or Phone' }).click();
  await page.getByRole('textbox', { name: 'Enter Account Email or Phone' }).fill(username);
  await page.getByRole('textbox', { name: 'Enter Password' }).click();
  await page.getByRole('textbox', { name: 'Enter Password' }).fill(password);
  
  // Submit login form
  await page.getByRole('button', { name: 'Sign In Securely' }).click();
  
  // Close chat widget welcome message
  await page.locator('[data-test-id="chat-widget-iframe"]').contentFrame().locator('[data-test-id="ai-welcome-msg-close-button"]').click();
}