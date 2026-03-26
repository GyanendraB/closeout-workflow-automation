import { Locator, Page } from "@playwright/test"; // Playwright types for page objects and selectors.
import { createUniqueUploadCopy } from "../utils/upload-file"; // Helper to create a unique file copy for uploads.
import { waitFor } from "../utils/waitUtils"; // Simple wait helper for retry loops.

export class WorkflowPage {
  readonly page: Page; // Store the Playwright page instance.
  readonly testPhotoPlaceholder: Locator; // Placeholder tile for the test photo.
  readonly uploadDocumentButton: Locator; // Button that opens the upload control.
  readonly fileInput: Locator; // File input element for uploads.
  readonly browseDocumentsButton: Locator; // Button that opens the file picker UI.
  readonly commentInput: Locator; // Comment textarea for photo uploads.
  readonly doneButton: Locator; // Button to finalize the upload.
  readonly dialogMask: Locator; // Overlay that appears while the dialog is open.
  readonly photoCards: Locator; // List of photo cards in the workflow.

  constructor(page: Page) {
    this.page = page; // Assign the provided page instance.
    this.testPhotoPlaceholder = page.locator("xpath=(//span[contains(normalize-space(),'test photo')])[1]"); // Target the placeholder by text.
    this.uploadDocumentButton = page.locator(
      "xpath=(//jhi-upload-document[contains(@ng-reflect-code,'DOCUMENT')]//div[contains(@class,'shadow-button-hover')])[1]"
    ); // Target the upload control within the document widget.
    this.fileInput = page.locator("jhi-upload-document input[type='file']").first()
      .or(page.locator("input[type='file']").first()); // Fall back to any file input if the component selector changes.
    this.browseDocumentsButton = page.getByText(/browse your documents/i).first(); // Optional browse link for file chooser.
    this.commentInput = page.locator("textarea[placeholder='Edit comment...']").first(); // Comment field for photo metadata.
    this.doneButton = page.getByRole("button", { name: /^done$/i }).first(); // Done button to submit the upload.
    this.dialogMask = page.locator("div.p-dialog-mask.p-component-overlay"); // Overlay used to detect dialog closing.
    this.photoCards = page.locator("div.row.g-0 > div.col-lg-4.ng-star-inserted").filter({
      has: page.locator("jhi-control-panel-document-view")
    }); // Card container for uploaded photos.
  }

  async waitForTestPhotoReady(): Promise<void> {
    console.log("[WorkflowPage] Waiting for test photo to be ready"); // Log for troubleshooting.
    await this.page.waitForLoadState("domcontentloaded").catch(() => undefined); // Wait for DOM ready.
    await this.testPhotoPlaceholder.waitFor({ state: "visible", timeout: 5000 }); // Ensure the placeholder is visible.
  }

  async openTestPhoto(): Promise<void> {
    console.log("[WorkflowPage] Opening test photo placeholder"); // Log for troubleshooting.
    await this.waitForTestPhotoReady(); // Ensure UI is ready before clicking.
    await this.testPhotoPlaceholder.click(); // Open the placeholder details.
  }

  async openUploadDocument(): Promise<void> {
    console.log("[WorkflowPage] Opening upload document control"); // Log for troubleshooting.
    await this.uploadDocumentButton.click(); // Open the upload UI.
  }

  async uploadPhoto(filePath: string): Promise<void> {
    const uniqueUploadPath = await createUniqueUploadCopy(filePath); // Create a unique copy to avoid caching issues.
    console.log(`[WorkflowPage] Uploading photo: ${uniqueUploadPath}`); // Log upload path.
    await this.openUploadDocument(); // Open the upload dialog.
    await this.fileInput.setInputFiles(uniqueUploadPath); // Attach the file for upload.
  }

  async addComment(comment: string): Promise<void> {
    console.log("[WorkflowPage] Adding comment"); // Log for troubleshooting.
    await this.commentInput.fill(comment); // Fill in the comment text.
  }

