import { Locator, Page } from "@playwright/test"; // Playwright types for page and locator definitions.

export class LoginPage {
  readonly page: Page; // Store the Playwright page instance.
  readonly usernameInput: Locator; // Locator for the username field.
  readonly passwordInput: Locator; // Locator for the password field.
  readonly loginButton: Locator; // Locator for the login submit button.
  readonly loginErrorMessage: Locator; // Locator for the error message on failed login.

  constructor(page: Page) {
    this.page = page; // Assign the provided page instance.
    this.usernameInput = page.getByPlaceholder(/Email address/); // Match the email input by placeholder text.
    this.passwordInput = page.getByPlaceholder(/Password/); // Match the password input by placeholder text.
    this.loginButton = page.getByRole("button", { name: /login|sign in/i }); // Match the button by accessible name.
    this.loginErrorMessage = page.locator("span.text-danger"); // Target the error message element styling.
  }

  async goto(): Promise<void> {
    await this.page.goto("/"); // Navigate to the app root which hosts the login page.
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username); // Fill in the username.
    await this.passwordInput.fill(password); // Fill in the password.
    await this.loginButton.click(); // Submit the login form.
  }

  async loginToApplication(username: string, password: string): Promise<void> {
    await this.goto(); // Ensure we are on the login page.
    await this.login(username, password); // Perform the login sequence.
  }
}
