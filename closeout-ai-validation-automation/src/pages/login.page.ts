import { Locator, Page } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly loginErrorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByPlaceholder(/Email address/);
    this.passwordInput = page.getByPlaceholder(/Password/);
    this.loginButton = page.getByRole("button", { name: /login|sign in/i });
    this.loginErrorMessage = page.locator("span.text-danger");
  }

  async goto(): Promise<void> {
    await this.page.goto("/");
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async loginToApplication(username: string, password: string): Promise<void> {
    await this.goto();
    await this.login(username, password);
  }
}
