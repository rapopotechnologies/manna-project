import AxeBuilder from "@axe-core/playwright";
import { expect, type Page } from "@playwright/test";

/**
 * Sign-in pages need Supabase. Locally .env.local provides it; in CI it comes from the repository
 * variables NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, and without them those tests skip.
 */
export const noSupabaseInCi = Boolean(process.env.CI) && !process.env.NEXT_PUBLIC_SUPABASE_URL;

/** Pretend the visitor already picked a language, so the Indonesian-device redirect stays out of the way. */
export async function chooseLanguage(page: Page, lang: "en" | "id" = "en") {
  await page.addInitScript((l) => {
    try {
      localStorage.setItem("manna:lang", l);
    } catch {}
  }, lang);
}

/** Collects uncaught page errors so a test can assert there were none. */
export function watchErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  return errors;
}

/** WCAG 2 A/AA check of the current page. */
export async function expectAccessible(page: Page) {
  const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
  expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
}
