import { BasePage } from '../../BasePage.js';
import { AddPlainTaskFlyout } from '../../Tasks/AddPlainTaskFlyout.js';

export class BulkCreateTasks extends BasePage {
  constructor(page, expect = null) {
    super(page, expect);

    // Bulk Actions menu
    this.bulkActionsButton     = page.getByText('Actions');
    this.bulkCreateTasksOption = page.getByText('Bulk Create Tasks');

    // Task type selection (bulk-specific modal — different from CreateTaskFlyout)
    this.plainTaskButton        = page.getByText('Plain Task A blank, flexible');
    this.existingTaskButton     = page.getByText('Existing task from library');

    // Shared form — reuse AddPlainTaskFlyout since the same form opens after type selection
    this.plainTaskForm = new AddPlainTaskFlyout(page, expect);

    // Task library grid (shown after clicking "Existing task from library")
    // td[1]=checkbox, td[2]=detail icon, td[3]=task title
    this.taskLibraryRows = page.locator('.content-grid.mobile-show-checkbox .k-selectable tbody tr');
    this.addButton       = page.getByRole('button', { name: 'Add' });
  }

  // ===========================================
  // BULK ACTIONS MENU METHODS
  // ===========================================

  /**
   * Open the bulk Actions menu
   */
  async openBulkActionsMenu() {
    await this.bulkActionsButton.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Click the Bulk Create Tasks option in the menu
   */
  async clickBulkCreateTasks() {
    await this.bulkCreateTasksOption.click();
    await this.page.waitForTimeout(1000);
  }

  // ===========================================
  // TASK TYPE SELECTION METHODS
  // ===========================================

  /**
   * Select the Plain Task type in the task creation modal
   */
  async selectPlainTask() {
    await this.plainTaskButton.click();
    await this.page.waitForTimeout(1000);
  }

  /**
   * Click the "Existing task from library" option in the task type modal
   */
  async clickExistingTaskFromLibrary() {
    await this.existingTaskButton.click();
    await this.page.waitForTimeout(1000);
  }

  // ===========================================
  // TASK LIBRARY METHODS
  // ===========================================

  /**
   * Randomly select one task from the library grid, click its checkbox, and return its title.
   * Row structure: td[1]=checkbox (.chk-col), td[2]=detail icon (.colDetail), td[3]=task title
   * @returns {string} The title of the randomly selected task
   */
  async selectRandomTaskFromLibrary() {
    // Wait for the grid to populate before reading rows
    await this.taskLibraryRows.first().waitFor({ state: 'visible', timeout: 10000 });
    const rows = await this.taskLibraryRows.all();
    const randomIndex = Math.floor(Math.random() * rows.length);
    const row = rows[randomIndex];

    // Read task title from td[3]
    const taskName = (await row.locator('td:nth-child(3)').textContent()).trim();

    // Click the checkbox label
    await row.locator('.chk-col label').click();
    await this.page.waitForTimeout(300);

    console.log(`Selected task from library: "${taskName}" (row ${randomIndex + 1} of ${rows.length})`);
    return taskName;
  }

  /**
   * Click the Add button to confirm the selected library task
   */
  async clickAdd() {
    await this.addButton.click();
    await this.page.waitForTimeout(2000);
  }

  // ===========================================
  // COMPLETE WORKFLOW METHODS
  // ===========================================

  /**
   * Select employees, create a bulk plain task, and return the employee names for verification.
   * The task form reuses AddPlainTaskFlyout since the same form opens after type selection.
   * @param {number} employeeCount - Number of employees to select (uses first N, skipping rows 0–1)
   * @param {string} taskName - Task name to create
   * @param {string|number} todayDay - Day number of today (e.g. '17') for the calendar picker
   * @returns {{ taskName: string, dueDate: string, employeeNames: string[], selectedIndices: number[] }}
   */
  async bulkCreateTasksGeneric(employeeCount, taskName, todayDay) {
    // Capture employee names from the grid before selecting (used for verification later)
    const employeeNames = await this.captureEmployeeNames(employeeCount);

    // Select the first N employees via checkboxes (inherited from BasePage)
    const selectedIndices = await this.selectFirstNEmployees(employeeCount);

    // Open bulk actions menu and choose Bulk Create Tasks
    await this.openBulkActionsMenu();
    await this.clickBulkCreateTasks();

    // Choose Plain Task type (bulk-specific type picker)
    await this.selectPlainTask();

    // Fill task form via AddPlainTaskFlyout (same form as individual task creation)
    await this.plainTaskForm.fillTaskName(taskName);
    await this.plainTaskForm.selectDateByCalendar(todayDay);
    await this.plainTaskForm.save();

    // Remember today's full date so verification can filter by it (avoids duplicate-name collisions)
    const dueDate = this.getTodayDate();

    console.log(`✓ Bulk task "${taskName}" created for: ${employeeNames.join(', ')} (due: ${dueDate})`);

    return { taskName, dueDate, employeeNames, selectedIndices };
  }

  /**
   * Select employees, pick a random task from the library, bulk-assign it, and return data for verification.
   * @param {number} employeeCount - Number of employees to select (uses first N, skipping rows 0–1)
   * @returns {{ taskName: string, dueDate: string, employeeNames: string[], selectedIndices: number[] }}
   */
  async bulkCreateTaskFromLibraryGeneric(employeeCount) {
    // Capture employee names from the grid before selecting
    const employeeNames = await this.captureEmployeeNames(employeeCount);

    // Select the first N employees via checkboxes (inherited from BasePage)
    const selectedIndices = await this.selectFirstNEmployees(employeeCount);

    // Open bulk actions menu and choose Bulk Create Tasks
    await this.openBulkActionsMenu();
    await this.clickBulkCreateTasks();

    // Choose existing task from library
    await this.clickExistingTaskFromLibrary();

    // Pick a random task and remember its name
    const taskName = await this.selectRandomTaskFromLibrary();

    // Confirm selection
    await this.clickAdd();

    // Remember today's full date so verification can filter by it (avoids duplicate-name collisions)
    const dueDate = this.getTodayDate();

    console.log(`✓ Library task "${taskName}" bulk-assigned to: ${employeeNames.join(', ')} (due: ${dueDate})`);

    return { taskName, dueDate, employeeNames, selectedIndices };
  }
}
