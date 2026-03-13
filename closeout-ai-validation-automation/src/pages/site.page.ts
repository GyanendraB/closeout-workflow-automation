import { Locator, Page } from "@playwright/test";

export class SitePage {
  readonly page: Page;
  readonly siteNode: (siteName: string) => Locator;

  constructor(page: Page) {
    this.page = page;
    this.siteNode = (siteName: string) =>
      page.locator("[data-testid='site-card']").filter({ hasText: siteName }).first()
        .or(page.getByRole("link", { name: new RegExp(siteName, "i") }).first())
        .or(page.getByText(new RegExp(siteName, "i")).first());
  }

  async openSite(siteName: string): Promise<void> {
    await this.siteNode(siteName).click();
  }
}
