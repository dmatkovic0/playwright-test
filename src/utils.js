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

export async function login(env, username, password, page) {
  // Normalize environment to lowercase
  const environment = env.toLowerCase();
  
  // Get the URL for the specified environment
  const url = ENVIRONMENTS[environment];
  
  if (!url) {
    throw new Error(`Invalid environment: ${env}. Valid options are: qa, stg, prod`);
  }
  
  // Navigate to login page
  await page.goto(url);
  
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