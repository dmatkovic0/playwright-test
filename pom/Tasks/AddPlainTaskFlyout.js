import { BasePage } from '../BasePage.js';

export class AddPlainTaskFlyout extends BasePage {
  constructor(page, expect = null) {
    super(page, expect);

    // Flyout container
    this.plainTaskForm = page.locator('.aut-area-checklistItemEditor');

    // ----- Header -----
    this.addTaskTitle  = page.locator('.aut-area-checklistItemEditor .aut-label-title');
    this.cancelButton  = page.locator('.aut-area-checklistItemEditor .aut-button-cancel');
    this.saveButton    = page.locator('.aut-area-checklistItemEditor .aut-button-save');

    // ----- Task Name -----
    this.taskNameInput = page.locator('.aut-input-taskTitle');

    // ----- Assigned To -----
    this.assignedToDropdown          = page.locator('.aut-dropdown-optionList.aut-dropdown-assignedTo');
    this.assignedToEmployee          = page.locator('.aut-button-employeeOption');
    this.assignedToEmployeeMgr       = page.locator(".aut-button-employee\\'smanagerOption");
    this.assignedToManagerMgr        = page.locator(".aut-button-manager\\'smanagerOption");
    this.assignedToHrAdmins          = page.locator('.aut-button-hradminsOption');
    this.assignedToHrUsers           = page.locator('.aut-button-hrusersOption');
    this.assignedToHrOperations      = page.locator('.aut-button-hroperationsOption');
    this.assignedToItUsers           = page.locator('.aut-button-itusersOption');
    this.assignedToItOperations      = page.locator('.aut-button-itoperationsOption');
    this.assignedToSpecificEmployee  = page.locator('.aut-button-specificemployeeOption');
    this.assignedToSpecificGroup     = page.locator('.aut-button-specificgroupOption');
    this.assignedToUpperLevelMgr     = page.locator('.aut-button-upperlevelmanagerOption');

    // ----- Due Date -----
    this.fixedDueDateInput = page.locator('.aut-input-fixedDueDate');

    // ----- Checkboxes -----
    this.optionalCheckbox           = page.locator('.aut-input-isOptionalToComplete');
    this.signatureRequiredCheckbox  = page.locator('.aut-input-shouldAcknowledgeBySignature');

    // ----- Description (accordion) -----
    this.descriptionArea    = page.locator('.aut-area-taskDescription');
    this.descriptionInput   = page.locator('.aut-input-taskDescription');
    this.descriptionIframe  = page.locator('.aut-area-content');

    // ----- File Attachment (accordion) -----
    this.fileAttachmentArea  = page.locator('.aut-area-taskAttachment');
    this.cameraUploadButton  = page.locator('.aut-button-turnOnCamera');
    this.fileInput           = page.locator('.aut-button-fileInput');

    // ----- Task Review (accordion) -----
    this.taskReviewArea         = page.locator('.aut-area-taskReview').nth(0);
    this.reviewerDropdown       = page.locator('.aut-area-taskReview .aut-dropdown-optionList');
    this.reviewDueDateLabel     = page.locator('.aut-label-setDueDate');
    this.reviewDueDaysInput     = page.locator('.aut-input-dueDays');
    this.dueDateTypeArea        = page.locator('.aut-area-dueDateType');
    this.dueDateTypeDaysOption  = page.locator('.aut-button-daysOption');
    this.dueDateTypeWeeksOption = page.locator('.aut-button-weeksOption');
    this.dueDateTypeMonthsOption = page.locator('.aut-button-monthsOption');
    this.dueDateDirectionArea   = page.locator('.aut-area-dueDateDirectionType');
    this.afterPreviousStepOption = page.locator('.aut-button-afterpreviousstepOption');

    // ----- Notifications (accordion) -----
    this.notificationsToggle  = page.locator('.aut-button-notifications');
    this.emailNotifCheckbox   = page.locator('.aut-input-emailAlertType');
    this.smsNotifCheckbox     = page.locator('.aut-input-smsAlertType');

    // ----- Watchers (accordion) -----
    this.watchersArea     = page.locator('.aut-area-taskReview').nth(1);
    this.watchersDropdown = page.locator('.aut-area-taskReview').nth(1).locator('.aut-dropdown-optionList');

    // ----- Task Completed Email (accordion) -----
    this.taskCompletedEmailArea     = page.locator('.aut-area-taskReview').nth(2);
    this.taskCompletedEmailDropdown = page.locator('.aut-area-taskReview').nth(2).locator('.aut-dropdown-optionList');
  }

  // ===========================================
  // HEADER METHODS
  // ===========================================

