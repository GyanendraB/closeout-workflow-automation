import { Locator, Page } from "@playwright/test"; // Playwright types for defining page objects.

export class DashboardPage {
  readonly page: Page; // Store page instance for future actions.
  readonly header: Locator; // Locator pointing to a page heading.

  constructor(page: Page) {
    this.page = page; // Assign the provided page instance.
    this.header = page.getByRole("heading"); // Use accessible role to find a heading element.
  }

  async isLoaded(): Promise<boolean> {
    return this.header.isVisible(); // Consider the dashboard loaded when the heading is visible.
  }
}
