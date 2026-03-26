import { expect, Locator, Page } from "@playwright/test"; // Playwright expect, page, and locator types.

export class NotificationsPage {
  readonly page: Page; // Store the Playwright page instance.
  readonly notificationIcon: Locator; // Bell icon to open notifications panel.
  readonly notificationCount: Locator; // Badge that shows the number of notifications.
  readonly notificationsPanel: Locator; // Panel containing notification entries.
  readonly clearAllButton: Locator; // Button in the panel to clear notifications.
  readonly clearAllConfirmationButton: Locator; // Confirmation button in the modal/dialog.
  readonly notificationTimestamp: Locator; // Locator for timestamp of the latest notification.
  readonly notificationEntry: Locator; // Locator for the first notification entry content.

  constructor(page: Page) {
    this.page = page; // Assign the provided page instance.
    this.notificationIcon = page.locator("img[alt='notifications']").first(); // Target the notification icon.
    this.notificationCount = page.locator("jhi-notifications-panel span.notification-count").first(); // Badge count in the panel.
    this.notificationsPanel = page.locator("div.notifications.properties-panel").first(); // Panel container.
    this.clearAllButton = this.notificationsPanel.getByRole("button", { name: /^clear all$/i }).first(); // Clear button inside panel.
    this.clearAllConfirmationButton = page.getByRole("button", { name: /^clear all$/i }).last(); // Confirmation button in modal.
    this.notificationTimestamp = this.notificationsPanel.locator("span.text-gray").first(); // Timestamp text for the latest entry.
    this.notificationEntry = this.notificationsPanel.locator("span.text-gray, p, .notification-count").first(); // General entry content.
  }

  async openNotifications(): Promise<void> {
    if (await this.notificationsPanel.isVisible().catch(() => false)) {
      return; // If already open, no action is needed.
    }

    await this.waitForPageReady(); // Ensure the page is ready before interacting.
    await this.notificationIcon.click(); // Open the notifications panel.
    await this.notificationsPanel.waitFor({ state: "visible", timeout: 10000 }); // Wait for the panel to appear.
  }

  async closeNotifications(): Promise<void> {
    await this.page.keyboard.press("Escape").catch(() => undefined); // Close panel with Escape if possible.
    await this.notificationsPanel.waitFor({ state: "hidden", timeout: 5000 }).catch(() => undefined); // Confirm panel closed.
  }

  async clearAllNotificationsIfPresent(): Promise<void> {
    // Try clearing twice because the tray and confirmation popup can be slow to update.
    for (let attempt = 0; attempt < 2; attempt++) {
      await this.openNotifications(); // Ensure notifications panel is open.

      const hasNotificationBadge = (await this.notificationCount.count()) > 0; // Check if badge element exists.
      const clearAllVisible = await this.clearAllButton.isVisible().catch(() => false); // Check if clear button is visible.
      if (!hasNotificationBadge && !clearAllVisible) {
        await this.closeNotifications(); // Close and exit if no notifications.
        await this.reloadAndWaitForPageReady(); // Reload to reset UI state.
        return;
      }

      if (!clearAllVisible) {
        await this.closeNotifications(); // Close if the clear action is not available.
        await this.reloadAndWaitForPageReady(); // Reload to reset UI state.
        return;
      }

      await expect(this.clearAllButton).toBeVisible({ timeout: 10000 }); // Ensure the clear button can be clicked.
      await this.clearAllButton.click(); // Click clear all.

      const confirmationVisible = await this.clearAllConfirmationButton
        .waitFor({ state: "visible", timeout: 10000 })
        .then(() => true)
        .catch(() => false); // Wait for confirmation modal.

      if (confirmationVisible) {
        await this.clearAllConfirmationButton.click(); // Confirm clearing notifications.
      }

      const cleared = await expect(this.notificationCount).toHaveCount(0, { timeout: 10000 })
        .then(() => true)
        .catch(() => false); // Verify badge count is cleared.

      await this.closeNotifications(); // Close the panel after clearing.
      await this.reloadAndWaitForPageReady(); // Reload to confirm state is stable.

      if (cleared) {
        return; // Exit once cleared successfully.
      }
    }
  }

  async waitForNotificationCount(expectedCount: string): Promise<void> {
    // Notification badge is delayed, so refresh and re-check a few times before failing.
    for (let attempt = 0; attempt < 5; attempt++) {
      await this.reloadAndWaitForPageReady(); // Refresh to force badge update.

      const isBadgeVisible = await this.notificationCount.isVisible().catch(() => false); // Check if badge is visible.
      if (isBadgeVisible) {
        await expect(this.notificationCount).toHaveText(expectedCount, { timeout: 10000 }); // Validate badge count.
        return;
      }
    }

    throw new Error(`Notification count was not visible with value "${expectedCount}" after 5 refresh attempts.`); // Fail with context.
  }

  async getLatestNotificationTimestamp(): Promise<string> {
    await this.notificationTimestamp.waitFor({ state: "visible", timeout: 10000 }); // Wait for timestamp to appear.
    return (await this.notificationTimestamp.textContent())?.trim() ?? ""; // Return trimmed timestamp text.
  }

  private async reloadAndWaitForPageReady(): Promise<void> {
    await this.page.reload({ waitUntil: "domcontentloaded" }); // Reload page to force UI refresh.
    await this.waitForPageReady(); // Wait for app to be interactive again.
  }

  private async waitForPageReady(): Promise<void> {
    // Wait for the navbar notification icon so the page is ready for the next action.
    await this.page.waitForLoadState("domcontentloaded"); // DOM is ready.
    await this.page.waitForLoadState("load").catch(() => undefined); // Assets are loaded if possible.
    await this.page.waitForLoadState("networkidle", { timeout: 5000 }).catch(() => undefined); // Wait for network to settle.
    await expect(this.notificationIcon).toBeVisible({ timeout: 10000 }); // Confirm the icon is ready.
  }
}
