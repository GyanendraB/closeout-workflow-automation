import { test as base } from "@playwright/test"; // Base Playwright test object to extend with fixtures.
import { LoginPage } from "../pages/login.page"; // Page object representing the login screen.

type BaseFixtures = {
  loginPage: LoginPage; // Expose a typed LoginPage fixture to tests.
};

export const test = base.extend<BaseFixtures>({
  loginPage: async ({ page }, use) => { // Create the fixture using Playwright's page and provide it to the test.
    await use(new LoginPage(page)); // Instantiate once per test and hand it to consumers.
  }
});
export { expect } from "@playwright/test"; // Re-export expect to keep imports consistent for tests.
