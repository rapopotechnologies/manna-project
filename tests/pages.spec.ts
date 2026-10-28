import { expect, test } from "@playwright/test";
import { chooseLanguage, expectAccessible, noSupabaseInCi, watchErrors } from "./helpers";

// Every public page, in both languages: loads, has its own heading, no errors, accessible.
const PAGES = ["/", "/daily", "/kids", "/shop", "/shop/bible-reading-tracker", "/about", "/contact", "/support", "/privacy", "/my-manna", "/account", "/found", "/found/1corinthians_13"];

for (const lang of ["en", "id"] as const) {
  for (const path of PAGES) {
    const url = lang === "id" ? (path === "/" ? "/id" : `/id${path}`) : path;
    test(`${url} works`, async ({ page }, info) => {
      test.skip(path === "/account" && noSupabaseInCi, "needs Supabase");
      await chooseLanguage(page, lang);
      const errors = watchErrors(page);
      const res = await page.goto(url);
      expect(res?.status()).toBe(200);
      await expect(page.locator("html")).toHaveAttribute("lang", lang);
      await expect(page.locator("h1").first()).toBeVisible();
      if (info.project.name === "desktop") await expectAccessible(page);
      expect(errors).toEqual([]);
    });
  }
}

test("unknown pages show a not-found page in the right language", async ({ page }) => {
  await chooseLanguage(page, "id");
  expect((await page.goto("/id/no-such-page"))?.status()).toBe(404);
  await expect(page.locator("h1")).toContainText("direnovasi");
  expect((await page.goto("/no-such-page"))?.status()).toBe(404);
  await expect(page.locator("h1")).toContainText("renovation");
});
