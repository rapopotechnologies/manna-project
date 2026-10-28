import { expect, test } from "@playwright/test";

test.describe("Indonesian device, first visit", () => {
  test.use({ timezoneId: "Asia/Jakarta", locale: "en-US" });

  test("goes to the Indonesian page", async ({ page }) => {
    await page.goto("/daily");
    await expect(page).toHaveURL(/\/id\/daily$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "id");
  });

  test("choosing English sticks", async ({ page }) => {
    await page.goto("/id");
    await page.locator('.lang-switch a[hreflang="en"]').click();
    await expect(page).toHaveURL(/\/$/);
    await page.goto("/kids");
    await expect(page).toHaveURL(/\/kids$/);
  });
});

test.describe("Indonesian language setting, elsewhere", () => {
  test.use({ timezoneId: "Europe/London", locale: "id-ID" });

  test("goes to the Indonesian page", async ({ page }) => {
    await page.goto("/shop");
    await expect(page).toHaveURL(/\/id\/shop$/);
  });
});

test.describe("English device", () => {
  test.use({ timezoneId: "America/Los_Angeles", locale: "en-US" });

  test("stays in English, and the switch leads to the same page in Indonesian", async ({ page }) => {
    await page.goto("/about");
    await expect(page).toHaveURL(/\/about$/);
    await expect(page.locator('.lang-switch a[hreflang="id"]')).toHaveAttribute("href", "/id/about");
  });
});
