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