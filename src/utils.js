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

// Generate a random date within the last N days (default: 30 days)
// Returns date in MM/DD/YYYY format
export function generateRandomPastDate(daysBack = 30) {
  const today = new Date();
  const randomDaysAgo = Math.floor(Math.random() * daysBack);
  const randomDate = new Date(today);
  randomDate.setDate(today.getDate() - randomDaysAgo);

  const month = String(randomDate.getMonth() + 1).padStart(2, '0');
  const day = String(randomDate.getDate()).padStart(2, '0');
  const year = randomDate.getFullYear();

  return `${month}/${day}/${year}`;
}

// Ensure sidebar is expanded
export async function ensureSidebarExpanded(page) {
  try {
    const sidebarOverlay = page.locator('.utility-navigation-tour-overlay');

    // Wait for the element to be present before evaluating
    await sidebarOverlay.waitFor({ state: 'attached', timeout: 5000 });

    const isExpanded = await sidebarOverlay.evaluate(el => el.classList.contains('utility-sidebar-open-navigation-tour-overlay'));

    if (!isExpanded) {
      console.log('Sidebar is collapsed, expanding...');
      await page.locator('//div[@class="menu-arrow-button tooltipstered"]//i[@class="icon icon-chevron-right"]').click();
      await page.waitForTimeout(500); // Wait for sidebar animation
    } else {
      console.log('Sidebar is already expanded');
    }
  } catch (error) {
    console.log('Could not verify sidebar state, continuing anyway...', error.message);
  }
}

// Open People page and verify
export async function openPeople(page, expect) {
  await page.getByRole('link', { name: 'People' }).click();
  await expect(page.getByRole('heading').getByText('People')).toBeVisible();
}