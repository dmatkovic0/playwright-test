import { BasePage } from '../BasePage.js';

export class CreateTaskFlyout extends BasePage {
  constructor(page, expect = null) {
    super(page, expect);

    // Flyout container
    this.flyoutContainer = page.locator('.aut-area-addEmployeeTask');

    // Flyout actions
    this.cancelButton = page.locator('.aut-area-addEmployeeTask .aut-button-cancel');

    // Add From Task Library
    this.existingTaskButton = page.locator('.aut-button-existingTask');

    // Add Individual Task
    this.plainTaskButton           = page.locator('.aut-button-plainTask');
    this.videoTaskButton           = page.locator('.aut-button-videoTask');
    this.formTaskButton            = page.locator('.aut-button-formTask');
    this.documentRequestTaskButton = page.locator('.aut-button-documentRequestTask');
    this.assetTaskButton           = page.locator('.aut-button-assetTask');

    // Add Multi-Contributor Task
    this.multiFormTaskButton = page.locator('.aut-button-multiFormTask');
    this.complexTaskButton   = page.locator('.aut-button-complexFormTask');
  }

  // ===========================================
  // FLYOUT ACTIONS
  // ===========================================

  /**
   * Cancel and close the flyout
   */
  async cancel() {
    await this.cancelButton.click();
    await this.page.waitForTimeout(500);
  }

  // ===========================================
  // TASK TYPE SELECTION METHODS
  // ===========================================

  /**
   * Select a task from the task library (existing task)
   */
  async selectExistingTask() {
    await this.existingTaskButton.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Add an individual plain task
   */
  async selectPlainTask() {
    await this.plainTaskButton.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Add an individual video task
   */
  async selectVideoTask() {
    await this.videoTaskButton.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Add an individual form task
   */
  async selectFormTask() {
    await this.formTaskButton.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Add an individual document request task
   */
  async selectDocumentRequestTask() {
    await this.documentRequestTaskButton.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Add an individual asset task
   */
  async selectAssetTask() {
    await this.assetTaskButton.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Add a multi-contributor form task
   */
  async selectMultiFormTask() {
    await this.multiFormTaskButton.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Add a multi-contributor complex task
   */
  async selectComplexTask() {
    await this.complexTaskButton.click();
    await this.page.waitForTimeout(500);
  }
}
