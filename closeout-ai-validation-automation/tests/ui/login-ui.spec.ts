import { test, expect } from "../../src/fixtures/base.fixture"; // Use the base fixture with the login page.
import { ControlPanelPage } from "../../src/pages/control-panel.page"; // Page object for control panel navigation.
import { uiLoginTestData } from "../../test-data/payloads/ui-login-test-data"; // Test data for login scenarios.

test.describe("Login UI", () => {
  test("shows an error for invalid credentials and logs in with valid credentials", async ({ page, loginPage }) => {
    const controlPanelPage = new ControlPanelPage(page); // Instantiate the control panel page object.

    await test.step("Show unauthorized message for invalid credentials", async () => {
      await loginPage.goto(); // Navigate to the login page.
      await loginPage.login(
        uiLoginTestData.invalidCredentials.username, // Use invalid username.
        uiLoginTestData.invalidCredentials.password // Use invalid password.
      );

      await expect(loginPage.loginErrorMessage).toContainText(
        uiLoginTestData.expectedUnauthorizedMessage // Ensure the correct error is shown.
      );
      await expect(loginPage.usernameInput).toBeVisible(); // Confirm we are still on the login screen.
    });

    await test.step("Login successfully with valid credentials", async () => {
      await loginPage.login(
        uiLoginTestData.validCredentials.username, // Use valid username.
        uiLoginTestData.validCredentials.password // Use valid password.
      );

      await expect(controlPanelPage.controlPanelMenu).toBeVisible(); // Control panel menu indicates login success.
      await expect(loginPage.loginErrorMessage).not.toBeVisible(); // Error message should no longer be shown.
    });
  });
});
