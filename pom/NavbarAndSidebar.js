import { BasePage } from './PeopleApp/BasePage.js';

export class NavbarAndSidebar extends BasePage {
  constructor(page, expect = null) {
    super(page, expect);

    // ===========================================
    // SIDEBAR LOCATORS
    // ===========================================

    // ── Container ──
    this.sidebarContainer = page.locator('#sidebar-container');
    this.sideNavigationComponent = page.locator('side-navigation');
    this.sidebarPanel = page.locator('.utility-sidebar.pull-left');

    // ── Logo ──
    this.logo = page.locator('logo-button .logo');

    // ── Workmates ──
    this.workmatesLink = page.locator('.highlighted-link a[href="#/Workmates"]');
    this.workmatesCaretIcon = page.locator('.highlighted-link .icon-caret-right');

    // ── Utility Navigation Links (Quick Access) ──
    this.tasksLink = page.locator('a.aut-button-myTasks');
    this.tasksBadge = page.locator('.utility-navigation-tour-tasks .badge');
    this.chatLink = page.locator('a.aut-button-chat');
    this.calendarLink = page.locator('a[href="#/Calendar"]');
    this.directoryLink = page.locator('.utility-navigation-tour-directory a');
    this.filesLink = page.locator('.utility-navigation-tour-files a');
    this.smartFlowsLink = page.locator('a[href="#/Checklists"]');
    this.reportsLink = page.locator('a[href="#/Reports/Overview"]');
    this.surveysLink = page.locator('a[href="#/SurveyApp"]');
    this.settingsLink = page.locator('a[href="#/Settings"]');

    // ── Applications Section ──
    this.applicationsSubtitle = page.locator('.side-navigation-subtitle');
    this.peopleLink = page.locator('a.applications-link[href="#/CoreHr/People"]');
    this.recruitLink = page.locator('a.applications-link[href="#/Recruit/Applicants"]');
    this.onboardLink = page.locator('a.applications-link[href="#/Portal/onboard/People"]');
    this.shiftPlannerLink = page.locator('a.applications-link[href="#/ShiftPlanner/Schedule"]');
    this.timeClockLink = page.locator('a.applications-link[href="#/TimeClock/Overview"]');
    this.timeOffLink = page.locator('a.applications-link[href="#/TimeOff/Overview"]');
    this.performLink = page.locator('a.applications-link[href="#/Perform/People"]');
    this.kudosLink = page.locator('a.applications-link[href*="KudosApp/Overview"]');
    this.assetsLink = page.locator('a.applications-link[href="#/Assets/List"]');
    this.benefitsLink = page.locator('a.applications-link[href="#/Portal/benefits/People"]');
    this.offboardLink = page.locator('a.applications-link[href="#/Portal/offboard/People"]');
    this.exploreAppsLink = page.locator('a.applications-link[href="#/exploreapps"]');

    // ── Channels Section ──
    this.channelsContainer = page.locator('.channel-navigation.pull-left');
    this.channelsBackArrow = page.locator('.channel-navigation .icon-caret-left');
    this.companyFeedLink = page.locator('a.btn-channels.channels-widget');
    this.discoverChannelsLink = page.locator('a.btn-discover.channels-widget');

    // ── Sidebar Collapse ──
    this.arrowContainer = page.locator('.arrow-container');
    this.collapseExpandButton = page.locator('.arrow-container menu-button .menu-arrow-button');

    // ===========================================
    // NAVBAR LOCATORS
    // ===========================================

    // ── Container ──
    this.utilityBarContainer = page.locator('#utility-bar-container');
    this.utilityBarComponent = page.locator('utility-bar');
    this.utilityBarInner = page.locator('.utility-bar');

    // ── Left Section ──
    this.sidebarToggleButton = page.locator('.sidebar-toggle .btn-mobile-menu');
    this.pageTitle = page.locator('.utility-bar-page-title');
    this.homeDashboardLink = page.locator('.utility-navigation-tour-dashboard');

    // ── Announcement Section (Middle) ──
    this.announcementContainer = page.locator('.utility-bar-notification');
    this.announcementCloseButton = page.locator('.utility-bar-notification .icon-close');
    this.announcementMoreDetailLink = page.locator('.utility-bar-notification a.link-in-text');
    this.announcementCountBadge = page.locator('.utility-bar-notification .total-count');

    // ── Right Section ──
    this.globalSearchInput = page.locator('.utility-navigation-tour-global-search input.search-input-element');
    this.quickActionsButton = page.locator('quick-actions-utility-bar-button.dropdown-toggle');
    this.helpDropdown = page.locator('help-utility-bar-button.dropdown-toggle');
    this.notificationsDropdown = page.locator('notifications-utility-bar-button.dropdown-toggle');
    this.timeClockDropdown = page.locator('.utility-navigation-tour-time-clock .dropdown-toggle');
    this.userProfileAvatar = page.locator('.utility-navigation-tour-usermenu a img');
    this.userProfileDropdown = page.locator('.utility-navigation-tour-usermenu .dropdown-toggle');

    // ── Help Dropdown Items ──
    this.helpCenterLink = page.locator('a[href*="support.hrcloud.com/help-center"]');
    this.submitIdeaLink = page.locator('a[href*="forms.gle"]');
    this.referAndEarnLink = page.locator('a[href*="refer-and-earn"]');
    this.privacyPolicyLink = page.locator('a[href*="PrivacyPolicy"]');

    // ── User Profile Dropdown Items ──
    this.userNameHeading = page.locator('.utility-navigation-tour-usermenu h4');
    this.myProfileLink = page.locator('a[href*="Employee/Detail"]');
    this.myFavoritesLink = page.locator('a[href="#/MyFavorites/People"]');
    this.mySettingsLink = page.locator('a[href="#/AccountSettings"]');
    this.helpLink = page.locator('a[href="#/Help"]');
    this.signOutButton = page.locator('.utility-navigation-tour-usermenu li:last-child');
  }