  async clickDone(): Promise<void> {
    console.log("[WorkflowPage] Clicking Done"); // Log for troubleshooting.
    await this.doneButton.click(); // Submit the upload.
    await this.waitForDialogToClose(); // Wait for the dialog to close.
  }

  async completePhotoUpload(filePath: string, comment: string): Promise<void> {
    await this.openTestPhoto(); // Open the placeholder card.
    await this.uploadPhoto(filePath); // Upload the photo file.
    await this.addComment(comment); // Add metadata comment.
    await this.clickDone(); // Finalize the upload.
  }

  getLatestPhotoCard(): Locator {
    return this.photoCards.first(); // Assume newest photo appears first in the list.
  }

  async waitForLatestPhotoStatus(expectedStatus?: "accepted" | "rejected"): Promise<void> {
    console.log("[WorkflowPage] Waiting for latest photo status to resolve"); // Log for troubleshooting.

    // The UI can briefly show an old or unstable status after upload, so wait for it to settle.
    let lastResolvedStatus: "accepted" | "rejected" | null = null; // Track the last stable status seen.

    for (let attempt = 0; attempt < 50; attempt++) {
      const status = await this.getLatestPhotoStatus(); // Read the current status from the UI.
      if (status === "unknown") {
        lastResolvedStatus = null; // Reset stability tracking when status is unknown.
        await this.page.waitForTimeout(500); // Short wait before retrying.
        continue;
      }

      if (expectedStatus && status !== expectedStatus) {
        console.log(`[WorkflowPage] Current status is ${status}; waiting for expected status ${expectedStatus}`); // Log mismatch.
        lastResolvedStatus = null; // Reset stability tracking when status differs.
        await waitFor(1500); // Wait longer to give the backend time to update.
        continue;
      }

      if (status !== lastResolvedStatus) {
        console.log(`[WorkflowPage] Status changed to ${status}, waiting briefly for it to stabilize`); // Log status change.
        lastResolvedStatus = status; // Record the latest status seen.
        await waitFor(1500); // Wait to ensure the status sticks.
        continue;
      }

      return; // Exit once the status is stable and matches expectations.
    }

    throw new Error(
      expectedStatus
        ? `Timed out waiting for latest photo status to resolve to ${expectedStatus}.`
        : "Timed out waiting for latest photo status to resolve."
    ); // Surface timeout with a clear message.
  }

  async getLatestPhotoStatus(): Promise<"accepted" | "rejected" | "unknown"> {
    const latestPhotoCard = this.getLatestPhotoCard(); // Grab the latest card for status inspection.
    console.log("[WorkflowPage] Reading latest uploaded photo status"); // Log for troubleshooting.

    // Try icon-based status first because it is the most reliable signal in the card.
    const acceptedIcon = latestPhotoCard.locator("img[src*='icon-accepted.svg'], img[alt='accepted']").first(); // Accepted icon.
    if (await acceptedIcon.isVisible().catch(() => false)) {
      return "accepted"; // Accepted status detected.
    }

    const rejectedIcon = latestPhotoCard.locator("img[src*='icon-rejected.svg'], img[alt='rejected']").first(); // Rejected icon.
    if (await rejectedIcon.isVisible().catch(() => false)) {
      return "rejected"; // Rejected status detected.
    }

    const tooltipValue = await latestPhotoCard
      .locator("[ng-reflect-ngb-tooltip='Accepted'], [ng-reflect-ngb-tooltip='Rejected']")
      .first()
      .getAttribute("ng-reflect-ngb-tooltip")
      .catch(() => null); // Fallback: read the Angular tooltip attribute.

    const normalizedStatus = tooltipValue?.trim().toLowerCase(); // Normalize for safe comparison.
    if (normalizedStatus === "accepted") {
      return "accepted"; // Accepted status detected via tooltip.
    }

    if (normalizedStatus === "rejected") {
      return "rejected"; // Rejected status detected via tooltip.
    }

    return "unknown"; // Return unknown when no signals are available.
  }

  private async waitForDialogToClose(): Promise<void> {
    await this.dialogMask.waitFor({ state: "hidden", timeout: 10000 }).catch(() => undefined); // Wait for overlay to disappear.
  }
}
