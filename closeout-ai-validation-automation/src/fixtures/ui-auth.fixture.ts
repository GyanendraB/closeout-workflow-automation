import { test as base } from "./base.fixture"; // Extend the base UI fixtures.
import { env } from "../config/env"; // Environment variables for login.

type UiAuthFixtures = {
  loginWithValidCredentials: () => Promise<void>; // Helper to log in with valid creds.
};

export const test = base.extend<UiAuthFixtures>({
  loginWithValidCredentials: async ({ loginPage }, use) => {
    await use(async () => {
      await loginPage.loginToApplication(env.username, env.password); // Log in using configured credentials.
    });
  }
});

export { expect } from "@playwright/test"; // Re-export expect for consistent imports.
