import { Locator, Page } from "@playwright/test";

export class ProjectPage {
  readonly page: Page;
  readonly projectCard: (projectName: string) => Locator;

  constructor(page: Page) {
    this.page = page;
    this.projectCard = (projectName: string) =>
      page.locator("[data-testid='project-card']").filter({ hasText: projectName }).first()
        .or(page.getByRole("link", { name: new RegExp(projectName, "i") }).first())
        .or(page.getByText(new RegExp(projectName, "i")).first());
  }

  async openProject(projectName: string): Promise<void> {
    await this.projectCard(projectName).click();
  }
}
