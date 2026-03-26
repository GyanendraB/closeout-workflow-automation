import { Locator, Page } from "@playwright/test"; // Playwright types for page objects and selectors.

export class SitePage {
  readonly page: Page; // Store the Playwright page instance.
  readonly siteNode: (siteName: string) => Locator; // Function to locate a site by name.

  constructor(page: Page) {
    this.page = page; // Assign the provided page instance.
    this.siteNode = (siteName: string) =>
      page.locator("[data-testid='site-card']").filter({ hasText: siteName }).first() // Prefer test-id cards.
        .or(page.getByRole("link", { name: new RegExp(siteName, "i") }).first()) // Fallback to link match.
        .or(page.getByText(new RegExp(siteName, "i")).first()); // Last-resort text match.
  }

  async openSite(siteName: string): Promise<void> {
    await this.siteNode(siteName).click(); // Click the matching site card.
  }
}
