import { Locator, Page } from "@playwright/test";
import { createUniqueUploadCopy } from "../utils/upload-file";
import { waitFor } from "../utils/waitUtils";

export class WorkflowPage {
  readonly page: Page;
  readonly testPhotoPlaceholder: Locator;
  readonly uploadDocumentButton: Locator;
  readonly fileInput: Locator;
  readonly browseDocumentsButton: Locator;
  readonly commentInput: Locator;
  readonly doneButton: Locator;
  readonly dialogMask: Locator;
  readonly photoCards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.testPhotoPlaceholder = page.locator("xpath=(//span[contains(normalize-space(),'test photo')])[1]");
    this.uploadDocumentButton = page.locator(
      "xpath=(//jhi-upload-document[contains(@ng-reflect-code,'DOCUMENT')]//div[contains(@class,'shadow-button-hover')])[1]"
    );
    this.fileInput = page.locator("jhi-upload-document input[type='file']").first()
      .or(page.locator("input[type='file']").first());
    this.browseDocumentsButton = page.getByText(/browse your documents/i).first();
    this.commentInput = page.locator("textarea[placeholder='Edit comment...']").first();
    this.doneButton = page.getByRole("button", { name: /^done$/i }).first();
    this.dialogMask = page.locator("div.p-dialog-mask.p-component-overlay");
    this.photoCards = page.locator("div.row.g-0 > div.col-lg-4.ng-star-inserted").filter({
      has: page.locator("jhi-control-panel-document-view")
    });
  }

  async waitForTestPhotoReady(): Promise<void> {
    console.log("[WorkflowPage] Waiting for test photo to be ready");
    await this.page.waitForLoadState("domcontentloaded").catch(() => undefined);
    await this.testPhotoPlaceholder.waitFor({ state: "visible", timeout: 5000 });
  }

  async openTestPhoto(): Promise<void> {
    console.log("[WorkflowPage] Opening test photo placeholder");
    await this.waitForTestPhotoReady();
    await this.testPhotoPlaceholder.click();
  }

  async openUploadDocument(): Promise<void> {
    console.log("[WorkflowPage] Opening upload document control");
    await this.uploadDocumentButton.click();
  }

  async uploadPhoto(filePath: string): Promise<void> {
    const uniqueUploadPath = await createUniqueUploadCopy(filePath);
    console.log(`[WorkflowPage] Uploading photo: ${uniqueUploadPath}`);
    await this.openUploadDocument();
    await this.fileInput.setInputFiles(uniqueUploadPath);
  }

  async addComment(comment: string): Promise<void> {
    console.log("[WorkflowPage] Adding comment");
    await this.commentInput.fill(comment);
  }

  async clickDone(): Promise<void> {
    console.log("[WorkflowPage] Clicking Done");
    await this.doneButton.click();
    await this.waitForDialogToClose();
  }

  async completePhotoUpload(filePath: string, comment: string): Promise<void> {
    await this.openTestPhoto();
    await this.uploadPhoto(filePath);
    await this.addComment(comment);
    await this.clickDone();
  }

  getLatestPhotoCard(): Locator {
    return this.photoCards.first();
  }

  async waitForLatestPhotoStatus(expectedStatus?: "accepted" | "rejected"): Promise<void> {
    console.log("[WorkflowPage] Waiting for latest photo status to resolve");

    let lastResolvedStatus: "accepted" | "rejected" | null = null;

    for (let attempt = 0; attempt < 50; attempt++) {
      const status = await this.getLatestPhotoStatus();
      if (status === "unknown") {
        lastResolvedStatus = null;
        await this.page.waitForTimeout(500);
        continue;
      }

      if (expectedStatus && status !== expectedStatus) {
        console.log(`[WorkflowPage] Current status is ${status}; waiting for expected status ${expectedStatus}`);
        lastResolvedStatus = null;
        await waitFor(1500);
        continue;
      }

      if (status !== lastResolvedStatus) {
        console.log(`[WorkflowPage] Status changed to ${status}, waiting briefly for it to stabilize`);
        lastResolvedStatus = status;
        await waitFor(1500);
        continue;
      }

      return;
    }

    throw new Error(
      expectedStatus
        ? `Timed out waiting for latest photo status to resolve to ${expectedStatus}.`
        : "Timed out waiting for latest photo status to resolve."
    );
  }

  async getLatestPhotoStatus(): Promise<"accepted" | "rejected" | "unknown"> {
    const latestPhotoCard = this.getLatestPhotoCard();
    console.log("[WorkflowPage] Reading latest uploaded photo status");

    const acceptedIcon = latestPhotoCard.locator("img[src*='icon-accepted.svg'], img[alt='accepted']").first();
    if (await acceptedIcon.isVisible().catch(() => false)) {
      return "accepted";
    }

    const rejectedIcon = latestPhotoCard.locator("img[src*='icon-rejected.svg'], img[alt='rejected']").first();
    if (await rejectedIcon.isVisible().catch(() => false)) {
      return "rejected";
    }

    const tooltipValue = await latestPhotoCard
      .locator("[ng-reflect-ngb-tooltip='Accepted'], [ng-reflect-ngb-tooltip='Rejected']")
      .first()
      .getAttribute("ng-reflect-ngb-tooltip")
      .catch(() => null);

    const normalizedStatus = tooltipValue?.trim().toLowerCase();
    if (normalizedStatus === "accepted") {
      return "accepted";
    }

    if (normalizedStatus === "rejected") {
      return "rejected";
    }

    return "unknown";
  }

  private async waitForDialogToClose(): Promise<void> {
    await this.dialogMask.waitFor({ state: "hidden", timeout: 10000 }).catch(() => undefined);
  }
}
