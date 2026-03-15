import path from "path";
import { expect, test } from "@playwright/test";
import { CONTROL_PANEL_TEST_PROJECT_NUMBER, CONTROL_PANEL_TEST_SITE_NUMBER } from "../../src/config/constants";
import { env } from "../../src/config/env";
import { ControlPanelPage } from "../../src/pages/control-panel.page";
import { LoginPage } from "../../src/pages/login.page";
import { WorkflowPage } from "../../src/pages/workflow.page";
import { getImageFiles } from "../../src/utils/image-validation-data";

test.describe("Hardhat AI Validation Reject Folder Flow", () => {
  test("Image AI Validation Rejected", async ({ page }) => {
    test.setTimeout(10 * 60 * 1000);
    console.log("[Test] Starting reject-folder AI validation test");

    const loginPage = new LoginPage(page);
    const controlPanelPage = new ControlPanelPage(page);
    const workflowPage = new WorkflowPage(page);
    const imagesDirectory = path.resolve(__dirname, "../../test-data/images/reject");
    const imageFiles = await getImageFiles(imagesDirectory);
    const projectNumber = CONTROL_PANEL_TEST_PROJECT_NUMBER;
    const siteNumber = CONTROL_PANEL_TEST_SITE_NUMBER;

    expect(imageFiles.length, "No images were found in test-data/images/reject.").toBeGreaterThan(0);

    await loginPage.loginToApplication(env.username, env.password);
    await controlPanelPage.openControlPanel();
    await controlPanelPage.openProjectAndSite(projectNumber, siteNumber);
    await workflowPage.waitForTestPhotoReady();

    for (const imageFile of imageFiles) {
      await test.step(`Reject folder image: ${imageFile.fileName}`, async () => {
        await workflowPage.completePhotoUpload(
          imageFile.filePath,
          `Reject folder validation for ${imageFile.fileName} in Test Project ${projectNumber} and Test Site ${siteNumber}`
        );

        await workflowPage.waitForLatestPhotoStatus("rejected");
        const actualStatus = await workflowPage.getLatestPhotoStatus();
        expect.soft(
          actualStatus,
          `Image ${imageFile.fileName} in reject folder returned ${actualStatus} instead of rejected.`
        ).toBe("rejected");
      });
    }
  });
});

