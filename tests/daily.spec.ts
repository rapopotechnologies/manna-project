import { expect, test, type Page } from "@playwright/test";
import { chooseLanguage, watchErrors } from "./helpers";

/** The verse window the reader can see, and the day it's for. */
async function visibleVerse(page: Page) {
  const windows = page.locator('[data-day-group="verse"]').filter({ has: page.locator(".window") });
  const visible = windows.locator("visible=true");
  await expect(visible).toHaveCount(1);
  return { el: visible.first(), day: await visible.first().getAttribute("data-for-day") };
}

/** What the page should show: the reader's own date, or the nearest date the page has. */
async function expectedDay(page: Page) {
  return page.evaluate(() => {
    const local = document.documentElement.dataset.day ?? "";
    const days = [...document.querySelectorAll('[data-day-group="verse"]')].map((e) => e.getAttribute("data-for-day") ?? "").sort();
    if (days.includes(local)) return local;
    if (local > days[days.length - 1]) return days[days.length - 1];
    return days.filter((d) => d <= local).pop() ?? days[0];
  });
}

for (const timezoneId of ["Asia/Jakarta", "America/Los_Angeles", "Pacific/Kiritimati"]) {
  test.describe(`in ${timezoneId}`, () => {
    test.use({ timezoneId });

    test("shows exactly one verse, for the reader's own day", async ({ page }) => {
      await chooseLanguage(page);
      const errors = watchErrors(page);
      await page.goto("/daily");
      const { day } = await visibleVerse(page);
      expect(day).toBe(await expectedDay(page));
      expect(errors).toEqual([]);
    });
  });
}

test("sharing sits in a tray behind one quiet button", async ({ page }) => {
  await chooseLanguage(page);
  await page.goto("/daily");
  const { el } = await visibleVerse(page);
  const toggle = el.locator(".share-toggle");
  const tray = el.locator(".share-tray");
  await expect(tray).toBeHidden();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.click();
  await expect(tray).toBeVisible();
  await expect(tray.locator(".btn")).toHaveCount(5);
  const wa = await tray.locator("a.btn-wa").getAttribute("href");
  expect(wa).toMatch(/^https:\/\/wa\.me\/\?text=/);
  expect(decodeURIComponent(wa!)).toContain("bymannaproject.com/daily");
  await expect(el.locator(".quiet-link", { hasText: /chapter/i })).toHaveAttribute("target", "_blank");
});

test("the Indonesian page links to the Terjemahan Baru and keeps the NIV a tap away", async ({ page }) => {
  await chooseLanguage(page, "id");
  await page.goto("/id/daily");
  const { el } = await visibleVerse(page);
  await expect(el.locator('a.quiet-link[href*="bible.com/bible/306/"]')).toBeVisible();
  await expect(el.locator(".verse-ref")).toContainText("·");
  // With YouVersion configured the verse is TSI and the NIV sits behind a toggle; without it, the NIV shows.
  const tsi = (await el.locator(".verse-ref").textContent())?.includes("TSI");
  if (tsi) await expect(el.locator(".verse-niv summary")).toBeVisible();
  await el.locator(".share-toggle").click();
  const wa = decodeURIComponent((await el.locator("a.btn-wa").getAttribute("href")) ?? "");
  expect(wa).toContain("bymannaproject.com/id/daily");
});

test("share images render in both languages", async ({ request }) => {
  for (const url of ["/daily/card", "/daily/card?format=story&lang=id", "/kids/card?lang=id", "/found/1corinthians_13/card?format=landscape"]) {
    const res = await request.get(url);
    expect(res.status(), url).toBe(200);
    expect(res.headers()["content-type"]).toBe("image/png");
  }
});
