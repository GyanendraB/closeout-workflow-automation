import { Locator, Page } from "@playwright/test"; // Playwright types for page objects and selectors.

export class ProjectPage {
  readonly page: Page; // Store the Playwright page instance.
  readonly projectCard: (projectName: string) => Locator; // Function to locate a project by name.

  constructor(page: Page) {
    this.page = page; // Assign the provided page instance.
    this.projectCard = (projectName: string) =>
      page.locator("[data-testid='project-card']").filter({ hasText: projectName }).first() // Prefer test-id cards.
        .or(page.getByRole("link", { name: new RegExp(projectName, "i") }).first()) // Fallback to link match.
        .or(page.getByText(new RegExp(projectName, "i")).first()); // Last-resort text match.
  }

  async openProject(projectName: string): Promise<void> {
    await this.projectCard(projectName).click(); // Click the matching project card.
  }
}
