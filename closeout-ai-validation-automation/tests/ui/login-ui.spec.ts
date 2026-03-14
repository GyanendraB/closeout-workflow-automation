import { test, expect } from "../../src/fixtures/base.fixture";
import { ControlPanelPage } from "../../src/pages/control-panel.page";
import { uiLoginTestData } from "../../test-data/payloads/ui-login-test-data";

test.describe("Login UI", () => {
  test("shows an error for invalid credentials and logs in with valid credentials", async ({ page, loginPage }) => {
    const controlPanelPage = new ControlPanelPage(page);

    await test.step("Show unauthorized message for invalid credentials", async () => {
      await loginPage.goto();
      await loginPage.login(
        uiLoginTestData.invalidCredentials.username,
        uiLoginTestData.invalidCredentials.password
      );

      await expect(loginPage.loginErrorMessage).toContainText(
        uiLoginTestData.expectedUnauthorizedMessage
      );
      await expect(loginPage.usernameInput).toBeVisible();
    });

    await test.step("Login successfully with valid credentials", async () => {
      await loginPage.login(
        uiLoginTestData.validCredentials.username,
        uiLoginTestData.validCredentials.password
      );

      await expect(controlPanelPage.controlPanelMenu).toBeVisible();
      await expect(loginPage.loginErrorMessage).not.toBeVisible();
    });
  });
});
