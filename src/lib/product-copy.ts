import type { Product } from "@/data/products";
import type { Lang } from "@/i18n/lang";

/** A product's words in the page's language, field by field (empty Indonesian fields show the English). */
export function productCopy(p: Product, lang: Lang) {
  const id = lang === "id" ? p.id : undefined;
  return {
    name: id?.name || p.name,
    blurb: id?.blurb || p.blurb,
    description: id?.description || p.description,
    includes: id?.includes?.length ? id.includes : p.includes,
    details: id?.details?.length ? id.details : p.details,
    /** For lang="…" on the text, so screen readers pronounce it right. */
    lang: (id?.description ? "id" : "en") as Lang,
  };
}

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const idr = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

export const formatUsd = (n: number) => usd.format(n);
/** "Rp45.000" (no space, as Shopee writes it). */
export const formatIdr = (n: number) => idr.format(n).replace(/\s/g, "");

/** The price to show on a card: rupiah on the Indonesian site, dollars on the English one, else whichever exists. */
export function cardPrice(p: Product, lang: Lang): string | null {
  if (lang === "id") return p.priceIdr != null ? formatIdr(p.priceIdr) : p.priceUsd != null ? formatUsd(p.priceUsd) : null;
  return p.priceUsd != null ? formatUsd(p.priceUsd) : p.priceIdr != null ? formatIdr(p.priceIdr) : null;
}
