import { defineConfig, devices } from "@playwright/test";
import "dotenv/config";

export default defineConfig({
  testDir: "./tests",

  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,

  reporter: [["list"]],

  use: {
    trace: "on-first-retry",
    testIdAttribute: "data-test-id",
    screenshot: "only-on-failure",
  },

  webServer: [
    {
      command: "pnpm --filter @repo/web dev",
      url: "http://localhost:3001",
      reuseExistingServer: true,
      timeout: 120_000,
    },
    {
      command: "pnpm --filter @repo/admin dev",
      url: "http://localhost:3002",
      reuseExistingServer: true,
      timeout: 120_000,
    },
  ],

  projects: [
    {
      name: "admin",
      testDir: "./tests/admin",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://localhost:3002",
      },
    },
    {
      name: "web",
      testDir: "./tests/web",
      testMatch: /.*\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://localhost:3001",
      },
    },
  ],
});