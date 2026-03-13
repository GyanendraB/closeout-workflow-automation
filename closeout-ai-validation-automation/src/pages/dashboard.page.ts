import { Locator, Page } from "@playwright/test";

export class DashboardPage {
  readonly page: Page;
  readonly header: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = page.getByRole("heading");
  }

  async isLoaded(): Promise<boolean> {
    return this.header.isVisible();
  }
}
