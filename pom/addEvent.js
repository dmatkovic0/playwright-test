import { randomUUID } from 'crypto';
import { NavbarAndSidebar } from './NavbarAndSidebar.js';

/**
 * Opens Calendar from sidebar
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {import('@playwright/test').Expect} expect - Playwright expect object
 */
export async function openCalendar(page, expect) {
  const nav = new NavbarAndSidebar(page, expect);
  await nav.goToCalendar();

  // Wait for the Add event button to be visible
  await page.locator("//button[@class='btn btn-add-new-event']").waitFor({ state: 'visible' });
}

/**
 * Adds a new calendar event with a GUID as the event name
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {import('@playwright/test').Expect} expect - Playwright expect object
 */
export async function addEvent(page, expect) {
  // Generate GUID for event name
  const eventName = randomUUID();

  // Click Add event button
  await page.locator("//button[@class='btn btn-add-new-event']//i[@class='icon icon-plus']").click();

  // Wait 2 seconds
  await page.waitForTimeout(2000);

  // Fill in event title
  await page.locator('#companyEventTitle').click();
  await page.locator('#companyEventTitle').fill(eventName);

  // Select start date (today)
  await page.locator("//input[@id='xCompanyEvent-xStarts']").click();
  await page.locator("//input[@id='xCompanyEvent-xStarts']").fill(new Date().toLocaleDateString('en-US'));

  // Select end date (today)
  await page.locator("//input[@id='xCompanyEvent-xEnds']").click();
  await page.locator("//input[@id='xCompanyEvent-xEnds']").fill(new Date().toLocaleDateString('en-US'));

  // Toggle all-day event
  //await page.locator('#xCompanyEvent-xIsAllDay > .input-helper').click();

  // Select address
  await page.getByRole('button', { name: 'Select address... ' }).click();
  await page.getByRole('textbox', { name: 'Type to search' }).fill('split');
  await page.getByRole('textbox', { name: 'Type to search' }).press('Enter');

  // Wait for address options to load and select
  await page.waitForTimeout(1000);
  await page.getByText('Split, Croatia').first().click();

  // Go back to event name and add "1" at the end
  await page.locator('#companyEventTitle').click();
  await page.locator('#companyEventTitle').press('End');
  await page.locator('#companyEventTitle').type('1');

  // Create the event
  await page.getByRole('button', { name: 'Create' }).click();

  // Wait for the modal to close
  await page.waitForTimeout(2000);

  console.log(`Event created with name: ${eventName}1`);

  return `${eventName}1`;
}
