import path from "path"; // Path helpers for resolving test data directories.
import { expect, test } from "../../src/fixtures/ui-auth.fixture"; // Use UI auth fixture for login helper.
import { CONTROL_PANEL_TEST_PROJECT_NUMBER, CONTROL_PANEL_TEST_SITE_NUMBER } from "../../src/config/constants"; // Configured test project/site identifiers.
import { ControlPanelPage } from "../../src/pages/control-panel.page"; // Control panel navigation page object.
import { NotificationsPage } from "../../src/pages/notifications.page"; // Notifications page object.
import { WorkflowPage } from "../../src/pages/workflow.page"; // Workflow page object for photo uploads.
import { getImageFiles } from "../../src/utils/image-validation-data"; // Helper to load image files from disk.

test.describe("Notification Validation", () => {
  test("Notification Validation", async ({ page, loginWithValidCredentials }) => {
    test.setTimeout(10 * 60 * 1000); // Allow extra time for upload and notification processing.

    const controlPanelPage = new ControlPanelPage(page); // Instantiate control panel page object.
    const workflowPage = new WorkflowPage(page); // Instantiate workflow page object.
    const notificationsPage = new NotificationsPage(page); // Instantiate notifications page object.
    const imagesDirectory = path.resolve(__dirname, "../../test-data/images/reject"); // Use reject images to trigger notifications.
    const imageFiles = await getImageFiles(imagesDirectory); // Load image file paths from disk.
    const projectNumber = CONTROL_PANEL_TEST_PROJECT_NUMBER; // Use configured project number.
    const siteNumber = CONTROL_PANEL_TEST_SITE_NUMBER; // Use configured site number.

    expect(imageFiles.length, "No images were found in test-data/images/reject.").toBeGreaterThan(0); // Ensure test data exists.

    await loginWithValidCredentials(); // Log into the application via fixture.
    // Start from a clean notification state so the new badge count is easy to validate.
    await notificationsPage.clearAllNotificationsIfPresent(); // Clear any existing notifications.

    await controlPanelPage.openControlPanel(); // Navigate to the control panel.
    await controlPanelPage.openProjectAndSite(projectNumber, siteNumber); // Open the project and site.
    await workflowPage.waitForTestPhotoReady(); // Wait for the workflow to be ready.

    const imageFile = imageFiles[0]; // Use the first reject image to trigger a notification.
    await workflowPage.completePhotoUpload(
      imageFile.filePath, // Upload the image.
      `Notification validation for ${imageFile.fileName} in Test Project ${projectNumber} and Test Site ${siteNumber}` // Add a descriptive comment.
    );

    await notificationsPage.waitForNotificationCount("1"); // Wait for a single notification badge.
    await notificationsPage.openNotifications(); // Open the notification tray.

    const notificationTimestamp = await notificationsPage.getLatestNotificationTimestamp(); // Read the timestamp of the latest notification.
    expect(notificationTimestamp).toContain("Today"); // Validate the expected time label.
    expect(
      notificationTimestamp,
      `Expected notification timestamp to include a time, received "${notificationTimestamp}"`
    ).toMatch(/^\d{1,2}:\d{2}\s?[AP]M/); // Validate time formatting.

    await notificationsPage.clearAllNotificationsIfPresent(); // Clean up notifications after the test.
  });
});