  // ===========================================
  // SIDEBAR NAVIGATION METHODS
  // ===========================================

  /**
   * Navigate to Workmates page
   */
  async goToWorkmates() {
    await this.workmatesLink.click();
    await this.page.waitForTimeout(1500);
  }

  /**
   * Navigate to Tasks page
   */
  async goToTasks() {
    await this.tasksLink.click();
    await this.page.waitForTimeout(1500);
  }

  /**
   * Navigate to Chat page
   */
  async goToChat() {
    await this.chatLink.click();
    await this.page.waitForTimeout(1500);
  }

  /**
   * Navigate to Calendar page
   */
  async goToCalendar() {
    await this.calendarLink.click();
    await this.page.waitForTimeout(1500);
  }

  /**
   * Navigate to Directory page
   */
  async goToDirectory() {
    await this.directoryLink.click();
    await this.page.waitForTimeout(1500);
  }

  /**
   * Navigate to Files page
   */
  async goToFiles() {
    await this.filesLink.click();
    await this.page.waitForTimeout(1500);
  }

  /**
   * Navigate to SmartFlows page
   */
  async goToSmartFlows() {
    await this.smartFlowsLink.click();
    await this.page.waitForTimeout(1500);
  }

  /**
   * Navigate to Reports page
   */
  async goToReports() {
    await this.reportsLink.click();
    await this.page.waitForTimeout(1500);
  }

  /**
   * Navigate to Surveys page
   */
  async goToSurveys() {
    await this.surveysLink.click();
    await this.page.waitForTimeout(1500);
  }

  /**
   * Navigate to Settings page
   */
  async goToSettings() {
    await this.settingsLink.click();
    await this.page.waitForTimeout(1500);
  }

  /**
   * Navigate to People app
   */
  async goToPeople() {
    await this.peopleLink.click();
    await this.page.waitForTimeout(1500);
  }

  /**
   * Navigate to People app and verify page loaded
   */
  async goToPeopleAndVerify() {
    await this.peopleLink.click();
    if (this.expect) {
      await this.expect(this.page.getByRole('heading').getByText('People')).toBeVisible();
    }
    await this.page.waitForTimeout(1500);
  }

  /**
   * Navigate to Recruit app
   */
  async goToRecruit() {
    await this.recruitLink.click();
    await this.page.waitForTimeout(1500);
  }

  /**
   * Navigate to Onboard app
   */
  async goToOnboard() {
    await this.onboardLink.click();
    await this.page.waitForTimeout(1500);
  }

  /**
   * Navigate to Shift Planner app
   */
  async goToShiftPlanner() {
    await this.shiftPlannerLink.click();
    await this.page.waitForTimeout(1500);
  }

  /**
   * Navigate to Time Clock app
   */
  async goToTimeClock() {
    await this.timeClockLink.click();
    await this.page.waitForTimeout(1500);
  }

