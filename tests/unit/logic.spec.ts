import { expect, test } from "@playwright/test";
import { referenceId, tbUrl, tsiChapterUrl, usfmFor } from "@/data/bible-id";
import type { Product } from "@/data/products";
import { langOf, localPath, stripLang } from "@/i18n/lang";
import { cardPrice, formatIdr, productCopy } from "@/lib/product-copy";
import { addDays, pickDay, possibleLocalDays } from "@/lib/reader-day";

test.describe("reader's day", () => {
  test("adds days across months and years", () => {
    expect(addDays("2026-10-31", 1)).toBe("2026-11-01");
    expect(addDays("2027-01-01", -1)).toBe("2026-12-31");
  });

  test("shows the reader's own day, or the nearest one there is", () => {
    const days = ["2026-10-27", "2026-10-28"];
    expect(pickDay("2026-10-27", days)).toBe("2026-10-27");
    expect(pickDay("2026-10-29", days)).toBe("2026-10-28"); // ahead of the newest verse (e.g. Kiritimati)
    expect(pickDay("2026-10-26", days)).toBe("2026-10-27");
  });

  test("covers yesterday through tomorrow around a UTC date", () => {
    const local = possibleLocalDays("2026-10-28");
    expect(local).toContain("2026-10-27");
    expect(local).toContain("2026-10-28");
  });
});

test.describe("languages", () => {
  test("maps paths between English and Indonesian", () => {
    expect(localPath("id", "/")).toBe("/id");
    expect(localPath("id", "/daily")).toBe("/id/daily");
    expect(localPath("en", "/daily")).toBe("/daily");
    expect(stripLang("/id/shop/x")).toBe("/shop/x");
    expect(stripLang("/id")).toBe("/");
    expect(stripLang("/identity")).toBe("/identity");
    expect(langOf("/id/kids")).toBe("id");
    expect(langOf("/idea")).toBe("en");
  });
});

test.describe("Bible references", () => {
  test("translates book names", () => {
    expect(referenceId("2 Corinthians 10:17-18")).toBe("2 Korintus 10:17-18");
    expect(referenceId("Song of Solomon 2:4")).toBe("Kidung Agung 2:4");
    expect(referenceId("Psalm 23:1")).toBe("Mazmur 23:1");
    expect(referenceId("Not a book 1:1")).toBe("Not a book 1:1");
  });

  test("builds Bible.com codes and links", () => {
    expect(usfmFor("Galatians 1:10")).toEqual({ passage: "GAL.1.10", chapter: "GAL.1" });
    expect(usfmFor("1 Corinthians 13")).toEqual({ passage: "1CO.13", chapter: "1CO.13" });
    expect(tbUrl("2 Corinthians 10:17-18")).toBe("https://www.bible.com/bible/306/2CO.10.17-18.TB");
    expect(tsiChapterUrl("John 3:16")).toBe("https://www.bible.com/bible/320/JHN.3.TSI");
  });
});

test.describe("product copy and prices", () => {
  const base: Product = {
    slug: "x",
    name: "Floral Stickers",
    category: "Stickers",
    blurb: "English blurb",
    description: "English description",
    includes: ["one"],
    details: [{ label: "Format", value: "PNG" }],
    pairsWith: [],
    etsyUrl: "https://www.etsy.com/listing/1",
    images: [{ src: "/a.jpg", alt: "a" }],
  };

  test("uses Indonesian field by field, falling back to English", () => {
    const p = { ...base, id: { name: "Stiker Bunga", description: "Deskripsi" } };
    const c = productCopy(p, "id");
    expect(c.name).toBe("Stiker Bunga");
    expect(c.blurb).toBe("English blurb");
    expect(c.lang).toBe("id");
    expect(productCopy(p, "en").name).toBe("Floral Stickers");
  });

  test("shows rupiah on the Indonesian site and dollars on the English one", () => {
    const p = { ...base, priceUsd: 4.5, priceIdr: 45000 };
    expect(formatIdr(45000)).toBe("Rp45.000");
    expect(cardPrice(p, "en")).toBe("$4.50");
    expect(cardPrice(p, "id")).toBe("Rp45.000");
    expect(cardPrice({ ...base, priceUsd: 3 }, "id")).toBe("$3.00");
    expect(cardPrice(base, "en")).toBeNull();
  });
});
