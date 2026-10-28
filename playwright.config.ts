import { defineConfig, devices } from "@playwright/test";

// End-to-end tests against a production build: `npm run build && npm test`.
// Locally they use your installed Chrome; CI installs Chromium (see .github/workflows/tests.yml).
const PORT = 3100;
// Installed Chrome locally; Playwright's Chromium in CI. PW_CHANNEL overrides (e.g. PW_CHANNEL=chrome).
const channel = process.env.PW_CHANNEL ?? (process.env.CI ? undefined : "chrome");

export default defineConfig({
  testDir: "tests",
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    channel,
    trace: "retain-on-failure",
  },
  projects: [
    { name: "unit", testMatch: /unit\/.*\.spec\.ts/ },
    { name: "phone", testIgnore: /unit\//, use: { ...devices["Pixel 7"], channel } },
    { name: "desktop", testIgnore: /unit\//, use: { ...devices["Desktop Chrome"], channel } },
  ],
  webServer: {
    command: `npm run start -- -p ${PORT}`,
    port: PORT,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
