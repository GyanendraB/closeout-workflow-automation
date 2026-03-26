import { defineConfig } from "@playwright/test"; // Playwright helper that validates and types the config object.
import { env } from "./src/config/env"; // Centralized environment values, including the base URL.

export default defineConfig({
  testDir: "./tests",        // Root folder for test files so Playwright can discover them.
  testMatch: "**/*.spec.ts", // Convention to keep only spec files as runnable tests.
  testIgnore: [
    "**/node_modules/**", // Skip dependencies that may include test-like files.
    "**/dist/**", // Skip build output folders.
    "**/reports/**", // Avoid treating reports as tests.
    "**/test-results/**" // Avoid treating artifacts as tests.
  ],
  fullyParallel: false, // Keep serial execution to reduce flakiness in shared environments.
  workers: 1, // Force single worker for deterministic UI behavior.
  retries: 0, // Fail fast so CI exposes issues immediately.
  reporter: [
    ["list"], // Console-friendly reporter for quick feedback.
    ["html", { outputFolder: "reports/playwright-report", open: "never" }], // Save HTML report without auto-opening.
    ["allure-playwright", { resultsDir: "allure-results" }] // Generate Allure results for richer reporting.
  ],
  timeout: 50000, // Global test timeout to keep runs bounded.
  outputDir: "test-results", // Central location for screenshots, traces, and videos.
  use: {
    baseURL: env.baseUrl, // Base URL for all `page.goto()` calls.
    viewport: null, // Use the browser window size instead of a fixed viewport.
    trace: "retain-on-failure", // Keep traces only for failed tests to save space.
    screenshot: "on", // Capture screenshots for each test.
    video: "retain-on-failure" // Keep videos only when a test fails.
  },
  projects: [
    {
      name: "chromium", // Run tests in Chromium by default.
      use: {
        browserName: "chromium", // Explicitly set the engine.
        viewport: null, // Maximize to match real user screen size.
        launchOptions: {
          args: ["--start-maximized"] // Start window maximized for consistent layout.
        }
      }
    }
  ]
});
