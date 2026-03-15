import path from "path";
import { expect, test } from "@playwright/test";
import { CONTROL_PANEL_TEST_PROJECT_NUMBER, CONTROL_PANEL_TEST_SITE_NUMBER } from "../../src/config/constants";
import { env } from "../../src/config/env";
import { ControlPanelPage } from "../../src/pages/control-panel.page";
import { LoginPage } from "../../src/pages/login.page";
import { NotificationsPage } from "../../src/pages/notifications.page";
import { WorkflowPage } from "../../src/pages/workflow.page";
import { getImageFiles } from "../../src/utils/image-validation-data";


test.describe("Notification Validation", () => {
  test("Notification Validation", async ({ page }) => {
    test.setTimeout(10 * 60 * 1000);

    const loginPage = new LoginPage(page);
    const controlPanelPage = new ControlPanelPage(page);
    const workflowPage = new WorkflowPage(page);
    const notificationsPage = new NotificationsPage(page);
    const imagesDirectory = path.resolve(__dirname, "../../test-data/images/reject");
    const imageFiles = await getImageFiles(imagesDirectory);
    const projectNumber = CONTROL_PANEL_TEST_PROJECT_NUMBER;
    const siteNumber = CONTROL_PANEL_TEST_SITE_NUMBER;

    expect(imageFiles.length, "No images were found in test-data/images/reject.").toBeGreaterThan(0);

    await loginPage.loginToApplication(env.username, env.password);
    await notificationsPage.clearAllNotificationsIfPresent();

    await controlPanelPage.openControlPanel();
    await controlPanelPage.openProjectAndSite(projectNumber, siteNumber);
    await workflowPage.waitForTestPhotoReady();

    const imageFile = imageFiles[0];
    await workflowPage.completePhotoUpload(
      imageFile.filePath,
      `Notification validation for ${imageFile.fileName} in Test Project ${projectNumber} and Test Site ${siteNumber}`
    );

    await notificationsPage.waitForNotificationCount("1");
    await notificationsPage.openNotifications();

    const notificationTimestamp = await notificationsPage.getLatestNotificationTimestamp();
    expect(notificationTimestamp).toContain("Today");
    expect(
      notificationTimestamp,
      `Expected notification timestamp to include a time, received "${notificationTimestamp}"`
    ).toMatch(/^\d{1,2}:\d{2}\s?[AP]M/);

    await notificationsPage.clearAllNotificationsIfPresent();
  });
});