  /**
   * Navigate to Time Off app
   */
  async goToTimeOff() {
    await this.timeOffLink.click();
    await this.page.waitForTimeout(1500);
  }

  /**
   * Navigate to Perform app
   */
  async goToPerform() {
    await this.performLink.click();
    await this.page.waitForTimeout(1500);
  }

  /**
   * Navigate to Kudos app
   */
  async goToKudos() {
    await this.kudosLink.click();
    await this.page.waitForTimeout(1500);
  }

  /**
   * Navigate to Assets app
   */
  async goToAssets() {
    await this.assetsLink.click();
    await this.page.waitForTimeout(1500);
  }

  /**
   * Navigate to Benefits app
   */
  async goToBenefits() {
    await this.benefitsLink.click();
    await this.page.waitForTimeout(1500);
  }

  /**
   * Navigate to Offboard app
   */
  async goToOffboard() {
    await this.offboardLink.click();
    await this.page.waitForTimeout(1500);
  }

  /**
   * Navigate to Explore Apps page
   */
  async goToExploreApps() {
    await this.exploreAppsLink.click();
    await this.page.waitForTimeout(1500);
  }

  /**
   * Collapse or expand the sidebar
   */
  async toggleSidebar() {
    await this.collapseExpandButton.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Ensure sidebar is expanded (check state first)
   */
  async ensureSidebarExpanded() {
    try {
      const sidebarOverlay = this.page.locator('.utility-navigation-tour-overlay');

      // Wait for the element to be present before evaluating
      await sidebarOverlay.waitFor({ state: 'attached', timeout: 5000 });

      const isExpanded = await sidebarOverlay.evaluate(el => el.classList.contains('utility-sidebar-open-navigation-tour-overlay'));

      if (!isExpanded) {
        console.log('Sidebar is collapsed, expanding...');
        await this.page.locator('//div[@class="menu-arrow-button tooltipstered"]//i[@class="icon icon-chevron-right"]').click();
        await this.page.waitForTimeout(500); // Wait for sidebar animation
      } else {
        console.log('Sidebar is already expanded');
      }
    } catch (error) {
      console.log('Could not verify sidebar state, continuing anyway...', error.message);
    }
  }

  /**
   * Get the current task count from badge
   * @returns {Promise<string>} Task count as string
   */
  async getTaskCount() {
    return await this.tasksBadge.textContent();
  }

  // ===========================================
  // NAVBAR METHODS
  // ===========================================

  /**
   * Close announcement banner
   */
  async closeAnnouncement() {
    await this.announcementCloseButton.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Click on announcement "more detail" link
   */
  async clickAnnouncementDetails() {
    await this.announcementMoreDetailLink.click();
    await this.page.waitForTimeout(1500);
  }

  /**
   * Search using global search
   * @param {string} searchTerm - Text to search for
   */
  async globalSearch(searchTerm) {
    await this.globalSearchInput.click();
    await this.globalSearchInput.fill(searchTerm);
    await this.globalSearchInput.press('Enter');
    await this.page.waitForTimeout(1500);
  }

  /**
   * Open Quick Actions dropdown
   */
  async openQuickActions() {
    await this.quickActionsButton.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Open Help dropdown
   */
  async openHelpDropdown() {
    await this.helpDropdown.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Open Notifications dropdown
   */
  async openNotifications() {
    await this.notificationsDropdown.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Open Time Clock dropdown
   */
  async openTimeClock() {
    await this.timeClockDropdown.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Open User Profile dropdown
   */
  async openUserProfile() {
    await this.userProfileDropdown.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Navigate to My Profile page
   */
  async goToMyProfile() {
    await this.openUserProfile();
    await this.myProfileLink.click();
    await this.page.waitForTimeout(1500);
  }

  /**
   * Navigate to My Favorites page
   */
  async goToMyFavorites() {
    await this.openUserProfile();
    await this.myFavoritesLink.click();
    await this.page.waitForTimeout(1500);
  }

  /**
   * Navigate to My Settings page
   */
  async goToMySettings() {
    await this.openUserProfile();
    await this.mySettingsLink.click();
    await this.page.waitForTimeout(1500);
  }

  /**
   * Sign out of the application
   */
  async signOut() {
    await this.openUserProfile();
    await this.signOutButton.click();
    await this.page.waitForTimeout(1500);
  }

  /**
   * Get current page title from navbar
   * @returns {Promise<string>} Page title
   */
  async getPageTitle() {
    return await this.pageTitle.textContent();
  }
}
