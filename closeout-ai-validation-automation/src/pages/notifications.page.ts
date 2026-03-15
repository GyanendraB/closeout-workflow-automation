import { expect, Locator, Page } from "@playwright/test";

export class NotificationsPage {
  readonly page: Page;
  readonly notificationIcon: Locator;
  readonly notificationCount: Locator;
  readonly notificationsPanel: Locator;
  readonly clearAllButton: Locator;
  readonly clearAllConfirmationButton: Locator;
  readonly notificationTimestamp: Locator;
  readonly notificationEntry: Locator;

  constructor(page: Page) {
    this.page = page;
    this.notificationIcon = page.locator("img[alt='notifications']").first();
    this.notificationCount = page.locator("jhi-notifications-panel span.notification-count").first();
    this.notificationsPanel = page.locator("div.notifications.properties-panel").first();
    this.clearAllButton = this.notificationsPanel.getByRole("button", { name: /^clear all$/i }).first();
    this.clearAllConfirmationButton = page.getByRole("button", { name: /^clear all$/i }).last();
    this.notificationTimestamp = this.notificationsPanel.locator("span.text-gray").first();
    this.notificationEntry = this.notificationsPanel.locator("span.text-gray, p, .notification-count").first();
  }

  async openNotifications(): Promise<void> {
    if (await this.notificationsPanel.isVisible().catch(() => false)) {
      return;
    }

    await this.waitForPageReady();
    await this.notificationIcon.click();
    await this.notificationsPanel.waitFor({ state: "visible", timeout: 10000 });
  }

  async closeNotifications(): Promise<void> {
    await this.page.keyboard.press("Escape").catch(() => undefined);
    await this.notificationsPanel.waitFor({ state: "hidden", timeout: 5000 }).catch(() => undefined);
  }

  async clearAllNotificationsIfPresent(): Promise<void> {
    for (let attempt = 0; attempt < 2; attempt++) {
      await this.openNotifications();

      const hasNotificationBadge = (await this.notificationCount.count()) > 0;
      const clearAllVisible = await this.clearAllButton.isVisible().catch(() => false);
      if (!hasNotificationBadge && !clearAllVisible) {
        await this.closeNotifications();
        await this.reloadAndWaitForPageReady();
        return;
      }

      if (!clearAllVisible) {
        await this.closeNotifications();
        await this.reloadAndWaitForPageReady();
        return;
      }

      await expect(this.clearAllButton).toBeVisible({ timeout: 10000 });
      await this.clearAllButton.click();

      const confirmationVisible = await this.clearAllConfirmationButton
        .waitFor({ state: "visible", timeout: 10000 })
        .then(() => true)
        .catch(() => false);

      if (confirmationVisible) {
        await this.clearAllConfirmationButton.click();
      }

      const cleared = await expect(this.notificationCount).toHaveCount(0, { timeout: 10000 })
        .then(() => true)
        .catch(() => false);

      await this.closeNotifications();
      await this.reloadAndWaitForPageReady();

      if (cleared) {
        return;
      }
    }
  }

  async waitForNotificationCount(expectedCount: string): Promise<void> {
    for (let attempt = 0; attempt < 5; attempt++) {
      await this.reloadAndWaitForPageReady();

      const isBadgeVisible = await this.notificationCount.isVisible().catch(() => false);
      if (isBadgeVisible) {
        await expect(this.notificationCount).toHaveText(expectedCount, { timeout: 10000 });
        return;
      }
    }

    throw new Error(`Notification count was not visible with value "${expectedCount}" after 5 refresh attempts.`);
  }

  async getLatestNotificationTimestamp(): Promise<string> {
    await this.notificationTimestamp.waitFor({ state: "visible", timeout: 10000 });
    return (await this.notificationTimestamp.textContent())?.trim() ?? "";
  }

  private async reloadAndWaitForPageReady(): Promise<void> {
    await this.page.reload({ waitUntil: "domcontentloaded" });
    await this.waitForPageReady();
  }

  private async waitForPageReady(): Promise<void> {
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.waitForLoadState("load").catch(() => undefined);
    await this.page.waitForLoadState("networkidle", { timeout: 5000 }).catch(() => undefined);
    await expect(this.notificationIcon).toBeVisible({ timeout: 10000 });
  }
}
