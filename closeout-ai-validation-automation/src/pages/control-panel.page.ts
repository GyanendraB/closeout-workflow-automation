import { Locator, Page } from "@playwright/test"; // Playwright types for page objects and selectors.

export class ControlPanelPage {
  readonly page: Page; // Store the Playwright page instance.
  readonly controlPanelMenu: Locator; // Locator for the Control Panel menu entry.
  readonly projectItem: (projectNumber: number | string) => Locator; // Function to locate a project by number.
  readonly siteItem: (siteNumber: number | string) => Locator; // Function to locate a site by number.
  readonly siteListContainer: Locator; // Scrollable container for the site list.

  constructor(page: Page) {
    this.page = page; // Assign the provided page instance.
    this.controlPanelMenu = page.locator("div.co-main-menu-label", { hasText: "Control Panel" }); // Menu label.
    this.projectItem = (projectNumber: number | string) =>
      page.locator(
        `xpath=(//div[contains(@class,'co-list-item') and .//*[contains(normalize-space(),'Test Project ${projectNumber}')]])[1]`
      ); // Target the first matching project card.
    this.siteItem = (siteNumber: number | string) =>
      page.locator(
        `xpath=(//div[contains(@class,'co-list-item') and .//*[contains(normalize-space(),'Test Site ${siteNumber}')]])[1]`
      ); // Target the first matching site card.
    this.siteListContainer = page
      .locator("div.content-height.overflow-y-auto.bg-white.position-relative", {
        has: page.locator("input[placeholder='Search Sites']")
      })
      .first(); // Use the list container that includes the site search input.
  }

  async openControlPanel(): Promise<void> {
    console.log("[ControlPanelPage] Clicking Control Panel menu"); // Log for troubleshooting.
    await this.controlPanelMenu.click(); // Open the control panel section.
  }

  async openProject(projectNumber: number | string): Promise<void> {
    const project = this.projectItem(projectNumber); // Resolve the target project locator.
    console.log(`[ControlPanelPage] Looking for Test Project ${projectNumber}`); // Log search intent.
    await this.scrollUntilVisible(project); // Scroll until the project is visible.
    console.log(`[ControlPanelPage] Clicking Test Project ${projectNumber}`); // Log click action.
    await project.click(); // Open the project.
  }

  async openSite(siteNumber: number | string): Promise<void> {
    const site = this.siteItem(siteNumber); // Resolve the target site locator.
    console.log(`[ControlPanelPage] Looking for Test Site ${siteNumber}`); // Log search intent.
    await this.scrollSiteContainerUntilVisible(site); // Scroll within the site container.
    console.log(`[ControlPanelPage] Clicking Test Site ${siteNumber}`); // Log click action.
    await site.click({ force: true, noWaitAfter: true }); // Force click to bypass overlays and avoid navigation wait.
  }

  async openProjectAndSite(projectNumber: number | string, siteNumber: number | string): Promise<void> {
    await this.openProject(projectNumber); // Open project first to load its sites.
    await this.openSite(siteNumber); // Then open the site inside the project.
  }

  private async scrollUntilVisible(target: Locator): Promise<void> {
    // Project list uses page scroll, so keep scrolling until the target card appears.
    for (let attempt = 0; attempt < 20; attempt++) {
      if (await target.isVisible().catch(() => false)) {
        return; // Stop once the target is visible.
      }

      await this.page.mouse.wheel(0, 900); // Scroll the page downward to load more items.
      await target.waitFor({ state: "visible" }); // Wait for the target to appear after scrolling.
    }

    await target.waitFor({ state: "visible" }); // Final wait to surface a clear error if still missing.
  }

  private async scrollSiteContainerUntilVisible(target: Locator): Promise<void> {
    // Site list has its own scroll container separate from the main page.
    for (let attempt = 0; attempt < 20; attempt++) {
      if (await target.isVisible().catch(() => false)) {
        return; // Stop once the target is visible.
      }

      await this.siteListContainer.evaluate((element) => {
        element.scrollTop += 700; // Scroll the site list container downward.
      });
    }

    await target.waitFor({ state: "visible" }); // Final wait to surface a clear error if still missing.
  }
}
