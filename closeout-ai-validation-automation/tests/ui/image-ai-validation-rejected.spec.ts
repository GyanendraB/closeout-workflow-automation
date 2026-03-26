import path from "path"; // Path helpers for resolving test data directories.
import { expect, test } from "../../src/fixtures/ui-auth.fixture"; // Use UI auth fixture for login helper.
import { CONTROL_PANEL_TEST_PROJECT_NUMBER, CONTROL_PANEL_TEST_SITE_NUMBER } from "../../src/config/constants"; // Configured test project/site identifiers.
import { ControlPanelPage } from "../../src/pages/control-panel.page"; // Control panel navigation page object.
import { WorkflowPage } from "../../src/pages/workflow.page"; // Workflow page object for photo uploads.
import { getImageFiles } from "../../src/utils/image-validation-data"; // Helper to load image files from disk.

test.describe("Hardhat AI Validation Reject Folder Flow", () => {
  test("Image AI Validation Rejected", async ({ page, loginWithValidCredentials }) => {
    test.setTimeout(10 * 60 * 1000); // Allow extra time for multiple uploads and AI processing.
    console.log("[Test] Starting reject-folder AI validation test"); // Log start for debugging.

    const controlPanelPage = new ControlPanelPage(page); // Instantiate control panel page object.
    const workflowPage = new WorkflowPage(page); // Instantiate workflow page object.
    const imagesDirectory = path.resolve(__dirname, "../../test-data/images/reject"); // Resolve the reject images folder.
    const imageFiles = await getImageFiles(imagesDirectory); // Load image file paths from disk.
    const projectNumber = CONTROL_PANEL_TEST_PROJECT_NUMBER; // Use configured project number.
    const siteNumber = CONTROL_PANEL_TEST_SITE_NUMBER; // Use configured site number.

    expect(imageFiles.length, "No images were found in test-data/images/reject.").toBeGreaterThan(0); // Ensure test data exists.

    await loginWithValidCredentials(); // Log into the application via fixture.
    await controlPanelPage.openControlPanel(); // Navigate to the control panel.
    await controlPanelPage.openProjectAndSite(projectNumber, siteNumber); // Open the project and site.
    await workflowPage.waitForTestPhotoReady(); // Wait for the workflow to be ready.

    for (const imageFile of imageFiles) {
      await test.step(`Reject folder image: ${imageFile.fileName}`, async () => {
        await workflowPage.completePhotoUpload(
          imageFile.filePath, // Upload the current image.
          `Reject folder validation for ${imageFile.fileName} in Test Project ${projectNumber} and Test Site ${siteNumber}` // Add a descriptive comment.
        );

        await workflowPage.waitForLatestPhotoStatus("rejected"); // Wait for AI status to settle.
        const actualStatus = await workflowPage.getLatestPhotoStatus(); // Read the status from the UI.
        expect.soft(
          actualStatus,
          `Image ${imageFile.fileName} in reject folder returned ${actualStatus} instead of rejected.`
        ).toBe("rejected"); // Soft-assert to continue testing other images.
      });
    }
  });
});
