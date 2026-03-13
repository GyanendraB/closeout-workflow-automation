import { Locator, Page } from "@playwright/test";

export class ControlPanelPage {
  readonly page: Page;
  readonly controlPanelMenu: Locator;
  readonly projectItem: (projectNumber: number | string) => Locator;
  readonly siteItem: (siteNumber: number | string) => Locator;
  readonly siteListContainer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.controlPanelMenu = page.locator("div.co-main-menu-label", { hasText: "Control Panel" });
    this.projectItem = (projectNumber: number | string) =>
      page.locator(
        `xpath=(//div[contains(@class,'co-list-item') and .//*[contains(normalize-space(),'Test Project ${projectNumber}')]])[1]`
      );
    this.siteItem = (siteNumber: number | string) =>
      page.locator(
        `xpath=(//div[contains(@class,'co-list-item') and .//*[contains(normalize-space(),'Test Site ${siteNumber}')]])[1]`
      );
    this.siteListContainer = page
      .locator("div.content-height.overflow-y-auto.bg-white.position-relative", {
        has: page.locator("input[placeholder='Search Sites']")
      })
      .first();
  }

  async openControlPanel(): Promise<void> {
    console.log("[ControlPanelPage] Clicking Control Panel menu");
    await this.controlPanelMenu.click();
  }

  async openProject(projectNumber: number | string): Promise<void> {
    const project = this.projectItem(projectNumber);
    console.log(`[ControlPanelPage] Looking for Test Project ${projectNumber}`);
    await this.scrollUntilVisible(project);
    console.log(`[ControlPanelPage] Clicking Test Project ${projectNumber}`);
    await project.click();
  }

  async openSite(siteNumber: number | string): Promise<void> {
    const site = this.siteItem(siteNumber);
    console.log(`[ControlPanelPage] Looking for Test Site ${siteNumber}`);
    await this.scrollSiteContainerUntilVisible(site);
    console.log(`[ControlPanelPage] Clicking Test Site ${siteNumber}`);
    await site.click({ force: true, noWaitAfter: true });
  }

  async openProjectAndSite(projectNumber: number | string, siteNumber: number | string): Promise<void> {
    await this.openProject(projectNumber);
    await this.openSite(siteNumber);
  }

  private async scrollUntilVisible(target: Locator): Promise<void> {
    for (let attempt = 0; attempt < 20; attempt++) {
      if (await target.isVisible().catch(() => false)) {
        return;
      }

      await this.page.mouse.wheel(0, 900);
      await this.page.waitForTimeout(150);
    }

    await target.waitFor({ state: "visible" });
  }

  private async scrollSiteContainerUntilVisible(target: Locator): Promise<void> {
    for (let attempt = 0; attempt < 20; attempt++) {
      if (await target.isVisible().catch(() => false)) {
        return;
      }

      await this.siteListContainer.evaluate((element) => {
        element.scrollTop += 700;
      });
      await this.page.waitForTimeout(150);
    }

    await target.waitFor({ state: "visible" });
  }
}
