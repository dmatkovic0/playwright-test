import { BasePage } from '../BasePage.js';

export class SidebarAndNavbarAT extends BasePage {
  constructor(page, expect = null) {
    super(page, expect);

    // Navbar locators
    this.logoutButton = page.locator("//a[normalize-space()='Logout']");
    this.menuButton = page.locator("//button[@class='menu-toggle']");

    // Sidebar menu options
    this.employersLink = page.locator("//a[normalize-space()='Employers']");
    this.usersLink = page.locator("//a[normalize-space()='Users']");
    this.notificationsLink = page.locator("//a[normalize-space()='Notifications']");
  }

  // ===========================================
  // MENU TOGGLE METHODS
  // ===========================================

  /**
   * Click menu button to open sidebar
   */
  async openMenu() {
    await this.menuButton.click();
    await this.page.waitForTimeout(500);
    console.log('✓ Sidebar menu opened');
  }

  /**
   * Check if menu is visible
   * @returns {boolean} True if menu is visible
   */
  async isMenuVisible() {
    return await this.menuButton.isVisible({ timeout: 5000 }).catch(() => false);
  }

  // ===========================================
  // NAVIGATION METHODS
  // ===========================================

  /**
   * Navigate to Employers page
   */
  async goToEmployers() {
    await this.employersLink.click();
    await this.page.waitForTimeout(1500);
    console.log('✓ Navigated to Employers page');
  }

  /**
   * Navigate to Users page
   */
  async goToUsers() {
    await this.usersLink.click();
    await this.page.waitForTimeout(1500);
    console.log('✓ Navigated to Users page');
  }

  /**
   * Navigate to Notifications page
   */
  async goToNotifications() {
    await this.notificationsLink.click();
    await this.page.waitForTimeout(1500);
    console.log('✓ Navigated to Notifications page');
  }

  // ===========================================
  // COMBINED WORKFLOW METHODS
  // ===========================================

  /**
   * Open menu and navigate to Employers
   */
  async openMenuAndGoToEmployers() {
    await this.openMenu();
    await this.goToEmployers();
  }

  /**
   * Open menu and navigate to Users
   */
  async openMenuAndGoToUsers() {
    await this.openMenu();
    await this.goToUsers();
  }

  /**
   * Open menu and navigate to Notifications
   */
  async openMenuAndGoToNotifications() {
    await this.openMenu();
    await this.goToNotifications();
  }

  // ===========================================
  // LOGOUT METHODS
  // ===========================================

  /**
   * Click logout button
   */
  async logout() {
    await this.logoutButton.click();
    await this.page.waitForTimeout(2000);
    console.log('✓ Logged out successfully');
  }

  /**
   * Verify logout button is visible
   * @returns {boolean} True if logout button is visible
   */
  async isLogoutButtonVisible() {
    return await this.logoutButton.isVisible({ timeout: 5000 }).catch(() => false);
  }

  // ===========================================
  // HELPER METHODS
  // ===========================================

  /**
   * Get menu button element
   * @returns {Locator} Menu button
   */
  getMenuButton() {
    return this.menuButton;
  }

  /**
   * Get logout button element
   * @returns {Locator} Logout button
   */
  getLogoutButton() {
    return this.logoutButton;
  }

  /**
   * Get Employers link element
   * @returns {Locator} Employers link
   */
  getEmployersLink() {
    return this.employersLink;
  }

  /**
   * Get Users link element
   * @returns {Locator} Users link
   */
  getUsersLink() {
    return this.usersLink;
  }

  /**
   * Get Notifications link element
   * @returns {Locator} Notifications link
   */
  getNotificationsLink() {
    return this.notificationsLink;
  }
}