  /**
   * Cancel and close the flyout
   */
  async cancel() {
    await this.cancelButton.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Save the task
   */
  async save() {
    await this.saveButton.click();
    await this.page.waitForTimeout(500);
  }

  // ===========================================
  // TASK NAME METHODS
  // ===========================================

  /**
   * Fill in the task name
   * @param {string} name - Task name
   */
  async fillTaskName(name) {
    await this.taskNameInput.fill(name);
    await this.page.waitForTimeout(300);
  }

  // ===========================================
  // ASSIGNED TO METHODS
  // ===========================================

  /**
   * Open the Assigned To dropdown
   */
  async openAssignedToDropdown() {
    await this.assignedToDropdown.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Assign to Employee
   */
  async selectAssignedToEmployee() {
    await this.openAssignedToDropdown();
    await this.assignedToEmployee.click();
    await this.page.waitForTimeout(300);
  }

  /**
   * Assign to Employee's Manager
   */
  async selectAssignedToEmployeeMgr() {
    await this.openAssignedToDropdown();
    await this.assignedToEmployeeMgr.click();
    await this.page.waitForTimeout(300);
  }

  /**
   * Assign to Manager's Manager
   */
  async selectAssignedToManagerMgr() {
    await this.openAssignedToDropdown();
    await this.assignedToManagerMgr.click();
    await this.page.waitForTimeout(300);
  }

  /**
   * Assign to HR Admins
   */
  async selectAssignedToHrAdmins() {
    await this.openAssignedToDropdown();
    await this.assignedToHrAdmins.click();
    await this.page.waitForTimeout(300);
  }

  /**
   * Assign to HR Users
   */
  async selectAssignedToHrUsers() {
    await this.openAssignedToDropdown();
    await this.assignedToHrUsers.click();
    await this.page.waitForTimeout(300);
  }

  /**
   * Assign to HR Operations
   */
  async selectAssignedToHrOperations() {
    await this.openAssignedToDropdown();
    await this.assignedToHrOperations.click();
    await this.page.waitForTimeout(300);
  }

  /**
   * Assign to IT Users
   */
  async selectAssignedToItUsers() {
    await this.openAssignedToDropdown();
    await this.assignedToItUsers.click();
    await this.page.waitForTimeout(300);
  }

  /**
   * Assign to IT Operations
   */
  async selectAssignedToItOperations() {
    await this.openAssignedToDropdown();
    await this.assignedToItOperations.click();
    await this.page.waitForTimeout(300);
  }

  /**
   * Assign to a Specific Employee
   */
  async selectAssignedToSpecificEmployee() {
    await this.openAssignedToDropdown();
    await this.assignedToSpecificEmployee.click();
    await this.page.waitForTimeout(300);
  }

  /**
   * Assign to a Specific Group
   */
  async selectAssignedToSpecificGroup() {
    await this.openAssignedToDropdown();
    await this.assignedToSpecificGroup.click();
    await this.page.waitForTimeout(300);
  }

  /**
   * Assign to Upper Level Manager
   */
  async selectAssignedToUpperLevelMgr() {
    await this.openAssignedToDropdown();
    await this.assignedToUpperLevelMgr.click();
    await this.page.waitForTimeout(300);
  }

  // ===========================================
  // DUE DATE METHODS
  // ===========================================

  /**
   * Fill the fixed due date
   * @param {string} date - Date in MM/DD/YYYY format
   */
  async fillFixedDueDate(date) {
    await this.fixedDueDateInput.fill(date);
    await this.fixedDueDateInput.press('Enter');
    await this.page.waitForTimeout(300);
  }

  /**
   * Select a date via the calendar picker by clicking the day link.
   * Used when the date field opens a calendar instead of accepting free text.
   * @param {string|number} dayNumber - Day of the month to click (e.g. '17')
   */
  async selectDateByCalendar(dayNumber) {
    await this.fixedDueDateInput.click();
    await this.page.waitForTimeout(500);
    await this.page.getByRole('link', { name: dayNumber.toString() }).click();
    await this.page.waitForTimeout(500);
  }

  // ===========================================
  // CHECKBOX METHODS
  // ===========================================

  /**
   * Toggle the Optional to Complete checkbox
   */
  async checkOptional() {
    await this.optionalCheckbox.click();
    await this.page.waitForTimeout(300);
  }

  /**
   * Toggle the Signature Required checkbox
   */
  async checkSignatureRequired() {
    await this.signatureRequiredCheckbox.click();
    await this.page.waitForTimeout(300);
  }

  // ===========================================
  // TASK REVIEW METHODS
  // ===========================================

  /**
   * Fill the review due days input
   * @param {string} days - Number of days
   */
  async fillReviewDueDays(days) {
    await this.reviewDueDaysInput.fill(days);
    await this.page.waitForTimeout(300);
  }

  /**
   * Select Days as the due date type
   */
  async selectDueDateTypeDays() {
    await this.dueDateTypeDaysOption.click();
    await this.page.waitForTimeout(300);
  }

  /**
   * Select Weeks as the due date type
   */
  async selectDueDateTypeWeeks() {
    await this.dueDateTypeWeeksOption.click();
    await this.page.waitForTimeout(300);
  }

  /**
   * Select Months as the due date type
   */
  async selectDueDateTypeMonths() {
    await this.dueDateTypeMonthsOption.click();
    await this.page.waitForTimeout(300);
  }

  /**
   * Select After Previous Step as the due date direction
   */
  async selectAfterPreviousStep() {
    await this.afterPreviousStepOption.click();
    await this.page.waitForTimeout(300);
  }

  // ===========================================
  // NOTIFICATIONS METHODS
  // ===========================================

  /**
   * Toggle the notifications section
   */
  async toggleNotifications() {
    await this.notificationsToggle.click();
    await this.page.waitForTimeout(300);
  }

  /**
   * Toggle the Email notification checkbox
   */
  async checkEmailNotification() {
    await this.emailNotifCheckbox.click();
    await this.page.waitForTimeout(300);
  }

  /**
   * Toggle the SMS notification checkbox
   */
  async checkSmsNotification() {
    await this.smsNotifCheckbox.click();
    await this.page.waitForTimeout(300);
  }
}
