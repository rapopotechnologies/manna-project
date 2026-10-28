import { expect, test } from "@playwright/test";
import { chooseLanguage, noSupabaseInCi, watchErrors } from "./helpers";

test.describe("Manna Kids", () => {
  test.use({ timezoneId: "Asia/Jakarta" });

  test("the question is translated on the Indonesian page", async ({ page }) => {
    await chooseLanguage(page);
    await page.goto("/kids");
    const en = await page.locator(".kids-question").locator("visible=true").first().textContent();
    await page.goto("/id/kids");
    const id = await page.locator(".kids-question").locator("visible=true").first().textContent();
    expect(id).toBeTruthy();
    expect(id).not.toBe(en);
  });

  test("the drawing pad offers WhatsApp and Instagram", async ({ page }) => {
    await chooseLanguage(page);
    const errors = watchErrors(page);
    await page.goto("/kids");
    await expect(page.locator(".doodle .btn-wa")).toBeVisible();
    await expect(page.locator(".doodle .btn-instagram")).toBeVisible();
    await page.locator(".doodle .btn-wa").click();
    await expect(page.locator(".doodle .toast")).toContainText(/draw something/i);
    expect(errors).toEqual([]);
  });
});

test("the shop names its categories in Indonesian", async ({ page }) => {
  await chooseLanguage(page, "id");
  await page.goto("/id/shop");
  await expect(page.locator(".jump-chip").first()).toBeVisible();
  await expect(page.locator(".jump")).toContainText(/Jurnal|Planner|Pembatas buku|Stiker/);
  await expect(page.locator(".product a.product-link").first()).toHaveAttribute("href", /^\/id\/shop\//);
});

test("sign-up shows the privacy note, sign-in doesn't", async ({ page }) => {
  test.skip(noSupabaseInCi, "needs Supabase");
  await chooseLanguage(page);
  await page.goto("/account");
  await expect(page.locator(".auth-fine")).toHaveCount(0);
  await page.getByRole("tab", { name: "Create account" }).click();
  await expect(page.locator(".auth-fine a")).toHaveAttribute("href", "/privacy");
});

test("the admin asks for sign-in", async ({ page }) => {
  test.skip(noSupabaseInCi, "needs Supabase");
  await page.goto("/admin/qr");
  await expect(page).toHaveURL(/\/admin\/login$/);
});

test("a broken reminder link says so, and turns nothing off", async ({ page, request }) => {
  await chooseLanguage(page);
  await page.goto("/reminders/off");
  await expect(page.locator("h1")).toContainText("didn’t work");
  expect((await request.post("/api/reminders/unsubscribe?u=someone&t=wrong")).status()).toBe(400);
  expect((await request.post("/api/reminders")).status()).toBe(401);
});

test("QR scans tidy the address after counting", async ({ page }) => {
  await chooseLanguage(page);
  await page.goto("/shop/bible-reading-tracker?src=qr");
  await expect(page).toHaveURL(/\/shop\/bible-reading-tracker$/);
});
