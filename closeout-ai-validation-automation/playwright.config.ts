import { defineConfig } from "@playwright/test";
import { env } from "./src/config/env";

export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.ts",
  testIgnore: [
    "**/node_modules/**",
    "**/dist/**",
    "**/reports/**",
    "**/test-results/**"
  ],
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [
    ["list"],
    ["html", { outputFolder: "reports/playwright-report", open: "never" }],
    ["allure-playwright", { resultsDir: "allure-results" }]
  ],
  timeout: 30000,
  outputDir: "test-results",
  use: {
    baseURL: env.baseUrl,
    viewport: null,
    trace: "retain-on-failure",
    screenshot: "on",
    video: "retain-on-failure"
  },
  projects: [
    {
      name: "chromium",
      use: {
        browserName: "chromium",
        viewport: null,
        launchOptions: {
          args: ["--start-maximized"]
        }
      }
    }
  ]
});

